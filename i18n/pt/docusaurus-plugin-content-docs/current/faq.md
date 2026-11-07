---
sidebar_position: 4
title: FAQ
---

# FAQ

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

As perguntas que as pessoas fazem primeiro, com respostas curtas e um link para a página que aprofunda.

## O que é o ASL?

O ASL, **Architecture Specification Language** (linguagem de especificação de arquitetura), permite descrever aplicações, bancos de dados e os relacionamentos entre eles em pequenos arquivos YAML. O comando `asl` confere tudo contra regras nativas e customizadas, em milissegundos. Comece pela [introdução](./intro.md).

## Qual a diferença para Diagram as Code?

Diagram as Code gera um desenho a partir de texto. O ASL é uma especificação: pode ser compilada, conferida contra regras e lida por agentes. Veja [Arquitetura como código vs Diagram as Code](./aac-vs-diagram-as-code.md).

## Por que não descrever a arquitetura em Markdown?

Markdown é texto livre para interpretar. Cada revisão lê todos os arquivos, gasta tokens e pode variar entre execuções. O ASL é tipado e conferido por um compilador, então a mesma entrada dá o mesmo resultado. Veja [Markdown descreve, uma linguagem pode ser verificada](./why.md#markdown-descreve-uma-linguagem-pode-ser-verificada).

## Preciso de IA ou de um LLM para usar?

Não. Você pode usar IA para gerar as especificações, mas compilar e verificar não usa LLM: o compilador é determinístico, e a mesma entrada sempre dá o mesmo resultado.

## Onde posso usar?

Um único compilador, o mesmo resultado em todo lugar:

- No seu pipeline, com o [CLI](./cli.md).
- No seu editor, com a [extensão do VS Code](./vscode-extension.md).
- No navegador e no Node.js, com o [SDK de JavaScript](./javascript.md).
- Em Go e Python, para integrar as mesmas checagens nas suas ferramentas.

## Posso escrever as minhas próprias regras?

Pode. Uma [policy customizada](./custom-policies.md) é um pequeno arquivo YAML com uma expressão em [CEL](https://cel.dev), e [schemas customizados](./custom-schemas.md) ensinam ao ASL os seus próprios kinds, sem mexer no compilador.

## Como os agentes usam?

Como a arquitetura é código tipado que compila, o agente ganha contexto para ler, guardrails para respeitar e feedback para se corrigir. Veja [o que isso habilita para agentes](./why.md#o-que-isso-habilita-para-agentes) e os [casos de uso](./use-cases/designing.mdx).

## Já está pronto para produção?

O ASL está em desenvolvimento ativo, e partes da linguagem e destes docs ainda podem mudar.
