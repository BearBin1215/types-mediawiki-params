import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=search` query module.
 *
 * Perform a full text search.
 */
export interface ApiQuerySearchParams {
  /**
   * Search for page titles or content matching this value. You can use the search string to invoke special search features, depending on what the wiki's search backend implements.
   */
  srsearch: string;
  /**
   * Search only within these namespaces.
   */
  srnamespace?: OneOrMore<number>;
  /**
   * How many total pages to return.
   */
  srlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  sroffset?: number;
  /**
   * Which type of search to perform.
   */
  srwhat?: "nearmatch" | "text" | "title";
  /**
   * Which metadata to return.
   */
  srinfo?: OneOrMore<"rewrittenquery" | "suggestion" | "totalhits">;
  /**
   * Which properties to return
   */
  srprop?: OneOrMore<
    | "categorysnippet"
    | "extensiondata"
    | "isfilematch"
    | "redirectsnippet"
    | "redirecttitle"
    | "sectionsnippet"
    | "sectiontitle"
    | "size"
    | "snippet"
    | "timestamp"
    | "titlesnippet"
    | "wordcount"
    | "hasrelated"
    | "score"
  >;
  /**
   * Include interwiki results in the search, if available.
   */
  srinterwiki?: boolean;
  /**
   * Enable internal query rewriting. Some search backends can rewrite the query into another which is thought to provide better results, for instance by correcting spelling errors.
   */
  srenablerewrites?: boolean;
  /**
   * Set the sort order of returned results.
   *
   * Open union: the value set comes from the search engine's getValidSorts(); the parameter itself is only exposed when a single search backend is configured.
   */
  srsort?: "relevance" | (string & {});
}

declare module "../../registry" {
  interface QueryListParams {
    search: ApiQuerySearchParams;
  }
  interface QueryGeneratorParams {
    search: ApiQuerySearchParams;
  }
}
