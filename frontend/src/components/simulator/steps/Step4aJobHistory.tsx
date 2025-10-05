"use client";

import { useState } from "react";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp } from "lucide-react";

export function Step4aJobHistory() {
  const { data, updateData, nextStep, prevStep } = useSimulator();
  const [choice, setChoice] = useState<boolean | undefined>(data.includeJobHistory);

  const handleChoice = (include: boolean) => {
    setChoice(include);
    updateData({ includeJobHistory: include });
    if (!include) {
      updateData({ jobs: [] });
    }
  };

  const handleNext = () => {
    if (choice !== undefined) {
      nextStep();
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[600px] px-6 pt-[25px]">
      <div className="w-full max-w-3xl space-y-12">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-[--ink]"
          >
            Historia zatrudnienia
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="text-lg text-[--ink]/70"
          >
            Czy chcesz dodać szczegółową historię swoich miejsc pracy?
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Opcja 1: Nie, użyj obecnych danych */}
          <button
            onClick={() => handleChoice(false)}
            className={`relative p-8 rounded-3xl border-4 transition-all duration-300 group text-left ${
              choice === false
                ? "border-[#00993F] bg-[#00993F]/5"
                : "border-[#E5E7EB] hover:border-[#00993F]/50 bg-white"
            }`}
          >
            <div className="space-y-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  choice === false
                    ? "bg-[#00993F] text-white"
                    : "bg-[#F6F8FA] text-[--gray] group-hover:bg-[#00993F]/10"
                }`}
              >
                <TrendingUp size={32} />
              </div>
              <div>
                <div className="text-xl font-bold text-[--ink] mb-2">
                  Nie, użyj obecnych danych
                </div>
                <div className="text-sm text-[--gray]">
                  Symulacja zostanie wykonana na podstawie obecnego wynagrodzenia i stażu pracy
                </div>
              </div>
            </div>
            {choice === false && (
              <motion.div
                layoutId="job-check"
                className="absolute top-4 right-4 w-8 h-8 bg-[#00993F] rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8L6 11L13 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </button>

          {/* Opcja 2: Tak, dodaj szczegóły */}
          <button
            onClick={() => handleChoice(true)}
            className={`relative p-8 rounded-3xl border-4 transition-all duration-300 group text-left ${
              choice === true
                ? "border-[#00993F] bg-[#00993F]/5"
                : "border-[#E5E7EB] hover:border-[#00993F]/50 bg-white"
            }`}
          >
            <div className="space-y-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  choice === true
                    ? "bg-[#00993F] text-white"
                    : "bg-[#F6F8FA] text-[--gray] group-hover:bg-[#00993F]/10"
                }`}
              >
                <Briefcase size={32} />
              </div>
              <div>
                <div className="text-xl font-bold text-[--ink] mb-2">
                  Tak, dodaj szczegółową historię
                </div>
                <div className="text-sm text-[--gray]">
                  Dokładniejsza symulacja uwzględniająca różne wynagrodzenia w ciągu kariery
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="px-3 py-1 bg-[#FFB34F]/20 text-[#00416E] text-xs font-semibold rounded-full">
                  Rekomendowane
                </div>
              </div>
            </div>
            {choice === true && (
              <motion.div
                layoutId="job-check"
                className="absolute top-4 right-4 w-8 h-8 bg-[#00993F] rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8L6 11L13 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between gap-4"
        >
          <Button
            size="lg"
            variant="outline"
            onClick={prevStep}
            className="px-12 h-14 rounded-full text-lg font-semibold"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="mr-2"
            >
              <path
                d="M16 10H4M4 10L10 16M4 10L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Wstecz
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={choice === undefined}
            className="bg-[#00993F] hover:bg-[#00993F]/90 text-white px-12 h-14 rounded-full text-lg font-semibold disabled:opacity-50"
          >
            Dalej
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="ml-2"
            >
              <path
                d="M4 10H16M16 10L10 4M16 10L10 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

