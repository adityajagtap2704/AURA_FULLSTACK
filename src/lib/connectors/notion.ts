import { Client } from '@notionhq/client';
import {
  ConnectorInterface,
  CanonicalData,
  SyncResult,
  CanonicalTask,
  CanonicalDocument
} from './base';
import { syncQueue } from '@/lib/queue';

interface NotionRichText {
  plain_text?: string;
}

interface NotionTitleProperty {
  title?: NotionRichText[];
}

interface NotionStatusProperty {
  status?: { name?: string };
  select?: { name?: string };
}

interface NotionDateProperty {
  date?: { start?: string };
}

interface NotionDatabaseItem {
  id: string;
  properties: {
    Name?: NotionTitleProperty;
    Title?: NotionTitleProperty;
    Status?: NotionStatusProperty;
    'Due Date'?: NotionDateProperty;
    Date?: NotionDateProperty;
  };
}

interface NotionPage {
  id: string;
  url?: string;
  last_edited_time?: string;
  properties?: {
    title?: NotionTitleProperty;
    Name?: NotionTitleProperty;
  };
}

interface NotionFetchResult {
  databaseItems: NotionDatabaseItem[];
  pages: NotionPage[];
}

export class NotionConnector implements ConnectorInterface {
  private notion: Client;

  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  async authorize(userId: string): Promise<{ authUrl: string }> {
    // For Phase 1, using internal integration token (no OAuth flow needed)
    // Phase 2 can implement OAuth: https://developers.notion.com/docs/authorization
    return { authUrl: '' };
  }

  async handleCallback(code: string, userId: string): Promise<void> {
    // Not needed for Phase 1 (using internal integration)
    // Phase 2: implement OAuth token exchange
  }

  async fetch(userId: string): Promise<NotionFetchResult> {
    const databaseId = process.env.NOTION_DATABASE_ID!;

    // Query database
    const response = await this.notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        status: {
          does_not_equal: 'Done',
        },
      },
    });

    // Fetch recent pages (documents)
    const searchResponse = await this.notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
      page_size: 20,
    });

    return {
      databaseItems: response.results as unknown as NotionDatabaseItem[],
      pages: searchResponse.results as unknown as NotionPage[],
    };
  }

  async mapToCanonical(rawData: unknown, tenantId: string): Promise<CanonicalData> {
    const { databaseItems, pages } = rawData as NotionFetchResult;

    const tasks: CanonicalTask[] = databaseItems.map((item) => {
      // Extract title from properties
      let title = 'Untitled';
      if (item.properties.Name?.title?.[0]?.plain_text) {
        title = item.properties.Name.title[0].plain_text;
      } else if (item.properties.Title?.title?.[0]?.plain_text) {
        title = item.properties.Title.title[0].plain_text;
      }

      // Extract status
      let status: string | undefined;
      if (item.properties.Status?.status?.name) {
        status = item.properties.Status.status.name;
      } else if (item.properties.Status?.select?.name) {
        status = item.properties.Status.select.name;
      }

      // Extract due date
      let dueDate: string | undefined;
      if (item.properties['Due Date']?.date?.start) {
        dueDate = item.properties['Due Date'].date.start;
      } else if (item.properties.Date?.date?.start) {
        dueDate = item.properties.Date.date.start;
      }

      return {
        title,
        status,
        due_date: dueDate,
        source: 'notion',
        source_id: item.id,
      };
    });

    const documents: CanonicalDocument[] = pages.map((page) => {
      // Extract title
      let title = 'Untitled';
      if (page.properties?.title?.title?.[0]?.plain_text) {
        title = page.properties.title.title[0].plain_text as string;
      } else if (page.properties?.Name?.title?.[0]?.plain_text) {
        title = page.properties.Name.title[0].plain_text as string;
      }

      return {
        title,
        url: page.url,
        last_modified: page.last_edited_time,
        source: 'notion',
        source_id: page.id,
      };
    });

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
    // Phase 1 uses a single internal integration token shared by all users
    // (see authorize()), so there's no per-user token to revoke here.
    // Phase 2 OAuth will store per-user tokens in oauth_tokens and this
    // should delete that row, mirroring GoogleConnector.disconnect().
  }

  async healthCheck(userId: string): Promise<{ status: 'healthy' | 'unhealthy'; message?: string }> {
    try {
      // Test API connection by fetching user info
      const response = await this.notion.users.me({});
      
      if (response) {
        return { status: 'healthy' };
      }

      return { status: 'unhealthy', message: 'Unable to connect to Notion API' };
    } catch (error) {
      return { status: 'unhealthy', message: (error as Error).message };
    }
  }
}
