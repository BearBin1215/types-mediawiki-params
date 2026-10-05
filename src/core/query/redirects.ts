import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=redirects` query module.
 *
 * Returns all redirects to the given pages.
 */
export interface ApiQueryRedirectsParams {
  /**
   * Which properties to get
   */
  rdprop?: OneOrMore<"fragment" | "pageid" | "title">;
  /**
   * Only include pages in these namespaces.
   * Note: Due to miser mode, using this may result in fewer than rdlimit results returned before continuing; in extreme cases, zero results may be returned.
   */
  rdnamespace?: OneOrMore<number>;
  /**
   * Show only items that meet these criteria
   */
  rdshow?: OneOrMore<"!fragment" | "fragment">;
  /**
   * How many redirects to return.
   */
  rdlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  rdcontinue?: string;
}

declare module "../../registry" {
  interface QueryPropParams {
    redirects: ApiQueryRedirectsParams;
  }
  interface QueryGeneratorParams {
    redirects: ApiQueryRedirectsParams;
  }
}
