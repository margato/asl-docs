import {useEffect, useState, type ReactNode} from 'react';
import styles from './styles.module.css';

type Line = {
  text: string;
  kind: 'cmd' | 'error' | 'ptr' | 'ctx' | 'ok' | 'blank' | 'comment';
};

const SCRIPT: Line[] = [
  {kind: 'comment', text: '# agent proposes: billing-service writes to credit-db'},
  {kind: 'cmd', text: 'asl ./architecture --policies-bundle-path ./policies'},
  {kind: 'error', text: 'error: Only one application may write to database'},
  {kind: 'ptr', text: '  --> architecture/credit.asl.yaml:18'},
  {kind: 'ctx', text: '  policy: acme.single-writer'},
  {kind: 'blank', text: ''},
  {kind: 'error', text: 'error: could not compile due to 1 previous error (6.6ms)'},
  {kind: 'blank', text: ''},
  {kind: 'comment', text: '# agent fixes: billing-service gets its own database'},
  {kind: 'cmd', text: 'asl ./architecture --policies-bundle-path ./policies'},
  {kind: 'ok', text: 'ok 12ms'},
];

const TYPE_MS = 65;
const LINE_MS = 700;
const RESTART_MS = 9000;

function renderLine(line: Line, partial?: string): ReactNode {
  const text = partial ?? line.text;
  switch (line.kind) {
    case 'cmd':
      return (
        <>
          <span className={styles.prompt}>$ </span>
          <span className={styles.cmd}>{text}</span>
        </>
      );
    case 'error':
      return <span className={styles.error}>{text}</span>;
    case 'ptr':
      return <span className={styles.ptr}>{text}</span>;
    case 'ctx':
      return <span className={styles.ctx}>{text}</span>;
    case 'ok':
      return <span className={styles.ok}>{text}</span>;
    case 'comment':
      return <span className={styles.comment}>{text}</span>;
    default:
      return <>&nbsp;</>;
  }
}

export default function Terminal(): ReactNode {
  const [shown, setShown] = useState(0); // fully printed lines
  const [typed, setTyped] = useState(0); // chars typed on the current cmd line
  const [static_, setStatic] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStatic(true);
    }
  }, []);

  useEffect(() => {
    if (static_) return;
    let timer: ReturnType<typeof setTimeout>;
    if (shown >= SCRIPT.length) {
      timer = setTimeout(() => {
        setShown(0);
        setTyped(0);
      }, RESTART_MS);
      return () => clearTimeout(timer);
    }
    const line = SCRIPT[shown];
    if (line.kind === 'cmd' && typed < line.text.length) {
      timer = setTimeout(() => setTyped(typed + 1), TYPE_MS);
    } else {
      timer = setTimeout(() => {
        setShown(shown + 1);
        setTyped(0);
      }, line.kind === 'cmd' ? 900 : line.kind === 'comment' ? 1100 : LINE_MS);
    }
    return () => clearTimeout(timer);
  }, [shown, typed, static_]);

  const visible = static_ ? SCRIPT : SCRIPT.slice(0, shown);
  const current = !static_ && shown < SCRIPT.length ? SCRIPT[shown] : null;

  return (
    <div className={styles.window} role="img" aria-label="ASL CLI demo">
      <div className={styles.bar}>
        <span className={styles.dot} style={{background: '#ff5f57'}} />
        <span className={styles.dot} style={{background: '#febc2e'}} />
        <span className={styles.dot} style={{background: '#28c840'}} />
        <span className={styles.title}>asl — zsh</span>
      </div>
      <pre className={styles.body}>
        {visible.map((l, i) => (
          <div key={i}>{renderLine(l)}</div>
        ))}
        {current && current.kind === 'cmd' && (
          <div>
            {renderLine(current, current.text.slice(0, typed))}
            <span className={styles.cursor} />
          </div>
        )}
        {(!current || current.kind !== 'cmd') && (
          <div>
            <span className={styles.prompt}>$ </span>
            <span className={styles.cursor} />
          </div>
        )}
      </pre>
    </div>
  );
}
