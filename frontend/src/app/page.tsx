"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ChartPlaceholder } from "@/components/ChartPlaceholder";
import { OwlMascot } from "@/components/OwlMascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InfoCard } from "@/components/InfoCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  const [expectedPension, setExpectedPension] = useState("");

  const formatCurrency = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    // Format with space separator
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setExpectedPension(formatted);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
            {/* Left Column - Form */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-[--ink] sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                  Jakiej emerytury<br />
                  oczekujesz?
                </h1>
                <p className="text-base leading-7 text-[--ink]/70 sm:text-lg sm:leading-8 max-w-[620px]">
                  Sprawdź swoją przyszłą emeryturę w 60 sekund. Poznaj kwotę nominalną, urealnioną oraz stopę zastąpienia.
                </p>
              </div>

              {/* Input Section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="expected-pension"
                      className="text-sm font-medium text-[--ink] sm:text-base"
                    >
                      Oczekiwana miesięczna emerytura
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-[--blue] hover:text-[--navy] transition-colors flex items-center justify-center size-6">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                              <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <circle cx="10" cy="14" r="1" fill="currentColor"/>
                            </svg>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm">
                            Podaj kwotę emerytury, którą chciałbyś otrzymywać
                            miesięcznie. Kalkulator pomoże Ci zaplanować
                            przyszłość finansową.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="relative w-full max-w-sm">
                    <Input
                      id="expected-pension"
                      type="text"
                      value={expectedPension}
                      onChange={handleInputChange}
                      className="group/input h-14 rounded-2xl border border-[#bec3ce] pr-28 text-lg font-semibold text-[--ink] transition-all placeholder:text-[#b5bbc2] hover:border-[#ffb34f] hover:ring-4 hover:ring-[#ffb34f]/25 focus:border-[#ffb34f] focus:outline-none focus:ring-4 focus:ring-[#ffb34f]/30 sm:h-16 sm:text-2xl"
                      placeholder="np. 5 000"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex flex-col items-end justify-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#bec3ce] sm:text-xs">
                      <span>PLN</span>
                      <span>MIESIĄC</span>
                    </div>
                    <div className="pointer-events-none absolute inset-y-[18px] right-[5.75rem] flex items-center sm:inset-y-[22px]">
                      <span className="h-6 w-[2px] rounded-full bg-[#bec3ce]" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 ml-auto w-full max-w-sm text-right">
                  <p className="text-sm text-[#8d98a3] sm:text-base">
                    Średnia emerytura w 2025 roku: 3 850 PLN
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full sm:w-auto sm:min-w-[240px] h-14 bg-[#ffb34f] hover:bg-[#ffb34f]/90 text-[--ink] text-base font-semibold rounded-[18px] border border-black/10 px-8"
                >
                  Przejdź do symulacji
                  <svg width="25" height="16" viewBox="0 0 25 16" fill="none" className="ml-2">
                    <path d="M1 8H24M24 8L17 1M24 8L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>

                <p className="flex items-start gap-2 text-sm text-[#6b7280] sm:text-base">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2"/>
                    <path d="M12 8V12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="#9CA3AF"/>
                  </svg>
                  <span className="text-[#9CA3AF]">Wyniki mają charakter edukacyjny.</span>
                  <button className="text-sm font-medium text-[--blue] underline hover:opacity-80 sm:text-base">
                    Jak liczymy?
                  </button>
                </p>
              </div>
            </div>

            {/* Right Column - Chart + Mascot */}
            <div className="flex flex-col items-center">
              <ChartPlaceholder />
              <div className="relative -mt-16 flex items-end justify-center gap-6">
                <div className="flex flex-col gap-4">
                  <InfoCard />
                  <InfoCard className="ml-8" />
                </div>
                <OwlMascot />
              </div>
            </div>
          </div>
        </section>
        {/* Cookie Banner */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#002911] text-white">
          <div className="mx-auto flex h-[82px] w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-8 text-sm sm:text-base">
            <p className="flex-1 min-w-0 text-balance font-medium leading-tight text-white/90">
              Ta strona używa plików cookies, by symulator działał sprawnie i byśmy mogli go ulepszać. Kontynuując, zgadzasz się na ich użycie.
            </p>
            <div className="flex flex-shrink-0 items-center gap-3">
              <Button className="h-10 rounded-[4px] bg-[#1f3829] px-5 text-sm font-medium text-white hover:bg-[#1f3829]/80 sm:text-base">
                Ustawienia
              </Button>
              <Button className="h-10 rounded-[4px] bg-[#1f3829] px-5 text-sm font-medium text-white hover:bg-[#1f3829]/80 sm:text-base">
                Akceptuję
              </Button>
              <button className="text-sm font-medium underline decoration-white/60 underline-offset-4 hover:opacity-80 sm:text-base">
                Polityka cookies
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
