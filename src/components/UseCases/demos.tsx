import type {ReactNode} from 'react';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronRight,
  FiFile,
  FiFolder,
  FiGitCommit,
  FiGitMerge,
  FiGitPullRequest,
  FiMinusCircle,
  FiXCircle,
} from 'react-icons/fi';
import {
  ERR_OWN,
  ERR_SHARED,
  PAYMENTS,
  PCI_ERR,
  PCI_IN,
  PCI_IN_OLD,
  PCI_OK,
  PCI_OUT,
  CANCEL,
  DESIGN,
  DESIGN_AFTER,
  DESIGN_BAD,
  DESIGN_BEFORE,
  DESIGN_CHANGED,
  DESIGN_ERRS,
  CANCEL_AFTER,
  CANCEL_BEFORE,
  CANCEL_CHANGED,
  SHOP,
  XML_EXCERPT,
  YAML_EXCERPT,
  type Copy,
} from './data';
import styles from './styles.module.css';

type Side = 'off' | 'on';
type Props = {side: Side; t: Copy};

function Outcome({good, children}: {good: boolean; children: ReactNode}): ReactNode {
  return (
    <div className={`${styles.outcome} ${good ? styles.outcomeGood : styles.outcomeBad}`}>
      {good ? <FiCheckCircle aria-hidden /> : <FiAlertTriangle aria-hidden />}
      <span>{children}</span>
    </div>
  );
}

