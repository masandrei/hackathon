"use client";

import { useState } from "react";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function Step3Salary() {
  const { data, updateData, nextStep, prevStep } = useSimulator();
  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  const [salary, setSalary] = useState(() => {
    if (data.salary) {
      return formatCurrency(data.salary);
    }
    return "";
  });
  const [rawValue, setRawValue] = useState(data.salary || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setSalary(formatted);
    setRawValue(e.target.value.replace(/\D/g, ""));
  };

  const handlePreset = (value: number) => {
    const formatted = formatCurrency(value.toString());
    setSalary(formatted);
    setRawValue(value.toString());
  };

  const handleNext = () => {
    if (salary) {
      updateData({ salary: rawValue || salary.replace(/\s/g, "") });
      nextStep();
    }
  };

  const salaryNumber = Number(salary.replace(/\s/g, ""));
  const averageSalary = 7500; // Mock average salary
  
  // Calculate percentile (0-100)
  const calculatePercentile = (salary: number) => {
    if (salary === 0) return 0;
    if (salary <= 3000) return Math.round((salary / 3000) * 15);
    if (salary <= 5000) return 15 + Math.round(((salary - 3000) / 2000) * 20);
    if (salary <= 7500) return 35 + Math.round(((salary - 5000) / 2500) * 15);
    if (salary <= 10000) return 50 + Math.round(((salary - 7500) / 2500) * 20);
    if (salary <= 15000) return 70 + Math.round(((salary - 10000) / 5000) * 20);
    return Math.min(90 + Math.round(((salary - 15000) / 10000) * 10), 99);
  };
  
  const percentile = calculatePercentile(salaryNumber);
  const percentageOfAverage = salaryNumber
    ? Math.round((salaryNumber / averageSalary) * 100)
    : 0;

  return (
    <div className="flex flex-col items-center justify-start min-h-[600px] px-6 pt-[25px]">
      <div className="w-full max-w-2xl space-y-12">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-[--ink]"
          >
            Twoje wynagrodzenie brutto miesięcznie
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="text-lg text-[--ink]/70"
          >
            Podaj swoją obecną pensję brutto.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              value={salary}
              onChange={handleInputChange}
              className="h-20 rounded-2xl border-2 border-[#bec3ce] pr-28 text-2xl font-bold text-[--ink] text-center transition-all placeholder:text-[#b5bbc2] hover:border-[#ffb34f] hover:ring-4 hover:ring-[#ffb34f]/25 focus:border-[#ffb34f] focus:outline-none focus:ring-4 focus:ring-[#ffb34f]/30"
              placeholder="0"
            />
            <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-2xl font-bold text-[#bec3ce]">
              zł
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => handlePreset(5000)}
              className="h-12 rounded-xl border-2 hover:border-[#00993F] hover:bg-[#00993F]/5"
            >
              Min. krajowa
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePreset(7500)}
              className="h-12 rounded-xl border-2 hover:border-[#00993F] hover:bg-[#00993F]/5"
            >
              Średnia
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePreset(15000)}
              className="h-12 rounded-xl border-2 hover:border-[#00993F] hover:bg-[#00993F]/5"
            >
              Powyżej
            </Button>
          </div>

          {salaryNumber > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.2 }}
              className="bg-[#00416E]/5 border-2 border-[#00416E]/20 rounded-2xl p-8"
            >
              <div className="text-center space-y-4">
                <div className="text-sm text-[--navy]/70 uppercase tracking-[0.2em]">
                  Twoje miejsce na krzywej
                </div>
                <div className="text-6xl font-black text-[--green]">
                  {percentile}
                </div>
                <div className="text-sm text-[--navy]/60">
                  Percentyl populacji (wyższe od {percentile}% zarobków)
                </div>

                {/* Dynamic chart based on salary distribution */}
                <div className="relative h-24 pt-4">
                  <div className="flex items-end justify-between gap-1 h-full">
                    {[
                      { range: "0-3k", height: 30, value: 3000 },
                      { range: "3k-5k", height: 50, value: 5000 },
                      { range: "5k-7.5k", height: 70, value: 7500 },
                      { range: "7.5k-10k", height: 85, value: 10000 },
                      { range: "10k-15k", height: 75, value: 15000 },
                      { range: "15k-20k", height: 50, value: 20000 },
                      { range: "20k+", height: 30, value: 30000 },
                    ].map((bar, idx) => {
                      const isActive = 
                        salaryNumber >= (idx === 0 ? 0 : [0, 3000, 5000, 7500, 10000, 15000, 20000][idx]) &&
                        salaryNumber < bar.value;
                      
                      return (
                        <div
                          key={idx}
                          className="flex-1 rounded-t transition-all duration-300"
                          style={{
                            height: `${bar.height}%`,
                            backgroundColor: isActive ? "#00993F" : "rgba(0, 65, 110, 0.2)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-[--navy]/50 px-1">
                  <span>3k</span>
                  <span>5k</span>
                  <span>7.5k</span>
                  <span>10k</span>
                  <span>15k</span>
                  <span>20k+</span>
                </div>
                <div className="mt-4 text-sm text-[--navy]/70">
                  {percentageOfAverage}% średniej krajowej ({averageSalary.toLocaleString("pl-PL")} zł)
                </div>
              </div>
            </motion.div>
          )}
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
            disabled={!salary || salaryNumber === 0}
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

