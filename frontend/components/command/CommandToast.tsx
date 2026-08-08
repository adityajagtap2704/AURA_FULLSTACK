'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastIdCounter = 0;
const toastListeners = new Set<(toast: Toast) => void>();

export function showCommandToast(message: string, type: ToastType = 'info') {
  const toast: Toast = {
    id: `toast-${toastIdCounter++}`,
    message,
    type,
  };
  toastListeners.forEach(listener => listener(toast));
}

export default function CommandToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const addToast = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
    };

    toastListeners.add(addToast);
    return () => {
      toastListeners.delete(addToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-6 right-6 z-[100001] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = toast.type === 'success' 
            ? CheckCircle2 
            : toast.type === 'error' 
            ? XCircle 
            : Info;

          const bgColor = toast.type === 'success'
            ? 'bg-green-500'
            : toast.type === 'error'
            ? 'bg-red-500'
            : 'bg-blue-500';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <div className="flex items-center gap-3 rounded-3xl border border-border bg-card px-4 py-3 text-card-foreground shadow-[0_24px_64px_rgba(0,0,0,0.35)] min-w-[300px] max-w-md">
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    toast.type === 'success'
                      ? 'text-emerald-400'
                      : toast.type === 'error'
                      ? 'text-rose-400'
                      : 'text-sky-400'
                  }`}
                />
                <p className="text-sm font-medium flex-1">{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 rounded-lg p-1 text-card-foreground/70 transition-colors hover:bg-white/10 hover:text-card-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
