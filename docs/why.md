---
sidebar_position: 2
title: Why architecture as code
---

# Why architecture as code

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

Your architects spent two weeks on the credit platform diagram. The design review approved it, and the team left the room sure of what they would build. Three sprints later, an agent added `billing-service` reading straight from `credit-db`, a retry loop nobody had discussed, and an async call that was drawn as a plain arrow. The diagram never changed. Nobody could say which of the three was a mistake, because the diagram never said what was allowed.

That is the problem ASL solves. **ASL** stands for **Architecture Specification Language**, and the idea behind it fits in one line:

> Don't draw the architecture. Specify it.

## The diagram is born dead

A solution diagram is the main output of an architect's work. It is also where the architecture starts to be lost. Once the design ceremonies end, development begins, and every person (or agent) who reads the diagram can reach a different conclusion:

- Is this transaction asynchronous? The arrow only goes one way.
- Do I need strong consistency?
- Does it scale by number of requests?
- If persisting fails, should I retry?

Many of these points were discussed in meetings and then stayed in recordings and personal notes. What reaches production has a good chance of being different from what each person left the room expecting.

> The happy path is documented. The real behavior rarely is.

## A diagram is open to interpretation

Take a simple requirement: a worker consumes a queue to send emails, and failed messages go to a dead letter queue. Three arrows are enough to raise questions the picture cannot answer:

- Is the queue push-based or poll-based?
- Who publishes to the DLQ?
- When does a message land in the DLQ?
- Is the integration with the email service HTTP or gRPC? Sync or async?

Whoever drew it knows what they meant. Whoever reads it for the first time needs the author in the room. When the diagram is the source of truth, this costs you **entropy** and **lost context**.

## AI speeds up the code, not the design

Generative AI sped up writing and shipping code. The diagram and what actually runs in production drift apart faster than before.

It also changes who reads the architecture. An agent such as Claude Code or Codex that receives a diagram as its specification pays in tokens to interpret an image, and it may hallucinate what the arrows mean. An agent needs:

- well-defined entities;
- explicit relationships;
- contracts;
- dependencies;
- policies.

That is a text specification, not a picture.

## Architecture can be verified

A building plan can look coherent and still collapse. What makes it safe is applying the calculations to the measurements and materials. The same question applies to software: is this architecture valid before anyone builds it?

When architecture is specified in a language, you can **compile** it:

- check the **format** of every element;
- check the **relationships** between them;
- check **consistency** across the whole graph;
- enforce your own **policies**.

ASL stops being documentation and becomes a **contract**. A deploy pipeline can refuse to go to production if the architecture does not compile.

## What you gain

| Without | With ASL |
| --- | --- |
| Meaning lives in meetings and heads | Meaning lives in a versioned file |
| Every reader interprets the arrows | One reading, fixed by the specification |
| Review is a conversation | Review is a pull request and a compiler run |
| Governance is manual | Rules are policies that run on every commit |
| Agents read pictures | Agents read a typed specification |

:::note
Architecture as code pays off when an organization already has governance practices such as a service catalog, ADRs or a tech radar. Without them, it can add complexity before it removes any.
:::

See how this differs from tools that generate diagrams from text in [Architecture as code vs Diagram as Code](./aac-vs-diagram-as-code.md).
