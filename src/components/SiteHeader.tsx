import { ThemeToggle } from "@/components/ThemeToggle";
import type { Brand } from "@/lib/content";

interface SiteHeaderProps {
  brand: Brand;
}

export function SiteHeader({ brand }: SiteHeaderProps) {
  return (
    <header className="siteHead">
      <div className="container siteHeadInner">
        <a className="brand" href="#main" aria-label={brand.ariaLabel}>
          {brand.initials}
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
