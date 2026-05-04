import { CalendarIcon, TagIcon } from "lucide-react";

interface ChangelogHeaderProps {
  version: string;
  date?: string;
  isLatest?: boolean;
  breaking?: boolean;
}

/**
 * Reusable header component for changelog detail pages
 */
export function ChangelogHeader({ version, date, isLatest = false, breaking = false }: ChangelogHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-fd-accent text-fd-primary rounded-lg">
          <TagIcon className="w-5 h-5" />
        </div>
        {isLatest && (
          <span className="px-3 py-1.5 bg-fd-primary text-fd-primary-foreground text-xs font-semibold rounded-full">Latest Release</span>
        )}
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-5xl mb-4 leading-tight">
        {version}
      </h1>

      {date && (
        <div className="flex flex-wrap items-center gap-4 text-fd-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-fd-muted rounded-full">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      )}

      {/* Breaking Changes Warning */}
      {breaking && (
        <div className="bg-fd-destructive/10 border border-fd-destructive/20 rounded-xl p-5 shadow-lg mb-6">
          <div className="flex items-center gap-3 text-fd-destructive mb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-fd-destructive/20 text-fd-destructive rounded-lg">
              <span className="text-lg">⚠️</span>
            </div>
            <span className="font-bold text-lg">Breaking Changes</span>
          </div>
          <p className="text-sm text-fd-destructive leading-relaxed">
            This release includes breaking changes. Please review the changelog carefully before updating.
          </p>
        </div>
      )}
    </header>
  );
}
