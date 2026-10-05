/**
 * Opt-in extension pack: **TitleBlacklist** (`action=titleblacklist`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/titleblacklist";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:TitleBlacklist
 */

/**
 * Request parameters for the `titleblacklist` action provided by the extension.
 *
 * Validate a page title, filename, or username against the TitleBlacklist.
 */
export interface ApiTitleblacklistParams {
  /**
   * The string to validate against the blacklist.
   */
  tbtitle: string;
  /**
   * The action to be checked.
   */
  tbaction?: "create" | "createpage" | "createtalk" | "edit" | "move" | "new-account" | "upload";
  /**
   * Don't try to override the titleblacklist.
   */
  tbnooverride?: boolean;
}

declare module "../registry" {
  interface ActionParams {
    titleblacklist: ApiTitleblacklistParams;
  }
}
