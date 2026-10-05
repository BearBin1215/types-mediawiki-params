/**
 * Shared capture helpers for the paraminfo fetchers: HTTP with polite
 * retries, batched `action=paraminfo`, and apihelp HTML (`action=help&wrap=1`)
 * → JSDoc-ish text extraction. Used by `fetch-paraminfo.ts` (per-version
 * snapshots) and `fetch-ext-paraminfo.ts` (extension pack snapshot).
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const UA =
  "types-mediawiki-params-evidence/0.1 (github.com/BearBin1215/types-mediawiki-params)";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export interface ParamInfoParam {
  name: string;
  type?: string | string[];
  required?: boolean;
  multi?: boolean;
  default?: string | string[];
  deprecated?: boolean | string;
  deprecatedvalues?: string[];
  description?: string;
}

export interface ParamInfoModule {
  name: string;
  path?: string;
  /** The module can act as a `generator=` (paraminfo flag). */
  generator?: boolean;
  group?: string;
  prefix?: string;
  description?: string;
  parameters?: ParamInfoParam[];
}

export interface HelpTexts {
  description: string;
  params: Record<string, string>;
}

export function fullName(mod: Pick<ParamInfoModule, "prefix">, name: string): string {
  return `${mod.prefix ?? ""}${name}`;
}

export function clean(text: string | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

export async function fetchJson(params: string): Promise<any> {
  for (let attempt = 1; ; attempt++) {
    // oxlint-disable-next-line no-await-in-loop
    const res = await fetch(params, { headers: { "User-Agent": UA } });
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      // oxlint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 5000 * attempt));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${new URL(params).search.slice(0, 80)}`);
    return res.json();
  }
}

/** Fetch paraminfo batches; missing-module warnings are tolerated and reported. */
export async function fetchModules(
  api: string,
  batch: string[],
): Promise<{ modules: ParamInfoModule[]; absent: string[] }> {
  const url = `${api}?action=paraminfo&format=json&formatversion=2&modules=${encodeURIComponent(batch.join("|"))}`;
  const body = (await fetchJson(url)) as {
    paraminfo?: { modules?: ParamInfoModule[] };
    warnings?: Record<string, { warnings?: string }>;
    error?: unknown;
  };
  if (body.error) throw new Error(`paraminfo batch failed: ${JSON.stringify(body.error)}`);
  const absent: string[] = [];
  for (const warning of Object.values(body.warnings ?? {})) {
    for (const match of (warning.warnings ?? "").matchAll(/does not have a submodule "([^"]+)"/g)) {
      absent.push(match[1]!);
    }
  }
  return { modules: body.paraminfo?.modules ?? [], absent };
}

/** Harvest per-module apihelp HTML (`action=help&wrap=1`) and extract the
 * module summary plus each parameter's description. Parameters appear as
 * `<dt>…id="<path>:<name>"…</dt><dd class="description">…`, mapping 1:1 onto
 * paraminfo's full parameter names. One module per request: multiple modules
 * concatenate into a single HTML document. */
export async function fetchHelp(
  api: string,
  mods: ParamInfoModule[],
): Promise<Record<string, HelpTexts>> {
  const help: Record<string, HelpTexts> = {};
  const polite = !api.includes("localhost");
  for (const mod of mods) {
    const path = mod.path ?? mod.name;
    const url = `${api}?action=help&format=json&formatversion=2&wrap=1&modules=${encodeURIComponent(path)}`;
    // oxlint-disable-next-line no-await-in-loop
    const body = await fetchJson(url);
    const html =
      typeof body.help === "string"
        ? body.help
        : typeof (body.help as { help?: string } | undefined)?.help === "string"
          ? (body.help as { help: string }).help
          : "";
    help[path] = parseHelpHtml(html);
    // oxlint-disable-next-line no-await-in-loop
    if (polite) await new Promise((r) => setTimeout(r, 1500));
  }
  return help;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

/** Machine-generated apihelp HTML → JSDoc-ish plain text: `<kbd>`-family tags
 * become backticks, `</p>`/`<br>` become line breaks, the rest is stripped. */
function htmlToText(html: string): string {
  const text = html
    .replace(
      /<(kbd|code|samp|tt)\b[^>]*>([\s\S]*?)<\/\1>/gi,
      (_m, _tag, inner) => `\`${decodeEntities(stripTags(inner)).trim()}\``,
    )
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    // A marker cut may land mid-tag; drop the dangling fragment.
    .replace(/<[^>]*$/, "");
  const decoded = decodeEntities(text);
  const lines = decoded
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== ""));
  return lines.join("\n").trim().replace(/:$/, "");
}

/** Extract the module description (the `<p>`s between the flags block and the
 * next `apihelp-block` section) and the per-parameter descriptions. */
function parseHelpHtml(rawHtml: string): HelpTexts {
  // The apihelp footer embeds a `<script>` with a per-request
  // `wgBackendResponseTime` and ResourceLoader deprecation warnings; it leaked
  // into one module's description and made re-captures differ by that timing
  // value. Strip the footer (printfooter + script/style) up front so captures
  // are byte-stable and descriptions carry no page furniture.
  const html = rawHtml
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<div class="printfooter"[\s\S]*?<\/div>/gi, "");
  const params: Record<string, string> = {};
  for (const match of html.matchAll(
    /<dt><span[^>]*?(?:id="[^":]+:([^"]+)")?[^>]*>([^<]*)<\/span><\/dt><dd class="description">([\s\S]*?)<\/dd>/g,
  )) {
    const name = (match[1] ?? match[2] ?? "").trim();
    if (!name) continue;
    const fragment = match[3]!.split(/<d[lu]\b/i)[0]!;
    const text = htmlToText(fragment);
    if (text) params[name] = text;
  }

  const flagsEnd = html.indexOf("</ul></div>", html.indexOf("apihelp-flags"));
  let description = "";
  if (flagsEnd !== -1) {
    const rest = html.slice(flagsEnd + "</ul></div>".length);
    const stop = Math.min(
      ...[
        "apihelp-help-urls",
        "apihelp-block-head",
        "apihelp-parameters",
        "apihelp-examples",
        "apihelp-additional-info",
      ]
        .map((marker) => rest.indexOf(marker))
        .filter((i) => i !== -1),
    );
    const head = rest.slice(0, stop === Number.POSITIVE_INFINITY ? undefined : stop);
    description = htmlToText(head);
  }
  return { description, params };
}

/** Fetch a wiki's generator string (`MediaWiki x.y.z`) for provenance. */
export async function fetchGenerator(api: string): Promise<string> {
  const body = await fetchJson(
    `${api}?action=query&meta=siteinfo&siprop=general&format=json&formatversion=2`,
  );
  return body.query?.general?.generator ?? "unknown";
}
