import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=deletedrevs` query module.
 *
 * List deleted revisions.
 * Operates in three modes:
 * List deleted revisions for the given titles, sorted by timestamp.
 * List deleted contributions for the given user, sorted by timestamp (no titles specified).
 * List all deleted revisions in the given namespace, sorted by title and timestamp (no titles specified, druser not set).
 * Certain parameters only apply to some modes and are ignored in others.
 */
export interface ApiQueryDeletedrevsParams {
  /**
   * The timestamp to start enumerating from.
   */
  drstart?: string;
  /**
   * The timestamp to stop enumerating at.
   */
  drend?: string;
  /**
   * In which direction to enumerate
   */
  drdir?: "newer" | "older";
  /**
   * Start listing at this title.
   */
  drfrom?: string;
  /**
   * Stop listing at this title.
   */
  drto?: string;
  /**
   * Search for all page titles that begin with this value.
   */
  drprefix?: string;
  /**
   * List only one revision for each page.
   */
  drunique?: boolean;
  /**
   * Only list pages in this namespace.
   */
  drnamespace?: number;
  /**
   * Only list revisions tagged with this tag.
   */
  drtag?: string;
  /**
   * Only list revisions by this user.
   */
  druser?: string;
  /**
   * Don't list revisions by this user.
   */
  drexcludeuser?: string;
  /**
   * Which properties to get
   */
  drprop?: OneOrMore<
    | "comment"
    | "content"
    | "len"
    | "minor"
    | "parentid"
    | "parsedcomment"
    | "revid"
    | "sha1"
    | "tags"
    | "user"
    | "userid"
    | "token"
  >;
  /**
   * The maximum amount of revisions to list. If drprop=content is used, the limit is 50.
   */
  drlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  drcontinue?: string;
}

declare module "../../registry" {
  interface QueryListParams {
    deletedrevs: ApiQueryDeletedrevsParams;
  }
}
