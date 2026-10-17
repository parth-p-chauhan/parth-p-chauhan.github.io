import type { GetStaticProps } from "next";
import Head from "next/head";

import { Hero } from "@/components/Hero";
import { Networking } from "@/components/Networking";
import { Profile } from "@/components/Profile";
import { Section } from "@/components/Section";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
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
          <ol className="jobs">
            {content.experience.map((job) => (
              <li className="job" key={job.id}>
                <span className="jobDate">
                  {job.start} — {job.end}
                </span>
                <div>
                  <h3 className="jobCompany">{job.company}</h3>
                  <p className="jobRole">{job.role}</p>
                  <p className="jobDesc">{job.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="stack" number={4} title={content.labels.stack}>
          <dl className="stackList">
            {content.stack.map((group) => (
              <div className="stackRow" key={group.id}>
                <dt>{group.label}</dt>
                <dd>{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </main>

      <SiteFooter footer={content.footer} year={year} />
    </>
  );
}
