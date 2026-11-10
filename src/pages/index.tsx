import {useEffect, useRef, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import {
  LuTerminal,
  LuBraces,
  LuShieldCheck,
  LuPuzzle,
} from 'react-icons/lu';
import { SiGo, SiJavascript, SiPython } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { FaGithub } from 'react-icons/fa6';
import styles from './styles.module.css';

type Item = { title: string; text: string };

type Faq = { q: string; a: string; cards?: boolean };

type Copy = {
  title: string;
  titleAccent: string;
  sub: string;
  cta1: string;
  cta2: string;
  ideas: Item[];
  flowTitle: string;
  flowIntro: string;
  manifestTitle: string;
  manifestSub: string;
  policyTitle: string;
  policySub: string;
  resultTitle: string;
  resultSub: string;
  agentsTitle: string;
  agentsText: string;
  agentsLink: string;
  faqTitle: string;
  faqMore: string;
  faq: Faq[];
  port: Item[];
  ctaTitle: string;
  ctaText: string;
  ctaGithub: string;
};

const COPY: Record<string, Copy> = {
  en: {
    title: 'The language for',
    titleAccent: 'specifying architecture.',
    sub: 'Describe your applications, databases and the relationships between them in YAML. ASL checks references, contracts and your own rules on every change, in milliseconds.',
    cta1: 'Get started',
    cta2: 'Try the playground',
    ideas: [
      {
        title: 'Declarative',
        text: 'Describe the architecture in YAML, the way you describe resources in Kubernetes.',
      },
      {
        title: 'Verifiable',
        text: 'A compiler checks it. The same input gives the same result, with no LLM call.',
      },
      {
        title: 'Extensible',
        text: 'Teach ASL your own kinds and policies, with no changes to the compiler.',
      },
    ],
    flowTitle: 'Specify it. *Then check it.*',
    flowIntro:
      'Several applications writing to the same database is fine in some companies and a mistake in yours. Write that rule once, and every architecture proposed is checked against it, before anyone writes code.',
    manifestTitle: 'The architecture',
    manifestSub:
      'subscription-service needs to record billing data, and writing straight to billing-db is the fastest way to ship the feature.',
    policyTitle: 'Your rule',
    policySub:
      'A CustomPolicy, versioned with the code: a database has a single writer.',
    resultTitle: 'The result',
    resultSub:
      'A few lines, in milliseconds. billing-service gets its own data store and the check passes.',
    agentsTitle: 'A specification that agents *can read and respect.*',
    agentsText:
      'Because the architecture is typed code that compiles, an agent gets what a diagram never gave it: context to read, guardrails to respect and feedback to correct itself. Using ASL as an architecture harness for your agents is one of its use cases.',
    agentsLink: 'See it in the use cases',
    faqTitle: 'Frequently asked *questions.*',
    faqMore: 'More questions and answers',
    faq: [
      {
        q: 'What is ASL?',
        a: 'ASL, the Architecture Specification Language, lets you describe applications, databases and the relationships between them as small YAML files. The `asl` command checks them against built-in and custom rules. [Read the introduction](/docs/intro).',
      },
      {
        q: 'Where can I use ASL?',
        a: 'Wherever you work. It is one compiler, with the same checks and the same result in your pipeline, your tools, your editor, your browser and your scripts.',
        cards: true,
      },
      {
        q: 'How is it different from Diagram as Code?',
        a: 'Diagram as Code generates a picture from text. ASL is a specification: it can be compiled, checked against rules and read by agents. [Compare them](/docs/aac-vs-diagram-as-code).',
      },
      {
        q: 'Why not describe the architecture in Markdown?',
        a: 'Markdown is free text to interpret. Every review reads every file, costs tokens and can change between runs. ASL is typed and checked by a compiler: the same input gives the same result. [See the comparison](/docs/why).',
      },
      {
        q: 'Do I need AI or an LLM to use it?',
        a: 'No. You can use AI to generate specifications, but compiling and verifying them never uses an LLM: the compiler is deterministic, and the same input always gives the same result.',
      },
      {
        q: 'Can I write my own rules?',
        a: 'Yes. A [custom policy](/docs/custom-policies) is a small YAML file with an expression in CEL, and [custom schemas](/docs/custom-schemas) teach ASL your own kinds.',
      },
      {
        q: 'Is it ready for production?',
        a: 'ASL is under active development, and parts of the language and of these docs may still change.',
      },
    ],
    port: [
      {
        title: 'In your pipeline',
        text: 'Run it on every pull request. An architecture that breaks a rule fails the build before it merges.',
      },
      {
        title: 'Go SDK',
        text: 'Embed validation in your team\'s portal or internal engineering platform and check the architecture right there, without leaving the tool.',
      },
      {
        title: 'JS SDK',
        text: 'Validate in the browser, with no server. Example: a diagram editor, where people draw on a canvas and ASL checks the architecture live.',
      },
      {
        title: 'Python SDK',
        text: 'Run the same checks from your scripts and notebooks, next to your data and AI tooling.',
      },
      {
        title: 'In VS Code',
        text: 'See the architecture in a sidebar panel and the violated policy on the line that causes it, as your agent types.',
      },
    ],
    ctaTitle: 'Give your architecture *a language.*',
    ctaText: 'Write the rule once. Every design is checked before anyone writes code.',
    ctaGithub: 'View on GitHub',
  },
  pt: {
    title: 'A linguagem para',
    titleAccent: 'especificar arquitetura.',
    sub: 'Descreva suas aplicações, bancos de dados e os relacionamentos entre eles em YAML. O ASL confere referências, contratos e as suas próprias regras a cada mudança, em milissegundos.',
    cta1: 'Começar',
    cta2: 'Testar no playground',
    ideas: [
      {
        title: 'Declarativa',
        text: 'Descreva a arquitetura em YAML, como você descreve recursos no Kubernetes.',
      },
      {
        title: 'Verificável',
        text: 'Um compilador confere. A mesma entrada dá o mesmo resultado, sem chamada a LLM.',
      },
      {
        title: 'Extensível',
        text: 'Ensine ao ASL os seus próprios kinds e policies, sem mexer no compilador.',
      },
    ],
    flowTitle: 'Especifique a arquitetura. *Compile.*',
    flowIntro:
      'Várias aplicações escrevendo no mesmo banco de dados pode ser aceitável em uma empresa e um erro na sua. Escreva essa regra uma única vez e toda arquitetura proposta será conferida contra ela, antes de alguém escrever código.',
    manifestTitle: 'A arquitetura',
    manifestSub:
      'O subscription-service precisa registrar dados de cobrança, e gravar direto no billing-db é o caminho mais rápido para entregar a funcionalidade.',
    policyTitle: 'A sua regra',
    policySub:
      'Uma CustomPolicy, versionada com o código: um banco de dados tem um único escritor.',
    resultTitle: 'O resultado',
    resultSub:
      'Poucas linhas, em milissegundos. O billing-service ganha um banco só dele e a checagem passa.',
    agentsTitle: 'Uma especificação que agentes *conseguem ler e respeitar.*',
    agentsText:
      'Como a arquitetura é código tipado que compila, o agente ganha o que um diagrama nunca deu: contexto para ler, guardrails para respeitar e feedback para se corrigir. Usar o ASL como harness de arquitetura para os seus agentes é um dos casos de uso.',
    agentsLink: 'Veja nos casos de uso',
    faqTitle: 'Perguntas *frequentes.*',
    faqMore: 'Mais perguntas e respostas',
    faq: [
      {
        q: 'O que é o ASL?',
        a: 'O ASL, Architecture Specification Language, permite descrever aplicações, bancos de dados e os relacionamentos entre eles em pequenos arquivos YAML. O comando `asl` confere tudo contra regras nativas e customizadas. [Leia a introdução](/docs/intro).',
      },
      {
        q: 'Onde posso usar o ASL?',
        a: 'Onde você já trabalha. É um único compilador, com as mesmas checagens e o mesmo resultado no seu pipeline, nas suas ferramentas, no editor, no navegador e nos seus scripts.',
        cards: true,
      },
      {
        q: 'Qual a diferença para Diagram as Code?',
        a: 'Diagram as Code gera um desenho a partir de texto. O ASL é uma especificação: pode ser compilada, conferida contra regras e lida por agentes. [Compare os dois](/docs/aac-vs-diagram-as-code).',
      },
      {
        q: 'Por que não descrever a arquitetura em Markdown?',
        a: 'Markdown é texto livre para interpretar. Cada revisão lê todos os arquivos, gasta tokens e pode variar entre execuções. O ASL é tipado e conferido por um compilador: a mesma entrada dá o mesmo resultado. [Veja a comparação](/docs/why).',
      },
      {
        q: 'Preciso de IA ou de um LLM para usar?',
        a: 'Não. Você pode usar IA para gerar as especificações, mas compilar e verificar não usa LLM: o compilador é determinístico, e a mesma entrada sempre dá o mesmo resultado.',
      },
      {
        q: 'Posso escrever as minhas próprias regras?',
        a: 'Pode. Uma [policy customizada](/docs/custom-policies) é um pequeno arquivo YAML com uma expressão em CEL, e [schemas customizados](/docs/custom-schemas) ensinam ao ASL os seus próprios kinds.',
      },
      {
        q: 'Já está pronto para produção?',
        a: 'O ASL está em desenvolvimento ativo, e partes da linguagem e destes docs ainda podem mudar.',
      },
    ],
    port: [
      {
        title: 'No seu pipeline',
        text: 'Execute a cada pull request. Uma arquitetura que viola uma regra derruba o build antes de ser integrada.',
      },
      {
        title: 'Go SDK',
        text: 'Integre a validação no portal ou na plataforma de engenharia interna do seu time e confira a arquitetura ali mesmo, sem sair da ferramenta.',
      },
      {
        title: 'JS SDK',
        text: 'Valide no navegador, sem servidor. Exemplo: um editor de diagramas, em que a pessoa desenha no canvas e o ASL confere a arquitetura ao vivo.',
      },
      {
        title: 'Python SDK',
        text: 'Execute as mesmas checagens em scripts e notebooks, junto das suas ferramentas de dados e IA.',
      },
      {
        title: 'No VS Code',
        text: 'Veja a arquitetura num painel lateral e a política violada na linha que a causa, enquanto o seu agente escreve.',
      },
    ],
    ctaTitle: 'Dê à sua arquitetura *uma linguagem.*',
    ctaText:
      'Escreva a regra uma vez. Todo design é conferido antes de alguém escrever código.',
    ctaGithub: 'Ver no GitHub',
  },
};

const MANIFEST = `apiVersion: asl/v1
kind: Application
metadata:
  name: billing-service
  annotations:
    description: Charges customers and issues invoices.
spec:
  providers:
    aws: EKS
  language: Go
---
apiVersion: asl/v1
kind: Application
metadata:
  name: subscription-service
  annotations:
    description: Manages plans, renewals and cancellations.
spec:
  providers:
    aws: EKS
  language: Go
---
apiVersion: asl/v1
kind: Database
metadata:
  name: billing-db
  annotations:
    description: Invoices and payment records.
spec:
  providers:
    aws: RDSPostgreSQL
---
apiVersion: asl/v1
kind: Relationship
metadata:
  name: billing-db-relations
spec:
  relations:
    - from:
        kind: Application
        name: billing-service
      to:
        kind: Database
        name: billing-db
      type: writes
    - from:
        kind: Application
        name: subscription-service
      to:
        kind: Database
        name: billing-db
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
  --> architecture/billing.asl.yaml:22
  policy: acme.single-writer

error: could not compile due to 1 previous error (19.1ms)`;


// Turns every "CEL" in a copy string into a link to cel.dev.
// *text* marks the accent-colored part of a section title.
function hl(text: string): ReactNode {
  return text.split('*').map((part, i) =>
    i % 2 ? (
      <span key={i} className={styles.accent}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// Text between backticks is shown as code.
function renderCode(text: string): ReactNode {
  return text
    .split('`')
    .map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

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


// Inline `code`, [links](/path) and CEL links inside a FAQ answer.
function rich(text: string): ReactNode {
  return text.split(/(\[[^\]]+\]\([^)]+\))/).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      return (
        <Link key={i} to={m[2]}>
          {m[1]}
        </Link>
      );
    }
    return <span key={i}>{renderCode(part)}</span>;
  });
}

