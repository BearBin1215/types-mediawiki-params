import type { OneOrMore } from "../common";

/**
 * Request parameters for the `compare` action.
 *
 * Get the difference between two pages.
 * A revision number, a page title, a page ID, text, or a relative reference for both "from" and "to" must be passed.
 */
export interface ApiCompareParams {
  /**
   * First title to compare.
   */
  fromtitle?: string;
  /**
   * First page ID to compare.
   */
  fromid?: number;
  /**
   * First revision to compare.
   */
  fromrev?: number;
  /**
   * Override content of the revision specified by fromtitle, fromid or fromrev.
   * This parameter specifies the slots that are to be modified. Use fromtext-{slot}, fromcontentmodel-{slot}, and fromcontentformat-{slot} to specify content for each slot.
   */
  fromslots?: OneOrMore<"main">;
  /**
   * Do a pre-save transform on fromtext-{slot}.
   */
  frompst?: boolean;
  /**
   * @deprecated
   */
  fromtext?: string;
  /**
   * Open union: the value set comes from IContentHandlerFactory::getAllContentFormats().
   * The "application/vue+xml" value is available since MediaWiki 1.45.
   * @deprecated
   */
  fromcontentformat?:
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
   * Open union: the value set is the content-handler registry ($wgContentHandlers, extension.json ContentHandlers, the GetContentModels hook); core's models are listed for autocomplete only.
   * The "vue" value is available since MediaWiki 1.45.
   * @deprecated
   */
  fromcontentmodel?:
    | "css"
    | "javascript"
    | "json"
    | "text"
    | "unknown"
    | "wikitext"
    | "vue"
    | (string & {});
  /**
   * @deprecated
   */
  fromsection?: string;
  /**
   * Second title to compare.
   */
  totitle?: string;
  /**
   * Second page ID to compare.
   */
  toid?: number;
  /**
   * Second revision to compare.
   */
  torev?: number;
  /**
   * Use a revision relative to the revision determined from fromtitle, fromid or fromrev. All of the other 'to' options will be ignored.
   */
  torelative?: "cur" | "next" | "prev";
  /**
   * Override content of the revision specified by totitle, toid or torev.
   * This parameter specifies the slots that are to be modified. Use totext-{slot}, tocontentmodel-{slot}, and tocontentformat-{slot} to specify content for each slot.
   */
  toslots?: OneOrMore<"main">;
  /**
   * Do a pre-save transform on totext.
   */
  topst?: boolean;
  /**
   * @deprecated
   */
  totext?: string;
  /**
   * Open union: the value set comes from IContentHandlerFactory::getAllContentFormats().
   * The "application/vue+xml" value is available since MediaWiki 1.45.
   * @deprecated
   */
  tocontentformat?:
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
   * Open union: the value set is the content-handler registry ($wgContentHandlers, extension.json ContentHandlers, the GetContentModels hook); core's models are listed for autocomplete only.
   * The "vue" value is available since MediaWiki 1.45.
   * @deprecated
   */
  tocontentmodel?:
    | "css"
    | "javascript"
    | "json"
    | "text"
    | "unknown"
    | "wikitext"
    | "vue"
    | (string & {});
  /**
   * @deprecated
   */
  tosection?: string;
  /**
   * Which pieces of information to get.
   */
  prop?: OneOrMore<
    | "comment"
    | "diff"
    | "diffsize"
    | "ids"
    | "parsedcomment"
    | "rel"
    | "size"
    | "timestamp"
    | "title"
    | "user"
  >;
  /**
   * Return individual diffs for these slots, rather than one combined diff for all slots.
   */
  slots?: OneOrMore<"main">;
  /**
   * Return the comparison formatted as inline HTML.
   *
   * @since MediaWiki 1.41
   */
  difftype?: "table" | "unified";
}

declare module "../registry" {
  interface ActionParams {
    compare: ApiCompareParams;
  }
}
