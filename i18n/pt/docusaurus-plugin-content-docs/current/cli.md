---
sidebar_position: 2
title: CLI
---

# CLI

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

## Instalação

O `asl` é um único binário estático, sem dependências. Escolha o seu sistema operacional:

| SO | Arquiteturas | Local padrão |
| --- | --- | --- |
| macOS | Apple Silicon (arm64), Intel (amd64) | `~/.asl/bin` |
| Linux | amd64, arm64 | `~/.asl/bin` |
| Windows | amd64, arm64 | `%USERPROFILE%\.asl\bin` |

### macOS e Linux

Funciona em bash, zsh e dash:

```sh
curl -fsSL https://raw.githubusercontent.com/architectureascode/asl/main/install.sh | sh
```

### Windows

No PowerShell:

```powershell
irm https://raw.githubusercontent.com/architectureascode/asl/main/install.ps1 | iex
```

Se você usa o Git Bash, pode executar o comando do `install.sh` acima, mas ele só adiciona o `asl` ao `PATH` do Git Bash. Use o `install.ps1` para deixá-lo disponível no PowerShell e no cmd.

### Fixar uma versão

A última release é instalada por padrão. Para fixar uma versão, passe-a como argumento:

```sh
curl -fsSL https://raw.githubusercontent.com/architectureascode/asl/main/install.sh | sh -s -- v0.4.0
```

```powershell
iex "& { $(irm https://raw.githubusercontent.com/architectureascode/asl/main/install.ps1) } -Version v0.4.0"
```

### Atualizar

Execute o comando de instalação de novo: ele instala a última release por cima da atual, na pasta que você escolher. O `asl` também avisa quando há uma versão nova.

### Download manual

Baixe o binário do seu sistema na [última release](https://github.com/architectureascode/asl/releases/latest) (`asl-macos-arm64`, `asl-macos-amd64`, `asl-linux-amd64`, `asl-linux-arm64`, `asl-windows-amd64.exe` ou `asl-windows-arm64.exe`). Os checksums ficam em `SHA256SUMS`.

Confira se funciona:

```sh
asl --version
```

## Uso

```sh
asl <path> [--policies-bundle-path <bundle>] [--schemas-bundle-path <dir>]
```
## Argumentos

| Argumento | Descrição |
| --- | --- |
| `<path>` | Uma pasta com seus arquivos `*.asl.yaml` (subpastas incluídas), ou um único arquivo. |
| `--policies-bundle-path` | Um arquivo ou pasta com as suas [custom policies](./custom-policies.md). Elas executam **além** das built-in. |
| `--schemas-bundle-path` | Uma pasta de [custom schemas](./custom-schemas.md), organizada como `<group>/<version>/<Kind>.yaml`. Eles são **somados** aos kinds built-in. |

:::warning
Uma pasta sem arquivos correspondentes é um **erro**, não um `ok` silencioso. Um path errado ou vazio nunca passa despercebido.
:::

## Lendo o resultado

De volta à [nossa história](./intro.md): o agente propôs que o `recommendation-service` leia do `orders-db`, que o `orders-service` já usa. Esta é a resposta da checagem:

```asldiag
error: Database must not be shared between applications; each application owns its data
  --> architecture/orders.asl.yaml:18
  policy: acme.no-shared-database

error: could not compile due to 1 previous error (10.1ms)
```
Depois que o agente dá ao `recommendation-service` um banco só dele, o mesmo comando imprime:

```asldiag
ok 5.8ms
```
Cada erro diz o que está errado, onde (arquivo e linha) e qual [policy](./custom-policies.md#sua-primeira-policy) o levantou. Corrija o ponto indicado e execute o comando de novo.

### Warnings

Uma policy pode reportar um `warning` em vez de um `error`. Warnings são impressos, mas não fazem a execução falhar:

```asldiag
warning: Database should have a single writing application
  --> architecture/inventory.asl.yaml:19
  policy: acme.database-single-writer

warning: compiled with 1 warning (6.9ms)
```
## Exit codes

| Código | Significado |
| --- | --- |
| `0` | Nada a reportar, ou só warnings. |
| `1` | Pelo menos um erro. A arquitetura não é válida. |
| `2` | O `asl` não conseguiu executar a checagem: o path não existe, a pasta não tem manifests ou um bundle é inválido. |

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
