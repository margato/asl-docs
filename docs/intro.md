---
slug: /intro
sidebar_position: 1
title: Introduction
---

# Introduction

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

Last quarter, your architects drew the credit platform in a diagramming tool. It looked right. Since then, an agent added `billing-service`, and nobody noticed that it reads straight from `credit-db`, a pattern your company bans. The diagram still looks fine. The rule lives in a wiki that nobody checks.

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

```yaml title="architecture/credit.asl.yaml"
apiVersion: asl/v1
kind: Application
metadata:
  name: credit-service
  labels:
    owner: team-payments
spec:
  providers:
    aws: EKS
  language: Go
```

Every manifest has `apiVersion`, `kind` and `metadata`. The rest goes under `spec`, and what is allowed there depends on the kind.

Run `asl ./architecture` and you get `ok`. Add a second application that shares a database with the first one, plus the rule that forbids it, and you get an error instead. You will do exactly that in [Custom policies](./custom-policies.md).

## Where next

- [CLI](./cli.md): run the check on your machine and in CI.
- [Custom policies](./custom-policies.md): write your own rules.
- [Custom schemas](./custom-schemas.md): teach ASL your own kinds.
- [Why architecture as code](./why.md), and [how it differs from Diagram as Code](./aac-vs-diagram-as-code.md).
- [How ASL works](./architecture.md): what happens between your YAML and the verdict.
