'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';

const EFFECTIVE_DATE = 'August 2, 2026';
const SUPPORT_EMAIL = 'support@auraworkspace.com';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EBE3D7] shadow-sm">
      <h2 className="text-lg md:text-xl font-bold text-[#1F1B16] mb-3">
        {title}
      </h2>
      <div className="text-sm text-[#4A4139] leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

export default function TermsOfServicePage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen w-full bg-[#FDFAF6]"
    >
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#1F1B16] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#C17817]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF4E7] border border-[#EDD9A3] text-[#C17817] text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" /> Terms of Service
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F1B16] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs md:text-sm text-[#7A6F64]">
            Effective date: {EFFECTIVE_DATE}
          </p>
        </div>

        <div className="space-y-6">
          <Section title="1. Acceptance of terms">
            <p>
              By creating an account or using AURA (&quot;the
              Service&quot;), operated by Kalnet (&quot;we&quot;,
              &quot;us&quot;), you agree to these Terms of Service. If you
              do not agree, do not use the Service.
            </p>
          </Section>

          <Section title="2. Description of service">
            <p>
              AURA is a productivity workspace that aggregates your tasks,
              calendar events, and messages from connected third-party
              accounts (such as Google and Notion) into a single dashboard,
              with AI-assisted search across your connected data.
            </p>
          </Section>

          <Section title="3. Your account">
            <p>
              You are responsible for maintaining the confidentiality of
              your account credentials and for all activity under your
              account. You must provide accurate information when creating
              an account.
            </p>
          </Section>

          <Section title="4. Third-party integrations">
            <p>
              AURA connects to third-party services, including Google
              (Gmail, Calendar) and Notion, using access you explicitly
              grant through each provider&apos;s own authorization screen.
              Your use of those integrations is also subject to the
              respective third party&apos;s own terms of service. We are
              not responsible for the availability or behavior of
              third-party services.
            </p>
            <p>
              You may disconnect any integration at any time from your
              account settings.
            </p>
          </Section>

          <Section title="5. Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Use the Service for any unlawful purpose.</li>
              <li>
                Attempt to gain unauthorized access to the Service, other
                accounts, or connected systems.
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of
                the Service.
              </li>
              <li>
                Use automated means to access the Service outside of any
                interfaces we provide, without our written permission.
              </li>
            </ul>
          </Section>

          <Section title="6. Subscriptions and pricing">
            <p>
              Some features of AURA may require a paid subscription, as
              described on our{' '}
              <Link href="/pricing" className="text-[#C17817] underline">
                pricing page
              </Link>
              . Pricing and features are subject to change; we will provide
              reasonable notice of material changes affecting existing
              subscribers.
            </p>
          </Section>

          <Section title="7. Intellectual property">
            <p>
              The Service, including its design, branding, and underlying
              software, is owned by us and protected by applicable
              intellectual property laws. You retain ownership of the data
              you connect to AURA (such as your Google or Notion content);
              we do not claim ownership over it.
            </p>
          </Section>

          <Section title="8. Termination">
            <p>
              You may stop using the Service and delete your account at any
              time. We may suspend or terminate access to the Service if we
              reasonably believe you have violated these Terms, or to
              protect the security or integrity of the Service.
            </p>
          </Section>

          <Section title="9. Disclaimers">
            <p>
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot;, without warranties of any kind, express or
              implied. We do not guarantee that the Service will be
              uninterrupted, error-free, or that any connected third-party
              data will always be accurate or available.
            </p>
          </Section>

          <Section title="10. Limitation of liability">
            <p>
              To the maximum extent permitted by law, we will not be liable
              for any indirect, incidental, special, or consequential
              damages arising from your use of the Service.
            </p>
          </Section>

          <Section title="11. Changes to these terms">
            <p>
              We may update these Terms from time to time. Continued use of
              the Service after changes take effect constitutes acceptance
              of the updated Terms.
            </p>
          </Section>

          <Section title="12. Contact us">
            <p>
              Questions about these Terms? Email us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[#C17817] underline"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </motion.main>
  );
}
