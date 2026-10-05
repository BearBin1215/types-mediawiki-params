/**
 * Opt-in extension pack: **Echo** (`action=echomarkread`, `action=echomarkseen`, `action=echocreateevent`, `action=echoarticlereminder`, `action=echomute`, `action=echopushsubscriptions`, `meta=notifications`, `meta=unreadnotificationpages`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/echo";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:Echo
 */

import type { ApiLimit, OneOrMore } from "../common";

/**
 * Request parameters for the `echomarkread` action provided by the extension.
 *
 * Mark notifications as read for the current user.
 */
export interface ApiEchomarkreadParams {
  /**
   * A list of notification IDs to mark as read.
   */
  list?: OneOrMore<string>;
  /**
   * A list of notification IDs to mark as unread.
   */
  unreadlist?: OneOrMore<string>;
  /**
   * If set, marks all of a user's notifications as read.
   */
  all?: boolean;
  /**
   * A list of sections to mark as read.
   */
  sections?: OneOrMore<"alert" | "message">;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `echomarkseen` action provided by the extension.
 *
 * Mark notifications as seen for the current user.
 */
export interface ApiEchomarkseenParams {
  /**
   * Type of notifications to mark as seen: 'alert', 'message' or 'all'.
   */
  type: "alert" | "all" | "message";
  /**
   * Timestamp format to use for output, 'ISO_8601' or 'MW'. 'MW' is deprecated here, so all clients should switch to 'ISO_8601'. This parameter will be removed, and 'ISO_8601' will become the only output format.
   */
  timestampFormat?: "ISO_8601" | "MW";
}
/**
 * Request parameters for the `echocreateevent` action provided by the extension.
 *
 * Manually trigger a notification to a user
 */
export interface ApiEchocreateeventParams {
  /**
   * User to send the notification to
   */
  user?: string;
  /**
   * Header content of the notification
   */
  header: string;
  /**
   * Body content of the notification
   */
  content: string;
  /**
   * Page to link to in the notification
   */
  page?: string;
  /**
   * Section where notification would be delivered
   */
  section: "alert" | "notice";
  /**
   * Whether to send an email as well
   */
  email?: boolean;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `echoarticlereminder` action provided by the extension.
 *
 * Request a future reminder about the specified article
 *
 * Only registered when $wgAllowArticleReminderNotification is enabled.
 */
export interface ApiEchoarticlereminderParams {
  /**
   * ID of article to remind the user about
   */
  pageid?: number;
  /**
   * Title of article to remind the user about
   */
  title?: string;
  /**
   * Optional user comment to include in the reminder
   */
  comment?: string;
  /**
   * On which timestamp to remind the user
   */
  timestamp: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `echomute` action provided by the extension.
 *
 * Mute or unmute notifications from certain users or pages.
 */
export interface ApiEchomuteParams {
  /**
   * Which mute list to add to or remove from
   */
  type: "page-linked-title" | "user";
  /**
   * Pages or users to add to the mute list
   */
  mute?: OneOrMore<string>;
  /**
   * Pages or users to remove from the mute list
   */
  unmute?: OneOrMore<string>;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `echopushsubscriptions` action provided by the extension.
 *
 * Manage push subscriptions for the current user.
 *
 * Only registered when $wgEchoEnablePush is enabled.
 */
export interface ApiEchopushsubscriptionsParams {
  /**
   * Action to perform.
   */
  command: "create" | "delete";
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `meta=notifications` query module provided by the extension.
 *
 * Get notifications waiting for the current user.
 */
export interface ApiQueryNotificationsParams {
  /**
   * Filter notifications returned.
   */
  notfilter?: OneOrMore<"!read" | "read">;
  /**
   * Details to request.
   */
  notprop?: OneOrMore<"count" | "list" | "seenTime">;
  /**
   * The notification sections to query (i.e. some combination of 'alert' and 'message').
   */
  notsections?: OneOrMore<"alert" | "message">;
  /**
   * Whether to group the result by section. Each section is fetched separately if set.
   */
  notgroupbysection?: boolean;
  /**
   * If specified, notifications will be returned formatted this way.
   */
  notformat?: "flyout" | "html" | "model" | "special";
  /**
   * The maximum number of notifications to return.
   */
  notlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  notcontinue?: string;
  /**
   * Whether to show unread notifications first (only used if groupbysection is not set).
   */
  notunreadfirst?: boolean;
  /**
   * Only return notifications for these pages. To get notifications not associated with any page, use [] as a title.
   */
  nottitles?: OneOrMore<string>;
  /**
   * Whether to show bundle compatible unread notifications according to notification types bundling rules.
   */
  notbundle?: boolean;
  /**
   * Notifier types for which to return notifications.
   */
  notnotifiertypes?: OneOrMore<"email" | "web">;
  /**
   * When more alert results are available, use this to continue.
   */
  notalertcontinue?: string;
  /**
   * Whether to show unread message notifications first (only used if groupbysection is set).
   */
  notalertunreadfirst?: boolean;
  /**
   * When more message results are available, use this to continue.
   */
  notmessagecontinue?: string;
  /**
   * Whether to show unread alert notifications first (only used if groupbysection is set).
   */
  notmessageunreadfirst?: boolean;
}
/**
 * Request parameters for the `meta=unreadnotificationpages` query module provided by the extension.
 *
 * Get pages for which there are unread notifications for the current user.
 */
export interface ApiQueryUnreadnotificationpagesParams {
  /**
   * Group talk pages together with their subject page, and group notifications not associated with a page together with the current user's user page.
   */
  unpgrouppages?: boolean;
  /**
   * The maximum number of pages to return.
   */
  unplimit?: ApiLimit;
}

declare module "../registry" {
  interface ActionParams {
    echomarkread: ApiEchomarkreadParams;
    echomarkseen: ApiEchomarkseenParams;
    echocreateevent: ApiEchocreateeventParams;
    echoarticlereminder: ApiEchoarticlereminderParams;
    echomute: ApiEchomuteParams;
    echopushsubscriptions: ApiEchopushsubscriptionsParams;
  }
  interface QueryMetaParams {
    notifications: ApiQueryNotificationsParams;
    unreadnotificationpages: ApiQueryUnreadnotificationpagesParams;
  }
}
