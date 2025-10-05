"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface StepTransitionProps {
  children: ReactNode;
  stepKey: number;
}

export function StepTransition({ children, stepKey }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

