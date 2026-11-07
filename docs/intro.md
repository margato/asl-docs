---
slug: /intro
sidebar_position: 1
title: Introduction
---

# Introduction

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

Two weeks before Black Friday, an agent added `recommendation-service` to your online store. It worked, so it shipped. Nobody noticed that it reads straight from `orders-db`, the database of `orders-service`, a pattern your company bans. Now a slow query on the recommendations page slows down checkout. The rule exists, but it lives in a wiki that nobody checks.

ASL, the **Architecture Specification Language**, is how your company stops this from happening again. You describe your applications, databases and the relationships between them as small YAML files. The `asl` command checks them, in milliseconds, against the rules you care about.

```sh
asl ./architecture
```

## What you get

- **Validated manifests.** Every kind (`Application`, `Database`, `Relationship`...) has a definition. A manifest with a typo or a missing field is rejected with a clear message.
- **A real dependency graph.** Relationships connect your manifests. A reference to something that does not exist is an error, not a surprise in production.
- **Policies.** Built-in rules plus your own, such as "a database belongs to a single application".
- **CI-friendly output.** Readable diagnostics and an exit code your pipeline understands.

## A first manifest

```yaml title="architecture/orders.asl.yaml"
apiVersion: asl/v1
kind: Application
metadata:
  name: orders-service
  labels:
    owner: team-orders
spec:
  providers:
    aws: EKS
  language: Go
```

Every manifest has `apiVersion`, `kind` and `metadata`. The rest goes under `spec`, and what is allowed there depends on the kind.

Run `asl ./architecture` and you get `ok`. Add a second application that shares a database with the first one, plus the rule that forbids it, and you get an error instead. You will do exactly that in [Custom policies](./custom-policies.md).

## Where it runs

It is one compiler, and it gives the same result wherever you use it:

- **In your pipeline.** Run `asl` on every pull request, and an architecture that breaks a rule fails the build before it merges. See the [CLI](./cli.md).
- **In VS Code.** See the architecture in a sidebar panel and the violated policy on the line that causes it. See the [VS Code extension](./vscode-extension.md).
- **In JavaScript.** Validate in the browser or in Node.js, with no server, for example in a diagram editor. See the [JavaScript SDK](./javascript.md).
- **In Go and Python.** Embed the same checks in your internal engineering platform, or run them from scripts and notebooks.

## Where next

- [CLI](./cli.md): run the check on your machine and in CI.
- [Custom policies](./custom-policies.md): write your own rules.
- [Custom schemas](./custom-schemas.md): teach ASL your own kinds.
- [Why architecture as code](./why.md), and [how it differs from Diagram as Code](./aac-vs-diagram-as-code.md).
- [How ASL works](./architecture.md): what happens between your YAML and the result.
