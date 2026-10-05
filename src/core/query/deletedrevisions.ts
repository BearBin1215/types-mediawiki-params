import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=deletedrevisions` query module.
 *
 * Get deleted revision information.
 * May be used in several ways:
 * Get deleted revisions for a set of pages, by setting titles or pageids. Ordered by title and timestamp.
 * Get data about a set of deleted revisions by setting their IDs with revids. Ordered by revision ID.
 */
export interface ApiQueryDeletedrevisionsParams {
  /**
   * Which properties to get for each revision
   */
  drvprop?: OneOrMore<
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
   * Which revision slots to return data for, when slot-related properties are included in drvprops. If omitted, data from the `main` slot will be returned in a backwards-compatible format.
   */
  drvslots?: OneOrMore<"main">;
  /**
   * Limit how many revisions will be returned. If drvprop=content, drvprop=parsetree, drvdiffto or drvdifftotext is used, the limit is 50. If drvparse is used, the limit is 1.
   */
  drvlimit?: ApiLimit;
  /**
   * @deprecated
   */
  drvexpandtemplates?: boolean;
  /**
   * @deprecated
   */
  drvgeneratexml?: boolean;
  /**
   * @deprecated
   */
  drvparse?: boolean;
  /**
   * Only retrieve the content of the section with this identifier. A section identifier is either an integer section number (0 = lead, 1 = section starting with the first heading, etc.), or a string like T-1, in which case the section number is counted as if the page was being transcluded (e.g. a section wrapped in `` can only be identified in this mode).
   */
  drvsection?: string;
  /**
   * @deprecated
   */
  drvdiffto?: string;
  /**
   * @deprecated
   */
  drvdifftotext?: string;
  /**
   * @deprecated
   */
  drvdifftotextpst?: boolean;
  /**
   * Open union: the value set comes from IContentHandlerFactory::getAllContentFormats().
   * The "application/vue+xml" value is available since MediaWiki 1.45.
   * @deprecated
   */
  drvcontentformat?:
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
   * The timestamp to start enumerating from. Ignored when processing a list of revision IDs.
   */
  drvstart?: string;
  /**
   * The timestamp to stop enumerating at. Ignored when processing a list of revision IDs.
   */
  drvend?: string;
  /**
   * In which direction to enumerate
   */
  drvdir?: "newer" | "older";
  /**
   * Only list revisions tagged with this tag.
   */
  drvtag?: string;
  /**
   * Only list revisions by this user.
   */
  drvuser?: string;
  /**
   * Don't list revisions by this user.
   */
  drvexcludeuser?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  drvcontinue?: string;
}

declare module "../../registry" {
  interface QueryPropParams {
    deletedrevisions: ApiQueryDeletedrevisionsParams;
  }
  interface QueryGeneratorParams {
    deletedrevisions: ApiQueryDeletedrevisionsParams;
  }
}
