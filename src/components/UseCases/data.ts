// Copy for the home "use cases" demos (English and pt-BR). File names, check
// names, policy ids and compiler messages stay in English in both locales.
//
// Real (run with `asl` built from source on a "payments" example for a regulated company,
// with the policies acme.pci-scope-is-declared, acme.pci-only-from-pci,
// acme.pci-scope-needs-approval and acme.write-only-own-database):
//   payments baseline ........ ok 7.4ms (2.6 KB of YAML)
//   spend-insights ............. error at architecture/payments.asl.yaml:51, ok after the fix
//   cancellation-service ....... error at architecture/cancellation.asl.yaml:1, ok 8.2ms after the fix
//   serverless proposal ........ 3 errors (architecture/proposal.asl.yaml:1, :10 and :19) with platform.only-eks, ok after the fix
// Real (run on the "shop" example, with acme.no-shared-database):
//   loyalty-service .......... error at architecture/shop.asl.yaml:34, ok 6.9ms after the fix
// Real (kyverno 1.17 `apply`): disallow-latest-tag passes for loyalty-service, and the
// policy asl-declared-applications denies loyalty-worker.
// Proposal (does not exist yet): asl-declared-applications reading the Applications
// declared in ASL through a ConfigMap. Its Kyverno output is real, the bridge is not.
// Illustrative: the agent's answers and the later incidents; the draw.io excerpt and
// the "several KB of XML" estimate; the PCI scope in the old network diagram.

export type Locale = 'en' | 'pt';

export type CaseCopy = {
  tab: string;
  medium: string;
  /** The scenario in three layers: context, what the agent does, what ASL changes. */
  story: {context: string; action: string; asl: string};
  /** SDLC stages (indexes into Copy.stages) this case acts on. */
  sdlc: number[];
};

export type Copy = {
  title: string;
  prev: string;
  next: string;
  scenario: string;
  /** Labels of the three steps of the scenario timeline: context, agent, ASL. */
  scenarioSteps: [string, string, string];
  off: string;
  on: string;
  proposal: string;
  sdlcLabel: string;
  stages: string[];
  cases: CaseCopy[];
  read: {
    prompt: string;
    offRead: string;
    onRead: string;
    offAnswer: string;
    onAnswer: string;
    offOutcome: string;
    onOutcome: string;
  };
  dev: {
    prompt: string;
    explorer: string;
    problems: string;
    noProblems: string;
    terminal: string;
    stepWrite: string;
    stepFix: string;
    offNote: string;
    offOutcome: string;
    onOutcome: string;
  };
  design: {
    offNote: string;
    stepWrite: string;
    stepFix: string;
    fixed: string;
    offOutcome: string;
    onOutcome: string;
  };
  pci: {
    offSource: string;
    onSource: string;
    scopeIn: string;
    scopeOut: string;
    proposed: string;
    stepWrite: string;
    stepFix: string;
    offNoCheck: string;
    fixed: string;
    offOutcome: string;
    onOutcome: string;
  };
  pr: {
    opened: string;
    open: string;
    merged: string;
    prompt: string;
    phaseDesign: string;
    phaseDeploy: string;
    noCheck: string;
    pushed: string;
    fix: string;
    admitted: string;
    deniedWhy: string;
    offOutcome: string;
    onOutcome: string;
  };
};

