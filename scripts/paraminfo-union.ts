/**
 * Shared cross-version union model over the per-version snapshots in
 * `tests/paraminfo/versions/` (one file per covered MediaWiki release; file
 * names prefixed `org-` are WMF-development snapshots).
 *
 * Union semantics (see dev-docs/authoring.md §1.4):
 *  - a parameter/module is modeled when it exists in ANY covered version;
 *    `since` is the first version carrying it, `until` the last one;
 *  - type facts (required/multi/type/deprecated) come from the LATEST version
 *    where the thing exists — the types serve current wikis first;
 *  - enum VALUES are the union across the released fleet only: `org-` files
 *    carry extensions a clean release image does not, so they contribute
 *    presence (and `@since 1.47` candidates) but never enum values;
 *  - a parameter absent from the latest version of its module is a removal:
 *    the removal version is the first covered version after `until`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERSIONS_DIR = join(ROOT, "tests", "paraminfo", "versions");

export interface ParamInfoParam {
  name: string;
  type?: string | string[];
  required?: boolean;
  multi?: boolean;
  deprecated?: boolean | string;
  deprecatedvalues?: string[];
}

export interface ParamInfoModule {
  name: string;
  path?: string;
  /** The module can act as a `generator=` (paraminfo flag). */
  generator?: boolean;
  group?: string;
  prefix?: string;
  parameters?: ParamInfoParam[];
}

export interface HelpTexts {
  description: string;
  params: Record<string, string>;
}

interface VersionFile {
  generator: string;
  main: ParamInfoModule;
  json: ParamInfoModule;
  query: ParamInfoModule;
  actions: Record<string, ParamInfoModule>;
  queryModules: Record<string, ParamInfoModule>;
  help: Record<string, HelpTexts>;
}

export interface ParamUnion {
  name: string;
  /** First covered version carrying the parameter. */
  since: string;
  /** Last covered version carrying it; set only when it is gone from later versions. */
  until?: string;
  /** First covered version after `until` — the removal version. */
  removedIn?: string;
  required: boolean;
  multi: boolean;
  type: string | string[];
  deprecatedFlag?: boolean | string;
  deprecatedvalues?: string[];
  /** Enum value → first covered version carrying it (released fleet only). */
  values?: Map<string, string>;
  /** Presence caveat surfaced in the JSDoc (e.g. config-gated registration). */
  note?: string;
  /** Fallback description for params injected without apihelp text (SOURCE_ONLY_CORE). */
  doc?: string;
  /** Value set is decided outside core code (registry/hook/config) → open union. */
  open?: boolean;
}

export interface ModuleUnion {
  name: string;
  kind: "prop" | "list" | "meta" | "action";
  since: string;
  until?: string;
  removedIn?: string;
  prefix: string;
  /** The module can act as a `generator=` (paraminfo `generator` flag, union across the released fleet). */
  generator: boolean;
  params: Map<string, ParamUnion>;
  help: HelpTexts;
}

export interface VersionInfo {
  name: string;
  order: [number, number];
  isOrg: boolean;
  file: VersionFile;
}

export interface Union {
  versions: VersionInfo[]; // sorted ascending
  latest: VersionInfo;
  queryModules: Map<string, ModuleUnion>;
  actions: Map<string, ModuleUnion>;
  /** Per-kind module set differences worth surfacing to humans. */
  stats: { queryModules: number; actions: number; paramsSkew: number };
}

function versionOrder(name: string): [number, number] {
  const match = name.match(/(\d+)\.(\d+)$/);
  if (!match) throw new Error(`cannot parse version from snapshot name "${name}"`);
  return [Number(match[1]), Number(match[2])];
}

/** org-`X.Y` snapshot names normalize to plain `X.Y` in emitted labels. */
function versionLabel(name: string): string {
  return name.replace(/^org-/, "");
}

