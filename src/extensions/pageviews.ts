/**
 * Opt-in extension pack: **PageViewInfo** (`prop=pageviews`, `meta=siteviews`, `list=mostviewed`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/pageviews";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:PageViewInfo
 */

import type { ApiLimit } from "../common";

/**
 * Request parameters for the `prop=pageviews` query module provided by the extension.
 *
 * Shows per-page pageview data (the number of daily pageviews for each of the last pvipdays days).
 * The result format is page title (with underscores) => date (Ymd) => count.
 */
export interface ApiQueryPageviewsParams {
  /**
   * The metric to use for counting views. Depending on what backend is used, not all metrics might be supported. You can use the siteinfo API (action=query&meta=siteinfo) to check which ones are supported, under `pageviewservice-supported-metrics` / module name (`siteviews`, `mostviewed`, etc.)
   */
  pvipmetric?: "pageviews";
  /**
   * The number of days to show.
   */
  pvipdays?: number;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  pvipcontinue?: string;
}
/**
 * Request parameters for the `meta=siteviews` query module provided by the extension.
 *
 * Shows sitewide pageview data (daily pageview totals for each of the last pvisdays days).
 * The result format is date (Ymd) => count.
 */
export interface ApiQuerySiteviewsParams {
  /**
   * The metric to use for counting views. Depending on what backend is used, not all metrics might be supported. You can use the siteinfo API (action=query&meta=siteinfo) to check which ones are supported, under `pageviewservice-supported-metrics` / module name (`siteviews`, `mostviewed`, etc.)
   */
  pvismetric?: "pageviews" | "uniques";
  /**
   * The number of days to show.
   */
  pvisdays?: number;
}
/**
 * Request parameters for the `list=mostviewed` query module provided by the extension.
 *
 * Lists the most viewed pages (based on last day's pageview count).
 */
export interface ApiQueryMostviewedParams {
  /**
   * The metric to use for counting views. Depending on what backend is used, not all metrics might be supported. You can use the siteinfo API (action=query&meta=siteinfo) to check which ones are supported, under `pageviewservice-supported-metrics` / module name (`siteviews`, `mostviewed`, etc.)
   */
  pvimmetric?: "pageviews";
  /**
   * The number of pages to return.
   */
  pvimlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  pvimoffset?: number;
}

declare module "../registry" {
  interface QueryPropParams {
    pageviews: ApiQueryPageviewsParams;
  }
  interface QueryMetaParams {
    siteviews: ApiQuerySiteviewsParams;
  }
  interface QueryListParams {
    mostviewed: ApiQueryMostviewedParams;
  }
  interface QueryGeneratorParams {
    mostviewed: ApiQueryMostviewedParams;
  }
}