export const COPY: Record<Locale, Copy> = {
  en: {
    title: 'Use cases',
    prev: 'Previous use case',
    next: 'Next use case',
    scenario: 'The scenario',
    scenarioSteps: ['Context', 'What happens', 'How ASL helps?'],
    off: 'Today: Markdown as the harness',
    on: 'Architecture as Code with ASL',
    proposal: 'Proposal · not available yet',
    sdlcLabel: 'SDLC',
    stages: ['Plan', 'Design', 'Develop', 'CI/CD', 'Deploy', 'Operate'],
    cases: [
      {
        tab: 'Designing an architecture',
        medium: 'System Design',
        sdlc: [1],
        story: {
          context:
            'Your platform team only allows Kubernetes (EKS).',
          action:
            'Your agent proposes a new architecture for your company, entirely serverless on Lambda.',
          asl:
            'With ASL, the proposal is checked against those rules before the review.',
        },
      },
      {
        tab: 'Developing',
        medium: 'VS Code',
        sdlc: [2],
        story: {
          context:
            'A new e-commerce feature spec is approved (using OpenSpec, BMAD or similar).',
          action:
            'To cancel an order, the agent writes straight into orders-db, which belongs to another team.',
          asl:
            'With ASL written into the project, the agent uses it as an architecture harness while it codes and checks every change.',
        },
      },
      {
        tab: 'Controlling PCI scope',
        medium: 'Compliance',
        sdlc: [1, 3, 5],
        story: {
          context:
            'The company takes card payments, so it must follow PCI DSS, the security standard for card data. Systems that touch card data form the PCI scope, which is audited and costly to maintain, so it is kept as small as possible. Anything connected to it joins the scope.',
          action:
            'An agent proposes a new spend view architecture for customers. To get the data fast, it consumes the card events.',
          asl:
            'With ASL, the PCI scope is declared in the manifests, and every proposal is checked against it.',
        },
      },
      {
        tab: 'Evaluating an architecture',
        medium: 'CI/CD',
        sdlc: [1, 3, 4],
        story: {
          context:
            'Growth wants a loyalty program on top of orders.',
          action:
            'The quickest design reads straight from the orders database.',
          asl:
            'ASL runs on the proposal, before any code. Kyverno only sees the result, after the code is written and deployed.',
        },
      },
      {
        tab: 'Interpreting an architecture',
        medium: 'Agent CLI',
        sdlc: [0],
        story: {
          context:
            'A regulated company must give its change board an impact analysis before the payload of an event changes.',
          action:
            'Without ASL the agent reads a diagram drawn for the last audit and still has to read the code of every service to confirm it.',
          asl:
            'With ASL, it reads the system architecture. The company syncs ASL manifests on every CI/CD change, so the analysis reflects the current state and can be traced as evidence.',
        },
      },
    ],
    read: {
      prompt: 'The change board needs the impact analysis for changing the payment-events payload.',
      offRead: 'architecture-review-q1.drawio · several KB of XML, arrows without a type',
      onRead: '~2.6 KB of YAML, typed relations',
      offAnswer:
        'The diagram shows tokenizer → ledger-service, drawn for the Q1 review. It does not say if the arrow is an event or a call, and it is 8 months old. To be sure I would have to read the code of every service. Provisional impact: ledger-service.',
      onAnswer:
        'payment-events is produced by tokenizer and consumed by ledger-service (team-ledger) and fraud-scoring (team-risk). It carries tokens, not card data: nothing labeled pci touches it, so no PCI review. The company syncs ASL manifests with every CI/CD change, so this is the current state.',
      offOutcome: 'An analysis with gaps: fraud-scoring joined after the diagram. The board cannot approve what it cannot trace.',
      onOutcome: 'An analysis the board can trace back to the manifests.',
    },
    dev: {
      prompt: 'Let customers cancel an order that has not shipped yet.',
      explorer: 'Explorer',
      problems: 'Problems',
      noProblems: 'No problems have been detected in the workspace.',
      terminal: 'Terminal',
      stepWrite: 'Agent writes',
      stepFix: 'Agent fixes',
      offNote: 'orders-db belongs to orders-service: not in the spec',
      offOutcome: 'Weeks later: orders-service changes its schema and cancellation-service breaks. Nobody knew they shared a database.',
      onOutcome: 'ASL checks component relations based on your company policies.',
    },
    design: {
      offNote: 'the platform only allows EKS: not in the proposal',
      stepWrite: 'Agent proposes',
      stepFix: 'Agent fixes',
      fixed: 'Every service now runs on EKS.',
      offOutcome: 'Two weeks later the platform team rejects it in the architecture review. The design starts over.',
      onOutcome: 'ASL checks the proposal against your platform rules before the review.',
    },
    pci: {
      offSource: 'network-diagram-v4.pdf · scope reviewed 8 months ago',
      onSource: 'label pci: "true" in the manifests',
      scopeIn: 'In PCI scope',
      scopeOut: 'Outside PCI scope',
      proposed: 'proposed',
      stepWrite: 'Agent proposes',
      stepFix: 'Agent fixes',
      offNoCheck: 'Nothing checks this connection before the merge.',
      fixed: 'spend-insights now reads payment-events, which carries tokens only.',
      offOutcome: 'The audit finds spend-insights connected to card data. It, and everything it touches, joins PCI scope: months of rework.',
      onOutcome: 'Scope is declared, and every connection that crosses it is checked before any coding.',
    },
    pr: {
      opened: 'opened this pull request',
      open: 'Open',
      merged: 'Merged',
      prompt: 'Design a loyalty program that reads each customer’s orders.',
      phaseDesign: 'Design proposal · before any code',
      phaseDeploy: 'After the code · deploy to the cluster',
      noCheck: 'No architecture check on this pull request.',
      pushed: 'The agent pushed a fix',
      fix: 'loyalty-service owns loyalty-db and consumes order-events',
      admitted: 'Deployment/loyalty-service admitted',
      deniedWhy: 'Deployment loyalty-worker is not declared as an Application in the ASL manifests',
      offOutcome:
        'Later: the next orders schema change breaks loyalty-service. Kyverno cannot see who reads whose database.',
      onOutcome: 'The design was fixed before the first line of code.',
    },
  },
  pt: {
    title: 'Casos de uso',
    prev: 'Caso de uso anterior',
    next: 'Próximo caso de uso',
    scenario: 'O cenário',
    scenarioSteps: ['Contexto', 'O que acontece', 'Como a ASL ajuda?'],
    off: 'Hoje: Markdown como harness',
    on: 'Arquitetura como Código com ASL',
    proposal: 'Proposta · ainda não existe',
    sdlcLabel: 'SDLC',
    stages: ['Planejar', 'Desenhar', 'Desenvolver', 'CI/CD', 'Deploy', 'Operar'],
    cases: [
      {
        tab: 'Desenhando uma arquitetura',
        medium: 'System Design',
        sdlc: [1],
        story: {
          context:
            'O time de plataforma só permite Kubernetes (EKS).',
          action:
            'Seu agente propõe uma nova arquitetura para a empresa, toda serverless em Lambda.',
          asl:
            'Com a ASL, a proposta é conferida contra essas regras antes da revisão.',
        },
      },
      {
        tab: 'Desenvolvendo',
        medium: 'VS Code',
        sdlc: [2],
        story: {
          context:
            'A spec de uma nova funcionalidade de e-commerce está aprovada (usando OpenSpec, BMAD ou similar).',
          action:
            'Para cancelar um pedido, o agente escreve direto no orders-db, que é de outro time.',
          asl:
            'Com a ASL no projeto, o agente a usa como harness de arquitetura enquanto programa e confere cada mudança.',
        },
      },
      {
        tab: 'Controlando o escopo PCI',
        medium: 'Conformidade',
        sdlc: [1, 3, 5],
        story: {
          context:
            'A empresa recebe pagamentos com cartão, então precisa seguir o PCI DSS, o padrão de segurança para dados de cartão. Os sistemas que tocam esses dados formam o escopo PCI, que é auditado e caro de manter, por isso é mantido o menor possível. Tudo que se conecta a ele entra no escopo.',
          action:
            'Um agente propõe uma nova arquitetura de visão de gastos para os clientes. Para pegar os dados rápido, consome os eventos de cartão.',
          asl:
            'Com ASL, o escopo PCI é declarado nos manifestos, e toda proposta é conferida contra ele.',
        },
      },
      {
        tab: 'Avaliando uma arquitetura',
        medium: 'CI/CD',
        sdlc: [1, 3, 4],
        story: {
          context:
            'O time de growth quer um programa de fidelidade em cima dos pedidos.',
          action:
            'O desenho mais rápido lê direto do banco de pedidos.',
          asl:
            'A ASL executa na proposta, antes de qualquer código. O Kyverno só vê o resultado, depois que o código foi escrito e publicado.',
        },
      },
      {
        tab: 'Interpretando uma arquitetura',
        medium: 'CLI de agente',
        sdlc: [0],
        story: {
          context:
            'Uma empresa regulada precisa entregar ao comitê de mudanças a análise de impacto antes de alterar o payload de um evento.',
          action:
            'Sem ASL o agente lê um diagrama desenhado para a última auditoria e ainda precisa ler o código de cada serviço para confirmar.',
          asl:
            'Com ASL, ele lê a arquitetura do sistema. A empresa sincroniza os manifestos da ASL a cada mudança no CI/CD, então a análise reflete o estado atual e pode ser rastreada como evidência.',
        },
      },
    ],
    read: {
      prompt: 'O comitê de mudanças precisa da análise de impacto para alterar o payload do payment-events.',
      offRead: 'architecture-review-q1.drawio · vários KB de XML, setas sem tipo',
      onRead: '~2,6 KB de YAML, relações tipadas',
      offAnswer:
        'O diagrama mostra tokenizer → ledger-service, desenhado para a revisão do Q1. Ele não diz se a seta é um evento ou uma chamada, e tem 8 meses. Para ter certeza eu teria que ler o código de cada serviço. Impacto provisório: ledger-service.',
      onAnswer:
        'payment-events é produzido pelo tokenizer e consumido por ledger-service (team-ledger) e fraud-scoring (team-risk). Ele carrega tokens, não dados de cartão: nada com pci o toca, então não precisa de revisão PCI. A empresa sincroniza os manifestos da ASL a cada mudança no CI/CD, então este é o estado atual.',
      offOutcome: 'Uma análise com lacunas: o fraud-scoring entrou depois do diagrama. O comitê não aprova o que não consegue rastrear.',
      onOutcome: 'Uma análise que o comitê rastreia até os manifestos.',
    },
    dev: {
      prompt: 'Permita que o cliente cancele um pedido que ainda não foi enviado.',
      explorer: 'Explorer',
      problems: 'Problemas',
      noProblems: 'Nenhum problema foi detectado no workspace.',
      terminal: 'Terminal',
      stepWrite: 'Agente escreve',
      stepFix: 'Agente corrige',
      offNote: 'orders-db pertence ao orders-service: fora da spec',
      offOutcome: 'Semanas depois: o orders-service muda o schema e o cancellation-service quebra. Ninguém sabia que dividiam um banco.',
      onOutcome: 'A ASL confere as relações entre componentes com base nas políticas da sua empresa.',
    },
    design: {
      offNote: 'a plataforma só permite EKS: fora da proposta',
      stepWrite: 'Agente propõe',
      stepFix: 'Agente corrige',
      fixed: 'Todos os serviços agora executam no EKS.',
      offOutcome: 'Duas semanas depois o time de plataforma rejeita na revisão de arquitetura. O desenho recomeça.',
      onOutcome: 'A ASL confere a proposta contra as regras da plataforma antes da revisão.',
    },
    pci: {
      offSource: 'network-diagram-v4.pdf · escopo revisado há 8 meses',
      onSource: 'label pci: "true" nos manifestos',
      scopeIn: 'No escopo PCI',
      scopeOut: 'Fora do escopo PCI',
      proposed: 'proposto',
      stepWrite: 'Agente propõe',
      stepFix: 'Agente corrige',
      offNoCheck: 'Nada confere essa conexão antes do merge.',
      fixed: 'O spend-insights agora lê o payment-events, que carrega só tokens.',
      offOutcome: 'A auditoria encontra o spend-insights ligado a dados de cartão. Ele, e tudo que ele toca, entra no escopo PCI: meses de retrabalho.',
      onOutcome: 'O escopo é declarado, e toda conexão que o atravessa é conferida antes de qualquer código.',
    },
    pr: {
      opened: 'abriu este pull request',
      open: 'Aberto',
      merged: 'Mergeado',
      prompt: 'Desenhe um programa de fidelidade que leia os pedidos de cada cliente.',
      phaseDesign: 'Proposta de design · antes de qualquer código',
      phaseDeploy: 'Depois do código · deploy no cluster',
      noCheck: 'Nenhuma checagem de arquitetura neste pull request.',
      pushed: 'O agente enviou uma correção',
      fix: 'loyalty-service ganha o loyalty-db e consome o order-events',
      admitted: 'Deployment/loyalty-service admitido',
      deniedWhy: 'O Deployment loyalty-worker não está declarado como Application nos manifestos ASL',
      offOutcome:
        'Depois: a próxima mudança de schema de pedidos quebra o loyalty-service. O Kyverno não enxerga quem lê o banco de quem.',
      onOutcome: 'O design foi corrigido antes da primeira linha de código.',
    },
  },
};

