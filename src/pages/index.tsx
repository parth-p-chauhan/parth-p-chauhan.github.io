import type { GetStaticProps } from "next";
import Head from "next/head";

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
        <section aria-labelledby="hero-title">
          <p>{content.hero.kicker}</p>
          <h1 id="hero-title">{content.hero.name}</h1>
          <p>{content.hero.intro}</p>
        </section>

        <section aria-labelledby="profile-title">
          <h2 id="profile-title">{content.labels.profile}</h2>
          <div dangerouslySetInnerHTML={{ __html: profileHtml }} />
          <dl>
            {content.profile.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  {"value" in fact ? (
                    fact.value
                  ) : (
                    <a
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
        </section>

        <section aria-labelledby="networking-title">
          <h2 id="networking-title">{content.labels.networking}</h2>
          <ul>
            {content.networking.map((link) => (
              <li key={link.id}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="experience-title">
          <h2 id="experience-title">{content.labels.experience}</h2>
          <ol>
            {content.experience.map((job) => (
              <li key={job.id}>
                <span>
                  {job.start} — {job.end}
                </span>
                <h3>{job.company}</h3>
                <p>{job.role}</p>
                <p>{job.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="stack-title">
          <h2 id="stack-title">{content.labels.stack}</h2>
          <dl>
            {content.stack.map((group) => (
              <div key={group.id}>
                <dt>{group.label}</dt>
                <dd>{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <footer>
        <span>
          © {year} {content.footer.copyrightHolder}
        </span>
        <span>{content.footer.note}</span>
      </footer>
    </>
  );
}
