'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type KeyboardShortcutsModalProps = {
  open: boolean;
  onClose: () => void;
};

const shortcuts = [
  { key: 'Ctrl + K', action: 'Open global search' },
  { key: 'G → T', action: 'Go to Tasks' },
  { key: 'G → C', action: 'Go to Calendar' },
  { key: 'G → M', action: 'Go to Messages' },
  { key: 'G → D', action: 'Go to Documents' },
];

export default function KeyboardShortcutsModal({
  open,
  onClose,
}: KeyboardShortcutsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              max-w-xl
              rounded-2xl
              bg-white
              border
              border-[#EADBC8]
              shadow-[0_30px_80px_rgba(0,0,0,0.18)]
              overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EADBC8] px-6 py-5">
              <h2 className="text-xl font-semibold text-[#C67A20]">
                Keyboard Shortcuts
              </h2>

              <button
                onClick={onClose}
                className="rounded-lg p-2 transition hover:bg-[#F9F5EF]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3 p-6">
              {shortcuts.map((item) => (
                <div
                  key={item.key}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-[#EFE4D6]
                    bg-[#FFFCF8]
                    px-4
                    py-3
                    transition
                    hover:border-[#D9B78F]
                    hover:bg-[#FFF7ED]
                  "
                >
                  <span className="text-sm font-medium text-gray-700">
                    {item.action}
                  </span>

                  <kbd
                    className="
                      rounded-lg
                      border
                      border-[#EADBC8]
                      bg-white
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-[#7A6B58]
                      shadow-sm
                    "
                  >
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-[#EADBC8] px-6 py-4">
              <button
                onClick={onClose}
                className="
                  rounded-full
                  bg-[#C67A20]
                  px-6
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-[#B56F1A]
                "
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}