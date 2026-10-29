import { useEffect, useRef, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Terminal from '@site/src/components/Terminal';
import { FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import {
  LuTerminal,
  LuGlobe,
  LuPlug,
  LuDollarSign,
  LuRepeat,
  LuLayers,
} from 'react-icons/lu';
import { SiGo, SiKubernetes, SiPython } from 'react-icons/si';
import { FaGithub } from 'react-icons/fa6';
import styles from './styles.module.css';

type Item = { title: string; text: string };

type Copy = {
  title: string;
  titleAccent: string;
  sub: string;
  cta1: string;
  cta2: string;
  proof: { value: string; label: string }[];
  painTitle: string;
  painSub: string;
  pain: Item[];
  loopTitle: string;
  loopSub: string;
  loop: { n: string; who: string; text: string }[];
  cmpTitle: string;
  cmpBad: { title: string; label: string; items: string[] };
  cmpGood: { title: string; label: string; items: string[] };
  cmpMore: string;
  flowTitle: string;
  flowIntro: string;
  manifestTitle: string;
  manifestSub: string;
  policyTitle: string;
  policySub: string;
  resultTitle: string;
  resultSub: string;
  portTitle: string;
  portSub: string;
  port: Item[];
  cmpLead: string;
  ctaTitle: string;
  ctaText: string;
  ctaGithub: string;
};

const COPY: Record<string, Copy> = {
  en: {
    title: 'The system-design harness',
    titleAccent: 'for your agents.',
    sub: 'Agents ship code faster than anyone can review the design. ASL gives them your architecture as structured context, and a compiler that checks every change at zero token cost.',
    cta1: 'Get started',
    cta2: 'See how it works',
    proof: [
      { value: '0', label: 'tokens to validate' },
      { value: '100%', label: 'Deterministic' },
      { value: 'Declarative', label: 'Describe it in YAML, like in Kubernetes' },
      { value: 'Extensible', label: 'Your own schemas and policies' },
      { value: 'Portable', label: 'CLI, Go, browser and Python' },
    ],
    painTitle: 'Agents pay to interpret your architecture. Every time.',
    painSub:
      'A diagram was made for humans. Handing it to a model turns every task into a reading exercise.',
    pain: [
      {
        title: 'Parsing a draw.io burns tokens',
        text: 'The file is XML full of coordinates, styles and generated ids. The agent pays to recover a graph that was never stored as one.',
      },
      {
        title: 'Screenshots cost more and guess more',
        text: 'Image tokens, then inference about what an arrow means. Push or poll? Sync or async? The model picks one.',
      },
      {
        title: 'The same diagram, a different design each run',
        text: 'Interpretation is probabilistic. Two sessions read the same picture and build two different systems.',
      },
      {
        title: 'Nothing tells the agent it is wrong',
        text: 'There is no feedback loop for a design. Dangling dependencies and broken contracts surface in production, not in the prompt.',
      },
    ],
    loopTitle: 'A harness for system design.',
    loopSub:
      'Context to read, guardrails to respect, feedback to correct. Validation is a program, not a prompt: free and identical every run.',
    loop: [
      {
        n: '01',
        who: 'Context',
        text: 'The agent reads the architecture as typed data. No decoding, no guessing what an arrow means.',
      },
      {
        n: '02',
        who: 'Guardrails',
        text: 'Your rules are policies the change must satisfy: ownership, allowed dependencies, naming, anything CEL can say.',
      },
      {
        n: '03',
        who: 'Feedback',
        text: 'asl compiles the change and returns a few lines of diagnostics. The agent fixes it, and CI blocks the merge on exit 1.',
      },
    ],
    cmpTitle: 'ASL is not Diagram as Code.',
    cmpLead: "Don't draw the architecture. Specify it.",
    cmpBad: {
      title: 'Diagrams, draw.io, Diagram as Code',
      label: 'Diagram as Code',
      items: [
        'Concerned with the generated visual',
        'An arrow means whatever the reader decides',
        'A draw.io file is thousands of tokens of coordinates and styles to read',
        'Compiles with a dangling connection',
        'Cannot express a rule',
      ],
    },
    cmpGood: {
      title: 'ASL',
      label: 'ASL',
      items: [
        'Concerned with the architecture itself',
        'A relationship is typed: reads, writes, calls',
        'Structured data an agent reads directly',
        'A dangling reference fails the build',
        'Rules are policies that run on every commit',
      ],
    },
    cmpMore: 'Read the full comparison',
    flowTitle: 'What counts as an antipattern is up to you.',
    flowIntro:
      'Several applications writing to the same database is fine in some companies and a mistake in yours. Write that rule once, and every architecture an agent proposes is checked against it, before anyone writes code.',
    manifestTitle: 'The agent proposes',
    manifestSub:
      'billing-service needs to record credit data, and writing straight to credit-db is the fastest way to ship the feature.',
    policyTitle: 'Your context says no',
    policySub:
      'A CustomPolicy, versioned with the code: a database has a single writer.',
    resultTitle: 'The compiler answers',
    resultSub:
      'No model call. The agent reads four lines, gives billing-service its own data store and runs it again.',
    portTitle: 'One compiler. Use it wherever you work.',
    portSub:
      'The same checks and the same verdict in your pipeline, your tools, your browser and your scripts.',
    port: [
      {
        title: 'In your pipeline',
        text: 'Run it on every pull request. An architecture that breaks a rule fails the build before it merges.',
      },
      {
        title: 'In your own tools',
        text: 'Build the check into the platform or portal your team already uses, and validate architecture where people work.',
      },
      {
        title: 'In a diagram editor',
        text: 'Power a diagram editor: people draw on a canvas while ASL validates the architecture behind it, live and with no server.',
      },
      {
        title: 'In Python',
        text: 'Run the same checks from your scripts and notebooks, next to your data and AI tooling.',
      },
    ],
    ctaTitle: 'Give your agents a design they can read.',
    ctaText:
      'Write the rule once. Every agent proposal is checked against it.',
    ctaGithub: 'View on GitHub',
  },
  pt: {
    title: 'O harness de system design',
    titleAccent: 'para seus agentes.',
    sub: 'Agentes escrevem código mais rápido do que qualquer pessoa consegue revisar o design. O ASL entrega a sua arquitetura como contexto estruturado e traz um compilador que valida cada mudança sem gastar um único token.',
    cta1: 'Começar',
    cta2: 'Ver como funciona',
    proof: [
      { value: '0', label: 'tokens para validar' },
      { value: '100%', label: 'Determinístico' },
      { value: 'Declarativo', label: 'Descreva em YAML, como no Kubernetes' },
      { value: 'Extensível', label: 'Com os seus próprios schemas e policies' },
      { value: 'Portátil', label: 'CLI, Go, navegador e Python' },
    ],
    painTitle: 'Seus agentes pagam para interpretar a arquitetura. Toda vez.',
    painSub:
      'Diagrama é feito para gente ler. Entregar um a um modelo transforma cada tarefa em um exercício de interpretação.',
    pain: [
      {
        title: 'Ler um draw.io queima tokens',
        text: 'O arquivo é um XML enorme, cheio de coordenadas, estilos e ids gerados. O agente gasta tokens para reconstruir um grafo que nunca foi guardado como grafo.',
      },
      {
        title: 'Screenshots custam mais e alucinam mais',
        text: 'Tokens de imagem e, depois, a inferência do que cada seta quer dizer. É push ou polling? Síncrono ou assíncrono? O modelo alucina uma resposta.',
      },
      {
        title: 'O mesmo diagrama gera um design diferente a cada execução',
        text: 'A interpretação é probabilística. Duas sessões leem a mesma imagem e constroem sistemas diferentes.',
      },
      {
        title: 'Ninguém avisa ao agente que ele errou',
        text: 'Não existe ciclo de feedback para um design. Dependências soltas e contratos quebrados só aparecem em produção, nunca no prompt.',
      },
    ],
    loopTitle: 'Um harness de system design.',
    loopSub:
      'Contexto para ler, guardrails para respeitar e feedback para corrigir. Validar é rodar um programa, não escrever um prompt: não custa nada e dá o mesmo resultado em toda execução.',
    loop: [
      {
        n: '01',
        who: 'Contexto',
        text: 'O agente lê a arquitetura como dado tipado. Sem decifrar desenho, sem alucinar o que uma seta quer dizer.',
      },
      {
        n: '02',
        who: 'Guardrails',
        text: 'Suas regras viram policies que toda mudança precisa cumprir: ownership, dependências permitidas, nomenclatura, tudo que o CEL consegue expressar.',
      },
      {
        n: '03',
        who: 'Feedback',
        text: 'O asl compila a mudança e devolve poucas linhas de diagnóstico. O agente corrige sozinho, e o CI barra o merge quando o exit code é 1.',
      },
    ],
    cmpTitle: 'O ASL não é Diagram as Code.',
    cmpLead: 'Não desenhe a arquitetura. Especifique.',
    cmpBad: {
      title: 'Diagramas, draw.io, Diagram as Code',
      label: 'Diagram as Code',
      items: [
        'Só se preocupa com o desenho gerado',
        'Uma seta significa o que cada leitor entender',
        'Um arquivo draw.io tem milhares de tokens de coordenadas e estilos para ler',
        'Passa mesmo com uma conexão solta',
        'Não expressa regra nenhuma',
      ],
    },
    cmpGood: {
      title: 'ASL',
      label: 'ASL',
      items: [
        'Se preocupa com a arquitetura em si',
        'Todo relacionamento é tipado: reads, writes, calls',
        'Dado estruturado que o agente lê direto',
        'Uma referência solta quebra o build',
        'Regras são policies que rodam a cada commit',
      ],
    },
    cmpMore: 'Ler a comparação completa',
    flowTitle: 'Você define o que é antipadrão no seu contexto.',
    flowIntro:
      'Várias aplicações escrevendo no mesmo banco de dados pode ser aceitável em uma empresa e um erro na sua. Escreva essa regra uma única vez e toda arquitetura proposta por um agente será verificada contra ela, antes de qualquer linha de código.',
    manifestTitle: 'O agente propõe',
    manifestSub:
      'O billing-service precisa registrar dados de crédito, e gravar direto no credit-db é o caminho mais rápido para entregar a funcionalidade.',
    policyTitle: 'Seu contexto diz não',
    policySub:
      'Uma CustomPolicy, versionada com o código: um banco de dados tem um único escritor.',
    resultTitle: 'O compilador responde',
    resultSub:
      'Sem chamada a modelo nenhum. O agente lê poucas linhas, dá ao billing-service um banco só dele e roda de novo.',
    portTitle: 'Um único compilador. Use onde você já trabalha.',
    portSub:
      'As mesmas checagens e o mesmo resultado no seu pipeline, nas suas ferramentas, no navegador e nos seus scripts.',
    port: [
      {
        title: 'No seu pipeline',
        text: 'Rode a cada pull request. Uma arquitetura que viola uma regra derruba o build antes de ser integrada.',
      },
      {
        title: 'Nas suas ferramentas',
        text: 'Integre a checagem ao portal ou à plataforma interna que o seu time já usa. A arquitetura é validada ali mesmo, sem ninguém sair da ferramenta.',
      },
      {
        title: 'Em um editor de diagramas',
        text: 'Alimente um editor de diagramas: a pessoa desenha no canvas e o ASL valida a arquitetura por trás, ao vivo e sem servidor.',
      },
      {
        title: 'Em Python',
        text: 'Rode as mesmas checagens em scripts e notebooks, junto das suas ferramentas de dados e IA.',
      },
    ],
    ctaTitle: 'Dê aos seus agentes um design que eles consigam ler.',
    ctaText:
      'Escreva a regra uma vez. Toda proposta de um agente passa por ela antes de virar código.',
    ctaGithub: 'Ver no GitHub',
  },
};

const MANIFEST = `apiVersion: asl/v1
kind: Application
metadata:
  name: credit-service
spec:
  providers:
    aws: EKS
  language: Go
---
apiVersion: asl/v1
kind: Application
metadata:
  name: billing-service
spec:
  providers:
    aws: EKS
  language: Go
---
apiVersion: asl/v1
kind: Database
metadata:
  name: credit-db
spec:
  providers:
    aws: RDSPostgreSQL
---
apiVersion: asl/v1
kind: Relationship
metadata:
  name: credit-db-relations
spec:
  relations:
    - from:
        kind: Application
        name: credit-service
      to:
        kind: Database
        name: credit-db
      type: writes
    - from:
        kind: Application
        name: billing-service
      to:
        kind: Database
        name: credit-db
      type: writes`;

const POLICY = `apiVersion: asl/v1
kind: CustomPolicy
metadata:
  name: single-writer
  namespace: acme
spec:
  severity: error
  selector:
    kind: Database
  assertions:
    # only one application may write to this database
    - expression: to(manifest, 'writes').size() <= 1
      message: Only one application may write to database`;

const RESULT = `error: Only one application may write to database
  --> architecture/credit.asl.yaml:18
  policy: acme.single-writer

error: could not compile due to 1 previous error (6.6ms)`;

// Turns every "CEL" in a copy string into a link to cel.dev.
function withCel(text: string): ReactNode {
  return text.split(/(\bCEL\b)/).map((part, i) =>
    part === 'CEL' ? (
      <a
        key={i}
        href="https://cel.dev"
        target="_blank"
        rel="noopener noreferrer"
      >
        CEL
      </a>
    ) : (
      part
    ),
  );
}

// Scrolls the code block inside `children` so `line` (1-based) sits at the top on load.
function FocusLine({
  line,
  children,
}: {
  line: number;
  children: ReactNode;
}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // CodeBlock may re-render after hydration, so retry until the scroll sticks.
    const apply = () => {
      const pre = ref.current?.querySelector('pre');
      const target = pre?.querySelectorAll('.token-line')[line - 1];
      if (!pre || !target || pre.scrollTop > 0) return;
      pre.scrollTop =
        target.getBoundingClientRect().top -
        pre.getBoundingClientRect().top +
        pre.scrollTop -
        12;
    };
    const timers = [0, 100, 400, 1000].map((ms) =>
      window.setTimeout(apply, ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [line]);
  return (
    <div ref={ref} className={styles.focusWrap}>
      {children}
    </div>
  );
}

export default function Home(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const t = COPY[i18n.currentLocale] ?? COPY.en;

  return (
    <Layout description={t.sub}>
      <header className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <h1 className={styles.h1}>
              {t.title} <span className={styles.accent}>{t.titleAccent}</span>
            </h1>
            <p className={styles.sub}>{t.sub}</p>
            <div className={styles.ctas}>
              <Link
                className="button button--primary button--lg"
                to="/docs/intro"
              >
                {t.cta1}
              </Link>
              <Link className={styles.textLink} to="/docs/why">
                {t.cta2} <FiArrowRight />
              </Link>
            </div>
          </div>
          <Terminal />
        </div>
        <div className="container">
          <div className={styles.proof}>
            {t.proof.map((p, i) => {
              const Icon = [LuDollarSign, LuRepeat, SiKubernetes, LuPlug, LuLayers][i];
              return (
                <div key={p.label} className={styles.stat}>
                  <Icon className={styles.statIcon} aria-hidden />
                  <strong>{p.value}</strong>
                  <span>{p.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.h2}>{t.painTitle}</h2>
            <p className={styles.lead}>{t.painSub}</p>
            <div className={styles.whyGrid}>
              {t.pain.map((w) => (
                <div key={w.title} className={styles.card}>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.band}`}>
          <div className="container">
            <h2 className={styles.h2}>{t.loopTitle}</h2>
            <p className={styles.lead}>{t.loopSub}</p>
            <ol className={styles.steps}>
              {t.loop.map((s) => (
                <li key={s.n} className={styles.card}>
                  <div className={styles.stepHead}>
                    <span className={styles.stepN}>{s.n}</span>
                    <h3 className={styles.stepTitle}>{s.who}</h3>
                  </div>
                  <p>{withCel(s.text)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.h2}>{t.flowTitle}</h2>
            <p className={styles.lead}>{t.flowIntro}</p>
            <div className={styles.flow}>
              <div className={styles.flowCol}>
                <h2 className={styles.flowTitle}>
                  <span className={styles.flowN}>01</span>
                  {t.manifestTitle}
                </h2>
                <p className={styles.flowSub}>{t.manifestSub}</p>
                <FocusLine line={27}>
                  <CodeBlock
                    language="yaml"
                    title="agent proposal · architecture/credit.asl.yaml"
                    metastring="showLineNumbers {33-46}"
                  >
                    {MANIFEST}
                  </CodeBlock>
                </FocusLine>
              </div>
              <div className={styles.flowCol}>
                <h2 className={styles.flowTitle}>
                  <span className={styles.flowN}>02</span>
                  {t.policyTitle}
                </h2>
                <p className={styles.flowSub}>{t.policySub}</p>
                <CodeBlock
                  language="yaml"
                  title="policies/single-writer.asl.yaml"
                  metastring="showLineNumbers {11-13}"
                >
                  {POLICY}
                </CodeBlock>
              </div>
            </div>
            <div className={styles.flowResult}>
              <h2 className={styles.flowTitle}>
                <span className={styles.flowN}>03</span>
                {t.resultTitle}
              </h2>
              <p className={styles.flowSub}>{t.resultSub}</p>
              <CodeBlock
                language="asldiag"
                title="$ asl ./architecture --policies-bundle-path ./policies"
              >
                {RESULT}
              </CodeBlock>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.band}`}>
          <div className="container">
            <h2 className={styles.h2}>{t.cmpTitle}</h2>
            <p className={styles.lead}>{t.cmpLead}</p>
            <div className={styles.cmp} role="table">
              <div className={`${styles.cmpHead}`} role="row">
                <div className={styles.cmpBadHead} role="columnheader">
                  {t.cmpBad.title}
                </div>
                <div className={styles.cmpGoodHead} role="columnheader">
                  {t.cmpGood.title}
                </div>
              </div>
              {t.cmpBad.items.map((bad, i) => (
                <div key={bad} className={styles.cmpRow} role="row">
                  <div className={styles.cmpBad} role="cell">
                    <FiX />
                    <div className={styles.cmpText}>
                      <small className={styles.cmpTag}>{t.cmpBad.label}</small>
                      <span>{bad}</span>
                    </div>
                  </div>
                  <div className={styles.cmpGood} role="cell">
                    <FiCheck />
                    <div className={styles.cmpText}>
                      <small className={styles.cmpTag}>{t.cmpGood.label}</small>
                      <span>{t.cmpGood.items[i]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link className={styles.textLink} to="/docs/aac-vs-diagram-as-code">
              {t.cmpMore} <FiArrowRight />
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.h2}>{t.portTitle}</h2>
            <p className={styles.lead}>{t.portSub}</p>
            <div className={styles.portGrid}>
              {t.port.map((a, i) => {
                const Icon = [LuTerminal, SiGo, LuGlobe, SiPython][i];
                return (
                  <div key={a.title} className={styles.card}>
                    <Icon className={styles.portIcon} />
                    <h3>{a.title}</h3>
                    <p>{a.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.final}>
          <div className={`container ${styles.finalRow}`}>
            <div>
              <h2 className={styles.h2}>{t.ctaTitle}</h2>
              <p className={styles.lead}>{t.ctaText}</p>
            </div>
            <div className={styles.finalActions}>
              <Link
                className="button button--primary button--lg"
                to="/docs/intro"
              >
                {t.cta1}
              </Link>
              <a
                className="button button--outline button--primary button--lg"
                href="https://github.com/margato/asl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className={styles.btnIcon} /> {t.ctaGithub}
              </a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
