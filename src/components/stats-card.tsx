import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}

export function StatsCard({ icon, value, label, className = "" }: StatsCardProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-fd-accent text-fd-primary rounded-xl sm:rounded-2xl mb-2 sm:mb-3 backdrop-blur-sm">
        {icon}
      </div>
      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-fd-foreground mb-1">{value}</div>
      <div className="text-xs sm:text-sm text-fd-muted-foreground font-medium">{label}</div>
    </div>
  );
}
