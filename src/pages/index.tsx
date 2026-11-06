import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import UseCases from '@site/src/components/UseCases';
import {
  FiArrowDown,
  FiArrowRight,
  FiCheck,
  FiHelpCircle,
  FiX,
} from 'react-icons/fi';
import {
  LuTerminal,
  LuPlug,
  LuDollarSign,
  LuRepeat,
  LuLayers,
} from 'react-icons/lu';
import { SiGo, SiJavascript, SiKubernetes, SiPython } from 'react-icons/si';
import { VscFileCode, VscMarkdown, VscVscode } from 'react-icons/vsc';
import { FaGithub, FaPause, FaPlay } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import styles from './styles.module.css';

type Item = { title: string; text: string };

type Copy = {
  title: string;
  titleAccent: string;
  sub: string;
  cta1: string;
  cta2: string;
  diagramAlt: string;
  diagramPhase: string;
  reasoning: string;
  pauseLabel: string;
  playLabel: string;
  policyBroken: [string, string];
  agentSteps: string[];
  proof: { value: string; label: string }[];
  langTitle: string;
  langLead: string;
  vsMd: string;
  vsAsl: string;
  vsMdVerdict: string;
  vsAslVerdict: string;
  vsScenarioTag: string;
  vsScenario: string;
  vsMdTag: string;
  vsAslTag: string;
  vsTry: string;
  vsMdHead: string;
  vsAslHead: string;
  vsRows: { label: string; md: string; asl: string }[];
  harnessTitle: string;
  harnessLead: string;
  harnessBad: string;
  harnessGood: string;
  harness: { n: string; who: string; bad: string; good: string }[];
  hcTitle: string;
  flowTitle: string;
  flowIntro: string;
  flowExtend: {tag: string; text: string};
  manifestTitle: string;
  manifestSub: string;
  policyTitle: string;
  policySub: string;
  resultTitle: string;
  resultSub: string;
  portTitle: string;
  portSub: string;
  port: Item[];
  portMore: string;
  ctaTitle: string;
  ctaText: string;
  ctaGithub: string;
};

