---
sidebar_position: 4
title: FAQ
---

# FAQ

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

The questions people ask first, with short answers and a link to the page that goes deeper.

## What is ASL?

ASL, the **Architecture Specification Language**, lets you describe applications, databases and the relationships between them as small YAML files. The `asl` command checks them against built-in and custom rules, in milliseconds. Start with the [introduction](./intro.md).

## How is it different from Diagram as Code?

Diagram as Code generates a picture from text. ASL is a specification: it can be compiled, checked against rules and read by agents. See [Architecture as code vs Diagram as Code](./aac-vs-diagram-as-code.md).

## Why not describe the architecture in Markdown?

Markdown is free text to interpret. Every review reads every file, costs tokens and can change between runs. ASL is typed and checked by a compiler, so the same input gives the same result. See [Markdown describes, a language can be checked](./why.md#markdown-describes-a-language-can-be-checked).

## Do I need AI or an LLM to use it?

No. You can use AI to generate specifications, but compiling and verifying them never uses an LLM: the compiler is deterministic, and the same input always gives the same result.

## Where can I use it?

One compiler, the same result everywhere:

- In your pipeline, with the [CLI](./cli.md).
- In your editor, with the [VS Code extension](./vscode-extension.md).
- In the browser and in Node.js, with the [JavaScript SDK](./javascript.md).
- In Go and Python, to embed the same checks in your own tools.

## Can I write my own rules?

Yes. A [custom policy](./custom-policies.md) is a small YAML file with an expression in [CEL](https://cel.dev), and [custom schemas](./custom-schemas.md) teach ASL your own kinds, with no changes to the compiler.

## How do agents use it?

Because the architecture is typed code that compiles, an agent gets context to read, guardrails to respect and feedback to correct itself. See [what this enables for agents](./why.md#what-this-enables-for-agents) and the [use cases](./use-cases/designing.mdx).

## Is it ready for production?

ASL is under active development, and parts of the language and of these docs may still change.
