import { google, calendar_v3, gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { supabaseServer } from '@/lib/supabase/server';
import {
  ConnectorInterface,
  CanonicalData,
  SyncResult,
  CanonicalEvent,
  CanonicalMessage
} from './base';
import { syncQueue } from '@/lib/queue';
import type { Database } from '@/lib/supabase/database.types';

type OAuthTokenRow = Database['public']['Tables']['oauth_tokens']['Row'];

interface GoogleFetchResult {
  calendarEvents: calendar_v3.Schema$Event[];
  gmailMessages: gmail_v1.Schema$Message[];
}

export class GoogleConnector implements ConnectorInterface {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  async authorize(userId: string): Promise<{ authUrl: string }> {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/gmail.readonly',
    ];

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId, // Pass userId in state for callback
      prompt: 'consent', // Force consent to get refresh token
    });

    return { authUrl };
  }

  async handleCallback(code: string, userId: string): Promise<void> {
    console.log('[Google handleCallback] Getting token with code...');
    const { tokens } = await this.oauth2Client.getToken(code);
    console.log('[Google handleCallback] Got tokens:', { 
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiryDate: tokens.expiry_date 
    });

    // Store tokens securely in database
    console.log('[Google handleCallback] Inserting into Supabase...');
    const { error } = await supabaseServer.from('oauth_tokens').upsert(
      {
        user_id: userId,
        provider: 'google',
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token || null,
        expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      },
      { onConflict: 'user_id,provider' }
    );

    if (error) {
      console.error('[Google handleCallback] Supabase error:', error);
      throw error;
    }

    console.log('[Google handleCallback] Successfully saved token to Supabase');
  }

  async fetch(userId: string): Promise<GoogleFetchResult> {
    // Get stored tokens (get the most recent one if multiple exist)
    console.log(`[Google fetch] Looking for tokens for user: ${userId}`);
    const { data: tokenData, error } = await supabaseServer
      .from('oauth_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .order('created_at', { ascending: false })
      .limit(1);

    console.log(`[Google fetch] Token query result:`, { 
      hasData: !!tokenData && tokenData.length > 0, 
      error: error?.message,
      count: tokenData?.length || 0
    });

    if (error || !tokenData || tokenData.length === 0) {
      throw new Error('No Google OAuth tokens found for user');
    }

    const token = tokenData[0] as OAuthTokenRow;

    // Set credentials
    this.oauth2Client.setCredentials({
      access_token: token.access_token,
      refresh_token: token.refresh_token || undefined,
    });

    // googleapis auto-refreshes expired access tokens using the refresh_token,
    // but only fires this event — it never persists the new token itself.
    // Without this listener, every sync after the first ~hour silently keeps
    // using a stale access_token until it's refreshed in-memory and lost again.
    this.oauth2Client.on('tokens', async (refreshed) => {
      const update: Partial<OAuthTokenRow> = {};
      if (refreshed.access_token) update.access_token = refreshed.access_token;
      if (refreshed.refresh_token) update.refresh_token = refreshed.refresh_token;
      if (refreshed.expiry_date) update.expires_at = new Date(refreshed.expiry_date).toISOString();

      if (Object.keys(update).length === 0) return;

      const { error: updateError } = await supabaseServer
        .from('oauth_tokens')
        .update(update)
        .eq('user_id', userId)
        .eq('provider', 'google');

      if (updateError) {
        console.error('[Google fetch] Failed to persist refreshed token:', updateError);
      } else {
        console.log('[Google fetch] Persisted refreshed access token');
      }
    });

    // Fetch Calendar events
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const ninetyDaysFromNow = new Date(now);
    ninetyDaysFromNow.setDate(now.getDate() + 90);

    console.log(`[Google fetch] Fetching calendar events from ${thirtyDaysAgo.toISOString()} to ${ninetyDaysFromNow.toISOString()}`);

    const calendarResponse = await calendar.events.list({
      calendarId: 'primary',
      timeMin: thirtyDaysAgo.toISOString(),
      timeMax: ninetyDaysFromNow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log(`[Google fetch] Fetched ${calendarResponse.data.items?.length || 0} calendar events`);

    // Fetch Gmail messages (starred OR important/recent)
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    
    // Try to fetch starred messages first
    let gmailResponse = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:starred',
      maxResults: 50,
    });

    // If no starred messages, fetch recent important/unread messages
    if (!gmailResponse.data.messages || gmailResponse.data.messages.length === 0) {
      console.log(`[Google fetch] No starred messages, fetching recent important messages instead`);
      gmailResponse = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:important OR is:unread',
        maxResults: 50,
      });
    }

    // If still nothing, fetch just recent messages from inbox
    if (!gmailResponse.data.messages || gmailResponse.data.messages.length === 0) {
      console.log(`[Google fetch] No important messages, fetching recent inbox messages`);
      gmailResponse = await gmail.users.messages.list({
        userId: 'me',
        q: 'in:inbox',
        maxResults: 50,
      });
    }

    console.log(`[Google fetch] Fetched ${gmailResponse.data.messages?.length || 0} messages`);

    // Fetch full message details
    const messages = [];
    if (gmailResponse.data.messages) {
      for (const msg of gmailResponse.data.messages) {
        const fullMessage = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
        });
        messages.push(fullMessage.data);
      }
    }

    console.log(`[Google fetch] Returning data: ${calendarResponse.data.items?.length || 0} events, ${messages.length} messages`);

    return {
      calendarEvents: calendarResponse.data.items || [],
      gmailMessages: messages,
    };
  }

  async mapToCanonical(rawData: unknown, tenantId: string): Promise<CanonicalData> {
    const { calendarEvents, gmailMessages } = rawData as GoogleFetchResult;

    const googleColorMap: Record<string, string> = {
      '1': 'purple', // Lavender Blue
      '2': 'green',  // Sage
      '3': 'purple', // Grape
      '4': 'pink',   // Flamingo
      '5': 'yellow', // Banana
      '6': 'orange', // Tangerine
      '7': 'blue',   // Peacock
      '8': 'grey',   // Graphite
      '9': 'blue',   // Blueberry
      '10': 'green', // Basil
      '11': 'red',   // Tomato
    };

    const events: CanonicalEvent[] = calendarEvents.map((event) => ({
      title: event.summary || 'Untitled Event',
      start_time: event.start?.dateTime || event.start?.date || undefined,
      end_time: event.end?.dateTime || event.end?.date || undefined,
      color: event.colorId ? (googleColorMap[event.colorId] || 'orange') : 'orange',
      description: event.description || undefined,
      attendees: (event.attendees || []).map((a) => ({
        email: a.email || undefined,
        displayName: a.displayName || undefined,
        responseStatus: a.responseStatus || undefined,
      })),
      source: 'google_calendar',
      source_id: event.id!,
    }));

    const messages: CanonicalMessage[] = gmailMessages.map((msg) => {
      const headers = msg.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

      // Check if message is starred
      const isStarred = msg.labelIds?.includes('STARRED') || false;

   return {
  sender: getHeader('from'),
  subject: getHeader('subject'),
  snippet: msg.snippet || '',
  flagged: isStarred,

  // ADD THIS
  created_at: msg.internalDate
    ? new Date(Number(msg.internalDate)).toISOString()
    : new Date().toISOString(),

  source: 'gmail',
  source_id: msg.id!,
};
    });

    return {
      tasks: [],
      events,
      messages,
      documents: [],
    };
  }

  async sync(userId: string, tenantId: string): Promise<SyncResult> {
    // Add sync job to queue instead of running inline
    await syncQueue.add('google-sync', {
      userId,
      tenantId,
      connector: 'google',
    });

    return {
      success: true,
      itemsSynced: 0, // Will be updated by queue worker
    };
  }

  private async getCalendarClient(userId: string): Promise<calendar_v3.Calendar | null> {
    const { data: tokenData } = await supabaseServer
      .from('oauth_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!tokenData || tokenData.length === 0) {
      return null;
    }

    const token = tokenData[0] as OAuthTokenRow;

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    client.setCredentials({
      access_token: token.access_token,
      refresh_token: token.refresh_token || undefined,
    });

    // Handle token refresh
    client.on('tokens', async (refreshed) => {
      const update: Partial<OAuthTokenRow> = {};
      if (refreshed.access_token) update.access_token = refreshed.access_token;
      if (refreshed.refresh_token) update.refresh_token = refreshed.refresh_token;
      if (refreshed.expiry_date) update.expires_at = new Date(refreshed.expiry_date).toISOString();

      await supabaseServer
        .from('oauth_tokens')
        .update(update)
        .eq('user_id', userId)
        .eq('provider', 'google');
    });

    return google.calendar({ version: 'v3', auth: client });
  }

  async createGoogleEvent(userId: string, eventData: any): Promise<string | null> {
    try {
      const calendar = await this.getCalendarClient(userId);
      if (!calendar) return null;

      const localColorToGoogleId: Record<string, string> = {
        purple: '3',
        pink: '4',
        yellow: '5',
        orange: '6',
        blue: '7',
        green: '2',
        red: '11',
        grey: '8',
      };

      const colorId = eventData.color ? (localColorToGoogleId[eventData.color] || undefined) : undefined;

      const resource = {
        summary: eventData.title,
        description: eventData.description || undefined,
        colorId: colorId,
        start: {
          dateTime: eventData.start_time,
        },
        end: {
          dateTime: eventData.end_time || eventData.start_time,
        },
        attendees: (eventData.attendees || [])
          .filter((a: any) => a.email && a.type !== 'metadata')
          .map((a: any) => ({ email: a.email })),
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: resource,
      });

      return response.data.id || null;
    } catch (err) {
      console.error('[GoogleConnector createGoogleEvent] Error:', err);
      return null;
    }
  }

  async updateGoogleEvent(userId: string, googleEventId: string, eventData: any): Promise<void> {
    try {
      const calendar = await this.getCalendarClient(userId);
      if (!calendar) return;

      const localColorToGoogleId: Record<string, string> = {
        purple: '3',
        pink: '4',
        yellow: '5',
        orange: '6',
        blue: '7',
        green: '2',
        red: '11',
        grey: '8',
      };

      const colorId = eventData.color ? (localColorToGoogleId[eventData.color] || undefined) : undefined;

      const resource = {
        summary: eventData.title,
        description: eventData.description || undefined,
        colorId: colorId,
        start: {
          dateTime: eventData.start_time,
        },
        end: {
          dateTime: eventData.end_time || eventData.start_time,
        },
        attendees: (eventData.attendees || [])
          .filter((a: any) => a.email && a.type !== 'metadata')
          .map((a: any) => ({ email: a.email })),
      };

      await calendar.events.patch({
        calendarId: 'primary',
        eventId: googleEventId,
        requestBody: resource,
      });
    } catch (err) {
      console.error('[GoogleConnector updateGoogleEvent] Error:', err);
    }
  }

  async deleteGoogleEvent(userId: string, googleEventId: string): Promise<void> {
    try {
      const calendar = await this.getCalendarClient(userId);
      if (!calendar) return;

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: googleEventId,
      });
    } catch (err) {
      console.error('[GoogleConnector deleteGoogleEvent] Error:', err);
    }
  }

  async disconnect(userId: string): Promise<void> {
    const { error } = await supabaseServer
      .from('oauth_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('provider', 'google');

    if (error) {
      throw error;
    }
  }

  async healthCheck(userId: string): Promise<{ status: 'healthy' | 'unhealthy'; message?: string }> {
    try {
      const { data: tokenData } = await supabaseServer
        .from('oauth_tokens')
        .select('*')
        .eq('user_id', userId)
        .eq('provider', 'google')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!tokenData || tokenData.length === 0) {
        return { status: 'unhealthy', message: 'No OAuth tokens found' };
      }

      const token = tokenData[0] as OAuthTokenRow;

      // Check if token is expired
      if (token.expires_at && new Date(token.expires_at) < new Date()) {
        return { status: 'unhealthy', message: 'Access token expired' };
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', message: (error as Error).message };
    }
  }
}


