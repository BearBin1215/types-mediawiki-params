import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=allcategories` query module.
 *
 * Enumerate all categories.
 */
export interface ApiQueryAllcategoriesParams {
  /**
   * The category to start enumerating from.
   */
  acfrom?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  accontinue?: string;
  /**
   * The category to stop enumerating at.
   */
  acto?: string;
  /**
   * Search for all category titles that begin with this value.
   */
  acprefix?: string;
  /**
   * Direction to sort in.
   */
  acdir?: "ascending" | "descending";
  /**
   * Only return categories with at least this many members.
   */
  acmin?: number;
  /**
   * Only return categories with at most this many members.
   */
  acmax?: number;
  /**
   * How many categories to return.
   */
  aclimit?: ApiLimit;
  /**
   * Which properties to get
   */
  acprop?: OneOrMore<"hidden" | "size">;
}

declare module "../../registry" {
  interface QueryListParams {
    allcategories: ApiQueryAllcategoriesParams;
  }
  interface QueryGeneratorParams {
    allcategories: ApiQueryAllcategoriesParams;
  }
}
