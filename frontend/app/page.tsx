'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import WhyChooseSection from '@/components/landing/WhyChooseSection';
import DashboardPreview from '@/components/landing/DashboardPreview';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Elegant loading splash matching design palette
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FDFBF8] text-[#1F1B16] font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C17817] border-t-transparent"></div>
          <p className="text-sm font-bold text-[#6B6258] animate-pulse uppercase tracking-wider">Initializing AURA...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, hide landing page content (redirecting in progress)
  if (user) {
    return null;
  }

  return (
    <div className="bg-[#FDFBF8] text-[#1F1B16] font-sans min-h-screen flex flex-col selection:bg-[#C17817]/20 selection:text-[#1F1B16]">
      {/* Sticky Top Header */}
      <Navbar />

      {/* Main Page Flow Sections */}
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WhyChooseSection />
        <DashboardPreview />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>

      {/* Multi-column Footer */}
      <Footer />
    </div>
  );
}
