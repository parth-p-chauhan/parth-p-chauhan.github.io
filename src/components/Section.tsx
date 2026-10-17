import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
}

export function Section({ id, number, title, children }: SectionProps) {
  const titleId = `${id}-title`;

  return (
    <section className="section" aria-labelledby={titleId}>
      <div className="container">
        <div className="sectionHead">
          <span className="sectionNum" aria-hidden="true">
            {String(number).padStart(2, "0")}
          </span>
          <h2 className="sectionTitle" id={titleId}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
