/**
 * Opt-in extension pack: **SpamBlacklist** (`action=spamblacklist`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/spamblacklist";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:SpamBlacklist
 */

import type { OneOrMore } from "../common";

/**
 * Request parameters for the `spamblacklist` action provided by the extension.
 *
 * Validate one or more URLs against the spam block list.
 */
export interface ApiSpamblacklistParams {
  /**
   * URLs to validate against the block list.
   */
  url: OneOrMore<string>;
}

declare module "../registry" {
  interface ActionParams {
    spamblacklist: ApiSpamblacklistParams;
  }
}
