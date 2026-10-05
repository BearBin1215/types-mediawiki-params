/**
 * Two-sided audit of the module declarations in `src/core/` against the
 * cross-version union model (`scripts/paraminfo-union.ts` over
 * `tests/paraminfo/versions/`):
 *
 *  - every union parameter is declared with matching required-ness,
 *    multi-value-ness and enum value set (union across the released fleet);
 *  - every declared parameter exists in the union (catches typos and stale
 *    declarations);
 *  - each file merges into the registry under its own stem, into the registry
 *    matching its kind;
 *  - version annotations are machine-checked: parameters/modules that arrived
 *    after the first covered version must carry `@since MediaWiki X.Y` with
 *    the exact version; removals must carry
 *    `@deprecated Removed in MediaWiki X.Y.`; no stale tags on 1.39 facts.
 *
 * Parameter names are reconstructed as `prefix + name`: paraminfo fv2 strips
 * the module prefix (see dev-docs/authoring.md §1.2).
 *
 * `--ext` mode audits `src/extensions/*.ts` against the single-version
 * extension snapshot `tests/paraminfo/ext.json` instead: same two-sided
 * parameter checks and registry-landing checks, but no version tags (extension
 * facts have no cross-version union) and a pack-file ↔ EXT_MODULES composition
 * check.
 *
 * Run: `pnpm audit:paraminfo` (or `pnpm audit:paraminfo --ext`).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
// TypeScript 7's npm package no longer ships the JS compiler API, so AST
// parsing here pins an aliased TS 5 (`typescript5`).
import * as ts from "typescript5";
import {
  bareStem,
  CONFIG_GATED_EXT_PARAMS,
  EXT_MODULES,
  SITE_STATE_EXT_PARAMS,
} from "./ext-modules";
import { loadUnion, type ModuleUnion, type ParamUnion } from "./paraminfo-union";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const QUERY_DIR = join(ROOT, "src", "core", "query");
const CORE_DIR = join(ROOT, "src", "core");
const EXT_DIR = join(ROOT, "src", "extensions");
const EXT_SNAPSHOT = join(ROOT, "tests", "paraminfo", "ext.json");

/** Registry landing spot per kind (query kinds are verified per file). */
const ACTION_REGISTRY = "ActionParams";
const QUERY_REGISTRIES = new Set(["QueryPropParams", "QueryListParams", "QueryMetaParams"]);

/**
 * Parameters whose enum values are wiki runtime state (applied tags, user
 * groups) — the bootstrap models them as open `string`; the enum comparison
 * is skipped for them, name/required/multi still hold.
 */
const SITE_STATE_PARAMS = new Set(["tags", "add", "remove", "interwikisource"]);

/** Reviewed deviations from the snapshot, each with a reason. */
const ALLOWLIST: { module: string; parameter?: string; reason: string }[] = [];

interface Member {
  node: ts.Node;
  name: string;
  optional: boolean;
  typeText: string;
  literals: string[];
}

function stringLiterals(node: ts.Node, into: string[]): void {
  if (ts.isStringLiteralLike(node)) into.push(node.text);
  ts.forEachChild(node, (child) => stringLiterals(child, into));
}

function tagText(tag: ts.JSDocTag): string {
  const comment = tag.comment;
  if (typeof comment === "string") return comment.trim();
  if (Array.isArray(comment))
    return comment
      .map((part) => part.getText())
      .join("")
      .trim();
  return "";
}

function versionTags(node: ts.Node): { since?: string; deprecated?: string } {
  const tags: { since?: string; deprecated?: string } = {};
  for (const tag of ts.getJSDocTags(node)) {
    const name = tag.tagName.text.toLowerCase();
    if (name === "since" && tags.since === undefined) tags.since = tagText(tag);
    if (name === "deprecated" && tags.deprecated === undefined) tags.deprecated = tagText(tag);
  }
  return tags;
}

interface ParsedFile {
  members: Member[];
  interfaceNode: ts.InterfaceDeclaration;
  /** One entry per interface merged inside the `declare module` block. */
  entries: { registry: string; key: string; entry: string }[];
}

