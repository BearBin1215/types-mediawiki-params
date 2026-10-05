import type { OneOrMore } from "../common";

/**
 * Request parameters for the `paraminfo` action.
 *
 * Obtain information about API modules.
 */
export interface ApiParaminfoParams {
  /**
   * List of module names (values of the action and format parameters, or `main`). Can specify submodules with a `+`, or all submodules with `+*`, or all submodules recursively with `+**`.
   */
  modules?: OneOrMore<string>;
  /**
   * Format of help strings.
   */
  helpformat?: "html" | "none" | "raw" | "wikitext";
  /**
   * Open union: the module list is core plus whatever extensions register.
   * The "codexicons" value is available since MediaWiki 1.44.
   * The "trackingcategories" value is available since MediaWiki 1.45.
   * @deprecated
   */
  querymodules?: OneOrMore<
    | "allcategories"
    | "alldeletedrevisions"
    | "allfileusages"
    | "allimages"
    | "alllinks"
    | "allmessages"
    | "allpages"
    | "allredirects"
    | "allrevisions"
    | "alltransclusions"
    | "allusers"
    | "authmanagerinfo"
    | "backlinks"
    | "blocks"
    | "categories"
    | "categoryinfo"
    | "categorymembers"
    | "contributors"
    | "deletedrevisions"
    | "deletedrevs"
    | "duplicatefiles"
    | "embeddedin"
    | "extlinks"
    | "exturlusage"
    | "filearchive"
    | "filerepoinfo"
    | "fileusage"
    | "imageinfo"
    | "images"
    | "imageusage"
    | "info"
    | "iwbacklinks"
    | "iwlinks"
    | "langbacklinks"
    | "langlinks"
    | "languageinfo"
    | "links"
    | "linkshere"
    | "logevents"
    | "mystashedfiles"
    | "pagepropnames"
    | "pageprops"
    | "pageswithprop"
    | "prefixsearch"
    | "protectedtitles"
    | "querypage"
    | "random"
    | "recentchanges"
    | "redirects"
    | "revisions"
    | "search"
    | "siteinfo"
    | "stashimageinfo"
    | "tags"
    | "templates"
    | "tokens"
    | "transcludedin"
    | "usercontribs"
    | "userinfo"
    | "users"
    | "watchlist"
    | "watchlistraw"
    | "codexicons"
    | "trackingcategories"
    | (string & {})
  >;
  /**
   * @deprecated
   */
  mainmodule?: string;
  /**
   * @deprecated
   */
  pagesetmodule?: string;
  /**
   * @deprecated
   */
  formatmodules?: OneOrMore<
    "json" | "jsonfm" | "none" | "php" | "phpfm" | "rawfm" | "xml" | "xmlfm"
  >;
}

declare module "../registry" {
  interface ActionParams {
    paraminfo: ApiParaminfoParams;
  }
}
