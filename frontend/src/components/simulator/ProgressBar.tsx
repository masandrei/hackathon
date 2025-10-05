"use client";

import { motion } from "framer-motion";
import { useSimulator } from "@/contexts/SimulatorContext";

export function ProgressBar() {
  const { currentStep, totalSteps } = useSimulator();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-[#00993F]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </div>
  );
}