/**
 * Parameters observed ONLY on the WMF-development snapshot (org-1.47) that
 * were verified as MediaWiki core by reading the release sources (1.46 and,
 * for the since claim, the earliest covered release carrying them):
 *
 *  - `watchlistexpiry` / `expiry`: registered in ApiBlock, ApiEditPage,
 *    ApiUnblock, ApiUpload, ApiWatch, … behind `$wgWatchlistExpiry`; present
 *    in the 1.39 sources (fleet containers run with it disabled, which is why
 *    their paraminfo lacks it);
 *  - `global` / `autotext` / `license` / `loginreauthenticate` /
 *    `amireauthenticate`: 1.47 additions, registered unconditionally in
 *    ApiLogout, ApiUpload, ApiClientLogin and ApiQueryAuthManagerInfo
 *    respectively (all absent from the 1.46 sources).
 *
 * Everything else that only appears on the org snapshot is an extension or
 * production-farm contribution hooking into core modules (ConfirmEdit,
 * CheckUser, DiscussionTools, TemplateSandbox, CirrusSearch, CentralAuth, …)
 * and stays out of the core packs — this includes `mobileformat` (added to
 * `action=parse` by MobileFrontend) and `editorinterface` (added to
 * `action=edit` by VisualEditor / DiscussionTools): neither is registered
 * anywhere in the 1.39–1.47 core sources, which only ever *read* the former.
 */
const ORG_ONLY_CORE: Map<string, { since: string; note?: string }> = new Map([
  [
    "watchlistexpiry",
    { since: "1.39", note: "Only available when $wgWatchlistExpiry is enabled." },
  ],
  ["expiry", { since: "1.39", note: "Only available when $wgWatchlistExpiry is enabled." }],
  ["global", { since: "1.47" }],
  ["autotext", { since: "1.47" }],
  ["license", { since: "1.47" }],
  ["loginreauthenticate", { since: "1.47" }],
  ["amireauthenticate", { since: "1.47" }],
]);

/**
 * Enum VALUES observed ONLY on the WMF-development snapshot that were verified
 * as MediaWiki core by reading the release sources (same discipline as
 * {@link ORG_ONLY_CORE}, value level — the union never otherwise takes enum
 * values from org). Keys are `module.param`.
 */
const ORG_ONLY_CORE_VALUES: Map<string, { values: [string, string][] }> = new Map([
  // ApiQuerySiteinfo 1.47: `crosssiteajaxdomains` in the siprop list.
  ["siteinfo.siprop", { values: [["crosssiteajaxdomains", "1.47"]] }],
  // ApiQueryLanguageinfo 1.47: five new prop values (8 in 1.46 → 13 in 1.47).
  [
    "languageinfo.liprop",
    {
      values: [
        ["digittransforms", "1.47"],
        ["digitgroupingpattern", "1.47"],
        ["minimumgroupingdigits", "1.47"],
        ["namespacenames", "1.47"],
        ["namespacealiases", "1.47"],
      ],
    },
  ],
]);

/**
 * Core parameters registered behind a wiki-configuration flag that is OFF on
 * EVERY evidence wiki (the released fleet and mediawiki.org alike), so no
 * paraminfo snapshot carries them and {@link ORG_ONLY_CORE} cannot reach them
 * (it only admits params that ARE present on the org snapshot). Verified by
 * reading the release sources (see dev-docs/authoring.md §1.4); injected into
 * the union so the config-gated surface is still modeled.
 *
 *  - `upload.copystatus` / `upload.source`: added to ApiUpload in 1.47 (absent
 *    from the 1.39–1.46 sources), registered behind `$wgUseCopyrightUpload`
 *    (default false; the config is itself deprecated in 1.47).
 *
 * Keys are `module.wireName`.
 */
const SOURCE_ONLY_CORE: Map<
  string,
  {
    since: string;
    type?: string | string[];
    multi?: boolean;
    required?: boolean;
    note: string;
    doc: string;
  }
> = new Map([
  [
    "upload.copystatus",
    {
      since: "1.47",
      type: "string",
      note: "Only registered when $wgUseCopyrightUpload is enabled.",
      doc: "Copyright status of the file (depends on $wgUseCopyrightUpload). Only used together with autotext to generate the file description page wikitext.",
    },
  ],
  [
    "upload.source",
    {
      since: "1.47",
      type: "string",
      note: "Only registered when $wgUseCopyrightUpload is enabled.",
      doc: "Source of the file (depends on $wgUseCopyrightUpload). Only used together with autotext to generate the file description page wikitext.",
    },
  ],
]);

