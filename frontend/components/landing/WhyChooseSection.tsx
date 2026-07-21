'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const AI_FEATURES = [
  'Email summaries', 'Meeting reminders',
  'Priority tasks', 'Smart suggestions',
  'Calendar overview', 'Actionable insights',
];

export default function WhyChooseSection() {
  return (
    <section className="py-0 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden bg-[#1A1714] min-h-[420px] flex items-center"
        >
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C17817]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-[#E8A422]/8 rounded-full blur-3xl" />
            {/* Subtle dot grid */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(#E8A422 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
          </div>

          <div className="relative z-10 w-full grid lg:grid-cols-2 gap-12 p-10 lg:p-16 items-center">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C17817]/20 border border-[#C17817]/30 text-[#E8A422] text-xs font-bold uppercase tracking-widest mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E8A422] animate-pulse" />
                AI That Understands You
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                Clarity every morning.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A422] to-[#C17817]">
                  Focus all day.
                </span>
              </h2>
              <p className="text-[#9B8F85] text-base leading-relaxed mb-8">
                AURA scans your data and delivers a personalized summary so you know exactly what matters.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {AI_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#C17817]/20 border border-[#C17817]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#E8A422]" />
                    </div>
                    <span className="text-sm text-[#C8BFB5]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Orb + Cards */}
            <div className="relative flex items-center justify-center">
              {/* Glowing orb */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-52 h-52 rounded-full bg-gradient-radial from-[#E8A422]/30 via-[#C17817]/15 to-transparent blur-2xl"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute w-44 h-44 rounded-full border border-[#C17817]/20 border-dashed"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute w-32 h-32 rounded-full border border-[#E8A422]/15 border-dashed"
              />
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#C17817] via-[#E8A422] to-[#C17817] flex flex-col items-center justify-center shadow-2xl shadow-[#C17817]/40">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                <span className="text-[8px] font-bold text-white/80 mt-1">AURA AI</span>
              </div>

              {/* Floating analytics cards */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 right-0 bg-[#242016] border border-[#333]/60 rounded-xl p-3 shadow-xl w-40"
              >
                <div className="text-[10px] text-[#9B8F85] font-medium mb-1">Focus Time</div>
                <div className="text-base font-black text-white">2h 30m</div>
                <div className="text-[9px] text-[#C17817]">Recommended deep work</div>
                <div className="flex gap-0.5 mt-2 items-end h-6">
                  {[30, 60, 45, 80, 65, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-[#C17817] to-[#E8A422]" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute bottom-0 right-0 bg-[#242016] border border-[#333]/60 rounded-xl p-3 shadow-xl w-48"
              >
                <div className="text-[10px] text-[#9B8F85] font-medium mb-2">Top Priority</div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Design system update', level: 'High', color: '#EF4444' },
                    { label: 'Review proposal', level: 'Medium', color: '#F59E0B' },
                    { label: 'Prepare for review', level: 'Low', color: '#22C55E' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-2">
                      <span className="text-[9px] text-[#C8BFB5] truncate">{item.label}</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color + '20', color: item.color }}>
                        {item.level}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
