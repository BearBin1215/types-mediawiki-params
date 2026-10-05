/**
 * Opt-in extension pack: **Babel** (`meta=babel`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/babel";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:Babel
 */

/**
 * Request parameters for the `meta=babel` query module provided by the extension.
 *
 * Get information about what languages the user knows
 */
export interface ApiQueryBabelParams {
  /**
   * User to get information about
   */
  babuser: string;
}

declare module "../registry" {
  interface QueryMetaParams {
    babel: ApiQueryBabelParams;
  }
}
