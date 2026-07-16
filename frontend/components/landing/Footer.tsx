'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Integrations', href: '/login' },
        { label: 'Pricing Plans', href: '#pricing' },
        { label: 'Release Notes', href: '/login' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/login' },
        { label: 'Careers', href: '/login' },
        { label: 'Press Kit', href: '/login' },
        { label: 'Contact', href: '/login' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/login' },
        { label: 'Help Center', href: '#faq' },
        { label: 'Security Scope', href: '/login' },
        { label: 'Privacy Policy', href: '/login' }
      ]
    }
  ];

  const socialLinks = [
    {
      label: 'Twitter',
      href: 'https://twitter.com',
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      label: 'GitHub',
      href: 'https://github.com',
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#FDFBF8] border-t border-[#E8DDD2] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
        
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-6">
          <Link href="/" className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="h-9 w-9 text-[#C17817] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="50" cy="50" r="44" />
              <line x1="15" y1="50" x2="85" y2="50" />
              <path d="M 20 60 Q 35 55 50 60 Q 65 65 80 60" />
              <path d="M 25 70 Q 37 67 50 70 Q 63 73 75 70" />
              <path d="M 30 80 Q 40 78 50 80 Q 60 82 70 80" />
              <circle cx="50" cy="35" r="12" fill="currentColor" fillOpacity="0.15" />
            </svg>
            <span className="text-xl font-bold tracking-wider text-[#1F1B16]">AURA</span>
          </Link>
          <p className="text-xs text-[#6B6258] leading-relaxed max-w-sm">
            AURA is your aggregated productivity environment, organizing notes, integrations, chats, and files inside a modern, fast workspace.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B6258] hover:text-[#C17817] transition-colors duration-300"
                aria-label={social.label}
              >
                {social.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Links Columns */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-xs font-bold text-[#1F1B16] uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-[#6B6258] hover:text-[#C17817] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#E8DDD2]/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-[#6B6258] uppercase tracking-wider">
        <span>&copy; {currentYear} AURA Technology Inc. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/login" className="hover:text-[#C17817] transition-colors">Terms of Service</Link>
          <Link href="/login" className="hover:text-[#C17817] transition-colors">Privacy Policy</Link>
          <Link href="/login" className="hover:text-[#C17817] transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
