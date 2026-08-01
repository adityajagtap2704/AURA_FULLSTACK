'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import Link from 'next/link';

import { AuraLogoIcon } from '@/components/icons/ServiceIcons';

const SPRING: Transition = { type: 'spring', stiffness: 180, damping: 24, mass: 0.8 };
const MotionLink = motion.create(Link);

/* --------------------------------- NAVBAR (Clerk-style Pill Dropdown) --------------------------------- */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Swap to a dark palette only while the navbar pill's own DOM rect is
  // physically overlapping a `[data-navbar-theme="dark"]` section (e.g. the
  // dark AI panel), Clerk.com-style. This is a direct getBoundingClientRect
  // overlap test between the navbar and each target — not an approximated
  // IntersectionObserver rootMargin band — so the swap fires exactly when
  // the pill's top/bottom bounds cross the section's top/bottom bounds,
  // instead of early (as soon as the section nears the viewport) or late
  // (only once it's mostly scrolled past).
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-navbar-theme="dark"]'));
    if (!targets.length || !headerRef.current) return;

    let ticking = false;

    const checkOverlap = () => {
      ticking = false;
      const navRect = headerRef.current?.getBoundingClientRect();
      if (!navRect) return;

      const isDark = targets.some((target) => {
        const rect = target.getBoundingClientRect();
        return navRect.bottom > rect.top && navRect.top < rect.bottom;
      });

      setTheme(isDark ? 'dark' : 'light');
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkOverlap);
    };

    checkOverlap();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const isDark = theme === 'dark';

  const pillClass = isDark
    ? scrolled
      ? 'bg-[#1A1A1A]/90 backdrop-blur-xl border-[#2E2A24] shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
      : 'bg-[#1A1A1A]/75 backdrop-blur-md border-[#2E2A24]'
    : scrolled
      ? 'bg-white/90 backdrop-blur-xl border-[#E5DDD0] shadow-[0_12px_40px_rgba(31,27,22,0.1)]'
      : 'bg-white/80 backdrop-blur-md border-[#EAE3DA]';

  const logoTextClass = isDark ? 'text-white' : 'text-[#1F1B16]';

  const navLinkClass = (active: boolean) =>
    isDark
      ? active
        ? 'text-[#F0C674] bg-white/10'
        : 'text-[#D9CFC2] hover:text-white hover:bg-white/10'
      : active
        ? 'text-[#C17817] bg-[#FDF4E7]'
        : 'text-[#4A3F35] hover:text-[#1F1B16] hover:bg-[#F7F2EC]';

  const chevronIdleClass = isDark ? 'text-[#8C8074]' : 'text-[#9B8F85]';

  const signInClass = isDark
    ? 'text-[#D9CFC2] hover:text-white hover:bg-white/10'
    : 'text-[#4A3F35] hover:text-[#1F1B16] hover:bg-[#F7F2EC]';

  const hamburgerClass = isDark
    ? 'text-[#D9CFC2] hover:bg-white/10'
    : 'text-[#4A3F35] hover:bg-[#F7F2EC]';

  const handleMouseEnter = (menuName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  // Nav menus data
  const navMenus = [
    {
      id: 'products',
      label: 'Products',
      hasDropdown: true,
      content: (
        <div className="w-[520px] p-5 grid grid-cols-2 gap-4 bg-white rounded-2xl border border-[#EBE3D7] shadow-[0_20px_50px_rgba(31,27,22,0.12)]">
          <div className="col-span-2 pb-2 border-b border-[#F2ECE3] flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#9B8F85] uppercase">Core Platform Features</span>
            <Link href="/products" className="text-[11px] font-semibold text-[#C17817] hover:underline">Explore All →</Link>
          </div>
          <Link href="/products" className="flex gap-3 p-2.5 rounded-xl hover:bg-[#FDF9F3] transition-all group">
            <div className="w-9 h-9 rounded-lg bg-[#FDF4E7] border border-[#EDD9A3] flex items-center justify-center text-[#C17817] group-hover:scale-105 transition-transform shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 022 2h2a2 2 0 022-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#1F1B16] group-hover:text-[#C17817] transition-colors">Task Management</div>
              <div className="text-[11px] text-[#7A6F64] leading-snug">Organize, prioritize, and track your daily tasks effortlessly.</div>
            </div>
          </Link>

          <Link href="/products" className="flex gap-3 p-2.5 rounded-xl hover:bg-[#FDF9F3] transition-all group">
            <div className="w-9 h-9 rounded-lg bg-[#FDF4E7] border border-[#EDD9A3] flex items-center justify-center text-[#C17817] group-hover:scale-105 transition-transform shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#1F1B16] group-hover:text-[#C17817] transition-colors">Smart Calendar</div>
              <div className="text-[11px] text-[#7A6F64] leading-snug">Sync Google Calendar & scheduling in one clear view.</div>
            </div>
          </Link>

          <Link href="/products" className="flex gap-3 p-2.5 rounded-xl hover:bg-[#FDF9F3] transition-all group">
            <div className="w-9 h-9 rounded-lg bg-[#FDF4E7] border border-[#EDD9A3] flex items-center justify-center text-[#C17817] group-hover:scale-105 transition-transform shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#1F1B16] group-hover:text-[#C17817] transition-colors">Unified Inbox</div>
              <div className="text-[11px] text-[#7A6F64] leading-snug">Connect Gmail and process emails faster with AI hints.</div>
            </div>
          </Link>

          <Link href="/products" className="flex gap-3 p-2.5 rounded-xl hover:bg-[#FDF9F3] transition-all group">
            <div className="w-9 h-9 rounded-lg bg-[#FDF4E7] border border-[#EDD9A3] flex items-center justify-center text-[#C17817] group-hover:scale-105 transition-transform shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#1F1B16] group-hover:text-[#C17817] transition-colors">AI Assistant</div>
              <div className="text-[11px] text-[#7A6F64] leading-snug">Query your connected notes, tasks & workspace instantly.</div>
            </div>
          </Link>

          <div className="col-span-2 bg-[#FAF5EE] rounded-xl p-3 flex items-center justify-between border border-[#EADECB]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#C17817] animate-ping" />
              <span className="text-[12px] font-medium text-[#4A3F35]">Looking for team workspace plans?</span>
            </div>
            <Link href="/pricing" className="text-[12px] font-bold text-[#C17817] hover:text-[#A86510]">
              View Pricing →
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'docs',
      label: 'Docs',
      hasDropdown: true,
      content: (
        <div className="w-[460px] p-5 grid grid-cols-2 gap-4 bg-white rounded-2xl border border-[#EBE3D7] shadow-[0_20px_50px_rgba(31,27,22,0.12)]">
          <div className="col-span-1 border-r border-[#F2ECE3] pr-3 space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-[#9B8F85] uppercase block mb-1">Top SDKs & Tools</span>
            {[
              { name: 'Next.js Sync', desc: 'App Router ready', href: '/docs' },
              { name: 'Google OAuth', desc: 'Secure Authentication', href: '/docs' },
              { name: 'Notion Sync', desc: 'Live Database Sync', href: '/docs' },
              { name: 'REST API', desc: 'Full API Access', href: '/docs' },
            ].map((sdk) => (
              <Link key={sdk.name} href={sdk.href} className="block p-2 rounded-lg hover:bg-[#FDF9F3] transition-all">
                <div className="text-[12.5px] font-bold text-[#1F1B16]">{sdk.name}</div>
                <div className="text-[10.5px] text-[#8C8074]">{sdk.desc}</div>
              </Link>
            ))}
          </div>

          <div className="col-span-1 space-y-2 pl-1">
            <span className="text-[11px] font-bold tracking-wider text-[#9B8F85] uppercase block mb-1">Featured Docs</span>
            {[
              { title: 'Quickstarts & Tutorials', href: '/docs' },
              { title: 'Authentication Setup', href: '/docs' },
              { title: 'B2B Workspace Auth', href: '/docs' },
              { title: 'Keyboard Shortcuts', href: '/docs' },
              { title: 'Component Customization', href: '/docs' },
            ].map((doc) => (
              <Link key={doc.title} href={doc.href} className="block p-1.5 text-[12px] font-medium text-[#4A3F35] hover:text-[#C17817] transition-colors">
                {doc.title}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/docs" className="w-full py-2 px-3 bg-[#FDF4E7] border border-[#EDD9A3] text-[#C17817] text-[11.5px] font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-[#FBECD6] transition-colors">
                Go to AURA Docs →
              </Link>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'integrations',
      label: 'Integrations',
      hasDropdown: true,
      content: (
        <div className="w-[380px] p-4 bg-white rounded-2xl border border-[#EBE3D7] shadow-[0_20px_50px_rgba(31,27,22,0.12)] space-y-3">
          <span className="text-[11px] font-bold tracking-wider text-[#9B8F85] uppercase block px-1">Connect Your Apps</span>
          <div className="space-y-1">
            {[
              { name: 'Google Workspace', desc: 'Gmail & Google Calendar real-time sync', icon: '🌐', href: '/integrations' },
              { name: 'Notion Sync', desc: 'Import pages, databases & workspaces', icon: '📝', href: '/integrations' },
              { name: 'Google Meet', desc: 'Instant video meeting scheduling', icon: '📹', href: '/integrations' },
              { name: 'AI Knowledge Base', desc: 'Vector embeddings & semantic search', icon: '⚡', href: '/products' },
            ].map((item) => (
              <Link key={item.name} href={item.href} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FDF9F3] transition-all group">
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <div>
                  <div className="text-[12.5px] font-bold text-[#1F1B16] group-hover:text-[#C17817] transition-colors">{item.name}</div>
                  <div className="text-[10.5px] text-[#7A6F64]">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'company',
      label: 'Company',
      hasDropdown: true,
      content: (
        <div className="w-[320px] p-4 bg-white rounded-2xl border border-[#EBE3D7] shadow-[0_20px_50px_rgba(31,27,22,0.12)] space-y-2">
          <span className="text-[11px] font-bold tracking-wider text-[#9B8F85] uppercase block px-1">About AURA</span>
          {[
            { label: 'About Us', href: '/company', sub: 'Learn about Kalnet & our mission' },
            { label: 'AI Digest & Updates', href: '/products', sub: 'Latest product announcements' },
            { label: 'Help & Support', href: '/help', sub: 'Guides & shortcut directory' },
            { label: 'Pricing & Plans', href: '/pricing', sub: 'Flexible workspace tiers' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="block p-2 rounded-xl hover:bg-[#FDF9F3] transition-all group">
              <div className="text-[12.5px] font-bold text-[#1F1B16] group-hover:text-[#C17817] transition-colors">{item.label}</div>
              <div className="text-[10.5px] text-[#7A6F64]">{item.sub}</div>
            </Link>
          ))}
        </div>
      )
    },
    {
      id: 'pricing',
      label: 'Pricing',
      hasDropdown: false,
      href: '/pricing'
    }
  ];

  return (
    <motion.header
      ref={headerRef}
      animate={{ y: scrolled ? -10 : 0 }}
      transition={SPRING}
      className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 md:px-8 pointer-events-none"
    >
      {/* Clerk Floating Pill Container - Wider Horizontally */}
      <div className={`pointer-events-auto transition-all duration-300 rounded-full border px-6 py-2.5 flex items-center justify-between gap-6 md:gap-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-full max-w-5xl ${pillClass}`}>

        {/* Logo */}
        <MotionLink
          href="/"
          whileHover={{ scale: 1.02 }}
          transition={SPRING}
          className="flex items-center gap-2 shrink-0 pl-1 group"
        >
          <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
            <AuraLogoIcon className="w-full h-full text-[#C17817]" />
          </div>
          <span className={`text-[16px] font-extrabold tracking-tight ${logoTextClass}`}>AURA</span>
        </MotionLink>

        {/* Desktop Nav Items with Framer Motion Floating Dropdowns */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          {navMenus.map((menu) => (
            <div
              key={menu.id}
              className="relative"
              onMouseEnter={() => menu.hasDropdown && handleMouseEnter(menu.id)}
              onMouseLeave={handleMouseLeave}
            >
              {menu.hasDropdown ? (
                <button
                  className={`px-4 py-1.5 text-[13.5px] font-semibold rounded-full flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 ${navLinkClass(activeMenu === menu.id)}`}
                >
                  {menu.label}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeMenu === menu.id ? 'rotate-180 text-[#C17817]' : chevronIdleClass
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <Link
                  href={menu.href || '#'}
                  className={`px-4 py-1.5 text-[13.5px] font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 ${navLinkClass(false)}`}
                >
                  {menu.label}
                </Link>
              )}

              {/* Animated Floating Dropdown Panel */}
              <AnimatePresence>
                {activeMenu === menu.id && menu.content && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
                  >
                    {menu.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden md:flex items-center gap-3 pr-1">
          <MotionLink
            href="/login"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING}
            className={`px-4 py-1.5 text-[13px] font-bold rounded-full transition-all ${signInClass}`}
          >
            Sign In
          </MotionLink>
          <MotionLink
            href="/signup"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING}
            className="px-5 py-1.5 text-[13px] font-bold text-white bg-[#1F1B16] hover:bg-[#C17817] rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1 group whitespace-nowrap"
          >
            Start building
            <span className="group-hover:translate-x-0.5 transition-transform text-xs">▸</span>
          </MotionLink>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className={`md:hidden p-2 rounded-full transition-colors ${hamburgerClass}`}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-3 p-5 bg-white rounded-2xl border border-[#EBE3D7] shadow-xl md:hidden flex flex-col gap-3 z-50"
            >
              <div className="flex flex-col gap-2">
                <Link href="/products" className="text-sm font-bold text-[#1F1B16] py-1" onClick={() => setMobileOpen(false)}>Products & Features</Link>
                <Link href="/integrations" className="text-sm font-bold text-[#1F1B16] py-1" onClick={() => setMobileOpen(false)}>Integrations</Link>
                <Link href="/company" className="text-sm font-bold text-[#1F1B16] py-1" onClick={() => setMobileOpen(false)}>Company & Mission</Link>
                <Link href="/pricing" className="text-sm font-bold text-[#1F1B16] py-1" onClick={() => setMobileOpen(false)}>Pricing & Plans</Link>
                <Link href="/docs" className="text-sm font-bold text-[#1F1B16] py-1" onClick={() => setMobileOpen(false)}>Docs & Documentation</Link>
              </div>

              <div className="pt-3 border-t border-[#F2ECE3] flex gap-2">
                <Link href="/login" className="flex-1 text-center py-2 text-xs font-bold text-[#1F1B16] border border-[#DDD5C8] rounded-full" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/signup" className="flex-1 text-center py-2 text-xs font-bold text-white bg-[#C17817] rounded-full" onClick={() => setMobileOpen(false)}>Start building</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
