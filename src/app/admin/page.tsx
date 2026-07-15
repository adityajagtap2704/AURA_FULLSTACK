'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface TokenStatus {
  provider: string;
  user_id: string;
  access_token: boolean;
  refresh_token: boolean;
  expires_at: string | null;
  created_at: string;
}

export default function AdminPage() {
  const [tokens, setTokens] = useState<TokenStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const checkTokens = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/check-tokens');
      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (error) {
      console.error('Error checking tokens:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkTokens();
  }, [checkTokens]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Admin Dashboard
        </h1>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            OAuth Tokens Status
          </h2>
          
          {loading ? (
            <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
          ) : tokens.length === 0 ? (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded">
              ❌ No OAuth tokens found. Please authorize Google first.
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token, index) => (
                <div key={index} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded">
                  <p>✅ <strong>Provider:</strong> {token.provider}</p>
                  <p><strong>User ID:</strong> {token.user_id}</p>
                  <p><strong>Has Access Token:</strong> {token.access_token ? 'Yes' : 'No'}</p>
                  <p><strong>Has Refresh Token:</strong> {token.refresh_token ? 'Yes' : 'No'}</p>
                  <p><strong>Expires At:</strong> {token.expires_at ? new Date(token.expires_at).toLocaleString() : 'N/A'}</p>
                  <p><strong>Created:</strong> {new Date(token.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={checkTokens}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            🔄 Refresh Status
          </button>
          
          <Link
            href="/"
            className="bg-zinc-600 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
