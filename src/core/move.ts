import type { OneOrMore } from "../common";

/**
 * Request parameters for the `move` action.
 *
 * Move a page.
 */
export interface ApiMoveParams {
  /**
   * Title of the page to rename. Cannot be used together with fromid.
   */
  from?: string;
  /**
   * Page ID of the page to rename. Cannot be used together with from.
   */
  fromid?: number;
  /**
   * Title to rename the page to.
   */
  to: string;
  /**
   * Reason for the rename.
   */
  reason?: string;
  /**
   * Rename the talk page, if it exists.
   */
  movetalk?: boolean;
  /**
   * Rename subpages, if applicable.
   */
  movesubpages?: boolean;
  /**
   * Don't create a redirect.
   */
  noredirect?: boolean;
  /**
   * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   */
  watchlist?: "nochange" | "preferences" | "unwatch" | "watch";
  /**
   * Ignore any warnings.
   */
  ignorewarnings?: boolean;
  /**
   * Change tags to apply to the entry in the move log and to the dummy revision on the destination page.
   */
  tags?: OneOrMore<string>;
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
    move: ApiMoveParams;
  }
}
