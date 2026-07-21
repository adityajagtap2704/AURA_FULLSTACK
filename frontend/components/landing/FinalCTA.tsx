'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A1714] via-[#2A2018] to-[#1A1714] p-14 lg:p-20 text-center"
        >
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-radial from-[#C17817]/20 to-transparent blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#E8A422]/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C17817]/8 rounded-full blur-3xl" />
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(#E8A422 1px, transparent 1px)', backgroundSize: '28px 28px' }}
            />
          </div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight"
            >
              Ready to simplify your workday?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#9B8F85] text-base lg:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Bring Gmail, Calendar, Notion and Meet together in one intelligent workspace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-[#C17817] to-[#E8A422] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#C17817]/40 hover:shadow-xl hover:shadow-[#C17817]/50 hover:-translate-y-1 transition-all duration-300"
              >
                Start for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-[#6B6258] text-xs">No credit card required</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