/**
 * Parameters whose presence/required-ness is set by wiki CONFIGURATION rather
 * than by module schema. The evidence fleet runs default config, so the union
 * captures the default; a differently-configured wiki flips it.
 *
 * Same discipline as the response package's "配置门控键->可选" (see its
 * AGENTS.md「配置依赖」): declare the permissive shape and name the mechanism
 * in the JSDoc instead of tightening by the default value. Keys are
 * `module.param` (wire name).
 */
const CONFIG_GATED_PARAMS: Map<string, { optional?: boolean; since?: string; note: string }> =
  new Map([
    [
      "resetpassword.token",
      {
        optional: true,
        note: "Required only when the wiki enables a password-reset route ($wgPasswordResetRoutes); without one the parameter does not exist.",
      },
    ],
    [
      // Present in the 1.39 sources behind the config; the fleet's default
      // config hides it until 1.45 dropped the gate, so the union would
      // otherwise claim `@since 1.45` for a 1.39 parameter.
      "block.actionrestrictions",
      {
        since: "1.39",
        note: "Only registered when $wgEnablePartialActionBlocks is enabled (1.39–1.44); unconditional since 1.45.",
      },
    ],
  ]);

const CONTENT_MODEL_NOTE =
  "Open union: the value set is the content-handler registry ($wgContentHandlers, extension.json ContentHandlers, the GetContentModels hook); core's models are listed for autocomplete only.";
const CONTENT_FORMAT_NOTE =
  "Open union: the value set comes from IContentHandlerFactory::getAllContentFormats().";
const TOKEN_TYPE_NOTE =
  "Open union: token types come from core plus the ApiQueryTokensRegisterTypes hook.";

/**
 * Enums whose value set is decided by something OTHER than core's own code — a
 * registry, a hook, site configuration or an external spec — so it cannot be
 * listed exhaustively. Per the response package's §3.10 rule (AGENTS.md
 * 「配置依赖 · 配置枚举」) these stay OPEN: the captured values are kept for
 * autocomplete and `(string & {})` accepts the rest, and the note names the
 * mechanism (which that package requires of every open union).
 *
 * Keys are `module.param` (wire name).
 */
const OPEN_ENUM_PARAMS: Map<string, string> = new Map([
  ["edit.contentmodel", CONTENT_MODEL_NOTE],
  ["edit.contentformat", CONTENT_FORMAT_NOTE],
  ["parse.contentmodel", CONTENT_MODEL_NOTE],
  ["parse.contentformat", CONTENT_FORMAT_NOTE],
  ["stashedit.contentmodel", CONTENT_MODEL_NOTE],
  ["stashedit.contentformat", CONTENT_FORMAT_NOTE],
  ["changecontentmodel.model", CONTENT_MODEL_NOTE],
  ["compare.fromcontentmodel", CONTENT_MODEL_NOTE],
  ["compare.tocontentmodel", CONTENT_MODEL_NOTE],
  ["compare.fromcontentformat", CONTENT_FORMAT_NOTE],
  ["compare.tocontentformat", CONTENT_FORMAT_NOTE],
  ["random.rncontentmodel", CONTENT_MODEL_NOTE],
  ["revisions.rvcontentformat", CONTENT_FORMAT_NOTE],
  ["allrevisions.arvcontentformat", CONTENT_FORMAT_NOTE],
  ["alldeletedrevisions.adrcontentformat", CONTENT_FORMAT_NOTE],
  ["deletedrevisions.drvcontentformat", CONTENT_FORMAT_NOTE],
  [
    "setpagelanguage.lang",
    "Open union: the value set is the wiki's language list (core plus $wgExtraLanguageNames and languages provided by extensions).",
  ],
  ["tokens.type", TOKEN_TYPE_NOTE],
  ["checktoken.type", TOKEN_TYPE_NOTE],
  [
    "paraminfo.querymodules",
    "Open union: the module list is core plus whatever extensions register.",
  ],
  [
    "block.actionrestrictions",
    "Open union: the value set is core's block actions plus any registered through the GetAllBlockActions hook.",
  ],
  [
    "allpages.apprtype",
    "Open union: the value set is the wiki's restriction-type list ($wgRestrictionTypes); core's types are listed for autocomplete only.",
  ],
  [
    "allpages.apprlevel",
    "Open union: the value set is the wiki's restriction-level list ($wgRestrictionLevels); core's levels are listed for autocomplete only.",
  ],
  [
    "protectedtitles.ptlevel",
    "Open union: the value set is the wiki's restriction-level list ($wgRestrictionLevels); core's levels are listed for autocomplete only.",
  ],
  [
    "allusers.augroup",
    "Open union: the value set is the wiki's user-group registry (core groups plus groups added by configuration and extensions).",
  ],
  [
    "allusers.auexcludegroup",
    "Open union: the value set is the wiki's user-group registry (core groups plus groups added by configuration and extensions).",
  ],
  [
    "allusers.aurights",
    "Open union: the value set is the wiki's permission registry (core rights plus rights added by configuration and extensions).",
  ],
  [
    "contributors.pcgroup",
    "Open union: the value set is the wiki's user-group registry (core groups plus groups added by configuration and extensions).",
  ],
  [
    "contributors.pcexcludegroup",
    "Open union: the value set is the wiki's user-group registry (core groups plus groups added by configuration and extensions).",
  ],
  [
    "contributors.pcrights",
    "Open union: the value set is the wiki's permission registry (core rights plus rights added by configuration and extensions).",
  ],
  [
    "search.srsort",
    "Open union: the value set comes from the search engine's getValidSorts(); the parameter itself is only exposed when a single search backend is configured.",
  ],
  [
    "logevents.letype",
    "Open union: the value set comes from $wgLogTypes (core log types plus those registered by extensions).",
  ],
  [
    "logevents.leaction",
    "Open union: the value set comes from $wgLogActions and $wgLogActionsHandlers (core actions plus those registered by extensions).",
  ],
]);

