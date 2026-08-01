'use client';

import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react';
import {
  ArrowRight,
  CheckCircle,
  LayoutGrid,
  Link2,
  ListChecks,
  Lock,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const STEPS: { n: string; icon: Icon; title: string; desc: string }[] = [
  { n: '01', icon: Link2, title: 'Connect your tools', desc: 'One-click OAuth with all major apps and services.' },
  { n: '02', icon: RefreshCw, title: 'We sync your data securely', desc: 'Real-time sync across all your connected tools.' },
  { n: '03', icon: Sparkles, title: 'AI organizes everything', desc: 'Smart summaries and priority queues daily.' },
  { n: '04', icon: CheckCircle, title: 'You get clarity and get things done', desc: 'Start every day with a clear action plan.' },
];

const STATS: { icon: Icon; value: string; label: string; desc: string }[] = [
  { icon: LayoutGrid, value: '4+', label: 'Connected Apps', desc: 'All your favorite tools in one place.' },
  { icon: Lock, value: '100%', label: 'Secure & Private', desc: 'Enterprise-grade security and encryption.' },
  { icon: ListChecks, value: '1', label: 'Unified Dashboard', desc: 'Everything you need, organized for you.' },
  { icon: RefreshCw, value: '24/7', label: 'Smart Sync', desc: "Real-time updates so you're always ready." },
];

function GmailLogo({ className }: { className?: string }) {
  return <svg viewBox="0 0 48 36" className={className} aria-hidden="true"><path d="M4.5 4.5h39a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3h-39a3 3 0 0 1-3-3v-21a3 3 0 0 1 3-3z" fill="#fff" /><path d="M4.5 4.5h4.9L24 17 39.1 4.5H44a3 3 0 0 1 3 3v1.2L24 27 1.5 8.7V7.5a3 3 0 0 1 3-3z" fill="#EA4335" /><path d="M1.5 8.7v19.8a3 3 0 0 0 3 3h4V13.5z" fill="#4285F4" /><path d="M39.5 13.5v18h4a3 3 0 0 0 3-3V8.7z" fill="#34A853" /><path d="m8.5 13.5L24 25.5l15.5-12v18h-31z" fill="#FBBC05" /></svg>;
}
function CalendarLogo({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><rect x="2" y="3" width="20" height="19" rx="3" fill="#fff" stroke="#dadce0" /><path d="M2 7a4 4 0 0 1 4-4h5v6H2z" fill="#1A73E8" /><path d="M13 3h5a4 4 0 0 1 4 4v2h-9z" fill="#EA4335" /><path d="M2 9h9v7H2z" fill="#FBBC05" /><path d="M13 9h9v7h-9z" fill="#34A853" /><text x="12" y="20" fill="#3c4043" fontSize="6.5" fontWeight="700" textAnchor="middle">31</text></svg>;
}
function SlackLogo({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M9 2.5a2 2 0 1 0 0 4h2v-2a2 2 0 0 0-2-2zM9 8.5H4a2 2 0 1 0 0 4h5a2 2 0 0 0 0-4z" fill="#36C5F0"/><path d="M21.5 9a2 2 0 1 0-4 0v2h2a2 2 0 0 0 2-2zM15.5 9V4a2 2 0 1 0-4 0v5a2 2 0 0 0 4 0z" fill="#2EB67D"/><path d="M15 21.5a2 2 0 1 0 0-4h-2v2a2 2 0 0 0 2 2zM15 15.5h5a2 2 0 1 0 0-4h-5a2 2 0 0 0 0 4z" fill="#ECB22E"/><path d="M2.5 15a2 2 0 1 0 4 0v-2h-2a2 2 0 0 0-2 2zM8.5 15v5a2 2 0 1 0 4 0v-5a2 2 0 0 0-4 0z" fill="#E01E5A"/></svg>;
}
function NotionLogo({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="#191919" aria-hidden="true"><path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2.5 4v12h2.5V8.5L15 18h2.5V6H15v9.5L9 6H6.5z"/></svg>;
}
function MeetLogo({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M2 8.5h9v8H4a2 2 0 0 1-2-2z" fill="#fff" stroke="#dadce0" strokeWidth=".5"/><path d="M11 8.5v3.2l4-2.4V7.5a1 1 0 0 0-1.5-.9z" fill="#00832D"/><path d="M11 16.5v-3.2l4 2.4v1.6a1 1 0 0 1-1.5.9z" fill="#0066DA"/><path d="M15 9.3v6.4l5.3 3.1a1 1 0 0 0 1.5-.9V7.1a1 1 0 0 0-1.5-.9z" fill="#E94235"/><path d="M2 8.5h5.5L11 6.2v2.3H2z" fill="#00AC47"/><path d="M2 16.5h5.5l3.5 2.3v-2.3H2z" fill="#FFBA00"/></svg>;
}
function MicrosoftLogo({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M2 2h9.5v9.5H2z" fill="#F25022"/><path d="M12.5 2H22v9.5h-9.5z" fill="#7FBA00"/><path d="M2 12.5h9.5V22H2z" fill="#00A4EF"/><path d="M12.5 12.5H22V22h-9.5z" fill="#FFB900"/></svg>;
}
function DropboxLogo({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="#0061FF" aria-hidden="true"><path d="m6 3 6 4-6 4-6-4zm12 0 6 4-6 4-6-4zM6 12l6 4-6 4-6-4zm12 0 6 4-6 4-6-4zm-6 5 6-4-6-4-6 4z"/></svg>;
}
function LinearLogo({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="#5E6AD2" aria-hidden="true"><rect x="16.3" y="2.3" width="2.2" height="5.5" rx="1.1" transform="rotate(45 17.4 5)"/><rect x="12" y="1" width="2.2" height="11" rx="1.1" transform="rotate(45 13 6.5)"/><rect x="6.5" y="1" width="2.2" height="17.5" rx="1.1" transform="rotate(45 7.5 9.5)"/><rect x="1" y="4.5" width="2.2" height="18" rx="1.1" transform="rotate(45 2 13.5)"/></svg>;
}

const LEFT_TOOLS = [{ label: 'Gmail', Logo: GmailLogo }, { label: 'Calendar', Logo: CalendarLogo }, { label: 'Slack', Logo: SlackLogo }, { label: 'Notion', Logo: NotionLogo }];
const RIGHT_TOOLS = [{ label: 'Meet', Logo: MeetLogo }, { label: 'Microsoft 365', Logo: MicrosoftLogo }, { label: 'Dropbox', Logo: DropboxLogo }, { label: 'Linear', Logo: LinearLogo }];

function AuraMark() {
  return <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="#C9832E" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><circle cx="32" cy="25" r="8" fill="#C9832E" fillOpacity=".1"/><path d="M32 5v5M18 11l3.5 3.5M46 11l-3.5 3.5M12 25h5M47 25h5"/><path d="M13 42c6-4 12-4 19 0s13 4 19 0M13 49c6-4 12-4 19 0s13 4 19 0M18 56c5-3 10-3 14 0s9 3 14 0"/></svg>;
}

function ToolRow({ label, Logo, side }: { label: string; Logo: ({ className }: { className?: string }) => React.JSX.Element; side: 'left' | 'right' }) {
  return <div className={`relative z-10 flex items-center gap-3 ${side === 'right' ? 'lg:justify-end' : ''}`}><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-white p-2 shadow-sm"><Logo className="h-full w-full" /></div><span className="whitespace-nowrap text-sm font-medium text-[#3F3F46]">{label}</span>{side === 'left' ? <span className="h-1.5 w-1.5 rounded-full bg-[#C9832E]" /> : <ArrowRight className="h-4 w-4 text-[#C9832E]" strokeWidth={2} />}</div>;
}

export default function HowAuraWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) { setRevealed(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect(); } }, { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const reveal = (delay: number) => `${revealed ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'} transition-all duration-[600ms] ease-out`;

  return <section ref={sectionRef} id="how-aura-works" className="bg-[#FAF6EF] px-6 py-20 md:py-28"><div className="mx-auto max-w-6xl">
    <header className={`mx-auto max-w-2xl text-center ${reveal(0)}`} style={{ transitionDelay: `${0}ms` }}><span className="inline-flex items-center rounded-full border border-[#C9832E]/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#C9832E]">How AURA Works</span><h2 className="mt-5 text-4xl font-bold leading-tight text-[#18181B] md:text-5xl">Your day, simplified in <span className="text-[#C9832E]">4 steps</span></h2><p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#71717A]">AURA connects your tools, organizes your data and helps you focus on what matters.</p></header>

    <div className={`relative mt-12 rounded-3xl border border-black/5 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] md:p-10 ${reveal(100)}`} style={{ transitionDelay: '100ms' }}><div className="grid grid-cols-1 gap-8 md:grid-cols-4">{STEPS.map((step, index) => { const StepIcon = step.icon; return <article className="relative" key={step.n}><div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9832E]/40 text-sm font-semibold text-[#C9832E]">{step.n}</div>{index < STEPS.length - 1 && <div className="absolute left-9 right-[-2rem] top-[18px] hidden border-t border-dashed border-[#C9832E]/30 md:block"><span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#C9832E]" /></div>}<div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDEEDB]"><StepIcon className="h-7 w-7 text-[#C9832E]" strokeWidth={2} /></div><h3 className="mt-6 text-base font-bold text-[#18181B]">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-[#71717A]">{step.desc}</p></article>; })}</div></div>

    <div className={`relative mt-8 min-h-[420px] overflow-hidden rounded-3xl border border-black/5 bg-white/70 p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] md:p-16 ${reveal(200)}`} style={{ transitionDelay: '200ms' }}><svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#C9832E" strokeLinecap="round" strokeOpacity=".35" strokeWidth="1.5"><path d="M270 75C390 75 420 210 520 210"/><path d="M270 155C390 155 420 210 520 210"/><path d="M270 265C390 265 420 210 520 210"/><path d="M270 345C390 345 420 210 520 210"/><path d="M680 210C780 210 810 75 930 75"/><path d="M680 210C780 210 810 155 930 155"/><path d="M680 210C780 210 810 265 930 265"/><path d="M680 210C780 210 810 345 930 345"/></g></svg>
      <div className="absolute left-1/2 top-1/2 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl lg:block" style={{ background: 'radial-gradient(circle, rgba(201,131,46,0.15), transparent 70%)' }} /><div className="absolute left-1/2 top-1/2 hidden h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9832E]/10 lg:block" /><div className="absolute left-1/2 top-1/2 hidden h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9832E]/10 lg:block" /><div className="absolute left-1/2 top-1/2 hidden h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9832E]/10 lg:block" />
      <div className="relative z-10 grid min-h-[292px] items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-16"><div className="space-y-7">{LEFT_TOOLS.map((tool) => <ToolRow key={tool.label} {...tool} side="left" />)}</div><div className="relative mx-auto flex h-40 w-40 shrink-0 flex-col items-center justify-center rounded-full border border-[#C9832E]/40 bg-[#FBF3E7] shadow-[0_8px_30px_rgba(201,131,46,0.15)]"><span className="absolute left-5 top-7 h-1 w-1 rounded-full bg-[#C9832E]/50"/><span className="absolute bottom-8 right-7 h-1.5 w-1.5 rounded-full bg-[#C9832E]/30 blur-[1px]"/><AuraMark /><strong className="mt-1 text-xl font-extrabold tracking-wide text-[#C9832E]">AURA</strong></div><div className="space-y-7">{RIGHT_TOOLS.map((tool) => <ToolRow key={tool.label} {...tool} side="right" />)}</div></div>
    </div>

    <div className={`mt-8 grid grid-cols-1 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] md:grid-cols-4 md:divide-x md:divide-black/5 ${reveal(300)}`} style={{ transitionDelay: '300ms' }}>{STATS.map((stat) => { const StatIcon = stat.icon; return <article className="flex gap-4 p-8" key={stat.label}><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDEEDB]"><StatIcon className="h-5 w-5 text-[#C9832E]" /></div><div><div className="text-2xl font-bold text-[#18181B]">{stat.value}</div><h3 className="mt-0.5 text-sm font-semibold text-[#18181B]">{stat.label}</h3><p className="mt-1 text-sm leading-snug text-[#71717A]">{stat.desc}</p></div></article>; })}</div>
  </div></section>;
}
