import type { OneOrMore } from "../common";

/**
 * Request parameters for the `managetags` action.
 *
 * Perform management tasks relating to change tags.
 */
export interface ApiManagetagsParams {
  /**
   * Which operation to perform
   */
  operation: "activate" | "create" | "deactivate" | "delete";
  /**
   * Tag to create, delete, activate or deactivate. For tag creation, the tag must not exist. For tag deletion, the tag must exist. For tag activation, the tag must exist and not be in use by an extension. For tag deactivation, the tag must be currently active and manually defined.
   */
  tag: string;
  /**
   * An optional reason for creating, deleting, activating or deactivating the tag.
   */
  reason?: string;
  /**
   * Whether to ignore any warnings that are issued during the operation.
   */
  ignorewarnings?: boolean;
  /**
   * Change tags to apply to the entry in the tag management log.
   */
  tags?: OneOrMore<string>;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    managetags: ApiManagetagsParams;
  }
}
