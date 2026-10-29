---
sidebar_position: 3
title: Architecture as code vs Diagram as Code
---

# Architecture as code vs Diagram as Code

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

Your company already practices Diagram as Code. They live in the repository, they are reviewed in pull requests, and they render to a clean picture on every merge. And yet `billing-service` still ended up reading from `credit-db`, because nothing in a diagram file can say that this is not allowed. The text was versioned. The architecture was not.

That is the difference between the two ideas. They sound alike, but they are not two flavors of the same thing. They answer different questions.

**Diagram as Code** (Mermaid, PlantUML, D2 and similar) is concerned with one thing: the **generated visual**. Text goes in, a picture comes out. That is a useful way to maintain drawings, but the architecture is still in the drawing. The text is only a description of how to paint it.

**Architecture as code** is concerned with the **architecture itself**: what exists, how it relates, what contracts and rules hold. It is a **validatable architectural context**, checked deterministically. The picture, if you want one, is a byproduct.

## The honest critique of Diagram as Code

- **It optimizes the wrong output.** The goal is a nicer, versioned, reproducible image. Nobody asked whether the architecture behind it is right.
- **`A --> B` has no meaning.** It is an arrow. It does not say whether this is a read, a write, a call or a dependency, nor whether it is sync or async. The reader decides, so two readers can disagree.
- **It validates syntax, not architecture.** A diagram with a dangling connection, a duplicated service or a forbidden dependency compiles and renders fine. The tool only knows whether the drawing parses.
- **It cannot express rules.** "Every application that writes to a store must have an owner" has no place in a diagram language, so governance stays manual.
- **The truth is still a picture.** The source is a set of boxes and arrows, so you are back to interpreting them. The fidelity problem between design and production remains.

## What architecture as code changes

Architecture is specified as typed data. A compiler turns it into a graph and checks it:

- **Shape:** every element matches the definition of its kind.
- **References:** every relationship points to something that exists.
- **Consistency:** names are unique and contracts line up.
- **Policies:** your own rules run over the whole graph.

This validation is **deterministic**: same input, same result, every time. It is a plain program run in CI or on your machine. No model is called, so it costs **zero tokens**, and it does not hallucinate.

## Agents: structured context, not pictures to decode

AI agents are now the other reader of your architecture, and the format decides what they pay.

- **A draw.io file is expensive to read.** It is a large XML document full of geometry, styles and generated ids. The agent spends tokens on coordinates and colors to recover a graph that was never stored as one, and then has to guess what the arrows mean. Screenshots are worse: they cost image tokens and invite hallucination.
- **A Diagram as Code file is cheaper but not meaningful.** It is compact text, but it still only says "these boxes are connected".
- **An ASL spec is already the structure.** Entities, typed relationships, contracts and policies are explicit. The agent reads what it needs, and it can ask the compiler to check its work instead of reasoning about validity itself.

The shape of the loop changes: the agent proposes a change, `asl` validates it for free, and the agent only reads the short diagnostics.

## Side by side

| | Diagram as Code | Architecture as code (ASL) |
| --- | --- | --- |
| Concerned with | The generated visual | The architecture itself |
| Output | An image | A validated model and a graph |
| `A --> B` | An arrow | A typed relationship: `writes`, `reads`, `calls`... |
| "Is it valid?" | Only syntax | Shape, references, consistency, policies |
| Wrong reference | Renders anyway | A diagnostic that fails the build |
| Rules and governance | Not expressible | Policies, enforced on every run |
| Validation cost | A human looking at it | Deterministic, zero tokens |
| Agent reading it | Decode a picture or a layout | Read structured data |
| Meaning of an arrow | Up to the reader | Defined by the specification |

## Same example, two ways

An arrow from `worker` to `dlq`:

```text
worker --> dlq
```

The same fact as a typed relationship:

```yaml
apiVersion: asl/v1
kind: Relationship
metadata:
  name: worker-relations
spec:
  relations:
    - from:
        kind: Application
        name: email-worker
      to:
        kind: Queue
        name: email-dlq
      type: writes
```

The names above are illustrative. What matters is the shape: a typed edge in a graph that can be validated, queried and enforced.

## Diagrams still have a place

Diagrams are good for communication. The point is the direction of truth: the specification is the source and a diagram can be rendered from it. The reverse does not work, because a picture does not carry enough to rebuild the architecture.
