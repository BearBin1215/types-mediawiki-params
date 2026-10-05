import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=allusers` query module.
 *
 * Enumerate all registered users.
 */
export interface ApiQueryAllusersParams {
  /**
   * The username to start enumerating from.
   */
  aufrom?: string;
  /**
   * The username to stop enumerating at.
   */
  auto?: string;
  /**
   * Search for all users that begin with this value.
   */
  auprefix?: string;
  /**
   * Direction to sort in.
   */
  audir?: "ascending" | "descending";
  /**
   * Only include users in the given groups. Does not include implicit or auto-promoted groups like *, user, or autoconfirmed.
   *
   * Open union: the value set is the wiki's user-group registry (core groups plus groups added by configuration and extensions).
   */
  augroup?: OneOrMore<
    "bot" | "bureaucrat" | "interface-admin" | "suppress" | "sysop" | (string & {})
  >;
  /**
   * Exclude users in the given groups.
   *
   * Open union: the value set is the wiki's user-group registry (core groups plus groups added by configuration and extensions).
   */
  auexcludegroup?: OneOrMore<
    "bot" | "bureaucrat" | "interface-admin" | "suppress" | "sysop" | (string & {})
  >;
  /**
   * Only include users with the given rights. Does not include rights granted by implicit or auto-promoted groups like *, user, or autoconfirmed.
   *
   * Open union: the value set is the wiki's permission registry (core rights plus rights added by configuration and extensions).
   * The "renameuser" value is available since MediaWiki 1.40.
   * The "changeemail", "confirmemail", "linkpurge", "mailpassword", "renderfile", "renderfile-nonstandard", "stashbasehtml", "stashedit" values are available since MediaWiki 1.42.
   * The "logentryimport" value is available since MediaWiki 1.43.
   * The "interwiki", "renameuser-global" values are available since MediaWiki 1.44.
   * The "createwithcontentmodel", "ignore-restricted-groups" values are available since MediaWiki 1.46.
   */
  aurights?: OneOrMore<
    | "apihighlimits"
    | "applychangetags"
    | "autoconfirmed"
    | "autocreateaccount"
    | "autopatrol"
    | "bigdelete"
    | "block"
    | "blockemail"
    | "bot"
    | "browsearchive"
    | "changetags"
    | "createaccount"
    | "createpage"
    | "createtalk"
    | "delete"
    | "delete-redirect"
    | "deletechangetags"
    | "deletedhistory"
    | "deletedtext"
    | "deletelogentry"
    | "deleterevision"
    | "edit"
    | "editcontentmodel"
    | "editinterface"
    | "editmyoptions"
    | "editmyprivateinfo"
    | "editmyusercss"
    | "editmyuserjs"
    | "editmyuserjson"
    | "editmyuserjsredirect"
    | "editmywatchlist"
    | "editprotected"
    | "editsemiprotected"
    | "editsitecss"
    | "editsitejs"
    | "editsitejson"
    | "editusercss"
    | "edituserjs"
    | "edituserjson"
    | "hideuser"
    | "import"
    | "importupload"
    | "ipblock-exempt"
    | "managechangetags"
    | "markbotedits"
    | "mergehistory"
    | "minoredit"
    | "move"
    | "move-categorypages"
    | "move-rootuserpages"
    | "move-subpages"
    | "movefile"
    | "nominornewtalk"
    | "noratelimit"
    | "override-export-depth"
    | "pagelang"
    | "patrol"
    | "patrolmarks"
    | "protect"
    | "purge"
    | "read"
    | "reupload"
    | "reupload-own"
    | "reupload-shared"
    | "rollback"
    | "sendemail"
    | "siteadmin"
    | "suppressionlog"
    | "suppressredirect"
    | "suppressrevision"
    | "unblockself"
    | "undelete"
    | "unwatchedpages"
    | "upload"
    | "upload_by_url"
    | "userrights"
    | "userrights-interwiki"
    | "viewmyprivateinfo"
    | "viewmywatchlist"
    | "viewsuppressed"
    | "writeapi"
    | "renameuser"
    | "changeemail"
    | "confirmemail"
    | "linkpurge"
    | "mailpassword"
    | "renderfile"
    | "renderfile-nonstandard"
    | "stashbasehtml"
    | "stashedit"
    | "logentryimport"
    | "interwiki"
    | "renameuser-global"
    | "createwithcontentmodel"
    | "ignore-restricted-groups"
    | (string & {})
  >;
  /**
   * Which pieces of information to include
   *
   * The "tempexpired" value is available since MediaWiki 1.46.
   */
  auprop?: OneOrMore<
    | "blockinfo"
    | "centralids"
    | "editcount"
    | "groups"
    | "implicitgroups"
    | "registration"
    | "rights"
    | "tempexpired"
  >;
  /**
   * How many total usernames to return.
   */
  aulimit?: ApiLimit;
  /**
   * Only list users who have made edits.
   */
  auwitheditsonly?: boolean;
  /**
   * Only list users active in the last 30 days.
   */
  auactiveusers?: boolean;
  /**
   * With `auprop=centralids`, also indicate whether the user is attached with the wiki identified by this ID.
   */
  auattachedwiki?: string;
  /**
   * Exclude users of named accounts.
   *
   * @since MediaWiki 1.43
   */
  auexcludenamed?: boolean;
  /**
   * Exclude users of temporary accounts.
   *
   * @since MediaWiki 1.43
   */
  auexcludetemp?: boolean;
}

declare module "../../registry" {
  interface QueryListParams {
    allusers: ApiQueryAllusersParams;
  }
}
