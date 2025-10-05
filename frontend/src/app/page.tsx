"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ChartPlaceholder } from "@/components/ChartPlaceholder";
import { OwlMascot } from "@/components/OwlMascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InfoCard } from "@/components/InfoCard";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const highlightStats = [
  { value: "60s", label: "Czas symulacji" },
  { value: "3", label: "Rodzaje kwot" },
  { value: "5", label: "Scenariuszy" },
  { value: "100%", label: "Edukacyjne" },
];

export default function Home() {
  const router = useRouter();
  const [expectedPension, setExpectedPension] = useState("");
  const [isCookieAccepted, setIsCookieAccepted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsCookieAccepted(!!window.localStorage.getItem("zus-cookie-consent"));
    }
  }, []);

  const highlightStats = [
    { value: "60s", label: "Czas symulacji" },
    { value: "3", label: "Rodzaje kwot" },
    { value: "5", label: "Scenariuszy" },
    { value: "100%", label: "Edukacyjne" },
  ];

  const footerLinks = [
    { label: "Polityka prywatności", href: "#" },
    { label: "Regulamin", href: "#" },
    { label: "Kontakt", href: "#" },
  ];

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setExpectedPension(formatted);
  };

  const handlePolicyClick = () => {
    router.push("/polityka-cookies");
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

        {/* Highlight Section */}
        <section className="relative overflow-hidden bg-[#00993F] py-20 sm:py-28 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(160% 100% at 50% -20%, rgba(255, 255, 255, 0.45) 0%, rgba(0, 153, 63, 0) 70%)",
            }}
          />
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-10 border-b border-white/20 pb-14">
              {highlightStats.map((stat) => (
                <div key={stat.label} className="min-w-[140px] space-y-2">
                  <span className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {stat.value}
                  </span>
                  <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
              <div className="space-y-6">
                <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                  Planowanie emerytury
                </span>
                <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                  Zacznij planować swoją przyszłość już dziś
                </h2>
                <p className="max-w-[560px] text-base leading-7 text-white/85 sm:text-lg">
                  Wypełnij prosty formularz i poznaj swoją prognozowaną emeryturę w mniej niż minutę.
                  Porównaj różne scenariusze, uwzględnij dodatkowe lata pracy i zobacz, jak może zmieniać się Twoja miesięczna wypłata.
                </p>
                <div className="grid gap-4 text-sm text-white/80 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-2 rounded-full bg-white" aria-hidden="true" />
                    <p>
                      Prognoza obejmuje kwoty nominalne, urealnione oraz stopę zastąpienia.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-2 rounded-full bg-white" aria-hidden="true" />
                    <p>
                      Pięć wbudowanych scenariuszy pozwala szybko porównać różne ścieżki oszczędzania.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-5 rounded-[28px] bg-white/10 p-8 backdrop-blur-sm lg:items-end">
                <div className="space-y-1 text-left lg:text-right">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
                    Gotowy na symulację?
                  </p>
                  <p className="text-lg font-semibold text-white">
                    Średni czas uzupełnienia: 60 sekund
                  </p>
                </div>
                <Button className="h-14 rounded-[18px] bg-[#FFB34F] px-10 text-base font-semibold text-[--ink] shadow-[0_24px_45px_-20px_rgba(255,179,79,0.75)] transition-transform hover:-translate-y-px hover:bg-[#ffb34f]/90">
                  Rozpocznij symulację
                </Button>
                <p className="max-w-[260px] text-sm text-white/75 lg:text-right">
                  Twoje dane pozostają na tym urządzeniu. Możesz zapisać wyniki i wrócić do nich w dowolnej chwili.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {!isCookieAccepted && (
        <CookieBanner
          onAccept={() => setIsCookieAccepted(true)}
          onPolicy={() => router.push("/polityka-cookies")}
        />
      )}
    </div>
  );
}
