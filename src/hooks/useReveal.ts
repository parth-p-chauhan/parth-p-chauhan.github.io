import { useEffect } from "react";

const REVEAL_TIMEOUT = 1800;

export function useReveal() {
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (items.length === 0) return;

    const revealAll = () => {
      items.forEach((item) => item.classList.add("is-in"));
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((item) => observer.observe(item));
    const failsafe = window.setTimeout(revealAll, REVEAL_TIMEOUT);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);
}
