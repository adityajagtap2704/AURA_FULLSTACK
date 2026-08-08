import axios from 'axios';
import { supabase } from '@/lib/supabase';

// Axios instance pointing to relative path. Next.js rewrite redirects this to the backend server.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor to automatically attach the current Supabase JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.warn('Could not retrieve Supabase session for API request:', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('API returned 401 Unauthorized.');
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.warn('Failed to clear session after 401:', signOutError);
      }
    }
    return Promise.reject(error);
  }
);
