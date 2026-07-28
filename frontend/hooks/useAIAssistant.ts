import { useState, useCallback } from 'react';
import { api } from '@/services/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE = (name: string): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: `Hi${name ? ` ${name}` : ''}! I'm your AI assistant. Ask me about your tasks, meetings, messages, or documents — I'll answer using your real synced data.`,
});

export function useAIAssistant(userName: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE(userName)]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    setError(null);
    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await api.post(
        '/api/assistant/chat',
        { message: trimmed, history },
        { timeout: 30000 },
      );
      const reply: string = response.data?.reply || "Sorry, I couldn't generate a reply.";
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: reply }]);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to reach the AI assistant.');
    } finally {
      setIsSending(false);
    }
  }, [messages, isSending]);

  const newChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE(userName)]);
    setError(null);
  }, [userName]);

  return { messages, sendMessage, isSending, error, newChat };
}
