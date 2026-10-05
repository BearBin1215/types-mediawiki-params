import type { OneOrMore } from "../common";

/**
 * Request parameters for the `purge` action.
 *
 * Purge the cache for the given titles.
 */
export interface ApiPurgeParams {
  /**
   * Update the links tables and do other secondary data updates.
   */
  forcelinkupdate?: boolean;
  /**
   * Same as `forcelinkupdate`, and update the links tables for any page that uses this page as a template.
   */
  forcerecursivelinkupdate?: boolean;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  continue?: string;
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
   *
   * The "trackingcategories" value is available since MediaWiki 1.45.
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
    | "watchlist"
    | "watchlistraw"
    | "trackingcategories";
  /**
   * Automatically resolve redirects in titles, pageids, and revids, and in pages returned by generator.
   */
  redirects?: boolean;
  /**
   * Convert titles to other variants if necessary. Only works if the wiki's content language supports variant conversion. Languages that support variant conversion include ban, crh, en, gan, iu, ku, mni, sh, shi, sr, tg, tly, uz, wuu, zgh and zh.
   */
  converttitles?: boolean;
}

declare module "../registry" {
  interface ActionParams {
    purge: ApiPurgeParams;
  }
}
