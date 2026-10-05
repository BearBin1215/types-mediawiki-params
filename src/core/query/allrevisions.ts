import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=allrevisions` query module.
 *
 * List all revisions.
 */
export interface ApiQueryAllrevisionsParams {
  /**
   * Which properties to get for each revision
   */
  arvprop?: OneOrMore<
    | "comment"
    | "content"
    | "contentmodel"
    | "flags"
    | "ids"
    | "parsedcomment"
    | "roles"
    | "sha1"
    | "size"
    | "slotsha1"
    | "slotsize"
    | "tags"
    | "timestamp"
    | "user"
    | "userid"
    | "parsetree"
  >;
  /**
   * Which revision slots to return data for, when slot-related properties are included in arvprops. If omitted, data from the `main` slot will be returned in a backwards-compatible format.
   */
  arvslots?: OneOrMore<"main">;
  /**
   * Limit how many revisions will be returned. If arvprop=content, arvprop=parsetree, arvdiffto or arvdifftotext is used, the limit is 50. If arvparse is used, the limit is 1.
   */
  arvlimit?: ApiLimit;
  /**
   * @deprecated
   */
  arvexpandtemplates?: boolean;
  /**
   * @deprecated
   */
  arvgeneratexml?: boolean;
  /**
   * @deprecated
   */
  arvparse?: boolean;
  /**
   * Only retrieve the content of the section with this identifier. A section identifier is either an integer section number (0 = lead, 1 = section starting with the first heading, etc.), or a string like T-1, in which case the section number is counted as if the page was being transcluded (e.g. a section wrapped in `` can only be identified in this mode).
   */
  arvsection?: string;
  /**
   * @deprecated
   */
  arvdiffto?: string;
  /**
   * @deprecated
   */
  arvdifftotext?: string;
  /**
   * @deprecated
   */
  arvdifftotextpst?: boolean;
  /**
   * Open union: the value set comes from IContentHandlerFactory::getAllContentFormats().
   * The "application/vue+xml" value is available since MediaWiki 1.45.
   * @deprecated
   */
  arvcontentformat?:
    | "application/json"
    | "application/octet-stream"
    | "application/unknown"
    | "application/x-binary"
    | "text/css"
    | "text/javascript"
    | "text/plain"
    | "text/unknown"
    | "text/x-wiki"
    | "unknown/unknown"
    | "application/vue+xml"
    | (string & {});
  /**
   * Only list revisions by this user.
   */
  arvuser?: string;
  /**
   * Only list pages in this namespace.
   * Note: Due to miser mode, using this may result in fewer than arvlimit results returned before continuing; in extreme cases, zero results may be returned.
   */
  arvnamespace?: OneOrMore<number>;
  /**
   * The timestamp to start enumerating from.
   */
  arvstart?: string;
  /**
   * The timestamp to stop enumerating at.
   */
  arvend?: string;
  /**
   * In which direction to enumerate
   */
  arvdir?: "newer" | "older";
  /**
   * Don't list revisions by this user.
   */
  arvexcludeuser?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  arvcontinue?: string;
  /**
   * When being used as a generator, generate titles rather than revision IDs.
   */
  arvgeneratetitles?: boolean;
}

declare module "../../registry" {
  interface QueryListParams {
    allrevisions: ApiQueryAllrevisionsParams;
  }
  interface QueryGeneratorParams {
    allrevisions: ApiQueryAllrevisionsParams;
  }
}
