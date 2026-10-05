/**
 * Opt-in extension pack: **TemplateData** (`action=templatedata`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/templatedata";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:TemplateData
 */

import type { OneOrMore } from "../common";

/**
 * Request parameters for the `templatedata` action provided by the extension.
 *
 * Fetch data stored by the TemplateData extension.
 */
export interface ApiTemplatedataParams {
  /**
   * Return data about titles even if they are missing or lack TemplateData. By default titles are only returned if they exist and have TemplateData.
   */
  includeMissingTitles?: boolean;
  /**
   * @deprecated
   */
  doNotIgnoreMissingTitles?: boolean;
  /**
   * Return localized values in this language. By default all available translations are returned.
   */
  lang?: string;
  /**
   * A list of titles to work on.
   */
  titles?: OneOrMore<string>;
  /**
   * A list of page IDs to work on.
   */
  pageids?: OneOrMore<number>;
  /**
   * A list of revision IDs to work on. Note that almost all query modules will convert revision IDs to the corresponding page ID and work on the latest revision instead. Only `prop=revisions` uses exact revisions for its response.
   */
  revids?: OneOrMore<number>;
  /**
   * Get the list of pages to work on by executing the specified query module.
   * Note: Generator parameter names must be prefixed with a "g", see examples.
   */
  generator?:
    | "allcategories"
    | "alldeletedrevisions"
    | "allfileusages"
    | "allimages"
    | "alllinks"
    | "allpages"
    | "allredirects"
    | "allrevisions"
    | "alltransclusions"
    | "backlinks"
    | "categories"
    | "categorymembers"
    | "configuredpages"
    | "deletedrevisions"
    | "duplicatefiles"
    | "embeddedin"
    | "exturlusage"
    | "fileusage"
    | "images"
    | "imageusage"
    | "iwbacklinks"
    | "langbacklinks"
    | "links"
    | "linkshere"
    | "mostviewed"
    | "oldreviewedpages"
    | "pageswithprop"
    | "prefixsearch"
    | "protectedtitles"
    | "querypage"
    | "random"
    | "recentchanges"
    | "redirects"
    | "revisions"
    | "search"
    | "templates"
    | "transcludedin"
    | "unreviewedpages"
    | "watchlist"
    | "watchlistraw";
  /**
   * Automatically resolve redirects in titles, pageids, and revids, and in pages returned by generator.
   */
  redirects?: boolean;
  /**
   * Convert titles to other variants if necessary. Only works if the wiki's content language supports variant conversion. Languages that support variant conversion include ban, en, crh, gan, iu, ku, mni, sh, shi, sr, tg, tly, uz, wuu, zgh and zh.
   */
  converttitles?: boolean;
}

declare module "../registry" {
  interface ActionParams {
    templatedata: ApiTemplatedataParams;
  }
}