function parseFile(source: ts.SourceFile): ParsedFile {
  let members: Member[] | undefined;
  let interfaceNode: ts.InterfaceDeclaration | undefined;
  const entries: ParsedFile["entries"] = [];
  for (const statement of source.statements) {
    if (ts.isInterfaceDeclaration(statement) && members === undefined) {
      interfaceNode = statement;
      members = statement.members.flatMap((member) => {
        if (!ts.isPropertySignature(member) || !member.type) return [];
        const literals: string[] = [];
        stringLiterals(member.type, literals);
        return [
          {
            node: member,
            name: member.name.getText(source),
            optional: Boolean(member.questionToken),
            typeText: member.type.getText(source),
            literals,
          },
        ];
      });
    }
    if (
      ts.isModuleDeclaration(statement) &&
      ts.isStringLiteral(statement.name) &&
      statement.body &&
      ts.isModuleBlock(statement.body)
    ) {
      for (const inner of statement.body.statements) {
        if (!ts.isInterfaceDeclaration(inner)) continue;
        for (const member of inner.members) {
          if (ts.isPropertySignature(member) && member.type) {
            entries.push({
              registry: inner.name.text,
              key: member.name.getText(source),
              entry: member.type.getText(source),
            });
          }
        }
      }
    }
  }
  if (!members || !interfaceNode || entries.length === 0) {
    throw new Error(
      `${source.fileName}: expected one params interface + one registry augmentation`,
    );
  }
  return { members, interfaceNode, entries };
}

const violations: string[] = [];
function report(message: string): void {
  violations.push(message);
}

function checkVersionTags(
  subject: string,
  tags: { since?: string; deprecated?: string },
  param: Pick<ParamUnion, "since" | "removedIn" | "deprecatedFlag">,
  firstVersion: string,
): void {
  if (param.since !== firstVersion) {
    if (tags.since === undefined) report(`${subject}: since ${param.since}, missing @since tag`);
    else if (tags.since !== `MediaWiki ${param.since}`)
      report(`${subject}: @since "${tags.since}", expected "MediaWiki ${param.since}"`);
  } else if (tags.since !== undefined) {
    report(`${subject}: stale @since "${tags.since}" (present since ${firstVersion})`);
  }
  if (param.removedIn) {
    if (
      tags.deprecated === undefined ||
      !tags.deprecated.includes(`Removed in MediaWiki ${param.removedIn}`)
    ) {
      report(
        `${subject}: removed in ${param.removedIn}, missing "@deprecated Removed in MediaWiki ${param.removedIn}."`,
      );
    }
  } else if (param.deprecatedFlag && tags.deprecated === undefined) {
    report(`${subject}: deprecated in paraminfo, missing @deprecated tag`);
  }
}

