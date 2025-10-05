"use client";

import { useState, useEffect } from "react";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { UserService } from "@/api-client";
import { LoadingOverlay } from "@/components/LoadingSpinner";
import type { CalculationRequest } from "@/api-client/models/CalculationRequest";

export function Step6Summary() {
  const { data, results, prevStep, resetSimulator, goToStep, setResults } = useSimulator();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculationId, setCalculationId] = useState<string | null>(null);

  // Automatyczne wysłanie do API po załadowaniu
  useEffect(() => {
    if (!results && !error) {
      handleCalculate();
    }
  }, []);

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentDate = new Date();
      
      // Przygotuj dane do wysłania
      const requestData: CalculationRequest = {
        calculationDate: currentDate.toISOString().split('T')[0],
        calculationTime: currentDate.toTimeString().split(' ')[0],
        expectedPension: data.salary || "0", // Używamy obecnego wynagrodzenia jako oczekiwanej emerytury
        age: data.age || 25,
        sex: (data.sex || "male") as CalculationRequest.sex,
        salary: data.salary || "0",
        isSickLeaveIncluded: data.sickLeaveData?.option !== 'none',
        totalAccumulatedFunds: data.totalAccumulatedFunds || "0",
        yearWorkStart: data.yearWorkStart || new Date().getFullYear() - 5,
        yearDesiredRetirement: data.yearDesiredRetirement || new Date().getFullYear() + 30,
        postalCode: undefined,
        jobs: data.jobs?.map(job => ({
          startDate: job.startDate,
          endDate: job.endDate || undefined,
          baseSalary: job.baseSalary,
        })) || [],
        leaves: [], // Chorobowe na razie jako pusta tablica
      };

      // Wywołaj API
      const response = await UserService.submitCalculation(requestData);
      
      if (response && response.id) {
        setCalculationId(response.id);
        
        // Mock results (póki backend nie zwraca pełnych danych)
        // W przyszłości możesz pobrać szczegóły przez GET /calculations/{id}
        const mockResults = {
          nominalPension: "4850.00",
          realPension: "3420.00",
          percentageToAverage: 89,
        };
        
        setResults(mockResults);
      }
    } catch (err: any) {
      console.error("Błąd podczas obliczania:", err);
      setError(err.message || "Wystąpił błąd podczas obliczania. Spróbuj ponownie.");
      
      // Fallback do mockowych danych w przypadku błędu
      const mockResults = {
        nominalPension: "4850.00",
        realPension: "3420.00",
        percentageToAverage: 89,
      };
      setResults(mockResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (step: number) => {
    goToStep(step);
  };

  const handleSaveResults = () => {
    // Mock save - in real app would call API
    alert("Wyniki zostały zapisane!");
    router.push("/");
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
    }).format(Number(value));
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay message="Obliczam Twoją przyszłą emeryturę..." />
        )}
      </AnimatePresence>
      
      <div className="flex flex-col items-center justify-start min-h-[600px] px-6 pt-[25px] pb-12">
        <div className="w-full max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#00993F] rounded-full mb-4"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M10 20L17 27L30 14"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-extrabold text-[--ink]"
          >
            Twoja symulacja emerytalna
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-[--ink]/70"
          >
            Oto prognozy na podstawie podanych danych
          </motion.p>
        </div>

        {/* Results Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-[#00993F] to-[#007a32] rounded-3xl p-8 text-white">
            <div className="text-sm uppercase tracking-[0.2em] opacity-90 mb-3">
              Nominalna wartość
            </div>
            <div className="text-4xl font-black mb-2">
              {formatCurrency(results?.nominalPension || "0")}
            </div>
            <div className="text-sm opacity-80">miesięcznie</div>
          </div>

          <div className="bg-gradient-to-br from-[#00416E] to-[#002d4d] rounded-3xl p-8 text-white">
            <div className="text-sm uppercase tracking-[0.2em] opacity-90 mb-3">
              Realna wartość
            </div>
            <div className="text-4xl font-black mb-2">
              {formatCurrency(results?.realPension || "0")}
            </div>
            <div className="text-sm opacity-80">w dzisiejszych złotówkach</div>
          </div>

          <div className="bg-gradient-to-br from-[#FFB34F] to-[#ff9a1f] rounded-3xl p-8 text-white">
            <div className="text-sm uppercase tracking-[0.2em] opacity-90 mb-3">
              Stopa zastąpienia
            </div>
            <div className="text-4xl font-black mb-2">
              {results?.percentageToAverage || 0}%
            </div>
            <div className="text-sm opacity-80">do średniej krajowej</div>
          </div>
        </motion.div>

        {/* Your Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#F6F8FA] rounded-3xl p-8"
        >
          <h3 className="text-2xl font-bold text-[--ink] mb-6">
            Twoje odpowiedzi
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[--border]">
              <div>
                <div className="text-sm text-[--gray]">Wiek</div>
                <div className="text-xl font-semibold text-[--ink]">
                  {data.age} lat
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(1)}
                className="rounded-full"
              >
                Edytuj
              </Button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[--border]">
              <div>
                <div className="text-sm text-[--gray]">Płeć</div>
                <div className="text-xl font-semibold text-[--ink]">
                  {data.sex === "female" ? "Kobieta" : "Mężczyzna"}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(2)}
                className="rounded-full"
              >
                Edytuj
              </Button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[--border]">
              <div>
                <div className="text-sm text-[--gray]">Wynagrodzenie brutto</div>
                <div className="text-xl font-semibold text-[--ink]">
                  {formatCurrency(data.salary || "0")}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(3)}
                className="rounded-full"
              >
                Edytuj
              </Button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[--border]">
              <div>
                <div className="text-sm text-[--gray]">Początek kariery</div>
                <div className="text-xl font-semibold text-[--ink]">
                  {data.yearWorkStart}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(4)}
                className="rounded-full"
              >
                Edytuj
              </Button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm text-[--gray]">Planowana emerytura</div>
                <div className="text-xl font-semibold text-[--ink]">
                  {data.yearDesiredRetirement}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(5)}
                className="rounded-full"
              >
                Edytuj
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-between gap-4"
        >
          <Button
            size="lg"
            variant="outline"
            onClick={() => resetSimulator()}
            className="px-8 h-14 rounded-full text-lg font-semibold"
          >
            Nowa symulacja
          </Button>
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={prevStep}
              className="px-8 h-14 rounded-full text-lg font-semibold"
            >
              Wstecz
            </Button>
            <Button
              size="lg"
              onClick={handleSaveResults}
              className="bg-[#00993F] hover:bg-[#00993F]/90 text-white px-12 h-14 rounded-full text-lg font-semibold"
            >
              Zapisz wyniki
            </Button>
          </div>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[--red]/10 border-2 border-[--red]/20 rounded-2xl p-6 text-center"
          >
            <div className="text-[--red] font-semibold mb-2">
              Wystąpił błąd
            </div>
            <div className="text-sm text-[--ink]/70">
              {error}
            </div>
            <Button
              onClick={handleCalculate}
              className="mt-4 bg-[#00993F] hover:bg-[#00993F]/90 text-white"
            >
              Spróbuj ponownie
            </Button>
          </motion.div>
        )}

        {/* API Info */}
        {calculationId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-[--gray]"
          >
            ID obliczeń: {calculationId}
          </motion.div>
        )}
        </div>
      </div>
    </>
  );
}

