"use client";

import { useState } from "react";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Step5Retirement() {
  const { data, updateData, nextStep, prevStep, setResults } = useSimulator();
  const currentYear = new Date().getFullYear();
  const minRetirementYear = currentYear + 1;
  const maxRetirementYear = currentYear + 50;

  const [yearDesiredRetirement, setYearDesiredRetirement] = useState(() => {
    if (data.yearDesiredRetirement) return data.yearDesiredRetirement;
    const age = data.age ?? 25;
    return currentYear + (67 - age); // Default retirement at 67
  });

  const yearsUntilRetirement = yearDesiredRetirement - currentYear;
  const retirementAge = (data.age || 25) + yearsUntilRetirement;

  const handleNext = () => {
    updateData({ yearDesiredRetirement });

    // Mock calculation - simulate API call
    const mockResults = {
      nominalPension: "4850.00",
      realPension: "3420.00",
      percentageToAverage: 89,
    };

    setResults(mockResults);
    nextStep();
  };

  const years = Array.from(
    { length: maxRetirementYear - minRetirementYear + 1 },
    (_, i) => minRetirementYear + i
  );

  return (
    <div className="flex flex-col items-center justify-start min-h-[600px] px-6 pt-[25px]">
      <div className="w-full max-w-2xl space-y-12">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-[--ink]"
          >
            Kiedy chcesz przejść na emeryturę?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[--ink]/70"
          >
            Wybierz rok, w którym planujesz zakończyć karierę zawodową.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="text-7xl font-black text-[--green]">
              {yearDesiredRetirement}
            </div>
            <div className="inline-flex items-center gap-6 bg-[#00993F]/10 rounded-2xl py-4 px-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[--navy]">
                  {retirementAge}
                </div>
                <div className="text-xs text-[--navy]/70 uppercase tracking-[0.2em] mt-1">
                  Wiek
                </div>
              </div>
              <div className="w-[2px] h-12 bg-[--navy]/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-[--navy]">
                  {yearsUntilRetirement}
                </div>
                <div className="text-xs text-[--navy]/70 uppercase tracking-[0.2em] mt-1">
                  Lat
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-[--navy]/70 uppercase tracking-[0.2em] text-center mb-4">
              Popularne wybory
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() =>
                  setYearDesiredRetirement(currentYear + (60 - (data.age || 25)))
                }
                className="p-4 rounded-xl border-2 border-[#E5E7EB] hover:border-[#00993F] hover:bg-[#00993F]/5 transition-all"
              >
                <div className="text-xl font-bold text-[--ink]">60 lat</div>
                <div className="text-xs text-[--gray] mt-1">Wcześnie</div>
              </button>
              <button
                onClick={() =>
                  setYearDesiredRetirement(currentYear + (65 - (data.age || 25)))
                }
                className="p-4 rounded-xl border-2 border-[#E5E7EB] hover:border-[#00993F] hover:bg-[#00993F]/5 transition-all"
              >
                <div className="text-xl font-bold text-[--ink]">65 lat</div>
                <div className="text-xs text-[--gray] mt-1">Standard</div>
              </button>
              <button
                onClick={() =>
                  setYearDesiredRetirement(currentYear + (70 - (data.age || 25)))
                }
                className="p-4 rounded-xl border-2 border-[#E5E7EB] hover:border-[#00993F] hover:bg-[#00993F]/5 transition-all"
              >
                <div className="text-xl font-bold text-[--ink]">70 lat</div>
                <div className="text-xs text-[--gray] mt-1">Późno</div>
              </button>
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto custom-scrollbar space-y-2 px-2">
            {years.slice(0, 30).map((year) => {
              const age = (data.age || 25) + (year - currentYear);
              return (
                <button
                  key={year}
                  onClick={() => setYearDesiredRetirement(year)}
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-between transition-all ${
                    yearDesiredRetirement === year
                      ? "bg-[#00993F] text-white"
                      : "bg-[#F6F8FA] text-[--ink] hover:bg-[#00993F]/10"
                  }`}
                >
                  <span className="text-xl font-semibold">{year}</span>
                  <span className="text-sm opacity-70">Wiek: {age}</span>
                </button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FFFBEB] border-2 border-[#FEF3C7] rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-[--navy]/70 mb-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M10 6V10L13 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Całkowity staż pracy</span>
            </div>
            <div className="text-4xl font-bold text-[--navy]">
              {yearDesiredRetirement - (data.yearWorkStart || currentYear - 5)} lat
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
            Zobacz wyniki
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

