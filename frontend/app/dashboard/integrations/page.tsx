// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useQueryClient } from '@tanstack/react-query';
// import { useDashboard } from '@/hooks/useDashboard';
// import { authService } from '@/services/auth';
// import { Link2, Globe, FileText, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

// export default function IntegrationsPage() {
//   const {
//     isLoading,
//     isError,
//     refetch,
//     syncGoogle,
//     isSyncingGoogle,
//     syncNotion,
//     isSyncingNotion,
//     connectorStatus,
//     isLoadingConnectorStatus,
//   } = useDashboard();
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [notionLoading, setNotionLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const handledRedirect = useRef(false);

//   // The OAuth callback only exchanges/stores the token — it doesn't sync any
//   // data. Landing here with ?connected=<provider> means authorization just
//   // succeeded, so refresh the (now stale) connector-status cache and kick
//   // off the first sync automatically instead of leaving the card stuck on
//   // "Not Configured" until the user notices and clicks Sync Now themselves.
//   useEffect(() => {
//     if (handledRedirect.current) return;
//     const connected = searchParams.get('connected');
//     const oauthError = searchParams.get('error');

//     if (connected === 'google') {
//       handledRedirect.current = true;
//       queryClient.invalidateQueries({ queryKey: ['connectorStatus'] });
//       syncGoogle();
//       router.replace('/dashboard/integrations');
//     } else if (connected === 'notion') {
//       handledRedirect.current = true;
//       queryClient.invalidateQueries({ queryKey: ['connectorStatus'] });
//       syncNotion();
//       router.replace('/dashboard/integrations');
//     } else if (oauthError) {
//       handledRedirect.current = true;
//       setError(`Authorization failed: ${oauthError}`);
//       router.replace('/dashboard/integrations');
//     }
//   }, [searchParams, syncGoogle, syncNotion, router, queryClient]);

//   if (isLoading || isLoadingConnectorStatus) {
//     return (
//       <div className="space-y-6">
//         <div className="h-10 w-48 bg-muted rounded animate-pulse" />
//         <div className="h-64 bg-card border border-border rounded-xl animate-pulse" />
//       </div>
//     );
//   }

//   if (isError || !connectorStatus) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <AlertCircle className="h-12 w-12 text-danger mb-4" />
//         <h2 className="text-xl font-bold text-foreground mb-2">Failed to load integrations status</h2>
//         <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Retry</button>
//       </div>
//     );
//   }

//   // Source of truth is whether a token exists, not whether any data happens
//   // to be synced — stale rows from a prior connection would otherwise read
//   // as "connected" even with no valid token.
//   const { google: googleConnected, notion: notionConnected } = connectorStatus;

//   const handleGoogleConnect = async () => {
//     setGoogleLoading(true);
//     setError(null);
//     try {
//       const authUrl = await authService.getGoogleAuthUrl();
//       if (authUrl) {
//         window.location.href = authUrl;
//       } else {
//         throw new Error('Failed to retrieve authorization URL');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || err.message || 'Google OAuth failed to initiate');
//       setGoogleLoading(false);
//     }
//   };

//   const handleNotionConnect = async () => {
//     setNotionLoading(true);
//     setError(null);
//     try {
//       const authUrl = await authService.getNotionAuthUrl();
//       if (authUrl) {
//         window.location.href = authUrl;
//       } else {
//         throw new Error('Failed to retrieve authorization URL');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || err.message || 'Notion OAuth failed to initiate');
//       setNotionLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
//           <Link2 className="h-6 w-6 text-primary" /> Connected Integrations
//         </h1>
//         <p className="text-muted-foreground text-sm mt-1">
//           Manage integrations and connections to external productivity tools.
//         </p>
//       </div>

//       {error && (
//         <div className="flex items-center gap-3 rounded-lg bg-danger/10 p-4 text-sm text-danger border border-danger/20">
//           <AlertCircle className="h-5 w-5 shrink-0" />
//           <span>{error}</span>
//         </div>
//       )}

//       {/* Connectors cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Google Workspace */}
//         <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:border-primary/20 transition-all">
//           <div className="space-y-4">
//             <div className="flex justify-between items-start">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
//                 <Globe className="h-6 w-6" />
//               </div>
//               <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${
//                 googleConnected 
//                   ? 'bg-success/10 text-success border-success/20' 
//                   : 'bg-muted text-muted-foreground border-border'
//               }`}>
//                 {googleConnected ? 'Connected' : 'Not Configured'}
//               </span>
//             </div>

//             <div className="space-y-1">
//               <h3 className="text-base font-bold text-foreground">Google Workspace</h3>
//               <p className="text-xs text-muted-foreground leading-relaxed">
//                 Connect your Google Calendar and Gmail inbox to sync calendar schedules and starred email notifications directly to AURA.
//               </p>
//             </div>

//             {googleConnected && (
//               <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border">
//                 <CheckCircle2 className="h-4 w-4 text-success" />
//                 <span>Synchronizing Google Calendar & Gmail star status.</span>
//               </div>
//             )}
//           </div>

//           <div className="flex gap-2">
//             {googleConnected ? (
//               <button
//                 onClick={() => syncGoogle()}
//                 disabled={isSyncingGoogle}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all"
//               >
//                 <RefreshCw className={`h-3.5 w-3.5 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
//                 Sync Now
//               </button>
//             ) : (
//               <button
//                 onClick={handleGoogleConnect}
//                 disabled={googleLoading}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all shadow shadow-primary/10"
//               >
//                 {googleLoading ? (
//                   <RefreshCw className="h-3.5 w-3.5 animate-spin" />
//                 ) : (
//                   'Authorize Google Workspace'
//                 )}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Notion */}
//         <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:border-primary/20 transition-all">
//           <div className="space-y-4">
//             <div className="flex justify-between items-start">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
//                 <FileText className="h-6 w-6" />
//               </div>
//               <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${
//                 notionConnected 
//                   ? 'bg-success/10 text-success border-success/20' 
//                   : 'bg-muted text-muted-foreground border-border'
//               }`}>
//                 {notionConnected ? 'Connected' : 'Not Configured'}
//               </span>
//             </div>

//             <div className="space-y-1">
//               <h3 className="text-base font-bold text-foreground">Notion Workspace</h3>
//               <p className="text-xs text-muted-foreground leading-relaxed">
//                 Connect your Notion workspace databases to synchronize project tasks, action items, pages, and reference documents.
//               </p>
//             </div>

//             {notionConnected && (
//               <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border">
//                 <CheckCircle2 className="h-4 w-4 text-success" />
//                 <span>Synchronizing tasks and recent workspace pages.</span>
//               </div>
//             )}
//           </div>

//           <div className="flex gap-2">
//             {notionConnected ? (
//               <button
//                 onClick={() => syncNotion()}
//                 disabled={isSyncingNotion}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all"
//               >
//                 <RefreshCw className={`h-3.5 w-3.5 ${isSyncingNotion ? 'animate-spin' : ''}`} />
//                 Sync Now
//               </button>
//             ) : (
//               <button
//                 onClick={handleNotionConnect}
//                 disabled={notionLoading}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all shadow shadow-primary/10"
//               >
//                 {notionLoading ? (
//                   <RefreshCw className="h-3.5 w-3.5 animate-spin" />
//                 ) : (
//                   'Connect Notion Workspace'
//                 )}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useDashboard } from '@/hooks/useDashboard';
import { authService } from '@/services/auth';
import { Link2, Globe, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

function IntegrationsContent() {
  const {
    isLoading,
    isError,
    refetch,
    syncGoogle,
    isSyncingGoogle,
    syncNotion,
    isSyncingNotion,
    connectorStatus,
    isLoadingConnectorStatus,
  } = useDashboard();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [notionLoading, setNotionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const handledRedirect = useRef(false);

  // The OAuth callback only exchanges/stores the token — it doesn't sync any
  // data. Landing here with ?connected=<provider> means authorization just
  // succeeded, so refresh the (now stale) connector-status cache and kick
  // off the first sync automatically instead of leaving the card stuck on
  // "Not Configured" until the user notices and clicks Sync Now themselves.
  useEffect(() => {
    if (handledRedirect.current) return;
    const connected = searchParams.get('connected');
    const oauthError = searchParams.get('error');

    if (connected === 'google') {
      handledRedirect.current = true;
      queryClient.invalidateQueries({ queryKey: ['connectorStatus'] });
      syncGoogle();
      router.replace('/dashboard/integrations');
    } else if (connected === 'notion') {
      handledRedirect.current = true;
      queryClient.invalidateQueries({ queryKey: ['connectorStatus'] });
      syncNotion();
      router.replace('/dashboard/integrations');
    } else if (oauthError) {
      handledRedirect.current = true;
      setError(`Authorization failed: ${oauthError}`);
      router.replace('/dashboard/integrations');
    }
  }, [searchParams, syncGoogle, syncNotion, router, queryClient]);

  if (isLoading || isLoadingConnectorStatus) {
    return <IntegrationsLoadingSkeleton />;
  }

  if (isError || !connectorStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-danger mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load integrations status</h2>
        <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Retry</button>
      </div>
    );
  }

  // Source of truth is whether a token exists, not whether any data happens
  // to be synced — stale rows from a prior connection would otherwise read
  // as "connected" even with no valid token.
  const { google: googleConnected, notion: notionConnected } = connectorStatus;

  const handleGoogleConnect = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const authUrl = await authService.getGoogleAuthUrl();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error('Failed to retrieve authorization URL');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Google OAuth failed to initiate');
      setGoogleLoading(false);
    }
  };

  const handleNotionConnect = async () => {
    setNotionLoading(true);
    setError(null);
    try {
      const authUrl = await authService.getNotionAuthUrl();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error('Failed to retrieve authorization URL');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Notion OAuth failed to initiate');
      setNotionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Link2 className="h-6 w-6 text-primary" /> Connected Integrations
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage integrations and connections to external productivity tools.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-danger/10 p-4 text-sm text-danger border border-danger/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Connectors cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Workspace */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:border-primary/20 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Globe className="h-6 w-6" />
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${
                googleConnected 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-muted text-muted-foreground border-border'
              }`}>
                {googleConnected ? 'Connected' : 'Not Configured'}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Google Workspace</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your Google Calendar and Gmail inbox to sync calendar schedules and starred email notifications directly to AURA.
              </p>
            </div>

            {googleConnected && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Synchronizing Google Calendar & Gmail star status.</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {googleConnected ? (
              <button
                onClick={() => syncGoogle()}
                disabled={isSyncingGoogle}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
                Sync Now
              </button>
            ) : (
              <button
                onClick={handleGoogleConnect}
                disabled={googleLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all shadow shadow-primary/10"
              >
                {googleLoading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  'Authorize Google Workspace'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Notion */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:border-primary/20 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <FileText className="h-6 w-6" />
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${
                notionConnected 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-muted text-muted-foreground border-border'
              }`}>
                {notionConnected ? 'Connected' : 'Not Configured'}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Notion Workspace</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your Notion workspace databases to synchronize project tasks, action items, pages, and reference documents.
              </p>
            </div>

            {notionConnected && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Synchronizing tasks and recent workspace pages.</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {notionConnected ? (
              <button
                onClick={() => syncNotion()}
                disabled={isSyncingNotion}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncingNotion ? 'animate-spin' : ''}`} />
                Sync Now
              </button>
            ) : (
              <button
                onClick={handleNotionConnect}
                disabled={notionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all shadow shadow-primary/10"
              >
                {notionLoading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  'Connect Notion Workspace'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Loading Skeleton for initial hydration & suspense fallback
function IntegrationsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-muted rounded animate-pulse" />
      <div className="h-64 bg-card border border-border rounded-xl animate-pulse" />
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<IntegrationsLoadingSkeleton />}>
      <IntegrationsContent />
    </Suspense>
  );
}
