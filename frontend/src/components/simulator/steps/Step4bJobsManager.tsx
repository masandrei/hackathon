"use client";

import { useState } from "react";
import { useSimulator, type Job } from "@/contexts/SimulatorContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Briefcase } from "lucide-react";
import { JobCard } from "../JobCard";
import { JobForm } from "../JobForm";

export function Step4bJobsManager() {
  const { data, updateData, nextStep, prevStep } = useSimulator();
  const [jobs, setJobs] = useState<Job[]>(data.jobs || []);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>();

  const handleAddJob = () => {
    setEditingJob(undefined);
    setShowForm(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleSaveJob = (job: Job) => {
    let updatedJobs: Job[];
    
    if (editingJob) {
      // Edycja istniejącej pracy
      updatedJobs = jobs.map((j) => (j.id === job.id ? job : j));
    } else {
      // Dodanie nowej pracy
      updatedJobs = [...jobs, job];
    }
    
    // Sortuj chronologicznie (od najstarszej)
    updatedJobs.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    setJobs(updatedJobs);
    updateData({ jobs: updatedJobs });
    setShowForm(false);
    setEditingJob(undefined);
  };

  const handleDeleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((j) => j.id !== jobId);
    setJobs(updatedJobs);
    updateData({ jobs: updatedJobs });
  };

  const handleNext = () => {
    updateData({ jobs });
    nextStep();
  };

  const totalYears = jobs.reduce((sum, job) => {
    const start = new Date(job.startDate);
    const end = job.endDate ? new Date(job.endDate) : new Date();
    const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return sum + years;
  }, 0);

  const averageSalary = jobs.length > 0
    ? jobs.reduce((sum, job) => sum + job.baseSalary, 0) / jobs.length
    : 0;

  return (
    <div className="flex flex-col items-center justify-start min-h-[600px] px-6 pt-[25px] pb-12">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-[--ink]"
          >
            Twoja historia zatrudnienia
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="text-lg text-[--ink]/70"
          >
            Dodaj swoje miejsca pracy, aby uzyskać dokładniejszą symulację
          </motion.p>
        </div>

        {/* Statystyki */}
        {jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4"
          >
            <div className="bg-[#00993F]/5 border-2 border-[#00993F]/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-[#00993F]">
                {jobs.length}
              </div>
              <div className="text-sm text-[--navy]/70 mt-1">
                {jobs.length === 1 ? "Miejsce pracy" : "Miejsc pracy"}
              </div>
            </div>
            
            <div className="bg-[#FFB34F]/5 border-2 border-[#FFB34F]/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-[#00416E]">
                {Math.round(totalYears)}
              </div>
              <div className="text-sm text-[--navy]/70 mt-1">
                Lat doświadczenia
              </div>
            </div>
            
            <div className="bg-[#3F84D2]/5 border-2 border-[#3F84D2]/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-[#3F84D2]">
                {Math.round(averageSalary).toLocaleString("pl-PL")}
              </div>
              <div className="text-sm text-[--navy]/70 mt-1">
                Średnie wynagrodzenie
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista prac */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-[#F6F8FA] rounded-3xl border-2 border-dashed border-[--gray]/30">
              <div className="w-16 h-16 rounded-full bg-[--gray]/10 flex items-center justify-center mx-auto mb-4">
                <Briefcase size={32} className="text-[--gray]" />
              </div>
              <h4 className="text-xl font-bold text-[--ink] mb-2">
                Brak dodanych prac
              </h4>
              <p className="text-[--gray] mb-6">
                Dodaj swoje miejsca pracy, aby zwiększyć dokładność symulacji
              </p>
              <Button
                onClick={handleAddJob}
                className="bg-[#00993F] hover:bg-[#00993F]/90 text-white px-8 h-12 rounded-xl"
              >
                <Plus size={20} className="mr-2" />
                Dodaj pierwszą pracę
              </Button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {jobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onEdit={handleEditJob}
                    onDelete={handleDeleteJob}
                    index={index}
                  />
                ))}
              </div>
              
              <Button
                onClick={handleAddJob}
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-dashed border-[#00993F] text-[#00993F] hover:bg-[#00993F]/5"
              >
                <Plus size={20} className="mr-2" />
                Dodaj kolejną pracę
              </Button>
            </>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between gap-4 pt-4"
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
            disabled={jobs.length === 0}
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

      {/* Modal formularza */}
      <AnimatePresence>
        {showForm && (
          <JobForm
            job={editingJob}
            onSave={handleSaveJob}
            onCancel={() => {
              setShowForm(false);
              setEditingJob(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

