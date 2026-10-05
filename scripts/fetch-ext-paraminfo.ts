/**
 * Capture extension-module paraminfo + apihelp facts into
 * `tests/paraminfo/ext.json` — the fact source for the extension packs
 * (`src/extensions/<pack>.ts`, subpath `./ext/*`).
 *
 * The module set is the curated EXT_MODULES map (scripts/ext-modules.ts, one
 * entry per pack file, kept in lockstep with types-mediawiki-response's map).
 * Modules are captured from the extension-loaded baseline wiki (`MW_API`,
 * default the 1.43 fixture, which carries the extensions listed in
 * dev-docs/authoring.md §1.6).
 *
 * Extensions the fixture does not carry fall back to the org-1.47 snapshot
 * already in the repo (`tests/paraminfo/versions/org-1.47.json` — mediawiki.org
 * runs Wikibase Client/Repo and GlobalUserInfo): the module entry and its help
 * texts are copied verbatim from there, and recorded in `moduleSources` so
 * provenance stays inspectable. Modules absent from both fail the run.
 *
 * Run: `MW_API=... pnpm fetch:paraminfo:ext`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { allExtModules, bareStem } from "./ext-modules";
import {
  fetchGenerator,
  fetchHelp,
  fetchModules,
  type HelpTexts,
  type ParamInfoModule,
  ROOT,
} from "./paraminfo-capture";

const API = process.env.MW_API ?? "http://localhost:8080/api.php";
const OUT = join(ROOT, "tests", "paraminfo", "ext.json");
const ORG_SNAPSHOT = join(ROOT, "tests", "paraminfo", "versions", "org-1.47.json");
const CHUNK = 40;

/** Path form of a module entry (`query+checkuser` stays, `review` stays). */
function fullName(mod: Pick<ParamInfoModule, "name" | "path">): string {
  return mod.path ?? mod.name;
}

interface ExtSnapshot {
  /** Generator of the primary (extension-loaded) capture wiki. */
  generator: string;
  /** Where each module's facts came from, for modules NOT from the fixture. */
  moduleSources: Record<string, string>;
  actions: Record<string, ParamInfoModule>;
  queryModules: Record<string, ParamInfoModule>;
  help: Record<string, HelpTexts>;
}

async function main(): Promise<void> {
  const modules = allExtModules();
  const fetched: ParamInfoModule[] = [];
  const absent: string[] = [];
  for (let i = 0; i < modules.length; i += CHUNK) {
    // oxlint-disable-next-line no-await-in-loop
    const { modules: got, absent: missing } = await fetchModules(API, modules.slice(i, i + CHUNK));
    fetched.push(...got);
    absent.push(...missing);
  }

  const byPath = new Map(fetched.map((m) => [fullName(m), m]));
  const actions: Record<string, ParamInfoModule> = {};
  const queryModules: Record<string, ParamInfoModule> = {};
  const help: Record<string, HelpTexts> = {};
  const moduleSources: Record<string, string> = {};

  // Modules the fixture carries: paraminfo now, help right after.
  for (const m of modules) {
    const mod = byPath.get(m);
    if (!mod) continue;
    if (mod.path?.startsWith("query+")) queryModules[mod.name] = mod;
    else actions[mod.name] = mod;
  }

  // Modules the fixture lacks: verbatim from the org-1.47 snapshot (paraminfo
  // + help), so the pack facts stay inspectable single-source entries.
  const org = JSON.parse(readFileSync(ORG_SNAPSHOT, "utf8")) as {
    generator: string;
    actions: Record<string, ParamInfoModule>;
    queryModules: Record<string, ParamInfoModule>;
    help: Record<string, HelpTexts>;
  };
  const fallback: string[] = [];
  for (const m of modules) {
    if (byPath.has(m)) continue;
    const orgMod = org.queryModules[bareStem(m)] ?? org.actions[bareStem(m)];
    if (!orgMod) throw new Error(`module absent from both the fixture and ${ORG_SNAPSHOT}: ${m}`);
    if (orgMod.path?.startsWith("query+")) queryModules[orgMod.name] = orgMod;
    else actions[orgMod.name] = orgMod;
    moduleSources[orgMod.name] = "org-1.47";
    fallback.push(m);
  }

  const helpTargets = [...Object.values(actions), ...Object.values(queryModules)];
  const fixtureHelp = await fetchHelp(
    API,
    helpTargets.filter((m) => !moduleSources[m.name]),
  );
  Object.assign(help, fixtureHelp);
  for (const mod of helpTargets) {
    if (moduleSources[mod.name]) {
      const orgHelp = org.help[fullName(mod)];
      if (!orgHelp) throw new Error(`no org help texts for ${mod.name}`);
      help[fullName(mod)] = orgHelp;
    }
  }

  const generator = await fetchGenerator(API);
  const snapshot: ExtSnapshot = { generator, moduleSources, actions, queryModules, help };
  writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    `[fetch:paraminfo:ext] ${generator}: ${Object.keys(queryModules).length} query modules, ${Object.keys(actions).length} actions (${fallback.length} from org-1.47: ${fallback.join(", ") || "none"})`,
  );
}

main().catch((error: unknown) => {
  console.error((error as Error).message);
  process.exitCode = 1;
});
