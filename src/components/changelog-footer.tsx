import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

interface ChangelogFooterProps {
  version: string;
  date?: string;
}

/**
 * Reusable footer component for changelog detail pages
 */
export function ChangelogFooter({ version, date }: ChangelogFooterProps) {
  const upperVersion = version.toUpperCase();
  return (
    <footer className="mt-8">
      <div className="bg-gradient-to-br from-fd-muted to-fd-accent border border-fd-border rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <p className="text-base text-fd-foreground mb-1">
              Release{" "}
              <span className="font-bold text-fd-foreground">{version}</span>
            </p>
            {date && (
              <p className="text-sm text-fd-muted-foreground">
                Released on{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/changelog"
              className="px-5 py-2.5 bg-fd-card text-fd-foreground font-semibold border border-fd-border rounded-xl hover:bg-fd-accent hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm text-sm text-center"
            >
              All Releases
            </Link>
            <a
              href={`https://github.com/Robert-Stackflow/Formulaic/releases/tag/${upperVersion}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-fd-primary text-fd-primary-foreground font-semibold rounded-xl hover:brightness-90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg text-sm"
            >
              <span>View on GitHub</span>
              <ExternalLinkIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
