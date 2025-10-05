"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Calculator,
  Shield,
  HelpCircle,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  BookOpen,
  Info,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Wszystkie");

  const faqItems: FAQItem[] = [
    {
      category: "Podstawy",
      question: "Jak działa kalkulator emerytur?",
      answer:
        "Kalkulator analizuje Twoje dane (wiek, płeć, wynagrodzenie, historię zatrudnienia) i na podstawie algorytmów ZUS oblicza prognozowaną wysokość emerytury. Uwzględnia inflację, średnie wynagrodzenie w kraju oraz zmiany demograficzne. Wyniki pokazują trzy wartości: nominalną (bez inflacji), urealnioną (z inflacją) oraz stopę zastąpienia (% ostatniego wynagrodzenia).",
    },
    {
      category: "Podstawy",
      question: "Jakie dane są potrzebne do kalkulacji?",
      answer:
        "Potrzebujesz: (1) obecny wiek, (2) płeć, (3) obecne wynagrodzenie brutto, (4) rok rozpoczęcia pracy, (5) planowany rok emerytury, (6) historię zatrudnienia (opcjonalnie - okresy pracy i wynagrodzenia), (7) informacje o zwolnieniach lekarskich (opcjonalnie). Im więcej danych podasz, tym dokładniejsza będzie symulacja.",
    },
    {
      category: "Wyniki",
      question: "Czy wyniki kalkulacji są wiążące?",
      answer:
        "NIE. Wyniki mają charakter edukacyjny i służą planowaniu finansowemu. Rzeczywista emerytura zależy od wielu czynników: zmian w przepisach, faktycznej długości zatrudnienia, wysokości składek, stopy waloryzacji i innych. Oficjalną wysokość emerytury ustala tylko Zakład Ubezpieczeń Społecznych na podstawie zgromadzonych składek.",
    },
    {
      category: "Wyniki",
      question: "Co to jest stopa zastąpienia?",
      answer:
        "Stopa zastąpienia to procent ostatniego wynagrodzenia, który będzie stanowić Twoja emerytura. Np. jeśli ostatnia pensja wynosiła 10 000 PLN, a stopa zastąpienia wynosi 60%, Twoja emerytura będzie wynosić 6 000 PLN. W Polsce średnia stopa zastąpienia wynosi około 50-60%. Im wyższa stopa, tym lepiej zachowujesz swój standard życia po przejściu na emeryturę.",
    },
    {
      category: "Wyniki",
      question: "Co to jest emerytura nominalna i urealniona?",
      answer:
        "Emerytura NOMINALNA to kwota, którą otrzymasz w przyszłości bez uwzględnienia inflacji (ceny wzrosły, ale Twoja siła nabywcza spadła). Emerytura UREALNIONA uwzględnia inflację i pokazuje, ile ta sama kwota będzie warta w dzisiejszych cenach. Przykład: nominalna 8 000 PLN za 20 lat może być warta dzisiaj tylko 4 500 PLN (urealniona).",
    },
    {
      category: "Metodologia",
      question: "Jak kalkulator uwzględnia inflację?",
      answer:
        "Kalkulator używa danych historycznych inflacji z lat 1995-2025 oraz prognozy na lata 2026-2080. Średnia roczna inflacja w Polsce wynosi około 2-3%. Algorytm dyskontuje przyszłe wartości emerytury do wartości bieżących, aby pokazać realną siłę nabywczą. Możesz to zobaczyć porównując wartość nominalną i urealnioną w wynikach.",
    },
    {
      category: "Metodologia",
      question: "Czy kalkulator uwzględnia zmiany w przepisach?",
      answer:
        "Kalkulator bazuje na obecnych przepisach obowiązujących w 2025 roku. Nie możemy przewidzieć przyszłych zmian legislacyjnych (np. zmiany wieku emerytalnego, wskaźników waloryzacji, mechanizmów indeksacji). Dlatego wyniki są prognozą opartą na obecnym stanie prawnym. Zalecamy regularne aktualizowanie symulacji.",
    },
    {
      category: "Dane osobowe",
      question: "Czy moje dane są bezpieczne?",
      answer:
        "TAK. Wszystkie dane przetwarzane są lokalnie w Twojej przeglądarce. NIE przesyłamy danych osobowych na serwery bez Twojej zgody. Kalkulacja odbywa się po stronie klienta (frontend). Jeśli zdecydujesz się zapisać wyniki, możesz to zrobić lokalnie (plik PDF) lub opcjonalnie w chmurze (wymaga logowania do PUE/eZUS).",
    },
    {
      category: "Dane osobowe",
      question: "Czy potrzebuję konta, aby korzystać z kalkulatora?",
      answer:
        "NIE. Podstawowy kalkulator działa bez rejestracji. Możesz korzystać anonimowo. Konto PUE/eZUS jest potrzebne tylko, jeśli chcesz: (1) zapisać wyniki w chmurze, (2) uzyskać dostęp do rzeczywistych danych z ZUS, (3) porównać swoje prognozy z oficjalnym kontem ubezpieczeniowym.",
    },
    {
      category: "Funkcje",
      question: "Czy mogę zapisać wyniki symulacji?",
      answer:
        "TAK. Po zakończeniu kalkulacji możesz: (1) pobrać raport w formacie PDF (zawiera wykresy, tabelę i szczegóły), (2) zapisać link do sesji (dane przechowywane lokalnie), (3) zalogować się i zapisać w chmurze (wymaga konta PUE/eZUS). PDF jest optymalny do konsultacji z doradcą finansowym.",
    },
    {
      category: "Funkcje",
      question: "Czy mogę porównać różne scenariusze?",
      answer:
        "TAK. Kalkulator pozwala przetestować 5 scenariuszy: (1) Bazowy (obecne parametry), (2) Praca do 67 roku życia, (3) Dodatkowe 3 lata pracy, (4) Dodatkowe 5 lat pracy, (5) Scenariusz własny (dowolne parametry). Możesz zobaczyć, jak zmienia się emerytura w zależności od długości pracy i wysokości składek.",
    },
    {
      category: "Problemy",
      question: "Kalkulator pokazuje błąd. Co robić?",
      answer:
        "Sprawdź: (1) Czy wszystkie wymagane pola są wypełnione, (2) Czy daty są logiczne (rok rozpoczęcia pracy < rok emerytury), (3) Czy wynagrodzenie jest w rozsądnym zakresie (1500 - 100 000 PLN), (4) Czy masz stabilne połączenie internetowe (jeśli korzystasz z API). Jeśli problem się powtarza, skontaktuj się z supportem (pomoc@zus-kalkulator.pl).",
    },
    {
      category: "Problemy",
      question: "Wyniki wydają się zbyt niskie. Dlaczego?",
      answer:
        "Wyniki mogą być niższe niż oczekiwane z powodu: (1) Inflacji - urealniona emerytura jest niższa niż nominalna, (2) Zmian demograficznych - wskaźnik przeciętnego dalszego trwania życia rośnie, (3) Niskiej stopy zastąpienia w Polsce (50-60%), (4) Luk w zatrudnieniu (okresy bez składek). Pamiętaj, że to prognozy edukacyjne, a nie gwarancje.",
    },
    {
      category: "Zaawansowane",
      question: "Czy mogę zaimportować dane z mojego konta ZUS?",
      answer:
        "W przyszłości tak. Obecnie pracujemy nad integracją z API ZUS (PUE/eZUS), która pozwoli automatycznie pobrać: (1) historię zatrudnienia, (2) wysokość opłaconych składek, (3) okresy nieskładkowe. To wyeliminuje konieczność ręcznego wprowadzania danych. Funkcja będzie dostępna w Q2 2025.",
    },
    {
      category: "Zaawansowane",
      question: "Jak mogę skorzystać ze skrótów klawiaturowych?",
      answer:
        "Skróty: (1) Tab - nawigacja między polami, (2) Enter - przejście do następnego kroku, (3) Shift + Enter - powrót do poprzedniego kroku, (4) Ctrl/Cmd + S - zapisz draft (jeśli zalogowany), (5) Esc - zamknij modal/tooltip, (6) Ctrl/Cmd + P - pobierz PDF (na stronie wyników). Wszystkie formularze obsługują pełną nawigację klawiaturą.",
    },
  ];

  const categories = [
    "Wszystkie",
    "Podstawy",
    "Wyniki",
    "Metodologia",
    "Dane osobowe",
    "Funkcje",
    "Problemy",
    "Zaawansowane",
  ];

  const filteredFAQs =
    activeCategory === "Wszystkie"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const quickLinks = [
    {
      icon: Calculator,
      title: "Rozpocznij symulację",
      description: "Oblicz swoją przyszłą emeryturę w 60 sekund",
      href: "/symulacja",
      color: "#00993F",
    },
    {
      icon: BookOpen,
      title: "Dane & Metody",
      description: "Poznaj metodologię i źródła danych",
      href: "/dane-metody",
      color: "#00416E",
    },
    {
      icon: FileText,
      title: "Ciekawostki",
      description: "Fascynujące fakty o emeryturach",
      href: "/trivia",
      color: "#FFB34F",
    },
    {
      icon: Shield,
      title: "Polityka prywatności",
      description: "Dowiedz się, jak chronimy Twoje dane",
      href: "/polityka-cookies",
      color: "#3F84D2",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "pomoc@zus-kalkulator.pl",
      description: "Odpowiadamy w ciągu 24h",
    },
    {
      icon: Phone,
      title: "Infolinia ZUS",
      value: "22 560 16 00",
      description: "Pon-Pt: 7:00-18:00",
    },
    {
      icon: MessageSquare,
      title: "Chat na żywo",
      value: "Dostępny wkrótce",
      description: "Asystent AI pomoże Ci w kalkulacji",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#00993F] to-[#00416E] py-16 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em]">
                <HelpCircle size={20} />
                Centrum pomocy
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Pomoc i FAQ
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące
                kalkulatora emerytur, metodologii obliczeń i bezpieczeństwa danych
              </p>
            </div>

            {/* Search Bar - Placeholder */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Wyszukaj pytanie... (np. inflacja, emerytura, dane)"
                  className="w-full h-14 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 px-6 pr-12 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white/60"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 20L16.5 16.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 bg-[#F6F8FA]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[--ink] mb-8 text-center">
              Szybkie linki
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <Card className="p-6 h-full hover:shadow-lg transition-all border-2 border-transparent hover:border-[#00993F]/20 cursor-pointer group">
                      <div className="flex flex-col items-start gap-4">
                        <div
                          className="p-3 rounded-xl transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${link.color}15` }}
                        >
                          <Icon size={24} style={{ color: link.color }} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-[--ink] group-hover:text-[#00993F] transition-colors">
                            {link.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[--ink] mb-4">
                Najczęściej zadawane pytania
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Przeglądaj pytania według kategorii lub użyj wyszukiwarki powyżej
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    onClick={() => setActiveCategory(category)}
                    className={
                      activeCategory === category
                        ? "rounded-full bg-[#00993F] text-white hover:bg-[#00993F]/90"
                        : "rounded-full border-[#00993F] text-[#00993F] hover:bg-[#00993F] hover:text-white"
                    }
                  >
                    {category}
                    {activeCategory !== "Wszystkie" && activeCategory === category && (
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {faqItems.filter((item) => item.category === category).length}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredFAQs.map((item, index) => {
                const isOpen = openFAQ === index;
                return (
                  <Card
                    key={index}
                    className={`border-2 transition-all ${
                      isOpen
                        ? "border-[#00993F] shadow-lg"
                        : "border-gray-200 hover:border-[#00993F]/30"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFAQ(isOpen ? null : index)}
                      className="w-full p-6 text-left flex items-start justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#00993F] bg-[#00993F]/10 px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[--ink] group-hover:text-[#00993F] transition-colors">
                          {item.question}
                        </h3>
                      </div>
                      <div
                        className={`flex-shrink-0 text-[#00993F] transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <ChevronDown size={24} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        {item.answer}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* No Results */}
            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <Info size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Brak pytań w kategorii "{activeCategory}". Wybierz inną kategorię.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-br from-[#00993F]/5 to-[#00416E]/5">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[--ink] mb-4">
                Potrzebujesz dodatkowej pomocy?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Skontaktuj się z nami przez jeden z poniższych kanałów. Chętnie
                odpowiemy na wszystkie pytania dotyczące kalkulatora emerytur.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={method.title}
                    className="p-8 text-center hover:shadow-lg transition-all border-2 border-transparent hover:border-[#00993F]/20"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-xl bg-[#00993F]/10">
                        <Icon size={32} className="text-[#00993F]" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-[--ink]">
                          {method.title}
                        </h3>
                        <p className="text-lg font-semibold text-[#00993F]">
                          {method.value}
                        </p>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Additional Help CTA */}
            <div className="mt-16 text-center">
              <Card className="p-8 max-w-3xl mx-auto bg-white">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#FFB34F]/10 px-4 py-2 text-sm font-semibold text-[#FFB34F]">
                    <Info size={18} />
                    Przydatne zasoby
                  </div>
                  <h3 className="text-2xl font-bold text-[--ink]">
                    Oficjalne strony ZUS
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="outline"
                      className="border-[#00993F] text-[#00993F] hover:bg-[#00993F] hover:text-white"
                      asChild
                    >
                      <a
                        href="https://www.zus.pl"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ZUS.pl
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#00993F] text-[#00993F] hover:bg-[#00993F] hover:text-white"
                      asChild
                    >
                      <a
                        href="https://www.zus.pl/portal"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Portal PUE ZUS
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#00993F] text-[#00993F] hover:bg-[#00993F] hover:text-white"
                      asChild
                    >
                      <a
                        href="https://www.zus.pl/baza-wiedzy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Baza wiedzy
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[--ink] mb-4">
                  Skróty klawiaturowe
                </h2>
                <p className="text-gray-600">
                  Używaj kalkulatora szybciej dzięki skrótom klawiaturowym
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { keys: ["Tab"], description: "Nawigacja między polami formularza" },
                  { keys: ["Enter"], description: "Przejście do następnego kroku" },
                  {
                    keys: ["Shift", "Enter"],
                    description: "Powrót do poprzedniego kroku",
                  },
                  { keys: ["Esc"], description: "Zamknij modal lub tooltip" },
                  {
                    keys: ["Ctrl/Cmd", "S"],
                    description: "Zapisz draft (wymaga logowania)",
                  },
                  {
                    keys: ["Ctrl/Cmd", "P"],
                    description: "Pobierz PDF (strona wyników)",
                  },
                  {
                    keys: ["?"],
                    description: "Pokaż skróty klawiaturowe (w symulatorze)",
                  },
                  {
                    keys: ["Ctrl/Cmd", "K"],
                    description: "Otwórz wyszukiwarkę pomocy",
                  },
                ].map((shortcut, index) => (
                  <Card key={index} className="p-4 border-2 border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {shortcut.keys.map((key) => (
                          <kbd
                            key={key}
                            className="px-3 py-1.5 text-sm font-mono font-semibold text-[--ink] bg-gray-100 border border-gray-300 rounded-lg shadow-sm"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                      <span className="text-sm text-gray-700 flex-1">
                        {shortcut.description}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


