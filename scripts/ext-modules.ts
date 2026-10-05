/**
 * The extension pack denominator shared by `fetch-ext-paraminfo.ts` (capture),
 * `bootstrap-extensions.ts` (generation) and `audit-paraminfo.ts --ext`
 * (audit): module names per `src/extensions` pack stem.
 *
 * Kept in lockstep with types-mediawiki-response's `EXT_MODULES` so both
 * packages' extension packs cover the same extensions; entries carry the full
 * paraminfo path (`query+` prefix for query modules).
 */

/** Extension modules per `src/extensions` file stem (stems ≠ module names). */
export const EXT_MODULES: Record<string, string[]> = {
  abusefilters: [
    "abusefilterchecksyntax",
    "abusefilterevalexpression",
    "abusefilterunblockautopromote",
    "abusefiltercheckmatch",
    "abuselogprivatedetails",
    "query+abusefilters",
    "query+abuselog",
  ],
  babel: ["query+babel"],
  categorytree: ["categorytree"],
  checkuser: ["query+checkuser", "query+checkuserlog", "query+checkuserformattedblockinfo"],
  description: ["query+description"],
  discussiontools: [
    "discussiontoolscompare",
    "discussiontoolsedit",
    "discussiontoolsfindcomment",
    "discussiontoolsgetsubscriptions",
    "discussiontoolspageinfo",
    "discussiontoolspreview",
    "discussiontoolssubscribe",
    "discussiontoolsthank",
  ],
  echo: [
    "echomarkread",
    "echomarkseen",
    "echocreateevent",
    "echoarticlereminder",
    "echomute",
    "echopushsubscriptions",
    "query+notifications",
    "query+unreadnotificationpages",
  ],
  extracts: ["query+extracts"],
  flaggedrevs: ["review", "flagconfig", "stabilize"],
  gadgets: ["query+gadgets", "query+gadgetcategories"],
  globalblocks: ["globalblock", "query+globalblocks"],
  globalpreferences: ["globalpreferences", "globalpreferenceoverrides"],
  globalusage: ["query+globalusage"],
  globaluserinfo: ["query+globaluserinfo"],
  linter: ["query+linterrors", "query+linterstats"],
  massmessage: ["massmessage", "editmassmessagelist"],
  oathauth: ["oathvalidate"],
  pageimages: ["query+pageimages"],
  pageviews: ["query+pageviews", "query+siteviews", "query+mostviewed"],
  scribunto: ["scribunto-console"],
  // SiteMatrix registers a top-level `action=sitematrix` module (no `query+`
  // prefix — the response package's map has this entry wrong, its capture
  // lists the module as absent for the same reason).
  sitematrix: ["sitematrix"],
  spamblacklist: ["spamblacklist"],
  templatedata: ["templatedata"],
  thanks: ["thank"],
  timedmediahandler: ["timedtext", "transcodereset", "query+videoinfo", "query+transcodestatus"],
  titleblacklist: ["titleblacklist"],
  urlshortener: ["shortenurl"],
  visualeditor: ["visualeditor", "visualeditoredit", "editcheckreferenceurl"],
  wikibase: ["query+wikibase", "query+pageterms", "query+wbentityusage", "query+wblistentityusage"],
  wikilove: ["wikilove"],
};

/** Every requested module, in stable order. */
export function allExtModules(): string[] {
  const modules: string[] = [];
  for (const names of Object.values(EXT_MODULES)) modules.push(...names);
  return modules;
}

/** Bare stem of a module entry (`query+checkuser` → `checkuser`). */
export function bareStem(path: string): string {
  return path.startsWith("query+") ? path.slice(6) : path;
}

/** Extension name per pack stem, for the pack JSDoc title and `@see` link. */
export const EXTENSION_NAMES: Record<string, string> = {
  abusefilters: "AbuseFilter",
  babel: "Babel",
  categorytree: "CategoryTree",
  checkuser: "CheckUser",
  description: "Wikibase Client",
  discussiontools: "DiscussionTools",
  echo: "Echo",
  extracts: "TextExtracts",
  flaggedrevs: "FlaggedRevs",
  gadgets: "Gadgets",
  globalblocks: "GlobalBlocking",
  globalpreferences: "GlobalPreferences",
  globalusage: "GlobalUsage",
  globaluserinfo: "GlobalUserInfo",
  linter: "Linter",
  massmessage: "MassMessage",
  oathauth: "OATHAuth",
  pageimages: "PageImages",
  pageviews: "PageViewInfo",
  scribunto: "Scribunto",
  sitematrix: "SiteMatrix",
  spamblacklist: "SpamBlacklist",
  templatedata: "TemplateData",
  thanks: "Thanks",
  timedmediahandler: "TimedMediaHandler",
  titleblacklist: "TitleBlacklist",
  urlshortener: "UrlShortener",
  visualeditor: "VisualEditor",
  wikibase: "Wikibase",
  wikilove: "WikiLove",
};

/** Modules whose API registration is behind a wiki-configuration flag, per
 * Echo's includes/Hooks.php (authoring §1.4: paraminfo mirrors the configured
 * wiki); surfaced as a presence note on the interface. */
export const CONFIG_GATED: Record<string, string> = {
  echoarticlereminder: "Only registered when $wgAllowArticleReminderNotification is enabled.",
  echopushsubscriptions: "Only registered when $wgEchoEnablePush is enabled.",
};

/** Per-module presence/shape notes surfaced on the interface doc
 * (source-verified in the extension code pulled to mw-refs/). */
export const MODULE_NOTES: Record<string, string> = {
  stabilize:
    "Which parameter set serves this action depends on $wgFlaggedRevsProtection: the default (general) mode declared here, or the protection mode (`protectlevel` instead of `default`/`autoreview`).",
};

/** Extension parameters whose enum values are wiki-configuration state, not
 * schema (same rule as the core `SITE_STATE_PARAMS`; verified in the extension
 * sources): modeled as open `string` with the note attached.
 * `pattern` matches the full wire parameter name. */
export const SITE_STATE_EXT_PARAMS: { module: string; pattern: RegExp; note: string }[] = [
  {
    module: "review",
    pattern: /^flag_/,
    note: "The tag name and its level count are configured per wiki through $wgFlaggedRevsTags; accepted values are the integers 0…maxLevel as configured.",
  },
  {
    module: "stabilize",
    pattern: /^autoreview$/,
    note: "Levels come from $wgFlaggedRevsRestrictionLevels plus `none`.",
  },
];

/** Extension parameters whose presence/required-ness is set by wiki
 * CONFIGURATION (default off on the evidence wiki), not by module schema.
 * Same discipline as the core `CONFIG_GATED_PARAMS` and the response package's
 * "配置门控键->可选": declare the permissive shape and name the mechanism in
 * the JSDoc instead of tightening by the default. `pattern` matches the wire
 * parameter name. */
export const CONFIG_GATED_EXT_PARAMS: {
  module: string;
  pattern: RegExp;
  optional?: boolean;
  note: string;
}[] = [
  {
    module: "checkuser",
    pattern: /^cureason$/,
    note: "Required only when $wgCheckUserForceSummary is enabled.",
  },
  {
    module: "abuselogprivatedetails",
    pattern: /^reason$/,
    note: "Required only when $wgAbuseFilterPrivateDetailsForceReason is enabled.",
  },
];
