// Copy of the @architectureascode/asl wrapper (asl/js/index.js), until the package is published.
// Changed: no Node branch (browser only), wasm_exec.js sits next to this file, and `init` needs the .wasm.gz URL.
import "./wasm_exec.js";

// wasm_exec.js stubs process.cwd() to throw ENOSYS outside Node, and the
// schema compiler calls os.Getwd() to resolve resource URLs. Give it a
// fixed root instead.
try {
  globalThis.process.cwd();
} catch {
  globalThis.process.cwd = () => "/";
}

let ready;

// The package ships the module gzipped only (about 5x smaller). Bytes that
// start with the gzip magic number are inflated, whatever the URL says, so a
// host that already serves the .gz with Content-Encoding (the browser then
// hands over plain bytes) works the same as one that serves it as is. A plain
// .wasm is still accepted.
async function inflateIfGzip(bytes) {
  const view = ArrayBuffer.isView(bytes)
    ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    : new Uint8Array(bytes);
  if (view[0] !== 0x1f || view[1] !== 0x8b) return view;
  const inflated = new Blob([view]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(inflated).arrayBuffer());
}

async function fetchWasm(source) {
  if (source instanceof WebAssembly.Module) return source;
  if (source instanceof ArrayBuffer || ArrayBuffer.isView(source)) {
    return WebAssembly.compile(await inflateIfGzip(source));
  }
  const url = source;
  const res = await fetch(url);
  if (WebAssembly.compileStreaming && res.headers.get("content-type") === "application/wasm") {
    return WebAssembly.compileStreaming(res);
  }
  return WebAssembly.compile(await inflateIfGzip(await res.arrayBuffer()));
}

/**
 * Loads and starts the WASM module. Idempotent: only the first call's
 * `source` is used, later calls return the same promise. `compile` calls it
 * automatically, so calling it directly is only needed to choose where the
 * .wasm comes from (a URL, bytes, or a compiled WebAssembly.Module). A failed
 * load is not cached, so a later call retries.
 */
export function init(source) {
  ready ??= (async () => {
    const go = new globalThis.Go();
    const instance = await WebAssembly.instantiate(await fetchWasm(source), go.importObject);
    // go.run's promise only settles when the Go program exits, which it
    // never does (main blocks to keep aslCompile callable) — don't await it.
    // aslCompile is registered synchronously before main blocks.
    go.run(instance).catch(() => {});
  })().catch((err) => {
    ready = undefined;
    throw err;
  });
  return ready;
}

/**
 * Compiles ASL manifests and returns the diagnostics. `manifests` is a YAML
 * string (one or several documents) or an array of manifest objects.
 * `policies` optionally holds CustomPolicy manifests in the same two forms,
 * evaluated in addition to the built-in ones. `schemas` optionally maps paths
 * such as "acme/v1/Service.yaml" to a custom schema (YAML string or object),
 * adding kinds to the built-in ones. An empty array means everything is clean.
 *
 * Bad argument types throw a TypeError right away instead of surfacing as a
 * YAML diagnostic. Problems in the input itself are returned as diagnostics.
 */
export async function compile(manifests, policies, schemas) {
  manifests = toDocuments("manifests", manifests);
  if (policies != null) policies = toDocuments("policies", policies);
  if (schemas != null) schemas = toSchemaFiles(schemas);
  await init();
  return JSON.parse(globalThis.aslCompile(manifests, policies, schemas));
}

/** True when any diagnostic has `error` severity, i.e. the input must not ship. */
export function hasErrors(diagnostics) {
  return diagnostics.some((d) => d.severity === "error");
}

/**
 * One-line, human-readable form, e.g.
 * `apps/billing.yaml:12: error: ... (asl.builtin.api-contract)`.
 */
export function formatDiagnostic(d) {
  const where = d.file || "<input>";
  const location = d.line > 0 ? `${where}:${d.line}` : where;
  return `${location}: ${d.severity}: ${d.message} (${d.policy})`;
}

// manifests and policies are a YAML string (one or several documents) or, as
// JSON, always a list of objects. Each object is serialized to JSON, which is
// YAML, so the compiler reads it as a document, and the list becomes a
// multi-document stream (`---` between them). The list is one call because
// references between manifests only resolve within a call.
function toDocuments(name, value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (!isPlainObject(item)) {
        throw new TypeError(`compile: ${name}[${i}] must be an object, got ${describe(item)}`);
      }
    });
    return value.map((item) => JSON.stringify(item)).join("\n---\n");
  }
  throw new TypeError(`compile: ${name} must be a YAML string or an array of objects, got ${describe(value)}`);
}

function toSchemaFiles(schemas) {
  if (!isPlainObject(schemas)) {
    throw new TypeError(`compile: schemas must be an object of {path: yaml or object}, got ${describe(schemas)}`);
  }
  return Object.fromEntries(
    Object.entries(schemas).map(([path, schema]) => {
      if (typeof schema !== "string" && !isPlainObject(schema)) {
        throw new TypeError(`compile: schemas["${path}"] must be a YAML string or an object, got ${describe(schema)}`);
      }
      return [path, typeof schema === "string" ? schema : JSON.stringify(schema)];
    }),
  );
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function describe(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
