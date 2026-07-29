'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Sparkles, Shield } from "lucide-react";
import Navbar from "@/components/landing/Navbar";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      tagline: "Ideal for individuals starting out.",
      price: "$0",
      period: "forever free",
      highlight: false,
      buttonText: "Get Started Free",
      href: "/signup",
      features: [
        "Task Management",
        "Basic Calendar Sync",
        "50 AI Queries / mo",
        "2 App Integrations",
      ],
    },
    {
      name: "Pro Professional",
      tagline: "For power users needing full AI integration.",
      price: "$19",
      period: "per month",
      highlight: true,
      buttonText: "Start 14-Day Free Trial",
      href: "/signup",
      features: [
        "Everything in Starter",
        "Unlimited AI Assistant",
        "Real-time Gmail & Notion Sync",
        "Smart Meeting Scheduling",
      ],
    },
    {
      name: "Team Enterprise",
      tagline: "Collaborative features for teams.",
      price: "$49",
      period: "per seat / mo",
      highlight: false,
      buttonText: "Contact Sales",
      href: "/signup",
      features: [
        "Everything in Pro",
        "Shared Team Workspaces",
        "Admin Portal & Role Controls",
        "Custom API & Webhooks",
      ],
    },
  ];

  return (
    <>
    <Navbar />
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-[#FDFAF6] pt-28 pb-10 px-6 max-w-7xl mx-auto flex flex-col justify-between"
    >
      <div>
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
            <Sparkles className="w-3.5 h-3.5" /> Workspace Plans
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1F1B16] tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xs md:text-sm text-[#7A6F64]">
            Supercharge your workflow. Switch or cancel anytime.
          </p>
        </div>

        {/* Compact Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-6 transition-all flex flex-col justify-between ${
                plan.highlight
                  ? "bg-white border-2 border-[#C17817] shadow-lg scale-105"
                  : "bg-white border border-[#EBE3D7] shadow-sm"
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-[#1F1B16]">{plan.name}</h3>
                <p className="text-xs text-[#7A6F64] mt-1">{plan.tagline}</p>
                <div className="mt-4 mb-4 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-[#1F1B16]">{plan.price}</span>
                  <span className="text-[11px] text-[#8C8074]">{plan.period}</span>
                </div>
                <div className="space-y-2 border-t border-[#F2ECE3] pt-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#4A3F35]">
                      <Check className="w-3.5 h-3.5 text-[#C17817]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-2">
                <Link
                  href={plan.href}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs text-center block transition-all ${
                    plan.highlight
                      ? "bg-[#C17817] text-white hover:bg-[#A86510]"
                      : "bg-[#1F1B16] text-white hover:bg-[#383028]"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
    </>
  );
}
