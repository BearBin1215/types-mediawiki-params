import type { OneOrMore } from "../common";

/**
 * Request parameters for the `revisiondelete` action.
 *
 * Delete and undelete revisions.
 */
export interface ApiRevisiondeleteParams {
  /**
   * Type of revision deletion being performed.
   */
  type: "archive" | "filearchive" | "logging" | "oldimage" | "revision";
  /**
   * Page title for the revision deletion, if required for the type.
   */
  target?: string;
  /**
   * Identifiers for the revisions to be deleted.
   */
  ids: OneOrMore<string>;
  /**
   * What to hide for each revision.
   */
  hide?: OneOrMore<"comment" | "content" | "user">;
  /**
   * What to unhide for each revision.
   */
  show?: OneOrMore<"comment" | "content" | "user">;
  /**
   * Whether to suppress data from administrators as well as others.
   */
  suppress?: "no" | "nochange" | "yes";
  /**
   * Reason for the deletion or undeletion.
   */
  reason?: string;
  /**
   * Tags to apply to the entry in the deletion log.
   */
  tags?: OneOrMore<string>;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    revisiondelete: ApiRevisiondeleteParams;
  }
}
