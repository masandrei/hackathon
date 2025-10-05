"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatisticsService, type StatisticsResponse } from "@/api-client/services/StatisticsService";
import { TrendingUp, DollarSign, LineChart, Users, Calendar, AlertCircle, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DashboardPage() {
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const statsCardsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await StatisticsService.getStatistics();
      setStatistics(data);
    } catch (err) {
      setError("Nie udało się załadować statystyk. Spróbuj ponownie później.");
      console.error("Error loading statistics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentYear = () => new Date().getFullYear();

  const getLatestValue = (data: Array<{ year: number; value: number }>) => {
    if (!data || data.length === 0) return null;
    const sorted = [...data].sort((a, b) => b.year - a.year);
    return sorted[0];
  };

  const getHistoricalAverage = (data: Array<{ year: number; value: number }>, years: number = 5) => {
    if (!data || data.length === 0) return null;
    const currentYear = getCurrentYear();
    const historical = data.filter(d => d.year >= currentYear - years && d.year < currentYear);
    if (historical.length === 0) return null;
    const sum = historical.reduce((acc, curr) => acc + curr.value, 0);
    return sum / historical.length;
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatYears = (value: number) => {
    return `${value.toFixed(1)} lat`;
  };

  const exportToPDF = async () => {
    if (!statistics || !statsCardsRef.current || !chartsRef.current) return;

    try {
      setIsExporting(true);

      // Utwórz PDF (format A4: 210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let currentY = margin;

      // Logo i Header
      pdf.setFontSize(24);
      pdf.setTextColor(0, 65, 110); // Navy
      pdf.text('Dashboard Statystyk Emerytalnych', margin, currentY);
      
      currentY += 10;
      pdf.setFontSize(12);
      pdf.setTextColor(107, 114, 128); // Gray
      pdf.text('Kluczowe wskaźniki ekonomiczne i demograficzne dla Polski', margin, currentY);
      
      currentY += 5;
      pdf.setFontSize(10);
      const today = new Date().toLocaleDateString('pl-PL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      pdf.text(`Wygenerowano: ${today}`, margin, currentY);

      if (statistics.meta?.scenario) {
        currentY += 5;
        pdf.text(`Scenariusz: ${statistics.meta.scenario}`, margin, currentY);
      }

      currentY += 15;

      // Przechwytywanie kart statystyk
      pdf.setFontSize(16);
      pdf.setTextColor(0, 65, 110);
      pdf.text('Kluczowe Wskaźniki', margin, currentY);
      currentY += 10;

      const statsCanvas = await html2canvas(statsCardsRef.current, {
        scale: 2,
        backgroundColor: '#FAFBFC',
        logging: false,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Dodaj bezpieczne style bez oklch/lab
          const safeStyles = clonedDoc.createElement('style');
          safeStyles.textContent = `
            * { box-sizing: border-box; }
            .grid { display: grid; gap: 1.5rem; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .justify-between { justify-content: space-between; }
            .p-3 { padding: 0.75rem; }
            .p-6 { padding: 1.5rem; }
            .mb-1 { margin-bottom: 0.25rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .border-2 { border-width: 2px; border-style: solid; }
            .rounded-xl { border-radius: 0.75rem; }
            .w-8 { width: 2rem; }
            .h-8 { height: 2rem; }
            .text-sm { font-size: 0.875rem; }
            .text-lg { font-size: 1.125rem; }
            .text-3xl { font-size: 1.875rem; }
            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }
            .font-bold { font-weight: 700; }
            .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
            .text-\\[\\#00993F\\] { color: #00993F !important; }
            .text-\\[\\#3F84D2\\] { color: #3F84D2 !important; }
            .text-\\[\\#FFB34F\\] { color: #FFB34F !important; }
            .text-\\[\\#00416E\\] { color: #00416E !important; }
            .text-\\[\\#F05E5E\\] { color: #F05E5E !important; }
            .text-gray-500 { color: #6B7280 !important; }
            .text-gray-600 { color: #4B5563 !important; }
            .bg-\\[\\#E6F7ED\\] { background: #E6F7ED !important; }
            .bg-\\[\\#EBF3FB\\] { background: #EBF3FB !important; }
            .bg-\\[\\#FFFBEB\\] { background: #FFFBEB !important; }
            .bg-\\[\\#EBF1F5\\] { background: #EBF1F5 !important; }
            .bg-\\[\\#FEF0F0\\] { background: #FEF0F0 !important; }
            .bg-white { background: #FFF !important; }
            .border-\\[\\#00993F\\/20\\] { border-color: rgba(0,153,63,0.2) !important; }
            .border-\\[\\#3F84D2\\/20\\] { border-color: rgba(63,132,210,0.2) !important; }
            .border-\\[\\#FFB34F\\/20\\] { border-color: rgba(255,179,79,0.2) !important; }
            .border-\\[\\#00416E\\/20\\] { border-color: rgba(0,65,110,0.2) !important; }
            .border-\\[\\#F05E5E\\/20\\] { border-color: rgba(240,94,94,0.2) !important; }
            
            /* SVG icons */
            svg { display: inline-block; vertical-align: middle; }
          `;
          clonedDoc.head.appendChild(safeStyles);
          
          // Usuń problematyczne style tags
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach(style => {
            if (style !== safeStyles && style.textContent && (
              style.textContent.includes('oklch') || 
              style.textContent.includes('lab(') || 
              style.textContent.includes('@theme')
            )) {
              style.remove();
            }
          });
        },
      });

      const statsImgWidth = pageWidth - 2 * margin;
      const statsImgHeight = (statsCanvas.height * statsImgWidth) / statsCanvas.width;

      // Sprawdź czy mieści się na stronie
      if (currentY + statsImgHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.addImage(
        statsCanvas.toDataURL('image/png'),
        'PNG',
        margin,
        currentY,
        statsImgWidth,
        statsImgHeight
      );

      currentY += statsImgHeight + 15;

      // Nowa strona dla wykresów
      pdf.addPage();
      currentY = margin;

      pdf.setFontSize(16);
      pdf.setTextColor(0, 65, 110);
      pdf.text('Wykresy i Trendy', margin, currentY);
      currentY += 10;

      // Przechwytywanie wykresów
      const chartsCanvas = await html2canvas(chartsRef.current, {
        scale: 2,
        backgroundColor: '#FAFBFC',
        logging: false,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Dodaj bezpieczne style dla wykresów
          const safeStyles = clonedDoc.createElement('style');
          safeStyles.textContent = `
            * { box-sizing: border-box; }
            .grid { display: grid; gap: 2rem; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .flex-1 { flex: 1; }
            .items-center { align-items: center; }
            .items-end { align-items: flex-end; }
            .justify-between { justify-content: space-between; }
            .gap-1 { gap: 0.25rem; }
            .gap-2 { gap: 0.5rem; }
            .gap-3 { gap: 0.75rem; }
            .p-6 { padding: 1.5rem; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .pr-2 { padding-right: 0.5rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mt-4 { margin-top: 1rem; }
            .pt-4 { padding-top: 1rem; }
            .ml-\\[72px\\] { margin-left: 72px; }
            .border-t { border-top: 1px solid #E5E7EB; }
            .border-r { border-right: 1px solid #E5E7EB; }
            .border-gray-100 { border-color: #F3F4F6; }
            .border-gray-200 { border-color: #E5E7EB; }
            .rounded-md { border-radius: 0.375rem; }
            .rounded-lg { border-radius: 0.5rem; }
            .rounded-full { border-radius: 9999px; }
            .w-full { width: 100%; }
            .h-full { height: 100%; }
            .h-48 { height: 12rem; }
            .min-w-\\[60px\\] { min-width: 60px; }
            .text-xs { font-size: 0.75rem; }
            .text-sm { font-size: 0.875rem; }
            .text-lg { font-size: 1.125rem; }
            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .relative { position: relative; }
            .absolute { position: absolute; }
            .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
            .text-\\[\\#00993F\\] { color: #00993F !important; }
            .text-\\[\\#00416E\\] { color: #00416E !important; }
            .text-gray-500 { color: #6B7280 !important; }
            .text-gray-600 { color: #4B5563 !important; }
            .bg-white { background: #FFF !important; }
            .bg-gray-100 { background: #F3F4F6 !important; }
            
            /* SVG icons */
            svg { display: inline-block; vertical-align: middle; }
            
            /* Card backgrounds */
            [style*="background-color"] { opacity: 1 !important; }
          `;
          clonedDoc.head.appendChild(safeStyles);
          
          // Upewnij się że inline style też mają hex kolory
          const elementsWithStyle = clonedDoc.querySelectorAll('[style]');
          elementsWithStyle.forEach((el: Element) => {
            if (el instanceof HTMLElement && el.style.backgroundColor) {
              // Zachowaj inline styles które już są w hex
              const bg = el.style.backgroundColor;
              if (!bg.startsWith('#') && !bg.startsWith('rgb')) {
                el.style.backgroundColor = '#FAFBFC';
              }
            }
          });
          
          // Usuń problematyczne style tags
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach(style => {
            if (style !== safeStyles && style.textContent && (
              style.textContent.includes('oklch') || 
              style.textContent.includes('lab(') || 
              style.textContent.includes('@theme')
            )) {
              style.remove();
            }
          });
        },
      });

      const chartsImgWidth = pageWidth - 2 * margin;
      const chartsImgHeight = (chartsCanvas.height * chartsImgWidth) / chartsCanvas.width;

      // Jeśli wykresy są za duże, podziel na strony
      if (chartsImgHeight > pageHeight - currentY - margin) {
        // Zmniejsz lub podziel
        const maxHeight = pageHeight - currentY - margin;
        const scale = maxHeight / chartsImgHeight;
        
        pdf.addImage(
          chartsCanvas.toDataURL('image/png'),
          'PNG',
          margin,
          currentY,
          chartsImgWidth * scale,
          maxHeight
        );
      } else {
        pdf.addImage(
          chartsCanvas.toDataURL('image/png'),
          'PNG',
          margin,
          currentY,
          chartsImgWidth,
          chartsImgHeight
        );
      }

      // Nowa strona - informacje o danych
      pdf.addPage();
      currentY = margin;

      pdf.setFontSize(16);
      pdf.setTextColor(0, 65, 110);
      pdf.text('O Statystykach', margin, currentY);
      currentY += 10;

      pdf.setFontSize(11);
      pdf.setTextColor(55, 65, 81); // Gray-700
      
      const infoText = [
        'Przedstawione statystyki pochodzą z oficjalnych źródeł i prognoz demograficznych.',
        'Dane obejmują historyczne wartości oraz prognozy na przyszłe lata.',
        '',
        'Wskaźniki te są wykorzystywane w kalkulatorze do oszacowania przyszłej emerytury',
        'z uwzględnieniem inflacji, wzrostu płac i oczekiwanej długości życia.',
        '',
        'Źródła danych:',
        '• Główny Urząd Statystyczny (GUS)',
        '• Zakład Ubezpieczeń Społecznych (ZUS)',
        '• Ministerstwo Finansów',
        '• Prognozy demograficzne',
      ];

      infoText.forEach(line => {
        if (currentY > pageHeight - margin - 10) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(line, margin, currentY);
        currentY += 6;
      });

      // Stopka
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(156, 163, 175); // Gray-400
        pdf.text(
          `Strona ${i} z ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        pdf.text(
          'Kalkulator Emerytur ZUS - #RAND0M6',
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        );
      }

      // Zapisz PDF
      const fileName = `statystyki-emerytur-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (err) {
      console.error('Error generating PDF:', err);
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      alert(`Wystąpił błąd podczas generowania PDF:\n${errorMessage}\n\nSpróbuj odświeżyć stronę i ponownie.`);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
        <Header />
        <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
        <Header />
        <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-[#00416E] mb-2">Wystąpił błąd</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadStatistics}
              className="px-6 py-3 bg-[#00993F] text-white rounded-lg hover:bg-[#00802F] transition-colors"
            >
              Spróbuj ponownie
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!statistics) return null;

  const latestGrowth = getLatestValue(statistics.growth_rate);
  const latestWage = getLatestValue(statistics.average_wage);
  const latestInflation = getLatestValue(statistics.inflation);
  const latestValorization = getLatestValue(statistics.valorization);
  const avgLifeExpectancyMale = getHistoricalAverage(statistics.life_expectancy.male, 10);
  const avgLifeExpectancyFemale = getHistoricalAverage(statistics.life_expectancy.female, 10);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#00416E] mb-2">
              Dashboard Statystyk Emerytalnych
            </h1>
            <p className="text-lg text-gray-600">
              Kluczowe wskaźniki ekonomiczne i demograficzne dla Polski
            </p>
            {statistics.meta && (
              <div className="mt-4 text-sm text-gray-500">
                {statistics.meta.scenario && <span className="mr-4">Scenariusz: {statistics.meta.scenario}</span>}
                {statistics.meta.prepared_on && <span>Ostatnia aktualizacja: {statistics.meta.prepared_on}</span>}
              </div>
            )}
          </div>
          
          {/* Export Button */}
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-[#00993F] hover:bg-[#00802F] text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generowanie PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Eksportuj do PDF</span>
              </>
            )}
          </Button>
        </div>

        {/* Key Metrics Grid */}
        <div 
          ref={statsCardsRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          style={{ backgroundColor: '#FAFBFC' }}
        >
          {/* Średnie Wynagrodzenie */}
          {latestWage && (
            <StatCard
              icon={<DollarSign className="w-8 h-8 text-[#00993F]" />}
              title="Średnie Wynagrodzenie"
              value={formatCurrency(latestWage.value)}
              subtitle={`Rok ${latestWage.year}`}
              color="green"
            />
          )}

          {/* Wzrost Płac */}
          {latestGrowth && (
            <StatCard
              icon={<TrendingUp className="w-8 h-8 text-[#3F84D2]" />}
              title="Wzrost Płac"
              value={formatPercent(latestGrowth.value)}
              subtitle={`Rok ${latestGrowth.year}`}
              color="blue"
            />
          )}

          {/* Inflacja */}
          {latestInflation && (
            <StatCard
              icon={<LineChart className="w-8 h-8 text-[#FFB34F]" />}
              title="Inflacja"
              value={formatPercent(latestInflation.value)}
              subtitle={`Rok ${latestInflation.year}`}
              color="amber"
            />
          )}

          {/* Waloryzacja */}
          {latestValorization && (
            <StatCard
              icon={<Calendar className="w-8 h-8 text-[#00416E]" />}
              title="Waloryzacja"
              value={formatPercent(latestValorization.value)}
              subtitle={`Rok ${latestValorization.year}`}
              color="navy"
            />
          )}

          {/* Oczekiwana długość życia - Mężczyźni */}
          {avgLifeExpectancyMale && (
            <StatCard
              icon={<Users className="w-8 h-8 text-[#3F84D2]" />}
              title="Długość życia - Mężczyźni"
              value={formatYears(avgLifeExpectancyMale)}
              subtitle="Średnia z ostatnich 10 lat"
              color="blue"
            />
          )}

          {/* Oczekiwana długość życia - Kobiety */}
          {avgLifeExpectancyFemale && (
            <StatCard
              icon={<Users className="w-8 h-8 text-[#F05E5E]" />}
              title="Długość życia - Kobiety"
              value={formatYears(avgLifeExpectancyFemale)}
              subtitle="Średnia z ostatnich 10 lat"
              color="red"
            />
          )}
        </div>

        {/* Detailed Statistics */}
        <div 
          ref={chartsRef} 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          style={{ backgroundColor: '#FAFBFC' }}
        >
          {/* Wzrost płac w czasie */}
          <MiniChart
            title="Wzrost płac (roczny)"
            data={statistics.growth_rate.slice(-15)}
            formatter={formatPercent}
            color="#00993F"
            showYoY={false}
          />

          {/* Średnie wynagrodzenie w czasie */}
          <MiniChart
            title="Średnie wynagrodzenie"
            data={statistics.average_wage.slice(-15)}
            formatter={formatCurrency}
            color="#3F84D2"
            showYoY={false}
          />

          {/* Średnie wynagrodzenie YoY */}
          <MiniChart
            title="Wzrost wynagrodzenia (r/r)"
            data={statistics.average_wage.slice(-15)}
            formatter={formatPercent}
            color="#00993F"
            showYoY={true}
          />

          {/* Inflacja w czasie */}
          <MiniChart
            title="Inflacja (roczna)"
            data={statistics.inflation.slice(-15)}
            formatter={formatPercent}
            color="#FFB34F"
            showYoY={false}
          />

          {/* Waloryzacja w czasie */}
          <MiniChart
            title="Waloryzacja emerytur"
            data={statistics.valorization.slice(-15)}
            formatter={formatPercent}
            color="#00416E"
            showYoY={false}
          />

          {/* Inflacja YoY change */}
          <MiniChart
            title="Zmiana inflacji (r/r)"
            data={statistics.inflation.slice(-15)}
            formatter={formatPercent}
            color="#F05E5E"
            showYoY={true}
          />
        </div>

        {/* Info Section */}
        <Card className="p-6 bg-[#FFFBEB] border-2 border-[#FEF3C7]">
          <h3 className="text-xl font-semibold text-[#00416E] mb-3">
            O statystykach
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Przedstawione statystyki pochodzą z oficjalnych źródeł i prognoz demograficznych. 
            Dane obejmują historyczne wartości oraz prognozy na przyszłe lata. Wskaźniki te są 
            wykorzystywane w kalkulatorze do oszacowania przyszłej emerytury z uwzględnieniem 
            inflacji, wzrostu płac i oczekiwanej długości życia.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

// Komponent StatCard
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: "green" | "blue" | "amber" | "navy" | "red";
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    green: "bg-[#E6F7ED] border-[#00993F]/20",
    blue: "bg-[#EBF3FB] border-[#3F84D2]/20",
    amber: "bg-[#FFFBEB] border-[#FFB34F]/20",
    navy: "bg-[#EBF1F5] border-[#00416E]/20",
    red: "bg-[#FEF0F0] border-[#F05E5E]/20",
  };

  return (
    <Card className={`p-6 ${colorClasses[color]} border-2`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-[#00416E] mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </Card>
  );
}

// Komponent MiniChart
interface MiniChartProps {
  title: string;
  data: Array<{ year: number; value: number }>;
  formatter: (value: number) => string;
  color: string;
  showYoY?: boolean;
}

function MiniChart({ title, data, formatter, color, showYoY = false }: MiniChartProps) {
  if (!data || data.length === 0) return null;

  // Oblicz dane YoY jeśli potrzebne
  const chartData = showYoY ? calculateYoY(data) : data;
  
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value), 0); // Zawsze uwzględnij 0
  const range = maxValue - minValue;

  // Oblicz 5 równo rozłożonych wartości dla osi Y
  const yAxisValues = Array.from({ length: 5 }, (_, i) => {
    return minValue + (range * i / 4);
  }).reverse();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#00416E]">{title}</h3>
        {showYoY && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Zmiana r/r
          </span>
        )}
      </div>
      
      {/* Chart with Y-axis */}
      <div className="relative h-48 mb-4 flex gap-3">
        {/* Y-axis */}
        <div className="flex flex-col justify-between text-xs text-gray-500 pr-2 border-r border-gray-200 min-w-[60px]">
          {yAxisValues.map((value, index) => (
            <div key={index} className="text-right">
              {showYoY ? `${(value * 100).toFixed(1)}%` : formatter(value).replace('PLN', '').replace('zł', '').trim()}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative">
          {/* Horizontal gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yAxisValues.map((_, index) => (
              <div key={index} className="border-t border-gray-100" />
            ))}
          </div>

          {/* Zero line (if applicable) */}
          {minValue < 0 && maxValue > 0 && (
            <div 
              className="absolute left-0 right-0 border-t-2 border-gray-400 pointer-events-none"
              style={{ bottom: `${(0 - minValue) / range * 100}%` }}
            />
          )}

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between gap-1">
            {chartData.map((item, index) => {
              const isNegative = item.value < 0;
              const absHeight = range > 0 ? (Math.abs(item.value - (isNegative ? 0 : minValue)) / range) * 100 : 0;
              const zeroPoint = range > 0 ? ((0 - minValue) / range) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center relative h-full">
                  <div 
                    className="absolute w-full rounded-md transition-all hover:opacity-80 cursor-pointer group"
                    style={{
                      height: `${Math.max(absHeight, 2)}%`,
                      backgroundColor: isNegative ? '#F05E5E' : color,
                      bottom: isNegative ? `${zeroPoint - absHeight}%` : `${zeroPoint}%`,
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {item.year}: {showYoY ? `${(item.value * 100).toFixed(2)}%` : formatter(item.value)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex items-center justify-between text-xs text-gray-500 ml-[72px]">
        <span>{chartData[0]?.year}</span>
        <span>{chartData[Math.floor(chartData.length / 2)]?.year}</span>
        <span>{chartData[chartData.length - 1]?.year}</span>
      </div>

      {/* Latest value */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {showYoY ? 'Ostatnia zmiana r/r:' : 'Ostatnia wartość:'}
          </span>
          <span className="text-lg font-semibold text-[#00416E]">
            {showYoY 
              ? `${(chartData[chartData.length - 1].value * 100).toFixed(2)}%`
              : formatter(chartData[chartData.length - 1].value)
            }
          </span>
        </div>
      </div>
    </Card>
  );
}

// Helper function to calculate year-over-year changes
function calculateYoY(data: Array<{ year: number; value: number }>): Array<{ year: number; value: number }> {
  if (data.length < 2) return data;
  
  return data.slice(1).map((item, index) => {
    const prevValue = data[index].value;
    const yoyChange = prevValue !== 0 ? (item.value - prevValue) / prevValue : 0;
    return {
      year: item.year,
      value: yoyChange
    };
  });
}

