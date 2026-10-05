/**
 * Opt-in extension pack: **WikiLove** (`action=wikilove`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/wikilove";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:WikiLove
 */

import type { OneOrMore } from "../common";

/**
 * Request parameters for the `wikilove` action provided by the extension.
 *
 * Give WikiLove to another user.
 * WikiLove is a positive message posted to a user's talk page through a convenient interface with preset or locally defined templates. This action adds the specified wikitext to a certain talk page. For statistical purposes, the type and other data are logged.
 */
export interface ApiWikiloveParams {
  /**
   * Full pagename of the user page or user talk page of the user to send WikiLove to.
   */
  title: string;
  /**
   * Raw wikitext to add in the new section.
   */
  text: string;
  /**
   * Actual message the user has entered, for logging purposes.
   */
  message?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * Subject header of the new section.
   */
  subject: string;
  /**
   * Type of WikiLove (for statistics); this corresponds with a type selected in the menu, and optionally a subtype after that (e.g. as in "The Original Barnstar" or "A kitten for you!").
   */
  type?: string;
  /**
   * Content of the optional email message to send to the user. A warning will be returned if the user cannot be emailed. WikiLove will be sent to the user's talk page either way.
   */
  email?: string;
  /**
   * Change tags to apply to the revision.
   */
  tags?: OneOrMore<string>;
}

declare module "../registry" {
  interface ActionParams {
    wikilove: ApiWikiloveParams;
  }
}