function auditFile(path: string, stem: string, mod: ModuleUnion, firstVersion: string): void {
  const allowed = (parameter?: string) =>
    ALLOWLIST.some(
      (a) => a.module === stem && (parameter === undefined || a.parameter === parameter),
    );
  const capitalized = stem.charAt(0).toUpperCase() + stem.slice(1);
  const interfaceName =
    mod.kind === "action" ? `Api${capitalized}Params` : `ApiQuery${capitalized}Params`;

  const source = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.ES2022,
    true,
  );
  const parsed = parseFile(source);

  const primary = parsed.entries.find((e) => e.registry !== "QueryGeneratorParams");
  if (!primary) {
    report(`${stem}: no primary registry entry`);
    return;
  }
  if (mod.kind === "action" && primary.registry !== ACTION_REGISTRY)
    report(`${stem}: merges into ${primary.registry}, expected ${ACTION_REGISTRY}`);
  if (mod.kind !== "action" && !QUERY_REGISTRIES.has(primary.registry)) {
    report(`${stem}: merges into unexpected registry ${primary.registry}`);
  }
  if (primary.key !== stem) report(`${stem}: registry key is ${primary.key}`);
  if (primary.entry !== interfaceName)
    report(`${stem}: registry entry is ${primary.entry}, expected ${interfaceName}`);

  // Generator-capable modules must also merge into QueryGeneratorParams; the
  // rest must not.
  const generatorEntry = parsed.entries.find((e) => e.registry === "QueryGeneratorParams");
  if (mod.kind !== "action" && mod.generator) {
    if (!generatorEntry) report(`${stem}: generator-capable, missing QueryGeneratorParams entry`);
    else if (generatorEntry.key !== stem || generatorEntry.entry !== interfaceName)
      report(
        `${stem}: QueryGeneratorParams entry is ${generatorEntry.key}: ${generatorEntry.entry}`,
      );
  } else if (generatorEntry) {
    report(`${stem}: merges into QueryGeneratorParams but is not generator-capable`);
  }

  checkVersionTags(stem, versionTags(parsed.interfaceNode), mod, firstVersion);

  const declared = new Map(parsed.members.map((m) => [m.name, m]));
  for (const param of mod.params.values()) {
    if (allowed(param.name)) continue;
    const member = declared.get(param.name);
    if (!member) {
      report(`${stem}.${param.name}: in union, not declared`);
      continue;
    }
    if (param.required && member.optional)
      report(`${stem}.${param.name}: required, declared optional`);
    if (!param.required && !member.optional)
      report(`${stem}.${param.name}: optional, declared required`);
    if (param.multi !== member.typeText.includes("OneOrMore")) {
      report(
        `${stem}.${param.name}: multi=${String(param.multi)}, declared as "${member.typeText.slice(0, 60)}…"`,
      );
    }
    if (Array.isArray(param.type) && !SITE_STATE_PARAMS.has(param.name)) {
      const expectedValues = new Set(param.values?.keys() ?? []);
      const declaredValues = new Set(member.literals);
      const missing = [...expectedValues].filter((v) => !declaredValues.has(v));
      const extra = [...declaredValues].filter((v) => !expectedValues.has(v));
      if (missing.length > 0)
        report(
          `${stem}.${param.name}: enum values missing from declaration: ${missing.join(", ")}`,
        );
      if (extra.length > 0)
        report(`${stem}.${param.name}: enum values not in any snapshot: ${extra.join(", ")}`);
    }
    if (param.open && !member.typeText.includes("(string & {})")) {
      report(`${stem}.${param.name}: open enum, declared without (string & {})`);
    }
    checkVersionTags(`${stem}.${param.name}`, versionTags(member.node), param, firstVersion);
  }
  for (const member of parsed.members) {
    if (!mod.params.has(member.name) && !allowed(member.name)) {
      report(`${stem}.${member.name}: declared, not in any snapshot`);
    }
  }
}

function auditDir(
  dir: string,
  exclude: string[],
  modules: Map<string, ModuleUnion>,
  firstVersion: string,
): Set<string> {
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts") && !exclude.includes(f));
  const seen = new Set<string>();
  for (const file of files) {
    const stem = file.slice(0, -3);
    const mod = modules.get(stem);
    if (!mod) {
      report(`${stem}: no module in the union (removed from the covered set? audit the file)`);
      continue;
    }
    seen.add(stem);
    auditFile(join(dir, file), stem, mod, firstVersion);
  }
  return seen;
}

// == --ext mode: extension packs vs the single-version ext snapshot ==

interface ExtFile {
  /** Interface name → declared members. */
  interfaces: Map<string, Member[]>;
  /** One entry per module merged in the `declare module` block. */
  entries: { registry: string; key: string; entry: string }[];
}

