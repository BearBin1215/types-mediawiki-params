import type { OneOrMore } from "../common";

/**
 * Request parameters for the `unblock` action.
 *
 * Unblock a user.
 */
export interface ApiUnblockParams {
  /**
   * ID of the block to unblock (obtained through `list=blocks`). Cannot be used together with user.
   */
  id?: number;
  /**
   * User to unblock. Cannot be used together with id.
   */
  user?: string;
  /**
   * @deprecated
   */
  userid?: number;
  /**
   * Reason for unblock.
   */
  reason?: string;
  /**
   * Change tags to apply to the entry in the block log.
   */
  tags?: OneOrMore<string>;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * Watch the user's or IP address's user and talk pages.
   *
   * @since MediaWiki 1.41
   */
  watchuser?: boolean;
  /**
   * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   *
   * Only available when $wgWatchlistExpiry is enabled.
   */
  watchlistexpiry?: string;
}

declare module "../registry" {
  interface ActionParams {
    unblock: ApiUnblockParams;
  }
}