const COPY: Record<string, Copy> = {
  en: {
    title: 'The system design harness',
    titleAccent: 'for your agents.',
    sub: 'Agents ship code faster than anyone can review the design. ASL is a language for representing system design: references, contracts and your own rules are checked on every change, with no model call.',
    cta1: 'Get started',
    cta2: 'See how it works',
    diagramPhase: 'System design time, before any coding',
    reasoning: 'reasoning',
    pauseLabel: 'Pause animation',
    playLabel: 'Play animation',
    policyBroken: ['single-writer', 'policy violated'],
    agentSteps: [
      'Agent starts a new design',
      'Agent defines credit-service',
      'Agent defines credit-db',
      'Agent links billing-service to credit-db',
      'Agent runs the CLI',
      'Compiler rejects the design',
      'Agent fixes the design',
      'Design approved',
    ],
    diagramAlt:
      'Architecture diagram: credit-service and billing-service both write to credit-db, and the compiler flags the second writer.',
    proof: [
      { value: '0', label: 'tokens to validate' },
      { value: '100%', label: 'Deterministic' },
      {
        value: 'Declarative',
        label: 'Describe it in YAML, like in Kubernetes',
      },
      { value: 'Extensible', label: 'Your own schemas and policies' },
      { value: 'Portable', label: 'CLI, Go, browser, Python and VS Code' },
    ],
    langTitle: 'Markdown describes. *A language can be checked deterministically.*',
    langLead:
      'An agent can review an architecture written in Markdown, and a skill can teach it how. But every review reads every file, costs tokens, depends on the session, and a violated policy can read as perfectly fine. ASL is a structured way to represent architecture: typed elements and relationships instead of free text, so references have to resolve and rules have to hold, and the compiler gives the same verdict at no cost.',
    vsMd: 'Markdown',
    vsAsl: 'ASL',
    vsScenarioTag: 'The example',
    vsScenario:
      'In both versions, `inventory-service` writes to `stock-db`, a database that was renamed `inventory-db`. Who notices?',
    vsMdTag: 'May be missed.',
    vsMdVerdict:
      'Even with a rule for this exact case, an agent has to read all three files on every review.',
    vsTry: 'Try it in the playground',
    vsAslTag: 'Caught.',
    vsAslVerdict:
      'The compiler reports that `stock-db` does not exist, before anyone writes code.',
    vsMdHead: 'Markdown, reviewed by a skill or agent',
    vsAslHead: 'ASL, checked by the compiler',
    vsRows: [
      {
        label: 'How the architecture is represented',
        md: 'Free text to interpret',
        asl: 'Typed elements and relationships',
      },
      {
        label: 'Cost and repeatability',
        md: 'Tokens on every review, and the verdict can change between runs',
        asl: 'No LLM use, and the same input gives the same verdict',
      },
      {
        label: "Your own company's policies",
        md: 'An agent can overlook or misread a rule. A skill can run in CI, but its verdict varies.',
        asl: 'Rules written once as policies and enforced on every run.',
      },
    ],
    harnessTitle: 'Agents pay to interpret your architecture. *Every time.*',
    harnessLead:
      'A diagram was made for people. ASL, used as Architecture as Code, is made for agents: context to read, guardrails to respect and feedback to correct.',
    harnessBad: 'The problem',
    harnessGood: 'How ASL solves it',
    harness: [
      {
        n: '01',
        who: 'Context',
        bad: 'A draw.io file is XML full of coordinates and generated ids, and every arrow is left open to interpretation. The agent pays to recover a graph that was never stored as one.',
        good: 'With ASL, the agent reads the architecture as typed data. No decoding, no guessing what an arrow means.',
      },
      {
        n: '02',
        who: 'Guardrails',
        bad: 'The rule lives in a wiki, and interpretation is probabilistic: two sessions read the same diagram and build two different systems.',
        good: 'Your rules become ASL policies the change must satisfy: ownership, allowed dependencies, naming, anything CEL can say.',
      },
      {
        n: '03',
        who: 'Feedback',
        bad: 'Nothing tells the agent it is wrong. Dangling dependencies and broken contracts surface in production, not in the prompt.',
        good: 'ASL compiles the change and returns a few lines of diagnostics. The agent fixes it on its own.',
      },
    ],
    hcTitle:
      'Check what an architecture harness looks like *in real use cases:*',
    flowTitle: 'What counts as an antipattern is *up to you.*',
    flowIntro:
      'Several applications writing to the same database is fine in some companies and a mistake in yours. Write that rule once, and every architecture an agent proposes is checked against it, before anyone writes code.',
    flowExtend: {
      tag: 'Extensible by design',
      text: 'Policies and schemas are yours to extend. Add your company rules without recompiling the ASL kernel.',
    },
    manifestTitle: 'The agent proposes',
    manifestSub:
      'billing-service needs to record credit data, and writing straight to credit-db is the fastest way to ship the feature.',
    policyTitle: 'Your context says no',
    policySub:
      'A CustomPolicy, versioned with the code: a database has a single writer.',
    resultTitle: 'The compiler answers',
    resultSub:
      'No model call. The agent reads four lines, gives billing-service its own data store and runs it again.',
    portTitle: 'One compiler. *Use it wherever you work.*',
    portSub:
      'The same checks and the same verdict in your pipeline, your tools, your editor, your browser and your scripts.',
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
    portMore: 'Learn more: SDKs',
    ctaTitle: 'Give your agents *an architecture they can read.*',
    ctaText:
      'Write the rule once. Every system design is checked before anyone writes code.',
    ctaGithub: 'View on GitHub',
  },
  pt: {
    title: 'O harness de system design',
    titleAccent: 'para seus agentes.',
    sub: 'Agentes escrevem código mais rápido do que qualquer pessoa consegue revisar o design. O ASL é uma linguagem para representar system design: referências, contratos e as regras da sua empresa são checados a cada mudança, sem chamar um modelo.',
    cta1: 'Começar',
    cta2: 'Ver como funciona',
    diagramPhase: 'Hora do system design, antes de codar',
    reasoning: 'raciocinando',
    pauseLabel: 'Pausar animação',
    playLabel: 'Retomar animação',
    policyBroken: ['single-writer', 'policy infringida'],
    agentSteps: [
      'Agente começa um novo design',
      'Agente define o credit-service',
      'Agente define o credit-db',
      'Agente liga o billing-service ao credit-db',
      'Agente roda o CLI',
      'Compilador rejeita o design',
      'Agente corrige o design',
      'Design aprovado',
    ],
    diagramAlt:
      'Diagrama de arquitetura: credit-service e billing-service gravam no credit-db, e o compilador aponta o segundo escritor.',
    proof: [
      { value: '0', label: 'tokens para validar' },
      { value: '100%', label: 'Determinístico' },
      { value: 'Declarativo', label: 'Descreva em YAML, como no Kubernetes' },
      { value: 'Extensível', label: 'Com os seus próprios schemas e policies' },
      { value: 'Portátil', label: 'CLI, Go, navegador, Python e VS Code' },
    ],
    langTitle: 'Markdown apenas descreve. *Uma linguagem pode ser verificada, sempre com o mesmo resultado.*',
    langLead:
      'Um agente consegue revisar uma arquitetura escrita em Markdown, e uma skill pode ensiná-lo a fazer isso. Mas cada revisão lê todos os arquivos, gasta tokens, varia de uma sessão para outra, e uma policy violada pode passar despercebida. O ASL representa a arquitetura de forma estruturada, com elementos e relacionamentos tipados em vez de texto livre. Assim, toda referência precisa apontar para algo que existe, toda regra é aplicada, e o compilador dá sempre o mesmo resultado, sem gastar tokens.',
    vsMd: 'Markdown',
    vsAsl: 'ASL',
    vsScenarioTag: 'O exemplo',
    vsScenario:
      'Nas duas versões, o `inventory-service` grava no `stock-db`, um banco que foi renomeado para `inventory-db`. Quem percebe?',
    vsMdTag: 'Pode passar.',
    vsMdVerdict:
      'Mesmo com uma regra para esse caso, o agente precisa reler os três arquivos a cada revisão.',
    vsTry: 'Teste no playground',
    vsAslTag: 'Detectado.',
    vsAslVerdict:
      'O compilador aponta que o `stock-db` não existe, antes de começar a desenvolver.',
    vsMdHead: 'Markdown, revisado por uma skill ou agente',
    vsAslHead: 'ASL, conferido pelo compilador',
    vsRows: [
      {
        label: 'Como a arquitetura é representada',
        md: 'Texto livre para interpretar',
        asl: 'Elementos e relacionamentos tipados',
      },
      {
        label: 'Custo e repetibilidade',
        md: 'Tokens a cada revisão, e o resultado pode mudar entre execuções',
        asl: 'Sem uso de LLM, e a mesma entrada dá o mesmo resultado',
      },
      {
        label: 'As políticas de arquitetura da sua empresa',
        md: 'O agente pode ignorar ou interpretar mal uma regra. Uma skill pode rodar no CI, mas o resultado varia.',
        asl: 'Regras escritas uma vez como políticas de arquitetura e aplicadas a cada execução.',
      },
    ],
    harnessTitle:
      'Seus agentes pagam para interpretar a arquitetura. *Toda vez.*',
    harnessLead:
      'Um diagrama foi feito para pessoas. O ASL, usado como Arquitetura como Código, foi feito para agentes: contexto para ler, guardrails para respeitar e feedback para corrigir.',
    harnessBad: 'O problema',
    harnessGood: 'Como o ASL resolve',
    harness: [
      {
        n: '01',
        who: 'Contexto',
        bad: 'Um arquivo draw.io é XML cheio de coordenadas e ids gerados, e cada seta fica aberta a interpretação. O agente paga para reconstruir um grafo que nunca foi guardado como grafo.',
        good: 'Com o ASL, o agente lê a arquitetura como dado tipado. Sem decifrar desenho, sem alucinar o que uma seta quer dizer.',
      },
      {
        n: '02',
        who: 'Guardrails',
        bad: 'A regra mora numa wiki, e a interpretação é probabilística: duas sessões leem o mesmo diagrama e constroem dois sistemas diferentes.',
        good: 'Suas regras viram policies do ASL que toda mudança precisa cumprir: ownership, dependências permitidas, nomenclatura, tudo que o CEL consegue expressar.',
      },
      {
        n: '03',
        who: 'Feedback',
        bad: 'Nada avisa o agente de que ele errou. Dependências soltas e contratos quebrados só aparecem em produção, nunca no prompt.',
        good: 'O ASL compila a mudança e devolve poucas linhas de diagnóstico. O agente corrige sozinho.',
      },
    ],
    hcTitle: 'Veja como é um harness de arquitetura *em casos de uso reais:*',
    flowTitle: 'Você define o que é antipadrão *no seu contexto.*',
    flowIntro:
      'Várias aplicações escrevendo no mesmo banco de dados pode ser aceitável em uma empresa e um erro na sua. Escreva essa regra uma única vez e toda arquitetura proposta por um agente será verificada contra ela, antes de qualquer linha de código.',
    flowExtend: {
      tag: 'Extensível por design',
      text: 'Policies e schemas são seus para estender. Adicione as regras da sua empresa sem recompilar o kernel do ASL.',
    },
    manifestTitle: 'O agente propõe',
    manifestSub:
      'O billing-service precisa registrar dados de crédito, e gravar direto no credit-db é o caminho mais rápido para entregar a funcionalidade.',
    policyTitle: 'Seu contexto proíbe',
    policySub:
      'Uma CustomPolicy, versionada com o código: um banco de dados tem um único escritor.',
    resultTitle: 'O compilador responde',
    resultSub:
      'Sem chamada a modelo nenhum. O agente lê poucas linhas, dá ao billing-service um banco só dele e roda de novo.',
    portTitle: 'Um único compilador. *Leve para onde o seu time já trabalha.*',
    portSub:
      'As mesmas checagens e o mesmo resultado no seu pipeline, nas suas ferramentas, no editor, no navegador e nos seus scripts.',
    port: [
      {
        title: 'No seu pipeline',
        text: 'Rode a cada pull request. Uma arquitetura que viola uma regra derruba o build antes de ser integrada.',
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
        text: 'Rode as mesmas checagens em scripts e notebooks, junto das suas ferramentas de dados e IA.',
      },
      {
        title: 'No VS Code',
        text: 'Veja a arquitetura num painel lateral e a política violada na linha que a causa, enquanto o seu agente escreve.',
      },
    ],
    portMore: 'Conheça mais: SDKs',
    ctaTitle: 'Dê aos seus agentes *uma arquitetura que eles consigam ler.*',
    ctaText:
      'Escreva a regra uma vez. Todo system design é conferido antes de alguém escrever código.',
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

const VS_MD = [
  {
    title: '.claude/skills/architecture-review/SKILL.md',
    text: `---
name: architecture-review
description: Review the architecture docs for consistency
---
# Architecture review

Read every file under docs/. Then check that:

1. Every service has an owner.
2. Every name in a data flow is listed under Components.
3. Each database has a single writer.
4. Every event has a producer and a consumer.

Report each problem with the file and the line.

...

A real company has many more architecture policies than these four. As the list grows, Markdown may not be enough to keep them all checked.`,
  },
  {
    title: 'docs/checkout.md',
    text: `# Checkout context

## Components

- **checkout-service**: Go on EKS. Owner: team-checkout.
  Takes the cart, charges the customer and publishes an event for each order placed.
  - HTTPS API \`checkout-api\` (sync, ingress)
- **orders-db**: PostgreSQL on RDS. Owner: team-checkout.
  Orders, their items and their payment status.
- **order-events**: MSK topic, Avro.
  One event per order placed.

## Data flow

| From             | To           | How      |
| ---------------- | ------------ | -------- |
| checkout-service | order-events | produces |
| checkout-service | orders-db    | writes   |`,
  },
  {
    title: 'docs/inventory.md',
    text: `# Inventory context

## Components

- **inventory-service**: Go on EKS. Owner: team-catalog.
  Reserves stock for each order placed and keeps the available quantity per product.
  - gRPC API \`stock-api\` (sync, ingress)
- **inventory-db**: PostgreSQL on RDS. Owner: team-catalog.
  Available quantity and reservations per product.

## Data flow

| From              | To           | How      |
| ----------------- | ------------ | -------- |
| inventory-service | order-events | consumes |
| inventory-service | stock-db     | writes   |`,
  },
];

const VS_ASL = [
  {
    title: 'architecture/checkout.asl.yaml',
    text: `apiVersion: asl/v1
kind: Application
metadata:
  name: checkout-service
  description: Takes the cart, charges the customer and publishes an event for each order placed
  labels:
    owner: team-checkout
spec:
  providers:
    aws: EKS
  language: Go
  interfaces:
    - name: checkout-api
      protocol: HTTPS
      type: sync
      flow: ingress
---
apiVersion: asl/v1
kind: Database
metadata:
  name: orders-db
  description: Orders, their items and their payment status
  labels:
    owner: team-checkout
spec:
  providers:
    aws: RDSPostgreSQL
---
apiVersion: asl/v1
kind: Topic
metadata:
  name: order-events
  description: One event per order placed
spec:
  providers:
    aws: MSK
  messageFormat: Avro
---
apiVersion: asl/v1
kind: Relationship
metadata:
  name: checkout-relations
spec:
  relations:
    - from:
        kind: Application
        name: checkout-service
      to:
        kind: Topic
        name: order-events
      type: produces
    - from:
        kind: Application
        name: checkout-service
      to:
        kind: Database
        name: orders-db
      type: writes`,
  },
  {
    title: 'architecture/inventory.asl.yaml',
    text: `apiVersion: asl/v1
kind: Application
metadata:
  name: inventory-service
  description: Reserves stock for each order placed and keeps the available quantity per product
  labels:
    owner: team-catalog
spec:
  providers:
    aws: EKS
  language: Go
  interfaces:
    - name: stock-api
      protocol: GRPC
      type: sync
      flow: ingress
---
apiVersion: asl/v1
kind: Database
metadata:
  name: inventory-db
  description: Available quantity and reservations per product
  labels:
    owner: team-catalog
spec:
  providers:
    aws: RDSPostgreSQL
---
apiVersion: asl/v1
kind: Relationship
metadata:
  name: inventory-relations
spec:
  relations:
    - from:
        kind: Application
        name: inventory-service
      to:
        kind: Topic
        name: order-events
      type: consumes
    - from:
        kind: Application
        name: inventory-service
      to:
        kind: Database
        name: stock-db
      type: writes`,
  },
];

// the drawing is cropped to y 16..336 to keep the window short
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

// Hero illustration: an agent designs the example explained further down.
// It adds a second writer to credit-db, runs the CLI, gets the compiler error
// (real output of the real compiler), gives billing-service its own database
// and runs it again. Steps loop; reduced motion freezes on the error.
// step 5 is the compiler error: it stays longer so it can be read
const STEP_MS = [1500, 1700, 1700, 2000, 1700, 3800, 2500, 3400];
const AGENT = 'Architect Agent';

// where the agent's focus ring is at each step: a node of the drawing (x, y in
// drawing units) or the terminal. Step 0 is the blank canvas: the ring rests on
// credit-service, hidden, so it fades in already in place.
const FOCUS: ([number, number] | 'term')[] = [
  [22, 34],
  [22, 34],
  [340, 138],
  [22, 242],
  'term',
  'term',
  [340, 242],
  'term',
];

// the drawing is cropped to y 16..336 to keep the window short
const VIEW_TOP = 16;

// "writes" sits on the arrow with its own background, so the dashes never cross the text
function EdgeLabel({
  x,
  y,
  className = '',
}: {
  x: number;
  y: number;
  className?: string;
}): ReactNode {
  return (
    <g className={className}>
      <rect
        x={x - 27}
        y={y - 10}
        width="54"
        height="20"
        rx="10"
        className={styles.edgeLabelBg}
      />
      <text x={x} y={y + 4} textAnchor="middle" className={styles.edgeLabel}>
        writes
      </text>
    </g>
  );
}

function ArchDiagram({
  alt,
  phase,
  steps,
  policyBroken,
  reasoning,
  pauseLabel,
  playLabel,
}: {
  alt: string;
  phase: string;
  steps: string[];
  policyBroken: [string, string];
  reasoning: string;
  pauseLabel: string;
  playLabel: string;
}): ReactNode {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  // on phones the drawing is scaled down to ~60%, so its labels are drawn bigger
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 520px)');
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(5);
      setPlaying(false);
    }
  }, []);
  // while playing, each step schedules the next one; pausing clears it, and
  // clicking a step jumps there and keeps the current play/pause state
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(
      () => setStep((n) => (n + 1) % STEP_MS.length),
      STEP_MS[step],
    );
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  // s counts from the first drawn edge; -1 is credit-service alone, -2 the empty canvas
  const s = step - 2;
  const flagged = s === 3;
  const billingEdge = s >= 1 && s < 4;
  const agent = AGENT;
  const k = compact ? 1.7 : 1;
  const [line1, line2] = policyBroken;
  // one line on desktop, two stacked lines on phones (placed under credit-db)
  const badgeLines = compact ? [line1, line2] : [`${line1} ${line2}`];
  const badgeW = (22 + Math.max(...badgeLines.map((l) => l.length)) * 6.1) * k;
  const badgeH = compact ? 2 * 18 * k * 0.62 + 12 : 20;
  const target = FOCUS[step];

  // the ring is one element for the whole window, so it can travel from the
  // drawing to the terminal; geometry is measured to follow the layout
  const workRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState({ scale: 0, w: 0, termTop: 0, termH: 0 });
  useEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const term = termRef.current;
      if (!stage || !term) return;
      setGeo({
        scale: stage.clientWidth / 560,
        w: stage.clientWidth,
        termTop: term.offsetTop,
        termH: term.offsetHeight,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (workRef.current) ro.observe(workRef.current);
    return () => ro.disconnect();
  }, []);
  const ring =
    target === 'term'
      ? {
          left: 6,
          top: geo.termTop + 6,
          width: geo.w - 12,
          height: geo.termH - 12,
          borderRadius: 4,
        }
      : {
          left: target[0] * geo.scale,
          top: (target[1] - VIEW_TOP) * geo.scale,
          width: 198 * geo.scale,
          height: 84 * geo.scale,
        };
  const show = (on: boolean) => (on ? styles.on : styles.off);
  const edgeBilling = flagged ? styles.edgeFlag : styles.edgeIdle;

  return (
    <div className={styles.diagram}>
      <div className={styles.ideTitle} aria-hidden>
        <span className={styles.ideDots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.ideName}>
          <span className={styles.ideLong}>
            credit.asl.yaml — architecture — Visual Studio Code
          </span>
          <span className={styles.ideShort}>credit.asl.yaml — VS Code</span>
        </span>
      </div>
      <div className={styles.diagramBar} aria-hidden>
        <span className={styles.tab}>
          <VscFileCode />
          credit.asl.yaml
        </span>
        <span
          className={`${styles.agentChip} ${s === 3 ? styles.chipErr : s === 5 ? styles.chipOk : ''}`}
        >
          <i
            className={s === 3 ? styles.dotErr : s === 5 ? styles.dotOk : ''}
          />
          <span>{steps[step]}</span>
        </span>
      </div>
      <div className={styles.phase}>
        <span>{phase}</span>
        <span className={styles.controls}>
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? pauseLabel : playLabel}
            title={playing ? pauseLabel : playLabel}
          >
            {playing ? (
              <FaPause aria-hidden />
            ) : (
              <FaPlay aria-hidden className={styles.playIcon} />
            )}
          </button>
          <span className={styles.pips}>
            {steps.map((label, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.pip} ${i <= step ? styles.pipOn : ''} ${i === step ? styles.pipCur : ''}`}
                onClick={() => setStep(i)}
                aria-label={label}
                aria-current={i === step ? 'step' : undefined}
                title={label}
              />
            ))}
          </span>
        </span>
      </div>
      <div className={styles.work} ref={workRef}>
        <div className={styles.stage} ref={stageRef}>
          <svg
            className={styles.diagramSvg}
            viewBox="0 16 560 320"
            role="img"
            aria-label={alt}
          >
            <defs>
              {[
                ['ok', styles.arrowOk],
                ['flag', styles.arrowFlag],
                ['idle', styles.arrowIdle],
              ].map(([id, cls]) => (
                <marker
                  key={id}
                  id={`arrow-${id}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0 0 L10 5 L0 10 z" className={cls} />
                </marker>
              ))}
            </defs>

            <path
              d="M214 76 C 290 76, 290 160, 346 160"
              className={`${styles.edge} ${styles.edgeOk} ${show(s >= 0)}`}
              markerEnd="url(#arrow-ok)"
            />
            <EdgeLabel x={288} y={118} className={show(s >= 0)} />

            <path
              d="M214 284 C 290 284, 290 200, 346 200"
              className={`${styles.edge} ${edgeBilling} ${show(billingEdge)}`}
              markerEnd={`url(#arrow-${flagged ? 'flag' : 'idle'})`}
            />
            <path
              d="M214 284 L346 284"
              className={`${styles.edge} ${styles.edgeOk} ${show(s >= 4)}`}
              markerEnd="url(#arrow-ok)"
            />
            <EdgeLabel x={288} y={242} className={show(s >= 1 && s < 4)} />
            <EdgeLabel x={280} y={284} className={show(s >= 4)} />

            <g transform="translate(28 40)" className={show(s >= -1)}>
              <rect width="186" height="72" rx="12" className={styles.node} />
              <text x="18" y="30" className={styles.nodeKind}>
                Application
              </text>
              <text x="18" y="52" className={styles.nodeName}>
                credit-service
              </text>
            </g>
            <g transform="translate(28 248)" className={show(s >= 1)}>
              <rect
                width="186"
                height="72"
                rx="12"
                className={flagged ? styles.nodeFlag : styles.node}
              />
              <text x="18" y="30" className={styles.nodeKind}>
                Application
              </text>
              <text x="18" y="52" className={styles.nodeName}>
                billing-service
              </text>
            </g>
            <g transform="translate(346 144)" className={show(s >= 0)}>
              <rect width="186" height="72" rx="12" className={styles.nodeDb} />
              <text x="18" y="30" className={styles.nodeKind}>
                Database
              </text>
              <text x="18" y="52" className={styles.nodeName}>
                credit-db
              </text>
            </g>
            <g transform="translate(346 248)" className={show(s >= 4)}>
              <rect width="186" height="72" rx="12" className={styles.nodeDb} />
              <text x="18" y="30" className={styles.nodeKind}>
                Database
              </text>
              <text x="18" y="52" className={styles.nodeName}>
                billing-db
              </text>
            </g>

            <g
              transform={`translate(${439 - badgeW / 2} ${compact ? 224 : 206})`}
              className={show(flagged)}
            >
              <rect
                width={badgeW}
                height={badgeH}
                rx={compact ? 12 : 10}
                className={styles.badge}
              />
              {badgeLines.map((l, i) => (
                <text
                  key={l}
                  x={badgeW / 2}
                  y={compact ? 20 + i * 20 : 14}
                  textAnchor="middle"
                  className={styles.badgeText}
                  style={{ fontSize: compact ? 15 : 10 }}
                >
                  {l}
                </text>
              ))}
            </g>
          </svg>
        </div>
        <div className={styles.term} ref={termRef}>
          <div className={styles.termBar} aria-hidden>
            <span className={styles.termTab}>Terminal</span>
            <span>zsh</span>
          </div>
          <pre className={styles.verdict} aria-hidden>
            <span className={s >= 2 ? styles.vPrompt : styles.vHide}>
              $ asl ./architecture
            </span>
            <span className={s === 3 || s === 4 ? styles.vErr : styles.vHide}>
              error: Only one application may write to database
            </span>
            <span className={s === 3 || s === 4 ? styles.vDim : styles.vHide}>
              {
                '  --> architecture/credit.asl.yaml:18\n  policy: acme.single-writer'
              }
            </span>
            <span className={s === 5 ? styles.vOk : styles.vHide}>
              ok 8.8ms
            </span>
          </pre>
        </div>
        <div
          className={`${styles.ring} ${show(step !== 0)}`}
          style={ring}
          aria-hidden
        >
          <span>
            {agent}
            {s === 3 && <em className={styles.thinking}> · {reasoning}</em>}
          </span>
        </div>
      </div>
    </div>
  );
}

