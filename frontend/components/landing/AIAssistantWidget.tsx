'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls, useReducedMotion, type Transition } from 'framer-motion';
import { X, Minus, Send, Mic, Sparkles, ListChecks, ShieldCheck, DollarSign, MessageCircle } from 'lucide-react';
import { AuraLogoIcon } from '@/components/icons/ServiceIcons';

/* Isolated, self-mounting floating assistant. Does not read or touch any
   surrounding page state — safe to drop in anywhere. */

const SPRING: Transition = { type: 'spring', stiffness: 180, damping: 24, mass: 0.8 };
const PANEL_SPRING: Transition = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 };

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

const QUICK_REPLIES: { icon: typeof Sparkles; label: string; answer: string }[] = [
  {
    icon: Sparkles,
    label: 'What is AURA?',
    answer: "AURA is your all-in-one AI workspace — it brings Gmail, Calendar, Notion and Meet together in one intelligent dashboard, so you can focus on what matters.",
  },
  {
    icon: ListChecks,
    label: 'How does it work?',
    answer: "Connect your tools once. AURA's AI digest, smart tasks and unified inbox keep everything organized automatically — no manual syncing required.",
  },
  {
    icon: ShieldCheck,
    label: 'Is my data secure?',
    answer: 'Yes — AURA uses secure OAuth login and encrypts your data in transit and at rest. Your data is always safe, and it is never sold.',
  },
  {
    icon: DollarSign,
    label: 'View pricing',
    answer: 'AURA has a free tier to get started, plus Pro and Team plans with advanced AI features. Head to the Pricing page for the full breakdown.',
  },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hi 👋\nI\'m Aura.\nReady to simplify your work today?',
};

const PARTICLE_OFFSETS = [
  { left: '6%', top: '14%', delay: 0 },
  { left: '86%', top: '10%', delay: 0.3 },
  { left: '10%', top: '82%', delay: 0.6 },
  { left: '84%', top: '78%', delay: 0.9 },
];

type EyeOffset = { x: number; y: number };

