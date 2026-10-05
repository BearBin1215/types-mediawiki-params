/**
 * Capture per-version paraminfo + apihelp facts into
 * `tests/paraminfo/versions/<name>.json`.
 *
 * Usage: `MW_API=http://localhost:8081/api.php pnpm fetch:paraminfo 1.39`
 * (the name becomes the file name; `org-1.47` style names are fine).
 *
 * The module set is discovered from the version itself: the `main` module
 * gives the action enum, the `query` module gives the prop/list/meta enums.
 * For every covered module the apihelp i18n messages
 * (`apihelp-<module>-description`, `apihelp-<module>-param-<name>`) are
 * harvested too — paraminfo has carried no descriptions since MW 1.38, and
 * these messages are the JSDoc source material.
 *
 * Without an argument the script refreshes `tests/paraminfo/supplement.json`
 * (baseline wiki facts for the hand-written envelope/query-base layers).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  clean,
  fetchGenerator,
  fetchHelp,
  fetchModules,
  fullName,
  type HelpTexts,
  type ParamInfoModule,
} from "./paraminfo-capture";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "tests", "paraminfo", "versions");
const SUPPLEMENT = join(ROOT, "tests", "paraminfo", "supplement.json");
const CHUNK = 40;

/** Actions not modeled in the `ActionParams` union: the feed/XML/HTML output
 * formats (typed `mw.Api` calls do not consume them), and `query` itself —
 * its request shape is the `QueryRequest` machinery, putting it in the action
 * union would let callers bypass module gating. */
const SKIP_ACTIONS = [
  "feedcontributions",
  "feedrecentchanges",
  "feedwatchlist",
  "help",
  "opensearch",
  "query",
  "rsd",
];

interface VersionSnapshot {
  generator: string;
  main: ParamInfoModule;
  json: ParamInfoModule;
  query: ParamInfoModule;
  actions: Record<string, ParamInfoModule>;
  queryModules: Record<string, ParamInfoModule>;
  help: Record<string, HelpTexts>;
}

async function fetchVersion(api: string, name: string): Promise<void> {
  const modules: string[] = ["main", "json", "query"];
  const fetched: ParamInfoModule[] = [];
  for (let i = 0; i < modules.length; i += CHUNK) {
    // oxlint-disable-next-line no-await-in-loop
    const { modules: got } = await fetchModules(api, modules.slice(i, i + CHUNK));
    fetched.push(...got);
  }
  const byPath = new Map(fetched.map((m) => [m.path ?? m.name, m]));
  const mainModule = byPath.get("main");
  const json = byPath.get("json");
  const query = byPath.get("query");
  if (!mainModule || !json || !query) throw new Error("main/json/query missing from paraminfo");

  const skip = new Set(SKIP_ACTIONS);
  const actionEnum = mainModule.parameters?.find((p) => p.name === "action")?.type ?? [];
  const actionStems = (Array.isArray(actionEnum) ? actionEnum : []).filter(
    (v): v is string => typeof v === "string" && !skip.has(v),
  );

  const queryStems: string[] = [];
  for (const kind of ["prop", "list", "meta"]) {
    const enumParam = query.parameters?.find((p) => p.name === kind)?.type;
    if (Array.isArray(enumParam))
      queryStems.push(...enumParam.filter((v): v is string => typeof v === "string"));
  }

  const rest: string[] = [...actionStems, ...queryStems.map((s) => `query+${s}`)];
  const collected: ParamInfoModule[] = [];
  const absent: string[] = [];
  for (let i = 0; i < rest.length; i += CHUNK) {
    // oxlint-disable-next-line no-await-in-loop
    const { modules: got, absent: missing } = await fetchModules(api, rest.slice(i, i + CHUNK));
    collected.push(...got);
    absent.push(...missing);
  }

  const actions: Record<string, ParamInfoModule> = {};
  const queryModules: Record<string, ParamInfoModule> = {};
  for (const mod of collected) {
    if (mod.path?.startsWith("query+")) queryModules[mod.name] = mod;
    else actions[mod.name] = mod;
  }
  const missingActions = actionStems.filter((s) => !(s in actions) && !absent.includes(s));
  const missingQuery = queryStems.filter((s) => !(s in queryModules) && !absent.includes(s));
  if (missingActions.length > 0 || missingQuery.length > 0) {
    throw new Error(
      `modules missing: actions=${missingActions.join(",")} query=${missingQuery.join(",")}`,
    );
  }

  const help = await fetchHelp(api, [mainModule, json, query, ...collected]);
  const generator = await fetchGenerator(api);

  const snapshot: VersionSnapshot = {
    generator,
    main: mainModule,
    json,
    query,
    actions,
    queryModules,
    help,
  };
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, `${name}.json`), `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    `[fetch:paraminfo] ${name} <- ${generator}: ${Object.keys(queryModules).length} query modules, ${Object.keys(actions).length} actions, help for ${Object.keys(help).length} modules (${absent.length} absent)`,
  );
}

async function refreshSupplement(): Promise<void> {
  // Legacy behavior kept for the hand-written envelope/base layers; descriptions
  // have come back empty since MW 1.38 (apihelp messages are the real source).
  const baseline = JSON.parse(
    readFileSync(join(ROOT, "tests", "paraminfo", "baseline.json"), "utf8"),
  ) as {
    modules: { name: string; group?: string }[];
  };
  const stems = baseline.modules
    .filter((m) => m.group === "prop" || m.group === "list" || m.group === "meta")
    .map((m) => m.name);
  const api = process.env.MW_API ?? "http://localhost:8080/api.php";
  const modules: string[] = ["main", "json", "query", ...stems.map((s) => `query+${s}`)];
  const fetched: ParamInfoModule[] = [];
  const absent: string[] = [];
  for (let i = 0; i < modules.length; i += CHUNK) {
    // oxlint-disable-next-line no-await-in-loop
    const { modules: got, absent: missing } = await fetchModules(api, modules.slice(i, i + CHUNK));
    fetched.push(...got);
    absent.push(...missing);
  }
  const byPath = new Map(fetched.map((m) => [m.path ?? m.name, m]));
  const mainModule = byPath.get("main");
  const json = byPath.get("json");
  const query = byPath.get("query");
  if (!mainModule || !json || !query)
    throw new Error("main/json/query modules missing from paraminfo");

  const descriptions: Record<string, { description: string; params: Record<string, string> }> = {};
  for (const stem of stems) {
    const mod = byPath.get(`query+${stem}`);
    if (!mod) {
      if (!absent.includes(stem)) throw new Error(`query+${stem} missing from paraminfo`);
      continue;
    }
    descriptions[stem] = {
      description: clean(mod.description),
      params: Object.fromEntries(
        (mod.parameters ?? []).map((p) => [fullName(mod, p.name), clean(p.description)]),
      ),
    };
  }

  const generator = await fetchGenerator(api);

  writeFileSync(
    SUPPLEMENT,
    `${JSON.stringify({ generator, main: mainModule, json, query, actions: {}, descriptions }, null, 2)}\n`,
  );
  console.log(
    `[fetch:paraminfo] supplement: main/json/query + ${Object.keys(descriptions).length} submodule descriptions (${absent.length} absent) from ${generator}`,
  );
}

async function main(): Promise<void> {
  const name = process.argv[2];
  const api = process.env.MW_API;
  if (name) {
    if (!api) throw new Error("version mode needs MW_API (the wiki endpoint for that version)");
    await fetchVersion(api, name);
  } else {
    await refreshSupplement();
  }
}

main().catch((error: unknown) => {
  console.error((error as Error).message);
  process.exitCode = 1;
});
