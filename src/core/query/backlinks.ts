import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=backlinks` query module.
 *
 * Find all pages that link to the given page.
 */
export interface ApiQueryBacklinksParams {
  /**
   * Title to search. Cannot be used together with blpageid.
   */
  bltitle?: string;
  /**
   * Page ID to search. Cannot be used together with bltitle.
   */
  blpageid?: number;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  blcontinue?: string;
  /**
   * The namespace to enumerate.
   */
  blnamespace?: OneOrMore<number>;
  /**
   * The direction in which to list.
   */
  bldir?: "ascending" | "descending";
  /**
   * How to filter for redirects. If set to `nonredirects` when blredirect is enabled, this is only applied to the second level.
   */
  blfilterredir?: "all" | "nonredirects" | "redirects";
  /**
   * How many total pages to return. If blredirect is enabled, the limit applies to each level separately (which means up to 2 * bllimit results may be returned).
   */
  bllimit?: ApiLimit;
  /**
   * If linking page is a redirect, find all pages that link to that redirect as well. Maximum limit is halved.
   */
  blredirect?: boolean;
}

declare module "../../registry" {
  interface QueryListParams {
    backlinks: ApiQueryBacklinksParams;
  }
  interface QueryGeneratorParams {
    backlinks: ApiQueryBacklinksParams;
  }
}
