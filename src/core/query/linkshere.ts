import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=linkshere` query module.
 *
 * Find all pages that link to the given pages.
 */
export interface ApiQueryLinkshereParams {
  /**
   * Which properties to get
   */
  lhprop?: OneOrMore<"pageid" | "redirect" | "title">;
  /**
   * Only include pages in these namespaces.
   */
  lhnamespace?: OneOrMore<number>;
  /**
   * Show only items that meet these criteria
   */
  lhshow?: OneOrMore<"!redirect" | "redirect">;
  /**
   * How many to return.
   */
  lhlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  lhcontinue?: string;
}

declare module "../../registry" {
  interface QueryPropParams {
    linkshere: ApiQueryLinkshereParams;
  }
  interface QueryGeneratorParams {
    linkshere: ApiQueryLinkshereParams;
  }
}
