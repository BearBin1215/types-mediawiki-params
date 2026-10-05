import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=fileusage` query module.
 *
 * Find all pages that use the given files.
 */
export interface ApiQueryFileusageParams {
  /**
   * Which properties to get
   */
  fuprop?: OneOrMore<"pageid" | "redirect" | "title">;
  /**
   * Only include pages in these namespaces.
   */
  funamespace?: OneOrMore<number>;
  /**
   * Show only items that meet these criteria
   */
  fushow?: OneOrMore<"!redirect" | "redirect">;
  /**
   * How many to return.
   */
  fulimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  fucontinue?: string;
}

declare module "../../registry" {
  interface QueryPropParams {
    fileusage: ApiQueryFileusageParams;
  }
  interface QueryGeneratorParams {
    fileusage: ApiQueryFileusageParams;
  }
}