function loadVersions(): VersionInfo[] {
  const files = readdirSync(VERSIONS_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0)
    throw new Error(`no snapshots in ${VERSIONS_DIR} — run fetch:paraminfo <version> first`);
  const versions = files
    .map((f) => {
      const name = f.slice(0, -5);
      return {
        name,
        order: versionOrder(name),
        isOrg: name.startsWith("org-"),
        file: JSON.parse(readFileSync(join(VERSIONS_DIR, f), "utf8")) as VersionFile,
      };
    })
    .sort((a, b) => a.order[0] - b.order[0] || a.order[1] - b.order[1]);
  // org snapshots carry the host wiki's extension modules; they contribute
  // presence for parameters of CORE modules only — the module set itself is
  // defined by the released fleet (org modules absent there are ext packs'
  // business, Phase 5).
  const fleetStems = new Set<string>();
  for (const v of versions) {
    if (v.isOrg) continue;
    for (const stem of Object.keys(v.file.queryModules)) fleetStems.add(`q:${stem}`);
    for (const stem of Object.keys(v.file.actions)) fleetStems.add(`a:${stem}`);
  }
  for (const v of versions) {
    if (!v.isOrg) continue;
    v.file.queryModules = Object.fromEntries(
      Object.entries(v.file.queryModules).filter(([stem]) => fleetStems.has(`q:${stem}`)),
    );
    v.file.actions = Object.fromEntries(
      Object.entries(v.file.actions).filter(([stem]) => fleetStems.has(`a:${stem}`)),
    );
  }
  return versions;
}

