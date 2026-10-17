import type { ExperienceItem } from "@/lib/content";

import styles from "./Work.module.css";

interface ExperienceProps {
  experience: ExperienceItem[];
}

export function Experience({ experience }: ExperienceProps) {
  return (
    <ol className={styles.jobs}>
      {experience.map((job) => (
        <li className={styles.job} key={job.id}>
          <span className={styles.jobDate}>
            {job.start} — {job.end}
          </span>
          <div>
            <h3 className={styles.jobCompany}>{job.company}</h3>
            <p className={styles.jobRole}>{job.role}</p>
            <p className={styles.jobDesc}>{job.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
