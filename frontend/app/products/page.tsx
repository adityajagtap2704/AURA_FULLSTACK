'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, CheckCircle2, Calendar, Mail, Cpu, ArrowRight, ChevronRight } from "lucide-react";

export default function ProductsInfoPage() {
  const [activeTab, setActiveTab] = useState("tasks");

  const features = [
    {
      id: "tasks",
      title: "Intelligent Task Management",
      badge: "Core Workflow",
      description: "Priority scoring, automated deadlines, and smart tagging powered by AI. Never lose track of high-impact deliverables.",
      points: ["AI priority estimation", "Kanban & list views", "Auto-extract tasks from email"],
      icon: <CheckCircle2 className="w-5 h-5 text-[#C17817]" />,
    },
    {
      id: "calendar",
      title: "Smart Calendar & Scheduling",
      badge: "Google Calendar Sync",
      description: "Seamlessly sync meetings, schedule focus blocks, and eliminate double-booking with real-time slot optimization.",
      points: ["Bi-directional Google Calendar sync", "Automated meeting preparation", "Focus block protection"],
      icon: <Calendar className="w-5 h-5 text-[#C17817]" />,
    },
    {
      id: "inbox",
      title: "Unified Gmail & AI Inbox",
      badge: "Zero-Inbox Productivity",
      description: "Process emails twice as fast with automatic summaries, action item extraction, and context-aware draft responses.",
      points: ["Instant thread summaries", "One-click AI replies", "Direct task conversion"],
      icon: <Mail className="w-5 h-5 text-[#C17817]" />,
    },
    {
      id: "assistant",
      title: "AI Knowledge Assistant",
      badge: "RAG Powered",
      description: "Ask anything across your connected notes, emails, and calendar. Get instant, cited answers from your workspace memory.",
      points: ["Semantic search across apps", "Smart workspace Q&A", "Daily context digests"],
      icon: <Cpu className="w-5 h-5 text-[#C17817]" />,
    },
  ];

  const currentFeature = features.find((f) => f.id === activeTab) || features[0];

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen w-full bg-[#FDFAF6]"
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
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
            <Sparkles className="w-3.5 h-3.5" /> Product Suite Overview
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1F1B16] tracking-tight">
            Designed for Deep Focus
          </h1>
          <p className="text-sm text-[#7A6F64]">
            Select a module to view its architecture and features.
          </p>
        </div>

        {/* Interactive Documentation-Style Layout */}
        <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar Tabs */}
          <div className="bg-white rounded-3xl p-4 border border-[#EBE3D7] shadow-sm space-y-1.5 sticky top-28">
            <div className="px-3 py-2 text-[11px] font-bold text-[#9B8F85] uppercase tracking-wider">
              Product Index
            </div>
            {features.map((f) => {
              const isActive = activeTab === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(f.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#FDF4E7] text-[#C17817] shadow-sm border border-[#EDD9A3]"
                      : "text-[#4A3F35] hover:bg-[#FDF9F3] hover:text-[#1F1B16]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {f.icon}
                    <span>{f.title}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#C17817]" />}
                </button>
              );
            })}
          </div>

          {/* Animated Main Content Pane */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Section Header */}
                <div className="bg-white rounded-3xl p-8 border border-[#EBE3D7] shadow-sm space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF4E7] text-[#C17817] text-xs font-bold">
                    {currentFeature.icon}
                    <span>{currentFeature.badge}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#1F1B16]">{currentFeature.title}</h2>
                  <p className="text-sm text-[#7A6F64]">{currentFeature.description}</p>
                </div>

                {/* Section Body */}
                <div className="p-6 rounded-2xl bg-white border border-[#EBE3D7] shadow-sm grid md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {currentFeature.points.map((pt, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-[#383028]">
                          <div className="w-4 h-4 rounded-full bg-[#C17817] text-white flex items-center justify-center text-[10px]">✓</div>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1F1B16] text-white text-xs font-bold hover:bg-[#C17817] transition-colors"
                    >
                      Start Free Trial <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Interactive Mockup */}
                  <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADECB] p-6 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E3D7C5]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C17817]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E58F28]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E8B868]" />
                      </div>
                      <span className="text-[10px] font-mono text-[#8C8074]">AURA Preview</span>
                    </div>
                    <div className="h-4 bg-white rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-white rounded w-1/2" />
                    <div className="h-10 bg-white border border-[#EDD9A3] rounded-xl flex items-center px-4 text-xs font-bold text-[#C17817]">
                      ⚡ Feature Engine Active
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
