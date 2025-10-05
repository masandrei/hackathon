"use client";

export function ChartPlaceholder() {
  const bars = [
    { id: "2005", year: "2005", value: 32, label: "200%", gradient: ["#0B2F56", "#123E72"] },
    { id: "2020", year: "2020", value: 44, label: "200%", gradient: ["#123E72", "#1F4E8C"] },
    { id: "2024", year: "2024", value: 56, label: "202%", gradient: ["#1E58A4", "#2E70C9"] },
    { id: "2025-a", year: "2025", value: 74, label: "300%", gradient: ["#3479D3", "#4B92F0"] },
    { id: "2025-b", year: "2025", value: 86, label: "300%", gradient: ["#009068", "#00B27B"] },
    { id: "2045", year: "2045", value: 100, label: "200%", gradient: ["#00A05F", "#19C67B"] },
  ];

  const axisLabels = ["1200%", "200%", "35%", "40%", "35%", "20%", "10%", "0%"];
  const maxValue = Math.max(...bars.map((bar) => bar.value));
  const chartWidth = 520;
  const chartHeight = 260;

  const points = bars.map((bar, index) => ({
    x: (index / (bars.length - 1)) * chartWidth,
    y: chartHeight - (bar.value / maxValue) * chartHeight,
  }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-[36px] bg-white px-10 pb-16 pt-14 shadow-[0_45px_90px_-40px_rgba(9,31,56,0.4)]">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f4f7fb_70%,_#eaf0f6_100%)]"
          aria-hidden="true"
        />
        <div className="relative h-[360px] w-full">
          <div className="pointer-events-none absolute inset-x-10 bottom-16 top-2 flex flex-col justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9fafc4]">
            {axisLabels.map((label, index) => (
              <span key={`axis-${index}`} className="text-right pr-4">
                {label}
              </span>
            ))}
          </div>

          <div className="absolute inset-x-28 bottom-0 top-0 flex items-end justify-between gap-10">
            {bars.map((bar, index) => {
              const barHeight = (bar.value / maxValue) * 100;
              const showBadge = index >= 3;

              return (
                <div key={bar.id} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-9 items-center justify-center">
                    {showBadge && (
                      <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-[#0b2f56] shadow-[0_12px_25px_-15px_rgba(0,0,0,0.45)]">
                        {bar.label}
                      </span>
                    )}
                  </div>
                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      className="w-full max-w-[78px] rounded-t-[24px] shadow-[inset_0_-18px_26px_rgba(0,0,0,0.12)]"
                      style={{
                        height: `${barHeight}%`,
                        backgroundImage: `linear-gradient(180deg, ${bar.gradient[0]} 0%, ${bar.gradient[1]} 100%)`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f6f85]">
                    {bar.year}
                  </span>
                </div>
              );
            })}
          </div>

          <svg
            className="pointer-events-none absolute inset-x-28 bottom-20 top-10"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <path d={linePath} fill="none" stroke="#00A364" strokeWidth={3} strokeLinecap="round" />
            {points.map((point, index) => (
              <circle
                key={bars[index].id}
                cx={point.x}
                cy={point.y}
                r={7}
                fill="#00A364"
                stroke="#ffffff"
                strokeWidth={3}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

