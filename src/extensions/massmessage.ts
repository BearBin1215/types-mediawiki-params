/**
 * Opt-in extension pack: **MassMessage** (`action=massmessage`, `action=editmassmessagelist`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/massmessage";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:MassMessage
 */

import type { OneOrMore } from "../common";

/**
 * Request parameters for the `massmessage` action provided by the extension.
 *
 * Send a message to a list of pages.
 */
export interface ApiMassmessageParams {
  /**
   * Page containing list of pages to leave a message on.
   */
  spamlist: string;
  /**
   * Subject line of the message.
   */
  subject: string;
  /**
   * Message body text.
   */
  message?: string;
  /**
   * Page to be sent along with the message body.
   */
  "page-message"?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `editmassmessagelist` action provided by the extension.
 *
 * Edit a mass message delivery list.
 */
export interface ApiEditmassmessagelistParams {
  /**
   * Title of the delivery list to update.
   */
  spamlist: string;
  /**
   * New description for the delivery list.
   */
  description?: string;
  /**
   * Titles to add to the list.
   */
  add?: OneOrMore<string>;
  /**
   * Titles to remove from the list.
   */
  remove?: OneOrMore<string>;
  /**
   * Whether the edit should be marked as minor in the history of the list.
   */
  minor?: boolean;
  /**
   * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   */
  watchlist?: "nochange" | "preferences" | "unwatch" | "watch";
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    massmessage: ApiMassmessageParams;
    editmassmessagelist: ApiEditmassmessagelistParams;
  }
}
