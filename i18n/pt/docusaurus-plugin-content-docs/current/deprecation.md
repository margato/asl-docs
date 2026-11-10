---
sidebar_position: 3
title: Obsolescência
---

# Obsolescência

O `Application` da sua empresa tem um campo `costCenter`. O financeiro agora quer um `billingCode`, e o kind `Squad` está sendo substituído por `Team`. Você não pode apagar os antigos hoje: o `billing-service`, o `subscription-service` e dezenas de outros manifests ainda os usam, e removê-los quebraria todos de uma vez. Mas, se você deixar como está, ninguém descobre que precisa migrar.

**Obsolescência** é a forma de aposentar um kind ou um campo aos poucos. Você marca no seu schema customizado, e a ASL aponta todo manifest que ainda usa, primeiro como warning e, quando chegar a hora de forçar a migração, como erro.

## Nível de campo

Coloque `x-asl-deprecation` no próprio campo, com o valor `warning` ou `error`. O `x-asl-deprecation-message`, opcional, é a dica que as pessoas veem, normalmente o substituto:

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
        properties:
          costCenter:
            type: string
            x-asl-deprecation: warning
            x-asl-deprecation-message: use billingCode instead
          billingCode:
            type: string
        unevaluatedProperties: false
unevaluatedProperties: false
```

Um manifest que ainda define `costCenter` recebe um warning:

```yaml title="architecture/billing.asl.yaml"
apiVersion: acme/v1
kind: Application
metadata:
  name: billing-service
spec:
  providers:
    aws: EKS
  language: Go
  costCenter: cc-1042
```

```asldiag
warning: spec.costCenter is deprecated: use billingCode instead
  --> architecture/billing.asl.yaml:1
  policy: asl.builtin.deprecation

warning: compiled with 1 warning (21.2ms)
```

Um warning não faz a execução falhar: o exit code continua 0. Quando o manifest passa a usar `billingCode`, o warning some:

```asldiag
ok 17.2ms
```

Declarar o campo no schema não conta como uso. Só é apontado o manifest que de fato define o campo, uma vez por manifest.

## Nível de kind

Coloque as mesmas chaves no topo do arquivo do kind, ao lado do `allOf`:

```yaml title="schemas-bundle/acme/v1/Squad.yaml"
x-asl-deprecation: error
x-asl-deprecation-message: use acme/v1 Team instead
allOf:
  - $ref: ../../asl/v1/Manifest.yaml
  - type: object
    required: [spec]
    properties:
      apiVersion:
        const: acme/v1
      kind:
        const: Squad
      spec:
        type: object
        additionalProperties: false
        required: [email]
        properties:
          email:
            type: string
unevaluatedProperties: false
```

Todo manifest desse kind é apontado, um diagnóstico para cada. Com `error`, a execução falha com exit code 1:

```asldiag
error: Kind acme/v1 Squad is deprecated: use acme/v1 Team instead
  --> architecture/payments-squad.asl.yaml:1
  policy: asl.builtin.deprecation

error: could not compile due to 1 previous error (15.8ms)
```

## Herança de obsolescência

Se o seu kind herda a definição de um kind built-in ou de outro kind, um campo obsoleto que vem junto também é apontado. Você não repete as chaves: o campo é sinalizado onde quer que um manifest o defina.

## Severidade da obsolescência

| Valor | Resultado | Exit code |
| --- | --- | --- |
| `warning` | Aponta cada uso; a compilação passa | 0 |
| `error` | Aponta cada uso; a compilação falha | 1 |
| qualquer outro | Para antes de ler qualquer manifest | 2 |

Publique `warning` primeiro e troque para `error` quando o nome antigo precisar sair. Um valor diferente de `warning` ou `error` falha assim:

```asldiag
compiling ASL schemas: custom schemas: acme/v1/Squad.yaml: x-asl-deprecation must be "warning" or "error", got info
```

## Veja no VS Code

A [extensão do VS Code](./vscode-extension.md) mostra os diagnósticos de obsolescência no painel Problems e como sublinhados com a mesma severidade. Em um kind obsoleto, o valor de `kind:` (por exemplo `Squad`) fica sublinhado e riscado; em um atributo obsoleto, a chave e o valor dessa linha (por exemplo `costCenter: cc-1042`) ficam riscados. Isso vale para warnings e errors, e a cor do sublinhado segue a severidade.
