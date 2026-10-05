import type { ApiLimit } from "../../common";

/**
 * Request parameters for the `list=pagepropnames` query module.
 *
 * List all page property names in use on the wiki.
 */
export interface ApiQueryPagepropnamesParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  ppncontinue?: string;
  /**
   * The maximum number of names to return.
   */
  ppnlimit?: ApiLimit;
}

declare module "../../registry" {
  interface QueryListParams {
    pagepropnames: ApiQueryPagepropnamesParams;
  }
}
