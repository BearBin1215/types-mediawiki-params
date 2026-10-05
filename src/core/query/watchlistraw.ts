import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=watchlistraw` query module.
 *
 * Get all pages on the current user's watchlist.
 */
export interface ApiQueryWatchlistrawParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  wrcontinue?: string;
  /**
   * Only list pages in the given namespaces.
   */
  wrnamespace?: OneOrMore<number>;
  /**
   * How many total results to return per request.
   */
  wrlimit?: ApiLimit;
  /**
   * Which additional properties to get
   */
  wrprop?: OneOrMore<"changed">;
  /**
   * Only list items that meet these criteria.
   */
  wrshow?: OneOrMore<"!changed" | "changed">;
  /**
   * Used along with wrtoken to access a different user's watchlist.
   */
  wrowner?: string;
  /**
   * A security token (available in the user's preferences) to allow access to another user's watchlist.
   */
  wrtoken?: string;
  /**
   * The direction in which to list.
   */
  wrdir?: "ascending" | "descending";
  /**
   * Title (with namespace prefix) to begin enumerating from.
   */
  wrfromtitle?: string;
  /**
   * Title (with namespace prefix) to stop enumerating at.
   */
  wrtotitle?: string;
}

declare module "../../registry" {
  interface QueryListParams {
    watchlistraw: ApiQueryWatchlistrawParams;
  }
  interface QueryGeneratorParams {
    watchlistraw: ApiQueryWatchlistrawParams;
  }
}