/** Unquote a property name: wire names with hyphens are declared quoted. */
function unquote(name: string): string {
  return name.replace(/^["']|["']$/g, "");
}

function parseExtFile(source: ts.SourceFile): ExtFile {
  const interfaces = new Map<string, Member[]>();
  const entries: ExtFile["entries"] = [];
  for (const statement of source.statements) {
    if (ts.isInterfaceDeclaration(statement)) {
      interfaces.set(
        statement.name.text,
        statement.members.flatMap((member) => {
          if (!ts.isPropertySignature(member) || !member.type) return [];
          const literals: string[] = [];
          stringLiterals(member.type, literals);
          return [
            {
              node: member,
              name: unquote(member.name.getText(source)),
              optional: Boolean(member.questionToken),
              typeText: member.type.getText(source),
              literals,
            },
          ];
        }),
      );
    }
    if (
      ts.isModuleDeclaration(statement) &&
      ts.isStringLiteral(statement.name) &&
      statement.body &&
      ts.isModuleBlock(statement.body)
    ) {
      for (const inner of statement.body.statements) {
        if (!ts.isInterfaceDeclaration(inner)) continue;
        for (const member of inner.members) {
          if (ts.isPropertySignature(member) && member.type) {
            entries.push({
              registry: inner.name.text,
              key: unquote(member.name.getText(source)),
              entry: member.type.getText(source),
            });
          }
        }
      }
    }
  }
  return { interfaces, entries };
}

function auditExtensions(): void {
  const snapshot = JSON.parse(readFileSync(EXT_SNAPSHOT, "utf8")) as {
    actions: Record<
      string,
      {
        group?: string;
        prefix?: string;
        generator?: boolean;
        parameters?: {
          name: string;
          type?: string | string[];
          required?: boolean;
          multi?: boolean;
        }[];
      }
    >;
    queryModules: Record<
      string,
      {
        group?: string;
        prefix?: string;
        generator?: boolean;
        parameters?: {
          name: string;
          type?: string | string[];
          required?: boolean;
          multi?: boolean;
        }[];
      }
    >;
  };

  const moduleFiles = readdirSync(EXT_DIR).filter((f) => f.endsWith(".ts"));
  const seenFiles = new Set<string>();
  const seenModules = new Set<string>();

  for (const file of moduleFiles) {
    const pack = file.slice(0, -3);
    const paths = EXT_MODULES[pack];
    if (!paths) {
      report(`${pack}: no entry in EXT_MODULES (removed from the covered set? audit the file)`);
      continue;
    }
    seenFiles.add(pack);

    const source = ts.createSourceFile(
      join(EXT_DIR, file),
      readFileSync(join(EXT_DIR, file), "utf8"),
      ts.ScriptTarget.ES2022,
      true,
    );
    const parsed = parseExtFile(source);

    for (const path of paths) {
      const stem = bareStem(path);
      const kind = path.startsWith("query+")
        ? (snapshot.queryModules[stem]?.group as "prop" | "list" | "meta" | undefined)
        : undefined;
      const raw = path.startsWith("query+") ? snapshot.queryModules[stem] : snapshot.actions[stem];
      if (!raw) {
        report(`${stem}: missing from ${EXT_SNAPSHOT}`);
        continue;
      }
      const expectedRegistry = path.startsWith("query+")
        ? kind === "prop"
          ? "QueryPropParams"
          : kind === "list"
            ? "QueryListParams"
            : "QueryMetaParams"
        : "ActionParams";
      const capitalized = stem
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
      const expectedInterface = path.startsWith("query+")
        ? `ApiQuery${capitalized}Params`
        : `Api${capitalized}Params`;
      seenModules.add(stem);

      const entry = parsed.entries.find(
        (e) => e.key === stem && e.registry !== "QueryGeneratorParams",
      );
      if (!entry) {
        report(`${pack}: ${stem} not merged into any registry`);
        continue;
      }
      if (entry.registry !== expectedRegistry)
        report(`${stem}: merges into ${entry.registry}, expected ${expectedRegistry}`);
      if (entry.entry !== expectedInterface)
        report(`${stem}: registry entry is ${entry.entry}, expected ${expectedInterface}`);

      // Generator-capable extension modules must merge into QueryGeneratorParams too.
      const generatorEntry = parsed.entries.find(
        (e) => e.key === stem && e.registry === "QueryGeneratorParams",
      );
      if (raw.generator === true && path.startsWith("query+")) {
        if (!generatorEntry)
          report(`${stem}: generator-capable, missing QueryGeneratorParams entry`);
        else if (generatorEntry.entry !== expectedInterface)
          report(`${stem}: QueryGeneratorParams entry is ${generatorEntry.entry}`);
      } else if (generatorEntry) {
        report(`${stem}: merges into QueryGeneratorParams but is not generator-capable`);
      }

      const members = parsed.interfaces.get(expectedInterface);
      if (!members) {
        report(`${pack}: interface ${expectedInterface} missing`);
        continue;
      }

      const declared = new Map(members.map((m) => [m.name, m]));
      const prefix = raw.prefix ?? "";
      for (const rawParam of raw.parameters ?? []) {
        const name = `${prefix}${rawParam.name}`;
        if (ALLOWLIST.some((a) => a.module === stem && a.parameter === name)) continue;
        const member = declared.get(name);
        if (!member) {
          report(`${stem}.${name}: in snapshot, not declared`);
          continue;
        }
        const gated = CONFIG_GATED_EXT_PARAMS.find(
          (s) => s.module === stem && s.pattern.test(name),
        );
        const required = gated?.optional ? false : rawParam.required === true;
        if (required && member.optional) report(`${stem}.${name}: required, declared optional`);
        if (!required && !member.optional) report(`${stem}.${name}: optional, declared required`);
        const multi = rawParam.multi === true;
        if (multi !== member.typeText.includes("OneOrMore")) {
          report(
            `${stem}.${name}: multi=${String(multi)}, declared as "${member.typeText.slice(0, 60)}…"`,
          );
        }
        if (
          Array.isArray(rawParam.type) &&
          !SITE_STATE_PARAMS.has(name) &&
          !SITE_STATE_EXT_PARAMS.some((s) => s.module === stem && s.pattern.test(name))
        ) {
          const expectedValues = new Set(rawParam.type.flat().map(String));
          const declaredValues = new Set(member.literals);
          const missing = [...expectedValues].filter((v) => !declaredValues.has(v));
          const extra = [...declaredValues].filter((v) => !expectedValues.has(v));
          if (missing.length > 0)
            report(`${stem}.${name}: enum values missing from declaration: ${missing.join(", ")}`);
          if (extra.length > 0)
            report(`${stem}.${name}: enum values not in the snapshot: ${extra.join(", ")}`);
        }
      }
      for (const member of members) {
        if (
          !(raw.parameters ?? []).some((p) => `${prefix}${p.name}` === member.name) &&
          !ALLOWLIST.some((a) => a.module === stem && a.parameter === member.name)
        ) {
          report(`${stem}.${member.name}: declared, not in the snapshot`);
        }
      }
    }

    // Nothing declared beyond the pack's module set.
    for (const entry of parsed.entries) {
      if (!paths.some((p) => bareStem(p) === entry.key)) {
        report(`${pack}: registry entry ${entry.key} is not part of the pack`);
      }
    }
  }

  for (const pack of Object.keys(EXT_MODULES)) {
    if (!seenFiles.has(pack)) report(`${pack}: in EXT_MODULES, no file in src/extensions/`);
  }
  for (const stem of Object.keys({ ...snapshot.queryModules, ...snapshot.actions })) {
    if (!seenModules.has(stem)) report(`${stem}: in the snapshot, no pack merges it`);
  }

  if (violations.length > 0) {
    for (const violation of violations) console.error(`[audit:paraminfo:ext] ${violation}`);
    console.error(`[audit:paraminfo:ext] ${violations.length} violation(s)`);
    process.exitCode = 1;
  } else {
    console.log(
      `[audit:paraminfo:ext] ${seenFiles.size} packs / ${seenModules.size} modules clean against ${EXT_SNAPSHOT}`,
    );
  }
}

function main(): void {
  if (process.argv.includes("--ext")) {
    auditExtensions();
    return;
  }
  const union = loadUnion();
  const firstVersion = union.versions[0]!.name;

  const seenQuery = auditDir(
    QUERY_DIR,
    ["index.ts", "request.ts"],
    union.queryModules,
    firstVersion,
  );
  const seenActions = auditDir(CORE_DIR, ["index.ts"], union.actions, firstVersion);

  for (const stem of union.queryModules.keys()) {
    if (!seenQuery.has(stem)) report(`${stem}: in union, no file in src/core/query/`);
  }
  for (const stem of union.actions.keys()) {
    if (!seenActions.has(stem)) report(`${stem}: in union, no file in src/core/`);
  }

  if (violations.length > 0) {
    for (const violation of violations) console.error(`[audit:paraminfo] ${violation}`);
    console.error(`[audit:paraminfo] ${violations.length} violation(s)`);
    process.exitCode = 1;
  } else {
    console.log(
      `[audit:paraminfo] ${seenQuery.size} query modules + ${seenActions.size} actions clean against the union over ${union.versions.map((v) => v.name).join(", ")}`,
    );
  }
}

main();
