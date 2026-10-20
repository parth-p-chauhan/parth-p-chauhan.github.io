import type { SiteFooter as SiteFooterContent } from "@/lib/content";

interface SiteFooterProps {
  footer: SiteFooterContent;
  year: number;
}

export function SiteFooter({ footer, year }: SiteFooterProps) {
  return (
    <footer className="pagefoot">
      <div className="container footInner">
        <span>
          ©{" "}
          <span data-year suppressHydrationWarning>
            {year}
          </span>{" "}
          {footer.copyrightHolder}
        </span>
        <span>{footer.note}</span>
      </div>
    </footer>
  );
}
