---
sidebar_position: 2
title: Custom schemas
---

# Custom schemas

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

Your company tracks which team owns every application and which cost center pays for it. The built-in `Application` kind knows nothing about teams or cost centers. Today that information lives in a spreadsheet, and nobody checks it. Last month the agent that added `billing-service` invented a team name that did not exist, and the invoice went to nobody.

You want ASL to understand a `Team`, to require a cost center on every application, and to refuse an application that points to a team that does not exist.

A **custom schema** is how you teach ASL a new kind, or add fields to an existing one. It is a YAML file that defines what a manifest of that kind may contain. `asl` uses that definition to validate every manifest of the kind, exactly as it does for the built-in ones. You can write a definition from scratch, or **inherit** a built-in one and extend it.

Your kinds live in your own **group** (for example `acme/v1`). They are **added** to the built-in kinds and never replace them.

## Load a bundle

Point `asl` at a directory with the `--schemas-bundle-path` flag:

```sh
asl ./architecture --schemas-bundle-path ./schemas-bundle
```

The bundle is a tree of `<group>/<version>/<Kind>.yaml` files:

```text
schemas-bundle/
  acme/v1/Team.yaml
  acme/v1/Application.yaml
```

A file at `acme/v1/Team.yaml` defines manifests with `apiVersion: acme/v1` and `kind: Team`. The built-in kinds follow the same layout under `asl/v1/`.

Without the flag, `asl` does not know your kinds and rejects them:

```text
error: unknown apiVersion "acme/v1"
  --> architecture/billing.asl.yaml:1
  policy: asl.builtin.api-contract
```

## What is reserved

The `asl` group belongs to the built-in kinds. A bundle cannot define anything under `asl/`, so `Relationship`, `CustomPolicy` and the other built-in kinds cannot be changed or replaced. Any other group is yours.

A manifest is identified by `apiVersion` + `kind` + `name`. An `acme/v1` `Application` called `billing` and an `asl/v1` `Application` called `billing` are different manifests, and so are `acme/v1` and `acme/v2`.

## Your first custom kind

Start with the `Team`. The definition below is written from scratch: it says that a team has a required `email`, and nothing else.

```yaml title="schemas-bundle/acme/v1/Team.yaml"
allOf:
  - $ref: ../../asl/v1/Manifest.yaml     # apiVersion, kind and metadata
  - type: object
    required: [spec]
    properties:
      apiVersion:
        const: acme/v1
      kind:
        const: Team
      spec:
        type: object
        additionalProperties: false
        required: [email]
        properties:
          email:
            type: string
unevaluatedProperties: false
examples:
  - apiVersion: acme/v1
    kind: Team
    metadata:
      name: payments
    spec:
      email: payments@acme.example
```

A few things to notice:

- The first line inherits the shared base definition that every manifest has: `apiVersion`, `kind` and `metadata`. You do not repeat them.
- The definition is **closed**: a field you did not list is rejected. That is what catches typos. Close every object you add, including nested ones.
- The `examples` are checked when the bundle loads, so they double as a test of your definition.

## Build on a built-in kind

Now the cost center. You do not want to rewrite everything `Application` already knows about providers, languages and interfaces. Instead, your `Application` **inherits** the built-in definition and adds one required field. The resource kinds (`Application`, `APIGateway`, `Database`, `Queue` and `Topic`) can all be extended this way:

```yaml title="schemas-bundle/acme/v1/Application.yaml"
allOf:
  - $ref: ../../asl/v1/Manifest.yaml
  - type: object
    required: [spec]
    properties:
      apiVersion:
        const: acme/v1
      kind:
        const: Application
      spec:
        allOf:
          - $ref: ../../asl/v1/Application.yaml#/$defs/spec
        required: [costCenter]
        properties:
          costCenter:
            type: string
            pattern: "^cc-[0-9]+$"
        unevaluatedProperties: false
unevaluatedProperties: false
examples:
  - apiVersion: acme/v1
    kind: Application
    metadata:
      name: billing
    spec:
      providers:
        aws: EKS
      language: Go
      costCenter: cc-1042
```

An `acme/v1` `Application` accepts everything an `asl/v1` one does, validated by the same rules, plus a required `costCenter` that must look like `cc-1042`. The built-in kind is untouched.

## Use custom kinds in a Relationship

A `Team` is only useful if something refers to it. Applications and databases still connect through `Relationship`, and you can point either end of an edge at your own kinds.

