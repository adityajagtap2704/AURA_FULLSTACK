import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export interface PriorityItem {
  id: string;
  title: string;
  item_type: 'task' | 'event' | 'message';
  source: string;
  due_date?: string | null;
  score: number;
  reason: string;
}

export interface MeetingPrepNote {
  event_id: string;
  event_title: string;
  start_time: string;
  prep_note: string;
}

export interface AIDigestData {
  summary_text: string;
  top_priorities: PriorityItem[];
  meeting_prep_notes: MeetingPrepNote[];
  ai_suggestions?: string[];
  metadata?: {
    date: string;
    guardrail_passed: boolean;
    total_tasks: number;
    total_events: number;
  };
}

export function useAIDigest() {
  const query = useQuery<AIDigestData>({
    queryKey: ['ai-digest'],
    queryFn: async () => {
      const response = await api.get('/api/digest/today');
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  return {
    digest: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
