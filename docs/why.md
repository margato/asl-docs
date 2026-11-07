---
sidebar_position: 2
title: Why architecture as code
---

# Why architecture as code

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

Your architects spent two weeks on the parcel-tracking platform diagram. The design review approved it, and the team left the room sure of what they would build. Three sprints later, an agent made `tracking-api` call `carrier-gateway` synchronously inside the customer request, wrapped that call in a retry loop nobody had discussed, and published the delivery event with an arrow that looked like any other. The diagram never changed. Nobody could say which of the three was a mistake, because the diagram never said what was allowed.

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

## Markdown describes, a language can be checked

You can also write the architecture in Markdown, and an agent with a review skill can read it. It works until the list of rules grows: every review reads every file, costs tokens, depends on the session, and a violated rule can read as perfectly fine.

Take a simple case. `inventory-service` writes to `stock-db`, a database that was renamed `inventory-db`. In Markdown, the mistake is one line in a table, in one of three files. In ASL, the compiler reports that `stock-db` does not exist, before anyone writes code. You can [try it in the playground](/playground).

| | Markdown, reviewed by a skill or agent | ASL, checked by the compiler |
| --- | --- | --- |
| How the architecture is represented | Free text to interpret | Typed elements and relationships |
| Cost and repeatability | Tokens on every review, and the result can change between runs | No LLM use, and the same input gives the same result |
| Your company's policies | An agent can overlook or misread a rule | Rules written once as policies and enforced on every run |

## What this enables for agents

Because the architecture is typed code that can be compiled, it becomes an **architecture harness** for agents: the context they read, the guardrails they respect and the feedback they use to correct themselves.

- **Context.** A draw.io file is XML full of coordinates and generated ids, and the agent pays tokens to recover a graph that was never stored as one. With ASL, it reads the architecture as typed data.
- **Guardrails.** In a wiki, the rule is read probabilistically: two sessions can read the same diagram and build two different systems. Your rules become [policies](./custom-policies.md) the change must satisfy: ownership, allowed dependencies, naming, anything [CEL](https://cel.dev) can say.
- **Feedback.** Nothing tells an agent its design is wrong until production. ASL compiles the change and returns a few lines of diagnostics, and the agent fixes it on its own.

See it in practice in the [use cases](./use-cases/designing.mdx).

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
