'use client';
import { motion } from 'framer-motion';
import { Link2, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    icon: Link2,
    title: 'Connect your tools',
    description: 'Link Gmail, Google Calendar, Notion, and Meet with one-click OAuth. No complex setup.',
    color: '#C17817',
    bg: '#FDF6EC',
  },
  {
    icon: RefreshCw,
    title: 'We sync your data securely',
    description: 'AURA continuously syncs your data in real-time. Everything stays up-to-date automatically.',
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    icon: Sparkles,
    title: 'AI organizes everything',
    description: 'Our AI reads your schedule, emails, and tasks to create smart summaries and priority queues.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: CheckCircle,
    title: 'You get clarity and get things done',
    description: 'Start each day with a clear plan. AURA shows you exactly what needs attention right now.',
    color: '#22C55E',
    bg: '#F0FDF4',
  },
];

const STATS = [
  { value: '4+', label: 'Connected Apps', icon: Link2 },
  { value: '100%', label: 'Secure & Private', icon: CheckCircle },
  { value: '1', label: 'Unified Dashboard', icon: Sparkles },
  { value: '24/7', label: 'Smart Sync', icon: RefreshCw },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[#FDFBF8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-[#1F1B16] tracking-tight mb-4">How AURA works</h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#E8E0D5] to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon circle */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-sm transition-all duration-300 group-hover:shadow-lg relative z-10"
                  style={{ backgroundColor: step.bg, border: `1.5px solid ${step.color}20` }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.color }} />
                </motion.div>

                {/* Step number */}
                <div className="text-xs font-bold text-[#B5ABA3] uppercase tracking-widest mb-2">Step {i + 1}</div>
                <h3 className="font-bold text-[#1F1B16] text-base mb-2 leading-tight">{step.title}</h3>
                <p className="text-sm text-[#6B6258] leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-[#F0EBE3] shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FDF6EC] to-[#F5E8D0] flex items-center justify-center shrink-0">
                <stat.icon className="w-5 h-5 text-[#C17817]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#1F1B16]">{stat.value}</div>
                <div className="text-xs text-[#9B8F85] font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
