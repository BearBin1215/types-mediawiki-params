/**
 * Opt-in extension pack: **DiscussionTools** (`action=discussiontoolscompare`, `action=discussiontoolsedit`, `action=discussiontoolsfindcomment`, `action=discussiontoolsgetsubscriptions`, `action=discussiontoolspageinfo`, `action=discussiontoolspreview`, `action=discussiontoolssubscribe`, `action=discussiontoolsthank`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/discussiontools";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:DiscussionTools
 */

import type { OneOrMore } from "../common";

/**
 * Request parameters for the `discussiontoolscompare` action provided by the extension.
 *
 * Get information about comment changes between two page revisions.
 */
export interface ApiDiscussiontoolscompareParams {
  /**
   * First title to compare.
   */
  fromtitle?: string;
  /**
   * First revision to compare.
   */
  fromrev?: number;
  /**
   * Second title to compare.
   */
  totitle?: string;
  /**
   * Second revision to compare.
   */
  torev?: number;
}
/**
 * Request parameters for the `discussiontoolsedit` action provided by the extension.
 *
 * Post a message on a discussion page.
 */
export interface ApiDiscussiontoolseditParams {
  /**
   * Action to perform.
   */
  paction: "addcomment" | "addtopic";
  /**
   * Automatically subscribe the user to the talk page thread?
   */
  autosubscribe?: "default" | "no" | "yes";
  /**
   * The page to perform actions on.
   */
  page: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * An optional unique ID generated in the client to prevent double-posting.
   */
  formtoken?: string;
  /**
   * Name of the comment to reply to. Only used when paction is addcomment.
   */
  commentname?: string;
  /**
   * ID of the comment to reply to. Only used when paction is addcomment. Overrides commentname.
   */
  commentid?: string;
  /**
   * Content to post, as wikitext. Cannot be used together with html.
   */
  wikitext?: string;
  /**
   * Content to post, as HTML. Cannot be used together with wikitext.
   */
  html?: string;
  /**
   * Edit summary.
   */
  summary?: string;
  /**
   * The title for a new section when using $1section=new. Only used when paction is addtopic.
   */
  sectiontitle?: string;
  /**
   * Allow posting a new section without a title.
   */
  allownosectiontitle?: boolean;
  /**
   * Apply the selected skin to the parser output. May affect the following properties: `text`, `langlinks`, `headitems`, `modules`, `jsconfigvars`, `indicators`.
   */
  useskin?:
    | "apioutput"
    | "authentication-popup"
    | "fallback"
    | "json"
    | "minerva"
    | "monobook"
    | "timeless"
    | "vector"
    | "vector-2022";
  /**
   * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   */
  watchlist?: string;
  /**
   * Captcha ID (when saving with a captcha response).
   */
  captchaid?: string;
  /**
   * Answer to the captcha (when saving with a captcha response).
   */
  captchaword?: string;
  /**
   * Omit the HTML content of the new revision in the response.
   */
  nocontent?: string;
  /**
   * Change tags to apply to the edit.
   */
  tags?: OneOrMore<string>;
  /**
   * Page title. If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to the given page, instead of the page that was edited.
   */
  returnto?: string;
  /**
   * URL query parameters (with leading `?`). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given query parameters.
   */
  returntoquery?: string;
  /**
   * URL fragment (with leading `#`). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given fragment.
   */
  returntoanchor?: string;
}
/**
 * Request parameters for the `discussiontoolsfindcomment` action provided by the extension.
 *
 * Find a comment by its ID or name.
 */
export interface ApiDiscussiontoolsfindcommentParams {
  /**
   * Comment ID or name
   */
  idorname?: string;
  /**
   * Heading hash fragment
   */
  heading?: string;
  /**
   * Page that the heading hash fragment once existed on
   */
  page?: string;
}
/**
 * Request parameters for the `discussiontoolsgetsubscriptions` action provided by the extension.
 *
 * Get the subscription statuses of given topics.
 */
export interface ApiDiscussiontoolsgetsubscriptionsParams {
  /**
   * Names of the topics to check
   */
  commentname: OneOrMore<string>;
}
/**
 * Request parameters for the `discussiontoolspageinfo` action provided by the extension.
 *
 * Returns metadata required to initialize the discussion tools.
 */
export interface ApiDiscussiontoolspageinfoParams {
  /**
   * The page to perform actions on.
   */
  page?: string;
  /**
   * The revision number to use (defaults to latest revision).
   */
  oldid?: number;
  /**
   * Which properties to get
   */
  prop?: OneOrMore<"threaditemshtml" | "transcludedfrom">;
  /**
   * Exclude user signatures from the comments (when using prop=threaditemshtml).
   */
  excludesignatures?: boolean;
}
/**
 * Request parameters for the `discussiontoolspreview` action provided by the extension.
 *
 * Preview a message on a discussion page.
 */
export interface ApiDiscussiontoolspreviewParams {
  /**
   * Type of message to preview
   */
  type: "reply" | "topic";
  /**
   * The page to perform actions on.
   */
  page: string;
  /**
   * Content to preview, as wikitext.
   */
  wikitext: string;
  /**
   * The title for a new section when using section=new.
   */
  sectiontitle?: string;
  /**
   * Apply the selected skin to the parser output. May affect the following properties: `text`, `langlinks`, `headitems`, `modules`, `jsconfigvars`, `indicators`.
   */
  useskin?:
    | "apioutput"
    | "authentication-popup"
    | "fallback"
    | "json"
    | "minerva"
    | "monobook"
    | "timeless"
    | "vector"
    | "vector-2022";
}
/**
 * Request parameters for the `discussiontoolssubscribe` action provided by the extension.
 *
 * Subscribe (or unsubscribe) to receive notifications about a topic.
 */
export interface ApiDiscussiontoolssubscribeParams {
  /**
   * A page on which the topic appears
   */
  page: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * Name of the topic to subscribe to (or unsubscribe from)
   */
  commentname: string;
  /**
   * True to subscribe, false to unsubscribe
   */
  subscribe: boolean;
}
/**
 * Request parameters for the `discussiontoolsthank` action provided by the extension.
 *
 * Send a public thank-you notification for a comment.
 */
export interface ApiDiscussiontoolsthankParams {
  /**
   * The page to perform actions on.
   */
  page: string;
  /**
   * ID of the comment to thank.
   */
  commentid: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    discussiontoolscompare: ApiDiscussiontoolscompareParams;
    discussiontoolsedit: ApiDiscussiontoolseditParams;
    discussiontoolsfindcomment: ApiDiscussiontoolsfindcommentParams;
    discussiontoolsgetsubscriptions: ApiDiscussiontoolsgetsubscriptionsParams;
    discussiontoolspageinfo: ApiDiscussiontoolspageinfoParams;
    discussiontoolspreview: ApiDiscussiontoolspreviewParams;
    discussiontoolssubscribe: ApiDiscussiontoolssubscribeParams;
    discussiontoolsthank: ApiDiscussiontoolsthankParams;
  }
}
