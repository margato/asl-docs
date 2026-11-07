---
sidebar_position: 3
title: How ASL works
---

# How ASL works

:::warning[Work in progress]
This page is a work in progress. Content may change or be incomplete.
:::

You run `asl ./architecture` on your architecture folder and, a blink later, it says that `courier-app` publishes to `dispatch-queue`, which nobody declared. Nobody opened a diagram, and no LLM was asked for an opinion. What happened in that blink?

Five steps, always in the same order. The same input gives the same result every time, which is why it costs nothing to run on every commit.

```mermaid
flowchart LR
    Y["<b>Read</b><br/>your YAML files"] --> V["<b>Validate</b><br/>against kind definitions"]
    V --> G["<b>Build the graph</b><br/>relationships become edges"]
    G --> P["<b>Run policies</b><br/>built-in and yours"]
    P --> R["<b>Report</b><br/>diagnostics and exit code"]
```

## 1. Read

`asl` finds every `*.asl.yaml` in the folder you pass, including subfolders. One file can hold many manifests, separated by `---`. An empty folder is an error, so a wrong path never looks like success.

## 2. Validate

Every kind has a **definition**: which fields a manifest of that kind may have, which are required and which values are allowed. A manifest that does not match is reported as an error. You can add kinds of your own, or extend a built-in one, with [custom schemas](./custom-schemas.md).

## 3. Build the graph

Applications, databases and the other manifests become the nodes of a graph. Each entry of a `Relationship` becomes an edge between two of them, with a type such as `reads`, `writes` or `calls`. Along the way `asl` checks that:

- every `kind` is known;
- no two manifests share the same kind and name;
- every relationship points to manifests that exist.

A reference to something that does not exist is reported as an error.

## 4. Run policies

Built-in policies run first, then your [custom policies](./custom-policies.md). Policies look at the whole graph, which is how a rule like "a database belongs to a single application" is possible: no single manifest knows the answer.

## 5. Report

Problems are printed one block each, with the file and line. Errors turn into exit code `1`, and warnings do not fail the run. Nothing stops at the first problem: you see everything in one go. See [CLI](./cli.md) for the format.

## Where ASL runs

Your architects use the terminal. Your platform team wants the same check inside an internal portal. A data team wants it in a Python script. All of them must get the same result, or the rules stop being rules.

That is why the checking logic is one piece, and everything else is a thin layer around it: the `asl` command for terminals and CI, a browser and Node build, a Python binding, and Go programs. Custom schemas and custom policies plug in from the outside, without changing anything inside.

```mermaid
flowchart LR
    subgraph EXT["Extensibility"]
        direction TB
        SCHEMA_FILES["Custom Schemas"]
        POLICY_FILES["Custom Policies"]
    end

    subgraph KERNEL["ASL Kernel · Go"]
        direction TB
        API["Public API"]

        subgraph COMPONENTS["Kernel Components"]
            direction TB
            PARSER["Parser"]
            COMPILER["Compiler"]
            SCHEMAS["Schemas Loader"]
            POLICIES["Policy Engine"]
            BUILTIN_S["Built-in Schemas"]
            BUILTIN_P["Built-in Policies"]
        end

        API --> PARSER
    end

    subgraph PYTHON["Python"]
        direction TB
        PY["Python Application"]
        PYSDK["ASL Python SDK"]
        ABI["C ABI Binding"]

        PY --> PYSDK --> ABI
    end

    subgraph BROWSER["Browser"]
        direction TB
        WEB["Web UI"]
        JSSDK["ASL JavaScript SDK"]
        WASM["WebAssembly Binding"]

        WEB --> JSSDK --> WASM
    end

    subgraph GOAPP["Go"]
        direction TB
        GO["Main"]

    end

    PARSER --> SCHEMAS
    PARSER --> COMPILER
    COMPILER --> POLICIES

    SCHEMAS --> BUILTIN_S
    POLICIES --> BUILTIN_P

    SCHEMAS --> SCHEMA_FILES
    POLICIES --> POLICY_FILES

    ABI --> API
    WASM --> API
    GO --> API


    classDef adapter fill:#e0e7ff,stroke:#4f6bff,color:#1e2a78
    classDef core fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef api fill:#fef3c7,stroke:#d97706,color:#78350f
    classDef extension fill:#cffafe,stroke:#0891b2,color:#164e63
    classDef builtin fill:#f3f4f6,stroke:#6b7280,color:#374151

    class PY,PYSDK,ABI,WEB,JSSDK,WASM,GO,GOLIB adapter
    class PARSER,COMPILER,SCHEMAS,POLICIES core
    class API api
    class SCHEMA_FILES,POLICY_FILES extension
    class BUILTIN_S,BUILTIN_P builtin
```

You choose where it runs. The rules, and the result, stay the same.
