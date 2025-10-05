"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CalculationAdminDetail {
    calculationId: string;
    calculationDate: string;
    calculationTime: string;
    expectedPension: string;
    age: number;
    sex: string;
    salary: string;
    isSickLeaveIncluded: boolean;
    totalAccumulatedFunds: string;
    yearWorkStart: number;
    yearDesiredRetirement: number;
    postalCode?: string;
    nominalPension?: string;
    realPension?: string;
}

interface PaginatedCalculationsResponse {
    submissions: CalculationAdminDetail[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export default function AdminPanel() {
    const [calculations, setCalculations] = useState<CalculationAdminDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0
    });
    const [useMock, setUseMock] = useState(false);

    const fetchCalculations = async (page: number = 1, limit: number = 20) => {
        try {
            setLoading(true);
            setError(null);

            let data: PaginatedCalculationsResponse;
            if (useMock) {
                const res = await fetch('/mock-responses/calculations-list.json');
                data = await res.json();
            } else {
                const response = await fetch(`http://localhost:8000/calculations?page=${page}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                data = await response.json();
            }

            setCalculations(data.submissions || []);
            setPagination({
                page: data.page || 1,
                pageSize: data.pageSize || limit,
                totalItems: data.totalItems || 0,
                totalPages: data.totalPages || 0
            });
        } catch (err) {
            // Handle network errors gracefully - show empty state instead of error
            if (err instanceof TypeError && err.message.includes('fetch')) {
                // Backend not running - show empty state
                setCalculations([]);
                setPagination({
                    page: 1,
                    pageSize: limit,
                    totalItems: 0,
                    totalPages: 0
                });
                console.log('Backend not available, showing empty state');
            } else {
                setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania danych');
            }
            console.error('Error fetching calculations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalculations();
    }, [useMock]);

    const formatCurrency = (value: string) => {
        const num = parseFloat(value);
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN'
        }).format(num);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pl-PL');
    };

    const formatTime = (timeStr: string) => {
        return timeStr.substring(0, 8); // Remove timezone info if present
    };

    const handlePageChange = (newPage: number) => {
        fetchCalculations(newPage, pagination.pageSize);
    };

    // Pagination controls
    const renderPagination = () => {
        if (pagination.totalPages <= 1) return null;
        const pages = [];
        for (let i = 1; i <= pagination.totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-2 py-1 mx-1 rounded ${pagination.page === i ? 'bg-primary text-white' : 'bg-gray-200'}`}
                >
                    {i}
                </button>
            );
        }
        return <div className="my-4 flex justify-center">{pages}</div>;
    };

