'use client';

import { X } from 'lucide-react';

interface AboutAuraModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutAuraModal({
  open,
  onClose,
}: AboutAuraModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-16">

      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#EADBC8] bg-white shadow-2xl">

        {/* Header */}

        <div className="bg-gradient-to-r from-[#FFF7EF] to-white border-b border-[#EADBC8] px-8 py-7">

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-4xl font-bold text-[#C67A20]">
                About AURA
              </h2>

              <p className="mt-2 max-w-2xl text-gray-600">
                AURA is your all-in-one productivity workspace designed to help
                you manage work, communication, scheduling, and collaboration
                from one unified platform.
              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 transition hover:bg-[#FFF4E8]"
            >
              <X className="h-6 w-6" />
            </button>

          </div>

        </div>

        {/* Body */}

        <div className="max-h-[68vh] overflow-y-auto bg-[#FFFCF8] p-8 space-y-8">

          {/* What is Aura */}

          <section className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-6 shadow-sm">

            <h3 className="text-2xl font-bold text-[#C67A20]">
              What is AURA?
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              AURA is an AI-powered productivity workspace that centralizes
              essential tools into one intuitive dashboard. Instead of switching
              between multiple applications, users can manage tasks, schedules,
              emails, meetings, and documents from one organized workspace,
              helping teams and individuals stay focused and productive.
            </p>

          </section>

          {/* Core Features */}

          <section>

            <h3 className="mb-5 text-2xl font-bold text-[#C67A20]">
              Core Features
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5">
                <h4 className="font-semibold text-lg">
                  Dashboard
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  View today's schedule, productivity summary, and recent
                  activity in one place.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5">
                <h4 className="font-semibold text-lg">
                  Task Management
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Create, organize, prioritize, and monitor daily tasks with
                  ease.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5">
                <h4 className="font-semibold text-lg">
                  Google Calendar
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Schedule meetings, monitor upcoming events, and synchronize
                  calendars.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5">
                <h4 className="font-semibold text-lg">
                  Gmail
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Access emails, organize conversations, and manage
                  communication without leaving AURA.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5">
                <h4 className="font-semibold text-lg">
                  Google Meet
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Join meetings quickly and manage collaboration from your
                  workspace.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5">
                <h4 className="font-semibold text-lg">
                  Notion Integration
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Keep important documents organized and synchronized within
                  your workspace.
                </p>
              </div>

            </div>

          </section>

          {/* Why Choose */}

          <section className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-6 shadow-sm">

            <h3 className="text-2xl font-bold text-[#C67A20]">
              Why Choose AURA?
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              AURA minimizes context switching by bringing your daily workflow
              into one centralized platform. Whether you are planning projects,
              organizing meetings, reviewing emails, or collaborating with your
              team, AURA provides a clean, efficient, and intelligent
              productivity experience.
            </p>

          </section>

          {/* Connected Services */}

          <section>

            <h3 className="mb-5 text-2xl font-bold text-[#C67A20]">
              Connected Services
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5 text-center font-semibold">
                Gmail
              </div>

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5 text-center font-semibold">
                Google Calendar
              </div>

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5 text-center font-semibold">
                Google Meet
              </div>

              <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-5 text-center font-semibold">
                Notion
              </div>

            </div>

          </section>

          {/* Application Info */}

          <section className="rounded-2xl border border-[#EADBC8] bg-[#FFF7EF] p-6 shadow-sm">

            <h3 className="text-2xl font-bold text-[#C67A20]">
              Application Information
            </h3>

            <div className="mt-6 grid gap-6 md:grid-cols-3">

              <div>
                <p className="text-sm text-gray-500">
                  Application
                </p>

                <p className="mt-1 font-semibold">
                  AURA Workspace
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Version
                </p>

                <span className="mt-2 inline-block rounded-full bg-[#C67A20] px-4 py-1 text-sm font-medium text-white">
                  v1.0.0
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span className="mt-2 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                  Stable Release
                </span>
              </div>

            </div>

          </section>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-[#EADBC8] bg-white px-8 py-5">

          <button
            onClick={onClose}
            className="rounded-full bg-[#C67A20] px-8 py-3 font-medium text-white transition duration-300 hover:bg-[#B56F1A]"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}