function unionParams(
  stem: string,
  perVersion: { version: VersionInfo; mod: ParamInfoModule | undefined }[],
): Map<string, ParamUnion> {
  const params = new Map<string, ParamUnion>();
  for (const { version, mod } of perVersion) {
    if (!mod) continue;
    for (const param of mod.parameters ?? []) {
      const name = `${mod.prefix ?? ""}${param.name}`;
      const existing = params.get(name);
      if (!existing) {
        // org-only params enter the union only through the source-verified
        // allowlist; anything else is extension/farm contamination.
        if (version.isOrg) {
          const allowed = ORG_ONLY_CORE.get(name);
          if (!allowed) continue;
          params.set(name, {
            name,
            since: allowed.since,
            note: allowed.note,
            required: param.required === true,
            multi: param.multi === true,
            type: param.type ?? "string",
            deprecatedFlag: param.deprecated,
            deprecatedvalues: param.deprecatedvalues,
            values: undefined,
          });
          continue;
        }
        params.set(name, {
          name,
          since: versionLabel(version.name),
          required: param.required === true,
          multi: param.multi === true,
          type: param.type ?? "string",
          deprecatedFlag: param.deprecated,
          deprecatedvalues: param.deprecatedvalues,
          values: Array.isArray(param.type)
            ? new Map(param.type.map((v) => [v, versionLabel(version.name)]))
            : undefined,
        });
        continue;
      }
      // Enum values accumulate across the released fleet; org snapshots stay
      // out of the value unions (extension contamination).
      if (Array.isArray(existing.type) && Array.isArray(param.type) && !version.isOrg) {
        for (const value of param.type) {
          const flat = Array.isArray(value) ? value.map(String) : [String(value)];
          for (const v of flat)
            existing.values?.set(v, existing.values.get(v) ?? versionLabel(version.name));
        }
      }
      // Facts always refresh: later entries win, so the latest version of
      // presence ends up providing required/multi/type/deprecated.
      existing.until = versionLabel(version.name);
      existing.required = param.required === true;
      existing.multi = param.multi === true;
      existing.type = param.type ?? "string";
      existing.deprecatedFlag = param.deprecated;
      existing.deprecatedvalues = param.deprecatedvalues;
    }
  }
  // Config-gated params absent from every snapshot (SOURCE_ONLY_CORE) are
  // injected here so downstream checks (removal detection, config gates, open
  // enums, audit, generation) treat them like any other union parameter.
  for (const [key, spec] of SOURCE_ONLY_CORE) {
    const dot = key.indexOf(".");
    if (key.slice(0, dot) !== stem) continue;
    const name = key.slice(dot + 1);
    if (params.has(name)) continue;
    params.set(name, {
      name,
      since: spec.since,
      required: spec.required === true,
      multi: spec.multi === true,
      type: spec.type ?? "string",
      note: spec.note,
      doc: spec.doc,
    });
  }
  // Removal detection runs over the released fleet only: an org snapshot
  // can serve a module as ApiDisabled — its absence proves nothing
  // (imagerotate on mediawiki.org).
  const fleet = perVersion.filter((entry) => !entry.version.isOrg);
  for (const param of params.values()) {
    const lastFleet = fleet.findLast(
      (entry) => entry.mod !== undefined && hasParam(entry.mod, param.name),
    );
    param.until = lastFleet ? versionLabel(lastFleet.version.name) : undefined;
    if (lastFleet) {
      const after = fleet.filter((entry) => entry.version.order > lastFleet.version.order);
      if (
        after.length > 0 &&
        after.every((entry) => entry.mod === undefined || !hasParam(entry.mod, param.name))
      ) {
        param.removedIn = versionLabel(after[0]!.version.name);
      }
    }
  }
  // Source-verified org-only enum values (see ORG_ONLY_CORE_VALUES) join the
  // value union here; everything else org carries stays out.
  for (const [key, whitelist] of ORG_ONLY_CORE_VALUES) {
    const dot = key.indexOf(".");
    const module = key.slice(0, dot);
    const name = key.slice(dot + 1);
    if (module !== stem) continue;
    const param = params.get(name);
    if (!param || !Array.isArray(param.type)) continue;
    param.values ??= new Map();
    for (const [value, since] of whitelist.values) param.values.set(value, since);
  }
  // Config-gated presence/required (see CONFIG_GATED_PARAMS): applied after the
  // version loop so it wins over the default-config facts.
  for (const [key, gate] of CONFIG_GATED_PARAMS) {
    const dot = key.indexOf(".");
    if (key.slice(0, dot) !== stem) continue;
    const param = params.get(key.slice(dot + 1));
    if (!param) continue;
    if (gate.optional) param.required = false;
    if (gate.since) {
      // The parameter existed all along — config merely hid it. Its values
      // share the parameter's `since`, so drop the misleading per-value
      // version prose (which only reflects the fleet's default config).
      param.since = gate.since;
      for (const value of param.values?.keys() ?? []) param.values!.set(value, gate.since);
    }
    param.note = gate.note;
  }
  // Open enums (registry/hook/config-driven value sets): flag + note; the
  // generator appends `(string & {})` and the audit requires it.
  for (const [key, note] of OPEN_ENUM_PARAMS) {
    const dot = key.indexOf(".");
    if (key.slice(0, dot) !== stem) continue;
    const param = params.get(key.slice(dot + 1));
    if (!param || !Array.isArray(param.type)) continue;
    param.open = true;
    // A parameter can be both config-gated and open (block.actionrestrictions):
    // keep the earlier note instead of dropping it.
    param.note = param.note ? `${param.note} ${note}` : note;
  }
  return params;
}

