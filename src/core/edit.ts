import type { OneOrMore } from "../common";

/**
 * Request parameters for the `edit` action.
 *
 * Create and edit pages.
 */
export interface ApiEditParams {
  /**
   * Title of the page to edit. Cannot be used together with pageid.
   */
  title?: string;
  /**
   * Page ID of the page to edit. Cannot be used together with title.
   */
  pageid?: number;
  /**
   * Section identifier. `0` for the top section, `new` for a new section. Often a positive integer, but can also be non-numeric.
   */
  section?: string;
  /**
   * The title for a new section when using section=new.
   */
  sectiontitle?: string;
  /**
   * Page content.
   */
  text?: string;
  /**
   * Edit summary.
   * When this parameter is not provided or empty, an edit summary may be generated automatically.
   * When using section=new and sectiontitle is not provided, the value of this parameter is used for the section title instead, and an edit summary is generated automatically.
   */
  summary?: string;
  /**
   * Change tags to apply to the revision.
   */
  tags?: OneOrMore<string>;
  /**
   * Mark this edit as a minor edit.
   */
  minor?: boolean;
  /**
   * Do not mark this edit as a minor edit even if the "Mark all edits minor by default" user preference is set.
   */
  notminor?: boolean;
  /**
   * Mark this edit as a bot edit.
   */
  bot?: boolean;
  /**
   * ID of the base revision, used to detect edit conflicts. May be obtained through action=query&prop=revisions. Self-conflicts cause the edit to fail unless basetimestamp is set.
   */
  baserevid?: number;
  /**
   * Timestamp of the base revision, used to detect edit conflicts. May be obtained through action=query&prop=revisions&rvprop=timestamp. Self-conflicts are ignored.
   */
  basetimestamp?: string;
  /**
   * Timestamp when the editing process began, used to detect edit conflicts. An appropriate value may be obtained using curtimestamp when beginning the edit process (e.g. when loading the page content to edit).
   */
  starttimestamp?: string;
  /**
   * Override any errors about the page having been deleted in the meantime.
   */
  recreate?: boolean;
  /**
   * Don't edit the page if it already exists.
   */
  createonly?: boolean;
  /**
   * Throw an error if the page doesn't exist.
   */
  nocreate?: boolean;
  /**
   * @deprecated
   */
  watch?: boolean;
  /**
   * @deprecated
   */
  unwatch?: boolean;
  /**
   * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   */
  watchlist?: "nochange" | "preferences" | "unwatch" | "watch";
  /**
   * The MD5 hash of the text parameter, or the prependtext and appendtext parameters concatenated. If set, the edit won't be done unless the hash is correct.
   */
  md5?: string;
  /**
   * Add this text to the beginning of the page or section. Overrides text.
   */
  prependtext?: string;
  /**
   * Add this text to the end of the page or section. Overrides text.
   * Use section=new to append a new section, rather than this parameter.
   */
  appendtext?: string;
  /**
   * Undo this revision. Overrides text, prependtext and appendtext.
   */
  undo?: number;
  /**
   * Undo all revisions from undo to this one. If not set, just undo one revision.
   */
  undoafter?: number;
  /**
   * Automatically resolve redirects.
   */
  redirect?: boolean;
  /**
   * Content serialization format used for the input text.
   *
   * Open union: the value set comes from IContentHandlerFactory::getAllContentFormats().
   * The "application/vue+xml" value is available since MediaWiki 1.45.
   */
  contentformat?:
    | "application/json"
    | "application/octet-stream"
    | "application/unknown"
    | "application/x-binary"
    | "text/css"
    | "text/javascript"
    | "text/plain"
    | "text/unknown"
    | "text/x-wiki"
    | "unknown/unknown"
    | "application/vue+xml"
    | (string & {});
  /**
   * Content model of the new content.
   *
   * Open union: the value set is the content-handler registry ($wgContentHandlers, extension.json ContentHandlers, the GetContentModels hook); core's models are listed for autocomplete only.
   * The "vue" value is available since MediaWiki 1.45.
   */
  contentmodel?:
    | "css"
    | "javascript"
    | "json"
    | "text"
    | "unknown"
    | "wikitext"
    | "vue"
    | (string & {});
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   * The token should always be sent as the last parameter, or at least after the text parameter.
   */
  token: string;
  /**
   * Page title. If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to the given page, instead of the page that was edited.
   *
   * @since MediaWiki 1.41
   */
  returnto?: string;
  /**
   * URL query parameters (with leading `?`). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given query parameters.
   *
   * @since MediaWiki 1.41
   */
  returntoquery?: string;
  /**
   * URL fragment (with leading `#`). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given fragment.
   *
   * @since MediaWiki 1.41
   */
  returntoanchor?: string;
  /**
   * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   *
   * Only available when $wgWatchlistExpiry is enabled.
   */
  watchlistexpiry?: string;
}

declare module "../registry" {
  interface ActionParams {
    edit: ApiEditParams;
  }
}
