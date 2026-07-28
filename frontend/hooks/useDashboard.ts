import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { DashboardData } from '@/types';

interface ConnectorStatus {
  google: boolean;
  notion: boolean;
}

export function useDashboard() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/api/dashboard');
      return response.data;
    },
    refetchInterval: 30000, // background refresh every 30 seconds
  });

  // Whether a connector is "connected" is whether a token exists — not
  // whether any data happens to be synced (stale rows from a previous
  // connection, or a sync that hasn't run yet, would give a false answer).
  const connectorStatusQuery = useQuery<ConnectorStatus>({
    queryKey: ['connectorStatus'],
    queryFn: async () => {
      const response = await api.get('/api/connectors/status');
      return response.data;
    },
    staleTime: 10000,
  });

  const syncGoogleMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/connectors/google/sync');
      return response.data;
    },
    onSuccess: () => {
      // Invalidate dashboard queries to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const syncNotionMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/connectors/notion/sync');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const disconnectGoogleMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/connectors/google/disconnect');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectorStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const disconnectNotionMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/connectors/notion/disconnect');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectorStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    isRefetching: dashboardQuery.isRefetching,

    connectorStatus: connectorStatusQuery.data,
    isLoadingConnectorStatus: connectorStatusQuery.isLoading,

    syncGoogle: syncGoogleMutation.mutate,
    isSyncingGoogle: syncGoogleMutation.isPending,
    googleSyncResult: syncGoogleMutation.data,

    syncNotion: syncNotionMutation.mutate,
    isSyncingNotion: syncNotionMutation.isPending,
    notionSyncResult: syncNotionMutation.data,

    disconnectGoogle: disconnectGoogleMutation.mutate,
    isDisconnectingGoogle: disconnectGoogleMutation.isPending,

    disconnectNotion: disconnectNotionMutation.mutate,
    isDisconnectingNotion: disconnectNotionMutation.isPending,
  };
}
