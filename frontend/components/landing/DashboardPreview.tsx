'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Ananya R.',
    role: 'Product Designer',
    avatar: '👩🏽',
    rating: 5,
    quote: '"AURA completely changed how I manage my work. Everything is in one place now!"',
  },
  {
    name: 'Rohit S.',
    role: 'Software Engineer',
    avatar: '👨🏾',
    rating: 5,
    quote: '"The AI summary every morning saves me so much time. Super helpful and incredibly smart."',
  },
  {
    name: 'Neha P.',
    role: 'Project Manager',
    avatar: '👩🏻',
    rating: 5,
    quote: '"Finally, a tool that brings everything together in one clean dashboard. Highly recommended!"',
  },
];

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm font-bold text-[#C17817] uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1F1B16] tracking-tight">
            Loved by productivity enthusiasts
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-[#FDFBF8] border border-[#F0EBE3] rounded-2xl p-7 hover:shadow-xl hover:shadow-[#1F1B16]/8 transition-all duration-300 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#E8A422] text-[#E8A422]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#4A3F35] text-sm leading-relaxed font-medium flex-1">{t.quote}</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#F0EBE3]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FDF6EC] to-[#F5E8D0] border border-[#E8D5B0] flex items-center justify-center text-xl">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1F1B16]">{t.name}</div>
                  <div className="text-xs text-[#9B8F85]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
