import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=alltransclusions` query module.
 *
 * List all transclusions (pages embedded using {{x}}), including non-existing.
 */
export interface ApiQueryAlltransclusionsParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  atcontinue?: string;
  /**
   * The title of the transclusion to start enumerating from.
   */
  atfrom?: string;
  /**
   * The title of the transclusion to stop enumerating at.
   */
  atto?: string;
  /**
   * Search for all transcluded titles that begin with this value.
   */
  atprefix?: string;
  /**
   * Only show distinct transcluded titles. Cannot be used with atprop=ids.
   * When used as a generator, yields target pages instead of source pages.
   */
  atunique?: boolean;
  /**
   * Which pieces of information to include
   */
  atprop?: OneOrMore<"ids" | "title">;
  /**
   * The namespace to enumerate.
   */
  atnamespace?: number;
  /**
   * How many total items to return.
   */
  atlimit?: ApiLimit;
  /**
   * The direction in which to list.
   */
  atdir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryListParams {
    alltransclusions: ApiQueryAlltransclusionsParams;
  }
  interface QueryGeneratorParams {
    alltransclusions: ApiQueryAlltransclusionsParams;
  }
}