// Shared across locales: real compiler output and manifests.
export const SHOP = 'architecture/shop.asl.yaml';

export const XML_EXCERPT = [
  '<mxCell id="9" value="tokenizer" style="rounded=1;fillColor=#dae8fc;" vertex="1" parent="1">',
  '<mxCell id="14" style="endArrow=classic;html=1;" edge="1" parent="1" source="9" target="12"/>',
  '<mxCell id="12" value="ledger-service" style="rounded=1;fillColor=#d5e8d4;" vertex="1" parent="1">',
];

export const PAYMENTS = 'architecture/payments.asl.yaml';

export const YAML_EXCERPT = [
  '- from: {kind: Application, name: tokenizer}',
  '  to: {kind: Topic, name: payment-events}',
  '  type: produces',
  '- from: {kind: Application, name: ledger-service}',
  '  to: {kind: Topic, name: payment-events}',
  '  type: consumes',
  '- from: {kind: Application, name: fraud-scoring}',
  '  to: {kind: Topic, name: payment-events}',
  '  type: consumes',
];

// cancellation-service at architecture/cancellation.asl.yaml (the Relationship manifest starts on line 1).
export const CANCEL = 'architecture/cancellation.asl.yaml';

export const CANCEL_BEFORE = [
  '---',
  'apiVersion: asl/v1',
  'kind: Relationship',
  'metadata:',
  '  name: cancellations',
  'spec:',
  '  relations:',
  '    - from: {kind: Application, name: cancellation-service}',
  '      to: {kind: Database, name: orders-db}',
  '      type: writes',
];

