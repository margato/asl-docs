/** Only `error` diagnostics fail a check; `warning` ones are informational. */
export type Severity = "error" | "warning";

export interface Diagnostic {
  /** Source file; empty for in-memory input. */
  file: string;
  /** 1-based line in `file`; 0 when the position is unknown. */
  line: number;
  /** ID of the policy that raised it, e.g. "asl.builtin.api-contract". */
  policy: string;
  severity: Severity;
  message: string;
}

export type WasmSource = string | URL | ArrayBuffer | ArrayBufferView | WebAssembly.Module;

/**
 * Loads the WASM module. Idempotent: only the first call's `source` counts.
 * Optional, since `compile` calls it for you with the default location.
 * A gzipped module (`asl.wasm.gz`) is accepted as a URL or as bytes.
 */
export function init(source?: WasmSource): Promise<void>;

/**
 * Custom schemas: a map of `<group>/<version>/<Kind>.yaml` paths to schema
 * YAML. The `asl` group is reserved for the built-in kinds.
 */
export type SchemaFiles = Record<string, string | object>;

/** A YAML string (one or several documents) or an array of manifest objects. */
export type Manifests = string | object[];

/**
 * Compiles ASL manifests, given as a YAML string or an array of objects. `policies` optionally holds
 * CustomPolicy manifests, run in addition to the built-in ones. `schemas`
 * optionally adds custom kinds (e.g. `{"acme/v1/Team.yaml": "..."}`); an
 * invalid schemas tree resolves to a single error diagnostic.
 * Resolves to an empty array when everything is clean.
 *
 * Rejects with a `TypeError` when an argument has the wrong type.
 *
 * @example
 * const diagnostics = await compile(yaml);
 * if (hasErrors(diagnostics)) console.error(diagnostics.map(formatDiagnostic).join("\n"));
 */
export function compile(manifests: Manifests, policies?: Manifests, schemas?: SchemaFiles): Promise<Diagnostic[]>;

/** True when any diagnostic has `error` severity. */
export function hasErrors(diagnostics: readonly Diagnostic[]): boolean;

/** One-line text form of a diagnostic, for logs and terminals. */
export function formatDiagnostic(diagnostic: Diagnostic): string;
