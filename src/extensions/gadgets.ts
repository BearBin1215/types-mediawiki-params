/**
 * Opt-in extension pack: **Gadgets** (`list=gadgets`, `list=gadgetcategories`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/gadgets";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:Gadgets
 */

import type { OneOrMore } from "../common";

/**
 * Request parameters for the `list=gadgets` query module provided by the extension.
 *
 * Returns a list of gadgets used on this wiki.
 */
export interface ApiQueryGadgetsParams {
  /**
   * What gadget information to get
   */
  gaprop?: OneOrMore<"desc" | "id" | "metadata">;
  /**
   * Gadgets from what categories to retrieve.
   */
  gacategories?: OneOrMore<string>;
  /**
   * IDs of gadgets to retrieve.
   */
  gaids?: OneOrMore<string>;
  /**
   * List only gadgets allowed to current user.
   */
  gaallowedonly?: boolean;
  /**
   * List only gadgets enabled by current user.
   */
  gaenabledonly?: boolean;
}
/**
 * Request parameters for the `list=gadgetcategories` query module provided by the extension.
 *
 * Returns a list of gadget categories.
 */
export interface ApiQueryGadgetcategoriesParams {
  /**
   * What gadget category information to get
   */
  gcprop?: OneOrMore<"members" | "name" | "title">;
  /**
   * Names of categories to retrieve.
   */
  gcnames?: OneOrMore<string>;
}

declare module "../registry" {
  interface QueryListParams {
    gadgets: ApiQueryGadgetsParams;
    gadgetcategories: ApiQueryGadgetcategoriesParams;
  }
}
