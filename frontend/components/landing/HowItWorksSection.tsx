'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LogIn, Link2, Kanban, LineChart } from 'lucide-react';

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleSteps, setVisibleSteps] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState<string>('01');
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Hook scroll progress on the timeline container for the filling track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  });

  // Animate line height based on scroll progress
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    // 1. Observer for card fade + slide entry (triggers once)
    const entryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-step-id');
          if (entry.isIntersecting && id) {
            setVisibleSteps((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    // 2. Observer for active indicator pulse (triggers continuously in middle viewport region)
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-step-id');
          if (entry.isIntersecting && id) {
            setActiveStep(id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -40% 0px', // horizontal viewport focus band
        threshold: 0
      }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) {
        entryObserver.observe(ref);
        activeObserver.observe(ref);
      }
    });

    return () => {
      entryObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  const steps = [
    {
      step: '01',
      title: 'Sign In',
      subtitle: 'Create your account',
      description: 'Start in seconds. Sign up with Google Auth or traditional email in a single click.',
      icon: LogIn
    },
    {
      step: '02',
      title: 'Connect Workspace',
      subtitle: 'Aggregate your integrations',
      description: 'Link Gmail, Google Calendar, and Notion. AURA securely connects all platforms immediately.',
      icon: Link2
    },
    {
      step: '03',
      title: 'Organize Tasks',
      subtitle: 'Let AI build your plan',
      description: 'The AURA AI engine categorizes, extracts focus blocks, and structures your tasks into a smart timeline.',
      icon: Kanban
    },
    {
      step: '04',
      title: 'Track Progress',
      subtitle: 'Stay in control',
      description: 'Monitor focus metrics, check off milestones, and receive tailored daily briefs that optimize your time.',
      icon: LineChart
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#F7F2EC]/60 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-[11px] font-bold text-[#C17817] uppercase tracking-widest bg-[#F3E3C9] px-3.5 py-1.5 rounded-full">
            The Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1B16] tracking-tight">
            How AURA Works
          </h2>
          <p className="text-sm text-[#6B6258] leading-relaxed">
            Get fully customized workspace efficiency in four straightforward steps.
          </p>
        </div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          
          {/* Main Connecting Track Line (Desktop Center, Mobile Left) */}
          <div className="absolute left-[31px] md:left-1/2 top-4 bottom-4 w-[2px] bg-[#E8DDD2] -translate-x-[1px]" />
          
          {/* Active Filling Connector Track Line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[31px] md:left-1/2 top-4 w-[2px] bg-[#C17817] -translate-x-[1px] origin-top z-10"
          />

          {/* Stepper Rows */}
          <div className="space-y-16">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 0;
              const isVisible = !!visibleSteps[step.step];
              const isActive = activeStep === step.step;

              return (
                <div
                  key={step.step}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  data-step-id={step.step}
                  className={`flex flex-col md:flex-row relative items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge (Circle Icon) */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={
                        isVisible
                          ? isActive
                            ? {
                                scale: 1.1,
                                opacity: 1,
                                borderColor: '#C17817',
                                color: '#C17817',
                                boxShadow: [
                                  "0 0 0 0px rgba(193, 120, 23, 0.25)",
                                  "0 0 0 10px rgba(193, 120, 23, 0)",
                                  "0 0 0 0px rgba(193, 120, 23, 0.25)"
                                ]
                              }
                            : {
                                scale: 1,
                                opacity: 1,
                                borderColor: '#E8DDD2',
                                color: '#6B6258',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                              }
                          : { scale: 0.8, opacity: 0 }
                      }
                      transition={
                        isActive
                          ? {
                              scale: { type: 'spring', stiffness: 200, damping: 15 },
                              boxShadow: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                            }
                          : { duration: 0.5 }
                      }
                      className="h-10 w-10 rounded-full border-2 bg-[#FDFBF8] flex items-center justify-center transition-colors duration-300"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </motion.div>
                  </div>

                  {/* Step Card Content */}
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-10">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -45 : 45, scale: 0.96 }}
                      animate={
                        isVisible
                          ? { opacity: 1, x: 0, scale: 1 }
                          : { opacity: 0, x: isEven ? -45 : 45, scale: 0.96 }
                      }
                      transition={{
                        type: 'spring',
                        stiffness: 70,
                        damping: 14,
                        delay: 0.15 // Staggered delay relative to step reveal
                      }}
                      className={`glass rounded-3xl p-6 sm:p-8 border shadow-sm hover:shadow-md transition-all duration-300 relative group ${
                        isActive ? 'border-[#C17817]/40 ring-1 ring-[#C17817]/5' : 'border-[#E8DDD2]'
                      }`}
                    >
                      {/* Step Number Display */}
                      <span className={`absolute top-6 right-6 text-3xl font-extrabold select-none transition-colors duration-300 ${
                        isActive ? 'text-[#C17817]/25' : 'text-[#C17817]/15 group-hover:text-[#C17817]/30'
                      }`}>
                        {step.step}
                      </span>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#C17817] uppercase tracking-wider">
                          {step.subtitle}
                        </span>
                        <h3 className="text-xl font-bold text-[#1F1B16] tracking-tight">
                          {step.title}
                        </h3>
                        <p className="text-xs text-[#6B6258] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Empty side for layout spacing on desktop */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
