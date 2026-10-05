/**
 * Opt-in extension pack: **PageImages** (`prop=pageimages`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/pageimages";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:PageImages
 */

import type { ApiLimit, OneOrMore } from "../common";

/**
 * Request parameters for the `prop=pageimages` query module provided by the extension.
 *
 * Returns information about images on the page, such as thumbnail and presence of photos.
 */
export interface ApiQueryPageimagesParams {
  /**
   * Which information to return
   */
  piprop?: OneOrMore<"name" | "original" | "thumbnail">;
  /**
   * Maximum width in pixels of thumbnail images.
   */
  pithumbsize?: number;
  /**
   * Properties of how many pages to return.
   */
  pilimit?: ApiLimit;
  /**
   * Limit page images to a certain license type
   */
  pilicense?: "any" | "free";
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  picontinue?: number;
  /**
   * Code for the language the image is going to be rendered in if multiple languages are supported
   */
  pilangcode?: string;
}

declare module "../registry" {
  interface QueryPropParams {
    pageimages: ApiQueryPageimagesParams;
  }
}
