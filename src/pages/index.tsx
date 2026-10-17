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
  return (
    <>
      <Head>
        <title>{content.meta.title}</title>
        <meta name="description" content={content.meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <SkipLink />
      <SiteHeader brand={content.brand} />

      <main id="main" tabIndex={-1}>
        <Hero hero={content.hero} />

        <Section id="profile" number={1} title={content.labels.profile}>
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
