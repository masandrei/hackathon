import type { Metadata } from "next";
import "./globals.css";

// Avenir is a commercial font not available for web use
// Using system font stack that closely matches Avenir aesthetics

export const metadata: Metadata = {
  title: "Kalkulator Emerytur ZUS | Sprawdź swoją przyszłą emeryturę",
  description: "Symulacja przyszłej emerytury w oparciu o Twoje dane. Sprawdź, ile będziesz otrzymywać po przejściu na emeryturę.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
