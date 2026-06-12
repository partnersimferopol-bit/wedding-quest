"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CompletionToastProps {
  message: string | null;
}

export function CompletionToast({ message }: CompletionToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-8 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-2xl border border-amber-500/50 bg-amber-900/95 px-6 py-4 text-center shadow-2xl backdrop-blur-sm"
        >
          <p className="text-lg font-semibold text-amber-100">{message}</p>
          <p className="mt-1 text-sm text-amber-300/70">Корабль отправляется дальше...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
