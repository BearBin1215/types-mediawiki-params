/**
 * Opt-in extension pack: **GlobalUsage** (`prop=globalusage`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/globalusage";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:GlobalUsage
 */

import type { ApiLimit, OneOrMore } from "../common";

/**
 * Request parameters for the `prop=globalusage` query module provided by the extension.
 *
 * Returns global image usage for a certain image.
 */
export interface ApiQueryGlobalusageParams {
  /**
   * Which properties to return
   */
  guprop?: OneOrMore<"namespace" | "pageid" | "url">;
  /**
   * How many links to return.
   */
  gulimit?: ApiLimit;
  /**
   * Limit results to these namespaces.
   */
  gunamespace?: OneOrMore<number>;
  /**
   * Limit results to these sites.
   */
  gusite?: OneOrMore<string>;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  gucontinue?: string;
  /**
   * Filter local usage of the file.
   */
  gufilterlocal?: boolean;
}

declare module "../registry" {
  interface QueryPropParams {
    globalusage: ApiQueryGlobalusageParams;
  }
}