export const CANCEL_AFTER = [
  '---',
  'apiVersion: asl/v1',
  'kind: Relationship',
  'metadata:',
  '  name: cancellations',
  'spec:',
  '  relations:',
  '    - from: {kind: Application, name: cancellation-service}',
  '      to: {kind: Topic, name: cancellation-requests}',
  '      type: produces',
  '    - from: {kind: Application, name: orders-service}',
  '      to: {kind: Topic, name: cancellation-requests}',
  '      type: consumes',
  '    - from: {kind: Application, name: orders-service}',
  '      to: {kind: Database, name: orders-db}',
  '      type: readsAndWrites',
];

/** Indexes of CANCEL_AFTER that the fix changes or adds. */
export const CANCEL_CHANGED = [8, 9, 10, 11, 12, 13, 14, 15];

export const ERR_OWN = {
  text: 'Application cannot write to a database owned by another application',
  policy: 'acme.write-only-own-database',
  line: 1,
  ok: 'ok',
};

// Serverless proposal: order-api at proposal.asl.yaml lines 1-9 (the other two Lambda services start at :10 and :19).
export const DESIGN = 'architecture/proposal.asl.yaml';

export const DESIGN_BEFORE = [
  '---',
  'apiVersion: asl/v1',
  'kind: Application',
  'metadata:',
  '  name: order-api',
  'spec:',
  '  providers:',
  '    aws: Lambda',
  '  language: Python',
];

