'use client';
import Image from "next/image";
import { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/hooks/useDashboard';
import { Mail, Search, Star, AlertCircle, RefreshCw, ChevronRight, Inbox, Eye, Link2 } from 'lucide-react';

export default function GmailPage() {
  const { data, isLoading, isError, refetch, syncGoogle, isSyncingGoogle, connectorStatus, isLoadingConnectorStatus } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  if (isLoading || isLoadingConnectorStatus) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-card border border-border rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError || !data || !connectorStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-danger mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load messages</h2>
        <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Retry</button>
      </div>
    );
  }

  const googleConnected = connectorStatus.google;

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
  if (!dateString) return "";

  const date = new Date(dateString);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Today → show time
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // Yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Older than yesterday
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
const avatarColors = [
  "#3f3a3a", // Red
  "#4285F4", // Blue
  "#34A853", // Green
  "#FBBC05", // Yellow
  "#A142F4", // Purple
  "#EC407A", // Pink
  "#FF7043", // Orange
  "#00ACC1", // Cyan
  "#5C6BC0", // Indigo
];

const getAvatarColor = (sender: string) => {
  let hash = 0;

  for (let i = 0; i < sender.length; i++) {
    hash = sender.charCodeAt(i) + ((hash << 5) - hash);
  }

  return avatarColors[Math.abs(hash) % avatarColors.length];
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <img
              src="/icons/gmail.png"
              alt="Gmail"
              width={28}
              height={28}
            />
            Gmail Messages
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse starred and recent messages synchronized from your Gmail inbox.
          </p>
        </div>

        {googleConnected ? (
          <button
            onClick={() => syncGoogle()}
            disabled={isSyncingGoogle}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent/95 transition-all self-start shadow shadow-accent/10"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
            Sync Gmail
          </button>
        ) : (
          <Link
            href="/dashboard/integrations"
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent/95 transition-all self-start shadow shadow-accent/10"
          >
            <Link2 className="h-3.5 w-3.5" />
            Connect Google
          </Link>
        )}
      </div>

     {/* Gmail Search */}
<div className="bg-card rounded-2xl border border-border px-5 py-4">
  <div className="relative max-w-xl">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

    <input
      type="text"
      placeholder="Search mail"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="
      w-full
      h-12
      rounded-full
      bg-muted
      pl-12
      pr-5
      outline-none
      text-sm
      text-foreground
      placeholder:text-muted-foreground
      focus:ring-2
      focus:ring-primary/30
      transition-all
      "
    />
  </div>
</div>

      {/* Split Inbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Messages list */}
<div
  className={`${
    activeMessageId
      ? "lg:col-span-2 hidden lg:block"
      : "lg:col-span-5"
  } bg-card border border-border rounded-2xl overflow-hidden`}
>
  {filteredMessages.length > 0 ? (
    filteredMessages.map((msg) => (
      <div
        key={msg.id}
        onClick={() => setActiveMessageId(msg.id)}
        className={`
          flex items-center
          h-[72px]
          px-5
          border-b border-border
          cursor-pointer
          transition-all duration-200
          ${
            activeMessageId === msg.id
              ? "bg-primary/10"
              : "hover:bg-muted hover:shadow-sm"
          }
        `}
      >

        {/* Avatar */}
       <div
  style={{ backgroundColor: getAvatarColor(msg.sender) }}
  className="
    w-10
    h-10
    rounded-full
    flex
    items-center
    justify-center
    text-white
    font-semibold
    text-sm
    shadow-sm
    mr-4
    shrink-0
  "
>
  {msg.sender.charAt(0).toUpperCase()}
</div>

        {/* Sender */}
        <div
          className="
            w-[180px]
            shrink-0
            truncate
            text-[14px]
            font-medium
            text-foreground
          "
        >
          {msg.sender}
        </div>

     {/* Subject */}
<div className="flex-1 truncate px-6">
  <p className="text-[14px] font-medium text-foreground truncate">
    {msg.subject || "(No Subject)"}
  </p>
</div>

        {/* Date */}
        <div
          className="
            ml-6
            w-[90px]
            shrink-0
            text-right
            text-xs
            font-medium
            text-muted-foreground
          "
        >
          {formatDate(msg.created_at)}
        </div>
      </div>
    ))
  ) : (
    <div className="flex flex-col items-center justify-center py-24">
      <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />

      <h3 className="text-lg font-semibold text-foreground">
        You're all caught up!
      </h3>

      <p className="text-sm text-muted-foreground mt-2">
        No messages match your search.
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
