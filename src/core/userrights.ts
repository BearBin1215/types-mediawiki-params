import type { OneOrMore } from "../common";

/**
 * Request parameters for the `userrights` action.
 *
 * Change a user's group membership.
 */
export interface ApiUserrightsParams {
  /**
   * User.
   */
  user?: string;
  /**
   * @deprecated
   */
  userid?: number;
  /**
   * Add the user to these groups, or if they are already a member, update the expiry of their membership in that group.
   */
  add?: OneOrMore<string>;
  /**
   * Expiry timestamps. May be relative (e.g. `5 months` or `2 weeks`) or absolute (e.g. `2014-09-18T12:34:56Z`). If only one timestamp is set, it will be used for all groups passed to the add parameter. Use `infinite`, `indefinite`, `infinity`, or `never` for a never-expiring user group.
   */
  expiry?: OneOrMore<string>;
  /**
   * Remove the user from these groups.
   */
  remove?: OneOrMore<string>;
  /**
   * Reason for the change.
   */
  reason?: string;
  /**
   * A "userrights" token retrieved from action=query&meta=tokens
   * For compatibility, the token used in the web UI is also accepted.
   */
  token: string;
  /**
   * Change tags to apply to the entry in the user rights log.
   */
  tags?: OneOrMore<string>;
  /**
   * Watch the user's user and talk pages.
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
    userrights: ApiUserrightsParams;
  }
}
