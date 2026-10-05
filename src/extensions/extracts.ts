/**
 * Opt-in extension pack: **TextExtracts** (`prop=extracts`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/extracts";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:TextExtracts
 */

import type { ApiLimit } from "../common";

/**
 * Request parameters for the `prop=extracts` query module provided by the extension.
 *
 * Returns plain-text or limited HTML extracts of the given pages.
 */
export interface ApiQueryExtractsParams {
  /**
   * How many characters to return. Actual text returned might be slightly longer.
   */
  exchars?: number;
  /**
   * How many sentences to return.
   */
  exsentences?: number;
  /**
   * How many extracts to return. (Multiple extracts can only be returned if exintro is set to true.)
   */
  exlimit?: ApiLimit;
  /**
   * Return only content before the first section.
   */
  exintro?: boolean;
  /**
   * Return extracts as plain text instead of limited HTML.
   */
  explaintext?: boolean;
  /**
   * How to format sections in plaintext mode
   */
  exsectionformat?: "plain" | "raw" | "wiki";
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  excontinue?: number;
}

declare module "../registry" {
  interface QueryPropParams {
    extracts: ApiQueryExtractsParams;
  }
}
