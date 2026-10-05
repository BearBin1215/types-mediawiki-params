import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=recentchanges` query module.
 *
 * Enumerate recent changes.
 */
export interface ApiQueryRecentchangesParams {
  /**
   * The timestamp to start enumerating from.
   */
  rcstart?: string;
  /**
   * The timestamp to end enumerating.
   */
  rcend?: string;
  /**
   * In which direction to enumerate
   */
  rcdir?: "newer" | "older";
  /**
   * Filter changes to only these namespaces.
   */
  rcnamespace?: OneOrMore<number>;
  /**
   * Only list changes by this user.
   */
  rcuser?: string;
  /**
   * Don't list changes by this user.
   */
  rcexcludeuser?: string;
  /**
   * Only list changes tagged with this tag.
   */
  rctag?: string;
  /**
   * Include additional pieces of information
   */
  rcprop?: OneOrMore<
    | "comment"
    | "flags"
    | "ids"
    | "loginfo"
    | "parsedcomment"
    | "patrolled"
    | "redirect"
    | "sha1"
    | "sizes"
    | "tags"
    | "timestamp"
    | "title"
    | "user"
    | "userid"
  >;
  /**
   * Show only items that meet these criteria. For example, to see only minor edits done by logged-in users, set rcshow=minor|!anon.
   */
  rcshow?: OneOrMore<
    | "!anon"
    | "!autopatrolled"
    | "!bot"
    | "!minor"
    | "!patrolled"
    | "!redirect"
    | "anon"
    | "autopatrolled"
    | "bot"
    | "minor"
    | "patrolled"
    | "redirect"
    | "unpatrolled"
  >;
  /**
   * How many total changes to return.
   */
  rclimit?: ApiLimit;
  /**
   * Which types of changes to show.
   */
  rctype?: OneOrMore<"categorize" | "edit" | "external" | "log" | "new">;
  /**
   * Only list changes which are the latest revision.
   */
  rctoponly?: boolean;
  /**
   * Filter entries to those related to a page.
   */
  rctitle?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  rccontinue?: string;
  /**
   * When being used as a generator, generate revision IDs rather than titles. Recent change entries without associated revision IDs (e.g. most log entries) will generate nothing.
   */
  rcgeneraterevisions?: boolean;
  /**
   * Only list changes that touch the named slot.
   */
  rcslot?: "main";
}

declare module "../../registry" {
  interface QueryListParams {
    recentchanges: ApiQueryRecentchangesParams;
  }
  interface QueryGeneratorParams {
    recentchanges: ApiQueryRecentchangesParams;
  }
}
