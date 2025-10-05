"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Job } from "@/contexts/SimulatorContext";
import { jobSchema } from "@/lib/validations";

interface JobFormProps {
  job?: Job;
  onSave: (job: Job) => void;
  onCancel: () => void;
}

export function JobForm({ job, onSave, onCancel }: JobFormProps) {
  // Użyj useState z funkcją initializer aby uniknąć problemów z SSR
  const [formData, setFormData] = useState<Job>(() => 
    job || {
      id: `job-${Math.random().toString(36).substring(2, 11)}`,
      startDate: "",
      endDate: "",
      baseSalary: 0,
    }
  );
  const [startYear, setStartYear] = useState(
    job?.startDate ? new Date(job.startDate).getFullYear().toString() : ""
  );
  const [endYear, setEndYear] = useState(
    job?.endDate ? new Date(job.endDate).getFullYear().toString() : ""
  );
  const [isCurrent, setIsCurrent] = useState(!job?.endDate);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Konwertuj rok na datę (początek stycznia)
    const startDate = `${startYear}-01-01`;
    const endDate = isCurrent ? undefined : `${endYear}-01-01`;
    
    // Walidacja
    const dataToValidate = {
      ...formData,
      startDate,
      endDate,
    };
    
    const result = jobSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    
    onSave({
      ...formData,
      startDate,
      endDate,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[--ink]">
            {job ? "Edytuj pracę" : "Dodaj nową pracę"}
          </h3>
          <button
            onClick={onCancel}
            className="text-[--gray] hover:text-[--navy] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rok rozpoczęcia */}
          <div>
            <label className="text-sm font-medium text-[--ink] mb-2 block">
              Rok rozpoczęcia pracy <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="h-12 rounded-xl"
              placeholder="np. 2015"
              min="1950"
              max={new Date().getFullYear()}
              required
            />
            {errors.startDate && (
              <p className="text-sm text-[--red] mt-1">{errors.startDate}</p>
            )}
          </div>

          {/* Obecna praca checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isCurrent"
              checked={isCurrent}
              onChange={(e) => {
                setIsCurrent(e.target.checked);
                if (e.target.checked) {
                  setEndYear("");
                }
              }}
              className="w-5 h-5 rounded border-2 border-[--gray] text-[#00993F] focus:ring-[#00993F]"
            />
            <label htmlFor="isCurrent" className="text-sm font-medium text-[--ink] cursor-pointer">
              To jest moja obecna praca
            </label>
          </div>

          {/* Rok zakończenia */}
          {!isCurrent && (
            <div>
              <label className="text-sm font-medium text-[--ink] mb-2 block">
                Rok zakończenia pracy <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="h-12 rounded-xl"
                placeholder="np. 2020"
                min={startYear || "1950"}
                max={new Date().getFullYear()}
                required={!isCurrent}
              />
              {errors.endDate && (
                <p className="text-sm text-[--red] mt-1">{errors.endDate}</p>
              )}
            </div>
          )}

          {/* Wynagrodzenie */}
          <div>
            <label className="text-sm font-medium text-[--ink] mb-2 block">
              Wynagrodzenie brutto miesięczne <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="number"
                value={formData.baseSalary || ""}
                onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                className="h-12 rounded-xl pr-16"
                placeholder="5000"
                min="0"
                max="1000000"
                required
              />
              <div className="absolute inset-y-0 right-4 flex items-center text-[--gray] font-medium">
                zł
              </div>
            </div>
            {errors.baseSalary && (
              <p className="text-sm text-[--red] mt-1">{errors.baseSalary}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-[#00993F] hover:bg-[#00993F]/90 text-white"
            >
              {job ? "Zapisz zmiany" : "Dodaj pracę"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

