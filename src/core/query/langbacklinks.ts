import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=langbacklinks` query module.
 *
 * Find all pages that link to the given language link.
 * Can be used to find all links with a language code, or all links to a title (with a given language). Using neither parameter is effectively "all language links".
 * Note that this may not consider language links added by extensions.
 */
export interface ApiQueryLangbacklinksParams {
  /**
   * Language for the language link.
   */
  lbllang?: string;
  /**
   * Language link to search for. Must be used with lbllang.
   */
  lbltitle?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  lblcontinue?: string;
  /**
   * How many total pages to return.
   */
  lbllimit?: ApiLimit;
  /**
   * Which properties to get
   */
  lblprop?: OneOrMore<"lllang" | "lltitle">;
  /**
   * The direction in which to list.
   */
  lbldir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryListParams {
    langbacklinks: ApiQueryLangbacklinksParams;
  }
  interface QueryGeneratorParams {
    langbacklinks: ApiQueryLangbacklinksParams;
  }
}
