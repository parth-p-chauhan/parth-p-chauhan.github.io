import type { GetStaticProps } from "next";
import Head from "next/head";

import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Networking } from "@/components/Networking";
import { Profile } from "@/components/Profile";
import { Section } from "@/components/Section";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { TechStack } from "@/components/TechStack";
import { useReveal } from "@/hooks/useReveal";
import { loadContent, type LoadedContent } from "@/lib/content";

interface HomeProps extends LoadedContent {
  year: number;
}

export const getStaticProps: GetStaticProps<HomeProps> = () => {
  return {
    props: {
      ...loadContent(),
      year: new Date().getFullYear(),
    },
  };
};

export default function Home({ content, profileHtml, year }: HomeProps) {
  useReveal();

  const ogImage = content.meta.ogImage
    ? new URL(content.meta.ogImage, content.meta.canonicalUrl).toString()
    : undefined;

  return (
    <>
      <Head>
        <title>{content.meta.title}</title>
        <meta name="description" content={content.meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={content.meta.canonicalUrl} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta
          key="theme-color-light"
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#faf9f7"
        />
        <meta
          key="theme-color-dark"
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#1c1b1a"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={content.hero.name} />
        <meta property="og:title" content={content.meta.title} />
        <meta property="og:description" content={content.meta.description} />
        <meta property="og:url" content={content.meta.canonicalUrl} />
        <meta property="og:locale" content={content.meta.locale} />
        {ogImage ? (
          <>
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta
              property="og:image:alt"
              content={`${content.hero.name} — ${content.hero.kicker}`}
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={ogImage} />
            <meta
              name="twitter:image:alt"
              content={`${content.hero.name} — ${content.hero.kicker}`}
            />
          </>
        ) : (
          <meta name="twitter:card" content="summary" />
        )}
        <meta name="twitter:title" content={content.meta.title} />
        <meta name="twitter:description" content={content.meta.description} />
      </Head>

      <SkipLink />
      <SiteHeader brand={content.brand} />

      <main id="main" tabIndex={-1}>
        <Hero hero={content.hero} />

        <Section
          id="profile"
          number={1}
          title={content.labels.profile}
          reveal={false}
        >
          <Profile profile={content.profile} profileHtml={profileHtml} />
        </Section>

        <Section id="networking" number={2} title={content.labels.networking}>
          <Networking links={content.networking} />
        </Section>

        <Section id="experience" number={3} title={content.labels.experience}>
          <Experience experience={content.experience} />
        </Section>

        <Section id="stack" number={4} title={content.labels.stack}>
          <TechStack stack={content.stack} />
        </Section>
      </main>

      <SiteFooter footer={content.footer} year={year} />
    </>
  );
}
