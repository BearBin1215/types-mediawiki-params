/**
 * Opt-in extension pack: **VisualEditor** (`action=visualeditor`, `action=visualeditoredit`, `action=editcheckreferenceurl`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/visualeditor";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:VisualEditor
 */

import type { OneOrMore } from "../common";

/**
 * Request parameters for the `visualeditor` action provided by the extension.
 *
 * Returns HTML5 for a page from the Parsoid service.
 */
export interface ApiVisualeditorParams {
  /**
   * The page to perform actions on.
   */
  page: string;
  /**
   * If RESTBase query returned a seemingly invalid ETag, pass it here for logging purposes.
   */
  badetag?: string;
  /**
   * The format of the output.
   */
  format?: "json" | "jsonfm";
  /**
   * Action to perform.
   */
  paction: "metadata" | "parse" | "parsefragment" | "templatesused" | "wikitext";
  /**
   * Wikitext to send to Parsoid to convert to HTML (paction=parsefragment).
   */
  wikitext?: string;
  /**
   * The section on which to act.
   */
  section?: string;
  /**
   * When saving, set this true if you want to use the stashing API.
   */
  stash?: boolean;
  /**
   * The revision number to use (defaults to latest revision).
   */
  oldid?: number;
  /**
   * Edit intro to add to notices.
   */
  editintro?: string;
  /**
   * Pre-save transform wikitext before sending it to Parsoid (paction=parsefragment).
   */
  pst?: boolean;
  /**
   * The page to use content from if the fetched page has no content yet.
   */
  preload?: string;
  /**
   * Parameters to substitute into the preload page, if present.
   */
  preloadparams?: OneOrMore<string>;
}
/**
 * Request parameters for the `visualeditoredit` action provided by the extension.
 *
 * Save an HTML5 page to MediaWiki (converted to wikitext via the Parsoid service).
 */
export interface ApiVisualeditoreditParams {
  /**
   * Action to perform.
   */
  paction: "diff" | "save" | "serialize" | "serializeforcache";
  /**
   * The page to perform actions on.
   */
  page: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * The wikitext to act with.
   */
  wikitext?: string;
  /**
   * The section on which to act.
   */
  section?: string;
  /**
   * Title for new section.
   */
  sectiontitle?: string;
  /**
   * When saving, set this to the timestamp of the revision that was edited. Used to detect edit conflicts.
   */
  basetimestamp?: string;
  /**
   * When saving, set this to the timestamp of when the page was loaded. Used to detect edit conflicts.
   */
  starttimestamp?: string;
  /**
   * The revision number to use. Defaults to latest revision.
   */
  oldid?: number;
  /**
   * Flag for minor edit.
   */
  minor?: string;
  /**
   * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   */
  watchlist?: string;
  /**
   * HTML to send to Parsoid in exchange for wikitext.
   */
  html?: string;
  /**
   * ETag to send.
   */
  etag?: string;
  /**
   * Edit summary.
   */
  summary?: string;
  /**
   * Captcha ID (when saving with a captcha response).
   */
  captchaid?: string;
  /**
   * Answer to the captcha (when saving with a captcha response).
   */
  captchaword?: string;
  /**
   * Use the result of a previous serializeforcache request with this key. Overrides html.
   */
  cachekey?: string;
  /**
   * Omit the HTML content of the new revision in the response.
   */
  nocontent?: boolean;
  /**
   * Page title. If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to the given page, instead of the page that was edited.
   */
  returnto?: string;
  /**
   * URL query parameters (with leading `?`). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given query parameters.
   */
  returntoquery?: string;
  /**
   * URL fragment (with leading `#`). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given fragment.
   */
  returntoanchor?: string;
  /**
   * Apply the selected skin to the parser output. May affect the following properties: `text`, `langlinks`, `headitems`, `modules`, `jsconfigvars`, `indicators`.
   */
  useskin?:
    | "apioutput"
    | "authentication-popup"
    | "fallback"
    | "json"
    | "minerva"
    | "monobook"
    | "timeless"
    | "vector"
    | "vector-2022";
  /**
   * Change tags to apply to the edit.
   */
  tags?: OneOrMore<string>;
  /**
   * Plugins associated with the API request.
   */
  plugins?: OneOrMore<string>;
}
/**
 * Request parameters for the `editcheckreferenceurl` action provided by the extension.
 *
 * Check the status of a URL for use as a reference.
 */
export interface ApiEditcheckreferenceurlParams {
  /**
   * URL to check.
   */
  url: string;
}

declare module "../registry" {
  interface ActionParams {
    visualeditor: ApiVisualeditorParams;
    visualeditoredit: ApiVisualeditoreditParams;
    editcheckreferenceurl: ApiEditcheckreferenceurlParams;
  }
}
