---
sidebar_position: 3
title: Como o ASL funciona
---

# Como o ASL funciona

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

Você executa `asl ./architecture` na pasta da sua arquitetura e, num piscar de olhos, ele avisa que o `courier-app` publica na `dispatch-queue`, que ninguém declarou. Ninguém abriu um diagrama, e nenhum LLM foi consultado. O que aconteceu nesse piscar?

Cinco etapas, sempre na mesma ordem. A mesma entrada dá o mesmo resultado toda vez, e é por isso que não custa nada executar a cada commit.

```mermaid
flowchart LR
    Y["<b>Ler</b><br/>seus arquivos YAML"] --> V["<b>Validar</b><br/>contra a definição de cada kind"]
    V --> G["<b>Montar o grafo</b><br/>relacionamentos viram arestas"]
    G --> P["<b>Executar policies</b><br/>built-in e as suas"]
    P --> R["<b>Reportar</b><br/>diagnósticos e exit code"]
```

## 1. Ler

O `asl` encontra todo `*.asl.yaml` na pasta que você passar, incluindo subpastas. Um arquivo pode ter vários manifests, separados por `---`. Uma pasta vazia é um erro, então um path errado nunca parece sucesso.

## 2. Validar

Todo kind tem uma **definição**: quais campos um manifest daquele kind pode ter, quais são obrigatórios e quais valores são aceitos. Um manifest que não bate com ela é reportado como erro. Você pode criar kinds próprios, ou estender um built-in, com [custom schemas](./custom-schemas.md).

## 3. Montar o grafo

Aplicações, bancos e os demais manifests viram os nós de um grafo. Cada item de um `Relationship` vira uma aresta entre dois deles, com um tipo como `reads`, `writes` ou `calls`. No caminho, o `asl` confere que:

- todo `kind` é conhecido;
- não existem dois manifests com o mesmo kind e nome;
- todo relacionamento aponta para manifests que existem.

Uma referência para algo que não existe é reportada como erro.

## 4. Executar policies

As policies built-in executam primeiro, depois as suas [custom policies](./custom-policies.md). As policies enxergam o grafo inteiro, e é assim que uma regra como "um banco pertence a uma única aplicação" é possível: nenhum manifest sozinho sabe a resposta.

## 5. Reportar

Os problemas saem um bloco por vez, com arquivo e linha. Erros viram exit code `1`, e warnings não fazem a execução falhar. Nada para no primeiro problema: você vê tudo de uma vez. O formato está em [CLI](./cli.md).

## Onde o ASL executa

Os seus arquitetos usam o terminal. O seu time de plataforma quer a mesma checagem dentro de um portal interno. O time de dados quer num script Python. Todos precisam receber o mesmo resultado, ou as regras deixam de ser regras.

Por isso a lógica de checagem é uma peça só, e todo o resto é uma camada fina em volta dela: o comando `asl` para terminal e CI, um build para navegador e Node, um binding para Python e programas em Go. Custom schemas e custom policies entram por fora, sem mudar nada por dentro.

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

Você escolhe onde executa. As regras, e o resultado, continuam as mesmas.
