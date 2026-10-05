import type { OneOrMore } from "../common";

/**
 * Request parameters for the `watch` action.
 *
 * Add or remove pages from the current user's watchlist.
 */
export interface ApiWatchParams {
  /**
   * @deprecated
   */
  title?: string;
  /**
   * If set the page will be unwatched rather than watched.
   */
  unwatch?: boolean;
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
   * A "watch" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * Label IDs to assign to the pages being watched. This will replace all existing labels on the pages with the ones specified.
   *
   * @since MediaWiki 1.46
   */
  labels?: OneOrMore<number>;
  /**
   * Expiry timestamp to be applied to all given pages. Omit this parameter entirely to leave any current expiries unchanged.
   *
   * Only available when $wgWatchlistExpiry is enabled.
   */
  expiry?: string;
}

declare module "../registry" {
  interface ActionParams {
    watch: ApiWatchParams;
  }
}
