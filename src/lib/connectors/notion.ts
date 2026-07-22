import { Client } from '@notionhq/client';
import {
  ConnectorInterface,
  CanonicalData,
  SyncResult,
  CanonicalTask,
  CanonicalDocument
} from './base';
import { syncQueue } from '@/lib/queue';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

type OAuthTokenRow = Database['public']['Tables']['oauth_tokens']['Row'];

const NOTION_OAUTH_AUTHORIZE_URL = 'https://api.notion.com/v1/oauth/authorize';
const NOTION_OAUTH_TOKEN_URL = 'https://api.notion.com/v1/oauth/token';

// Keyed by Notion's `type` discriminator, not by property name — a
// database's title property is guaranteed to exist exactly once, but the
// user can name it (and any status/date property) anything they want, so
// matching by name (the old approach) breaks the moment someone's column
// isn't literally called "Name"/"Status"/"Due Date".
interface NotionPropertyValue {
  type: string;
  title?: { plain_text?: string }[];
  status?: { name?: string };
  select?: { name?: string };
  date?: { start?: string };
}

interface NotionDatabaseItem {
  id: string;
  properties: Record<string, NotionPropertyValue>;
}

interface NotionPage {
  id: string;
  url?: string;
  last_edited_time?: string;
  properties?: Record<string, NotionPropertyValue>;
}

function findTitle(properties: Record<string, NotionPropertyValue> | undefined): string {
  for (const prop of Object.values(properties || {})) {
    if (prop.type === 'title' && prop.title?.[0]?.plain_text) {
      return prop.title[0].plain_text;
    }
  }
  return 'Untitled';
}

function findStatus(properties: Record<string, NotionPropertyValue>): string | undefined {
  for (const prop of Object.values(properties)) {
    if (prop.type === 'status' && prop.status?.name) return prop.status.name;
    if (prop.type === 'select' && prop.select?.name) return prop.select.name;
  }
  return undefined;
}

function findDueDate(properties: Record<string, NotionPropertyValue>): string | undefined {
  for (const prop of Object.values(properties)) {
    if (prop.type === 'date' && prop.date?.start) return prop.date.start;
  }
  return undefined;
}

interface NotionFetchResult {
  databaseItems: NotionDatabaseItem[];
  pages: NotionPage[];
}

interface NotionTokenResponse {
  access_token: string;
  workspace_id?: string;
  workspace_name?: string;
}

export class NotionConnector implements ConnectorInterface {
  /**
   * `userId` here is actually the caller's already-signed state string — the
   * API route signs it before calling this, mirroring GoogleConnector, so
   * the callback can verify who initiated the flow without a session header.
   */
  async authorize(userId: string): Promise<{ authUrl: string }> {
    const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
    const redirectUri = process.env.NOTION_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      throw new Error('NOTION_OAUTH_CLIENT_ID / NOTION_REDIRECT_URI are not configured');
    }

    const url = new URL(NOTION_OAUTH_AUTHORIZE_URL);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('owner', 'user');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', userId);

    return { authUrl: url.toString() };
  }

  async handleCallback(code: string, userId: string): Promise<void> {
    const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
    const clientSecret = process.env.NOTION_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.NOTION_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Notion OAuth is not configured');
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(NOTION_OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Notion token exchange failed: ${response.status} ${errorBody}`);
    }

    const tokens = (await response.json()) as NotionTokenResponse;

    const { error } = await supabaseServer.from('oauth_tokens').upsert(
      {
        user_id: userId,
        provider: 'notion',
        access_token: tokens.access_token,
        refresh_token: null,
        expires_at: null,
      },
      { onConflict: 'user_id,provider' }
    );

    if (error) throw error;
  }

  private async getClientForUser(userId: string): Promise<Client> {
    const { data: tokenData, error } = await supabaseServer
      .from('oauth_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'notion')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !tokenData || tokenData.length === 0) {
      throw new Error('No Notion OAuth tokens found for user');
    }

    const token = tokenData[0] as OAuthTokenRow;
    return new Client({ auth: token.access_token });
  }

  async fetch(userId: string): Promise<NotionFetchResult> {
    const notion = await this.getClientForUser(userId);

    // Only databases/pages the user explicitly shared during the OAuth
    // consent screen are visible to this token. Take the first shared
    // database as the Tasks source — same "pulls one connected DB" design
    // as Phase 1's original shared-token version, just scoped per-user now.
    const dbSearch = await notion.search({
      filter: { property: 'object', value: 'database' },
      page_size: 5,
    });

    let databaseItems: NotionDatabaseItem[] = [];
    const firstDb = dbSearch.results[0];
    if (firstDb) {
      // No status filter here — unlike the old fixed demo database, we
      // can't assume an arbitrary user's database has a "Status" property
      // at all, let alone one shaped like Notion's status/select type.
      const dbResponse = await notion.databases.query({
        database_id: firstDb.id,
        page_size: 50,
      });
      databaseItems = dbResponse.results as unknown as NotionDatabaseItem[];
    }

    const pageSearch = await notion.search({
      filter: { property: 'object', value: 'page' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      page_size: 20,
    });

    return {
      databaseItems,
      pages: pageSearch.results as unknown as NotionPage[],
    };
  }

  async mapToCanonical(rawData: unknown, tenantId: string): Promise<CanonicalData> {
    const { databaseItems, pages } = rawData as NotionFetchResult;

    const tasks: CanonicalTask[] = databaseItems.map((item) => ({
      title: findTitle(item.properties),
      status: findStatus(item.properties),
      due_date: findDueDate(item.properties),
      source: 'notion',
      source_id: item.id,
    }));

    const documents: CanonicalDocument[] = pages.map((page) => ({
      title: findTitle(page.properties),
      url: page.url,
      last_modified: page.last_edited_time,
      source: 'notion',
      source_id: page.id,
    }));

    return {
      tasks,
      events: [],
      messages: [],
      documents,
    };
  }

  async sync(userId: string, tenantId: string): Promise<SyncResult> {
    // Add sync job to queue
    await syncQueue.add('notion-sync', {
      userId,
      tenantId,
      connector: 'notion',
    });

    return {
      success: true,
      itemsSynced: 0, // Will be updated by queue worker
    };
  }

  async disconnect(userId: string): Promise<void> {
    const { error } = await supabaseServer
      .from('oauth_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('provider', 'notion');

    if (error) throw error;
  }

  async healthCheck(userId: string): Promise<{ status: 'healthy' | 'unhealthy'; message?: string }> {
    try {
      const notion = await this.getClientForUser(userId);
      const response = await notion.users.me({});

      if (response) {
        return { status: 'healthy' };
      }

      return { status: 'unhealthy', message: 'Unable to connect to Notion API' };
    } catch (error) {
      return { status: 'unhealthy', message: (error as Error).message };
    }
  }
}
