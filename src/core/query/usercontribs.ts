import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=usercontribs` query module.
 *
 * Get all edits by a user.
 */
export interface ApiQueryUsercontribsParams {
  /**
   * The maximum number of contributions to return.
   */
  uclimit?: ApiLimit;
  /**
   * The start timestamp to return from, i.e. revisions before this timestamp.
   */
  ucstart?: string;
  /**
   * The end timestamp to return to, i.e. revisions after this timestamp.
   */
  ucend?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  uccontinue?: string;
  /**
   * The users to retrieve contributions for. Cannot be used with ucuserids, ucuserprefix, or uciprange.
   */
  ucuser?: OneOrMore<string>;
  /**
   * The user IDs to retrieve contributions for. Cannot be used with ucuser, ucuserprefix, or uciprange.
   */
  ucuserids?: OneOrMore<number>;
  /**
   * Retrieve contributions for all users whose names begin with this value. Cannot be used with ucuser, ucuserids, or uciprange.
   */
  ucuserprefix?: string;
  /**
   * The CIDR range to retrieve contributions for. Cannot be used with ucuser, ucuserprefix, or ucuserids.
   */
  uciprange?: string;
  /**
   * In which direction to enumerate
   */
  ucdir?: "newer" | "older";
  /**
   * Only list contributions in these namespaces.
   */
  ucnamespace?: OneOrMore<number>;
  /**
   * Include additional pieces of information
   */
  ucprop?: OneOrMore<
    | "comment"
    | "flags"
    | "ids"
    | "parsedcomment"
    | "patrolled"
    | "size"
    | "sizediff"
    | "tags"
    | "timestamp"
    | "title"
  >;
  /**
   * Show only items that meet these criteria, e.g. non minor edits only: `ucshow=!minor`.
   * If `ucshow=patrolled` or `ucshow=!patrolled` is set, revisions older than $wgRCMaxAge (2592000 seconds) won't be shown.
   */
  ucshow?: OneOrMore<
    | "!autopatrolled"
    | "!minor"
    | "!new"
    | "!patrolled"
    | "!top"
    | "autopatrolled"
    | "minor"
    | "new"
    | "patrolled"
    | "top"
  >;
  /**
   * Only list revisions tagged with this tag.
   */
  uctag?: string;
  /**
   * @deprecated
   */
  uctoponly?: boolean;
}

declare module "../../registry" {
  interface QueryListParams {
    usercontribs: ApiQueryUsercontribsParams;
  }
}