export const DESIGN_AFTER = DESIGN_BEFORE.map((l) => l.replace('aws: Lambda', 'aws: EKS'));

/** Indexes of DESIGN_BEFORE the policy rejects / that the fix changes. */
export const DESIGN_BAD = [6, 7];
export const DESIGN_CHANGED = [7];

export const DESIGN_ERRS = {
  text: 'Application must run on AWS EKS',
  policy: 'platform.only-eks',
  lines: [1],
  ok: 'ok',
};

// PCI scope: spend-insights consuming card-events (labeled pci: "true") at payments.asl.yaml:51.
// The view lists only what this case touches (the manifests have more).
export const PCI_IN = ['payment-service', 'tokenizer', 'card-events'];
export const PCI_OUT = ['ledger-service', 'payment-events'];
// What the old network diagram listed: card-events was added later, so it is not on it.
export const PCI_IN_OLD = ['payment-service', 'tokenizer'];

export const PCI_ERR = {
  text: 'Application touches PCI data but is not declared in PCI scope; use a tokenized source or ask for a PCI approval',
  policy: 'acme.pci-scope-is-declared',
  line: 51,
};
export const PCI_OK = 'ok';

export const ERR_SHARED = {
  text: 'Database must not be shared between applications; each application owns its data',
  policy: 'acme.no-shared-database',
  line: 34,
  ok: 'ok',
};
