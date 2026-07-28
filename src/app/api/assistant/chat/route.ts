import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Groups the user's real synced data into a short, factual block the model
// is instructed to answer from — same "don't invent what isn't there"
// guardrail the daily digest already follows (aiml/nlp/guardrails.py).
async function buildContext(tenantId: string): Promise<string> {
  const now = new Date();
  const todayStr = now.toDateString();

  const [{ data: tasks }, { data: events }, { data: messages }, { data: documents }] = await Promise.all([
    supabaseServer.from('tasks').select('title, status, due_date').eq('tenant_id', tenantId).order('due_date', { ascending: true }).limit(20),
    supabaseServer.from('events').select('title, start_time, source').eq('tenant_id', tenantId).order('start_time', { ascending: true }).limit(20),
    supabaseServer.from('messages').select('subject, sender, flagged, created_at').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(10),
    supabaseServer.from('documents').select('title, last_modified').eq('tenant_id', tenantId).order('last_modified', { ascending: false }).limit(10),
  ]);

  const tasksDueToday = (tasks || []).filter((t) => t.due_date && new Date(t.due_date).toDateString() === todayStr);
  const pendingTasks = (tasks || []).filter((t) => t.status !== 'Done');
  const eventsToday = (events || [])
    .filter((e): e is typeof e & { start_time: string } => Boolean(e.start_time) && new Date(e.start_time!).toDateString() === todayStr)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  const flaggedMessages = (messages || []).filter((m) => m.flagged);

  const lines = [
    `Today's date: ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
    '',
    `Tasks due today (${tasksDueToday.length}):`,
    ...(tasksDueToday.length ? tasksDueToday.map((t) => `- ${t.title} (${t.status || 'no status'})`) : ['- none']),
    '',
    `Pending tasks overall (${pendingTasks.length}):`,
    ...(pendingTasks.length ? pendingTasks.slice(0, 10).map((t) => `- ${t.title}`) : ['- none']),
    '',
    `Events today (${eventsToday.length}):`,
    ...(eventsToday.length
      ? eventsToday.map((e) => `- ${e.title} at ${new Date(e.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`)
      : ['- none']),
    '',
    `Unread/flagged messages (${flaggedMessages.length} flagged out of ${(messages || []).length} recent):`,
    ...((messages || []).length ? (messages || []).slice(0, 5).map((m) => `- From ${m.sender}: "${m.subject || '(no subject)'}"${m.flagged ? ' [flagged]' : ''}`) : ['- none']),
    '',
    `Recently updated documents (${(documents || []).length}):`,
    ...((documents || []).length ? (documents || []).slice(0, 5).map((d) => `- ${d.title}`) : ['- none']),
  ];

  return lines.join('\n');
}

const SYSTEM_PROMPT = `You are AURA's AI assistant, embedded in a productivity dashboard. You answer questions about the user's tasks, calendar events, messages, and documents using ONLY the "User data" block you are given — never invent tasks, meetings, people, or numbers that aren't in it. If the answer isn't in the provided data, say so plainly instead of guessing. Keep replies short (2-5 sentences or a brief bullet list), friendly, and directly useful.`;

async function callGemini(systemPrompt: string, history: ChatMessage[], message: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const contents = [
      ...history.map((h) => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
        }),
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('').trim();
    return text || null;
  } catch (err) {
    console.error('[AI Assistant] Gemini call failed:', err);
    return null;
  }
}

async function callGroq(systemPrompt: string, history: ChatMessage[], message: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.map((h) => ({ role: h.role, content: h.content })),
          { role: 'user', content: message },
        ],
        temperature: 0.4,
        max_tokens: 400,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch (err) {
    console.error('[AI Assistant] Groq call failed:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);
    const body = await request.json();
    const message: string = (body?.message || '').trim();
    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history.slice(-10) : [];

    if (!message) {
      return NextResponse.json({ error: 'A message is required.' }, { status: 400 });
    }

    const context = await buildContext(tenantId);
    const systemPrompt = `${SYSTEM_PROMPT}\n\nUser data:\n${context}`;

    let reply = await callGemini(systemPrompt, history, message);
    if (!reply) reply = await callGroq(systemPrompt, history, message);

    if (!reply) {
      reply =
        "I can't reach the AI service right now, so I can't generate a full answer — but your synced data is up to date and visible across Tasks, Calendar, Messages, and Documents. Try again in a moment.";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[AI Assistant] Chat error:', error);
    return NextResponse.json({ error: 'Failed to generate a reply.' }, { status: 500 });
  }
}
