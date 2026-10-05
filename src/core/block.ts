import type { OneOrMore } from "../common";

/**
 * Request parameters for the `block` action.
 *
 * Block a user.
 */
export interface ApiBlockParams {
  /**
   * User to block. Cannot be used together with id.
   */
  user?: string;
  /**
   * @deprecated
   */
  userid?: number;
  /**
   * Expiry time. May be relative (e.g. `5 months` or `2 weeks`) or absolute (e.g. `2014-09-18T12:34:56Z`). If set to `infinite`, `indefinite`, or `never`, the block will never expire.
   */
  expiry?: string;
  /**
   * Reason for block.
   */
  reason?: string;
  /**
   * Block anonymous users only (i.e. disable anonymous edits for this IP address, including temporary account edits).
   */
  anononly?: boolean;
  /**
   * Prevent account creation.
   */
  nocreate?: boolean;
  /**
   * Automatically block the last used IP address, and any subsequent IP addresses they try to login from.
   */
  autoblock?: boolean;
  /**
   * Prevent user from sending email through the wiki. (Requires the `blockemail` right).
   */
  noemail?: boolean;
  /**
   * Hide the username from the block log. (Requires the `hideuser` right).
   */
  hidename?: boolean;
  /**
   * Allow the user to edit their own talk page (depends on $wgBlockAllowsUTEdit).
   */
  allowusertalk?: boolean;
  /**
   * If the user is already blocked by a single block, overwrite the existing block. If the user is blocked more than once, this will fail—use the id parameter instead to specify which block to overwrite. Cannot be used together with id or newblock.
   */
  reblock?: boolean;
  /**
   * Watch the user's or IP address's user and talk pages.
   */
  watchuser?: boolean;
  /**
   * Change tags to apply to the entry in the block log.
   */
  tags?: OneOrMore<string>;
  /**
   * Block user from specific pages or namespaces rather than the entire site.
   */
  partial?: boolean;
  /**
   * List of titles to block the user from editing. Only applies when partial is set to true.
   */
  pagerestrictions?: OneOrMore<string>;
  /**
   * List of namespace IDs to block the user from editing. Only applies when partial is set to true.
   */
  namespacerestrictions?: OneOrMore<number>;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * ID of the block to modify (obtained through `list=blocks`). Cannot be used together with user, reblock, or newblock.
   *
   * @since MediaWiki 1.44
   */
  id?: number;
  /**
   * Add another block even if the user is already blocked. Cannot be used together with id or reblock.
   *
   * @since MediaWiki 1.44
   */
  newblock?: boolean;
  /**
   * List of actions to block the user from performing. Only applies when partial is set to true.
   *
   * Only registered when $wgEnablePartialActionBlocks is enabled (1.39–1.44); unconditional since 1.45. Open union: the value set is core's block actions plus any registered through the GetAllBlockActions hook.
   */
  actionrestrictions?: OneOrMore<"create" | "move" | "upload" | (string & {})>;
  /**
   * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   *
   * Only available when $wgWatchlistExpiry is enabled.
   */
  watchlistexpiry?: string;
}

declare module "../registry" {
  interface ActionParams {
    block: ApiBlockParams;
  }
}
