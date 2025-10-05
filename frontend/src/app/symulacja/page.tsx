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
import { Step5Retirement } from "@/components/simulator/steps/Step5Retirement";
import { Step6Summary } from "@/components/simulator/steps/Step6Summary";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

function SimulatorContent() {
  const { currentStep } = useSimulator();
  const router = useRouter();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step2Sex />;
      case 2:
        return <Step1Age />;
      case 3:
        return <Step3Salary />;
      case 4:
        return <Step4CareerStart />;
      case 5:
        return <Step5Retirement />;
      case 6:
        return <Step6Summary />;
      default:
        return <Step2Sex />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Header />

      <main className="flex-1 flex">
        {/* Sidebar Navigation - Desktop */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
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
        <div className="lg:hidden w-full bg-white border-b border-[--border] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[--ink]">
              Symulator emerytalny
            </h3>
            <button
              onClick={() => router.push("/")}
              className="text-[--gray] hover:text-[--navy]"
            >
              <X size={20} />
            </button>
          </div>
          <ProgressBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <StepTransition stepKey={currentStep}>
              {renderStep()}
            </StepTransition>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation - Optional */}
      <div className="lg:hidden bg-white border-t border-[--border] p-4">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all ${
                step === currentStep
                  ? "w-8 bg-[#00993F]"
                  : step < currentStep
                  ? "w-2 bg-[#00993F]/50"
                  : "w-2 bg-[--gray]/30"
              }`}
            />
          ))}
        </div>
      </div>
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

