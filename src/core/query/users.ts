import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `list=users` query module.
 *
 * Get information about a list of users.
 */
export interface ApiQueryUsersParams {
  /**
   * Which pieces of information to include
   *
   * The "tempexpired" value is available since MediaWiki 1.46.
   */
  usprop?: OneOrMore<
    | "blockinfo"
    | "cancreate"
    | "centralids"
    | "editcount"
    | "emailable"
    | "gender"
    | "groupmemberships"
    | "groups"
    | "implicitgroups"
    | "registration"
    | "rights"
    | "tempexpired"
  >;
  /**
   * With `usprop=centralids`, indicate whether the user is attached with the wiki identified by this ID.
   */
  usattachedwiki?: string;
  /**
   * A list of users to obtain information for.
   */
  ususers?: OneOrMore<string>;
  /**
   * A list of user IDs to obtain information for.
   */
  ususerids?: OneOrMore<number>;
}

declare module "../../registry" {
  interface QueryListParams {
    users: ApiQueryUsersParams;
  }
}
