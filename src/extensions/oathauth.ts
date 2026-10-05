/**
 * Opt-in extension pack: **OATHAuth** (`action=oathvalidate`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/oathauth";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:OATHAuth
 */

/**
 * Request parameters for the `oathvalidate` action provided by the extension.
 *
 * Validate a two-factor authentication (OATH) token.
 */
export interface ApiOathvalidateParams {
  /**
   * User to validate token for. Defaults to the current user.
   */
  user?: string;
  /**
   * JSON encoded data expected by the module currently activated for the user being authenticated
   */
  data: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    oathvalidate: ApiOathvalidateParams;
  }
}
