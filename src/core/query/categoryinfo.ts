/**
 * Request parameters for the `prop=categoryinfo` query module.
 *
 * Returns information about the given categories.
 */
export interface ApiQueryCategoryinfoParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  cicontinue?: string;
}

declare module "../../registry" {
  interface QueryPropParams {
    categoryinfo: ApiQueryCategoryinfoParams;
  }
}
