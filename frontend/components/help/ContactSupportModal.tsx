'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Mail, Phone, Clock, MapPin } from 'lucide-react';

interface ContactSupportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactSupportModal({
  open,
  onClose,
}: ContactSupportModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                <div>
                  <h2 className="text-3xl font-bold text-primary">
                    Contact Support
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    If you experience any issues while using AURA, our support
                    team is here to help.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="rounded-xl border border-border p-6">
                    <Mail className="h-6 w-6 text-primary mb-3" />
                    <h3 className="font-semibold text-lg">
                      Email Support
                    </h3>
                    <p className="mt-2">support@auraworkspace.com</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Send us your questions, feature requests or bug reports.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border p-6">
                    <Phone className="h-6 w-6 text-primary mb-3" />
                    <h3 className="font-semibold text-lg">
                      Phone Support
                    </h3>
                    <p className="mt-2">+91 40 4567 8901</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Monday – Friday • 9:00 AM – 6:00 PM IST
                    </p>
                  </div>

                  <div className="rounded-xl border border-border p-6">
                    <Clock className="h-6 w-6 text-primary mb-3" />
                    <h3 className="font-semibold text-lg">
                      Support Hours
                    </h3>
                    <p className="mt-2">
                      Monday – Friday
                    </p>
                    <p>9:00 AM – 6:00 PM IST</p>
                  </div>

                  <div className="rounded-xl border border-border p-6">
                    <MapPin className="h-6 w-6 text-primary mb-3" />
                    <h3 className="font-semibold text-lg">
                      Office Address
                    </h3>
                    <p className="mt-2">
                      AURA Workspace
                    </p>
                    <p>T-Hub Phase 2</p>
                    <p>Hyderabad, Telangana 500081</p>
                  </div>

                </div>

                <div className="mt-8 rounded-xl border border-border p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    Before Contacting Support
                  </h3>

                  <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                    <li>Check the Help Center for common questions.</li>
                    <li>Use Report a Bug to submit technical issues.</li>
                    <li>Include screenshots whenever possible.</li>
                    <li>Provide detailed steps to reproduce the issue.</li>
                  </ul>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90"
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}