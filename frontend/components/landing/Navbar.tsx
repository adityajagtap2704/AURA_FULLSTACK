'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Why AURA', href: '#why-aura' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FDFBF8]/80 backdrop-blur-md border-b border-[#E8DDD2] shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-0.5">
            <svg viewBox="0 0 100 100" className="h-9 w-9 text-[#C17817] shrink-0 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="50" cy="50" r="44" />
              <line x1="15" y1="50" x2="85" y2="50" />
              <path d="M 20 60 Q 35 55 50 60 Q 65 65 80 60" />
              <path d="M 25 70 Q 37 67 50 70 Q 63 73 75 70" />
              <path d="M 30 80 Q 40 78 50 80 Q 60 82 70 80" />
              <circle cx="50" cy="35" r="12" fill="currentColor" fillOpacity="0.15" />
              <line x1="50" y1="12" x2="50" y2="18" />
              <line x1="28" y1="20" x2="33" y2="24" />
              <line x1="72" y1="20" x2="67" y2="24" />
              <line x1="20" y1="40" x2="26" y2="40" />
              <line x1="80" y1="40" x2="74" y2="40" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider text-[#1F1B16]">AURA</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollClick(e, link.href)}
              className="text-sm font-medium text-[#6B6258] hover:text-[#C17817] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[#C17817] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#6B6258] hover:text-[#1F1B16] px-4 py-2 rounded-xl transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold text-white bg-gradient-to-r from-[#C17817] to-[#D89A3E] hover:from-[#b06d15] hover:to-[#ca8f35] px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[#6B6258] hover:text-[#1F1B16] focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#FDFBF8] border-b border-[#E8DDD2]"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollClick(e, link.href)}
                  className="text-sm font-semibold text-[#6B6258] hover:text-[#C17817] transition-colors py-2 border-b border-[#E8DDD2]/50"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/login"
                  className="text-center text-sm font-semibold text-[#6B6258] hover:text-[#1F1B16] py-2 rounded-xl border border-[#E8DDD2]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-center text-sm font-bold text-white bg-gradient-to-r from-[#C17817] to-[#D89A3E] py-2.5 rounded-xl shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
