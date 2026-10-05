import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=embeddedin` query module.
 *
 * Find all pages that embed (transclude) the given title.
 */
export interface ApiQueryEmbeddedinParams {
  /**
   * Title to search. Cannot be used together with eipageid.
   */
  eititle?: string;
  /**
   * Page ID to search. Cannot be used together with eititle.
   */
  eipageid?: number;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  eicontinue?: string;
  /**
   * The namespace to enumerate.
   */
  einamespace?: OneOrMore<number>;
  /**
   * The direction in which to list.
   */
  eidir?: "ascending" | "descending";
  /**
   * How to filter for redirects.
   */
  eifilterredir?: "all" | "nonredirects" | "redirects";
  /**
   * How many total pages to return.
   */
  eilimit?: ApiLimit;
}

declare module "../../registry" {
  interface QueryListParams {
    embeddedin: ApiQueryEmbeddedinParams;
  }
  interface QueryGeneratorParams {
    embeddedin: ApiQueryEmbeddedinParams;
  }
}
