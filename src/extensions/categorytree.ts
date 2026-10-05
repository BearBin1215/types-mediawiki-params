/**
 * Opt-in extension pack: **CategoryTree** (`action=categorytree`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/categorytree";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:CategoryTree
 */

/**
 * Request parameters for the `categorytree` action provided by the extension.
 *
 * Internal module for the CategoryTree extension.
 */
export interface ApiCategorytreeParams {
  /**
   * Title in the category namespace, prefix will be ignored if given.
   */
  category: string;
  /**
   * Options for the CategoryTree constructor as a JSON object. The depth option defaults to `1`.
   */
  options?: string;
}

declare module "../registry" {
  interface ActionParams {
    categorytree: ApiCategorytreeParams;
  }
}
