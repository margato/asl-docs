import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { LuPlay } from 'react-icons/lu';
import styles from './styles.module.css';

// `mobile` is set by the navbar when it renders inside the side menu.
export default function PlaygroundLink({
  mobile,
}: {
  mobile?: boolean;
}): ReactNode {
  const label = translate({
    id: 'asl.navbar.playground',
    message: 'Playground',
  });
  const link = (
    <Link
      to="/playground"
      className={clsx(styles.link, mobile && styles.mobile)}
      aria-label={label}
    >
      <LuPlay className={styles.icon} aria-hidden />
      <span className={styles.label}>{label}</span>
    </Link>
  );
  return mobile ? (
    <li className="menu__list-item">{link}</li>
  ) : (
    <span className={styles.sep}>{link}</span>
  );
}
