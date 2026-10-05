import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=iwlinks` query module.
 *
 * Returns all interwiki links from the given pages.
 */
export interface ApiQueryIwlinksParams {
  /**
   * Which additional properties to get for each interwiki link
   */
  iwprop?: OneOrMore<"url">;
  /**
   * Only return interwiki links with this prefix.
   */
  iwprefix?: string;
  /**
   * Interwiki link to search for. Must be used with iwprefix.
   */
  iwtitle?: string;
  /**
   * The direction in which to list.
   */
  iwdir?: "ascending" | "descending";
  /**
   * How many interwiki links to return.
   */
  iwlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  iwcontinue?: string;
  /**
   * @deprecated
   */
  iwurl?: boolean;
}

declare module "../../registry" {
  interface QueryPropParams {
    iwlinks: ApiQueryIwlinksParams;
  }
}
