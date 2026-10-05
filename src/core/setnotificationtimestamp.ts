import type { OneOrMore } from "../common";

/**
 * Request parameters for the `setnotificationtimestamp` action.
 *
 * Update the notification timestamp for watched pages.
 * This affects the highlighting of changed pages in the watchlist and history, and the sending of email when the "Email me when a page or a file on my watchlist is changed" preference is enabled.
 */
export interface ApiSetnotificationtimestampParams {
  /**
   * Work on all watched pages.
   */
  entirewatchlist?: boolean;
  /**
   * Timestamp to which to set the notification timestamp.
   */
  timestamp?: string;
  /**
   * Revision to set the notification timestamp to (one page only).
   */
  torevid?: number;
  /**
   * Revision to set the notification timestamp newer than (one page only).
   */
  newerthanrevid?: number;
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
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    setnotificationtimestamp: ApiSetnotificationtimestampParams;
  }
}
