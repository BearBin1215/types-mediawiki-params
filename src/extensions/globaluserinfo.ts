/**
 * Opt-in extension pack: **GlobalUserInfo** (`meta=globaluserinfo`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/globaluserinfo";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:GlobalUserInfo
 */

import type { OneOrMore } from "../common";

/**
 * Request parameters for the `meta=globaluserinfo` query module provided by the extension.
 *
 * Show information about a global user.
 */
export interface ApiQueryGlobaluserinfoParams {
  /**
   * User to get information about. If guiuser and guiid both are omitted, it defaults to the current user.
   */
  guiuser?: string;
  /**
   * Global user ID to get information about. If guiuser and guiid both are omitted, it defaults to the current user.
   */
  guiid?: number;
  /**
   * Which properties to get
   */
  guiprop?: OneOrMore<"editcount" | "groups" | "merged" | "rights" | "unattached">;
}

declare module "../registry" {
  interface QueryMetaParams {
    globaluserinfo: ApiQueryGlobaluserinfoParams;
  }
}
