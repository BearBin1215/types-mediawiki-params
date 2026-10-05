import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=imageusage` query module.
 *
 * Find all pages that use the given image title.
 */
export interface ApiQueryImageusageParams {
  /**
   * Title to search. Cannot be used together with iupageid.
   */
  iutitle?: string;
  /**
   * Page ID to search. Cannot be used together with iutitle.
   */
  iupageid?: number;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  iucontinue?: string;
  /**
   * The namespace to enumerate.
   */
  iunamespace?: OneOrMore<number>;
  /**
   * The direction in which to list.
   */
  iudir?: "ascending" | "descending";
  /**
   * How to filter for redirects. If set to nonredirects when iuredirect is enabled, this is only applied to the second level.
   */
  iufilterredir?: "all" | "nonredirects" | "redirects";
  /**
   * How many total pages to return. If iuredirect is enabled, the limit applies to each level separately (which means up to 2 * iulimit results may be returned).
   */
  iulimit?: ApiLimit;
  /**
   * If linking page is a redirect, find all pages that link to that redirect as well. Maximum limit is halved.
   */
  iuredirect?: boolean;
}

declare module "../../registry" {
  interface QueryListParams {
    imageusage: ApiQueryImageusageParams;
  }
  interface QueryGeneratorParams {
    imageusage: ApiQueryImageusageParams;
  }
}
