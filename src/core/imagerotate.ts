import type { OneOrMore } from "../common";

/**
 * Request parameters for the `imagerotate` action.
 *
 * This module has been disabled.
 */
export interface ApiImagerotateParams {
  /**

     */
  rotation: "90" | "180" | "270";
  /**

     */
  continue?: string;
  /**

     */
  tags?: OneOrMore<string>;
  /**

     */
  titles?: OneOrMore<string>;
  /**

     */
  pageids?: OneOrMore<number>;
  /**

     */
  revids?: OneOrMore<number>;
  /**
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

     */
  redirects?: boolean;
  /**

     */
  converttitles?: boolean;
  /**

     */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    imagerotate: ApiImagerotateParams;
  }
}
