import type { NetworkingLink } from "@/lib/content";

import styles from "./About.module.css";

interface NetworkingProps {
  links: NetworkingLink[];
}

export function Networking({ links }: NetworkingProps) {
  return (
    <ul className={styles.links}>
      {links.map((link) => (
        <li key={link.id}>
          <a href={link.href}>
            {link.label}{" "}
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
