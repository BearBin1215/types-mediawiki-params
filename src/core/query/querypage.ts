import type { ApiLimit } from "../../common";

/**
 * Request parameters for the `list=querypage` query module.
 *
 * Get a list provided by a QueryPage-based special page.
 */
export interface ApiQueryQuerypageParams {
  /**
   * The name of the special page. Note, this is case-sensitive.
   */
  qppage:
    | "Ancientpages"
    | "BrokenRedirects"
    | "Deadendpages"
    | "DoubleRedirects"
    | "Fewestrevisions"
    | "ListDuplicatedFiles"
    | "Listredirects"
    | "Lonelypages"
    | "Longpages"
    | "MediaStatistics"
    | "Mostcategories"
    | "Mostimages"
    | "Mostinterwikis"
    | "Mostlinked"
    | "Mostlinkedcategories"
    | "Mostlinkedtemplates"
    | "Mostrevisions"
    | "Shortpages"
    | "Uncategorizedcategories"
    | "Uncategorizedimages"
    | "Uncategorizedpages"
    | "Uncategorizedtemplates"
    | "Unusedcategories"
    | "Unusedimages"
    | "Unusedtemplates"
    | "Unwatchedpages"
    | "Wantedcategories"
    | "Wantedfiles"
    | "Wantedpages"
    | "Wantedtemplates"
    | "Withoutinterwiki";
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  qpoffset?: number;
  /**
   * Number of results to return.
   */
  qplimit?: ApiLimit;
}

declare module "../../registry" {
  interface QueryListParams {
    querypage: ApiQueryQuerypageParams;
  }
  interface QueryGeneratorParams {
    querypage: ApiQueryQuerypageParams;
  }
}
