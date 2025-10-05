interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  links?: FooterLink[];
  version?: string;
  className?: string;
}

const DEFAULT_LINKS: FooterLink[] = [
  { label: "Polityka cookies", href: "/polityka-cookies" },
  { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
  { label: "Regulamin", href: "/regulamin" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Footer({
  links = DEFAULT_LINKS,
  version = "Wersja danych: 2025-01-15 | Model v1.0",
  className,
}: FooterProps) {
  return (
    <footer className={`bg-[#00993F] py-12 text-white ${className ?? ""}`}>
      <div className="container mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/15 px-4 text-sm sm:px-6 sm:text-base lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="font-medium text-white/90">
          © 2025 ZUS Symulator Emerytalny. Narzędzie edukacyjne.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-semibold text-white">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="transition-opacity hover:opacity-80">
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70 sm:text-sm">
          {version}
        </p>
      </div>
    </footer>
  );
}
