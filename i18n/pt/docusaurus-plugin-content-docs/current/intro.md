---
slug: /intro
sidebar_position: 1
title: Introdução
---

# Introdução

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

Duas semanas antes da Black Friday, um agente adicionou o `recommendation-service` à sua loja online. Funcionou, então foi para produção. Ninguém reparou que ele lê direto do `orders-db`, o banco do `orders-service`, um padrão que a sua empresa proíbe. Agora uma consulta lenta na página de recomendações deixa o checkout lento. A regra existe, mas mora numa wiki que ninguém confere.

O ASL, a **Architecture Specification Language**, é como a sua empresa impede que isso aconteça de novo. Você descreve aplicações, bancos e as relações entre eles em arquivos YAML pequenos. O comando `asl` confere tudo, em milissegundos, contra as regras que importam para você.

```sh
asl ./architecture
```
## O que você ganha

- **Manifests validados.** Cada kind (`Application`, `Database`, `Relationship`...) tem uma definição. Um manifest com erro de digitação ou campo faltando é rejeitado com uma mensagem clara.
- **Um grafo de dependências de verdade.** Os relacionamentos ligam seus manifests. Uma referência para algo que não existe é um erro, não uma surpresa em produção.
- **Policies.** Regras built-in mais as suas, como "um banco pertence a uma única aplicação".
- **Saída pronta para CI.** Diagnósticos legíveis e um exit code que o seu pipeline entende.

## Um primeiro manifest

```yaml title="architecture/orders.asl.yaml"
apiVersion: asl/v1
kind: Application
metadata:
  name: orders-service
  labels:
    owner: team-orders
spec:
  providers:
    aws: EKS
  language: Go
```
Todo manifest tem `apiVersion`, `kind` e `metadata`. O resto vai em `spec`, e o que é permitido ali depende do kind.

Rode `asl ./architecture` e você recebe `ok`. Adicione uma segunda aplicação que divide o banco com a primeira, junto da regra que proíbe isso, e o resultado vira um erro. É exatamente isso que você vai fazer em [Custom policies](./custom-policies.md).

## Para onde ir agora

- [CLI](./cli.md): rode a checagem na sua máquina e no CI.
- [Custom policies](./custom-policies.md): escreva suas próprias regras.
- [Custom schemas](./custom-schemas.md): ensine ao ASL os seus próprios kinds.
- [Por que arquitetura como código](./why.md) e [como ela difere de Diagram as Code](./aac-vs-diagram-as-code.md).
- [Como o ASL funciona](./architecture.md): o que acontece entre o seu YAML e o veredito.
