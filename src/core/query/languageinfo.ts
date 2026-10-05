import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `meta=languageinfo` query module.
 *
 * Return information about available languages.
 * Continuation may be applied if retrieving the information takes too long for one request.
 */
export interface ApiQueryLanguageinfoParams {
  /**
   * Which information to get for each language.
   *
   * The "variantnames" value is available since MediaWiki 1.40.
   * The "digittransforms", "digitgroupingpattern", "minimumgroupingdigits", "namespacenames", "namespacealiases" values are available since MediaWiki 1.47.
   */
  liprop?: OneOrMore<
    | "autonym"
    | "bcp47"
    | "code"
    | "dir"
    | "fallbacks"
    | "name"
    | "variants"
    | "variantnames"
    | "digittransforms"
    | "digitgroupingpattern"
    | "minimumgroupingdigits"
    | "namespacenames"
    | "namespacealiases"
  >;
  /**
   * Language codes of the languages that should be returned, or `*` for all languages.
   */
  licode?: OneOrMore<string>;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  licontinue?: string;
}

declare module "../../registry" {
  interface QueryMetaParams {
    languageinfo: ApiQueryLanguageinfoParams;
  }
}
