import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=categorymembers` query module.
 *
 * List all pages in a given category.
 */
export interface ApiQueryCategorymembersParams {
  /**
   * Which category to enumerate (required). Must include the `Category:` prefix. Cannot be used together with cmpageid.
   */
  cmtitle?: string;
  /**
   * Page ID of the category to enumerate. Cannot be used together with cmtitle.
   */
  cmpageid?: number;
  /**
   * Which pieces of information to include
   */
  cmprop?: OneOrMore<"ids" | "sortkey" | "sortkeyprefix" | "timestamp" | "title" | "type">;
  /**
   * Only include pages in these namespaces. Note that `cmtype=subcat` or `cmtype=file` may be used instead of `cmnamespace=14` or `6`.
   * Note: Due to miser mode, using this may result in fewer than cmlimit results returned before continuing; in extreme cases, zero results may be returned.
   */
  cmnamespace?: OneOrMore<number>;
  /**
   * Which type of category members to include. Ignored when `cmsort=timestamp` is set.
   */
  cmtype?: OneOrMore<"file" | "page" | "subcat">;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  cmcontinue?: string;
  /**
   * The maximum number of pages to return.
   */
  cmlimit?: ApiLimit;
  /**
   * Property to sort by.
   */
  cmsort?: "sortkey" | "timestamp";
  /**
   * In which direction to sort.
   */
  cmdir?: "asc" | "ascending" | "desc" | "descending" | "newer" | "older";
  /**
   * Timestamp to start listing from. Can only be used with `cmsort=timestamp`.
   */
  cmstart?: string;
  /**
   * Timestamp to end listing at. Can only be used with `cmsort=timestamp`.
   */
  cmend?: string;
  /**
   * Sortkey to start listing from, as returned by `cmprop=sortkey`. Can only be used with `cmsort=sortkey`.
   */
  cmstarthexsortkey?: string;
  /**
   * Sortkey to end listing at, as returned by `cmprop=sortkey`. Can only be used with `cmsort=sortkey`.
   */
  cmendhexsortkey?: string;
  /**
   * Sortkey prefix to start listing from. Can only be used with `cmsort=sortkey`. Overrides cmstarthexsortkey.
   */
  cmstartsortkeyprefix?: string;
  /**
   * Sortkey prefix to end listing before (not at; if this value occurs it will not be included!). Can only be used with cmsort=sortkey. Overrides cmendhexsortkey.
   */
  cmendsortkeyprefix?: string;
  /**
   * @deprecated
   */
  cmstartsortkey?: string;
  /**
   * @deprecated
   */
  cmendsortkey?: string;
}

declare module "../../registry" {
  interface QueryListParams {
    categorymembers: ApiQueryCategorymembersParams;
  }
  interface QueryGeneratorParams {
    categorymembers: ApiQueryCategorymembersParams;
  }
}
