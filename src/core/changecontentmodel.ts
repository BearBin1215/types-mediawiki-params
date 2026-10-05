import type { OneOrMore } from "../common";

/**
 * Request parameters for the `changecontentmodel` action.
 *
 * Change the content model of a page
 */
export interface ApiChangecontentmodelParams {
  /**
   * Title of the page to change the contentmodel of. Cannot be used together with pageid.
   */
  title?: string;
  /**
   * Page ID of the page to change the contentmodel of. Cannot be used together with title.
   */
  pageid?: number;
  /**
   * Edit summary and log entry reason
   */
  summary?: string;
  /**
   * Change tags to apply to the log entry and edit.
   */
  tags?: OneOrMore<string>;
  /**
   * Content model of the new content.
   *
   * Open union: the value set is the content-handler registry ($wgContentHandlers, extension.json ContentHandlers, the GetContentModels hook); core's models are listed for autocomplete only.
   * The "vue" value is available since MediaWiki 1.45.
   */
  model: "css" | "javascript" | "json" | "text" | "wikitext" | "vue" | (string & {});
  /**
   * Mark the content model change with a bot flag.
   */
  bot?: boolean;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    changecontentmodel: ApiChangecontentmodelParams;
  }
}
