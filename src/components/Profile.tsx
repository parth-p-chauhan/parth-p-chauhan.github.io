import type { Profile as ProfileContent } from "@/lib/content";

import styles from "./About.module.css";

interface ProfileProps {
  profile: ProfileContent;
  profileHtml: string;
}

export function Profile({ profile, profileHtml }: ProfileProps) {
  return (
    <>
      <div
        className={styles.bio}
        dangerouslySetInnerHTML={{ __html: profileHtml }}
      />
      <dl className={styles.facts}>
        {profile.facts.map((fact) => (
          <div className={styles.fact} key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>
              {"value" in fact ? (
                <>
                  {fact.highlight ? (
                    <span className={styles.dot} aria-hidden="true" />
                  ) : null}
                  {fact.value}
                </>
              ) : (
                <a
                  className={styles.textLink}
                  href={fact.link.href}
                  download={fact.link.download || undefined}
                >
                  {fact.link.label}{" "}
                  <span className={styles.arrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
