import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=trackingcategories` query module.
 *
 * Enumerate all existing tracking categories defined in Special:TrackingCategories. A tracking category exists if it contains pages or if its category page exists.
 *
 * @since MediaWiki 1.45
 */
export interface ApiQueryTrackingcategoriesParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   *
   * @since MediaWiki 1.45
   */
  tccontinue?: string;
  /**
   * Search for all existing tracking category titles that match the provided tracking category name (as defined by "message name" on Special:TrackingCategories.)
   *
   * @since MediaWiki 1.45
   */
  tctrackingcatname?: OneOrMore<string>;
  /**
   * Only return existing tracking categories with at least this many members.
   *
   * @since MediaWiki 1.45
   */
  tcmin?: number;
  /**
   * Only return existing tracking categories with at most this many members.
   *
   * @since MediaWiki 1.45
   */
  tcmax?: number;
  /**
   * How many tracking categories to return.
   *
   * @since MediaWiki 1.45
   */
  tclimit?: ApiLimit;
  /**
   * Which properties to get
   *
   * @since MediaWiki 1.45
   */
  tcprop?: OneOrMore<"hidden" | "size">;
}

declare module "../../registry" {
  interface QueryListParams {
    trackingcategories: ApiQueryTrackingcategoriesParams;
  }
  interface QueryGeneratorParams {
    trackingcategories: ApiQueryTrackingcategoriesParams;
  }
}
