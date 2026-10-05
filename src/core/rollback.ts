import type { OneOrMore } from "../common";

/**
 * Request parameters for the `rollback` action.
 *
 * Undo the last edit to the page.
 * If the last user who edited the page made multiple edits in a row, they will all be rolled back.
 */
export interface ApiRollbackParams {
  /**
   * Title of the page to roll back. Cannot be used together with pageid.
   */
  title?: string;
  /**
   * Page ID of the page to roll back. Cannot be used together with title.
   */
  pageid?: number;
  /**
   * Tags to apply to the rollback.
   */
  tags?: OneOrMore<string>;
  /**
   * Name of the user whose edits are to be rolled back.
   */
  user: string;
  /**
   * Custom edit summary. If empty, default summary will be used.
   */
  summary?: string;
  /**
   * Mark the reverted edits and the revert as bot edits.
   */
  markbot?: boolean;
  /**
   * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   */
  watchlist?: "nochange" | "preferences" | "unwatch" | "watch";
  /**
   * A "rollback" token retrieved from action=query&meta=tokens
   * For compatibility, the token used in the web UI is also accepted.
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
    rollback: ApiRollbackParams;
  }
}
