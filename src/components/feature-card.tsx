import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <div className={`group ${className}`}>
      <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8 bg-fd-card rounded-xl sm:rounded-2xl border border-fd-border hover:border-fd-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-fd-accent text-fd-primary rounded-lg sm:rounded-xl mb-3 sm:mb-4">
            {icon}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-fd-foreground mb-2 sm:mb-3 tracking-tight">{title}</h3>
          <p className="text-sm sm:text-base text-fd-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
