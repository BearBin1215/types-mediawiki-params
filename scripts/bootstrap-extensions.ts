/**
 * One-shot bootstrap: generate the extension parameter packs
 * (`src/extensions/<pack>.ts`, subpath `./ext/*`) from the single-version
 * extension snapshot (`tests/paraminfo/ext.json`, captured by
 * `scripts/fetch-ext-paraminfo.ts`).
 *
 * Pack composition is the curated EXT_MODULES map (kept in lockstep with
 * types-mediawiki-response's map). Each pack file declares its parameter
 * interfaces and merges them into the four registries via one
 * `declare module "../registry"` block — the same mechanism the generated
 * core files use, so activation is a plain import of the pack (subpath
 * `types-mediawiki-params/ext/<pack>`).
 *
 * Extension facts have a single version source (no cross-version union):
 * interfaces carry apihelp JSDoc but no `@since`/`@deprecated` version tags,
 * except `@deprecated` where paraminfo flags the parameter deprecated.
 *
 * Files become hand-maintained the moment they are written — do not re-run
 * this to "refresh" after hand-polishing: it overwrites pack files in place.
 *
 * Run: `pnpm bootstrap:extensions`.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CONFIG_GATED,
  CONFIG_GATED_EXT_PARAMS,
  EXTENSION_NAMES,
  EXT_MODULES,
  MODULE_NOTES,
  SITE_STATE_EXT_PARAMS,
  bareStem,
} from "./ext-modules";
import type { HelpTexts, ParamInfoModule } from "./paraminfo-capture";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXT_DIR = join(ROOT, "src", "extensions");
const SNAPSHOT = join(ROOT, "tests", "paraminfo", "ext.json");
const CORE_DIR = join(ROOT, "src", "core");
const QUERY_DIR = join(ROOT, "src", "core", "query");

/** paraminfo type string → TS type. Keep in sync with dev-docs/authoring.md §3
 * (same table as bootstrap-registry.ts). */
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
  // Multipart/browser uploads: File in both DOM and Node (18.13+) globals.
  upload: "File",
};

/** Parameters whose enum values are wiki runtime state, not schema (same rule
 * as bootstrap-registry.ts): open `string`. */
const SITE_STATE_PARAMS = new Set(["tags", "add", "remove", "interwikisource"]);

interface ExtParam {
  name: string;
  required: boolean;
  multi: boolean;
  /** Union of enum values when paraminfo carries a value list. */
  values?: string[];
  /** paraminfo type when scalar. */
  type?: string;
  deprecatedFlag?: boolean | string;
  deprecatedvalues?: string[];
  note?: string;
}

interface ExtModule {
  name: string;
  kind: "prop" | "list" | "meta" | "action";
  prefix: string;
  /** The module can act as a `generator=` (paraminfo flag on the snapshot). */
  generator: boolean;
  params: Map<string, ExtParam>;
  help: HelpTexts;
  /** Where the facts came from, when NOT the primary evidence wiki. */
  source?: string;
}

interface ExtSnapshot {
  generator: string;
  moduleSources: Record<string, string>;
  actions: Record<string, ParamInfoModule>;
  queryModules: Record<string, ParamInfoModule>;
  help: Record<string, HelpTexts>;
}

function buildModule(stem: string, mod: ParamInfoModule, source?: string): ExtModule {
  const params = new Map<string, ExtParam>();
  for (const raw of mod.parameters ?? []) {
    // paraminfo fv2 strips the module prefix; reconstruct the wire name.
    const name = `${mod.prefix ?? ""}${raw.name}`;
    // Site-state enums (verified against the extension sources) open up to
    // `string` with a note, same rule as the core SITE_STATE_PARAMS.
    const siteState = SITE_STATE_EXT_PARAMS.find((s) => s.module === stem && s.pattern.test(name));
    // Config-gated presence/required (default off on the evidence wiki): the
    // permissive shape wins, with the mechanism named in the note.
    const configGated = CONFIG_GATED_EXT_PARAMS.find(
      (s) => s.module === stem && s.pattern.test(name),
    );
    params.set(name, {
      name,
      required: configGated?.optional ? false : raw.required === true,
      multi: raw.multi === true,
      values: siteState
        ? undefined
        : Array.isArray(raw.type)
          ? [...new Set(raw.type.flat().map(String))]
          : undefined,
      type: siteState ? "string" : Array.isArray(raw.type) ? undefined : (raw.type ?? "string"),
      deprecatedFlag: raw.deprecated,
      deprecatedvalues: raw.deprecatedvalues,
      note: configGated?.note ?? siteState?.note,
    });
  }
  return {
    name: stem,
    kind: (mod.group as ExtModule["kind"]) ?? "action",
    prefix: mod.prefix ?? "",
    generator: mod.generator === true,
    params,
    help: { description: "", params: {} },
    source,
  };
}

