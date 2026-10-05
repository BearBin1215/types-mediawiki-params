import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=pageswithprop` query module.
 *
 * List all pages using a given page property.
 */
export interface ApiQueryPageswithpropParams {
  /**
   * Page property for which to enumerate pages (`action=query&list=pagepropnames` returns page property names in use).
   */
  pwppropname: string;
  /**
   * Which pieces of information to include
   */
  pwpprop?: OneOrMore<"ids" | "title" | "value">;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  pwpcontinue?: string;
  /**
   * The maximum number of pages to return.
   */
  pwplimit?: ApiLimit;
  /**
   * In which direction to sort.
   */
  pwpdir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryListParams {
    pageswithprop: ApiQueryPageswithpropParams;
  }
  interface QueryGeneratorParams {
    pageswithprop: ApiQueryPageswithpropParams;
  }
}
