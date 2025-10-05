"use client";

import { useState } from "react";
import { useSimulator, type SickLeaveOption } from "@/contexts/SimulatorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { X, Check, TrendingUp, Edit3 } from "lucide-react";

export function Step5SickLeave() {
  const { data, updateData, nextStep, prevStep } = useSimulator();
  const [option, setOption] = useState<SickLeaveOption>(
    data.sickLeaveData?.option || 'none'
  );
  const [customDays, setCustomDays] = useState(
    data.sickLeaveData?.customDays?.toString() || "7"
  );

  const handleOptionChange = (newOption: SickLeaveOption) => {
    setOption(newOption);
    updateData({
      sickLeaveData: {
        option: newOption,
        customDays: newOption === 'custom' ? Number(customDays) : undefined,
      },
      isSickLeaveIncluded: newOption !== 'none',
    });
  };

  const handleCustomDaysChange = (value: string) => {
    const days = value.replace(/\D/g, "");
    setCustomDays(days);
    if (option === 'custom') {
      updateData({
        sickLeaveData: {
          option: 'custom',
          customDays: Number(days),
        },
      });
    }
  };

  const handleNext = () => {
    updateData({
      sickLeaveData: {
        option,
        customDays: option === 'custom' ? Number(customDays) : undefined,
      },
      isSickLeaveIncluded: option !== 'none',
    });
    nextStep();
  };

  const yearsWorked = data.yearWorkStart
    ? new Date().getFullYear() - data.yearWorkStart
    : 10;

  return (
    <div className="flex flex-col items-center justify-start min-h-[600px] px-6 pt-[25px]">
      <div className="w-full max-w-3xl space-y-12">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-[--ink]"
          >
            Zwolnienia lekarskie
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="text-lg text-[--ink]/70"
          >
            Czy chcesz uwzględnić chorobowe w symulacji?
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Opcja 1: Nie uwzględniaj */}
          <button
            onClick={() => handleOptionChange('none')}
            className={`w-full p-6 rounded-2xl border-3 transition-all duration-300 group text-left ${
              option === 'none'
                ? "border-[#00993F] bg-[#00993F]/5"
                : "border-[#E5E7EB] hover:border-[#00993F]/50 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  option === 'none'
                    ? "bg-[#00993F] text-white"
                    : "bg-[#F6F8FA] text-[--gray] group-hover:bg-[#00993F]/10"
                }`}
              >
                <X size={24} />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-[--ink]">
                  Nie uwzględniaj chorobowych
                </div>
                <div className="text-sm text-[--gray] mt-1">
                  Pomijam zwolnienia lekarskie w obliczeniach
                </div>
              </div>
              {option === 'none' && (
                <motion.div
                  layoutId="sick-check"
                  className="w-6 h-6 bg-[#00993F] rounded-full flex items-center justify-center flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check size={14} color="white" />
                </motion.div>
              )}
            </div>
          </button>

          {/* Opcja 2: Średnia statystyczna */}
          <button
            onClick={() => handleOptionChange('average')}
            className={`w-full p-6 rounded-2xl border-3 transition-all duration-300 group text-left ${
              option === 'average'
                ? "border-[#00993F] bg-[#00993F]/5"
                : "border-[#E5E7EB] hover:border-[#00993F]/50 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  option === 'average'
                    ? "bg-[#00993F] text-white"
                    : "bg-[#F6F8FA] text-[--gray] group-hover:bg-[#00993F]/10"
                }`}
              >
                <TrendingUp size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-[--ink]">
                    Użyj średniej statystycznej
                  </div>
                  <span className="px-2 py-0.5 bg-[#FFB34F]/20 text-[#00416E] text-xs font-semibold rounded">
                    ~7 dni/rok
                  </span>
                </div>
                <div className="text-sm text-[--gray] mt-1">
                  Średni Polak korzysta z L4 około 7 dni rocznie
                </div>
              </div>
              {option === 'average' && (
                <motion.div
                  layoutId="sick-check"
                  className="w-6 h-6 bg-[#00993F] rounded-full flex items-center justify-center flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check size={14} color="white" />
                </motion.div>
              )}
            </div>
            {option === 'average' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.1 }}
                className="mt-4 pt-4 border-t border-[#E5E7EB]"
              >
                <div className="bg-[#FFFBEB] rounded-xl p-4">
                  <div className="text-sm text-[--navy]/70 mb-2">
                    Łącznie za {yearsWorked} lat pracy:
                  </div>
                  <div className="text-2xl font-bold text-[--navy]">
                    ~{yearsWorked * 7} dni chorobowych
                  </div>
                </div>
              </motion.div>
            )}
          </button>

          {/* Opcja 3: Określ dokładnie */}
          <button
            onClick={() => handleOptionChange('custom')}
            className={`w-full p-6 rounded-2xl border-3 transition-all duration-300 group text-left ${
              option === 'custom'
                ? "border-[#00993F] bg-[#00993F]/5"
                : "border-[#E5E7EB] hover:border-[#00993F]/50 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  option === 'custom'
                    ? "bg-[#00993F] text-white"
                    : "bg-[#F6F8FA] text-[--gray] group-hover:bg-[#00993F]/10"
                }`}
              >
                <Edit3 size={24} />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-[--ink]">
                  Określ dokładną ilość
                </div>
                <div className="text-sm text-[--gray] mt-1">
                  Podaj przybliżoną liczbę dni rocznie
                </div>
              </div>
              {option === 'custom' && (
                <motion.div
                  layoutId="sick-check"
                  className="w-6 h-6 bg-[#00993F] rounded-full flex items-center justify-center flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check size={14} color="white" />
                </motion.div>
              )}
            </div>
            {option === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.1 }}
                className="mt-4 pt-4 border-t border-[#E5E7EB]"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[--ink] mb-2 block">
                      Średnia liczba dni rocznie
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={customDays}
                        onChange={(e) => handleCustomDaysChange(e.target.value)}
                        className="flex-1 h-12 rounded-xl border-2 border-[#bec3ce] text-lg font-semibold text-center hover:border-[#ffb34f] focus:border-[#ffb34f]"
                        placeholder="7"
                      />
                      <span className="text-lg font-medium text-[--gray]">dni</span>
                    </div>
                  </div>
                  <div className="bg-[#FFFBEB] rounded-xl p-4">
                    <div className="text-sm text-[--navy]/70 mb-2">
                      Łącznie za {yearsWorked} lat pracy:
                    </div>
                    <div className="text-2xl font-bold text-[--navy]">
                      ~{yearsWorked * Number(customDays || 0)} dni chorobowych
                    </div>
                  </div>
                </div>
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
            className="bg-[#00993F] hover:bg-[#00993F]/90 text-white px-12 h-14 rounded-full text-lg font-semibold"
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

