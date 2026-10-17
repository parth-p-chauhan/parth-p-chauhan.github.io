import type { GetStaticProps } from "next";
import Head from "next/head";

import { Section } from "@/components/Section";
import { SiteFooter } from "@/components/SiteFooter";
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

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <p className="kicker">{content.hero.kicker}</p>
            <h1 id="hero-title">{content.hero.name}</h1>
            <p className="intro">{content.hero.intro}</p>
          </div>
        </section>

        <Section id="profile" number={1} title={content.labels.profile}>
          <div
            className="bio"
            dangerouslySetInnerHTML={{ __html: profileHtml }}
          />
          <dl className="facts">
            {content.profile.facts.map((fact) => (
              <div className="fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  {"value" in fact ? (
                    <>
                      {fact.highlight ? (
                        <span className="dot" aria-hidden="true" />
                      ) : null}
                      {fact.value}
                    </>
                  ) : (
                    <a
                      className="textLink"
                      href={fact.link.href}
                      download={fact.link.download || undefined}
                    >
                      {fact.link.label}
                    </a>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="networking" number={2} title={content.labels.networking}>
          <ul className="links">
            {content.networking.map((link) => (
              <li key={link.id}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
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
