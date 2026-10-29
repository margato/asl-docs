---
sidebar_position: 2
title: Por que arquitetura como código
---

# Por que arquitetura como código

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

Os seus arquitetos passaram duas semanas no diagrama da plataforma de crédito. A revisão de design aprovou, e o time saiu da sala certo do que ia construir. Três sprints depois, um agente adicionou o `billing-service` lendo direto do `credit-db`, um loop de retry que ninguém tinha discutido e uma chamada assíncrona desenhada como uma seta qualquer. O diagrama nunca mudou. Ninguém soube dizer qual dos três era um erro, porque o diagrama nunca disse o que era permitido.

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

A IA generativa acelerou a escrita e a entrega de código. O diagrama e o que realmente roda em produção se afastam mais rápido do que antes.

Ela também muda quem lê a arquitetura. Um agente como o Claude Code ou o Codex, que recebe um diagrama como especificação, gasta tokens para interpretar uma imagem e pode alucinar o que as setas significam. Um agente precisa de:

- entidades bem definidas;
- relações explícitas;
- contratos;
- dependências;
- políticas.

Isso é uma especificação em texto, não um desenho.

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
| Governança manual | Regras são policies que rodam a cada commit |
| Agentes leem imagens | Agentes leem uma especificação tipada |

:::note
Arquitetura como código compensa quando a organização já tem práticas de governança, como catálogo de serviços, ADRs ou tech radar. Sem elas, pode trazer complexidade antes de resolver qualquer problema.
:::

Para ver no que isso difere das ferramentas que geram diagramas a partir de texto, leia [Arquitetura como código vs Diagram as Code](./aac-vs-diagram-as-code.md).