function Yaml({line}: {line: string}): ReactNode {
  // keys (`name:`), values, punctuation (`- { } ,`) and trailing comments get their own colors
  const parts = line.split(/(#.*$|[\w./-]+(?=:(?:\s|$))|[{}\[\],:]|-(?=\s)|"[^"]*"|'[^']*')/);
  return (
    <>
      {parts.map((t, i) => {
        if (!t) return null;
        if (t.startsWith('#')) return <span key={i} className={styles.yCmt}>{t}</span>;
        if (i % 2 === 0) return /\S/.test(t) ? <span key={i} className={styles.yVal}>{t}</span> : t;
        if (/^[{}\[\],:-]$/.test(t)) return <span key={i} className={styles.yPunct}>{t}</span>;
        if (/^["']/.test(t)) return <span key={i} className={styles.yStr}>{t}</span>;
        return <span key={i} className={styles.yKey}>{t}</span>;
      })}
    </>
  );
}

/* 1. Interpreting an architecture: an agent session in a terminal. */
export function AgentCli({side, t}: Props): ReactNode {
  const off = side === 'off';
  const c = t.read;
  return (
    <div className={styles.window}>
      <div className={styles.winBar}>
        <span className={styles.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.winTitle}>agent</span>
      </div>
      <div className={`${styles.term} ${styles.mono}`}>
        <div className={styles.tUser}>
          <span className={styles.tPrompt}>&gt;</span> {c.prompt}
        </div>
        <div className={styles.tTool}>
          <span className={styles.tBullet}>●</span> Read(
          {off ? 'architecture-review-q1.drawio' : PAYMENTS})
        </div>
        <div className={styles.tSub}>⎿ {off ? c.offRead : c.onRead}</div>
        <pre className={styles.excerpt}>
          {(off ? XML_EXCERPT : YAML_EXCERPT).map((l, i) => (
            <div key={i} className={styles.excerptLine}>
              {off ? l : <Yaml line={l} />}
            </div>
          ))}
        </pre>
        <div className={styles.tAnswer}>
          <span className={styles.tBullet}>●</span> {off ? c.offAnswer : c.onAnswer}
        </div>
      </div>
      <Outcome good={!off}>{off ? c.offOutcome : c.onOutcome}</Outcome>
    </div>
  );
}

/* the compiler answering in a terminal */
function Term({ok}: {ok: string}): ReactNode {
  return (
    <div className={`${styles.termOk} ${styles.mono}`}>
      <div>
        <span className={styles.tPrompt}>$</span> asl ./architecture --policies-bundle-path ./policies
      </div>
      <div className={styles.termResult}>{ok}</div>
    </div>
  );
}

function Chip({name, tone}: {name: string; tone?: 'new' | 'bad' | 'ok'}): ReactNode {
  return (
    <span className={`${styles.chip} ${tone ? styles[`chip_${tone}`] : ''}`}>{name}</span>
  );
}

/* 2. Controlling PCI scope: one proposed connection that crosses the scope, then the fix. */
function Link({from, verb, to, tone}: {from: string; verb: string; to: string; tone: 'bad' | 'ok'}): ReactNode {
  return (
    <div className={`${styles.link} ${styles[`link_${tone}`]}`}>
      <Chip name={from} tone="new" />
      <span className={styles.edge} aria-hidden>
        <span className={styles.edgeVerb}>{verb}</span>
      </span>
      <Chip name={to} tone={tone} />
      <span className={styles.srOnly}>{`${from} ${verb} ${to}`}</span>
    </div>
  );
}

export function PciScope({side, t}: Props): ReactNode {
  const off = side === 'off';
  const c = t.pci;
  const scopeIn = off ? PCI_IN_OLD : PCI_IN;
  const scopeOut = off ? [...PCI_OUT, ...PCI_IN.filter((n) => !PCI_IN_OLD.includes(n))] : PCI_OUT;

  return (
    <div className={styles.window}>
      <div className={styles.winBar}>
        <span className={styles.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.winTitle}>{off ? c.offSource : c.onSource}</span>
      </div>

      <div className={styles.scope}>
        <div className={`${styles.zone} ${styles.zoneIn}`}>
          <div className={styles.zoneHead}>{c.scopeIn}</div>
          <div className={`${styles.chips} ${styles.mono}`}>
            {scopeIn.map((n) => (
              <Chip key={n} name={n} />
            ))}
          </div>
        </div>
        <div className={styles.zone}>
          <div className={styles.zoneHead}>{c.scopeOut}</div>
          <div className={`${styles.chips} ${styles.mono}`}>
            {scopeOut.map((n) => (
              <Chip key={n} name={n} />
            ))}
            <Chip name={`spend-insights · ${c.proposed}`} tone="new" />
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        {off ? (
          <>
            <Ev icon={<FiGitCommit aria-hidden />}>
              <strong>{c.stepWrite}</strong>
              <div className={`${styles.links} ${styles.mono}`}>
                <Link from="spend-insights" verb="consumes" to="card-events" tone="bad" />
              </div>
            </Ev>
            <Ev icon={<FiMinusCircle aria-hidden />}>
              <span className={styles.muted}>{c.offNoCheck}</span>
            </Ev>
          </>
        ) : (
          <>
            <Ev icon={<FiXCircle aria-hidden />} tone="bad">
              <strong className={styles.bad}>{c.stepWrite}</strong>
              <div className={`${styles.links} ${styles.mono}`}>
                <Link from="spend-insights" verb="consumes" to="card-events" tone="bad" />
              </div>
              <div className={styles.pciErr}>
                <div>{PCI_ERR.text}</div>
                <code className={styles.codeInline}>
                  {PAYMENTS}:{PCI_ERR.line} · {PCI_ERR.policy}
                </code>
              </div>
            </Ev>
            <Ev icon={<FiCheckCircle aria-hidden />} tone="good">
              <strong>{c.stepFix}</strong>
              <div className={`${styles.links} ${styles.mono}`}>
                <Link from="spend-insights" verb="consumes" to="payment-events" tone="ok" />
              </div>
              <div className={styles.muted}>{c.fixed}</div>
              <Term ok={PCI_OK} />
            </Ev>
          </>
        )}
      </div>
      <Outcome good={!off}>{off ? c.offOutcome : c.onOutcome}</Outcome>
    </div>
  );
}

/* 1. Designing an architecture: a proposal that breaks the platform's rules. */
export function Design({side, t}: Props): ReactNode {
  const off = side === 'off';
  const c = t.design;
  return (
    <div className={styles.window}>
      <div className={styles.winBar}>
        <span className={styles.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.winTitle}>{off ? 'design-proposal.md' : 'proposal.asl.yaml'} — orders</span>
      </div>
      {off ? (
        <div className={`${styles.code} ${styles.mono}`}>
          {[
            '# Orders platform',
            '',
            '- Compute: AWS Lambda for every service',
            '- Data: DynamoDB',
            '- Events: SNS',
          ].map((l, i) => (
            <div key={i} className={styles.cl}>
              <span className={styles.ln}>{i + 1}</span>
              <span className={i === 0 ? styles.mdH : undefined}>{l}</span>
            </div>
          ))}
          <div className={styles.cl}>
            <span className={styles.ln}>6</span>
            <span className={styles.cmt}>&lt;!-- {c.offNote} --&gt;</span>
          </div>
        </div>
      ) : (
        <div className={styles.timeline}>
          <Ev icon={<FiXCircle aria-hidden />} tone="bad">
            <strong className={styles.bad}>{c.stepWrite}</strong>
            <Snippet lines={DESIGN_BEFORE} from={0} bad={DESIGN_BAD} />
            {DESIGN_ERRS.lines.map((n) => (
              <div key={n} className={styles.pciErr}>
                <div>{DESIGN_ERRS.text}</div>
                <code className={styles.codeInline}>
                  {DESIGN}:{n} · {DESIGN_ERRS.policy}
                </code>
              </div>
            ))}
          </Ev>
          <Ev icon={<FiCheckCircle aria-hidden />} tone="good">
            <strong>{c.stepFix}</strong>
            <Snippet lines={DESIGN_AFTER} from={0} changed={DESIGN_CHANGED} />
            <div className={styles.muted}>{c.fixed}</div>
            <Term ok={DESIGN_ERRS.ok} />
          </Ev>
        </div>
      )}
      <Outcome good={!off}>{off ? c.offOutcome : c.onOutcome}</Outcome>
    </div>
  );
}

/* 3. Developing: without ASL, a VS Code window with the spec; with ASL, the same file as a timeline. */
function Snippet({
  lines,
  from = 5,
  changed,
  bad,
  squiggle,
}: {
  lines: string[];
  from?: number;
  changed?: number[];
  bad?: number[];
  squiggle?: number;
}): ReactNode {
  // the top of the manifest is the same before and after: show it from `from` down
  return (
    <div className={`${styles.snippet} ${styles.code} ${styles.mono}`}>
      {from > 0 && (
        <div className={styles.cl}>
          <span className={styles.ln}>…</span>
        </div>
      )}
      {lines.map((l, i) => {
        if (i < from) return null;
        return (
          <div
            key={i}
            className={`${styles.cl} ${bad?.includes(i) ? styles.clBad : ''} ${changed?.includes(i) ? styles.clAdded : ''}`}
          >
            <span className={styles.ln}>{i + 1}</span>
            <span className={squiggle === i ? styles.squiggle : undefined}>
              <Yaml line={l} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Editor({side, t}: Props): ReactNode {
  const off = side === 'off';
  const c = t.dev;

  if (!off) {
    return (
      <div className={styles.window}>
        <div className={styles.winBar}>
          <span className={styles.dots} aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.winTitle}>cancellation.asl.yaml — payments</span>
        </div>
        <div className={styles.timeline}>
          <Ev icon={<FiXCircle aria-hidden />} tone="bad">
            <strong className={styles.bad}>{c.stepWrite}</strong>
            <Snippet lines={CANCEL_BEFORE} bad={[6, 7, 8, 9]} />
            <div className={styles.pciErr}>
              <div>{ERR_OWN.text}</div>
              <code className={styles.codeInline}>
                {CANCEL}:{ERR_OWN.line} · {ERR_OWN.policy}
              </code>
            </div>
          </Ev>
          <Ev icon={<FiCheckCircle aria-hidden />} tone="good">
            <strong>{c.stepFix}</strong>
            <Snippet lines={CANCEL_AFTER} changed={CANCEL_CHANGED} />
            <Term ok={ERR_OWN.ok} />
          </Ev>
        </div>
        <Outcome good>{c.onOutcome}</Outcome>
      </div>
    );
  }

  return (
    <div className={styles.window}>
      <div className={styles.winBar}>
        <span className={styles.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.winTitle}>tasks.md — payments</span>
      </div>

      <div className={styles.vsc}>
        <div className={styles.explorer}>
          <div className={styles.expHead}>{c.explorer}</div>
          <div className={`${styles.tree} ${styles.mono}`}>
            <div className={styles.node}>
              <FiChevronRight aria-hidden /> <FiFolder aria-hidden /> openspec
            </div>
            <div className={`${styles.node} ${styles.n2}`}>
              <FiFile aria-hidden /> proposal.md
            </div>
            <div className={`${styles.node} ${styles.n2} ${styles.nodeOn}`}>
              <FiFile aria-hidden /> tasks.md
            </div>
            <div className={styles.node}>
              <FiChevronRight aria-hidden /> <FiFolder aria-hidden /> src
            </div>
          </div>
        </div>

        <div className={styles.editorCol}>
          <div className={`${styles.code} ${styles.mono}`}>
            <div className={styles.cl}>
              <span className={styles.ln}>1</span>
              <span className={styles.mdH}># Tasks</span>
            </div>
            <div className={styles.cl}>
              <span className={styles.ln}>2</span>
            </div>
            {[
              '- [x] 1.1 Create cancellation-service',
              '- [x] 1.2 Write the cancellation to orders-db',
              '- [x] 1.3 Set owner: team-fulfillment',
            ].map((l, i) => (
              <div key={l} className={styles.cl}>
                <span className={styles.ln}>{i + 3}</span>
                <span>{l}</span>
              </div>
            ))}
            <div className={styles.cl}>
              <span className={styles.ln}>6</span>
              <span className={styles.cmt}>&lt;!-- {c.offNote} --&gt;</span>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTabs}>
              <span className={styles.panelTabOn}>
                {c.problems}
                <b className={styles.badge}>0</b>
              </span>
              <span>{c.terminal}</span>
            </div>
            <div className={`${styles.panelBody} ${styles.mono}`}>
              <div className={styles.muted}>{c.noProblems}</div>
            </div>
          </div>
        </div>
      </div>
      <Outcome good={false}>{c.offOutcome}</Outcome>
    </div>
  );
}

function Phase({children}: {children: ReactNode}): ReactNode {
  return <div className={styles.phase}>{children}</div>;
}

function Ev({
  icon,
  tone,
  children,
}: {
  icon: ReactNode;
  tone?: 'bad' | 'good' | 'merge';
  children: ReactNode;
}): ReactNode {
  return (
    <div className={styles.ev}>
      <span className={`${styles.evIcon} ${tone ? styles[`tone_${tone}`] : ''}`}>{icon}</span>
      <div className={styles.evBody}>{children}</div>
    </div>
  );
}

/* 4. Evaluating an architecture: a pull request with the CI/CD checks. */
export function PullRequest({side, t}: Props): ReactNode {
  const off = side === 'off';
  const c = t.pr;
  return (
    <div className={styles.gh}>
      <div className={styles.ghHead}>
        <div className={styles.ghTitle}>
          Add loyalty-service <span className={styles.ghNum}>#42</span>
        </div>
        <span className={`${styles.pill} ${styles.pillMerged}`}>
          <FiGitMerge aria-hidden /> {c.merged}
        </span>
      </div>
      <div className={styles.ghBy}>
        <span className={styles.avatar} aria-hidden>
          A
        </span>
        <span>
          <strong>agent</strong> {c.opened}
        </span>
      </div>
      <p className={styles.ghPrompt}>“{c.prompt}”</p>

      <div className={styles.timeline}>
        <Phase>{c.phaseDesign}</Phase>
        {off ? (
          <Ev icon={<FiMinusCircle aria-hidden />}>
            <span className={styles.muted}>{c.noCheck}</span>
          </Ev>
        ) : (
          <>
            <Ev icon={<FiXCircle aria-hidden />} tone="bad">
              <strong className={styles.bad}>asl / architecture</strong>
              <div>{ERR_SHARED.text}</div>
              <code className={styles.codeInline}>
                {SHOP}:{ERR_SHARED.line} · {ERR_SHARED.policy}
              </code>
            </Ev>
            <Ev icon={<FiGitCommit aria-hidden />}>
              <span className={styles.muted}>{c.pushed}</span>
              <div>{c.fix}</div>
            </Ev>
            <Ev icon={<FiCheckCircle aria-hidden />} tone="good">
              <strong className={styles.good}>asl / architecture</strong>{' '}
              <code className={styles.codeInline}>{ERR_SHARED.ok}</code>
            </Ev>
          </>
        )}
        <Ev icon={<FiGitMerge aria-hidden />} tone="merge">
          <strong>{c.merged}</strong>
        </Ev>

        <Phase>{c.phaseDeploy}</Phase>
        <Ev icon={<FiCheckCircle aria-hidden />} tone="good">
          <strong className={styles.good}>kyverno / disallow-latest-tag</strong>
          <div>{c.admitted}</div>
        </Ev>
        {!off && (
          <Ev icon={<FiXCircle aria-hidden />} tone="bad">
            <strong className={styles.bad}>kyverno / asl-declared-applications</strong>{' '}
            <span className={styles.tag}>{t.proposal}</span>
            <div>{c.deniedWhy}</div>
          </Ev>
        )}
      </div>
      <Outcome good={!off}>{off ? c.offOutcome : c.onOutcome}</Outcome>
    </div>
  );
}
