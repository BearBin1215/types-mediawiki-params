import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=iwbacklinks` query module.
 *
 * Find all pages that link to the given interwiki link.
 * Can be used to find all links with a prefix, or all links to a title (with a given prefix). Using neither parameter is effectively "all interwiki links".
 */
export interface ApiQueryIwbacklinksParams {
  /**
   * Prefix for the interwiki.
   */
  iwblprefix?: string;
  /**
   * Interwiki link to search for. Must be used with iwblblprefix.
   */
  iwbltitle?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  iwblcontinue?: string;
  /**
   * How many total pages to return.
   */
  iwbllimit?: ApiLimit;
  /**
   * Which properties to get
   */
  iwblprop?: OneOrMore<"iwprefix" | "iwtitle">;
  /**
   * The direction in which to list.
   */
  iwbldir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryListParams {
    iwbacklinks: ApiQueryIwbacklinksParams;
  }
  interface QueryGeneratorParams {
    iwbacklinks: ApiQueryIwbacklinksParams;
  }
}
