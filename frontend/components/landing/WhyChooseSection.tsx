'use client';

import { motion, Variants } from 'framer-motion';
import { Zap, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';

export default function WhyChooseSection() {
  const points = [
    {
      title: 'Faster Workflow',
      description: 'Spend less time search-navigating and more time executing. With instant sync, keyboard shortcuts, and zero load-lag, AURA is built to keep you in flow state.',
      icon: Zap,
    },
    {
      title: 'AI Automation',
      description: 'Let intelligence work for you. From parsing calendar briefs to generating task lists and smart document summarizations, AURA simplifies manual overhead.',
      icon: Sparkles,
    },
    {
      title: 'Secure Cloud Storage',
      description: 'Security is at our core. Your calendar credentials, inbox messages, files, and profile details are encrypted using enterprise-grade Supabase shields.',
      icon: ShieldCheck,
    },
    {
      title: 'Real-time Collaboration',
      description: 'Keep your team perfectly aligned. Comments, task handoffs, workspace note updates, and dashboard board shifts sync instantly across all viewports.',
      icon: HelpCircle, // Using HelpCircle but we can represent as communication/collab
    }
  ];

  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15
      }
    }
  };

  return (
    <section id="why-aura" className="py-24 bg-[#FDFBF8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] font-bold text-[#C17817] uppercase tracking-widest bg-[#F3E3C9] px-3.5 py-1.5 rounded-full">
            The Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1B16] tracking-tight">
            Why teams choose AURA
          </h2>
          <p className="text-sm text-[#6B6258] leading-relaxed">
            Eliminate cognitive overload and tool fragmentation. AURA provides the robust, unified experience your daily workflow demands.
          </p>
        </div>

        {/* Advantage Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                variants={cardVariants}
                className="bg-[#FFFFFF]/50 hover:bg-white rounded-3xl p-8 border border-[#E8DDD2] shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5 flex gap-6"
              >
                {/* Icon Wrapper */}
                <div className="h-12 w-12 rounded-2xl bg-[#F7F2EC] border border-[#E8DDD2]/60 text-[#C17817] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#C17817] group-hover:text-white group-hover:scale-105">
                  <Icon className="h-5.5 w-5.5" />
                </div>

                {/* Text Wrapper */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#1F1B16] tracking-tight">
                    {point.title}
                  </h3>
                  <p className="text-xs text-[#6B6258] leading-relaxed font-normal">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
