import type { OneOrMore } from "../common";

/**
 * Request parameters for the `undelete` action.
 *
 * Undelete revisions of a deleted page.
 * A list of deleted revisions (including timestamps) can be retrieved through prop=deletedrevisions, and a list of deleted file IDs can be retrieved through list=filearchive.
 */
export interface ApiUndeleteParams {
  /**
   * Title of the page to undelete.
   */
  title: string;
  /**
   * Reason for restoring.
   */
  reason?: string;
  /**
   * Change tags to apply to the entry in the deletion log.
   */
  tags?: OneOrMore<string>;
  /**
   * Timestamps of the revisions to undelete. If both timestamps and fileids are empty, all will be undeleted.
   */
  timestamps?: OneOrMore<string>;
  /**
   * IDs of the file revisions to restore. If both timestamps and fileids are empty, all will be restored.
   */
  fileids?: OneOrMore<number>;
  /**
   * Undelete all revisions of the associated talk page, if any.
   */
  undeletetalk?: boolean;
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
    undelete: ApiUndeleteParams;
  }
}