/** PascalCase identifier from a module stem; hyphens split words
 * (`scribunto-console` → `ScribuntoConsole`). */
function pascal(stem: string): string {
  return stem
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function interfaceName(mod: ExtModule): string {
  return mod.kind === "action"
    ? `Api${pascal(mod.name)}Params`
    : `ApiQuery${pascal(mod.name)}Params`;
}

function innerType(mod: ExtModule, param: ExtParam): string {
  if (SITE_STATE_PARAMS.has(param.name)) return "string";
  if (param.values) {
    // An empty enum is wiki state (tags on a clean wiki) — open string.
    if (param.values.length === 0) return "string";
    return param.values.map((value) => JSON.stringify(value)).join(" | ");
  }
  const mapped = SCALAR_TYPES[param.type ?? "string"];
  if (!mapped)
    throw new Error(
      `unmapped paraminfo type "${param.type}" (${mod.name}.${param.name}) — extend SCALAR_TYPES`,
    );
  return mapped;
}

function paramType(mod: ExtModule, param: ExtParam): string {
  const inner = innerType(mod, param);
  return param.multi ? `OneOrMore<${inner}>` : inner;
}

/** Quoted property name for wire names that are not TS identifiers
 * (`allow-account-creation`); consumers write the quoted form, which is the
 * wire form anyway. */
function memberName(name: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

function paramDoc(param: ExtParam): string[] {
  const lines: string[] = [];
  if (param.note) lines.push(param.note);
  if (param.deprecatedvalues && param.deprecatedvalues.length > 0) {
    lines.push(
      `The ${param.deprecatedvalues.map((v) => JSON.stringify(v)).join(", ")} value${param.deprecatedvalues.length > 1 ? "s are" : " is"} deprecated.`,
    );
  }
  if (param.deprecatedFlag) {
    const reason = param.deprecatedFlag === true ? "" : ` ${param.deprecatedFlag}`;
    lines.push(`@deprecated${reason}`);
  }
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

function generateModule(mod: ExtModule): string {
  const members = [...mod.params.values()].map((param) => {
    const doc = jsdocBlock(
      [
        ...descriptionLines(mod.help.params[param.name] ?? ""),
        ...(paramDoc(param).length > 0 ? ["", ...paramDoc(param)] : []),
      ],
      "    ",
    );
    const optional = param.required ? "" : "?";
    return `${doc}    ${memberName(param.name)}${optional}: ${paramType(mod, param)};`;
  });

  const gated = CONFIG_GATED[mod.name];
  const shapeNote = MODULE_NOTES[mod.name];
  const doc = jsdocBlock([
    `Request parameters for the ${mod.kind === "action" ? `\`${mod.name}\` action` : `\`${mod.kind}=${mod.name}\` query module`} provided by the extension.`,
    "",
    ...descriptionLines(mod.help.description),
    ...(gated ? ["", gated] : []),
    ...(shapeNote ? ["", shapeNote] : []),
  ]);

  return `${doc}export interface ${interfaceName(mod)} {
${members.join("\n")}
}
`;
}

function generatePack(pack: string, modules: ExtModule[]): string {
  const extension = EXTENSION_NAMES[pack];
  if (!extension) throw new Error(`no EXTENSION_NAMES entry for pack "${pack}"`);

  const byRegistry = new Map<string, ExtModule[]>();
  for (const mod of modules) {
    const registry =
      mod.kind === "action"
        ? "ActionParams"
        : mod.kind === "prop"
          ? "QueryPropParams"
          : mod.kind === "list"
            ? "QueryListParams"
            : "QueryMetaParams";
    byRegistry.set(registry, [...(byRegistry.get(registry) ?? []), mod]);
  }
  const generators = modules.filter((m) => m.kind !== "action" && m.generator);

  const moduleList = modules
    .map((m) => (m.kind === "action" ? `\`action=${m.name}\`` : `\`${m.kind}=${m.name}\``))
    .join(", ");
  const header = jsdocBlock([
    `Opt-in extension pack: **${extension}** (${moduleList}).`,
    "",
    "Not in the default export: importing anything from this file — even just",
    "the parameter interface you are about to use — activates the registry",
    "augmentation at the bottom, which merges the modules into the request",
    "gating automatically (no manual `declare module`):",
    "",
    "```ts",
    `import type {} from "types-mediawiki-params/ext/${pack}";`,
    "```",
    "",
    `@see https://www.mediawiki.org/wiki/Extension:${extension.replace(/ /g, "_")}`,
  ]);

  const augmentation = `declare module "../registry" {
${[...byRegistry.entries()]
  .map(
    ([registry, mods]) => `    interface ${registry} {
${mods.map((m) => `        ${memberName(m.name)}: ${interfaceName(m)};`).join("\n")}
    }`,
  )
  .join(
    "\n",
  )}${generators.length > 0 ? `\n    interface QueryGeneratorParams {\n${generators.map((m) => `        ${memberName(m.name)}: ${interfaceName(m)};`).join("\n")}\n    }` : ""}
}`;

  // One shared import per pack file: per-module imports would duplicate.
  const usesOneOrMore = modules.some((m) => [...m.params.values()].some((p) => p.multi));
  const usesApiLimit = modules.some((m) =>
    [...m.params.values()].some((p) => !p.values && p.type === "limit"),
  );
  const imports =
    usesOneOrMore || usesApiLimit
      ? `import type { ${[usesApiLimit ? "ApiLimit" : "", usesOneOrMore ? "OneOrMore" : ""].filter(Boolean).join(", ")} } from "../common";\n\n`
      : "";

  return `${header}\n${imports}${modules.map(generateModule).join("")}\n${augmentation}\n`;
}

function main(): void {
  const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as ExtSnapshot;

  // Rebuild ExtModules from the snapshot, keyed by stem, help attached.
  const all = new Map<string, ExtModule>();
  for (const [stem, mod] of Object.entries(snapshot.queryModules)) {
    const group = mod.group;
    if (group !== "prop" && group !== "list" && group !== "meta")
      throw new Error(`query module ${stem} has unexpected group ${group}`);
    const built = buildModule(stem, mod, snapshot.moduleSources[stem]);
    built.help = snapshot.help[`query+${stem}`] ?? { description: "", params: {} };
    all.set(stem, built);
  }
  for (const [stem, mod] of Object.entries(snapshot.actions)) {
    const built = buildModule(stem, { ...mod, group: "action" }, snapshot.moduleSources[stem]);
    built.help = snapshot.help[stem] ?? { description: "", params: {} };
    all.set(stem, built);
  }

  // Name-collision guard: interface names must be unique across packs AND not
  // collide with the generated core files.
  const coreNames = new Set<string>();
  for (const file of readdirSync(CORE_DIR)) {
    if (file.endsWith(".ts") && file !== "index.ts") {
      const stem = file.slice(0, -3);
      coreNames.add(`Api${stem.charAt(0).toUpperCase()}${stem.slice(1)}Params`);
    }
  }
  for (const file of readdirSync(QUERY_DIR)) {
    if (file.endsWith(".ts") && file !== "index.ts" && file !== "request.ts") {
      const stem = file.slice(0, -3);
      coreNames.add(`ApiQuery${stem.charAt(0).toUpperCase()}${stem.slice(1)}Params`);
    }
  }
  const seen = new Map<string, string>();
  for (const [pack, paths] of Object.entries(EXT_MODULES)) {
    for (const path of paths) {
      const stem = bareStem(path);
      const mod = all.get(stem);
      if (!mod) throw new Error(`module ${stem} missing from ${SNAPSHOT}`);
      const name = interfaceName(mod);
      const clash = seen.get(name) ?? (coreNames.has(name) ? "core" : undefined);
      if (clash) throw new Error(`interface name collision: ${name} (${clash} vs ${pack})`);
      seen.set(name, pack);
    }
  }

  mkdirSync(EXT_DIR, { recursive: true });
  let written = 0;
  let moduleCount = 0;
  for (const [pack, paths] of Object.entries(EXT_MODULES)) {
    const modules = paths.map((path) => {
      const stem = bareStem(path);
      const mod = all.get(stem)!;
      moduleCount++;
      return mod;
    });
    writeFileSync(join(EXT_DIR, `${pack}.ts`), generatePack(pack, modules));
    written++;
  }

  console.log(
    `[bootstrap-extensions] ${written} packs / ${moduleCount} modules over ${snapshot.generator} (+org-1.47 fallbacks: ${Object.keys(snapshot.moduleSources).join(", ") || "none"}) -> src/extensions/`,
  );
}

main();
