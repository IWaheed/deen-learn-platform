import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: string; params?: Record<string, string> };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav
      className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4"
      aria-label="Breadcrumb"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {isLast || !crumb.to ? (
              <span className={isLast ? "text-foreground font-medium" : ""}>{crumb.label}</span>
            ) : (
              <Link
                to={crumb.to}
                params={crumb.params}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