function Cards({
  items,
  bad,
  good,
}: {
  items: { n: string; who: string; bad: string; good: string }[];
  bad: string;
  good: string;
}): ReactNode {
  return (
    <ol className={styles.hCards}>
      {items.map((r) => (
        <li key={r.n} className={styles.hCard}>
          <div className={styles.stepHead}>
            <span className={styles.stepN}>{r.n}</span>
            <h3 className={styles.stepTitle}>{r.who}</h3>
          </div>
          <div className={styles.hProblem}>
            <small className={styles.hTagBad}>
              <FiX aria-hidden />
              <span className={styles.srOnly}>{bad}</span>
            </small>
            <p>{r.bad}</p>
          </div>
          <div className={styles.hAnswer}>
            <span className={styles.hArrow} aria-hidden>
              <FiArrowDown />
            </span>
            <small className={styles.hTagGood}>
              <FiCheck aria-hidden />
              <span className={styles.srOnly}>{good}</span>
            </small>
            <p>{withCel(r.good)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// Editor-style tabs: every panel shares one grid cell, so the height of the
// tallest file is reserved and switching tabs never moves the page. `mark`
// opens the first file that contains it and highlights those lines in red.
function FileTabs({
  id,
  label,
  accent,
  files,
  language,
  Icon,
  mark,
}: {
  id: string;
  label: string;
  accent?: boolean;
  files: { title: string; text: string }[];
  language: string;
  Icon: IconType;
  mark: string;
}): ReactNode {
  const first = files.findIndex((f) => f.text.includes(mark));
  const [active, setActive] = useState(Math.max(first, 0));
  const panels = useRef<HTMLDivElement>(null);
  const marked = (text: string) =>
    text
      .split('\n')
      .flatMap((l, i) => (l.includes(mark) ? [i + 1] : []))
      .join(',');
  // Bring the marked line into view inside the panel, never the page.
  useEffect(() => {
    const box = panels.current;
    if (!box) return;
    const line = box.querySelector<HTMLElement>(
      `#${id}-panel-${active} .theme-code-block-highlighted-line`,
    );
    box.scrollTop = line
      ? line.getBoundingClientRect().top -
        box.getBoundingClientRect().top +
        box.scrollTop -
        box.clientHeight / 3
      : 0;
  }, [active, id]);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + files.length) % files.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };
  return (
    <div
      className={`${styles.fileTabs} ${accent ? styles.fileTabsAccent : ''}`}
    >
      <div className={styles.fileTabLabel}>{label}</div>
      <div className={styles.fileTabBar} role="tablist">
        {files.map((f, i) => (
          <button
            key={f.title}
            id={`${id}-tab-${i}`}
            type="button"
            role="tab"
            title={f.title}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className={`${styles.fileTab} ${i === active ? styles.fileTabActive : ''}`}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
          >
            <Icon aria-hidden />
            {f.title.split('/').pop()}
          </button>
        ))}
      </div>
      <div className={styles.fileTabPath}>{files[active].title}</div>
      <div className={styles.fileTabPanels} ref={panels}>
        {files.map((f, i) => (
          <div
            key={f.title}
            id={`${id}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${i}`}
            className={`${styles.fileTabPanel} ${i === active ? '' : styles.fileTabPanelOff}`}
          >
            <CodeBlock
              language={language}
              metastring={marked(f.text) ? `{${marked(f.text)}}` : undefined}
            >
              {f.text}
            </CodeBlock>
          </div>
        ))}
      </div>
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
          <div className="container">
            <div className={styles.heroGrid}>
              <div>
                <h1 className={styles.h1}>
                  {t.title}{' '}
                  <span className={styles.accent}>{t.titleAccent}</span>
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
              <ArchDiagram
                alt={t.diagramAlt}
                phase={t.diagramPhase}
                steps={t.agentSteps}
                policyBroken={t.policyBroken}
                reasoning={t.reasoning}
                pauseLabel={t.pauseLabel}
                playLabel={t.playLabel}
              />
            </div>
            <div className={styles.proof}>
              {t.proof.map((p, i) => {
                const Icon = [
                  LuDollarSign,
                  LuRepeat,
                  SiKubernetes,
                  LuPlug,
                  LuLayers,
                ][i];
                const brand = [
                  styles.hueGreen,
                  styles.hueViolet,
                  styles.brandKubernetes,
                  styles.hueOrange,
                  styles.hueCyan,
                ][i];
                return (
                  <div key={p.label} className={styles.stat}>
                    <Icon
                      className={`${styles.statIcon} ${brand}`}
                      aria-hidden
                    />
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
              <h2 className={styles.h2}>{hl(t.langTitle)}</h2>
              <p className={styles.lead}>{t.langLead}</p>
              <p className={`${styles.extend} ${styles.vsScenario}`}>
                <span className={styles.extendTag}>{t.vsScenarioTag}</span>
                <span>{renderCode(t.vsScenario)}</span>
              </p>
              <div className={styles.vs}>
                <div className={styles.vsPane}>
                  <FileTabs
                    id="vs-md"
                    label={t.vsMd}
                    files={VS_MD}
                    language="text"
                    Icon={VscMarkdown}
                    mark="stock-db"
                  />
                  <p className={`${styles.vsVerdict} ${styles.vsOk}`}>
                    <FiHelpCircle aria-hidden />
                    <span>
                      <strong>{t.vsMdTag}</strong> {renderCode(t.vsMdVerdict)}
                    </span>
                  </p>
                </div>
                <div className={styles.vsPane}>
                  <FileTabs
                    id="vs-asl"
                    label={t.vsAsl}
                    accent
                    files={VS_ASL}
                    language="yaml"
                    Icon={VscFileCode}
                    mark="stock-db"
                  />
                  <p className={`${styles.vsVerdict} ${styles.vsCaught}`}>
                    <FiCheck aria-hidden />
                    <span>
                      <strong>{t.vsAslTag}</strong> {renderCode(t.vsAslVerdict)}
                    </span>
                  </p>
                </div>
              </div>
              <p className={styles.vsTry}>
                <Link className={styles.textLink} to="/playground">
                  {t.vsTry} <FiArrowRight />
                </Link>
              </p>
              <div className={styles.vsTable} role="table">
                <div className={`${styles.vsRow} ${styles.vsHead}`} role="row">
                  <span role="columnheader" />
                  <span role="columnheader">{t.vsMdHead}</span>
                  <span
                    role="columnheader"
                    className={`${styles.vsCell} ${styles.vsColAsl}`}
                  >
                    {t.vsAslHead}
                  </span>
                </div>
                {t.vsRows.map((r) => (
                  <div key={r.label} className={styles.vsRow} role="row">
                    <span role="rowheader" className={styles.vsLabelCell}>
                      {r.label}
                    </span>
                    <span
                      role="cell"
                      className={styles.vsCell}
                      data-label={t.vsMd}
                    >
                      <FiX className={styles.vsIconBad} aria-hidden />
                      <span>{r.md}</span>
                    </span>
                    <span
                      role="cell"
                      className={`${styles.vsCell} ${styles.vsColAsl}`}
                      data-label={t.vsAsl}
                    >
                      <FiCheck className={styles.vsIconGood} aria-hidden />
                      <span>{r.asl}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={`${styles.section} ${styles.band}`}>
            <div className="container">
              <h2 className={styles.h2}>{hl(t.harnessTitle)}</h2>
              <p className={styles.lead}>{t.harnessLead}</p>
              <Cards items={t.harness} bad={t.harnessBad} good={t.harnessGood} />
            </div>
          </section>

          <section className={styles.section}>
            <div className="container">
              <h2 className={styles.h2}>{hl(t.hcTitle)}</h2>
              <UseCases locale={i18n.currentLocale === 'pt' ? 'pt' : 'en'} />
            </div>
          </section>

          <section className={`${styles.section} ${styles.band} flowlight`}>
            <div className="container">
              <h2 className={styles.h2}>{hl(t.flowTitle)}</h2>
              <p className={styles.lead}>{t.flowIntro}</p>
              <p className={styles.extend}>
                <span className={styles.extendTag}>{t.flowExtend.tag}</span>
                {t.flowExtend.text}
              </p>
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

          <section className={styles.section}>
            <div className="container">
              <h2 className={styles.h2}>{hl(t.portTitle)}</h2>
              <p className={styles.lead}>{t.portSub}</p>
              <div className={styles.portGrid}>
                {t.port.map((a, i) => {
                  const Icon = [
                    LuTerminal,
                    SiGo,
                    SiJavascript,
                    SiPython,
                    VscVscode,
                  ][i];
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
              <p className={styles.portMore}>
                <Link className={styles.textLink} to="/docs/javascript">
                  {t.portMore} <FiArrowRight />
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
