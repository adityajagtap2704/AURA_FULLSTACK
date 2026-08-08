'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, X, Sparkles } from 'lucide-react';

const HINT_DISMISSED_KEY = 'aura-command-center-hint-dismissed';

export default function CommandCenterHint() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has dismissed the hint
    try {
      const dismissed = localStorage.getItem(HINT_DISMISSED_KEY);
      if (!dismissed) {
        // Show hint after 2 seconds
        const timer = setTimeout(() => setShow(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error('Failed to check hint status:', e);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(HINT_DISMISSED_KEY, 'true');
    } catch (e) {
      console.error('Failed to save hint status:', e);
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-background/50 transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Content */}
            <div className="p-6 pr-12">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center">
                  <Command className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                    New: Command Center
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Press{' '}
                    <kbd className="px-1.5 py-0.5 bg-background/50 border border-border rounded text-[10px] font-semibold">
                      Ctrl/⌘ K
                    </kbd>{' '}
                    to access all commands, navigation, and actions in one place.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4 space-y-2 pl-13">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span>Quick navigation & search</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span>AI-powered actions</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span>Context-aware commands</span>
                </div>
              </div>
            </div>

            {/* Gradient shimmer effect */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{
                  x: ['0%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                style={{ width: '50%' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
