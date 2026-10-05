import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `meta=userinfo` query module.
 *
 * Get information about the current user.
 */
export interface ApiQueryUserinfoParams {
  /**
   * Which pieces of information to include
   *
   * The "cancreateaccount" value is available since MediaWiki 1.40.
   * The "watchlistlabels" value is available since MediaWiki 1.46.
   */
  uiprop?: OneOrMore<
    | "acceptlang"
    | "blockinfo"
    | "centralids"
    | "changeablegroups"
    | "editcount"
    | "email"
    | "groupmemberships"
    | "groups"
    | "hasmsg"
    | "implicitgroups"
    | "latestcontrib"
    | "options"
    | "ratelimits"
    | "realname"
    | "registrationdate"
    | "rights"
    | "theoreticalratelimits"
    | "unreadcount"
    | "cancreateaccount"
    | "watchlistlabels"
  >;
  /**
   * With `uiprop=centralids`, indicate whether the user is attached with the wiki identified by this ID.
   */
  uiattachedwiki?: string;
}

declare module "../../registry" {
  interface QueryMetaParams {
    userinfo: ApiQueryUserinfoParams;
  }
}
