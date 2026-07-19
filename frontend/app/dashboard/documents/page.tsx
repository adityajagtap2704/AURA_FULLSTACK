'use client';
import Image from "next/image";
import { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/hooks/useDashboard';
import { FileText, Search, ExternalLink, RefreshCw, AlertCircle, Calendar, Link2 } from 'lucide-react';

export default function DocumentsPage() {
  const { data, isLoading, isError, refetch, syncNotion, isSyncingNotion, connectorStatus, isLoadingConnectorStatus } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

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
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load documents</h2>
        <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Retry</button>
      </div>
    );
  }

  const notionConnected = connectorStatus.notion;

  // Filter documents
  const filteredDocs = data.documents.filter((doc) => {
    return doc.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Sort documents
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'date') {
      if (!a.last_modified) return 1;
      if (!b.last_modified) return -1;
      return new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Unspecified modification date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
            <Image
  src="/icons/notion.png"
  alt="Notion"
  width={26}
  height={26}
/>

Notion Documents
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Access pages and shared notes synchronized from your connected Notion integrations.
          </p>
        </div>

        {notionConnected ? (
          <button
            onClick={() => syncNotion()}
            disabled={isSyncingNotion}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all self-start shadow shadow-primary/10"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncingNotion ? 'animate-spin' : ''}`} />
            Sync Notion Documents
          </button>
        ) : (
          <Link
            href="/dashboard/integrations"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all self-start shadow shadow-primary/10"
          >
            <Link2 className="h-3.5 w-3.5" />
            Connect Notion
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="glass border border-border p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute inset-y-0 left-0 pl-3 h-full w-4 text-muted-foreground/60 flex items-center" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-background/50 border border-border pl-9 pr-4 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
          <span className="text-muted-foreground font-medium">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            className="bg-card border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary transition-all"
          >
            <option value="date">Last Modified</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {sortedDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/35 transition-all group flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="space-y-2">
               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm">
  <Image
    src="/icons/notion.png"
    alt="Notion"
    width={22}
    height={22}
  />
</div>
                <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {doc.title}
                </h4>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(doc.last_modified)}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-[9px] bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                  {doc.source}
                </span>

                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                  >
                    Open Page <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-[10px] text-muted-foreground">Local file</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/20">
          <FileText className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="font-bold text-foreground">No documents found</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
            Try adjusting your search criteria or triggering a Notion sync.
          </p>
        </div>
      )}
    </div>
  );
}
