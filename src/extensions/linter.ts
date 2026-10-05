/**
 * Opt-in extension pack: **Linter** (`list=linterrors`, `meta=linterstats`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/linter";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:Linter
 */

import type { ApiLimit, OneOrMore } from "../common";

/**
 * Request parameters for the `list=linterrors` query module provided by the extension.
 *
 * Get a list of lint errors
 */
export interface ApiQueryLinterrorsParams {
  /**
   * Categories of lint errors
   */
  lntcategories?: OneOrMore<
    | "bogus-image-options"
    | "deletable-table-tag"
    | "duplicate-ids"
    | "fostered"
    | "fostered-transparent"
    | "html5-misnesting"
    | "large-tables"
    | "misc-tidy-replacement-issues"
    | "misnested-tag"
    | "missing-end-tag"
    | "missing-end-tag-in-heading"
    | "multi-colon-escape"
    | "multiline-html-table-in-list"
    | "multiple-unclosed-formatting-tags"
    | "night-mode-unaware-background-color"
    | "obsolete-tag"
    | "pwrap-bug-workaround"
    | "self-closed-tag"
    | "stripped-tag"
    | "tidy-font-bug"
    | "tidy-whitespace-bug"
    | "unclosed-quotes-in-heading"
    | "wikilink-in-extlink"
  >;
  /**
   * Number of results to query
   */
  lntlimit?: ApiLimit;
  /**
   * Only include lint errors from the specified namespaces
   */
  lntnamespace?: OneOrMore<number>;
  /**
   * Only include lint errors from the specified page IDs
   */
  lntpageid?: OneOrMore<number>;
  /**
   * Only include lint errors from the specified page title
   */
  lnttitle?: string;
  /**
   * Lint ID to start querying from
   */
  lntfrom?: number;
}
/**
 * Request parameters for the `meta=linterstats` query module provided by the extension.
 *
 * Get number of lint errors in each category
 */
export interface ApiQueryLinterstatsParams {}

declare module "../registry" {
  interface QueryListParams {
    linterrors: ApiQueryLinterrorsParams;
  }
  interface QueryMetaParams {
    linterstats: ApiQueryLinterstatsParams;
  }
}
