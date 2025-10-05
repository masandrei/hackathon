"use client";

import { motion } from "framer-motion";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function StepNavigation() {
  const { currentStep, goToStep, data, totalSteps, completedSteps } = useSimulator();
  
  // Dynamicznie buduj listę kroków na podstawie wyboru użytkownika
  const steps = useMemo(() => {
    let currentId = 1;
    const stepsList = [
      { id: currentId++, label: "Twoja płeć", shortLabel: "Płeć" },
      { id: currentId++, label: "W jakim jesteś wieku?", shortLabel: "Wiek" },
      { id: currentId++, label: "Twoje wynagrodzenie brutto", shortLabel: "Wynagrodzenie" },
      { id: currentId++, label: "Kiedy zacząłeś pracować?", shortLabel: "Początek kariery" },
      { id: currentId++, label: "Historia zatrudnienia", shortLabel: "Historia zatrudnienia" },
    ];
    
    // Dodaj zarządzanie pracami tylko jeśli wybrano
    if (data.includeJobHistory) {
      stepsList.push({ id: currentId++, label: "Zarządzanie pracami", shortLabel: "Moje prace" });
    }
    
    stepsList.push(
      { id: currentId++, label: "Zwolnienia lekarskie", shortLabel: "Chorobowe" },
      { id: currentId++, label: "Kiedy chcesz przejść na emeryturę?", shortLabel: "Rok emerytury" },
      { id: currentId++, label: "Podsumowanie", shortLabel: "Podsumowanie" }
    );
    
    return stepsList;
  }, [data.includeJobHistory]);

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[--navy]/60 mb-4">
        Krok {currentStep} z {steps.length}
      </div>
      <nav className="space-y-1">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          // Możesz przejść do kroku jeśli jest obecny, ukończony, lub następny po ostatnim ukończonym
          const maxCompleted = Math.max(...Array.from(completedSteps), 0);
          const isAccessible = step.id <= currentStep || step.id <= maxCompleted + 1;

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

