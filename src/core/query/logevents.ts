import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=logevents` query module.
 *
 * Get events from logs.
 */
export interface ApiQueryLogeventsParams {
  /**
   * Which properties to get
   */
  leprop?: OneOrMore<
    | "comment"
    | "details"
    | "ids"
    | "parsedcomment"
    | "tags"
    | "timestamp"
    | "title"
    | "type"
    | "user"
    | "userid"
  >;
  /**
   * Filter log entries to only this type.
   *
   * Open union: the value set comes from $wgLogTypes (core log types plus those registered by extensions).
   * The "renameuser" value is available since MediaWiki 1.40.
   * The "interwiki" value is available since MediaWiki 1.44.
   */
  letype?:
    | ""
    | "block"
    | "contentmodel"
    | "create"
    | "delete"
    | "import"
    | "managetags"
    | "merge"
    | "move"
    | "newusers"
    | "patrol"
    | "protect"
    | "rights"
    | "suppress"
    | "tag"
    | "upload"
    | "renameuser"
    | "interwiki"
    | (string & {});
  /**
   * Filter log actions to only this action. Overrides letype. In the list of possible values, values with the asterisk wildcard such as `action/*` can have different strings after the slash (/).
   *
   * Open union: the value set comes from $wgLogActions and $wgLogActionsHandlers (core actions plus those registered by extensions).
   * The "renameuser/renameuser" value is available since MediaWiki 1.40.
   * The "interwiki/iw_add", "interwiki/iw_delete", "interwiki/iw_edit" values are available since MediaWiki 1.44.
   * The "merge/merge-into" value is available since MediaWiki 1.45.
   */
  leaction?:
    | "block/block"
    | "block/reblock"
    | "block/unblock"
    | "contentmodel/change"
    | "contentmodel/new"
    | "create/create"
    | "delete/delete"
    | "delete/delete_redir"
    | "delete/delete_redir2"
    | "delete/event"
    | "delete/restore"
    | "delete/revision"
    | "import/interwiki"
    | "import/upload"
    | "managetags/activate"
    | "managetags/create"
    | "managetags/deactivate"
    | "managetags/delete"
    | "merge/merge"
    | "move/move"
    | "move/move_redir"
    | "newusers/autocreate"
    | "newusers/byemail"
    | "newusers/create"
    | "newusers/create2"
    | "newusers/newusers"
    | "patrol/autopatrol"
    | "patrol/patrol"
    | "protect/modify"
    | "protect/move_prot"
    | "protect/protect"
    | "protect/unprotect"
    | "rights/autopromote"
    | "rights/rights"
    | "suppress/block"
    | "suppress/delete"
    | "suppress/event"
    | "suppress/reblock"
    | "suppress/revision"
    | "tag/update"
    | "upload/overwrite"
    | "upload/revert"
    | "upload/upload"
    | "renameuser/renameuser"
    | "interwiki/iw_add"
    | "interwiki/iw_delete"
    | "interwiki/iw_edit"
    | "merge/merge-into"
    | (string & {});
  /**
   * The timestamp to start enumerating from.
   */
  lestart?: string;
  /**
   * The timestamp to end enumerating.
   */
  leend?: string;
  /**
   * In which direction to enumerate
   */
  ledir?: "newer" | "older";
  /**
   * Filter entries to those made by the given user.
   */
  leuser?: string;
  /**
   * Filter entries to those related to a page.
   */
  letitle?: string;
  /**
   * Filter entries to those in the given namespace.
   */
  lenamespace?: number;
  /**
   * Disabled due to miser mode.
   */
  leprefix?: string;
  /**
   * Only list event entries tagged with this tag.
   */
  letag?: string;
  /**
   * How many total event entries to return.
   */
  lelimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  lecontinue?: string;
  /**
   * Filter entries to those matching the given log ID(s).
   *
   * @since MediaWiki 1.45
   */
  leids?: OneOrMore<number>;
}

declare module "../../registry" {
  interface QueryListParams {
    logevents: ApiQueryLogeventsParams;
  }
}
