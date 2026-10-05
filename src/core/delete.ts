import type { OneOrMore } from "../common";

/**
 * Request parameters for the `delete` action.
 *
 * Delete a page.
 */
export interface ApiDeleteParams {
  /**
   * Title of the page to delete. Cannot be used together with pageid.
   */
  title?: string;
  /**
   * Page ID of the page to delete. Cannot be used together with title.
   */
  pageid?: number;
  /**
   * Reason for the deletion. If not set, an automatically generated reason will be used.
   */
  reason?: string;
  /**
   * Change tags to apply to the entry in the deletion log.
   */
  tags?: OneOrMore<string>;
  /**
   * Delete the talk page, if it exists.
   */
  deletetalk?: boolean;
  /**
   * @deprecated
   */
  watch?: boolean;
  /**
   * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   */
  watchlist?: "nochange" | "preferences" | "unwatch" | "watch";
  /**
   * @deprecated
   */
  unwatch?: boolean;
  /**
   * The name of the old image to delete as provided by action=query&prop=imageinfo&iiprop=archivename.
   */
  oldimage?: string;
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
    delete: ApiDeleteParams;
  }
}
