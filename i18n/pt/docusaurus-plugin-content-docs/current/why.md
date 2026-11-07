---
sidebar_position: 2
title: Por que arquitetura como código
---

# Por que arquitetura como código

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

Os seus arquitetos passaram duas semanas no diagrama da plataforma de rastreio de encomendas. A revisão de design aprovou, e o time saiu da sala certo do que ia construir. Três sprints depois, um agente fez o `tracking-api` chamar o `carrier-gateway` de forma síncrona dentro da requisição do cliente, envolveu essa chamada num loop de retry que ninguém tinha discutido e publicou o evento de entrega com uma seta igual a qualquer outra. O diagrama nunca mudou. Ninguém soube dizer qual dos três era um erro, porque o diagrama nunca disse o que era permitido.

É esse o problema que o ASL resolve. **ASL** significa **Architecture Specification Language** (linguagem de especificação de arquitetura), e a ideia cabe em uma frase:

> Não desenhe a arquitetura. Especifique.

## O diagrama já nasce morto

O diagrama de solução é a principal entrega de quem faz arquitetura. Também é aí que a arquitetura começa a se perder. Quando as cerimônias de definição acabam, o desenvolvimento começa, e cada pessoa (ou agente) que lê o diagrama pode tirar uma conclusão diferente:

- Essa transação é assíncrona? A seta só vai, não volta.
- Preciso de consistência forte?
- O scaling vai ser pelo número de requests?
- Se der erro ao persistir, eu tento de novo?

Muita coisa disso foi falada em reunião e acabou em gravação ou em anotação pessoal. O que vai para produção tem boa chance de ser diferente do que cada um entendeu ao sair da sala.

> O caminho feliz está documentado. O comportamento real quase nunca.

## O diagrama deixa espaço para interpretação

Pegue um requisito simples: um worker consome uma fila para enviar e-mails, e as mensagens que falharem vão para uma dead letter queue. Três setas já bastam para levantar perguntas que o desenho não responde:

- A fila é _push-based_ ou _poll-based_?
- Quem publica na DLQ?
- Quando uma mensagem cai na DLQ?
- A integração com o serviço de e-mail é HTTP ou gRPC? Síncrona ou assíncrona?

Quem desenhou sabe o que quis dizer. Quem lê pela primeira vez precisa do autor ao lado. Quando o diagrama é a fonte da verdade, o preço é **entropia** e **perda de contexto**.

## A IA acelera o código, mas não o design

A IA generativa acelerou a escrita e a entrega de código. O diagrama e o que realmente executa em produção se afastam mais rápido do que antes.

Ela também muda quem lê a arquitetura. Um agente como o Claude Code ou o Codex, que recebe um diagrama como especificação, gasta tokens para interpretar uma imagem e pode alucinar o que as setas significam. Um agente precisa de:

- entidades bem definidas;
- relações explícitas;
- contratos;
- dependências;
- políticas.

Isso é uma especificação em texto, não um desenho.

## Markdown descreve, uma linguagem pode ser verificada

Você também pode escrever a arquitetura em Markdown, e um agente com uma skill de revisão consegue lê-la. Funciona até a lista de regras crescer: cada revisão lê todos os arquivos, gasta tokens, varia de uma sessão para outra, e uma regra violada pode parecer perfeitamente normal.

Pegue um caso simples. O `inventory-service` grava no `stock-db`, um banco que foi renomeado para `inventory-db`. Em Markdown, o erro é uma linha numa tabela, em um de três arquivos. Na ASL, o compilador aponta que o `stock-db` não existe, antes de alguém escrever código. Você pode [testar no playground](/playground).

| | Markdown, revisado por uma skill ou agente | ASL, conferido pelo compilador |
| --- | --- | --- |
| Como a arquitetura é representada | Texto livre para interpretar | Elementos e relacionamentos tipados |
| Custo e repetibilidade | Tokens a cada revisão, e o resultado pode mudar entre execuções | Sem uso de LLM, e a mesma entrada dá o mesmo resultado |
| As policies da sua empresa | O agente pode ignorar ou interpretar mal uma regra | Regras escritas uma vez como policies e aplicadas a cada execução |

## O que isso habilita para agentes

Como a arquitetura é código tipado e compilável, ela vira um **harness de arquitetura** para agentes: o contexto que eles leem, os guardrails que respeitam e o feedback que usam para se corrigir.

- **Contexto.** Um arquivo draw.io é XML cheio de coordenadas e ids gerados, e o agente paga tokens para reconstruir um grafo que nunca foi guardado como grafo. Com a ASL, ele lê a arquitetura como dado tipado.
- **Guardrails.** Numa wiki, a regra é lida de forma probabilística: duas sessões podem ler o mesmo diagrama e construir dois sistemas diferentes. Suas regras viram [policies](./custom-policies.md) que a mudança precisa cumprir: ownership, dependências permitidas, nomenclatura, tudo que o [CEL](https://cel.dev) consegue expressar.
- **Feedback.** Nada avisa o agente de que o design está errado até a produção. A ASL compila a mudança e devolve poucas linhas de diagnóstico, e o agente corrige sozinho.

Veja na prática nos [casos de uso](./use-cases/designing.mdx).

## Dá para verificar uma arquitetura

A planta de um prédio pode parecer coerente e mesmo assim não parar em pé. O que a torna segura é aplicar os cálculos às medidas e aos materiais. A pergunta vale para software também: essa arquitetura é válida antes de alguém construí-la?

Quando a arquitetura é especificada em uma linguagem, dá para **compilá-la**:

- conferir o **formato** de cada elemento;
- conferir os **relacionamentos** entre eles;
- conferir a **consistência** do grafo inteiro;
- aplicar as suas próprias **policies**.

O ASL deixa de ser documentação e vira um **contrato**. Um pipeline de deploy pode se recusar a subir para produção se a arquitetura não compila.

## O que você ganha

| Sem | Com ASL |
| --- | --- |
| O significado mora em reuniões e na cabeça das pessoas | O significado mora em um arquivo versionado |
| Cada leitor interpreta as setas do seu jeito | Uma única leitura, fixada pela especificação |
| Revisar é bater papo | Revisar é um pull request e uma rodada do compilador |
| Governança manual | Regras são policies que executam a cada commit |
| Agentes leem imagens | Agentes leem uma especificação tipada |

:::note
Arquitetura como código compensa quando a organização já tem práticas de governança, como catálogo de serviços, ADRs ou tech radar. Sem elas, pode trazer complexidade antes de resolver qualquer problema.
:::

Para ver no que isso difere das ferramentas que geram diagramas a partir de texto, leia [Arquitetura como código vs Diagram as Code](./aac-vs-diagram-as-code.md).
