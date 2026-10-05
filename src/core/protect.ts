import type { OneOrMore } from "../common";

/**
 * Request parameters for the `protect` action.
 *
 * Change the protection level of a page.
 */
export interface ApiProtectParams {
  /**
   * Title of the page to (un)protect. Cannot be used together with pageid.
   */
  title?: string;
  /**
   * ID of the page to (un)protect. Cannot be used together with title.
   */
  pageid?: number;
  /**
   * List of protection levels, formatted `action=level` (e.g. `edit=sysop`). A level of `all` means everyone is allowed to take the action, i.e. no restriction.
   * Note: Any actions not listed will have restrictions removed.
   */
  protections: OneOrMore<string>;
  /**
   * Expiry timestamps. If only one timestamp is set, it'll be used for all protections. Use `infinite`, `indefinite`, `infinity`, or `never`, for a never-expiring protection.
   */
  expiry?: OneOrMore<string>;
  /**
   * Reason for (un)protecting.
   */
  reason?: string;
  /**
   * Change tags to apply to the entry in the protection log.
   */
  tags?: OneOrMore<string>;
  /**
   * Enable cascading protection (i.e. protect transcluded templates and images used in this page). Ignored if none of the given protection levels support cascading.
   */
  cascade?: boolean;
  /**
   * @deprecated
   */
  watch?: boolean;
  /**
   * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   */
  watchlist?: "nochange" | "preferences" | "unwatch" | "watch";
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   *
   * Only available when $wgWatchlistExpiry is enabled.
   */
  watchlistexpiry?: string;
}

declare module "../registry" {
  interface ActionParams {
    protect: ApiProtectParams;
  }
}
