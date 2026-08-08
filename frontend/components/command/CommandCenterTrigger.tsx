'use client';

import { motion } from 'framer-motion';
import { Command, Sparkles } from 'lucide-react';
import { useCommandPalette } from '@/providers/CommandPaletteProvider';
import { useState, useEffect } from 'react';

export default function CommandCenterTrigger() {
  const { open } = useCommandPalette();
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Pulse animation on mount to draw attention
    setIsPulsing(true);
    const timer = setTimeout(() => setIsPulsing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={open}
      className="fixed bottom-6 left-6 z-40 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Pulse ring when new */}
        {isPulsing && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}

        {/* Main button */}
        <div className="relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20">
          <Command className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold leading-none">Command Center</span>
            <span className="text-[10px] opacity-90 leading-none mt-0.5">⌘K</span>
          </div>
          
          {/* Sparkle indicator */}
          <Sparkles className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </motion.div>
      </div>
    </motion.button>
  );
}
