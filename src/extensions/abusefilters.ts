/**
 * Opt-in extension pack: **AbuseFilter** (`action=abusefilterchecksyntax`, `action=abusefilterevalexpression`, `action=abusefilterunblockautopromote`, `action=abusefiltercheckmatch`, `action=abuselogprivatedetails`, `list=abusefilters`, `list=abuselog`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/abusefilters";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:AbuseFilter
 */

import type { ApiLimit, OneOrMore } from "../common";

/**
 * Request parameters for the `abusefilterchecksyntax` action provided by the extension.
 *
 * Check syntax of an AbuseFilter filter.
 */
export interface ApiAbusefilterchecksyntaxParams {
  /**
   * The full filter text to check syntax on.
   */
  filter: string;
}
/**
 * Request parameters for the `abusefilterevalexpression` action provided by the extension.
 *
 * Evaluates an AbuseFilter expression.
 */
export interface ApiAbusefilterevalexpressionParams {
  /**
   * The expression to evaluate.
   */
  expression: string;
  /**
   * Whether the result should be pretty-printed.
   */
  prettyprint?: boolean;
}
/**
 * Request parameters for the `abusefilterunblockautopromote` action provided by the extension.
 *
 * Unblocks a user from receiving autopromotions due to an abusefilter consequence.
 */
export interface ApiAbusefilterunblockautopromoteParams {
  /**
   * Username of the user you want to unblock.
   */
  user: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `abusefiltercheckmatch` action provided by the extension.
 *
 * Check to see if an AbuseFilter matches a set of variables, an edit, or a logged AbuseFilter event.
 * vars, rcid or logid is required however only one may be used.
 */
export interface ApiAbusefiltercheckmatchParams {
  /**
   * The full filter text to check for a match.
   */
  filter: string;
  /**
   * JSON encoded array of variables to test against.
   */
  vars?: string;
  /**
   * Recent change ID to check against.
   */
  rcid?: number;
  /**
   * Abuse filter log ID to check against.
   */
  logid?: number;
}
/**
 * Request parameters for the `abuselogprivatedetails` action provided by the extension.
 *
 * View private details of an AbuseLog entry.
 */
export interface ApiAbuselogprivatedetailsParams {
  /**
   * The ID of the AbuseLog entry to be checked.
   */
  logid?: number;
  /**
   * A valid reason for performing the check.
   *
   * Required only when $wgAbuseFilterPrivateDetailsForceReason is enabled.
   */
  reason?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `list=abusefilters` query module provided by the extension.
 *
 * Show details of the abuse filters.
 */
export interface ApiQueryAbusefiltersParams {
  /**
   * The filter ID to start enumerating from.
   */
  abfstartid?: number;
  /**
   * The filter ID to stop enumerating at.
   */
  abfendid?: number;
  /**
   * In which direction to enumerate
   */
  abfdir?: "newer" | "older";
  /**
   * Show only filters which meet these criteria.
   */
  abfshow?: OneOrMore<
    | "!deleted"
    | "!enabled"
    | "!private"
    | "!protected"
    | "deleted"
    | "enabled"
    | "private"
    | "protected"
  >;
  /**
   * The maximum number of filters to list.
   */
  abflimit?: ApiLimit;
  /**
   * Which properties to get.
   */
  abfprop?: OneOrMore<
    | "actions"
    | "comments"
    | "description"
    | "hits"
    | "id"
    | "lasteditor"
    | "lastedittime"
    | "pattern"
    | "private"
    | "protected"
    | "status"
  >;
}
/**
 * Request parameters for the `list=abuselog` query module provided by the extension.
 *
 * Show events that were caught by one of the abuse filters.
 */
export interface ApiQueryAbuselogParams {
  /**
   * Show an entry with the given log ID.
   */
  afllogid?: number;
  /**
   * The timestamp to start enumerating from.
   */
  aflstart?: string;
  /**
   * The timestamp to stop enumerating at.
   */
  aflend?: string;
  /**
   * In which direction to enumerate
   */
  afldir?: "newer" | "older";
  /**
   * Show only entries done by a given user or IP address.
   */
  afluser?: string;
  /**
   * Show only entries occurring on a given page.
   */
  afltitle?: string;
  /**
   * Show only entries that were caught by the given filter IDs. Separate with pipes, prefix with "global-" for global filters.
   */
  aflfilter?: OneOrMore<string>;
  /**
   * The maximum amount of entries to list.
   */
  afllimit?: ApiLimit;
  /**
   * Which properties to get.
   */
  aflprop?: OneOrMore<
    | "action"
    | "details"
    | "filter"
    | "hidden"
    | "ids"
    | "result"
    | "revid"
    | "timestamp"
    | "title"
    | "user"
  >;
}

declare module "../registry" {
  interface ActionParams {
    abusefilterchecksyntax: ApiAbusefilterchecksyntaxParams;
    abusefilterevalexpression: ApiAbusefilterevalexpressionParams;
    abusefilterunblockautopromote: ApiAbusefilterunblockautopromoteParams;
    abusefiltercheckmatch: ApiAbusefiltercheckmatchParams;
    abuselogprivatedetails: ApiAbuselogprivatedetailsParams;
  }
  interface QueryListParams {
    abusefilters: ApiQueryAbusefiltersParams;
    abuselog: ApiQueryAbuselogParams;
  }
}
