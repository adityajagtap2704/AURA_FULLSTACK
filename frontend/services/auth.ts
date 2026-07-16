import { api } from './api';
import { supabase } from '@/lib/supabase';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/api/auth/login', { email, password });
    const { session } = response.data;
    
    if (session) {
      // Sync with client-side Supabase instance
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    }
    return response.data;
  },

  async signup(email: string, password: string) {
    const response = await api.post('/api/auth/signup', { email, password });
    const { session } = response.data;
    
    if (session) {
      // Sync with client-side Supabase instance
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    }
    return response.data;
  },

  async logout() {
    await api.post('/api/auth/logout');
    // Clear client-side Supabase session
    await supabase.auth.signOut();
  },

  async getGoogleAuthUrl() {
    // Queries the backend OAuth authorize endpoint
    const response = await api.get('/api/connectors/google/authorize');
    return response.data.authUrl as string;
  },

  async checkTokens() {
    const response = await api.get('/api/admin/check-tokens');
    return response.data.tokens;
  }
};
