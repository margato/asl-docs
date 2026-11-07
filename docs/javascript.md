---
sidebar_position: 4
title: JavaScript SDK
---

# JavaScript SDK

ASL is not only a command. The same compiler is available as an npm package, so you can use ASL as the foundation of your own tools. A diagram editor in the browser, for example, can validate the architecture behind the drawing against your rules as people draw, with no server involved.

The `@architectureascode/asl` package is the same compiler as the [`asl` command](./cli.md), packaged for JavaScript. It runs in the browser and in Node.js, with no binary to install, and it gives the same result on the same manifests and the same [policies](./custom-policies.md).

## Try it

This playground runs the `@architectureascode/asl` JavaScript library: the compiler is loaded in your browser as WebAssembly, and `compile()` runs again on every keystroke, with no server involved. It checks YAML text, the string form of `compile`.

The database has no provider, so there is an error. Replace `spec: {}` with this and the error goes away:

```yaml
spec:
  providers:
    aws: RDSPostgreSQL
```

<Playground />

Want more room? [Try it in the full playground](/playground), with ready-made examples to start from.

## Install

```sh
npm install @architectureascode/asl
```

It needs Node.js 18 or newer, works with any modern bundler (Vite, webpack, esbuild...), and ships its TypeScript types.

## Check an architecture

`compile` takes your manifests and resolves to a list of **diagnostics**. An empty list means the architecture is valid.

Pass the manifests as a list of plain JavaScript objects, one per component, so there is no YAML to write by hand:

```js title="check.mjs"
import { compile } from '@architectureascode/asl';

const components = [
  {
    apiVersion: 'asl/v1',
    kind: 'Database',
    metadata: { name: 'orders-db' },
    spec: {},
  },
];

const diagnostics = await compile(components);
```

The database has no provider yet, so `diagnostics` is:

```json
[
  {
    "file": "",
    "line": 1,
    "policy": "asl.builtin.api-contract",
    "severity": "error",
    "message": "spec: missing properties: 'providers'"
  }
]
```

Once the `spec` has a provider, the architecture is valid:

```js
const components = [
  {
    apiVersion: 'asl/v1',
    kind: 'Database',
    metadata: { name: 'orders-db' },
    spec: { providers: { aws: 'RDSPostgreSQL' } },
  },
];

const diagnostics = await compile(components);
```

```json
[]
```

An empty list means ASL found nothing to report: the manifest follows its kind's definition and every policy passed, so this architecture can go ahead.

A list is always a list, even with a single manifest. A lone object is rejected with a `TypeError`. A list can hold as many components as your drawing has, and they see each other, so a `Relationship` can point at a `Database` declared next to it.

If you already have the YAML, pass it as a string, with one or several documents separated by `---`:

```js
const diagnostics = await compile(`
apiVersion: asl/v1
kind: Application
metadata:
  name: checkout-service
spec:
  providers:
    aws: EKS
  language: Go
---
apiVersion: asl/v1
kind: Database
metadata:
  name: orders-db
spec:
  providers:
    aws: RDSPostgreSQL
---
apiVersion: asl/v1
kind: Relationship
metadata:
  name: checkout-service-to-orders-db
spec:
  relations:
    - from: {kind: Application, name: checkout-service}
      to: {kind: Database, name: orders-db}
      type: readsAndWrites
`);
```

```json
[]
```

Again an empty list. The three manifests are valid on their own, and together they hold up: the `Relationship` says `checkout-service` reads and writes `orders-db`, and both exist in the same text. Had the relationship pointed at an `orders-database` that nobody declared, you would get a diagnostic for it instead.

### Reading a diagnostic

| Field      | Meaning                                                                           |
| ---------- | --------------------------------------------------------------------------------- |
| `severity` | `error` or `warning`. Only errors make an architecture invalid.                   |
| `message`  | What is wrong.                                                                    |
| `policy`   | The policy that raised it, for example `asl.builtin.api-contract`.                |
| `line`     | The line in the text you passed, starting at 1. `0` when the position is unknown. |
| `file`     | Empty, because the text did not come from a file.                                 |

Two helpers go with it. `hasErrors(diagnostics)` answers "is it valid?" and ignores warnings, like the [exit code](./cli.md#exit-codes) of the command. `formatDiagnostic(diagnostic)` turns one diagnostic into a line you can print:

```js
import { hasErrors, formatDiagnostic } from '@architectureascode/asl';

if (hasErrors(diagnostics)) {
  console.error(diagnostics.map(formatDiagnostic).join('\n'));
}
```

```asldiag
<input>:1: error: spec: missing properties: 'providers' (asl.builtin.api-contract)
```

Mistakes in the **manifests**, however broken, always come back as diagnostics and never throw. A bug in **your call**, like passing a lone object or `undefined`, rejects right away with a `TypeError`:

```js
await compile(undefined);
// TypeError: compile: manifests must be a YAML string or an array of objects, got undefined
```

## In the browser

The package ships the compiler as WebAssembly, about 5 MB gzipped. Your bundler serves it next to your code, and the first `compile` loads it. After that the compiler is reused, so you can call `compile` again on every change, with no server involved.

To avoid a pause on the first call, load it when the page starts:

```js
import { init } from '@architectureascode/asl';

await init();
```

If your bundler does not find the WebAssembly file on its own, point to it. With Vite:

```js
import { init } from '@architectureascode/asl';
import wasmUrl from '@architectureascode/asl/asl.wasm.gz?url';

await init(wasmUrl);
```

## Where next

- [CLI](./cli.md): the same checks in your terminal and in CI.
- [VS Code extension](./vscode-extension.md): the same checks in the editor you already use.
- [Custom policies](./custom-policies.md) and [custom schemas](./custom-schemas.md): the rules and kinds you pass to `compile`.
- [`examples/web`](https://github.com/architectureascode/asl/tree/main/examples/web): a complete editor built on `compile`, in React.
