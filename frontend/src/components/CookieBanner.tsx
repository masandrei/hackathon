"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CookieBannerProps {
  className?: string;
  onAccept?: () => void;
  onManage?: () => void;
  onPolicy?: () => void;
}

const CONSENT_KEY = "zus-cookie-consent";

export function CookieBanner({ className, onAccept, onManage, onPolicy }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(CONSENT_KEY) : null;
    if (!stored) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
    }
    setIsVisible(false);
    onAccept?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-[#002911] text-white",
        className,
      )}
    >
      <div className="mx-auto flex h-[82px] w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-8 text-sm sm:text-base">
        <p className="flex-1 min-w-0 text-balance font-medium leading-tight text-white/90">
          Ta strona używa plików cookies, by symulator działał sprawnie i byśmy mogli go ulepszać. Kontynuując, zgadzasz się na ich użycie.
        </p>
        <div className="flex flex-shrink-0 items-center gap-3">
          <Button
            className="h-10 rounded-[4px] bg-[#1f3829] px-5 text-sm font-medium text-white hover:bg-[#1f3829]/80 sm:text-base"
            onClick={onManage}
            type="button"
          >
            Ustawienia
          </Button>
          <Button
            className="h-10 rounded-[4px] bg-[#1f3829] px-5 text-sm font-medium text-white hover:bg-[#1f3829]/80 sm:text-base"
            onClick={handleAccept}
            type="button"
          >
            Akceptuję
          </Button>
          <button
            className="text-sm font-medium underline decoration-white/60 underline-offset-4 hover:opacity-80 sm:text-base"
            onClick={onPolicy}
            type="button"
          >
            Polityka cookies
          </button>
        </div>
      </div>
    </div>
  );
}
