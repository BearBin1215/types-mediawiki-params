import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=protectedtitles` query module.
 *
 * List all titles protected from creation.
 */
export interface ApiQueryProtectedtitlesParams {
  /**
   * Only list titles in these namespaces.
   */
  ptnamespace?: OneOrMore<number>;
  /**
   * Only list titles with these protection levels.
   *
   * Open union: the value set is the wiki's restriction-level list ($wgRestrictionLevels); core's levels are listed for autocomplete only.
   */
  ptlevel?: OneOrMore<"autoconfirmed" | "sysop" | (string & {})>;
  /**
   * How many total pages to return.
   */
  ptlimit?: ApiLimit;
  /**
   * In which direction to enumerate
   */
  ptdir?: "newer" | "older";
  /**
   * Start listing at this protection timestamp.
   */
  ptstart?: string;
  /**
   * Stop listing at this protection timestamp.
   */
  ptend?: string;
  /**
   * Which properties to get
   */
  ptprop?: OneOrMore<
    "comment" | "expiry" | "level" | "parsedcomment" | "timestamp" | "user" | "userid"
  >;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  ptcontinue?: string;
}

declare module "../../registry" {
  interface QueryListParams {
    protectedtitles: ApiQueryProtectedtitlesParams;
  }
  interface QueryGeneratorParams {
    protectedtitles: ApiQueryProtectedtitlesParams;
  }
}
