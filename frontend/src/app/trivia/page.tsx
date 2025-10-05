"use client";

import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TriviaPage() {
    const triviaFacts = [
        {
            id: 1,
            title: "Najwyższa emerytura w Polsce",
            content: "Najwyższa emerytura wypłacana przez ZUS wynosi około 48 673,53 zł brutto miesięcznie. Otrzymuje ją mężczyzna, który pracował przez 67 lat, przechodząc na emeryturę w wieku 86 lat.",
            icon: "💰",
            category: "Finanse",
            source: "https://www.infor.pl/prawo/tematy/wysokosc-swiadczenia-z-zus/emerytury/"
        },
        {
            id: 2,
            title: "Najniższa emerytura w Polsce",
            content: "ZUS wypłaca emerytury nawet w wysokości 2 groszy miesięcznie. Dzieje się tak, ponieważ już składka emerytalna opłacona za jeden dzień pracy otwiera drogę do świadczenia.",
            icon: "📉",
            category: "Finanse",
            source: "https://www.fakt.pl/pieniadze/szokujacy-raport-zus-dotyczacy-emerytur-wstydliwa-prawda/n1sylqc"
        },
        {
            id: 3,
            title: "ZUS - największy pracodawca",
            content: "Zakład Ubezpieczeń Społecznych zatrudnia ponad 40 000 pracowników i jest jednym z największych pracodawców w Polsce.",
            icon: "👥",
            category: "ZUS",
            source: "https://wideoportal.tv/artykul/10-faktow-ktorych-wiesz-o-zus-n656595"
        },
        {
            id: 4,
            title: "Pracujący emeryci",
            content: "Na koniec 2024 roku w Polsce było 1,2 miliona pracujących emerytów, co stanowiło 13,7% ogółu emerytów. Wśród nich 58,1% to kobiety.",
            icon: "👨‍💼",
            category: "Statystyki",
            source: "https://www.bankier.pl/wiadomosc/Rekordowe-emerytury-w-Polsce-ZUS-pokazuje-roznice-w-swiadczeniu-9010493.html"
        },
        {
            id: 5,
            title: "Wiek emerytalny w różnych krajach",
            content: "Polska ma jeden z najniższych wieków emerytalnych w Europie (60/65 lat). W Niemczech wynosi on 67 lat, w Danii 68 lat, a w Islandii 67 lat.",
            icon: "🌍",
            category: "Porównania",
            source: "https://wideoportal.tv/artykul/10-faktow-ktorych-wiesz-o-zus-n656595"
        },
        {
            id: 6,
            title: "Historia ZUS",
            content: "Zakład Ubezpieczeń Społecznych został utworzony w 1934 roku, kontynuując tradycje wcześniejszych instytucji ubezpieczeniowych. Pierwsze przepisy dotyczące ubezpieczeń społecznych wprowadzono w Polsce w 1927 roku.",
            icon: "🏛️",
            category: "Historia",
            source: "https://www.zus.pl/o-zus/o-nas/historia-zus/kartki-z-kalendarza"
        },
        {
            id: 7,
            title: "Wzrost wysokich emerytur",
            content: "W 2019 roku tylko 11 osób w Polsce miało emeryturę wyższą niż 15 tys. zł. Obecnie liczba ta wzrosła do ponad 3,7 tys. seniorów - to 336-krotny wzrost w ciągu 5 lat.",
            icon: "📈",
            category: "Statystyki",
            source: "https://businessinsider.com.pl/praca/emerytury/cala-prawda-o-emeryturach-z-zus-przybywa-bogatych-seniorow/61z59dd"
        },
        {
            id: 8,
            title: "Emerytura na zagraniczne konto",
            content: "Polska emerytura z ZUS może być wypłacana na zagraniczne konto bankowe. To ułatwia życie emerytom mieszkającym za granicą.",
            icon: "🌐",
            category: "Ciekawostki",
            source: "https://www.egospodarka.pl/art/s/emerytury-z-zus.html"
        }
    ];

    const categories = ["Wszystkie", "Historia", "Statystyki", "ZUS", "Finanse", "Porównania", "Ciekawostki"];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-[#00993F] to-[#00416E] py-16 text-white">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center space-y-6">
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                Ciekawostki o Emeryturach
                            </h1>
                            <p className="text-xl text-white/90 max-w-3xl mx-auto">
                                Poznaj fascynujące fakty o systemie emerytalnym, historii ZUS i emeryturach na świecie
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Category Filter */}
                        <div className="mb-12">
                            <div className="flex flex-wrap gap-3 justify-center">
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant="outline"
                                        className="rounded-full border-[#00993F] text-[#00993F] hover:bg-[#00993F] hover:text-white transition-all"
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Trivia Grid */}
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {triviaFacts.map((fact) => (
                                <Card key={fact.id} className="p-6 hover:shadow-lg transition-shadow border border-gray-200 relative">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">{fact.icon}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#00993F] bg-[#00993F]/10 px-2 py-1 rounded-full">
                                                        {fact.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-[--ink] mb-3">
                                                    {fact.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {fact.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="absolute top-4 right-4 h-8 px-3 text-xs border-[#00993F] text-[#00993F] hover:bg-[#00993F] hover:text-white"
                                        asChild
                                    >
                                        <a
                                            href={fact.source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Źródło
                                        </a>
                                    </Button>
                                </Card>
                            ))}
                        </div>

                        {/* Call to Action */}
                        <div className="mt-16 text-center">
                            <Card className="p-8 bg-gradient-to-r from-[#00993F]/5 to-[#00416E]/5 border-[#00993F]/20">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-[--ink]">
                                        Chcesz sprawdzić swoją przyszłą emeryturę?
                                    </h2>
                                    <p className="text-gray-600 max-w-2xl mx-auto">
                                        Skorzystaj z naszego kalkulatora emerytalnego i dowiedz się, jaką emeryturę możesz otrzymać w przyszłości.
                                    </p>
                                    <Button
                                        size="lg"
                                        className="bg-[#00993F] hover:bg-[#00993F]/90 text-white px-8 py-3 rounded-full"
                                        asChild
                                    >
                                        <Link href="/">
                                            Przejdź do kalkulatora
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#00993F] py-12 text-white">
                    <div className="container mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/15 px-4 text-sm sm:px-6 sm:text-base lg:px-8 lg:flex-row lg:items-center lg:justify-between">
                        <p className="font-medium text-white/90">
                            © 2025 ZUS Symulator Emerytalny. Narzędzie edukacyjne.
                        </p>
                        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-semibold text-white">
                            <a href="/polityka-prywatnosci" className="transition-opacity hover:opacity-80">
                                Polityka prywatności
                            </a>
                            <a href="/regulamin" className="transition-opacity hover:opacity-80">
                                Regulamin
                            </a>
                            <a href="/kontakt" className="transition-opacity hover:opacity-80">
                                Kontakt
                            </a>
                        </nav>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70 sm:text-sm">
                            Wersja danych: 2025-01-15 | Model v1.0
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
