import type { StackGroup } from "@/lib/content";

import styles from "./Work.module.css";

interface TechStackProps {
  stack: StackGroup[];
}

export function TechStack({ stack }: TechStackProps) {
  return (
    <dl className={styles.stackList}>
      {stack.map((group) => (
        <div className={styles.stackRow} key={group.id}>
          <dt>{group.label}</dt>
          <dd>{group.items.join(", ")}</dd>
        </div>
      ))}
    </dl>
  );
}
