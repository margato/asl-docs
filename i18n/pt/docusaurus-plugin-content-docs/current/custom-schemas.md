---
sidebar_position: 2
title: Custom schemas
---

# Custom schemas

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

A sua empresa registra qual time é dono de cada aplicação e qual centro de custo paga por ela. O kind `Application` built-in não sabe nada de times nem de centros de custo. Hoje essa informação mora numa planilha, e ninguém confere. No mês passado, o agente que adicionou o `billing-service` inventou um nome de time que não existia, e a fatura não chegou a ninguém.

Você quer que o ASL entenda um `Team`, exija um centro de custo em toda aplicação e recuse uma aplicação que aponta para um time inexistente.

Um **custom schema** é a forma de ensinar ao ASL um kind novo, ou de acrescentar campos a um existente. É um arquivo YAML que define o que um manifest daquele kind pode conter. O `asl` usa essa definição para validar todo manifest do kind, exatamente como faz com os built-in. Você pode escrever uma definição do zero, ou **herdar** uma built-in e estendê-la.

Seus kinds ficam no seu próprio **group** (por exemplo, `acme/v1`). Eles são **somados** aos kinds built-in e nunca os substituem.

## Carregue um bundle

Aponte o `asl` para uma pasta com a flag `--schemas-bundle-path`:

```sh
asl ./architecture --schemas-bundle-path ./schemas-bundle
```
O bundle é uma árvore de arquivos `<group>/<version>/<Kind>.yaml`:

```text
schemas-bundle/
  acme/v1/Team.yaml
  acme/v1/Application.yaml
```
Um arquivo em `acme/v1/Team.yaml` define manifests com `apiVersion: acme/v1` e `kind: Team`. Os kinds built-in seguem o mesmo formato, em `asl/v1/`.

Sem a flag, o `asl` não conhece os seus kinds e os rejeita:

```text
error: unknown apiVersion "acme/v1"
  --> architecture/billing.asl.yaml:1
  policy: asl.builtin.api-contract
```
## O que é reservado

O group `asl` pertence aos kinds built-in. Um bundle não pode definir nada em `asl/`, então `Relationship`, `CustomPolicy` e os demais kinds built-in não podem ser alterados nem substituídos. Qualquer outro group é seu.

Um manifest é identificado por `apiVersion` + `kind` + `name`. Uma `Application` `acme/v1` chamada `billing` e uma `Application` `asl/v1` chamada `billing` são manifests diferentes, assim como `acme/v1` e `acme/v2`.

## Seu primeiro kind

Comece pelo `Team`. A definição abaixo é escrita do zero: diz que um time tem um `email` obrigatório, e mais nada.

```yaml title="schemas-bundle/acme/v1/Team.yaml"
allOf:
  - $ref: ../../asl/v1/Manifest.yaml     # apiVersion, kind and metadata
  - type: object
    required: [spec]
    properties:
      apiVersion:
        const: acme/v1
      kind:
        const: Team
      spec:
        type: object
        additionalProperties: false
        required: [email]
        properties:
          email:
            type: string
unevaluatedProperties: false
examples:
  - apiVersion: acme/v1
    kind: Team
    metadata:
      name: payments
    spec:
      email: payments@acme.example
```
Alguns pontos para reparar:

- A primeira linha herda a definição-base que todo manifest tem: `apiVersion`, `kind` e `metadata`. Você não precisa repeti-los.
- A definição é **fechada**: um campo que você não listou é rejeitado. É isso que pega erros de digitação. Feche todo objeto que você adicionar, inclusive os aninhados.
- Os `examples` são conferidos quando o bundle é carregado, então servem também como teste da sua definição.

## Estenda um kind built-in

Agora o centro de custo. Você não quer reescrever tudo que a `Application` já sabe sobre providers, linguagens e interfaces. Em vez disso, a sua `Application` **herda** a definição built-in e acrescenta um campo obrigatório. Os kinds de recurso (`Application`, `APIGateway`, `Database`, `Queue` e `Topic`) podem ser estendidos assim:

```yaml title="schemas-bundle/acme/v1/Application.yaml"
allOf:
  - $ref: ../../asl/v1/Manifest.yaml
  - type: object
    required: [spec]
    properties:
      apiVersion:
        const: acme/v1
      kind:
        const: Application
      spec:
        allOf:
          - $ref: ../../asl/v1/Application.yaml#/$defs/spec
        required: [costCenter]
        properties:
          costCenter:
            type: string
            pattern: "^cc-[0-9]+$"
        unevaluatedProperties: false
unevaluatedProperties: false
examples:
  - apiVersion: acme/v1
    kind: Application
    metadata:
      name: billing
    spec:
      providers:
        aws: EKS
      language: Go
      costCenter: cc-1042
```
Uma `Application` `acme/v1` aceita tudo que uma `asl/v1` aceita, validado pelas mesmas regras, mais um `costCenter` obrigatório que precisa ter a forma `cc-1042`. O kind built-in não é alterado.

## Use kinds customizados em um Relationship

