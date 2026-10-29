import type {ReactNode} from 'react';
import clsx from 'clsx';
import {FaGithub} from 'react-icons/fa6';
import styles from './styles.module.css';

const REPO = 'https://github.com/margato/asl';

// `mobile` is set by the navbar when it renders inside the side menu.
export default function GithubLink({mobile}: {mobile?: boolean}): ReactNode {
  const link = (
    <a
      href={REPO}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(styles.link, mobile && styles.mobile)}
      aria-label="ASL on GitHub">
      <FaGithub className={styles.icon} aria-hidden />
      <span>GitHub</span>
    </a>
  );
  return mobile ? <li className="menu__list-item">{link}</li> : link;
}
