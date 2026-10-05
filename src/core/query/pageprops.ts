import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=pageprops` query module.
 *
 * Get various page properties defined in the page content.
 */
export interface ApiQueryPagepropsParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  ppcontinue?: string;
  /**
   * Only list these page properties (`action=query&list=pagepropnames` returns page property names in use). Useful for checking whether pages use a certain page property.
   */
  ppprop?: OneOrMore<string>;
}

declare module "../../registry" {
  interface QueryPropParams {
    pageprops: ApiQueryPagepropsParams;
  }
}
