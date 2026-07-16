'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Product Director at Velo',
    text: 'AURA single-handedly saved me 2 hours a day. Bringing Notion documents, Gmail alerts, and my daily schedule into one unified dashboard keeps my focus absolute.',
    initials: 'SJ',
    color: 'bg-[#C17817]/10 text-[#C17817]'
  },
  {
    name: 'David Kim',
    role: 'Engineering Lead at Source',
    text: 'The AI Daily Brief is pure gold. It automatically digests my calendar events and prioritizes my daily developer queue. Outstanding tool.',
    initials: 'DK',
    color: 'bg-[#D89A3E]/15 text-[#D89A3E]'
  },
  {
    name: 'Elena Rostova',
    role: 'Solo Founder',
    text: 'I was skeptical about another productivity tool, but the design and speed of AURA blew me away. The glass aesthetics are gorgeous and keyboard shortcuts are fast.',
    initials: 'ER',
    color: 'bg-[#C17817]/10 text-[#C17817]'
  },
  {
    name: 'Liam Patterson',
    role: 'Creative Director',
    text: 'Real-time calendar syncing that actually works. AURA handles schedule overlaps instantly, and the design theme matches my minimal workspace setup perfectly.',
    initials: 'LP',
    color: 'bg-[#D89A3E]/15 text-[#D89A3E]'
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <section className="py-24 bg-[#FDFBF8] relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#F3E3C9]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] font-bold text-[#C17817] uppercase tracking-widest bg-[#F3E3C9] px-3.5 py-1.5 rounded-full">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1B16] tracking-tight">
            Loved by productive people
          </h2>
          <p className="text-sm text-[#6B6258] leading-relaxed">
            Here is what professionals are saying about their new daily control center.
          </p>
        </div>

        {/* Carousel Viewport */}
        <div className="relative min-h-[300px] sm:min-h-[250px] flex items-center justify-center">
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-[-20px] sm:left-[-60px] z-20 h-11 w-11 rounded-full border border-[#E8DDD2] bg-white text-[#6B6258] hover:text-[#C17817] flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-[-20px] sm:right-[-60px] z-20 h-11 w-11 rounded-full border border-[#E8DDD2] bg-white text-[#6B6258] hover:text-[#C17817] flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Testimonial Card */}
          <div className="w-full overflow-hidden px-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="glass rounded-3xl p-8 sm:p-12 border border-[#E8DDD2] shadow-sm flex flex-col justify-between items-center text-center relative gap-6"
              >
                {/* Quote Icon decorative */}
                <Quote className="absolute top-6 left-8 h-12 w-12 text-[#C17817]/10" />

                <p className="text-base sm:text-lg text-[#1F1B16] font-medium leading-relaxed max-w-2xl relative z-10 italic">
                  "{testimonials[currentIndex].text}"
                </p>

                <div className="flex flex-col items-center gap-2 mt-2">
                  {/* Initials Avatar */}
                  <div className={`h-11 w-11 rounded-full ${testimonials[currentIndex].color} font-bold flex items-center justify-center text-sm shadow-inner`}>
                    {testimonials[currentIndex].initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1F1B16] leading-none">
                      {testimonials[currentIndex].name}
                    </h4>
                    <span className="text-[10px] text-[#6B6258] font-semibold mt-1 block">
                      {testimonials[currentIndex].role}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Carousel Indicators (Dots) */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-[#C17817]' : 'w-2 bg-[#E8DDD2]'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
