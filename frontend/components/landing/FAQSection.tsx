'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is AURA secure to connect with my Google Account?',
    answer: 'Absolutely. AURA connects to Google Calendar and Gmail via Google OAuth 2.0 protocol. We never see or store your raw account password. We maintain strict security scopes and encrypt all tokens in our database.'
  },
  {
    question: 'Can I disconnect Notion or Calendar at any time?',
    answer: 'Yes, you have full control. You can revoke access or connect new integrations instantly from the integrations panel inside your dashboard settings. Disconnecting immediately removes associated synchronization pipelines.'
  },
  {
    question: 'How does the AI Assistant extract tasks from email and files?',
    answer: 'Our background worker digests new event content, calendar descriptions, and Notion updates through secure APIs. Our AI parser extracts action points and auto-populates your task checklist with context-aware due dates.'
  },
  {
    question: 'Is there a free trial for the Pro Plan?',
    answer: 'Yes! Every new account gets automatic access to a 14-day trial of our Pro capabilities immediately after signup. No credit card is required to try it.'
  },
  {
    question: 'How fast does background synchronization run?',
    answer: 'Pro plan integrations are updated in near real-time (sync is checked every 1-2 minutes). Free users experience background syncing updates every 30 minutes.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#FDFBF8] relative overflow-hidden">
      {/* Soft background accents */}
      <div className="absolute top-[30%] left-[-10%] w-[30%] h-[30%] bg-[#D89A3E]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] font-bold text-[#C17817] uppercase tracking-widest bg-[#F3E3C9] px-3.5 py-1.5 rounded-full">
            Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1B16] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#6B6258] leading-relaxed">
            Everything you need to know about setting up integrations, security scopes, and billing.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white border border-[#E8DDD2] rounded-3xl overflow-hidden shadow-sm hover:border-[#C17817]/40 transition-colors duration-300"
              >
                {/* FAQ Header (Button) */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-sm font-bold text-[#1F1B16] pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-7 w-7 rounded-full bg-[#F7F2EC] text-[#6B6258] flex items-center justify-center shrink-0"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>

                {/* FAQ Answer (Expandable Content) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs text-[#6B6258] leading-relaxed border-t border-[#E8DDD2]/30 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
