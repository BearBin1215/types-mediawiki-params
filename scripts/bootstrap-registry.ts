/**
 * One-shot bootstrap: generate the module parameter skeletons from the
 * cross-version union model (`scripts/paraminfo-union.ts` over
 * `tests/paraminfo/versions/`):
 *
 *  - `src/core/query/<stem>.ts` for every `prop=`/`list=`/`meta=` module;
 *  - `src/core/<stem>.ts` for every CORE non-query action (`action=query`
 *    is excluded — its request shape is the QueryRequest machinery);
 *  - the barrel files (`src/core/query/index.ts`, `src/core/index.ts`) that
 *    re-export every module file, so the `declare module` augmentations are
 *    reachable from the package entry.
 *
 * JSDoc bodies come from the latest version's apihelp HTML; `@since` /
 * `@deprecated` tags come from the cross-version union and are verified by
 * `audit:paraminfo`.
 *
 * Files become hand-maintained the moment they are written — do not re-run
 * this to "refresh" after hand-polishing: it overwrites module files in
 * place. It never deletes `request.ts` or the barrels' hand-written parts.
 *
 * Run: `pnpm bootstrap:registry`.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadUnion, type ModuleUnion, type ParamUnion } from "./paraminfo-union";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const QUERY_DIR = join(ROOT, "src", "core", "query");
const CORE_DIR = join(ROOT, "src", "core");

/** paraminfo type string → TS type. Keep in sync with dev-docs/authoring.md §3. */
const SCALAR_TYPES: Record<string, string> = {
  string: "string",
  text: "string",
  title: "string",
  user: "string",
  raw: "string",
  tags: "string",
  password: "string",
  integer: "number",
  boolean: "boolean",
  namespace: "number",
  limit: "ApiLimit",
  timestamp: "string",
  expiry: "string",
  // Multipart/browser uploads (action=upload's `file`): File in both DOM and
  // Node (18.13+) globals.
  upload: "File",
};

/**
 * Parameters whose enum values are wiki runtime state, not schema: applied
 * tags (auto-generated tag names), user groups (site config, extension
 * groups like `autoreview`), interwiki prefixes (the interwiki table). Typed
 * as open `string` — the closed-enum rule applies to schema enums only.
 */
const SITE_STATE_PARAMS = new Set(["tags", "add", "remove", "interwikisource"]);

/** Registry interface merged into, per paraminfo module group. */
const GROUP_REGISTRY: Record<string, string> = {
  prop: "QueryPropParams",
  list: "QueryListParams",
  meta: "QueryMetaParams",
  action: "ActionParams",
};

const FIRST_VERSION = "1.39";

function innerType(param: ParamUnion): string {
  if (SITE_STATE_PARAMS.has(param.name)) return "string";
  if (Array.isArray(param.type)) {
    const values = [...(param.values?.keys() ?? [])];
    // An empty enum is wiki state (tags on a clean wiki) — open string.
    if (values.length === 0) return "string";
    const union = values.map((value) => JSON.stringify(value)).join(" | ");
    // Registry/hook/config-driven value sets stay open (response §3.10 rule):
    // the captured values autocomplete, `(string & {})` accepts the rest.
    return param.open ? `${union} | (string & {})` : union;
  }
  const mapped = SCALAR_TYPES[param.type ?? "string"];
  if (!mapped) throw new Error(`unmapped paraminfo type "${param.type}" (${param.name})`);
  return mapped;
}

function paramType(param: ParamUnion): string {
  const inner = innerType(param);
  return param.multi ? `OneOrMore<${inner}>` : inner;
}

/** Version facts as JSDoc. Order matters: prose (value-since sentences,
 * presence notes) must come before the tags (a JSDoc tag absorbs every
 * following line), and the tags go last. */
function paramDoc(param: ParamUnion): string[] {
  const lines: string[] = [];
  if (param.note) lines.push(param.note);
  if (param.values) {
    const later = [...param.values.entries()].filter(
      ([, since]) => since !== param.since && since !== FIRST_VERSION,
    );
    const byVersion = new Map<string, string[]>();
    for (const [value, since] of later) {
      byVersion.set(since, [...(byVersion.get(since) ?? []), JSON.stringify(value)]);
    }
    for (const [since, values] of [...byVersion.entries()].sort()) {
      lines.push(
        `The ${values.join(", ")} value${values.length > 1 ? "s are" : " is"} available since MediaWiki ${since}.`,
      );
    }
  }
  if (param.since !== FIRST_VERSION) lines.push(`@since MediaWiki ${param.since}`);
  if (param.removedIn) {
    lines.push(`@deprecated Removed in MediaWiki ${param.removedIn}.`);
  } else if (param.deprecatedFlag) {
    const reason = param.deprecatedFlag === true ? "" : ` ${param.deprecatedFlag}`;
    lines.push(`@deprecated${reason}`);
  }
  return lines;
}

