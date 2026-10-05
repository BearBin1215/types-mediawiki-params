import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=transcludedin` query module.
 *
 * Find all pages that transclude the given pages.
 */
export interface ApiQueryTranscludedinParams {
  /**
   * Which properties to get
   */
  tiprop?: OneOrMore<"pageid" | "redirect" | "title">;
  /**
   * Only include pages in these namespaces.
   */
  tinamespace?: OneOrMore<number>;
  /**
   * Show only items that meet these criteria
   */
  tishow?: OneOrMore<"!redirect" | "redirect">;
  /**
   * How many to return.
   */
  tilimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  ticontinue?: string;
}

declare module "../../registry" {
  interface QueryPropParams {
    transcludedin: ApiQueryTranscludedinParams;
  }
  interface QueryGeneratorParams {
    transcludedin: ApiQueryTranscludedinParams;
  }
}
