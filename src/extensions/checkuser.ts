/**
 * Opt-in extension pack: **CheckUser** (`list=checkuser`, `list=checkuserlog`, `meta=checkuserformattedblockinfo`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/checkuser";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:CheckUser
 */

import type { ApiLimit } from "../common";

/**
 * Request parameters for the `list=checkuser` query module provided by the extension.
 *
 * Check which IP addresses are used by a given username or which usernames are used by a given IP address.
 */
export interface ApiQueryCheckuserParams {
  /**
   * Type of CheckUser request
   *
   * The "edits" value is deprecated.
   */
  curequest: "actions" | "ipusers" | "userips" | "edits";
  /**
   * Username, IP address, or CIDR range to check.
   */
  cutarget: string;
  /**
   * Reason to check.
   *
   * Required only when $wgCheckUserForceSummary is enabled.
   */
  cureason?: string;
  /**
   * Limit of rows.
   */
  culimit?: ApiLimit;
  /**
   * Time limit of user data (like "-2 weeks" or "2 weeks ago").
   */
  cutimecond?: string;
  /**
   * Use XFF data instead of IP address.
   */
  cuxff?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  cutoken: string;
}
/**
 * Request parameters for the `list=checkuserlog` query module provided by the extension.
 *
 * Get entries from the CheckUser log.
 */
export interface ApiQueryCheckuserlogParams {
  /**
   * Username of the CheckUser.
   */
  culuser?: string;
  /**
   * Checked user, IP address, or CIDR range.
   */
  cultarget?: string;
  /**
   * Reason given for the check.
   */
  culreason?: string;
  /**
   * Limit of rows.
   */
  cullimit?: ApiLimit;
  /**
   * In which direction to enumerate
   */
  culdir?: "newer" | "older";
  /**
   * The timestamp to start enumerating from.
   */
  culfrom?: string;
  /**
   * The timestamp to end enumerating.
   */
  culto?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  culcontinue?: string;
}
/**
 * Request parameters for the `meta=checkuserformattedblockinfo` query module provided by the extension.
 *
 * Return formatted block details for sitewide blocks affecting the current user.
 */
export interface ApiQueryCheckuserformattedblockinfoParams {}

declare module "../registry" {
  interface QueryListParams {
    checkuser: ApiQueryCheckuserParams;
    checkuserlog: ApiQueryCheckuserlogParams;
  }
  interface QueryMetaParams {
    checkuserformattedblockinfo: ApiQueryCheckuserformattedblockinfoParams;
  }
}
