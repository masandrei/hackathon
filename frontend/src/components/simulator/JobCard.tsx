"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, DollarSign, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import type { Job } from "@/contexts/SimulatorContext";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  index: number;
}

export function JobCard({ job, onEdit, onDelete, index }: JobCardProps) {
  const startDate = new Date(job.startDate);
  const endDate = job.endDate ? new Date(job.endDate) : null;
  const isCurrent = !job.endDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative p-6 rounded-2xl border-2 border-[#E5E7EB] bg-white hover:border-[#00993F]/50 transition-all group"
    >
      {isCurrent && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-[#00993F] text-white text-xs font-semibold rounded-full">
          Obecna praca
        </div>
      )}
      
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00993F]/10 flex items-center justify-center flex-shrink-0">
            <Briefcase size={24} className="text-[#00993F]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-[--ink]">
              Praca #{index + 1}
            </h4>
            <p className="text-sm text-[--gray]">
              {format(startDate, "yyyy", { locale: pl })} - {endDate ? format(endDate, "yyyy", { locale: pl }) : "obecnie"}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-[#F6F8FA] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[--gray]" />
              <div className="text-sm text-[--gray]">Okres zatrudnienia</div>
            </div>
            <div className="font-semibold text-[--ink]">
              {format(startDate, "yyyy", { locale: pl })} - {endDate ? format(endDate, "yyyy", { locale: pl }) : "obecnie"}
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-[#F6F8FA] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-[--gray]" />
              <div className="text-sm text-[--gray]">Wynagrodzenie brutto</div>
            </div>
            <div className="font-semibold text-[--ink]">
              {job.baseSalary.toLocaleString("pl-PL")} zł
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(job)}
            className="flex-1 rounded-xl"
          >
            <Edit2 size={14} className="mr-2" />
            Edytuj
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(job.id)}
            className="flex-1 rounded-xl text-[--red] border-[--red]/20 hover:bg-[--red]/10"
          >
            <Trash2 size={14} className="mr-2" />
            Usuń
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