function hasParam(mod: ParamInfoModule, fullName: string): boolean {
  return (mod.parameters ?? []).some((p) => `${mod.prefix ?? ""}${p.name}` === fullName);
}

function unionModule(
  stem: string,
  kind: ModuleUnion["kind"],
  perVersion: { version: VersionInfo; mod: ParamInfoModule | undefined }[],
): ModuleUnion | undefined {
  // Module presence/absence is judged on the released fleet only (an org
  // snapshot can serve a module as ApiDisabled or hide config-gated ones).
  const fleet = perVersion.filter((entry) => !entry.version.isOrg);
  const present = fleet.filter((entry) => entry.mod !== undefined);
  if (present.length === 0) return undefined;
  const first = present[0]!;
  const last = present[present.length - 1]!;
  const after = fleet.filter((entry) => entry.version.order > last.version.order);
  const orgPresence = perVersion.findLast(
    (entry) => entry.version.isOrg && entry.mod !== undefined,
  );
  const helpVersion = orgPresence?.version ?? last.version;
  const helpPath = (orgPresence?.mod ?? last.mod!).path ?? stem;
  // Generator capability is a schema fact (module class implements the
  // generator interface); judged on the released fleet like presence.
  const generator = present.some((entry) => entry.mod!.generator === true);
  return {
    name: stem,
    kind,
    since: versionLabel(first.version.name),
    until: versionLabel(last.version.name),
    removedIn: after.length > 0 ? versionLabel(after[0]!.version.name) : undefined,
    prefix: last.mod!.prefix ?? "",
    generator,
    params: unionParams(stem, perVersion),
    // Prefer the org help texts when available: newest wiki, newest prose —
    // the fallback chain keeps fleet-only modules covered.
    help: helpVersion.file.help[helpPath] ??
      last.version.file.help[helpPath] ?? { description: "", params: {} },
  };
}

export function loadUnion(): Union {
  const versions = loadVersions();
  const latest = versions[versions.length - 1]!;

  const queryStems = new Set<string>();
  const actionStems = new Set<string>();
  for (const version of versions) {
    for (const stem of Object.keys(version.file.queryModules)) queryStems.add(stem);
    for (const stem of Object.keys(version.file.actions)) actionStems.add(stem);
  }

  const queryModules = new Map<string, ModuleUnion>();
  for (const stem of queryStems) {
    const perVersion = versions.map((version) => ({
      version,
      mod: version.file.queryModules[stem],
    }));
    const unioned = unionModule(stem, unionKind(versions, stem), perVersion);
    if (unioned) queryModules.set(stem, unioned);
  }

  const actions = new Map<string, ModuleUnion>();
  for (const stem of actionStems) {
    const perVersion = versions.map((version) => ({ version, mod: version.file.actions[stem] }));
    const unioned = unionModule(stem, "action", perVersion);
    if (unioned) actions.set(stem, unioned);
  }

  let paramsSkew = 0;
  for (const mod of [...queryModules.values(), ...actions.values()]) {
    for (const param of mod.params.values()) if (param.removedIn) paramsSkew++;
  }

  return {
    versions,
    latest,
    queryModules,
    actions,
    stats: { queryModules: queryModules.size, actions: actions.size, paramsSkew },
  };
}

/** A query module's kind can shift across versions (rare); the latest wins. */
function unionKind(versions: VersionInfo[], stem: string): ModuleUnion["kind"] {
  for (let i = versions.length - 1; i >= 0; i--) {
    const mod = versions[i]!.file.queryModules[stem];
    if (mod?.group === "prop" || mod?.group === "list" || mod?.group === "meta") return mod.group;
  }
  return "prop";
}
