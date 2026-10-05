import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=revisions` query module.
 *
 * Get revision information.
 * May be used in several ways:
 * Get data about a set of pages (last revision), by setting titles or pageids.
 * Get revisions for one given page, by using titles or pageids with start, end, or limit.
 * Get data about a set of revisions by setting their IDs with revids.
 */
export interface ApiQueryRevisionsParams {
  /**
   * Which properties to get for each revision
   */
  rvprop?: OneOrMore<
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
   * Which revision slots to return data for, when slot-related properties are included in rvprops. If omitted, data from the `main` slot will be returned in a backwards-compatible format.
   */
  rvslots?: OneOrMore<"main">;
  /**
   * Limit how many revisions will be returned. If rvprop=content, rvprop=parsetree, rvdiffto or rvdifftotext is used, the limit is 50. If rvparse is used, the limit is 1.
   */
  rvlimit?: ApiLimit;
  /**
   * @deprecated
   */
  rvexpandtemplates?: boolean;
  /**
   * @deprecated
   */
  rvgeneratexml?: boolean;
  /**
   * @deprecated
   */
  rvparse?: boolean;
  /**
   * Only retrieve the content of the section with this identifier. A section identifier is either an integer section number (0 = lead, 1 = section starting with the first heading, etc.), or a string like T-1, in which case the section number is counted as if the page was being transcluded (e.g. a section wrapped in `` can only be identified in this mode).
   */
  rvsection?: string;
  /**
   * @deprecated
   */
  rvdiffto?: string;
  /**
   * @deprecated
   */
  rvdifftotext?: string;
  /**
   * @deprecated
   */
  rvdifftotextpst?: boolean;
  /**
   * Open union: the value set comes from IContentHandlerFactory::getAllContentFormats().
   * The "application/vue+xml" value is available since MediaWiki 1.45.
   * @deprecated
   */
  rvcontentformat?:
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
   * Start enumeration from the timestamp of the revision with this ID. The revision must exist, but need not belong to this page.
   */
  rvstartid?: number;
  /**
   * Stop enumeration at the timestamp of the revision with this ID. The revision must exist, but need not belong to this page.
   */
  rvendid?: number;
  /**
   * From which revision timestamp to start enumeration.
   */
  rvstart?: string;
  /**
   * Enumerate up to this timestamp.
   */
  rvend?: string;
  /**
   * In which direction to enumerate
   */
  rvdir?: "newer" | "older";
  /**
   * Only include revisions made by user.
   */
  rvuser?: string;
  /**
   * Exclude revisions made by user.
   */
  rvexcludeuser?: string;
  /**
   * Only list revisions tagged with this tag.
   */
  rvtag?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  rvcontinue?: string;
}

declare module "../../registry" {
  interface QueryPropParams {
    revisions: ApiQueryRevisionsParams;
  }
  interface QueryGeneratorParams {
    revisions: ApiQueryRevisionsParams;
  }
}
