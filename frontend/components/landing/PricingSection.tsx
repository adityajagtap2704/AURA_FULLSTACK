'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Essential organization tools for solo creators starting out.',
      features: [
        'Standard task dashboard',
        'Google Calendar sync (1 account)',
        'Basic calendar task extraction',
        '50 MB cloud file storage',
        'Core analytics dashboard',
      ],
      cta: 'Get Started',
      href: '/signup',
      popular: false,
      color: 'bg-white border-[#E8DDD2] text-[#1F1B16]'
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      description: 'Supercharge your daily output with full integrations and AI actions.',
      features: [
        'Everything in Free',
        'Notion, Gmail, & Google Calendar connectors',
        'AI chat assistant & daily brief summary',
        '10 GB secure cloud storage',
        'Advanced performance & bottlenecks analytics',
        'Priority developer support',
      ],
      cta: 'Get Started with Pro',
      href: '/signup',
      popular: true,
      color: 'bg-white border-[#C17817] ring-2 ring-[#C17817]/20 text-[#1F1B16]'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored support',
      description: 'Complete custom integrations and administrative security compliance.',
      features: [
        'Everything in Pro',
        'Unlimited AI chat commands',
        'Custom workspace background skins',
        'VPC cloud dedicated deployment',
        'SSO, SAML, & custom RBAC options',
        'Dedicated 24/7 account manager',
      ],
      cta: 'Contact Sales',
      href: '/login', // redirects to sales / contact
      popular: false,
      color: 'bg-white border-[#E8DDD2] text-[#1F1B16]'
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-[#F7F2EC]/40 relative overflow-hidden">
      {/* Decorative floating blur circles */}
      <div className="absolute top-[10%] right-[-10%] w-[35%] h-[35%] bg-[#D89A3E]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-[#C17817]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-[11px] font-bold text-[#C17817] uppercase tracking-widest bg-[#F3E3C9] px-3.5 py-1.5 rounded-full">
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1B16] tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-sm text-[#6B6258] leading-relaxed">
            Choose the plan that matches your current workflow. No hidden setup fees or long-term contracts.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`rounded-[2.5rem] p-8 border flex flex-col justify-between relative shadow-sm hover:shadow-[0_20px_40px_rgba(31,27,22,0.06)] hover:-translate-y-1 transition-all duration-300 ${tier.color}`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#C17817] text-white text-[9px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              {/* Tier Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#1F1B16] tracking-tight">{tier.name}</h3>
                  <p className="text-xs text-[#6B6258] mt-2 leading-relaxed">{tier.description}</p>
                </div>

                <div className="border-y border-[#E8DDD2]/60 py-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#1F1B16] tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-[10px] font-bold text-[#6B6258] uppercase tracking-wider">
                    / {tier.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#F3E3C9]/60 text-[#C17817] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-[#6B6258] leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action CTA Button */}
              <div className="pt-8">
                <Link
                  href={tier.href}
                  className={`w-full group flex items-center justify-center gap-2 text-xs font-bold py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-[#C17817] to-[#D89A3E] hover:from-[#b06d15] hover:to-[#ca8f35] text-white shadow-sm hover:shadow-md'
                      : 'bg-[#F7F2EC] hover:bg-[#E8DDD2]/60 text-[#1F1B16] border border-[#E8DDD2]'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
