---
sidebar_position: 2
title: CLI
---

# CLI

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

Você acabou de escrever seus primeiros manifests. Antes de abrir um pull request, quer saber se eles quebram alguma regra, e quer que o CI derrube o build quando quebrarem. É o mesmo comando nos dois casos: rode na sua máquina enquanto trabalha e deixe o pipeline rodar de novo a cada pull request.

```sh
asl <path> [--policies-bundle-path <bundle>] [--schemas-bundle-path <dir>]
```
## Argumentos

| Argumento | Descrição |
| --- | --- |
| `<path>` | Uma pasta com seus arquivos `*.asl.yaml` (subpastas incluídas), ou um único arquivo. |
| `--policies-bundle-path` | Um arquivo ou pasta com as suas [custom policies](./custom-policies.md). Elas rodam **além** das built-in. |
| `--schemas-bundle-path` | Uma pasta de [custom schemas](./custom-schemas.md), organizada como `<group>/<version>/<Kind>.yaml`. Eles são **somados** aos kinds built-in. |

:::warning
Uma pasta sem arquivos correspondentes é um **erro**, não um `ok` silencioso. Um path errado ou vazio nunca passa despercebido.
:::

## Lendo o resultado

De volta à nossa história: o agente propôs que o `billing-service` leia do `credit-db`, que o `credit-service` já usa. Esta é a resposta da checagem:

```asldiag
error: Database must not be shared between applications; each application owns its data
  --> architecture/credit.asl.yaml:18
  policy: acme.no-shared-database

error: could not compile due to 1 previous error (10.1ms)
```
Depois que o agente dá ao `billing-service` um banco só dele, o mesmo comando imprime:

```asldiag
ok 5.8ms
```
Cada erro diz o que está errado, onde (arquivo e linha) e qual policy o levantou. Corrija o ponto indicado e rode o comando de novo.

### Warnings

Uma policy pode reportar um `warning` em vez de um `error`. Warnings são impressos, mas não fazem a execução falhar:

```asldiag
warning: Database should have a single writing application
  --> architecture/orders.asl.yaml:19
  policy: acme.database-single-writer

warning: compiled with 1 warning (6.9ms)
```
## Exit codes

| Código | Significado |
| --- | --- |
| `0` | Nada a reportar, ou só warnings. |
| `1` | Pelo menos um erro. A arquitetura não é válida. |
| `2` | O `asl` não conseguiu rodar a checagem: o path não existe, a pasta não tem manifests ou um bundle é inválido. |

```text
$ asl ./empty-folder
no *.asl.yaml files found under ./empty-folder
```
## No CI

Como erros viram exit code `1`, qualquer pipeline para neles sem configuração extra:

```yaml title=".github/workflows/architecture.yml"
- name: Check architecture
  run: asl ./architecture --policies-bundle-path ./policies
```
O step falha num erro, passa num `ok` ou em warnings, e imprime os mesmos blocos que você viu acima.
