"use client";

import { useState } from "react";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Step4CareerStart() {
  const { data, updateData, nextStep, prevStep } = useSimulator();
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - (data.age ? data.age - 15 : 50); // Started at least at age 15
  const maxYear = currentYear;

  const [yearWorkStart, setYearWorkStart] = useState(() => {
    if (data.yearWorkStart) return data.yearWorkStart;
    if (data.age) return currentYear - (data.age - 20); // Started at age 20 by default
    return currentYear - 5;
  });

  const yearsWorked = currentYear - yearWorkStart;

  const handleNext = () => {
    updateData({ yearWorkStart });
    nextStep();
  };

  // Generate year options (last 50 years)
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const displayYears = years.filter((_, idx) => idx % 1 === 0).reverse();

  return (
    <div className="flex flex-col items-center justify-start min-h-[600px] px-6 pt-[25px]">
      <div className="w-full max-w-2xl space-y-12">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-[--ink]"
          >
            Kiedy zacząłeś pracować?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[--ink]/70"
          >
            Wybierz rok, w którym rozpocząłeś swoją karierę zawodową.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-8"
        >
          <div className="text-center">
            <div className="text-7xl font-black text-[--green] mb-4">
              {yearWorkStart}
            </div>
            <div className="bg-[#00993F]/10 rounded-xl py-3 px-6 inline-block">
              <div className="text-sm text-[--navy]/70 uppercase tracking-[0.2em]">
                Emerytura w: {yearWorkStart + (67 - (data.age || 25))}
              </div>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 px-2">
            {displayYears.map((year) => (
              <button
                key={year}
                onClick={() => setYearWorkStart(year)}
                className={`w-full py-4 px-6 rounded-xl text-xl font-semibold transition-all ${
                  yearWorkStart === year
                    ? "bg-[#00993F] text-white"
                    : "bg-[#F6F8FA] text-[--ink] hover:bg-[#00993F]/10"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FFFBEB] border-2 border-[#FEF3C7] rounded-2xl p-6"
          >
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[--navy]">
                  {yearsWorked}
                </div>
                <div className="text-sm text-[--navy]/70 mt-1">
                  Lat doświadczenia
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[--navy]">
                  {67 - (data.age || 25) - yearsWorked}
                </div>
                <div className="text-sm text-[--navy]/70 mt-1">
                  Lat do emerytury
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
            className="bg-[#00993F] hover:bg-[#00993F]/90 text-white px-12 h-14 rounded-full text-lg font-semibold"
          >
            Zakończ
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

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00993F;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #007a32;
        }
      `}</style>
    </div>
  );
}

