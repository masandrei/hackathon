"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import type { CalculationRequest } from "@/api-client/models/CalculationRequest";

export interface Job {
  id: string;
  startDate: string;  // Format: YYYY-01-01 (zawsze początek stycznia)
  endDate?: string;    // Format: YYYY-01-01 (zawsze początek stycznia)
  baseSalary: number;
}

export type SickLeaveOption = 'none' | 'average' | 'custom';

export interface SickLeaveData {
  option: SickLeaveOption;
  customDays?: number;
}

export interface SimulatorData {
  age?: number;
  sex?: "male" | "female";
  salary?: string;
  yearWorkStart?: number;
  yearDesiredRetirement?: number;
  expectedPension?: string;
  isSickLeaveIncluded?: boolean;
  totalAccumulatedFunds?: string;
  
  // Historia zatrudnienia
  includeJobHistory?: boolean;
  jobs?: Job[];
  
  // Chorobowe
  sickLeaveData?: SickLeaveData;
}

export interface SimulatorResults {
  nominalPension?: string;
  realPension?: string;
  percentageToAverage?: number;
}

interface SimulatorContextType {
  currentStep: number;
  totalSteps: number;
  data: SimulatorData;
  results: SimulatorResults | null;
  setCurrentStep: (step: number) => void;
  updateData: (newData: Partial<SimulatorData>) => void;
  setResults: (results: SimulatorResults) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetSimulator: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(
  undefined
);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<SimulatorData>({});
  const [results, setResults] = useState<SimulatorResults | null>(null);
  
  // Dynamiczne obliczanie liczby kroków
  const totalSteps = useMemo(() => {
    let steps = 6; // Podstawowe: płeć, wiek, wynagrodzenie, początek kariery, emerytura, podsumowanie
    if (data.includeJobHistory) {
      steps += 1; // Zarządzanie pracami
    }
    steps += 1; // Chorobowe (zawsze)
    return steps;
  }, [data.includeJobHistory]);

  const updateData = (newData: Partial<SimulatorData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    console.log('SimulatorContext: nextStep wywołany', { currentStep, totalSteps });
    if (currentStep < totalSteps) {
      const nextStepNum = currentStep + 1;
      console.log('SimulatorContext: ustawiam krok na', nextStepNum);
      setCurrentStep(nextStepNum);
    } else {
      console.log('SimulatorContext: już na ostatnim kroku!');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const resetSimulator = () => {
    setCurrentStep(1);
    setData({});
    setResults(null);
  };

  return (
    <SimulatorContext.Provider
      value={{
        currentStep,
        totalSteps,
        data,
        results,
        setCurrentStep,
        updateData,
        setResults,
        nextStep,
        prevStep,
        goToStep,
        resetSimulator,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (context === undefined) {
    throw new Error("useSimulator must be used within a SimulatorProvider");
  }
  return context;
}