function RobotAvatar({
  className = 'h-16 w-16',
  speaking = false,
  excited = false,
  eyeOffset,
  waving = false,
  onWaveComplete,
  blinkSignal,
  reduceMotion,
}: {
  className?: string;
  speaking?: boolean;
  excited?: boolean;
  eyeOffset?: EyeOffset;
  waving?: boolean;
  onWaveComplete?: () => void;
  blinkSignal?: number;
  reduceMotion: boolean | null;
}) {
  const uid = useId();
  const bodyGradientId = `bot-body-${uid}`;
  const glowFilterId = `bot-glow-${uid}`;
  const bodyFill = `url(#${bodyGradientId})`;
  const glow = `url(#${glowFilterId})`;

  const blinkControls = useAnimationControls();
  const headControls = useAnimationControls();
  const shoulderControls = useAnimationControls();
  const elbowControls = useAnimationControls();
  const handControls = useAnimationControls();

  // idle blink, randomized every 3–6s
  useEffect(() => {
    if (reduceMotion) return;
    let timeoutId: number;
    const scheduleBlink = () => {
      timeoutId = window.setTimeout(() => {
        blinkControls.start({ scaleY: [1, 0.08, 1] }, { duration: 0.32, ease: 'easeInOut' });
        scheduleBlink();
      }, 3000 + Math.random() * 3000);
    };
    scheduleBlink();
    return () => window.clearTimeout(timeoutId);
  }, [reduceMotion, blinkControls]);

  // an external blink cue (e.g. on click), independent of the idle schedule above
  useEffect(() => {
    if (blinkSignal === undefined) return;
    blinkControls.start({ scaleY: [1, 0.08, 1] }, { duration: 0.28, ease: 'easeInOut' });
  }, [blinkSignal, blinkControls]);

  // choreographed greeting wave: head rotates, shoulder lifts, elbow bends, hand opens, waves x3, returns to rest
  useEffect(() => {
    if (!waving) return;
    if (reduceMotion) {
      onWaveComplete?.();
      return;
    }
    const times = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1];
    const transition = { duration: 2.2, times, ease: 'easeInOut' as const };
    headControls.start({ rotate: [0, 0, 5, 8, 6, 8, 6, 8, 6, 0] }, transition);
    shoulderControls.start({ rotate: [0, 0, -70, -110, -95, -110, -95, -110, -95, 0] }, transition);
    elbowControls.start({ rotate: [0, 0, -12, -24, -24, -24, -24, -24, -24, 0] }, transition);
    handControls
      .start({ scale: [1, 1, 1, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1] }, transition)
      .then(() => onWaveComplete?.());
  }, [waving, reduceMotion, headControls, shoulderControls, elbowControls, handControls, onWaveComplete]);

  return (
    <svg viewBox="0 0 64 74" className={className} aria-hidden>
      <defs>
        <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5EFE4" />
        </linearGradient>
        {/* soft glow behind any element referencing this filter — eyes, antenna, chest light */}
        <filter id={glowFilterId} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* narrower torso */}
      <rect x="17" y="38" width="30" height="32" rx="14" fill={bodyFill} stroke="#F0EBE3" strokeWidth="1.5" />
      <line x1="32" y1="42" x2="32" y2="64" stroke="#E5DCC8" strokeWidth="1" />

      {/* right arm — tucked flush against the torso at rest, only visible once raised for the wave */}
      <motion.g animate={shoulderControls} style={{ transformOrigin: '43px 40px' }}>
        <rect x="40" y="40" width="6" height="12" rx="3" fill={bodyFill} stroke="#F0EBE3" strokeWidth="1" />
        <motion.g animate={elbowControls} style={{ transformOrigin: '43px 52px' }}>
          <rect x="40" y="52" width="6" height="12" rx="3" fill={bodyFill} stroke="#F0EBE3" strokeWidth="1" />
          <motion.circle
            cx="43" cy="64" r="3.2" fill={bodyFill} stroke="#F0EBE3" strokeWidth="1"
            animate={handControls} style={{ transformOrigin: '43px 64px' }}
          />
        </motion.g>
      </motion.g>

      {/* chest status light — breathes at idle, pulses faster while speaking */}
      <motion.g
        animate={
          speaking
            ? { opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }
            : reduceMotion
              ? undefined
              : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.06, 1] }
        }
        transition={
          speaking
            ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ transformOrigin: '32px 54px' }}
      >
        <circle cx="32" cy="54" r="2.6" fill="none" stroke="#E8A422" strokeWidth="1.4" filter={glow} />
        <circle cx="32" cy="54" r="0.9" fill="#E8A422" />
      </motion.g>

      {/* head — ears, skull, antenna, face — rotates independently for the greeting wave and cursor-follow */}
      <motion.g animate={headControls} style={{ transformOrigin: '32px 40px' }}>
        <circle cx="6" cy="24" r="4.2" fill="#E8A422" />
        <circle cx="58" cy="24" r="4.2" fill="#E8A422" />

        <rect x="8" y="6" width="48" height="40" rx="18" fill={bodyFill} stroke="#F0EBE3" strokeWidth="1.5" />

        <line x1="32" y1="6" x2="32" y2="2" stroke="#B9AF9C" strokeWidth="2" strokeLinecap="round" />
        <motion.circle
          cx="32" cy="2" r="2.2" fill="#E8A422" filter={glow}
          animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }}
          transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 2px' }}
        />

        <rect x="17" y="16" width="30" height="20" rx="10" fill="#1F1B16" />

        {/* glow halo behind each eye, brighter when excited (hover / greeting) */}
        <motion.circle
          cx="24.5" cy="25.5" r="4.5" fill="#F5A623" filter={glow}
          initial={{ opacity: 0.22 }}
          animate={{ opacity: excited ? 0.6 : 0.22 }}
          transition={{ duration: 0.25 }}
        />
        <motion.circle
          cx="39.5" cy="25.5" r="4.5" fill="#F5A623" filter={glow}
          initial={{ opacity: 0.22 }}
          animate={{ opacity: excited ? 0.6 : 0.22 }}
          transition={{ duration: 0.25 }}
        />

        {/* eyes — cursor-tracked while hovered, ambient drift otherwise */}
        <motion.g
          animate={
            eyeOffset
              ? { x: eyeOffset.x, y: eyeOffset.y }
              : reduceMotion
                ? undefined
                : { x: [0, 1.4, -1.2, 0.6, 0], y: [0, -0.6, 0.4, -0.3, 0] }
          }
          transition={
            eyeOffset
              ? { type: 'spring', stiffness: 300, damping: 22 }
              : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <motion.ellipse
            cx="24.5" cy="25.5" rx="2.5" ry="3" fill="#F5A623" filter={glow}
            animate={blinkControls} style={{ transformOrigin: '24.5px 25.5px' }}
          />
          <motion.ellipse
            cx="39.5" cy="25.5" rx="2.5" ry="3" fill="#F5A623" filter={glow}
            animate={blinkControls} style={{ transformOrigin: '39.5px 25.5px' }}
          />
        </motion.g>

        {/* smile — stretches while speaking, widens when excited */}
        <motion.g
          animate={
            speaking
              ? { scaleY: [1, 1.9, 1, 1.5, 1], scaleX: excited ? 1.15 : 1 }
              : { scaleY: 1, scaleX: excited ? 1.15 : 1 }
          }
          transition={speaking ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
          style={{ transformOrigin: '32px 30.5px' }}
        >
          <path d="M27 29 Q32 32.5 37 29" stroke="#F5A623" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

function FloatingLauncher({ onOpen }: { onOpen: () => void }) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [cursor, setCursor] = useState<EyeOffset>({ x: 0, y: 0 });
  const [jumping, setJumping] = useState(false);
  const [blinkSignal, setBlinkSignal] = useState<number | undefined>(undefined);
  const [introSmile, setIntroSmile] = useState(false);
  const [waving, setWaving] = useState(false);

  const floatTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 4, repeat: Infinity, ease: 'easeInOut' };
  const breatheTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' };
  const glowTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' };
  const idleTiltAnimate = reduceMotion ? undefined : { rotate: [-2, 2, -2] };
  const idleTiltTransition: Transition = { duration: 6, repeat: Infinity, ease: 'easeInOut' };

  // greeting sequence on mount: smile → pop up a little larger → raise & wave the right hand → settle back down
  useEffect(() => {
    if (reduceMotion) return;
    const t1 = window.setTimeout(() => setIntroSmile(true), 300);
    const t2 = window.setTimeout(() => setWaving(true), 650);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduceMotion]);

  const handleWaveComplete = useCallback(() => {
    setWaving(false);
    setIntroSmile(false);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const clampedX = Math.max(-1, Math.min(1, dx));
    const clampedY = Math.max(-1, Math.min(1, dy));
    setCursor({ x: clampedX * 2.4, y: clampedY * 1.8 });
  };

  const handleClick = () => {
    if (reduceMotion) {
      onOpen();
      return;
    }
    setJumping(true);
    setBlinkSignal((n) => (n ?? 0) + 1);
    window.setTimeout(onOpen, 260);
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={SPRING}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
    >
      <motion.button
        type="button"
        aria-label="Open AURA Assistant"
        layoutId="aura-assistant-shell"
        onClick={handleClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => {
          setHovered(false);
          setCursor({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
        className="group relative flex h-[100px] w-[100px] items-center justify-center rounded-full cursor-pointer"
        style={{ transformOrigin: 'center' }}
      >
        {/* idle ambient glow pulse */}
        <motion.span
          aria-hidden
          className="absolute -inset-2.5 rounded-full bg-gradient-to-br from-[#FFB870]/60 via-[#FF7A29]/40 to-[#C17817]/30 blur-lg"
          animate={reduceMotion ? undefined : { opacity: [0.3, 0.55, 0.3], scale: [0.96, 1.03, 0.96] }}
          transition={glowTransition}
        />
        {/* reactive glow boost on hover */}
        <span
          aria-hidden
          className="absolute -inset-2.5 rounded-full bg-gradient-to-br from-[#FFB870]/70 via-[#FF7A29]/50 to-[#C17817]/40 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* hover particles */}
        <AnimatePresence>
          {hovered && !reduceMotion && (
            <>
              {PARTICLE_OFFSETS.map((p, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#F5A623]"
                  style={{ left: p.left, top: p.top }}
                  initial={{ opacity: 0, scale: 0.4, y: 0 }}
                  animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1, 0.4], y: -14 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* ground shadow */}
        <motion.span
          aria-hidden
          className="absolute -bottom-2 left-1/2 h-3.5 w-14 -translate-x-1/2 rounded-full bg-black/25 blur-[4px]"
          animate={reduceMotion ? undefined : { scaleX: [1, 0.75, 1], opacity: [0.3, 0.15, 0.3] }}
          transition={floatTransition}
        />

        {/* float — glass container; pops up a little larger while it greets, then settles back */}
        <motion.div
          className="relative flex h-[100px] w-[100px] items-center justify-center rounded-full border border-white/70 bg-white/55 shadow-[0_20px_44px_-10px_rgba(31,27,22,0.32),0_2px_10px_rgba(31,27,22,0.14),inset_0_1px_1px_rgba(255,255,255,0.85)] backdrop-blur-xl"
          animate={reduceMotion ? undefined : { y: [0, -6, 0], scale: waving ? 1.16 : 1 }}
          transition={{ y: floatTransition, scale: { duration: 0.45, ease: 'easeOut' } }}
        >
          {/* tilt — idle rock, or follows the cursor while hovered */}
          <motion.div
            animate={hovered ? { rotate: cursor.x * 2.2 } : idleTiltAnimate}
            transition={hovered ? { type: 'spring', stiffness: 260, damping: 20 } : idleTiltTransition}
          >
            {/* click jump */}
            <motion.div
              animate={jumping ? { y: [0, -10, 0], scale: [1, 1.06, 1] } : { y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* breathing */}
              <motion.div
                animate={reduceMotion ? undefined : { scale: [0.99, 1, 0.99] }}
                transition={breatheTransition}
              >
                <RobotAvatar
                  className="h-20 w-20"
                  excited={hovered || introSmile}
                  eyeOffset={hovered ? cursor : undefined}
                  waving={waving}
                  onWaveComplete={handleWaveComplete}
                  blinkSignal={blinkSignal}
                  reduceMotion={reduceMotion ?? false}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* notification dot */}
          <span className="absolute -top-1 -right-1">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-[#FF7A29]"
              animate={reduceMotion ? undefined : { scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6, ease: 'easeOut' }}
            />
            <motion.span
              className="relative block h-4 w-4 rounded-full bg-[#FF7A29] ring-2 ring-white"
              animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, ease: 'easeOut' }}
            />
          </span>
        </motion.div>
      </motion.button>

      {/* label pill */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.25 }}
        className="-mt-2.5 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1B16] shadow-[0_6px_16px_rgba(31,27,22,0.18)] ring-1 ring-[#F0EBE3]"
      >
        <MessageCircle className="h-3.5 w-3.5 text-[#C17817]" />
        AURA Assistant
      </motion.div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-[#F5F0E8] px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[#9B8F85]"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasUserReplied = messages.some((m) => m.role === 'user');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const respond = (userText: string, answer?: string) => {
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: userText }]);
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: answer ?? "Thanks for reaching out! Sign in and open the full AURA Assistant from your dashboard for a detailed answer.",
        },
      ]);
    }, 700);
  };

  const handleQuickReply = (item: (typeof QUICK_REPLIES)[number]) => {
    if (isTyping) return;
    respond(item.label, item.answer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (!value || isTyping) return;
    setInput('');
    respond(value);
  };

  return (
    <motion.div
      layoutId="aura-assistant-shell"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={PANEL_SPRING}
      style={{ transformOrigin: 'bottom right' }}
      className="fixed bottom-6 right-6 z-50 flex h-[min(600px,calc(100vh-3rem))] w-[calc(100vw-3rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-[#F0EBE3] bg-white shadow-[0_24px_60px_rgba(31,27,22,0.28)]"
    >
      {/* header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#C17817] to-[#A86510] px-5 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-white/50 blur-md"
              animate={
                isTyping
                  ? { opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }
                  : { opacity: 0.3, scale: 1 }
              }
              transition={isTyping ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
            />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
              <RobotAvatar className="h-6 w-6" speaking={isTyping} reduceMotion={reduceMotion ?? false} />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-white">AURA Assistant</p>
            <p className="text-xs leading-tight text-white/70">AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Minimize"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-[#FDFBF8] p-5">
        {messages.map((m) => (
          <div key={m.id} className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EDD9A3] bg-[#FDF4E7]">
                <AuraLogoIcon className="h-4 w-4 text-[#C17817]" />
              </div>
            )}
            <div
              className={`max-w-[240px] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'rounded-tr-sm bg-[#C17817] text-white'
                  : 'rounded-tl-sm bg-[#F5F0E8] text-[#1F1B16]'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EDD9A3] bg-[#FDF4E7]">
              <RobotAvatar className="h-6 w-6" speaking reduceMotion={reduceMotion ?? false} />
            </div>
            <TypingDots />
          </div>
        )}

        {!hasUserReplied && !isTyping && (
          <div className="space-y-2.5 pt-1">
            {QUICK_REPLIES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleQuickReply(item)}
                className="flex w-full items-center gap-3 rounded-xl border border-[#F0EBE3] bg-white px-4 py-3 text-left text-sm font-medium text-[#1F1B16] transition-colors hover:border-[#EDD9A3] hover:bg-[#FDF4E7]"
              >
                <item.icon className="h-4 w-4 text-[#C17817]" />
                {item.label}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* input */}
      <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-t border-[#F0EBE3] p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-full bg-[#F5F0E8] px-4 py-2.5 text-sm text-[#1F1B16] placeholder-[#9B8F85] outline-none"
        />
        <button
          type="button"
          aria-label="Voice input"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F0EBE3] text-[#C17817] transition-colors hover:bg-[#FDF4E7]"
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#C17817]/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <Mic className="relative h-4 w-4" />
        </button>
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C17817] text-white transition-colors hover:bg-[#A86510] disabled:opacity-50"
          disabled={!input.trim() || isTyping}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </motion.div>
  );
}

export default function AIAssistantWidget() {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="aura-assistant-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-[#1F1B16]/10 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ready &&
          (!isOpen ? (
            <FloatingLauncher key="launcher" onOpen={() => setIsOpen(true)} />
          ) : (
            <ChatPanel key="panel" onClose={() => setIsOpen(false)} />
          ))}
      </AnimatePresence>
    </>
  );
}
