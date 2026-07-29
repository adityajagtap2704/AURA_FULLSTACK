'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Key, Zap, Settings, ShieldCheck, Terminal, Copy, Check, Sparkles, ChevronRight, Search } from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("quickstart");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    {
      id: "quickstart",
      title: "Quickstart & Tutorials",
      icon: <Zap className="w-4 h-4 text-[#C17817]" />,
      badge: "Get Started",
      description: "Learn how to get up and running with AURA in less than 5 minutes.",
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#EBE3D7] shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-[#1F1B16]">1. Initialize your Workspace</h3>
            <p className="text-xs md:text-sm text-[#7A6F64]">
              Connect your Google OAuth session or create an email account to automatically provision your encrypted vector workspace.
            </p>
            <div className="bg-[#1F1B16] rounded-xl p-4 text-white font-mono text-xs flex items-center justify-between">
              <code>npx create-aura-app@latest my-workspace</code>
              <button
                onClick={() => handleCopy("npx create-aura-app@latest my-workspace", "install")}
                className="text-[#D1C7BD] hover:text-white p-1 rounded transition-colors"
              >
                {copiedCode === "install" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EBE3D7] shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-[#1F1B16]">2. Synchronize Calendar & Gmail</h3>
            <p className="text-xs md:text-sm text-[#7A6F64]">
              Navigate to Integrations tab and authorize Google OAuth scopes. AURA immediately indexes upcoming events & unread emails.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "auth",
      title: "Authentication Setup",
      icon: <Key className="w-4 h-4 text-[#C17817]" />,
      badge: "Security",
      description: "OAuth 2.0 configuration, JWT tokens, and session persistence parameters.",
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#EBE3D7] shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-[#1F1B16]">Google OAuth 2.0 Setup</h3>
            <p className="text-xs md:text-sm text-[#7A6F64]">
              AURA leverages PKCE OAuth flow for client applications with automatic refresh token rotation.
            </p>
            <div className="bg-[#1F1B16] rounded-xl p-4 text-white font-mono text-xs flex items-center justify-between">
              <pre className="text-xs text-[#E8A422]">
{`const { user, session } = await aura.auth.signInWithOAuth({
  provider: 'google',
  redirectTo: 'https://aura.space/dashboard'
});`}
              </pre>
              <button
                onClick={() => handleCopy(`const { user, session } = await aura.auth.signInWithOAuth({\n  provider: 'google',\n  redirectTo: 'https://aura.space/dashboard'\n});`, "auth-code")}
                className="text-[#D1C7BD] hover:text-white p-1 rounded transition-colors"
              >
                {copiedCode === "auth-code" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "b2b",
      title: "B2B Workspace Auth",
      icon: <ShieldCheck className="w-4 h-4 text-[#C17817]" />,
      badge: "Enterprise",
      description: "SAML SSO, Domain Lockdown, and Organization Role RBAC policies.",
      content: (
        <div className="p-6 rounded-2xl bg-white border border-[#EBE3D7] shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-[#1F1B16]">Enterprise Organization Control</h3>
          <p className="text-xs md:text-sm text-[#7A6F64]">
            Enforce custom OAuth redirect domains and restricted SAML authentication for internal company staff.
          </p>
        </div>
      ),
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      icon: <Terminal className="w-4 h-4 text-[#C17817]" />,
      badge: "Power User",
      description: "Global hotkeys for instant search, navigation, and modal toggles.",
      content: (
        <div className="p-6 rounded-2xl bg-white border border-[#EBE3D7] shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-[#1F1B16] mb-4">Hotkey Reference Sheet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDF9F3] border border-[#EADECB]">
              <span className="font-semibold text-[#1F1B16]">Global Semantic Search</span>
              <kbd className="px-2.5 py-1 bg-white border border-[#DDD5C8] rounded-md font-mono text-xs font-bold text-[#1F1B16]">Ctrl + K</kbd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDF9F3] border border-[#EADECB]">
              <span className="font-semibold text-[#1F1B16]">Navigate to Tasks</span>
              <kbd className="px-2.5 py-1 bg-white border border-[#DDD5C8] rounded-md font-mono text-xs font-bold text-[#1F1B16]">G then T</kbd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDF9F3] border border-[#EADECB]">
              <span className="font-semibold text-[#1F1B16]">Navigate to Calendar</span>
              <kbd className="px-2.5 py-1 bg-white border border-[#DDD5C8] rounded-md font-mono text-xs font-bold text-[#1F1B16]">G then C</kbd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDF9F3] border border-[#EADECB]">
              <span className="font-semibold text-[#1F1B16]">Toggle Dark/Light Mode</span>
              <kbd className="px-2.5 py-1 bg-white border border-[#DDD5C8] rounded-md font-mono text-xs font-bold text-[#1F1B16]">Ctrl + Shift + L</kbd>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "customization",
      title: "Component Customization",
      icon: <Settings className="w-4 h-4 text-[#C17817]" />,
      badge: "Theme",
      description: "Tailwind tokens, CSS variables, and layout density options.",
      content: (
        <div className="p-6 rounded-2xl bg-white border border-[#EBE3D7] shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-[#1F1B16]">Customizing Color Tokens</h3>
          <p className="text-xs md:text-sm text-[#7A6F64]">
            Override standard brand theme variables inside your root tailwind config or CSS root scope.
          </p>
        </div>
      ),
    },
  ];

  const currentSection = sections.find((s) => s.id === activeTab) || sections[0];

  return (
    <main className="min-h-screen bg-[#FDFAF6] py-12 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#1F1B16] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#C17817]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF4E7] border border-[#EDD9A3] text-[#C17817] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> AURA Official Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1B16] tracking-tight">
            Developer Guides & Feature Docs
          </h1>
          <p className="text-base text-[#7A6F64]">
            Everything you need to configure authentication, hotkeys, SDKs, and workspace components.
          </p>
        </div>

        {/* Interactive Animated Documentation Layout */}
        <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar Tabs */}
          <div className="bg-white rounded-3xl p-4 border border-[#EBE3D7] shadow-sm space-y-1.5 sticky top-6">
            <div className="px-3 py-2 text-[11px] font-bold text-[#9B8F85] uppercase tracking-wider">
              Documentation Index
            </div>
            {sections.map((s) => {
              const isActive = activeTab === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#FDF4E7] text-[#C17817] shadow-sm border border-[#EDD9A3]"
                      : "text-[#4A3F35] hover:bg-[#FDF9F3] hover:text-[#1F1B16]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {s.icon}
                    <span>{s.title}</span>
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
                key={currentSection.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Section Header */}
                <div className="bg-white rounded-3xl p-8 border border-[#EBE3D7] shadow-sm space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF4E7] text-[#C17817] text-xs font-bold">
                    {currentSection.icon}
                    <span>{currentSection.badge}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#1F1B16]">{currentSection.title}</h2>
                  <p className="text-sm text-[#7A6F64]">{currentSection.description}</p>
                </div>

                {/* Section Body */}
                {currentSection.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
