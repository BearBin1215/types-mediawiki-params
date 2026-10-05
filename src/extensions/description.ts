/**
 * Opt-in extension pack: **Wikibase Client** (`prop=description`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/description";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:Wikibase_Client
 */

/**
 * Request parameters for the `prop=description` query module provided by the extension.
 *
 * Get a short description a.k.a. subtitle explaining what the target page is about.
 * The description is plain text, on a single line, but otherwise arbitrary (potentially including raw HTML tags, which also should be interpreted as plain text). It must not be used in HTML unescaped!
 */
export interface ApiQueryDescriptionParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  desccontinue?: number;
  /**
   * Which description source to prefer if present
   */
  descprefersource?: "central" | "local";
}

declare module "../registry" {
  interface QueryPropParams {
    description: ApiQueryDescriptionParams;
  }
}
