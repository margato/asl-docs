import {useEffect, useState, type ReactNode} from 'react';
import Editor from 'react-simple-code-editor';
import {Prism} from 'prism-react-renderer';
import {LuCheck, LuRotateCcw} from 'react-icons/lu';
import {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type {Diagnostic} from '../../lib/asl';
import styles from './styles.module.css';

const SAMPLE = `apiVersion: asl/v1
kind: Database
metadata:
  name: orders-db
spec: {}
`;

// The compiler is WebAssembly and needs the browser, so it loads on the client only.
type Asl = typeof import('../../lib/asl');

export default function Playground(): ReactNode {
  const wasmUrl = useBaseUrl('/asl/asl.wasm.gz');
  const [asl, setAsl] = useState<Asl | null>(null);
  const [source, setSource] = useState(SAMPLE);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stale = false;
    import('../../lib/asl')
      .then(async (m) => {
        await m.init(wasmUrl);
        if (!stale) setAsl(m);
      })
      .catch(() => !stale && setFailed(true));
    return () => {
      stale = true;
    };
  }, [wasmUrl]);

  // An older run can finish after a newer one started; the cleanup marks it stale.
  useEffect(() => {
    if (!asl) return;
    let stale = false;
    asl
      .compile(source)
      .then((d) => !stale && setDiagnostics(d))
      .catch(() => !stale && setFailed(true));
    return () => {
      stale = true;
    };
  }, [asl, source]);

  const lines = source.split('\n').length;
  const errors = diagnostics?.filter((d) => d.severity === 'error').length ?? 0;
  const warnings = (diagnostics?.length ?? 0) - errors;

  return (
    <div className={styles.window}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.file}>orders-db.asl.yaml</span>
        <Status diagnostics={diagnostics} errors={errors} warnings={warnings} />
        <button
          type="button"
          className={styles.reset}
          onClick={() => setSource(SAMPLE)}
          disabled={source === SAMPLE}>
          <LuRotateCcw aria-hidden />
          {translate({id: 'asl.playground.reset', message: 'Reset'})}
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.editorPane}>
          <div className={styles.gutter} aria-hidden>
            {Array.from({length: lines}, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <div className={styles.editor}>
            <Editor
              value={source}
              onValueChange={setSource}
              highlight={(code) => Prism.highlight(code, Prism.languages.yaml, 'yaml')}
              padding={16}
              tabSize={2}
              textareaId="asl-playground-source"
              textareaClassName={styles.textarea}
              aria-label={translate({id: 'asl.playground.manifest', message: 'ASL manifest'})}
              style={{
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: 14,
                lineHeight: '24px',
                whiteSpace: 'pre',
                wordBreak: 'normal',
                minWidth: 'max-content',
              }}
            />
          </div>
        </div>
        <div className={styles.output} aria-live="polite">
          <Output diagnostics={diagnostics} failed={failed} />
        </div>
      </div>
    </div>
  );
}

function Status({
  diagnostics,
  errors,
  warnings,
}: {
  diagnostics: Diagnostic[] | null;
  errors: number;
  warnings: number;
}): ReactNode {
  if (diagnostics === null) return <span className={styles.spacer} />;
  const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
  let label: string;
  let tone = styles.statusOk;
  if (errors > 0) {
    tone = styles.statusBad;
    label = `${errors} ${plural(
      errors,
      translate({id: 'asl.playground.error', message: 'error'}),
      translate({id: 'asl.playground.errors', message: 'errors'}),
    )}`;
  } else if (warnings > 0) {
    tone = styles.statusWarn;
    label = `${warnings} ${plural(
      warnings,
      translate({id: 'asl.playground.warning', message: 'warning'}),
      translate({id: 'asl.playground.warnings', message: 'warnings'}),
    )}`;
  } else {
    label = translate({id: 'asl.playground.valid', message: 'Valid'});
  }
  return (
    <span className={`${styles.status} ${tone}`}>
      <i aria-hidden />
      {label}
    </span>
  );
}

function Output({diagnostics, failed}: {diagnostics: Diagnostic[] | null; failed: boolean}): ReactNode {
  if (failed) {
    return (
      <p className={styles.error}>
        {translate({
          id: 'asl.playground.failed',
          message: 'The compiler failed to load. Reload the page.',
        })}
      </p>
    );
  }
  if (diagnostics === null) {
    return (
      <p className={styles.muted}>
        {translate({id: 'asl.playground.loading', message: 'Loading compiler…'})}
      </p>
    );
  }
  if (diagnostics.length === 0) {
    return (
      <div className={styles.ok}>
        <LuCheck aria-hidden />
        <span>OK</span>
      </div>
    );
  }
  return (
    <>
      {diagnostics.map((d, i) => (
        <div key={i} className={`${styles.diag} ${d.severity === 'error' ? styles.diagError : styles.diagWarning}`}>
          <div className={styles.diagHead}>
            <span className={styles.badge}>{d.severity}</span>
            {d.line > 0 && (
              <span className={styles.line}>
                {translate({id: 'asl.playground.line', message: 'line'})} {d.line}
              </span>
            )}
          </div>
          <p className={styles.message}>{d.message}</p>
          <code className={styles.policy}>{d.policy}</code>
        </div>
      ))}
    </>
  );
}
