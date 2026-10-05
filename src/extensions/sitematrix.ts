/**
 * Opt-in extension pack: **SiteMatrix** (`action=sitematrix`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/sitematrix";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:SiteMatrix
 */

import type { ApiLimit, OneOrMore } from "../common";

/**
 * Request parameters for the `sitematrix` action provided by the extension.
 *
 * Get Wikimedia sites list.
 * The code (technically dbname/wikiid) is either the language code + project code for content projects or the subdomain + main domain for all the others.
 */
export interface ApiSitematrixParams {
  /**
   * Filter the Site Matrix by type
   */
  smtype?: OneOrMore<"language" | "special">;
  /**
   * Filter the Site Matrix by wiki state.
   */
  smstate?: OneOrMore<"all" | "closed" | "fishbowl" | "nonglobal" | "private">;
  /**
   * Which information about a language to return.
   */
  smlangprop?: OneOrMore<"code" | "dir" | "localname" | "name" | "site">;
  /**
   * Which information about a site to return.
   */
  smsiteprop?: OneOrMore<"code" | "dbname" | "lang" | "sitename" | "url">;
  /**
   * Maximum number of results.
   */
  smlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  smcontinue?: string;
}

declare module "../registry" {
  interface ActionParams {
    sitematrix: ApiSitematrixParams;
  }
}
