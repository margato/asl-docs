import { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { FaGithub, FaRegStar } from 'react-icons/fa6';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

const REPO = 'https://github.com/margato/asl';
const API = 'https://api.github.com/repos/margato/asl';
const CACHE_KEY = 'asl.stars';
const CACHE_MS = 10 * 60 * 1000;

function formatStars(n: number): string {
  return n >= 1000
    ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
    : String(n);
}

function readCache(): number | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { count, at } = JSON.parse(raw);
    return Date.now() - at < CACHE_MS ? count : null;
  } catch {
    return null;
  }
}

// Fails silently (rate limit, offline): the link just shows without a count.
function useStars(): number | null {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    const cached = readCache();
    if (cached !== null) {
      setStars(cached);
      return;
    }
    const ctrl = new AbortController();
    fetch(API, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (typeof d.stargazers_count !== 'number') return;
        setStars(d.stargazers_count);
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ count: d.stargazers_count, at: Date.now() }),
          );
        } catch {}
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  return stars;
}

// `mobile` is set by the navbar when it renders inside the side menu.
export default function GithubLink({
  mobile,
}: {
  mobile?: boolean;
}): ReactNode {
  const stars = useStars();
  const label = translate({ id: 'asl.github.star', message: 'Star on GitHub' });
  const link = (
    <a
      href={REPO}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(styles.link, mobile && styles.mobile)}
      aria-label={stars === null ? label : `${label} (${stars})`}
    >
      <FaGithub className={styles.icon} aria-hidden />
      <span className={styles.label}>{label}</span>
      {stars !== null && (
        <span className={styles.count}>
          <FaRegStar aria-hidden />
          {formatStars(stars)}
        </span>
      )}
    </a>
  );
  return mobile ? <li className="menu__list-item">{link}</li> : link;
}
