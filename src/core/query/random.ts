import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=random` query module.
 *
 * Get a set of random pages.
 * Pages are listed in a fixed sequence, only the starting point is random. This means that if, for example, `Main Page` is the first random page in the list, `List of fictional monkeys` will always be second, `List of people on stamps of Vanuatu` third, etc.
 */
export interface ApiQueryRandomParams {
  /**
   * Return pages in these namespaces only.
   */
  rnnamespace?: OneOrMore<number>;
  /**
   * How to filter for redirects.
   */
  rnfilterredir?: "all" | "nonredirects" | "redirects";
  /**
   * @deprecated
   */
  rnredirect?: boolean;
  /**
   * Limit how many random pages will be returned.
   */
  rnlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  rncontinue?: string;
  /**
   * Limit to pages with at least this many bytes.
   *
   * @since MediaWiki 1.44
   */
  rnminsize?: number;
  /**
   * Limit to pages with at most this many bytes.
   *
   * @since MediaWiki 1.44
   */
  rnmaxsize?: number;
  /**
   * Filter pages that have the specified content model.
   *
   * Open union: the value set is the content-handler registry ($wgContentHandlers, extension.json ContentHandlers, the GetContentModels hook); core's models are listed for autocomplete only.
   * The "vue" value is available since MediaWiki 1.45.
   * @since MediaWiki 1.44
   */
  rncontentmodel?:
    | "css"
    | "javascript"
    | "json"
    | "text"
    | "unknown"
    | "wikitext"
    | "vue"
    | (string & {});
}

declare module "../../registry" {
  interface QueryListParams {
    random: ApiQueryRandomParams;
  }
  interface QueryGeneratorParams {
    random: ApiQueryRandomParams;
  }
}
