import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=watchlist` query module.
 *
 * Get recent changes to pages in the current user's watchlist.
 */
export interface ApiQueryWatchlistParams {
  /**
   * Include multiple revisions of the same page within given timeframe.
   */
  wlallrev?: boolean;
  /**
   * The timestamp to start enumerating from.
   */
  wlstart?: string;
  /**
   * The timestamp to end enumerating.
   */
  wlend?: string;
  /**
   * Filter changes to only the given namespaces.
   */
  wlnamespace?: OneOrMore<number>;
  /**
   * Only list changes by this user.
   */
  wluser?: string;
  /**
   * Don't list changes by this user.
   */
  wlexcludeuser?: string;
  /**
   * In which direction to enumerate
   */
  wldir?: "newer" | "older";
  /**
   * How many total results to return per request.
   */
  wllimit?: ApiLimit;
  /**
   * Which additional properties to get
   *
   * The "labels" value is available since MediaWiki 1.46.
   */
  wlprop?: OneOrMore<
    | "comment"
    | "expiry"
    | "flags"
    | "ids"
    | "loginfo"
    | "notificationtimestamp"
    | "parsedcomment"
    | "patrol"
    | "sizes"
    | "tags"
    | "timestamp"
    | "title"
    | "user"
    | "userid"
    | "labels"
  >;
  /**
   * Show only items that meet these criteria. For example, to see only minor edits done by logged-in users, set wlshow=minor|!anon.
   */
  wlshow?: OneOrMore<
    | "!anon"
    | "!autopatrolled"
    | "!bot"
    | "!minor"
    | "!patrolled"
    | "!unread"
    | "anon"
    | "autopatrolled"
    | "bot"
    | "minor"
    | "patrolled"
    | "unread"
  >;
  /**
   * Which types of changes to show
   */
  wltype?: OneOrMore<"categorize" | "edit" | "external" | "log" | "new">;
  /**
   * Used along with wltoken to access a different user's watchlist.
   */
  wlowner?: string;
  /**
   * A security token (available in the user's preferences) to allow access to another user's watchlist.
   */
  wltoken?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  wlcontinue?: string;
  /**
   * Only list changes with these watchlist label IDs.
   *
   * @since MediaWiki 1.46
   */
  wllabels?: OneOrMore<number>;
}

declare module "../../registry" {
  interface QueryListParams {
    watchlist: ApiQueryWatchlistParams;
  }
  interface QueryGeneratorParams {
    watchlist: ApiQueryWatchlistParams;
  }
}
