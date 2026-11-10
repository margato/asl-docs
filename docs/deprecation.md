---
sidebar_position: 3
title: Deprecation
---

# Deprecation

Your company's `Application` has a `costCenter` field. Finance now wants a `billingCode` instead, and the `Squad` kind is being replaced by `Team`. You cannot delete the old ones today: `billing-service`, `subscription-service` and dozens of other manifests still use them, and removing the fields would break every one of them at once. But if you leave them untouched, nobody learns they have to migrate.

**Deprecation** is how you retire a kind or a field gradually. You mark it in your custom schema, and ASL reports every manifest that still uses it, as a warning first and as an error when it is time to force the migration.

## Field level

Put `x-asl-deprecation` on the field itself, with the value `warning` or `error`. The optional `x-asl-deprecation-message` is the hint people see, usually the replacement:

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

A manifest that still sets `costCenter` gets a warning:

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

A warning does not fail the run: the exit code stays 0. Once the manifest moves to `billingCode`, the warning goes away:

```asldiag
ok 17.2ms
```

Declaring the field in the schema is not a use. Only a manifest that actually sets it is reported, once per manifest.

## Kind level

Put the same keywords at the top level of the kind's file, next to `allOf`:

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

Every manifest of that kind is reported, one diagnostic each. With `error`, the run fails with exit code 1:

```asldiag
error: Kind acme/v1 Squad is deprecated: use acme/v1 Team instead
  --> architecture/payments-squad.asl.yaml:1
  policy: asl.builtin.deprecation

error: could not compile due to 1 previous error (15.8ms)
```

## Deprecation inheritance

If your kind inherits a built-in or another kind's definition, a deprecated field that comes with it is reported too. You do not repeat the keywords: the field is flagged wherever a manifest sets it.

## Deprecation severity

| Value | Result | Exit code |
| --- | --- | --- |
| `warning` | Reports each use; the compile succeeds | 0 |
| `error` | Reports each use; the compile fails | 1 |
| anything else | Stops before reading any manifest | 2 |

Ship `warning` first, then switch to `error` when the old name has to go. A value other than `warning` or `error` fails like this:

```asldiag
compiling ASL schemas: custom schemas: acme/v1/Squad.yaml: x-asl-deprecation must be "warning" or "error", got info
```

## See it in VS Code

The [VS Code extension](./vscode-extension.md) shows deprecation diagnostics in the Problems panel and as squiggles with the same severity. For a deprecated kind, the `kind:` value (for example `Squad`) is underlined and struck through; for a deprecated attribute, the key and its value on that line (for example `costCenter: cc-1042`) are struck through. This applies to both warnings and errors, and the squiggle color follows the severity.
