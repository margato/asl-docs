import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import Mermaid from '@theme-original/Mermaid';
import type MermaidType from '@theme/Mermaid';
import type {WrapperProps} from '@docusaurus/types';
import {LuMaximize2, LuMinimize2} from 'react-icons/lu';
import styles from './styles.module.css';

type Props = WrapperProps<typeof MermaidType>;

// Wraps every Mermaid diagram with a fullscreen toggle. Uses the Fullscreen API
// and falls back to a fixed overlay where it is not available (e.g. iOS Safari).
export default function MermaidWrapper(props: Props): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const [native, setNative] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const active = native || overlay;

  const label = active
    ? translate({id: 'asl.mermaid.exitFullscreen', message: 'Exit fullscreen'})
    : translate({id: 'asl.mermaid.fullscreen', message: 'Fullscreen'});

  const toggle = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (overlay) {
      setOverlay(false);
      return;
    }
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        return;
      } catch {
        /* fall through to the overlay */
      }
    }
    setOverlay(true);
  }, [overlay]);

  useEffect(() => {
    const onChange = () => setNative(document.fullscreenElement === ref.current);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverlay(false);
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={ref} className={clsx(styles.wrap, active && styles.full, overlay && styles.overlay)}>
      <button type="button" className={styles.button} onClick={toggle} aria-label={label} title={label}>
        {active ? <LuMinimize2 aria-hidden /> : <LuMaximize2 aria-hidden />}
        <span>{label}</span>
      </button>
      <Mermaid {...props} />
    </div>
  );
}
