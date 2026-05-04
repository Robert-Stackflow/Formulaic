import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
};

export function PageLayout({
  children,
  title,
  description,
  maxWidth = "2xl",
}: PageLayoutProps) {
  return (
    <div
      className={`container mx-auto p-4 lg:p-8 ${maxWidthClasses[maxWidth]}`}
    >
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-fd-foreground mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-fd-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: ReactNode;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-fd-foreground mb-2">{title}</h1>
        {description && (
          <p className="text-fd-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
