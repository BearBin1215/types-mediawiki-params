import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=allredirects` query module.
 *
 * List all redirects to a namespace.
 */
export interface ApiQueryAllredirectsParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  arcontinue?: string;
  /**
   * The title of the redirect to start enumerating from.
   */
  arfrom?: string;
  /**
   * The title of the redirect to stop enumerating at.
   */
  arto?: string;
  /**
   * Search for all target pages that begin with this value.
   */
  arprefix?: string;
  /**
   * Only show distinct target pages. Cannot be used with arprop=ids|fragment|interwiki.
   * When used as a generator, yields target pages instead of source pages.
   */
  arunique?: boolean;
  /**
   * Which pieces of information to include
   */
  arprop?: OneOrMore<"fragment" | "ids" | "interwiki" | "title">;
  /**
   * The namespace to enumerate.
   */
  arnamespace?: number;
  /**
   * How many total items to return.
   */
  arlimit?: ApiLimit;
  /**
   * The direction in which to list.
   */
  ardir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryListParams {
    allredirects: ApiQueryAllredirectsParams;
  }
  interface QueryGeneratorParams {
    allredirects: ApiQueryAllredirectsParams;
  }
}
