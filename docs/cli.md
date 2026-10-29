---
sidebar_position: 2
title: CLI
---

# CLI

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

You just wrote your first manifests. Before you open a pull request, you want to know whether they break a rule, and you want your CI to stop the build when they do. It is the same command in both cases: run it on your machine while you work, and let your pipeline run it again on every pull request.

```sh
asl <path> [--policies-bundle-path <bundle>] [--schemas-bundle-path <dir>]
```

## Arguments

| Argument | Description |
| --- | --- |
| `<path>` | A folder with your `*.asl.yaml` files (subfolders included), or a single file. |
| `--policies-bundle-path` | A file or folder with your [custom policies](./custom-policies.md). They run **in addition to** the built-in ones. |
| `--schemas-bundle-path` | A folder of [custom schemas](./custom-schemas.md), laid out as `<group>/<version>/<Kind>.yaml`. They are **added** to the built-in kinds. |

:::warning
A folder with no matching files is an **error**, not a silent `ok`. A mistyped or empty path never passes unnoticed.
:::

## Reading the result

Back to our story: the agent proposed that `billing-service` reads from `credit-db`, which `credit-service` already uses. This is what the check says:

```asldiag
error: Database must not be shared between applications; each application owns its data
  --> architecture/credit.asl.yaml:18
  policy: acme.no-shared-database

error: could not compile due to 1 previous error (10.1ms)
```

After the agent gives `billing-service` a database of its own, the same command prints:

```asldiag
ok 5.8ms
```

Each error tells you what is wrong, where (file and line) and which policy raised it. Fix what it points at and run the command again.

### Warnings

A policy can report a `warning` instead of an `error`. Warnings are printed, but they do not fail the run:

```asldiag
warning: Database should have a single writing application
  --> architecture/orders.asl.yaml:19
  policy: acme.database-single-writer

warning: compiled with 1 warning (6.9ms)
```

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Nothing to report, or only warnings. |
| `1` | At least one error. The architecture is not valid. |
| `2` | `asl` could not run the check: the path does not exist, the folder has no manifests, or a bundle is invalid. |

```text
$ asl ./empty-folder
no *.asl.yaml files found under ./empty-folder
```

## In CI

Because errors turn into exit code `1`, any pipeline stops on them without extra configuration:

```yaml title=".github/workflows/architecture.yml"
- name: Check architecture
  run: asl ./architecture --policies-bundle-path ./policies
```

The step fails on an error, passes on `ok` or on warnings, and prints the same blocks you saw above.
