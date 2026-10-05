/**
 * Request parameters for the `stashedit` action.
 *
 * Prepare an edit in shared cache.
 * This is intended to be used via AJAX from the edit form to improve the performance of the page save.
 */
export interface ApiStasheditParams {
  /**
   * Title of the page being edited.
   */
  title: string;
  /**
   * Section identifier. `0` for the top section, `new` for a new section.
   */
  section?: string;
  /**
   * The title for a new section.
   */
  sectiontitle?: string;
  /**
   * Page content.
   */
  text?: string;
  /**
   * Page content hash from a prior stash to use instead.
   */
  stashedtexthash?: string;
  /**
   * Change summary.
   */
  summary?: string;
  /**
   * Content model of the new content.
   *
   * Open union: the value set is the content-handler registry ($wgContentHandlers, extension.json ContentHandlers, the GetContentModels hook); core's models are listed for autocomplete only.
   * The "vue" value is available since MediaWiki 1.45.
   */
  contentmodel:
    | "css"
    | "javascript"
    | "json"
    | "text"
    | "unknown"
    | "wikitext"
    | "vue"
    | (string & {});
  /**
   * Content serialization format used for the input text.
   *
   * Open union: the value set comes from IContentHandlerFactory::getAllContentFormats().
   * The "application/vue+xml" value is available since MediaWiki 1.45.
   */
  contentformat:
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
   * Revision ID of the base revision.
   */
  baserevid: number;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    stashedit: ApiStasheditParams;
  }
}
