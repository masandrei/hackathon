"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CalculationRequest } from "@/api-client/models/CalculationRequest";

export interface SimulatorData {
  age?: number;
  sex?: "male" | "female";
  salary?: string;
  yearWorkStart?: number;
  yearDesiredRetirement?: number;
  expectedPension?: string;
  isSickLeaveIncluded?: boolean;
  totalAccumulatedFunds?: string;
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
  const totalSteps = 6; // age, sex, salary, work start, retirement, summary
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<SimulatorData>({});
  const [results, setResults] = useState<SimulatorResults | null>(null);

  const updateData = (newData: Partial<SimulatorData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
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

