/**
 * Opt-in extension pack: **Thanks** (`action=thank`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/thanks";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:Thanks
 */

/**
 * Request parameters for the `thank` action provided by the extension.
 *
 * Send a thank-you notification to an editor.
 */
export interface ApiThankParams {
  /**
   * Revision ID to thank someone for. This or 'log' must be provided.
   */
  rev?: number;
  /**
   * Log ID to thank someone for. This or 'rev' must be provided.
   */
  log?: number;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * A short string describing the source of the request, for example `diff` or `history`.
   */
  source?: string;
}

declare module "../registry" {
  interface ActionParams {
    thank: ApiThankParams;
  }
}
