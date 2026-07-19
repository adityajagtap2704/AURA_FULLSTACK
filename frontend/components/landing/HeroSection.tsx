'use client';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Shield, CheckCircle } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as any } },
};

const TRUST_BADGES = [
  { icon: Shield, label: 'Secure OAuth Login' },
  { icon: CheckCircle, label: 'Google Trusted' },
  { icon: CheckCircle, label: 'Your data is always safe' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-[#FDFBF8]">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#F5E6D0]/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#FDF0E0]/50 to-transparent rounded-full blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(#C17817 1px, transparent 1px), linear-gradient(90deg, #C17817 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0, ease: [0.25, 0.4, 0.25, 1] as any }}
              className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-[#FDF6EC] border border-[#E8C98A]/50 text-[#C17817] text-xs font-bold uppercase tracking-widest"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C17817] animate-pulse" />
              AI-Powered Productivity
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] as any }}
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#1F1B16] leading-[1.05] tracking-tight">
                The all-in-one<br />
                workspace that<br />
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#C17817] via-[#E8A422] to-[#C17817]">
                  works for you.
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] as any }}
              className="text-lg text-[#6B6258] leading-relaxed max-w-md"
            >
              Bring Gmail, Calendar, Notion and Meet together in one intelligent dashboard. Let AI handle the clutter so you can focus on what matters.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] as any }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/signup"
                className="group flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-[#C17817] to-[#E8A422] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#C17817]/30 hover:shadow-xl hover:shadow-[#C17817]/40 hover:-translate-y-1 transition-all duration-300"
              >
                Start for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group flex items-center gap-3 px-6 py-4 bg-white border border-[#E8E0D5] text-[#4A3F35] font-bold text-base rounded-2xl hover:border-[#C17817]/40 hover:bg-[#FDF6EC] hover:-translate-y-1 transition-all duration-300 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C17817] to-[#E8A422] flex items-center justify-center shadow-sm">
                  <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] as any }}
              className="flex flex-wrap gap-5 pt-2"
            >
              {TRUST_BADGES.map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-xs text-[#6B6258] font-medium">
                  <b.icon className="w-4 h-4 text-[#C17817]" />
                  {b.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative hidden lg:block"
          >
            {/* Floating glow */}
            <div className="absolute -inset-8 bg-gradient-radial from-[#E8A422]/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

            {/* Dashboard card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative bg-white rounded-3xl shadow-2xl shadow-[#1F1B16]/15 border border-[#E8E0D5]/60 overflow-hidden"
            >
              {/* Dashboard header */}
              <div className="bg-white border-b border-[#F0EBE3] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#C17817] to-[#E8A422] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm font-bold text-[#1F1B16]">AURA</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F4EF] rounded-full px-3 py-1.5">
                  <div className="w-3.5 h-3.5 text-[#9B8F85]">
                    <svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <span className="text-xs text-[#9B8F85]">Search anything...</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C17817] to-[#E8A422]" />
              </div>

              {/* Greeting */}
              <div className="px-6 py-4 bg-white">
                <p className="text-sm text-[#9B8F85]">Good morning, Bhargavi 👋</p>
                <p className="text-xs text-[#B5ABA3] mt-0.5">Here's what's happening today.</p>
              </div>

              {/* Dashboard grid */}
              <div className="px-6 pb-6 grid grid-cols-3 gap-3">
                {/* AI Daily Digest */}
                <div className="col-span-1 bg-[#FDFBF8] rounded-2xl p-4 border border-[#F0EBE3]">
                  <div className="text-xs font-bold text-[#4A3F35] mb-2">AI Daily Digest</div>
                  <div className="space-y-1.5">
                    {['3 new emails', '2 empty tasks', 'Project team meeting'].map((item) => (
                      <div key={item} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C17817] shrink-0" />
                        <span className="text-[10px] text-[#6B6258] truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 text-[10px] font-bold text-white bg-[#C17817] px-3 py-1.5 rounded-lg w-full hover:bg-[#A86510] transition-colors">
                    View Digest
                  </button>
                </div>

                {/* Today's Schedule */}
                <div className="col-span-1 bg-[#FDFBF8] rounded-2xl p-4 border border-[#F0EBE3]">
                  <div className="text-xs font-bold text-[#4A3F35] mb-2">Today's Schedule</div>
                  <div className="space-y-2">
                    {[
                      { time: '10:00 AM', label: 'Project Standup', color: '#C17817' },
                      { time: '12:30 PM', label: 'Lunch with Team', color: '#22C55E' },
                      { time: '3:00 PM', label: 'Design Review', color: '#3B82F6' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <div>
                          <div className="text-[9px] text-[#9B8F85]">{item.time}</div>
                          <div className="text-[10px] font-semibold text-[#4A3F35] leading-tight">{item.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Meeting */}
                <div className="col-span-1 bg-[#1F1B16] rounded-2xl p-4 text-white">
                  <div className="text-xs font-bold mb-1">Upcoming Meeting</div>
                  <div className="text-[10px] text-[#B5ABA3] mb-3">Design Review<br />4:00 PM – 5:00 PM IST</div>
                  <div className="flex -space-x-1.5 mb-3">
                    {['#C17817', '#3B82F6', '#22C55E', '#E8A422'].map((c) => (
                      <div key={c} className="w-5 h-5 rounded-full border-2 border-[#1F1B16]" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <button className="w-full text-[10px] font-bold text-[#1F1B16] bg-[#E8A422] py-1.5 rounded-lg hover:bg-[#C17817] transition-colors">
                    Join Meeting
                  </button>
                </div>

                {/* Tasks preview */}
                <div className="col-span-2 bg-[#FDFBF8] rounded-2xl p-4 border border-[#F0EBE3]">
                  <div className="text-xs font-bold text-[#4A3F35] mb-2">Tasks</div>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Complete landing page', priority: 'High', done: true },
                      { label: 'Review PR for auth flow', priority: 'Medium', done: false },
                      { label: 'Update Notion docs', priority: 'Low', done: false },
                    ].map((t) => (
                      <div key={t.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${t.done ? 'border-[#22C55E] bg-[#22C55E]' : 'border-[#D5CCc3]'}`}>
                            {t.done && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className={`text-[10px] ${t.done ? 'line-through text-[#B5ABA3]' : 'text-[#4A3F35]'}`}>{t.label}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          t.priority === 'High' ? 'bg-[#FEE2E2] text-[#EF4444]' :
                          t.priority === 'Medium' ? 'bg-[#FEF3C7] text-[#D97706]' :
                          'bg-[#DCFCE7] text-[#16A34A]'
                        }`}>{t.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics mini */}
                <div className="col-span-1 bg-[#FDFBF8] rounded-2xl p-4 border border-[#F0EBE3]">
                  <div className="text-xs font-bold text-[#4A3F35] mb-2">Focus Score</div>
                  <div className="text-2xl font-black text-[#C17817]">87<span className="text-sm text-[#9B8F85]">%</span></div>
                  <div className="mt-2 flex gap-0.5 items-end h-8">
                    {[40, 65, 50, 80, 70, 87, 75].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-[#C17817] to-[#E8A422] opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -top-4 -left-6 bg-white rounded-2xl px-4 py-3 shadow-xl border border-[#E8E0D5] flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1F1B16]">Task Completed!</div>
                <div className="text-[10px] text-[#9B8F85]">AI summarized your work</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute -bottom-4 -right-4 bg-[#1F1B16] text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <div className="text-xs font-semibold">3 meetings synced</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
