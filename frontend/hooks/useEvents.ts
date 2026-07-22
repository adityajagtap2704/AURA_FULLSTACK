import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Event } from '@/types';

interface FetchEventsParams {
  start_time?: string;
  end_time?: string;
}

export function useEvents(params?: FetchEventsParams) {
  const queryClient = useQueryClient();
  const { start_time, end_time } = params || {};

  // Fetch calendar events
  const eventsQuery = useQuery<Event[]>({
    queryKey: ['events', start_time, end_time],
    queryFn: async () => {
      const response = await api.get('/api/events', {
        params: { start_time, end_time }
      });
      return response.data;
    },
    refetchInterval: 30000, // background refresh every 30 seconds
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'tenant_id' | 'source' | 'source_id' | 'created_at' | 'updated_at'>) => {
      const response = await api.post('/api/events', eventData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ...eventData }: Partial<Event> & { id: string }) => {
      const response = await api.put(`/api/events/${id}`, eventData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/events/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return {
    events: eventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
    isError: eventsQuery.isError,
    error: eventsQuery.error,
    refetch: eventsQuery.refetch,

    createEvent: createEventMutation.mutateAsync,
    isCreating: createEventMutation.isPending,

    updateEvent: updateEventMutation.mutateAsync,
    isUpdating: updateEventMutation.isPending,

    deleteEvent: deleteEventMutation.mutateAsync,
    isDeleting: deleteEventMutation.isPending,
  };
}
