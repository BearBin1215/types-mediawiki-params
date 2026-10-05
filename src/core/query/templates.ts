import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=templates` query module.
 *
 * Returns all pages transcluded on the given pages.
 */
export interface ApiQueryTemplatesParams {
  /**
   * Show templates in these namespaces only.
   */
  tlnamespace?: OneOrMore<number>;
  /**
   * How many templates to return.
   */
  tllimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  tlcontinue?: string;
  /**
   * Only list these templates. Useful for checking whether a certain page uses a certain template.
   */
  tltemplates?: OneOrMore<string>;
  /**
   * The direction in which to list.
   */
  tldir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryPropParams {
    templates: ApiQueryTemplatesParams;
  }
  interface QueryGeneratorParams {
    templates: ApiQueryTemplatesParams;
  }
}
