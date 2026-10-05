import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=alldeletedrevisions` query module.
 *
 * List all deleted revisions by a user or in a namespace.
 */
export interface ApiQueryAlldeletedrevisionsParams {
  /**
   * Which properties to get for each revision
   */
  adrprop?: OneOrMore<
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
   * Which revision slots to return data for, when slot-related properties are included in adrprops. If omitted, data from the `main` slot will be returned in a backwards-compatible format.
   */
  adrslots?: OneOrMore<"main">;
  /**
   * Limit how many revisions will be returned. If adrprop=content, adrprop=parsetree, adrdiffto or adrdifftotext is used, the limit is 50. If adrparse is used, the limit is 1.
   */
  adrlimit?: ApiLimit;
  /**
   * @deprecated
   */
  adrexpandtemplates?: boolean;
  /**
   * @deprecated
   */
  adrgeneratexml?: boolean;
  /**
   * @deprecated
   */
  adrparse?: boolean;
  /**
   * Only retrieve the content of the section with this identifier. A section identifier is either an integer section number (0 = lead, 1 = section starting with the first heading, etc.), or a string like T-1, in which case the section number is counted as if the page was being transcluded (e.g. a section wrapped in `` can only be identified in this mode).
   */
  adrsection?: string;
  /**
   * @deprecated
   */
  adrdiffto?: string;
  /**
   * @deprecated
   */
  adrdifftotext?: string;
  /**
   * @deprecated
   */
  adrdifftotextpst?: boolean;
  /**
   * Open union: the value set comes from IContentHandlerFactory::getAllContentFormats().
   * The "application/vue+xml" value is available since MediaWiki 1.45.
   * @deprecated
   */
  adrcontentformat?:
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
   * Note: Due to miser mode, using adruser and adrnamespace together may result in fewer than adrlimit results returned before continuing; in extreme cases, zero results may be returned.
   */
  adruser?: string;
  /**
   * Only list pages in this namespace.
   * Note: Due to miser mode, using adruser and adrnamespace together may result in fewer than adrlimit results returned before continuing; in extreme cases, zero results may be returned.
   */
  adrnamespace?: OneOrMore<number>;
  /**
   * The timestamp to start enumerating from.
   */
  adrstart?: string;
  /**
   * The timestamp to stop enumerating at.
   */
  adrend?: string;
  /**
   * In which direction to enumerate
   */
  adrdir?: "newer" | "older";
  /**
   * Start listing at this title.
   */
  adrfrom?: string;
  /**
   * Stop listing at this title.
   */
  adrto?: string;
  /**
   * Search for all page titles that begin with this value.
   */
  adrprefix?: string;
  /**
   * Don't list revisions by this user.
   */
  adrexcludeuser?: string;
  /**
   * Only list revisions tagged with this tag.
   */
  adrtag?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  adrcontinue?: string;
  /**
   * When being used as a generator, generate titles rather than revision IDs.
   */
  adrgeneratetitles?: boolean;
}

declare module "../../registry" {
  interface QueryListParams {
    alldeletedrevisions: ApiQueryAlldeletedrevisionsParams;
  }
  interface QueryGeneratorParams {
    alldeletedrevisions: ApiQueryAlldeletedrevisionsParams;
  }
}
