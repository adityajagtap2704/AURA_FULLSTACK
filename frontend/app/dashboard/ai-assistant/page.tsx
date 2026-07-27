'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getDisplayName } from '@/lib/userDisplay';
import { AuraLogoIcon } from '@/components/icons/ServiceIcons';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Sparkles, RotateCcw, ChevronsRight, Copy, Check, AlertCircle } from 'lucide-react';

const QUICK_PROMPTS = ['Summarize my day', 'What are my top priorities?', 'What meetings do I have today?'];

export default function AIAssistantPage() {
  const { user } = useAuth();
  const userName = getDisplayName(user);
  const { messages, sendMessage, isSending, error, newChat } = useAIAssistant(userName);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const autoSent = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Lets the AI Digest page's "Ask AI" box hand off a question here.
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !autoSent.current) {
      autoSent.current = true;
      sendMessage(q);
    }
  }, [searchParams, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> AI Assistant
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Ask about your tasks, calendar, messages, and documents.</p>
      </div>

      <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <span className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> AI Assistant
          </span>
          <button
            onClick={newChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" /> New Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}>
              {m.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <AuraLogoIcon className="h-4.5 w-4.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                {m.content}
                {m.role === 'assistant' && m.id !== 'welcome' && (
                  <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-3">
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedId === m.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedId === m.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start gap-2.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <AuraLogoIcon className="h-4.5 w-4.5 text-primary animate-pulse" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick prompts — only before the conversation starts */}
        {messages.length === 1 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-1.5 rounded-full border border-border bg-background text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t border-border">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isSending}
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white hover:bg-primary/95 transition-all disabled:opacity-50 shrink-0"
          >
            <ChevronsRight className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
