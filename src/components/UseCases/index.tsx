import {useRef, useState, type ComponentType, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {FiCheckCircle, FiChevronLeft, FiChevronRight, FiFileText, FiTerminal} from 'react-icons/fi';
import {LuCode, LuPencilRuler, LuScanSearch, LuShieldCheck, LuWorkflow} from 'react-icons/lu';
import {COPY, type CaseCopy, type Copy, type Locale} from './data';
import {AgentCli, Design, Editor, PciScope, PullRequest} from './demos';
import styles from './styles.module.css';

const ICONS = [LuPencilRuler, LuCode, LuShieldCheck, LuWorkflow, LuScanSearch];
const DEMOS = [Design, Editor, PciScope, PullRequest, AgentCli];
// icon colors follow the case, not its position
const HUES = ['hue3', 'hue2', 'hue1', '', 'hue0'];
// cases kept in the data but not shown (indexes into the arrays above); empty it to show all
const HIDDEN = [3];
// the SDLC tracker above the scenario is kept in the data and the styles but not shown; set to true to bring it back
const SHOW_SDLC = false;

export default function UseCases({locale}: {locale: Locale}): ReactNode {
  const t = COPY[locale];
  const items = t.cases.map((c, i) => ({c, i})).filter(({i}) => !HIDDEN.includes(i));
  const [sel, setSel] = useState(0);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const Demo = DEMOS[items[sel].i];

  const go = (i: number) => {
    setSel(i);
    cards.current[i]?.scrollIntoView({behavior: 'smooth', inline: 'start', block: 'nearest'});
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.carouselHead}>
        <div className={styles.nav}>
          <span className={styles.count} aria-hidden>
            {sel + 1} / {items.length}
          </span>
          <button
            type="button"
            className={styles.navBtn}
            aria-label={t.prev}
            disabled={sel === 0}
            onClick={() => go(sel - 1)}
          >
            <FiChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            aria-label={t.next}
            disabled={sel === items.length - 1}
            onClick={() => go(sel + 1)}
          >
            <FiChevronRight aria-hidden />
          </button>
        </div>
      </div>

      <div className={styles.track} data-count={items.length} role="tablist" aria-label={t.title}>
        {items.map(({c, i: caseIdx}, i) => {
          const Icon = ICONS[caseIdx];
          return (
            <button
              key={c.tab}
              ref={(el) => {
                cards.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`uc-tab-${i}`}
              aria-selected={i === sel}
              aria-controls="uc-panel"
              className={`${styles.card} ${i === sel ? styles.cardOn : ''}`}
              onClick={() => go(i)}
            >
              <span className={styles.cardIconTile}>
                <Icon className={`${styles.cardIcon} ${HUES[caseIdx] ? styles[HUES[caseIdx]] : ''}`} aria-hidden />
              </span>
              <span className={styles.cardText}>
                <span className={styles.cardTitle}>{c.tab}</span>
                <span className={styles.medium}>{c.medium}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.demo} role="tabpanel" id="uc-panel" aria-labelledby={`uc-tab-${sel}`}>
        <CaseView t={t} c={items[sel].c} Demo={Demo} />
      </div>
    </div>
  );
}

type DemoProps = {side: 'off' | 'on'; t: Copy};

function CaseView({
  t,
  c,
  Demo,
}: {
  t: Copy;
  c: CaseCopy;
  Demo: ComponentType<DemoProps>;
}): ReactNode {
  return (
    <>
    <div className={styles.brief}>
      {SHOW_SDLC && (
        <>
        <h3 className={styles.sdlcTitle}>{t.sdlcLabel}</h3>
        <ol className={styles.sdlc} aria-label={t.sdlcLabel}>
          {t.stages.map((name, i) => {
            const on = c.sdlc.includes(i);
            return (
              <li key={name} className={`${styles.stage} ${on ? styles.stageOn : ''}`} aria-current={on ? 'step' : undefined}>
                <span className={styles.stageDot} aria-hidden />
                <span className={styles.stageName}>{name}</span>
              </li>
            );
          })}
        </ol>
        </>
      )}
      <div className={`${styles.scenario} ${SHOW_SDLC ? '' : styles.scenarioAlone}`}>
        <div className={styles.scenarioHead}>
          <h3 className={styles.scenarioTitle}>{t.scenario}</h3>
        </div>
        <div className={`${styles.timeline} ${styles.scenarioTimeline}`}>
          {([
            [FiFileText, c.story.context, ''],
            [FiTerminal, c.story.action, ''],
            [FiCheckCircle, c.story.asl, styles.tone_good],
          ] as const).map(([StepIcon, text, tone], n) => (
            <div key={n} className={styles.ev}>
              <span className={`${styles.evIcon} ${tone}`}>
                <StepIcon aria-hidden />
              </span>
              <div className={styles.evBody}>
                <strong className={styles.stepLabel}>{t.scenarioSteps[n]}</strong>
                <p className={styles.stepText}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className={styles.cols}>
      <div className={styles.col}>
        <div className={`${styles.head} ${styles.headOff}`}>{t.off}</div>
        <Demo key="off" side="off" t={t} />
      </div>
      <div className={styles.col}>
        <div className={`${styles.head} ${styles.headOn}`}>{t.on}</div>
        <Demo key="on" side="on" t={t} />
      </div>
    </div>
    </>
  );
}

/** One use case on its own, for the docs pages. `id` is the case index (0 design, 1 developing, 2 PCI, 4 interpreting). */
export function UseCase({id}: {id: number}): ReactNode {
  const {i18n} = useDocusaurusContext();
  const t = COPY[i18n.currentLocale === 'pt' ? 'pt' : 'en'];
  return (
    <div className={`${styles.wrap} ${styles.single}`}>
      <div className={styles.demo}>
        <CaseView t={t} c={t.cases[id]} Demo={DEMOS[id]} />
      </div>
    </div>
  );
}
