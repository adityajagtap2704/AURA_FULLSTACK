import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { DashboardData } from '@/types';

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

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    isRefetching: dashboardQuery.isRefetching,

    syncGoogle: syncGoogleMutation.mutate,
    isSyncingGoogle: syncGoogleMutation.isPending,
    googleSyncResult: syncGoogleMutation.data,

    syncNotion: syncNotionMutation.mutate,
    isSyncingNotion: syncNotionMutation.isPending,
    notionSyncResult: syncNotionMutation.data,
  };
}