function moduleDoc(mod: ModuleUnion): string[] {
  const lines: string[] = [];
  if (mod.since !== FIRST_VERSION) lines.push(`@since MediaWiki ${mod.since}`);
  if (mod.removedIn) lines.push(`@deprecated Removed in MediaWiki ${mod.removedIn}.`);
  return lines;
}

/** JSDoc block from explicit lines; empty lines become bare ` *` separators. */
function jsdocBlock(lines: string[], indent = ""): string {
  const body = lines.filter((line, index) => line !== "" || (index > 0 && lines[index - 1] !== ""));
  return `${indent}/**\n${body.map((l) => (l === "" ? `${indent} *` : `${indent} * ${l}`)).join("\n")}\n${indent} */\n`;
}

function descriptionLines(description: string): string[] {
  return description
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");
}

function pascal(stem: string): string {
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

interface ModuleSpec {
  mod: ModuleUnion;
  interfaceName: string;
  /** Module specifier depth for imports and the registry augmentation. */
  rel: string;
  /** Human label for the interface doc line. */
  label: string;
}

function querySpec(mod: ModuleUnion): ModuleSpec {
  return {
    mod,
    interfaceName: `ApiQuery${pascal(mod.name)}Params`,
    rel: "../..",
    label: `\`${mod.kind}=${mod.name}\` query module`,
  };
}

function actionSpec(mod: ModuleUnion): ModuleSpec {
  return {
    mod,
    interfaceName: `Api${pascal(mod.name)}Params`,
    rel: "..",
    label: `\`${mod.name}\` action`,
  };
}

function generateModule(spec: ModuleSpec): string {
  const { mod, interfaceName, rel, label } = spec;
  const registry = GROUP_REGISTRY[mod.kind];
  if (!registry) throw new Error(`unmapped group "${mod.kind}" (${mod.name})`);

  const members = [...mod.params.values()].map((param) => {
    const doc = jsdocBlock(
      [
        ...descriptionLines(mod.help.params[param.name] ?? param.doc ?? ""),
        ...(paramDoc(param).length > 0 ? ["", ...paramDoc(param)] : []),
      ],
      "    ",
    );
    const optional = param.required ? "" : "?";
    return `${doc}    ${param.name}${optional}: ${paramType(param)};`;
  });

  // The registry interface is referenced inside `declare module` only: that
  // block resolves names in the target module's scope, so importing it would
  // be an unused import (noUnusedLocals). Generator-capable modules merge a
  // second interface into the same block (the QueryGeneratorParams seam).
  const usesOneOrMore = [...mod.params.values()].some((p) => p.multi);
  const usesApiLimit = [...mod.params.values()].some(
    (p) => !Array.isArray(p.type) && p.type === "limit",
  );
  const imports =
    usesOneOrMore || usesApiLimit
      ? [
          `import type { ${usesApiLimit ? "ApiLimit, " : ""}${usesOneOrMore ? "OneOrMore" : ""} } from "${rel}/common";`,
        ]
      : [];

  const doc = jsdocBlock([
    `Request parameters for the ${label}.`,
    "",
    ...descriptionLines(mod.help.description),
    ...(moduleDoc(mod).length > 0 ? ["", ...moduleDoc(mod)] : []),
  ]);

  const generatorEntry =
    mod.kind !== "action" && mod.generator
      ? `\n    interface QueryGeneratorParams {\n        ${mod.name}: ${interfaceName};\n    }`
      : "";

  return `${imports.join("\n")}

${doc}export interface ${interfaceName} {
${members.join("\n")}
}

declare module "${rel}/registry" {
    interface ${registry} {
        ${mod.name}: ${interfaceName};
    }${generatorEntry}
}
`;
}

function barrel(specs: ModuleSpec[], header: string, from: string, extra?: string): string {
  const lines = specs.map((s) => `export * from "${from}${s.mod.name}";`);
  if (extra) lines.push(`export * from "${from}${extra}";`);
  lines.sort((a, b) => a.localeCompare(b));
  return `${header}\n${lines.join("\n")}\n`;
}

/** Base-module (main/json/query) version facts for the hand-written layers
 * (ApiBaseParams in common.ts, the query base in core/query/request.ts). */
function printBaseReport(union: ReturnType<typeof loadUnion>): void {
  const versions = union.versions;
  const first = versions[0]!.name;
  const report: string[] = [];
  for (const base of ["main", "json", "query"] as const) {
    report.push(`# ${base}`);
    const perVersion = versions.map((version) => {
      const mod = version.file[base];
      return { version, mod };
    });
    const present = perVersion.filter((e) => e.mod);
    const names = new Set<string>();
    for (const entry of present)
      for (const p of entry.mod!.parameters ?? []) names.add(`${entry.mod!.prefix ?? ""}${p.name}`);
    for (const name of names) {
      const since = present.find((e) =>
        (e.mod!.parameters ?? []).some((p) => `${e.mod!.prefix ?? ""}${p.name}` === name),
      )!.version.name;
      const lastPresence = present.findLast((e) =>
        (e.mod!.parameters ?? []).some((p) => `${e.mod!.prefix ?? ""}${p.name}` === name),
      )!.version.name;
      const removed = present.findLast((e) => e.version.name === lastPresence)!;
      const after = perVersion.filter((e) => e.version.order > removed.version.order);
      const removedIn =
        after.length > 0 &&
        after.every(
          (e) =>
            !e.mod ||
            !(e.mod.parameters ?? []).some((p) => `${e.mod.prefix ?? ""}${p.name}` === name),
        )
          ? after[0]!.version.name
          : undefined;
      const latest = present.findLast((e) =>
        (e.mod!.parameters ?? []).some((p) => `${e.mod!.prefix ?? ""}${p.name}` === name),
      )!;
      const param = latest.mod!.parameters!.find(
        (p) => `${latest.mod!.prefix ?? ""}${p.name}` === name,
      )!;
      report.push(
        `- ${name}: since ${since === first ? "1.39" : since}${removedIn ? `, removed in ${removedIn}` : ""} | ${param.type === undefined ? "string" : Array.isArray(param.type) ? `enum(${param.type.length})` : param.type}${param.required ? " | required" : ""}${param.multi ? " | multi" : ""}`,
      );
    }
  }
  writeFileSync(join(ROOT, "tests", "paraminfo", "base-report.md"), `${report.join("\n")}\n`);
}

function main(): void {
  const union = loadUnion();

  const querySpecs = [...union.queryModules.values()].map(querySpec);
  const actionSpecs = [...union.actions.values()].map(actionSpec);

  // Overwrite the generated module files in place; never wipe the directory —
  // it also holds the hand-maintained request.ts and would destroy it.
  mkdirSync(QUERY_DIR, { recursive: true });
  const currentStems = new Set([...querySpecs.map((s) => s.mod.name), "index", "request"]);
  for (const file of readdirSync(QUERY_DIR)) {
    if (file.endsWith(".ts") && !currentStems.has(file.slice(0, -3))) {
      rmSync(join(QUERY_DIR, file));
    }
  }
  for (const spec of querySpecs) {
    writeFileSync(join(QUERY_DIR, `${spec.mod.name}.ts`), generateModule(spec));
  }
  writeFileSync(
    join(QUERY_DIR, "index.ts"),
    barrel(
      querySpecs,
      "// Re-exports every query module file: the `declare module` augmentations\n// must be reachable from the package entry for the registries to fill in.\n// ./request is the hand-maintained entry machinery (QueryRequest).",
      "./",
      "request",
    ),
  );

  // Action files land next to query/: overwrite in place and prune stale
  // generated files (a module that left the covered set, or a file from an
  // earlier polluted run); index.ts and the query/ directory are spared.
  const actionStems = new Set([...actionSpecs.map((s) => s.mod.name), "index"]);
  for (const file of readdirSync(CORE_DIR)) {
    if (file.endsWith(".ts") && !actionStems.has(file.slice(0, -3))) {
      rmSync(join(CORE_DIR, file));
    }
  }
  for (const spec of actionSpecs) {
    writeFileSync(join(CORE_DIR, `${spec.mod.name}.ts`), generateModule(spec));
  }
  writeFileSync(
    join(CORE_DIR, "index.ts"),
    barrel(
      actionSpecs,
      "// Core non-query actions; the query barrel (with the QueryRequest\n// machinery and every query module) lives in ./query/index. Re-exports keep\n// the `declare module` augmentations reachable from the package entry.",
      "./",
      "query/index",
    ),
  );

  printBaseReport(union);

  const removedModules = [...union.queryModules.values(), ...union.actions.values()].filter(
    (m) => m.removedIn,
  );
  console.log(
    `[bootstrap-registry] ${querySpecs.length} query modules + ${actionSpecs.length} actions over ` +
      `${union.versions.map((v) => v.name).join(", ")} -> src/core/ (removed modules still modeled: ${removedModules.map((m) => m.name).join(", ") || "none"})`,
  );
}

main();