    const downloadReport = async () => {
        try {
            const response = await fetch('http://localhost:8000/calculations/export?lang=pl-PL');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Get the blob data
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `obliczenia-emerytur-${new Date().toISOString().split('T')[0]}.xlsx`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Error downloading report:', err);
            alert('Wystąpił błąd podczas pobierania raportu. Sprawdź czy backend jest uruchomiony.');
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="p-4">
                <label>
                    <input
                        type="checkbox"
                        checked={useMock}
                        onChange={e => setUseMock(e.target.checked)}
                        style={{ marginRight: '8px' }}
                    />
                    Użyj mockowanych danych
                </label>
            </div>
            <main className="flex-1">
                {/* Header Section */}
                <section className="bg-gradient-to-br from-[#00993F] to-[#00416E] py-16 text-white">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center space-y-6">
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                Panel Administracyjny
                            </h1>
                            <p className="text-xl text-white/90 max-w-3xl mx-auto">
                                Podsumowanie wszystkich obliczeń w systemie
                            </p>
                            <div className="pt-4">
                                <Button
                                    onClick={downloadReport}
                                    className="bg-[#FFB34F] hover:bg-[#FFB34F]/90 text-[--ink] px-8 py-3 rounded-full font-semibold"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Pobierz raport XLS
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Total Responses as Regular Text */}
                        <div className="mb-8 text-center">
                            <span className="text-lg font-medium text-gray-700">
                                Liczba wszystkich obliczeń w systemie: <span className="font-semibold text-[#00993F]">{pagination.totalItems}</span>
                            </span>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00993F]"></div>
                                <p className="mt-4 text-gray-600">Ładowanie obliczeń...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <Card className="p-6 border-red-200 bg-red-50">
                                <div className="text-center">
                                    <div className="text-red-600 font-semibold mb-2">Błąd ładowania danych</div>
                                    <p className="text-red-500 mb-4">{error}</p>
                                    <Button
                                        onClick={() => fetchCalculations(pagination.page, pagination.pageSize)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Spróbuj ponownie
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Empty State */}
                        {!loading && !error && calculations.length === 0 && (
                            <Card className="p-12 text-center">
                                <div className="space-y-4">
                                    <div className="text-6xl">📊</div>
                                    <h3 className="text-xl font-semibold text-gray-900">Brak obliczeń</h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Obecnie nie ma żadnych obliczeń emerytur w systemie.
                                        Gdy użytkownicy zaczną korzystać z kalkulatora, obliczenia pojawią się tutaj.
                                    </p>
                                    <div className="pt-4">
                                        <Button
                                            onClick={() => fetchCalculations(pagination.page, pagination.pageSize)}
                                            className="bg-[#00993F] hover:bg-[#00993F]/90 text-white"
                                        >
                                            Odśwież
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Calculations Table */}
                        {!loading && !error && calculations.length > 0 && (
                            <>
                                <Card className="overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#00993F] text-white">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Wiek</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Płeć</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Pensja</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Oczekiwana emerytura</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Kod pocztowy</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {calculations.map((calc) => (
                                                    <tr key={calc.calculationId} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                                            {calc.calculationId.substring(0, 8)}...
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <div>{formatDate(calc.calculationDate)}</div>
                                                            <div className="text-gray-500">{formatTime(calc.calculationTime)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">{calc.age} lat</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${calc.sex === 'female'
                                                                ? 'bg-pink-100 text-pink-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                {calc.sex === 'female' ? 'Kobieta' : 'Mężczyzna'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold">
                                                            {formatCurrency(calc.salary)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-[#00993F]">
                                                            {formatCurrency(calc.expectedPension)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {calc.postalCode || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>

                                <div className="mt-8 flex flex-col items-center justify-center w-full">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pagination.page === 1}
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                        >
                                            Poprzednia
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {pagination.totalPages > 3 ? (
                                                <>
                                                    {Array.from({ length: 3 }, (_, i) => {
                                                        const pageNum = i + 1;
                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={pageNum === pagination.page ? "default" : "outline"}
                                                                size="sm"
                                                                className={pageNum === pagination.page ? "bg-[#00993F] text-white" : ""}
                                                                onClick={() => handlePageChange(pageNum)}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    })}
                                                    <span className="mx-2 flex items-center text-gray-500">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M4 12h16M12 4v16" stroke="#00993F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <span className="ml-1">{pagination.totalPages}</span>
                                                    </span>
                                                </>
                                            ) : (
                                                Array.from({ length: Math.max(2, pagination.totalPages) }, (_, i) => {
                                                    const pageNum = i + 1;
                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={pageNum === pagination.page ? "default" : "outline"}
                                                            size="sm"
                                                            className={pageNum === pagination.page ? "bg-[#00993F] text-white" : ""}
                                                            onClick={() => handlePageChange(pageNum)}
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    );
                                                })
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pagination.page === pagination.totalPages}
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                        >
                                            Następna
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#00993F] py-12 text-white">
                    <div className="container mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/15 px-4 text-sm sm:px-6 sm:text-base lg:px-8 lg:flex-row lg:items-center lg:justify-between">
                        <p className="font-medium text-white/90">
                            © 2025 ZUS Symulator Emerytalny. Panel administracyjny.
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
