"use client";

import { SimulatorProvider, useSimulator } from "@/contexts/SimulatorContext";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/simulator/ProgressBar";
import { StepNavigation } from "@/components/simulator/StepNavigation";
import { StepTransition } from "@/components/simulator/StepTransition";
import { Step1Age } from "@/components/simulator/steps/Step1Age";
import { Step2Sex } from "@/components/simulator/steps/Step2Sex";
import { Step3Salary } from "@/components/simulator/steps/Step3Salary";
import { Step4CareerStart } from "@/components/simulator/steps/Step4CareerStart";
import { Step4aJobHistory } from "@/components/simulator/steps/Step4aJobHistory";
import { Step4bJobsManager } from "@/components/simulator/steps/Step4bJobsManager";
import { Step5SickLeave } from "@/components/simulator/steps/Step5SickLeave";
import { Step5Retirement } from "@/components/simulator/steps/Step5Retirement";
import { Step6Summary } from "@/components/simulator/steps/Step6Summary";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

function SimulatorContent() {
  const { currentStep, data, totalSteps } = useSimulator();
  const router = useRouter();

  const renderStep = () => {
    // Dynamiczne mapowanie kroków na podstawie wyboru użytkownika
    let stepCounter = 1;
    
    // Krok 1: Płeć
    if (currentStep === stepCounter++) return <Step2Sex />;
    
    // Krok 2: Wiek
    if (currentStep === stepCounter++) return <Step1Age />;
    
    // Krok 3: Wynagrodzenie
    if (currentStep === stepCounter++) return <Step3Salary />;
    
    // Krok 4: Początek kariery
    if (currentStep === stepCounter++) return <Step4CareerStart />;
    
    // Krok 4a: Historia zatrudnienia - wybór
    if (currentStep === stepCounter++) return <Step4aJobHistory />;
    
    // Krok 4b: Zarządzanie pracami (tylko jeśli wybrano "tak")
    if (data.includeJobHistory && currentStep === stepCounter++) {
      return <Step4bJobsManager />;
    }
    
    // Krok 5: Chorobowe
    if (currentStep === stepCounter++) return <Step5SickLeave />;
    
    // Krok 6: Rok emerytury
    if (currentStep === stepCounter++) return <Step5Retirement />;
    
    // Krok 7: Podsumowanie
    if (currentStep === stepCounter++) return <Step6Summary />;
    
    // Default
    return <Step2Sex />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar Navigation - Desktop */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="hidden lg:flex w-80 bg-white border-r border-[--border] p-6 flex-col"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[--ink] mb-2">
              Symulator emerytalny
            </h3>
            <p className="text-sm text-[--gray]">
              Wypełnij wszystkie kroki, aby poznać swoją prognozę
            </p>
          </div>

          <div className="mb-6">
            <ProgressBar />
          </div>

          <div className="flex-1">
            <StepNavigation />
          </div>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-[--gray] hover:text-[--navy] transition-colors mt-6"
          >
            <X size={16} />
            <span>Wyjdź z symulatora</span>
          </button>
        </motion.aside>

        {/* Mobile Header */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="lg:hidden w-full bg-white border-b border-[--border] p-4 sticky top-0 z-10"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[--ink]">
              Symulator emerytalny
            </h3>
            <button
              onClick={() => router.push("/")}
              className="text-[--gray] hover:text-[--navy] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <ProgressBar />
          <div className="mt-3 text-xs text-center text-[--gray]">
            Krok {currentStep} z {totalSteps}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <StepTransition stepKey={currentStep}>
              {renderStep()}
            </StepTransition>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        className="lg:hidden bg-white border-t border-[--border] p-4 sticky bottom-0"
      >
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <motion.div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? "w-8 bg-[#00993F]"
                  : step < currentStep
                  ? "w-2 bg-[#00993F]/50"
                  : "w-2 bg-[--gray]/30"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: step * 0.05, duration: 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <SimulatorProvider>
      <SimulatorContent />
    </SimulatorProvider>
  );
}
