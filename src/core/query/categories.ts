import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=categories` query module.
 *
 * List all categories the pages belong to.
 */
export interface ApiQueryCategoriesParams {
  /**
   * Which additional properties to get for each category
   */
  clprop?: OneOrMore<"hidden" | "sortkey" | "timestamp">;
  /**
   * Which kind of categories to show.
   */
  clshow?: OneOrMore<"!hidden" | "hidden">;
  /**
   * How many categories to return.
   */
  cllimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  clcontinue?: string;
  /**
   * Only list these categories. Useful for checking whether a certain page is in a certain category.
   */
  clcategories?: OneOrMore<string>;
  /**
   * The direction in which to list.
   */
  cldir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryPropParams {
    categories: ApiQueryCategoriesParams;
  }
  interface QueryGeneratorParams {
    categories: ApiQueryCategoriesParams;
  }
}
