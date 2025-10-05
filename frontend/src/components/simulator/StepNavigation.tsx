"use client";

import { motion } from "framer-motion";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Twoja płeć", shortLabel: "Płeć" },
  { id: 2, label: "W jakim jesteś wieku?", shortLabel: "Wiek" },
  { id: 3, label: "Twoje wynagrodzenie brutto", shortLabel: "Wynagrodzenie" },
  { id: 4, label: "Kiedy zacząłeś pracować?", shortLabel: "Początek kariery" },
  { id: 5, label: "Kiedy chcesz przejść na emeryturę?", shortLabel: "Emerytura" },
  { id: 6, label: "Podsumowanie", shortLabel: "Podsumowanie" },
];

export function StepNavigation() {
  const { currentStep, goToStep } = useSimulator();

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[--navy]/60 mb-4">
        Krok {currentStep} z {steps.length}
      </div>
      <nav className="space-y-1">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isAccessible = currentStep >= step.id;

          return (
            <button
              key={step.id}
              onClick={() => isAccessible && goToStep(step.id)}
              disabled={!isAccessible}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                isCurrent && "bg-[#00993F]/10 text-[--navy]",
                isCompleted && "text-[--navy]/70 hover:bg-[--bg-elev]",
                !isAccessible && "text-[--gray] cursor-not-allowed opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  isCurrent && "bg-[#00993F] text-white",
                  isCompleted && "bg-[#00993F] text-white",
                  !isCurrent && !isCompleted && "bg-[--gray]/30 text-[--gray]"
                )}
              >
                {isCompleted ? (
                  <Check size={16} />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm font-medium truncate",
                  isCurrent && "font-semibold"
                )}>
                  {step.shortLabel}
                </div>
              </div>
              {isCurrent && (
                <motion.div
                  layoutId="current-indicator"
                  className="w-1 h-8 bg-[#00993F] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

