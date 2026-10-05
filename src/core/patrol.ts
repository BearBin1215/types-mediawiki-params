import type { OneOrMore } from "../common";

/**
 * Request parameters for the `patrol` action.
 *
 * Patrol a page or revision.
 */
export interface ApiPatrolParams {
  /**
   * Recentchanges ID to patrol.
   */
  rcid?: number;
  /**
   * Revision ID to patrol.
   */
  revid?: number;
  /**
   * Change tags to apply to the entry in the patrol log.
   */
  tags?: OneOrMore<string>;
  /**
   * A "patrol" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    patrol: ApiPatrolParams;
  }
}
