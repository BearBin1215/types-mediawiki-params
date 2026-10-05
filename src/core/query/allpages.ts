import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=allpages` query module.
 *
 * Enumerate all pages sequentially in a given namespace.
 */
export interface ApiQueryAllpagesParams {
  /**
   * The page title to start enumerating from.
   */
  apfrom?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  apcontinue?: string;
  /**
   * The page title to stop enumerating at.
   */
  apto?: string;
  /**
   * Search for all page titles that begin with this value.
   */
  apprefix?: string;
  /**
   * The namespace to enumerate.
   */
  apnamespace?: number;
  /**
   * Which pages to list.
   * Note: Due to miser mode, using this may result in fewer than aplimit results returned before continuing; in extreme cases, zero results may be returned.
   */
  apfilterredir?: "all" | "nonredirects" | "redirects";
  /**
   * Limit to pages with at least this many bytes.
   */
  apminsize?: number;
  /**
   * Limit to pages with at most this many bytes.
   * Disabled due to miser mode.
   */
  apmaxsize?: number;
  /**
   * Limit to protected pages only.
   *
   * Open union: the value set is the wiki's restriction-type list ($wgRestrictionTypes); core's types are listed for autocomplete only.
   */
  apprtype?: OneOrMore<"edit" | "move" | "upload" | (string & {})>;
  /**
   * Filter protections based on protection level (must be used with apprtype= parameter).
   *
   * Open union: the value set is the wiki's restriction-level list ($wgRestrictionLevels); core's levels are listed for autocomplete only.
   */
  apprlevel?: OneOrMore<"" | "autoconfirmed" | "sysop" | (string & {})>;
  /**
   * Filter protections based on cascadingness (ignored when apprtype isn't set).
   */
  apprfiltercascade?: "all" | "cascading" | "noncascading";
  /**
   * How many total pages to return.
   */
  aplimit?: ApiLimit;
  /**
   * The direction in which to list.
   */
  apdir?: "ascending" | "descending";
  /**
   * Filter based on whether a page has langlinks. Note that this may not consider langlinks added by extensions.
   */
  apfilterlanglinks?: "all" | "withlanglinks" | "withoutlanglinks";
  /**
   * Which protection expiry to filter the page on
   */
  apprexpiry?: "all" | "definite" | "indefinite";
}

declare module "../../registry" {
  interface QueryListParams {
    allpages: ApiQueryAllpagesParams;
  }
  interface QueryGeneratorParams {
    allpages: ApiQueryAllpagesParams;
  }
}