In a `Relationship`, a kind is either a bare name, which means the Relationship's own group (`asl/v1`), or `group/version/Kind`:

```yaml
apiVersion: asl/v1
kind: Relationship
metadata:
  name: billing-relations
spec:
  relations:
    - from: { kind: acme/v1/Application, name: billing }
      to: { kind: Database, name: billing-db }
      type: readsAndWrites
```

Writing a bare `Team` when only `acme/v1` `Team` exists fails: `Team` would mean `asl/v1` `Team`, which does not exist.

:::note
The built-in relationship rules only know the built-in kinds. An edge with a custom-group kind on either side is not judged by them. Write a [custom policy](./custom-policies.md) for those rules.
:::

## Target custom kinds in a policy

This is the part that stops the invented team. A [custom policy](./custom-policies.md) can select your kind by setting `selector.apiVersion`. Here, every `acme/v1` `Application` must belong to a `Team` that exists:

```yaml title="policies/application-has-known-team.asl.yaml"
apiVersion: asl/v1
kind: CustomPolicy
metadata:
  name: application-has-known-team
  namespace: acme
spec:
  severity: error
  selector:
    apiVersion: acme/v1
    kind: Application
  assertions:
    - expression: "'team' in manifest.labels && manifests.exists(m, m.kind == 'Team' && m.name == manifest.labels['team'])"
      message: acme/v1 Application must belong to an existing Team
```

`manifest.apiVersion` is also available in the expressions. See [Custom policies](./custom-policies.md) for everything an expression can use.

## Putting it together

Your folder now has a team, an application that belongs to it, a database, and the relationship between them:

```yaml title="architecture/billing.asl.yaml"
apiVersion: acme/v1
kind: Team
metadata:
  name: payments
spec:
  email: payments@acme.example
---
apiVersion: acme/v1
kind: Application
metadata:
  name: billing
  labels:
    team: payments
spec:
  providers:
    aws: EKS
  language: Go
  costCenter: cc-1042
---
apiVersion: asl/v1
kind: Database
metadata:
  name: billing-db
spec:
  providers:
    aws: RDSPostgreSQL
---
apiVersion: asl/v1
kind: Relationship
metadata:
  name: billing-relations
spec:
  relations:
    - from: { kind: acme/v1/Application, name: billing }
      to: { kind: Database, name: billing-db }
      type: readsAndWrites
```

Run it with both bundles:

```sh
asl ./architecture \
  --schemas-bundle-path ./schemas-bundle \
  --policies-bundle-path ./policies
```

```text
ok 8.2ms
```

If the label points to a team that does not exist (`team: payment`), the policy catches it:

```text
error: acme/v1 Application must belong to an existing Team
  --> architecture/billing.asl.yaml:7
  policy: acme.application-has-known-team

error: could not compile due to 1 previous error (6.6ms)
```

If `costCenter` does not match the pattern (`costCenter: finance`), the definition catches it first, and the edge that mentions `billing` then has nothing to point to:

```text
error: spec.costCenter: does not match pattern '^cc-[0-9]+$'
  --> architecture/billing.asl.yaml:7
  policy: asl.builtin.api-contract

error: dangling reference: from acme/v1/Application/billing not found
  --> architecture/billing.asl.yaml:27
  policy: asl.builtin.relationship-ref

error: could not compile due to 2 previous errors (6.6ms)
```

## What `asl` checks in your bundle

An invalid bundle stops the run with exit code `2` before any manifest is read:

```text
compiling ASL schemas: custom schemas: asl/v1/Foo.yaml: apiGroup "asl" is reserved for the built-in schemas
```

- Every `*.yaml` in the bundle must be `<group>/<version>/<Kind>.yaml`: a lowercase group, a version like `v1` or `v1beta2`, and a capitalized kind. Other files, such as a README, are ignored. A `*.asl.yaml` manifest inside the bundle is an error.
- The group is not `asl`, and no file is named `Manifest.yaml`.
- The definition is valid, and it fixes the `apiVersion` and `kind` that its path implies.
- Every entry of `examples:` is valid for its definition.
- A definition can only inherit from other definitions in the bundle or from the built-in ones. Web addresses and files outside of them are rejected.

A `--schemas-bundle-path` that is not a directory also exits with `2`.

## Where it works

The same bundle works wherever ASL runs, not only in the terminal. See [How ASL works](./architecture.md#where-asl-runs). For the flag, exit codes and the format of diagnostics, see [CLI](./cli.md).
