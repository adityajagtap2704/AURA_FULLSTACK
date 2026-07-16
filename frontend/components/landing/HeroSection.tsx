'use client';

import Link from 'next/link';
import { Target, Sparkles, Lightbulb, ArrowRight } from 'lucide-react';
import WorkspaceBackground from '@/components/WorkspaceBackground';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const integrations = [
    {
      label: 'Gmail',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <rect x="2" y="4" width="20" height="16" rx="3" fill="#FFFFFF" stroke="#E5DDD0" strokeWidth="1" />
          <path d="M22 6l-10 7L2 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M2 6v12h4V8.5l6 4 6-4V18h4V6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )
    },
    {
      label: 'Calendar',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <rect x="2" y="3" width="20" height="18" rx="4" fill="#FFFFFF" stroke="#E5DDD0" strokeWidth="1" />
          <rect x="2" y="3" width="20" height="6" fill="#4285F4" rx="2" />
          <text x="12" y="16" fill="#1F1B16" fontSize="8" fontWeight="bold" textAnchor="middle">31</text>
        </svg>
      )
    },
    {
      label: 'Notion',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2.5 4v12h2.5V8.5L15 18h2.5V6H15v9.5L9 6H6.5z" />
        </svg>
      )
    },
    {
      label: 'Meet',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <rect x="2" y="5" width="13" height="14" rx="3" fill="#34A853" />
          <path d="M15 10l5-3v10l-5-3" fill="#4285F4" />
          <circle cx="6" cy="12" r="1.5" fill="#FFFFFF" />
          <circle cx="10" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>
      )
    }
  ];

  const brandFeatures = [
    {
      title: 'What is AURA?',
      desc: 'AURA brings your essential apps into one simple workspace and helps you get more done, effortlessly.',
      icon: Target
    },
    {
      title: 'Why use AURA?',
      desc: 'AI-powered summaries, smart prioritization, and a clean dashboard that saves you time every day.',
      icon: Sparkles
    },
    {
      title: 'Purpose of AURA',
      desc: "AURA's purpose is to simplify your work life by bringing clarity, speed, and focus to everything you do.",
      icon: Lightbulb
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-br from-[#EDE4D8] to-[#E8DCC8]">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F1B16] tracking-tight leading-tight">
              Aura makes your life <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C17817] to-[#D89A3E] relative inline-block">
                easy and fast.
                <svg viewBox="0 0 200 12" className="absolute left-0 bottom-[-6px] w-full h-2 text-[#D89A3E] shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M 5 6 C 50 2, 150 2, 195 6" />
                </svg>
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-[#6B6258] max-w-xl leading-relaxed"
          >
            AURA is your all-in-one productivity hub that brings your tools, tasks, and insights together — so you can focus on what matters most.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/signup"
              className="group flex items-center justify-center gap-2 text-base font-bold text-white bg-gradient-to-r from-[#C17817] to-[#D89A3E] hover:from-[#b06d15] hover:to-[#ca8f35] px-8 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#dashboard-preview"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector('#dashboard-preview');
                if (element) {
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elementRect = element.getBoundingClientRect().top;
                  window.scrollTo({
                    top: elementRect - bodyRect - 80,
                    behavior: 'smooth'
                  });
                }
              }}
              className="flex items-center justify-center text-base font-bold text-[#1F1B16] bg-white/60 hover:bg-white/80 border border-[#E5DDD0] px-8 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              See Dashboard
            </Link>
          </motion.div>

          {/* Integrations Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-3"
          >
            <span className="text-[11px] font-bold text-[#1F1B16] uppercase tracking-widest block">
              Integrates seamlessly with
            </span>
            <div className="flex flex-wrap gap-3">
              {integrations.map((item) => (
                <div
                  key={item.label}
                  className="bg-white border border-[#E5DDD0] px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                >
                  {item.svg}
                  <span className="text-xs font-semibold text-[#6B6258]">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Desk Setup with Brand Cards Overlay */}
        <div className="lg:col-span-6 relative h-[450px] lg:h-[600px] w-full flex items-center justify-center">
          {/* Workspace Background Illustration */}
          <WorkspaceBackground />

          {/* Floating Brand Cards deck */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-md bg-[#FDFBF7]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(31,27,22,0.12)] border border-[#E5DDD0] z-10 space-y-5"
          >
            {brandFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + idx * 0.15 }}
                  key={feature.title}
                  className="flex gap-4 p-3.5 rounded-2xl hover:bg-[#FFFFFF]/60 transition-colors duration-300 group"
                >
                  <div className="h-10 w-10 rounded-full bg-[#F3E3C9] text-[#C17817] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1F1B16]">{feature.title}</h4>
                    <p className="text-xs text-[#6B6258] leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-60">
        <span className="text-[10px] font-bold text-[#6B6258] tracking-widest uppercase">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-[#6B6258] rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-[#C17817] rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