function PortCards({ items }: { items: Item[] }): ReactNode {
  return (
    <div className={styles.portGrid}>
      {items.map((a, i) => {
        const Icon = [LuTerminal, SiGo, SiJavascript, SiPython, VscVscode][i];
        const brand = [
          styles.hueGreen,
          styles.brandGo,
          styles.brandJavascript,
          styles.brandPython,
          styles.brandVscode,
        ][i];
        return (
          <div key={a.title} className={styles.card}>
            <Icon className={`${styles.portIcon} ${brand}`} />
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </div>
        );
      })}
    </div>
  );
}


export default function Home(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const t = COPY[i18n.currentLocale] ?? COPY.en;

  return (
    <Layout description={t.sub}>
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={`container ${styles.heroCenter}`}>
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
              <Link className={styles.textLink} to="/playground">
                {t.cta2} <FiArrowRight />
              </Link>
            </div>
            <div className={styles.ideas}>
              {t.ideas.map((p, i) => {
                const Icon = [LuBraces, LuShieldCheck, LuPuzzle][i];
                return (
                  <div key={p.title} className={styles.idea}>
                    <Icon className={styles.ideaIcon} aria-hidden />
                    <strong>{p.title}</strong>
                    <span>{p.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <main>
          <section className={`${styles.section} ${styles.band} flowlight`}>
            <div className="container">
              <h2 className={styles.h2}>{hl(t.flowTitle)}</h2>
              <p className={styles.lead}>{t.flowIntro}</p>
              <div className={styles.flow}>
                <div className={styles.flowCol}>
                  <h3 className={styles.flowTitle}>
                    <span className={styles.flowN}>01</span>
                    {t.manifestTitle}
                  </h3>
                  <p className={styles.flowSub}>{t.manifestSub}</p>
                  <FocusLine line={33}>
                    <CodeBlock
                      language="yaml"
                      title="architecture/billing.asl.yaml"
                      metastring="showLineNumbers {39-52}"
                    >
                      {MANIFEST}
                    </CodeBlock>
                  </FocusLine>
                </div>
                <div className={styles.flowCol}>
                  <h3 className={styles.flowTitle}>
                    <span className={styles.flowN}>02</span>
                    {t.policyTitle}
                  </h3>
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
                <h3 className={styles.flowTitle}>
                  <span className={styles.flowN}>03</span>
                  {t.resultTitle}
                </h3>
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

          <section className={styles.section}>
            <div className={`container ${styles.agents}`}>
              <h2 className={styles.h2}>{hl(t.agentsTitle)}</h2>
              <p className={styles.lead}>{t.agentsText}</p>
              <Link
                className={styles.textLink}
                to="/docs/use-cases/designing"
              >
                {t.agentsLink} <FiArrowRight />
              </Link>
            </div>
          </section>

          <section className={`${styles.section} ${styles.band}`}>
            <div className={`container ${styles.faqWrap}`}>
              <h2 className={styles.h2}>{hl(t.faqTitle)}</h2>
              <div className={styles.faq}>
                {t.faq.map((f) => (
                  <details key={f.q} className={styles.faqItem}>
                    <summary className={styles.faqQ}>
                      <span>{f.q}</span>
                      <FiChevronDown aria-hidden />
                    </summary>
                    <div className={styles.faqA}>
                      <p>{rich(f.a)}</p>
                      {f.cards && <PortCards items={t.port} />}
                    </div>
                  </details>
                ))}
              </div>
              <p className={styles.faqMore}>
                <Link className={styles.textLink} to="/docs/faq">
                  {t.faqMore} <FiArrowRight />
                </Link>
              </p>
            </div>
          </section>

          <section className={styles.final}>
            <div className={`container ${styles.finalRow}`}>
              <div>
                <h2 className={styles.h2}>{hl(t.ctaTitle)}</h2>
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
      </div>
    </Layout>
  );
}
