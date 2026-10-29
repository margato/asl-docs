import React, {useEffect, useState} from 'react';
import type {ComponentProps} from 'react';
import styles from './styles.module.css';

export default function ZoomImage(props: ComponentProps<'img'>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <img
        {...props}
        className={styles.thumb}
        loading="lazy"
        onClick={() => setOpen(true)}
      />
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <img src={props.src} alt={props.alt} className={styles.full} />
        </div>
      )}
    </>
  );
}
