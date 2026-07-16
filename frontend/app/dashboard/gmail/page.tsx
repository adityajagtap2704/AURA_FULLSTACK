'use client';

import { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Mail, Search, Star, AlertCircle, RefreshCw, ChevronRight, Inbox, Eye } from 'lucide-react';

export default function GmailPage() {
  const { data, isLoading, isError, refetch, syncGoogle, isSyncingGoogle } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-card border border-border rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-danger mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load messages</h2>
        <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Retry</button>
      </div>
    );
  }

  // Filter messages
  const filteredMessages = data.messages.filter((msg) => {
    const query = searchQuery.toLowerCase();
    const senderMatch = msg.sender.toLowerCase().includes(query);
    const subjectMatch = msg.subject?.toLowerCase().includes(query) || false;
    const snippetMatch = msg.snippet.toLowerCase().includes(query);
    return senderMatch || subjectMatch || snippetMatch;
  });

  const activeMessage = data.messages.find(m => m.id === activeMessageId) || null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Mail className="h-6 w-6 text-accent" /> Gmail Messages
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse starred and recent messages synchronized from your Gmail inbox.
          </p>
        </div>

        <button
          onClick={() => syncGoogle()}
          disabled={isSyncingGoogle}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent/95 transition-all self-start shadow shadow-accent/10"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
          Sync Gmail
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass border border-border p-4 rounded-xl flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute inset-y-0 left-0 pl-3 h-full w-4 text-muted-foreground/60 flex items-center" />
          <input
            type="text"
            placeholder="Search email thread..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-background/50 border border-border pl-9 pr-4 py-2 text-xs outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
        </div>
      </div>

      {/* Split Inbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Messages list */}
        <div className={`${activeMessageId ? 'lg:col-span-2 hidden lg:block' : 'lg:col-span-5'} space-y-2`}>
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setActiveMessageId(msg.id)}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col gap-2 shadow-sm ${
                  activeMessageId === msg.id
                    ? 'border-accent bg-accent/5 ring-1 ring-accent'
                    : 'border-border bg-card hover:border-accent/40'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="truncate max-w-[150px]">{msg.sender}</span>
                    {msg.flagged && <Star className="h-3.5 w-3.5 fill-primary text-primary shrink-0" />}
                  </div>
                  <span className="text-muted-foreground shrink-0">{formatDate(msg.created_at)}</span>
                </div>
                <h4 className="font-bold text-foreground truncate text-sm">
                  {msg.subject || '(No Subject)'}
                </h4>
                <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
                  {msg.snippet}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/20">
              <Inbox className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
              <h3 className="font-bold text-foreground">Inbox is empty</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                No Gmail messages found. Try triggering a Google Sync to fetch starred/important emails.
              </p>
            </div>
          )}
        </div>

        {/* Message preview details panel */}
        {activeMessageId && activeMessage && (
          <div className="lg:col-span-3 bg-card border border-accent/30 rounded-2xl p-6 shadow-md space-y-6 flex flex-col relative h-fit">
            {/* Close Button on Mobile / Header */}
            <div className="flex justify-between items-start gap-4 border-b border-border pb-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-foreground">
                  {activeMessage.subject || '(No Subject)'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  From: <span className="font-semibold text-foreground">{activeMessage.sender}</span>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Date: {formatDate(activeMessage.created_at)}
                </p>
              </div>
              <button
                onClick={() => setActiveMessageId(null)}
                className="px-2.5 py-1 text-[10px] font-bold bg-muted hover:bg-border border border-border rounded-lg text-foreground transition-all"
              >
                Close Preview
              </button>
            </div>

            {/* Email Body text content */}
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-line bg-muted/30 p-4 rounded-xl border border-border">
              {activeMessage.snippet}
              <p className="text-xs text-muted-foreground/80 mt-6 italic">
                (Note: Sync pulls starred, important, or recent snippets from Gmail. Full mail body resides securely in Google Workspace).
              </p>
            </div>

            {/* Actions panel */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] bg-accent/15 text-accent border border-accent/20 px-2 py-0.5 rounded uppercase font-bold">
                Source: {activeMessage.source}
              </span>
              <a
                href={`https://mail.google.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-accent font-semibold hover:underline"
              >
                View on Gmail <Eye className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
