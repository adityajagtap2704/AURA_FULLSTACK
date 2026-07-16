'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-[#FDFBF8] relative overflow-hidden flex flex-col items-center">
      {/* Decorative background glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70%] h-[70%] bg-[#F3E3C9]/30 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 w-full relative z-10">
        
        {/* Main CTA Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-[#EDE4D8] to-[#E8DCC8] rounded-[3rem] border border-[#E5DDD0] p-8 sm:p-16 text-center space-y-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          {/* Subtle details */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/20 blur-3xl rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D89A3E]/10 blur-3xl rounded-full" />

          {/* Icon */}
          <div className="inline-flex h-11 w-11 rounded-2xl bg-[#F3E3C9] text-[#C17817] items-center justify-center shadow-sm">
            <Sparkles className="h-5.5 w-5.5" />
          </div>

          {/* Heading & Text */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1F1B16] tracking-tight leading-tight">
              Ready to boost your productivity?
            </h2>
            <p className="text-sm sm:text-base text-[#6B6258] leading-relaxed">
              Join thousands of creators, engineers, and high-performance teams who rely on AURA to organize their days, automate workflows, and keep focus absolute.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-[#C17817] to-[#D89A3E] hover:from-[#b06d15] hover:to-[#ca8f35] px-8 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started for Free
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center text-sm font-bold text-[#1F1B16] bg-white hover:bg-[#FDFBF8] border border-[#E8DDD2] px-8 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a Demo
            </Link>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
