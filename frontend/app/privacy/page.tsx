'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

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

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F1B16] tracking-tight">
            Your data, handled responsibly
          </h1>
          <p className="text-xs md:text-sm text-[#7A6F64]">
            Effective date: {EFFECTIVE_DATE}
          </p>
        </div>

        <div className="space-y-6">
          <Section title="1. Who we are">
            <p>
              AURA (&quot;AURA&quot;, &quot;we&quot;, &quot;us&quot;) is a
              productivity workspace that unifies your tasks, calendar, and
              messages into a single dashboard, operated by Kalnet. This
              Privacy Policy explains what information we collect, why we
              collect it, and how you can control it.
            </p>
          </Section>

          <Section title="2. Information we collect">
            <p>
              <strong>Account information.</strong> When you sign up, we
              collect your name and email address via our authentication
              provider (Supabase) or through Google Sign-In.
            </p>
            <p>
              <strong>Google account data.</strong> If you connect Google,
              we access, with your explicit consent through Google&apos;s
              OAuth consent screen:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>
                <strong>Google Calendar (read-only)</strong> — event titles,
                times, locations, and descriptions, used to show your
                schedule inside AURA and make it searchable.
              </li>
              <li>
                <strong>Gmail (read-only)</strong> — message metadata and
                content, used to surface and search your messages inside
                AURA. We do not send email, delete email, or modify your
                mailbox in any way.
              </li>
            </ul>
            <p>
              <strong>Notion data.</strong> If you connect Notion, we access
              only the pages and databases you explicitly select and share
              with the AURA integration through Notion&apos;s own
              authorization screen.
            </p>
            <p>
              <strong>Usage data.</strong> We collect basic technical data
              (such as log data and job execution status) to operate,
              monitor, and troubleshoot the service.
            </p>
          </Section>

          <Section title="3. How we use your information">
            <p>We use the information above solely to:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>
                Display your tasks, calendar events, and messages in one
                unified dashboard.
              </li>
              <li>
                Generate search embeddings so you can search across your
                connected data from within AURA. This processing happens on
                our own servers — your content is not sent to a third-party
                AI API for this purpose.
              </li>
              <li>Keep your connected accounts in sync.</li>
              <li>Maintain the security and reliability of the service.</li>
            </ul>
          </Section>

          <Section title="4. Google user data — Limited Use disclosure">
            <p>
              AURA&apos;s use and transfer of information received from
              Google APIs adheres to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-[#C17817] underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. Specifically:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>
                We only request read-only access to Gmail and Calendar data
                needed to power the features described in this policy.
              </li>
              <li>
                We do not use Google user data to serve advertisements.
              </li>
              <li>
                We do not sell Google user data, and we do not transfer it
                to third parties except where necessary to provide or
                improve the features you use, to comply with the law, or as
                part of a merger, acquisition, or sale of assets (with
                notice to you).
              </li>
              <li>
                We do not allow humans to read your Gmail or Calendar data,
                except in the narrow cases permitted by Google&apos;s
                policy: with your explicit consent, for security purposes
                (e.g. investigating abuse), or to comply with applicable
                law.
              </li>
            </ul>
          </Section>

          <Section title="5. Where your data is stored">
            <p>
              Account and application data is stored in Supabase (PostgreSQL).
              Background sync and embedding jobs are processed by our worker
              service, using Redis solely as a transient job queue — Redis
              does not retain your data after a job completes.
            </p>
          </Section>

          <Section title="6. Data retention and deletion">
            <p>
              We retain your data for as long as your account is active or
              as needed to provide the service. You can disconnect Google or
              Notion at any time from your account settings, which stops
              further access immediately. To request full deletion of your
              account and associated data, email us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[#C17817] underline"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="7. Your rights">
            <p>
              Depending on your location, you may have the right to access,
              correct, export, or delete your personal data, and to withdraw
              consent for Google or Notion access at any time. To exercise
              any of these rights, contact us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[#C17817] underline"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="8. Children's privacy">
            <p>
              AURA is not directed to children under 13 (or the minimum age
              required in your jurisdiction), and we do not knowingly
              collect data from them.
            </p>
          </Section>

          <Section title="9. Changes to this policy">
            <p>
              We may update this policy from time to time. Material changes
              will be reflected by updating the effective date above.
            </p>
          </Section>

          <Section title="10. Contact us">
            <p>
              Questions about this policy or your data? Email us at{' '}
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
