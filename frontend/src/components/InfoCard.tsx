import Image from "next/image";

interface InfoCardProps {
  className?: string;
}

export function InfoCard({ className }: InfoCardProps) {
  return (
    <div
      className={`relative flex w-[350px] h-[149px] items-center overflow-hidden rounded-[24px] border-2 border-[#FEF3C7] bg-[#FFFBEB] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] ${className}`}
    >
      <div className="flex items-start gap-4">
        <Image
          src="/assets/Bulb_image.png"
          alt="Wskazówka"
          width={48}
          height={48}
          className="flex-shrink-0"
        />
        <div className="space-y-1">
          <p className="text-lg font-bold text-[#00416e]">
            Czy wiesz, że...
          </p>
          <p className="text-[15px] leading-snug text-[#00416e]/90">
            Każdy dodatkowy rok pracy po 60. roku życia może podnieść Twoją
            emeryturę o 250-400 PLN miesięcznie.
          </p>
        </div>
      </div>
    </div>
  );
}
