import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=links` query module.
 *
 * Returns all links from the given pages.
 */
export interface ApiQueryLinksParams {
  /**
   * Show links in these namespaces only.
   */
  plnamespace?: OneOrMore<number>;
  /**
   * How many links to return.
   */
  pllimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  plcontinue?: string;
  /**
   * Only list links to these titles. Useful for checking whether a certain page links to a certain title.
   */
  pltitles?: OneOrMore<string>;
  /**
   * The direction in which to list.
   */
  pldir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryPropParams {
    links: ApiQueryLinksParams;
  }
  interface QueryGeneratorParams {
    links: ApiQueryLinksParams;
  }
}
