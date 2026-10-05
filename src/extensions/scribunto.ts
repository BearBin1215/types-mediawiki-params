/**
 * Opt-in extension pack: **Scribunto** (`action=scribunto-console`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/scribunto";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:Scribunto
 */

/**
 * Request parameters for the `scribunto-console` action provided by the extension.
 *
 * Internal module for servicing XHR requests from the Scribunto console.
 */
export interface ApiScribuntoConsoleParams {
  /**
   * The title of the module to test.
   */
  title?: string;
  /**
   * The new content of the module.
   */
  content?: string;
  /**
   * Session token.
   */
  session?: number;
  /**
   * The next line to evaluate as a script.
   */
  question: string;
  /**
   * Set to clear the current session state.
   */
  clear?: boolean;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    "scribunto-console": ApiScribuntoConsoleParams;
  }
}
