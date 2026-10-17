import type { Hero as HeroContent } from "@/lib/content";

interface HeroProps {
  hero: HeroContent;
}

export function Hero({ hero }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <p className="kicker">{hero.kicker}</p>
        <h1 id="hero-title">{hero.name}</h1>
        <p className="intro">{hero.intro}</p>
      </div>
    </section>
  );
}
