import type { OneOrMore } from "../common";

/**
 * Request parameters for the `tag` action.
 *
 * Add or remove change tags from individual revisions or log entries.
 */
export interface ApiTagParams {
  /**
   * One or more recent changes IDs from which to add or remove the tag.
   */
  rcid?: OneOrMore<number>;
  /**
   * One or more revision IDs from which to add or remove the tag.
   */
  revid?: OneOrMore<number>;
  /**
   * One or more log entry IDs from which to add or remove the tag.
   */
  logid?: OneOrMore<number>;
  /**
   * Tags to add. Only manually defined tags can be added.
   */
  add?: OneOrMore<string>;
  /**
   * Tags to remove. Only tags that are either manually defined or completely undefined can be removed.
   */
  remove?: OneOrMore<string>;
  /**
   * Reason for the change.
   */
  reason?: string;
  /**
   * Tags to apply to the log entry that will be created as a result of this action.
   */
  tags?: OneOrMore<string>;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    tag: ApiTagParams;
  }
}
