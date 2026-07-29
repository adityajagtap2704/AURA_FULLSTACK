'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Shield, Sparkles, CheckCircle2 } from "lucide-react";

export default function IntegrationsInfoPage() {
  const socialIcons = [
    { name: "Google", icon: "🌐" },
    { name: "GitHub", icon: "🐙" },
    { name: "LinkedIn", icon: "💼" },
    { name: "Notion", icon: "📝" },
    { name: "Discord", icon: "💬" },
    { name: "Microsoft", icon: "🪟" },
    { name: "Dropbox", icon: "📦" },
    { name: "Atlassian", icon: "🔷" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#FFFDFB] to-[#F7F3EC] py-10 px-6 max-w-7xl mx-auto flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Back Button with Hover Animation */}
        <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#1F1B16] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#C17817] hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Animated Header */}
        <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF4E7] border border-[#EDD9A3] text-[#C17817] text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" /> App Ecosystem & SSO
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1F1B16] tracking-tight">
            High-Conversion Social SSO
          </h1>
          <p className="text-xs md:text-sm text-[#7A6F64]">
            Connect your existing apps and sign in effortlessly with 1-click OAuth.
          </p>
        </motion.div>

        {/* Animated SSO Curved Arc with Floating Pulse Icons */}
        <motion.div variants={itemVariants} className="relative py-10 mb-10 flex flex-col items-center justify-center">
          <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[140px] pointer-events-none" viewBox="0 0 800 140" fill="none">
            <path d="M 0 40 Q 400 130 800 40" stroke="#E3D8C8" strokeWidth="2" strokeDasharray="6 6" />
          </svg>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-3xl mx-auto px-4">
            {socialIcons.map((item, idx) => {
              const isCenter = item.name === "Google";
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.6, y: 30 }}
                  animate={{
                    opacity: 1,
                    scale: isCenter ? 1.05 : 1,
                    y: [0, idx % 2 === 0 ? -6 : 6, 0],
                  }}
                  transition={{
                    y: { duration: 3 + (idx % 3), repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.4, delay: idx * 0.08 },
                    scale: { duration: 0.4 },
                  }}
                  whileHover={{ scale: 1.18, rotate: idx % 2 === 0 ? 5 : -5 }}
                  className={`cursor-pointer transition-all duration-200 ${
                    isCenter
                      ? "px-5 py-2.5 bg-white border-2 border-[#C17817] shadow-xl rounded-full flex items-center gap-2.5 scale-105"
                      : "w-12 h-12 rounded-full bg-white border border-[#EBE3D7] shadow-md flex items-center justify-center text-xl"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {isCenter && (
                    <span className="text-xs font-bold text-[#1F1B16] whitespace-nowrap flex items-center gap-1">
                      Sign in with Google <CheckCircle2 className="w-3.5 h-3.5 text-[#C17817]" />
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Animated Staggered Feature Cards */}
        <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(193, 120, 23, 0.12)" }}
            className="bg-white rounded-2xl p-6 border border-[#EBE3D7] shadow-sm transition-all"
          >
            <Shield className="w-6 h-6 text-[#C17817] mb-2" />
            <h3 className="text-base font-bold text-[#1F1B16] mb-1">OAuth 2.0 Security</h3>
            <p className="text-xs text-[#7A6F64]">Encrypted token isolation for all connected accounts.</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(193, 120, 23, 0.12)" }}
            className="bg-white rounded-2xl p-6 border border-[#EBE3D7] shadow-sm transition-all"
          >
            <Sparkles className="w-6 h-6 text-[#C17817] mb-2" />
            <h3 className="text-base font-bold text-[#1F1B16] mb-1">Instant Account Sync</h3>
            <p className="text-xs text-[#7A6F64]">Real-time synchronization for Gmail, Calendar & Notion.</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(193, 120, 23, 0.12)" }}
            className="bg-white rounded-2xl p-6 border border-[#EBE3D7] shadow-sm transition-all"
          >
            <Globe className="w-6 h-6 text-[#C17817] mb-2" />
            <h3 className="text-base font-bold text-[#1F1B16] mb-1">Custom Developer APIs</h3>
            <p className="text-xs text-[#7A6F64]">Build custom triggers using our REST developer APIs.</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.main>
  );
}
