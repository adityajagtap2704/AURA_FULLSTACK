export interface Attendee {
  email?: string;
  displayName?: string;
  responseStatus?: string;
}

export interface Event {
  id: string;
  tenant_id: string;
  title: string;
  start_time: string;
  end_time: string | null;
  attendees: Attendee[] | null;
  source: string;
  source_id: string;
  created_at: string;
  updated_at: string;
  description?: string | null;
  color?: string | null;
  reminder?: string | null;
  meeting_link?: string | null;
}

export interface Message {
  id: string;
  tenant_id: string;
  sender: string;
  subject: string | null;
  snippet: string;
  flagged: boolean;
  source: string;
  source_id: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  tenant_id: string;
  title: string;
  status: string | null;
  priority?: string | null;
  description?: string | null;
  assignee?: string | null;
  labels?: string[] | null;
  due_date: string | null;
  source: string;
  source_id: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  tenant_id: string;
  title: string;
  url: string | null;
  last_modified: string | null;
  source: string;
  source_id: string;
  created_at: string;
  updated_at: string;
}

export interface SyncJob {
  id: string;
  tenant_id: string;
  connector: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  items_synced: number | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  tasks: Task[];
  events: Event[];
  messages: Message[];
  documents: Document[];
  syncJobs: SyncJob[];
  stats: {
    totalTasks: number;
    totalEvents: number;
    totalMessages: number;
    totalDocuments: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}
