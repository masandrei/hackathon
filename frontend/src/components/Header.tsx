"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo ZUS */}
          <Link href="/" className="flex items-center gap-4">
            <img src="/assets/ZUS_logo.png" alt="ZUS Logo" className="h-12 w-auto" />
            <svg width="2" height="48" viewBox="0 0 2 48" className="mx-2">
              <path d="M1 0V48" stroke="#d8d8d8" strokeWidth="1" />
            </svg>
            <span className="text-lg font-medium uppercase tracking-[0.3em] text-[--ink] sm:text-xl" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              #RAND0M6
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            <Link
              href="/"
              className="text-sm font-medium text-[#006e2d] hover:opacity-80 transition-opacity lg:text-base"
            >
              Start
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[#006e2d] hover:opacity-80 transition-opacity lg:text-base"
            >
              Dashboard
            </Link>
            <Link
              href="/dane-metody"
              className="text-sm font-medium text-[#006e2d] hover:opacity-80 transition-opacity lg:text-base"
            >
              Dane & Metody
            </Link>
            <Link
              href="/pomoc"
              className="text-sm font-medium text-[#006e2d] hover:opacity-80 transition-opacity lg:text-base"
            >
              Pomoc / FAQ
            </Link>
            <Link
              href="/trivia"
              className="text-sm font-medium text-[#006e2d] hover:opacity-80 transition-opacity lg:text-base"
            >
              Ciekawostki
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-[#006e2d] hover:opacity-80 transition-opacity lg:text-base"
            >
              Admin
            </Link>
          </nav>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="h-10 rounded-[4px] border border-[#00416e] bg-transparent px-5 text-sm font-medium text-[#00416e] hover:bg-[#00416e]/5"
          >
            Zarejestruj w PUE/eZUS
          </Button>
          <div className="h-6 w-px rounded-full bg-[#d8d8d8]" />
          <Button
            className="h-10 rounded-[4px] border border-[#00416e] bg-[#ffb34f] px-5 text-sm font-semibold text-[#00416e] hover:bg-[#ffb34f]/90"
          >
            Zaloguj do PUE/eZUS
          </Button>
        </div>
      </div>
    </header>
  );
}

