---
sidebar_position: 4
title: JavaScript SDK
---

# JavaScript SDK

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

A ASL não é só um comando. O mesmo compilador está disponível como um pacote npm, para você usar a ASL como base das suas próprias ferramentas. Um editor de diagramas no navegador, por exemplo, pode validar a arquitetura por trás do desenho contra as suas regras enquanto as pessoas desenham, sem nenhum servidor.

O pacote `@architectureascode/asl` é o mesmo compilador do [comando `asl`](./cli.md), empacotado para JavaScript. Roda no navegador e no Node.js, sem binário para instalar, e dá o mesmo veredito sobre os mesmos manifests e as mesmas [policies](./custom-policies.md).

## Experimente

Este playground roda a biblioteca JavaScript `@architectureascode/asl`: o compilador é carregado no seu navegador como WebAssembly, e o `compile()` roda de novo a cada tecla, sem servidor. Ele confere texto YAML, a forma de string do `compile`.

O banco não tem provider, então há um erro. Troque `spec: {}` por isto e o erro some:

```yaml
spec:
  providers:
    aws: RDSPostgreSQL
```

<Playground />

Quer mais espaço? [Experimente no playground completo](/playground), com exemplos prontos para começar.

## Instalação

```sh
npm install @architectureascode/asl
```

Precisa de Node.js 18 ou mais novo, funciona com qualquer bundler moderno (Vite, webpack, esbuild...) e já traz os tipos de TypeScript.

## Verifique uma arquitetura

`compile` recebe os seus manifests e devolve uma lista de **diagnósticos**. Lista vazia significa que a arquitetura é válida.

Passe os manifests como uma lista de objetos JavaScript comuns, um por componente, então não há YAML para escrever à mão:

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

O banco de dados ainda não tem provider, então `diagnostics` é:

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

Com um provider no `spec`, a arquitetura é válida:

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

Lista vazia significa que a ASL não encontrou nada a reportar: o manifest segue a definição do seu kind e todas as policies passaram, então esta arquitetura pode seguir em frente.

Uma lista é sempre uma lista, mesmo com um único manifest. Um objeto solto é rejeitado com um `TypeError`. A lista pode ter quantos componentes o seu desenho tiver, e eles enxergam uns aos outros, então uma `Relationship` pode apontar para um `Database` declarado ao lado dela.

Se você já tem o YAML, passe-o como string, com um ou vários documentos separados por `---`:

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

De novo, lista vazia. Os três manifests são válidos sozinhos e também se sustentam juntos: a `Relationship` diz que `checkout-service` lê e escreve em `orders-db`, e os dois existem no mesmo texto. Se a relação apontasse para um `orders-database` que ninguém declarou, você receberia um diagnóstico para ela.

### Lendo um diagnóstico

| Campo      | Significado                                                                            |
| ---------- | -------------------------------------------------------------------------------------- |
| `severity` | `error` ou `warning`. Só erros tornam a arquitetura inválida.                          |
| `message`  | O que está errado.                                                                     |
| `policy`   | A policy que o gerou, por exemplo `asl.builtin.api-contract`.                          |
| `line`     | A linha no texto que você passou, começando em 1. `0` quando a posição é desconhecida. |
| `file`     | Vazio, porque o texto não veio de um arquivo.                                          |

Dois helpers acompanham. `hasErrors(diagnostics)` responde "é válida?" e ignora warnings, como o [exit code](./cli.md#exit-codes) do comando. `formatDiagnostic(diagnostic)` transforma um diagnóstico numa linha pronta para imprimir:

```js
import { hasErrors, formatDiagnostic } from '@architectureascode/asl';

if (hasErrors(diagnostics)) {
  console.error(diagnostics.map(formatDiagnostic).join('\n'));
}
```

```asldiag
<input>:1: error: spec: missing properties: 'providers' (asl.builtin.api-contract)
```

Erros nos **manifests**, por mais quebrados que estejam, sempre voltam como diagnósticos e nunca lançam exceção. Um bug na **sua chamada**, como passar um objeto solto ou `undefined`, é rejeitado na hora com um `TypeError`:

```js
await compile(undefined);
// TypeError: compile: manifests must be a YAML string or an array of objects, got undefined
```

## Adapte às necessidades da sua empresa

:::warning[Em construção]
Esta seção está em construção. O conteúdo pode mudar ou estar incompleto.
:::

As verificações embutidas conhecem a ASL, não a sua empresa. `compile` recebe mais dois argumentos para a sua ferramenta aplicar as suas regras e entender os seus próprios kinds:

```js
const diagnostics = await compile(components, policies, schemas);
```

`policies` são as suas [custom policies](./custom-policies.md), como string YAML ou lista de objetos. `schemas` são os seus [custom schemas](./custom-schemas.md), como um objeto `{ '<grupo>/<versão>/<Kind>.yaml': string YAML ou objeto }`. Os dois rodam **além** dos embutidos, como `--policies-bundle-path` e `--schemas-bundle-path` no [comando `asl`](./cli.md).

O que ainda falta é carregar um bundle inteiro, a pasta que o comando lê, direto no navegador. Por enquanto você precisa passar o conteúdo por conta própria. Carregá-lo a partir de um único arquivo está no [issue #36](https://github.com/architectureascode/asl/issues/36).

## No navegador

O pacote traz o compilador em WebAssembly, cerca de 5 MB compactado. O seu bundler o serve junto com o seu código, e o primeiro `compile` o carrega. Depois disso o compilador é reaproveitado, então você pode chamar `compile` de novo a cada mudança, sem nenhum servidor.

Para evitar uma pausa na primeira chamada, carregue-o quando a página iniciar:

```js
import { init } from '@architectureascode/asl';

await init();
```

Se o seu bundler não achar o arquivo WebAssembly sozinho, aponte para ele. Com Vite:

```js
import { init } from '@architectureascode/asl';
import wasmUrl from '@architectureascode/asl/asl.wasm.gz?url';

await init(wasmUrl);
```

## Próximos passos

- [CLI](./cli.md): as mesmas verificações no terminal e no CI.
- [Extensão do VS Code](./vscode-extension.md): as mesmas verificações no editor que você já usa.
- [Custom policies](./custom-policies.md) e [custom schemas](./custom-schemas.md): as regras e os kinds que você passa para `compile`.
- [`examples/web`](https://github.com/architectureascode/asl/tree/main/examples/web): um editor completo feito sobre o `compile`, em React.
