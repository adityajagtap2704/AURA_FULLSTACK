'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, HeartHandshake, ShieldCheck, Zap } from "lucide-react";

export default function CompanyInfoPage() {
  const milestones = [
    { year: "2024", title: "AURA Founded", desc: "Started with a vision to eliminate workspace app fragmentations." },
    { year: "2025", title: "AI RAG Integration", desc: "Launched context-aware AI assistant across email & notes." },
    { year: "2026", title: "50,000+ Active Workspaces", desc: "Trusted by top tech teams and freelancers worldwide." },
  ];

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen w-full bg-[#FDFAF6]"
    >
      <div className="max-w-7xl mx-auto py-10 px-6">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#1F1B16] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#C17817]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF4E7] border border-[#EDD9A3] text-[#C17817] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" /> Our Story & Mission
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1F1B16] tracking-tight">
            Building Modern Workspace Tools
          </h1>
          <p className="text-xs md:text-sm text-[#7A6F64]">
            Unifying workflow clutter with intelligent AI reasoning.
          </p>
        </div>

        {/* Impact Numbers Banner */}
        <div className="bg-[#1F1B16] text-white rounded-3xl p-8 mb-10 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#E8A422]">50K+</div>
            <div className="text-[11px] text-[#B8ACA0]">Active Users</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#E8A422]">2.4M</div>
            <div className="text-[11px] text-[#B8ACA0]">Monthly Actions</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#E8A422]">99.99%</div>
            <div className="text-[11px] text-[#B8ACA0]">System Uptime</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#E8A422]">4.9 / 5</div>
            <div className="text-[11px] text-[#B8ACA0]">User Rating</div>
          </div>
        </div>

        {/* Compact Milestones */}
        <div className="mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-[#EBE3D7] shadow-sm">
                <span className="text-2xl font-extrabold text-[#C17817] block mb-1">{m.year}</span>
                <h3 className="text-sm font-bold text-[#1F1B16] mb-1">{m.title}</h3>
                <p className="text-xs text-[#7A6F64]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.main>
  );
}
