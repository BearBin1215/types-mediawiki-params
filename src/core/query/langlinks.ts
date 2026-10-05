import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=langlinks` query module.
 *
 * Returns all interlanguage links from the given pages.
 */
export interface ApiQueryLanglinksParams {
  /**
   * Which additional properties to get for each interlanguage link
   */
  llprop?: OneOrMore<"autonym" | "langname" | "url">;
  /**
   * Only return language links with this language code.
   */
  lllang?: string;
  /**
   * Link to search for. Must be used with lllang.
   */
  lltitle?: string;
  /**
   * The direction in which to list.
   */
  lldir?: "ascending" | "descending";
  /**
   * Language code for localised language names.
   */
  llinlanguagecode?: string;
  /**
   * How many langlinks to return.
   */
  lllimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  llcontinue?: string;
  /**
   * @deprecated
   */
  llurl?: boolean;
}

declare module "../../registry" {
  interface QueryPropParams {
    langlinks: ApiQueryLanglinksParams;
  }
}
