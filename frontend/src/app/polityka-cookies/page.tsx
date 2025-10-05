"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

const sections = [
  {
    title: "Cel przetwarzania",
    content:
      "Pliki cookies pomagają nam zapewnić prawidłowe działanie symulatora, zapamiętać Twoje preferencje oraz zbierać anonimowe dane statystyczne o sposobie korzystania z aplikacji.",
  },
  {
    title: "Rodzaje stosowanych plików",
    list: [
      "Niezbędne – utrzymują sesję i zapisują podstawowe ustawienia interfejsu.",
      "Analityczne – pomagają nam mierzyć popularność funkcji (anonimowe dane).",
      "Funkcjonalne – pamiętają ostatnio wprowadzone dane, aby szybciej kontynuować symulację.",
    ],
  },
  {
    title: "Jak zarządzać cookies?",
    content:
      "Możesz w każdej chwili usunąć lub zablokować cookies w ustawieniach przeglądarki. Wpłynie to jednak na niektóre funkcje symulatora. Aby zmienić swoje preferencje, skorzystaj również z przycisku \"Ustawienia\" w banerze cookies.",
  },
  {
    title: "Kontakt",
    content:
      "Masz pytania dotyczące przetwarzania danych? Napisz do nas na adres: bezpieczenstwo@zus-symulator.pl.",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#f6f8fa] py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" style={{
            background:
              "radial-gradient(120% 120% at 50% -10%, rgba(0, 153, 63, 0.18) 0%, rgba(0, 65, 110, 0.05) 55%, rgba(255, 255, 255, 0) 85%)",
          }} />
          <div className="container relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[32px] border border-[#dde6f2] bg-white/95 px-6 py-10 shadow-[0_35px_70px_-45px_rgba(9,31,56,0.45)] backdrop-blur sm:px-10 sm:py-14">
              <div className="space-y-4 text-center sm:text-left">
                <span className="inline-flex items-center rounded-full bg-[#00993f]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#00993f]">
                  Polityka cookies
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-[--ink] sm:text-4xl">
                  Jak wykorzystujemy pliki cookies
                </h1>
                <p className="text-base leading-7 text-[#4a5566] sm:text-lg">
                  Poniżej znajdziesz informacje o tym, jakie dane gromadzimy, w jakim celu oraz w jaki sposób możesz zarządzać swoimi preferencjami.
                </p>
              </div>

              <div className="mt-12 space-y-10">
                {sections.map((section) => (
                  <article key={section.title} className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[--ink]">
                      {section.title}
                    </h2>
                    {section.content && (
                      <p className="text-base leading-7 text-[#4a5566]">
                        {section.content}
                      </p>
                    )}
                    {section.list && (
                      <ul className="grid gap-3 text-base leading-7 text-[#4a5566]">
                        {section.list.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 inline-flex size-2 rounded-full bg-[#00993f]" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
