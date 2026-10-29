---
sidebar_position: 2
title: CLI
---

# CLI

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

## Install

`asl` is a single static binary with no dependencies.

| OS      | Architectures                        |
| ------- | ------------------------------------ |
| macOS   | Apple Silicon (arm64), Intel (amd64) |
| Linux   | amd64, arm64                         |
| Windows | amd64, arm64                         |

### macOS and Linux

Works in bash, zsh and dash:

```sh
curl -fsSL https://raw.githubusercontent.com/architectureascode/asl/main/install.sh | sh
```

### Windows

In PowerShell:

```powershell
irm https://raw.githubusercontent.com/architectureascode/asl/main/install.ps1 | iex
```

If you use Git Bash, you can run the `install.sh` command above instead, but it only adds `asl` to the `PATH` of Git Bash. Use `install.ps1` to make it available in PowerShell and cmd.

### Pin a version

The latest release is installed by default. To pin a version, pass it as an argument:

```sh
curl -fsSL https://raw.githubusercontent.com/architectureascode/asl/main/install.sh | sh -s -- v0.4.0
```

```powershell
iex "& { $(irm https://raw.githubusercontent.com/architectureascode/asl/main/install.ps1) } -Version v0.4.0"
```

### Update

Run the install command again: it installs the latest release over the current one, in the directory you choose. `asl` also tells you when a newer release is available.

### Manual download

Download the binary for your system from the [latest release](https://github.com/architectureascode/asl/releases/latest). Checksums are published as `SHA256SUMS`.

Check that it works:

```sh
asl --version
```

## Usage

```sh
asl <path> [--policies-bundle-path <bundle>] [--schemas-bundle-path <dir>]
```

## Arguments

| Argument                 | Description                                                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `<path>`                 | A folder with your `*.asl.yaml` files (subfolders included), or a single file.                                                            |
| `--policies-bundle-path` | A file or folder with your [custom policies](./custom-policies.md). They run **in addition to** the built-in ones.                        |
| `--schemas-bundle-path`  | A folder of [custom schemas](./custom-schemas.md), laid out as `<group>/<version>/<Kind>.yaml`. They are **added** to the built-in kinds. |

:::warning
A folder with no matching files is an **error**, not a silent `ok`. A mistyped or empty path never passes unnoticed.
:::

## Reading the result

Back to [our story](./intro.md): the agent proposed that `recommendation-service` reads from `orders-db`, which `orders-service` already uses. This is what the check says:

```asldiag
error: Database must not be shared between applications; each application owns its data
  --> architecture/orders.asl.yaml:18
  policy: acme.no-shared-database

error: could not compile due to 1 previous error (10.1ms)
```

After the agent gives `recommendation-service` a database of its own, the same command prints:

```asldiag
ok 5.8ms
```

Each error tells you what is wrong, where (file and line) and which [policy](./custom-policies.md#your-first-policy) raised it. Fix what it points at and run the command again.

### Warnings

A policy can report a `warning` instead of an `error`. Warnings are printed, but they do not fail the run:

```asldiag
warning: Database should have a single writing application
  --> architecture/inventory.asl.yaml:19
  policy: acme.database-single-writer

warning: compiled with 1 warning (6.9ms)
```

## Exit codes

| Code | Meaning                                                                                                      |
| ---- | ------------------------------------------------------------------------------------------------------------ |
| `0`  | Nothing to report, or only warnings.                                                                         |
| `1`  | At least one error. The architecture is not valid.                                                           |
| `2`  | `asl` could not run the check: the path does not exist, the folder has no manifests, or a bundle is invalid. |

```text
$ asl ./empty-folder
no *.asl.yaml files found under ./empty-folder
```
