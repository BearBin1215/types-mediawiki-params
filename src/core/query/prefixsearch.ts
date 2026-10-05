import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=prefixsearch` query module.
 *
 * Perform a prefix search for page titles.
 * Despite the similarity in names, this module is not intended to be equivalent to Special:PrefixIndex; for that, see `action=query&list=allpages` with the `apprefix` parameter. The purpose of this module is similar to `action=opensearch`: to take user input and provide the best-matching titles. Depending on the search engine backend, this might include typo correction, redirect avoidance, or other heuristics.
 */
export interface ApiQueryPrefixsearchParams {
  /**
   * Search string.
   */
  pssearch: string;
  /**
   * Namespaces to search. Ignored if pssearch begins with a valid namespace prefix.
   */
  psnamespace?: OneOrMore<number>;
  /**
   * Maximum number of results to return.
   */
  pslimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  psoffset?: number;
}

declare module "../../registry" {
  interface QueryListParams {
    prefixsearch: ApiQueryPrefixsearchParams;
  }
  interface QueryGeneratorParams {
    prefixsearch: ApiQueryPrefixsearchParams;
  }
}
