import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=alllinks` query module.
 *
 * Enumerate all links that point to a given namespace.
 */
export interface ApiQueryAlllinksParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  alcontinue?: string;
  /**
   * The title of the link to start enumerating from.
   */
  alfrom?: string;
  /**
   * The title of the link to stop enumerating at.
   */
  alto?: string;
  /**
   * Search for all linked titles that begin with this value.
   */
  alprefix?: string;
  /**
   * Only show distinct linked titles. Cannot be used with `alprop=ids`.
   * When used as a generator, yields target pages instead of source pages.
   */
  alunique?: boolean;
  /**
   * Which pieces of information to include
   */
  alprop?: OneOrMore<"ids" | "title">;
  /**
   * The namespace to enumerate.
   */
  alnamespace?: number;
  /**
   * How many total items to return.
   */
  allimit?: ApiLimit;
  /**
   * The direction in which to list.
   */
  aldir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryListParams {
    alllinks: ApiQueryAlllinksParams;
  }
  interface QueryGeneratorParams {
    alllinks: ApiQueryAlllinksParams;
  }
}
