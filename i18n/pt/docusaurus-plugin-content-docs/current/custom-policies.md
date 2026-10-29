---
sidebar_position: 6
title: Custom policies
---

# Custom policies

:::warning[Em construção]
Esta página está em construção. O conteúdo pode mudar ou estar incompleto.
:::

A sua empresa tem uma regra: **cada aplicação é dona dos seus dados**. Duas aplicações nunca dividem um banco. Hoje a regra mora numa página de wiki, e o agente que adicionou o `billing-service` nunca a leu. Ele apontou o novo serviço para o `credit-db`, e a revisão de design só pegou isso semanas depois.

Essa regra não cabe em nenhuma das checagens built-in, porque é a regra da sua empresa, não a de todo mundo. Uma **custom policy** é a forma de ensinar as suas regras ao `asl`. É um arquivo YAML pequeno que seleciona alguns manifests e diz o que precisa ser verdade sobre eles. O `asl` roda a policy em toda checagem, logo depois das built-in, e nunca no lugar delas.

## Sua primeira policy

Esta é a regra da sua empresa:

```yaml title="policies/no-shared-database.asl.yaml"
apiVersion: asl/v1
kind: CustomPolicy
metadata:
  name: no-shared-database
  namespace: acme
spec:
  severity: error
  selector:
    kind: Database
  assertions:
    - expression: >-
        manifests.filter(m, m.kind == 'Application' &&
        to(manifest).exists(e, e.from.kind == 'Application' && e.from.name == m.name)).size() <= 1
      message: Database must not be shared between applications; each application owns its data
```
Leia em voz alta: para cada `Database`, conte as aplicações que têm um relacionamento apontando para ele. Precisa haver no máximo uma.

Rode junto dos seus manifests:

```sh
asl ./architecture --policies-bundle-path ./policies
```
Quando o `billing-service` e o `credit-service` leem o `credit-db`, você recebe:

```asldiag
error: Database must not be shared between applications; each application owns its data
  --> architecture/credit.asl.yaml:18
  policy: acme.no-shared-database

error: could not compile due to 1 previous error (10.1ms)
```
O erro aponta para o banco, o manifest que quebra a regra, e a policy se chama `acme.no-shared-database`. Dê ao `billing-service` um banco só dele e a checagem passa.

## Anatomia de uma policy

```yaml title="policies/writer-needs-owner.asl.yaml"
apiVersion: asl/v1
kind: CustomPolicy
metadata:
  name: writer-needs-owner
  namespace: acme            # required; ID = <namespace>.<name>
spec:
  severity: error                # warning | error (default error)
  selector:                      # which manifests to check
    kind: Application            # required
    matchLabels: { tier: backend }
    matchLabelExpressions:       # In | NotIn | Exists | DoesNotExist
      - { label: ownership-exempt, operator: DoesNotExist }
  condition:                     # optional, ANDed; false => skip that manifest
    - from(manifest).exists(e, e.type in ['writes', 'readsAndWrites'])
  assertions:                    # all must hold for a selected manifest
    - expression: "'owner' in manifest.labels"
      message: Application that writes to a store must have an owner label
```
- **`selector`** escolhe os manifests que a policy examina. `kind` é sempre obrigatório. Os labels funcionam como no Kubernetes, e tudo que você listar precisa bater.
- **`condition`** é opcional. Quando é falsa para um manifest, a policy pula aquele manifest.
- **`assertions`** são as regras. Toda assertion precisa ser verdadeira para todo manifest selecionado. Quando uma é falsa, o `message` é reportado.
- **`severity`** é `error` (a checagem falha) ou `warning` (imprime, mas não falha).

As expressões são escritas em [CEL](https://cel.dev), uma linguagem pequena para regras. Todo `condition` e todo `expression` precisa resultar em sim ou não.

## Regras

- O namespace `asl` pertence às policies built-in. Um `<namespace>.<name>` duplicado é um erro, mas o mesmo `name` pode existir em namespaces diferentes.
- `metadata.namespace` é opcional nos outros kinds, mas **obrigatório** em uma `CustomPolicy`. É dele que `acme.no-shared-database` tira o id.

## O que suas expressões podem usar

| Nome | O que é |
| --- | --- |
| `manifest` | O manifest sendo checado: `kind`, `name`, `namespace`, `labels`, `annotations`, `spec`. |
| `manifests` | A lista de todos os manifests. |
| `edges` | A lista de relacionamentos, cada um com `from {kind, name}`, `to {kind, name, interface}` e `type`. |
| `from(manifest, type?)` | Os relacionamentos que partem desse manifest, opcionalmente filtrados por tipo. |
| `to(manifest, type?)` | Os relacionamentos que chegam nesse manifest, opcionalmente filtrados. |

## Como os problemas aparecem

- Uma assertion falsa reporta o `message` no arquivo e na linha do manifest que quebra a regra, com a severidade que você escolheu.
- Um erro na própria expressão, como um erro de sintaxe ou uma resposta que não é sim ou não, é sempre um `error`. Erros de sintaxe apontam para o arquivo da policy; erros encontrados ao checar um manifest apontam para ele.
- Uma expressão cara demais para ser avaliada também para com um erro, em vez de deixar a execução inteira lenta.

## Policies para os seus kinds

As policies também podem mirar [custom schemas](./custom-schemas.md). Defina `selector.apiVersion` com o group do seu kind, por exemplo `acme/v1`.