Um `Team` só serve se algo se referir a ele. Aplicações e bancos continuam se conectando por meio de `Relationship`, e você pode apontar qualquer ponta de uma aresta para os seus kinds.

Em um `Relationship`, um kind é um nome simples, que significa o group do próprio Relationship (`asl/v1`), ou `group/version/Kind`:

```yaml
apiVersion: asl/v1
kind: Relationship
metadata:
  name: billing-relations
spec:
  relations:
    - from: { kind: acme/v1/Application, name: billing }
      to: { kind: Database, name: billing-db }
      type: readsAndWrites
```
Escrever só `Team` quando existe apenas um `Team` em `acme/v1` falha: `Team` significaria o `Team` de `asl/v1`, que não existe.

:::note
As regras de relacionamento built-in só conhecem os kinds built-in. Uma aresta com um kind de group customizado em qualquer ponta não é julgada por elas. Escreva uma [custom policy](./custom-policies.md) para essas regras.
:::

## Mire kinds customizados em uma policy

Esta é a parte que barra o time inventado. Uma [custom policy](./custom-policies.md) pode selecionar o seu kind com `selector.apiVersion`. Aqui, toda `Application` `acme/v1` precisa pertencer a um `Team` que exista:

```yaml title="policies/application-has-known-team.asl.yaml"
apiVersion: asl/v1
kind: CustomPolicy
metadata:
  name: application-has-known-team
  namespace: acme
spec:
  severity: error
  selector:
    apiVersion: acme/v1
    kind: Application
  assertions:
    - expression: "'team' in manifest.labels && manifests.exists(m, m.kind == 'Team' && m.name == manifest.labels['team'])"
      message: acme/v1 Application must belong to an existing Team
```
O `manifest.apiVersion` também está disponível nas expressões. Veja [Custom policies](./custom-policies.md) para tudo que uma expressão pode usar.

## Juntando tudo

A sua pasta agora tem um time, uma aplicação que pertence a ele, um banco e o relacionamento entre eles:

```yaml title="architecture/billing.asl.yaml"
apiVersion: acme/v1
kind: Team
metadata:
  name: payments
spec:
  email: payments@acme.example
---
apiVersion: acme/v1
kind: Application
metadata:
  name: billing
  labels:
    team: payments
spec:
  providers:
    aws: EKS
  language: Go
  costCenter: cc-1042
---
apiVersion: asl/v1
kind: Database
metadata:
  name: billing-db
spec:
  providers:
    aws: RDSPostgreSQL
---
apiVersion: asl/v1
kind: Relationship
metadata:
  name: billing-relations
spec:
  relations:
    - from: { kind: acme/v1/Application, name: billing }
      to: { kind: Database, name: billing-db }
      type: readsAndWrites
```
Rode com os dois bundles:

```sh
asl ./architecture \
  --schemas-bundle-path ./schemas-bundle \
  --policies-bundle-path ./policies
```
```text
ok 8.2ms
```
Se o label aponta para um time que não existe (`team: payment`), a policy pega:

```text
error: acme/v1 Application must belong to an existing Team
  --> architecture/billing.asl.yaml:7
  policy: acme.application-has-known-team

error: could not compile due to 1 previous error (6.6ms)
```
Se o `costCenter` não bate com o padrão (`costCenter: finance`), a definição pega primeiro, e a aresta que menciona `billing` fica sem destino:

```text
error: spec.costCenter: does not match pattern '^cc-[0-9]+$'
  --> architecture/billing.asl.yaml:7
  policy: asl.builtin.api-contract

error: dangling reference: from acme/v1/Application/billing not found
  --> architecture/billing.asl.yaml:27
  policy: asl.builtin.relationship-ref

error: could not compile due to 2 previous errors (6.6ms)
```
## O que o `asl` confere no seu bundle

Um bundle inválido interrompe a execução com exit code `2`, antes de qualquer manifest ser lido:

```text
compiling ASL schemas: custom schemas: asl/v1/Foo.yaml: apiGroup "asl" is reserved for the built-in schemas
```
- Todo `*.yaml` do bundle precisa estar em `<group>/<version>/<Kind>.yaml`: group em minúsculas, versão como `v1` ou `v1beta2` e kind com inicial maiúscula. Outros arquivos, como um README, são ignorados. Um manifest `*.asl.yaml` dentro do bundle é um erro.
- O group não é `asl`, e nenhum arquivo se chama `Manifest.yaml`.
- A definição é válida e fixa o `apiVersion` e o `kind` que o caminho dela indica.
- Todo item de `examples:` é válido para a sua definição.
- Uma definição só pode herdar de outras definições do bundle ou das built-in. Endereços web e arquivos de fora delas são rejeitados.

Um `--schemas-bundle-path` que não é uma pasta também termina com `2`.

## Onde funciona

O mesmo bundle funciona onde quer que o ASL rode, não só no terminal. Veja [Como o ASL funciona](./architecture.md#onde-o-asl-roda). Para a flag, os exit codes e o formato dos diagnósticos, veja [CLI](./cli.md).
