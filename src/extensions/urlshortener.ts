/**
 * Opt-in extension pack: **UrlShortener** (`action=shortenurl`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/urlshortener";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:UrlShortener
 */

/**
 * Request parameters for the `shortenurl` action provided by the extension.
 *
 * Shorten a long URL into a shorter one.
 */
export interface ApiShortenurlParams {
  /**
   * URL to be shortened.
   */
  url: string;
}

declare module "../registry" {
  interface ActionParams {
    shortenurl: ApiShortenurlParams;
  }
}
