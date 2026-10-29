---
sidebar_position: 6
title: Custom policies
---

# Custom policies

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

Your company has a rule: **each application owns its data**. Two applications must never share a database. Today the rule lives in a wiki page, and the agent that added `billing-service` never read it. It pointed the new service at `credit-db`, and the design review only caught it weeks later.

You cannot write that rule in any of the built-in checks, because it is your company's rule, not everyone's. A **custom policy** is how you teach `asl` your rules. It is a small YAML file that selects some manifests and says what must be true about them. `asl` runs it on every check, right after the built-in policies, and never instead of them.

## Your first policy

Here is your company's rule:

```yaml title="policies/no-shared-database.asl.yaml"
apiVersion: asl/v1
kind: CustomPolicy
metadata:
  name: no-shared-database
  namespace: acme
spec:
  severity: error
  selector:
    kind: Database
  assertions:
    - expression: >-
        manifests.filter(m, m.kind == 'Application' &&
        to(manifest).exists(e, e.from.kind == 'Application' && e.from.name == m.name)).size() <= 1
      message: Database must not be shared between applications; each application owns its data
```

Read it out loud: for every `Database`, count the applications that have a relationship pointing at it. There must be at most one.

Run it next to your manifests:

```sh
asl ./architecture --policies-bundle-path ./policies
```

When `billing-service` and `credit-service` both read `credit-db`, you get:

```asldiag
error: Database must not be shared between applications; each application owns its data
  --> architecture/credit.asl.yaml:18
  policy: acme.no-shared-database

error: could not compile due to 1 previous error (10.1ms)
```

The error points at the database, the manifest that breaks the rule, and the policy is named `acme.no-shared-database`. Give `billing-service` a database of its own and the check passes.

## Anatomy of a policy

```yaml title="policies/writer-needs-owner.asl.yaml"
apiVersion: asl/v1
kind: CustomPolicy
metadata:
  name: writer-needs-owner
  namespace: acme            # required; ID = <namespace>.<name>
spec:
  severity: error                # warning | error (default error)
  selector:                      # which manifests to check
    kind: Application            # required
    matchLabels: { tier: backend }
    matchLabelExpressions:       # In | NotIn | Exists | DoesNotExist
      - { label: ownership-exempt, operator: DoesNotExist }
  condition:                     # optional, ANDed; false => skip that manifest
    - from(manifest).exists(e, e.type in ['writes', 'readsAndWrites'])
  assertions:                    # all must hold for a selected manifest
    - expression: "'owner' in manifest.labels"
      message: Application that writes to a store must have an owner label
```

- **`selector`** picks the manifests the policy looks at. `kind` is always required. Labels work the way they do in Kubernetes, and everything you list must match.
- **`condition`** is optional. When it is false for a manifest, the policy skips that manifest.
- **`assertions`** are the rules. Every assertion must be true for every selected manifest. When one is false, `message` is reported.
- **`severity`** is `error` (fails the check) or `warning` (prints, but does not fail).

Expressions are written in [CEL](https://cel.dev), a small language for rules. Every `condition` and `expression` must give a yes-or-no answer.

## Rules

- The `asl` namespace belongs to the built-in policies. A duplicate `<namespace>.<name>` is an error, but the same `name` can exist in different namespaces.
- `metadata.namespace` is optional on other kinds, but **required** on a `CustomPolicy`. It is how `acme.no-shared-database` gets its id.

## What your expressions can use

| Name | What it is |
| --- | --- |
| `manifest` | The manifest being checked: `kind`, `name`, `namespace`, `labels`, `annotations`, `spec`. |
| `manifests` | The list of all manifests. |
| `edges` | The list of relationships, each with `from {kind, name}`, `to {kind, name, interface}` and `type`. |
| `from(manifest, type?)` | The relationships that start at that manifest, optionally filtered by type. |
| `to(manifest, type?)` | The relationships that end at that manifest, optionally filtered. |

## How problems show up

- A false assertion reports its `message` at the file and line of the manifest that breaks the rule, with the severity you chose.
- A mistake in the expression itself, such as a syntax error or an answer that is not yes-or-no, is always an `error`. Syntax errors point at the policy file; errors found while checking a manifest point at that manifest.
- An expression that is too expensive to evaluate also stops with an error, instead of slowing the whole run down.

## Policies for your own kinds

Policies can also target [custom schemas](./custom-schemas.md). Set `selector.apiVersion` to the group of your kind, for example `acme/v1`.
