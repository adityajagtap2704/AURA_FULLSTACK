'use client';
import Link from 'next/link';


const PRODUCT_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pricing', href: '#pricing' },
];
const COMPANY_LINKS = [
  { label: 'About Us', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Contact', href: '#' },
];
const RESOURCE_LINKS = [
  { label: 'Help Center', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Status', href: '#' },
];
const SOCIAL_LINKS = [
  {
    label: 'Twitter',
    href: '#',
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: 'LinkedIn',
    href: '#',
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>,
  },
  {
    label: 'GitHub',
    href: '#',
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>,
  },
  {
    label: 'Instagram',
    href: '#',
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#FDFBF8] border-t border-[#F0EBE3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#F0EBE3]">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C17817] to-[#E8A422] flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.5" />
                  <path d="M12 4C12 4 8 8 8 12C8 16 12 20 12 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 4C12 4 16 8 16 12C16 16 12 20 12 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-lg font-bold text-[#1F1B16]">AURA</span>
            </div>
            <p className="text-sm text-[#6B6258] leading-relaxed max-w-xs">
              Your all-in-one productivity hub, powered by AI.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 mt-6">
              {SOCIAL_LINKS.map(({ svg, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-white border border-[#F0EBE3] flex items-center justify-center text-[#6B6258] hover:text-[#C17817] hover:border-[#C17817]/30 hover:bg-[#FDF6EC] transition-all duration-200 shadow-sm"
              >
                {svg}
              </a>
            ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-bold text-[#1F1B16] mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#6B6258] hover:text-[#C17817] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-[#1F1B16] mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#6B6258] hover:text-[#C17817] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-[#1F1B16] mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#6B6258] hover:text-[#C17817] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9B8F85]">
            © 2025 AURA by Kalvr. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#9B8F85] hover:text-[#C17817] transition-colors">Privacy</a>
            <a href="#" className="text-xs text-[#9B8F85] hover:text-[#C17817] transition-colors">Terms</a>
            <a href="#" className="text-xs text-[#9B8F85] hover:text-[#C17817] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
