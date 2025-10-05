"use client";

import { useState, useEffect } from "react";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Step1Age() {
  const { data, updateData, nextStep } = useSimulator();
  const [age, setAge] = useState(data.age ?? 25);

  const currentYear = new Date().getFullYear();
  const retirementYear = currentYear + (67 - age); // Assuming retirement at 67

  // Usunięto useEffect - updateData tylko przy kliknięciu "Dalej"

  const handleNext = () => {
    updateData({ age });
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[600px] px-6 pt-[25px]">
      <div className="w-full max-w-2xl space-y-12">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-[--ink]"
          >
            W jakim jesteś wieku?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[--ink]/70"
          >
            Wybierz swój wiek, abyśmy mogli dostosować symulację.
          </motion.p>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <div className="text-8xl font-black text-[--green] mb-2">
                {age}
              </div>
              <div className="text-sm text-[--gray] uppercase tracking-[0.2em]">
                LAT
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <input
              type="range"
              min="18"
              max="66"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-3 bg-[#E5E7EB] rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #00993F 0%, #00993F ${((age - 18) / (66 - 18)) * 100}%, #E5E7EB ${((age - 18) / (66 - 18)) * 100}%, #E5E7EB 100%)`,
              }}
            />
            <div className="flex justify-between text-sm text-[--gray]">
              <span>18</span>
              <span>66</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FFFBEB] border-2 border-[#FEF3C7] rounded-2xl p-6 text-center"
          >
            <div className="text-sm text-[--navy]/70 mb-2">
              Do emerytury w wieku 67 lat
            </div>
            <div className="text-2xl font-bold text-[--navy]">
              {67 - age} lat
            </div>
            <div className="text-sm text-[--navy]/60 mt-2">
              Emerytura w: {retirementYear}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end gap-4"
        >
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #00993F;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 153, 63, 0.4);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 153, 63, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #00993F;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 153, 63, 0.4);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 153, 63, 0.5);
        }
      `}</style>
    </div>
  );
}

