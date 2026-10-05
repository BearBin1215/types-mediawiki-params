import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=contributors` query module.
 *
 * Get the list of registered contributors (including temporary users) and the count of anonymous contributors to a page.
 */
export interface ApiQueryContributorsParams {
  /**
   * Only include users in the given groups. Does not include implicit or auto-promoted groups like *, user, or autoconfirmed.
   *
   * Open union: the value set is the wiki's user-group registry (core groups plus groups added by configuration and extensions).
   */
  pcgroup?: OneOrMore<
    "bot" | "bureaucrat" | "interface-admin" | "suppress" | "sysop" | (string & {})
  >;
  /**
   * Exclude users in the given groups. Does not include implicit or auto-promoted groups like *, user, or autoconfirmed.
   *
   * Open union: the value set is the wiki's user-group registry (core groups plus groups added by configuration and extensions).
   */
  pcexcludegroup?: OneOrMore<
    "bot" | "bureaucrat" | "interface-admin" | "suppress" | "sysop" | (string & {})
  >;
  /**
   * Only include users having the given rights. Does not include rights granted by implicit or auto-promoted groups like *, user, or autoconfirmed.
   *
   * Open union: the value set is the wiki's permission registry (core rights plus rights added by configuration and extensions).
   * The "renameuser" value is available since MediaWiki 1.40.
   * The "logentryimport" value is available since MediaWiki 1.43.
   * The "interwiki", "renameuser-global" values are available since MediaWiki 1.44.
   * The "createwithcontentmodel", "ignore-restricted-groups" values are available since MediaWiki 1.46.
   */
  pcrights?: OneOrMore<
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
    | "logentryimport"
    | "interwiki"
    | "renameuser-global"
    | "createwithcontentmodel"
    | "ignore-restricted-groups"
    | (string & {})
  >;
  /**
   * Exclude users having the given rights. Does not include rights granted by implicit or auto-promoted groups like *, user, or autoconfirmed.
   *
   * The "renameuser" value is available since MediaWiki 1.40.
   * The "logentryimport" value is available since MediaWiki 1.43.
   * The "interwiki", "renameuser-global" values are available since MediaWiki 1.44.
   * The "createwithcontentmodel", "ignore-restricted-groups" values are available since MediaWiki 1.46.
   */
  pcexcluderights?: OneOrMore<
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
    | "logentryimport"
    | "interwiki"
    | "renameuser-global"
    | "createwithcontentmodel"
    | "ignore-restricted-groups"
  >;
  /**
   * How many contributors to return.
   */
  pclimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  pccontinue?: string;
}

declare module "../../registry" {
  interface QueryPropParams {
    contributors: ApiQueryContributorsParams;
  }
}
