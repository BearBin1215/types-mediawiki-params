import type { OneOrMore } from "../common";

/**
 * Request parameters for the `parse` action.
 *
 * Parses content and returns parser output.
 * See the various prop-modules of `action=query` to get information from the current version of a page.
 * There are several ways to specify the text to parse:
 * Specify a page or revision, using page, pageid, or oldid.
 * Specify content explicitly, using text, title, revid, and contentmodel.
 * Specify only a summary to parse. prop should be given an empty value.
 */
export interface ApiParseParams {
  /**
   * Title of page the text belongs to. If omitted, contentmodel must be specified, and API will be used as the title.
   */
  title?: string;
  /**
   * Text to parse. Use title or contentmodel to control the content model.
   */
  text?: string;
  /**
   * Revision ID, for `{{REVISIONID}}` and similar variables.
   */
  revid?: number;
  /**
   * Summary to parse.
   */
  summary?: string;
  /**
   * Parse the content of this page. Cannot be used together with text and title.
   */
  page?: string;
  /**
   * Parse the content of this page. Overrides page.
   */
  pageid?: number;
  /**
   * If page or pageid is set to a redirect, resolve it.
   */
  redirects?: boolean;
  /**
   * Parse the content of this revision. Overrides page and pageid.
   */
  oldid?: number;
  /**
   * Which pieces of information to get
   *
   * The "tocdata" value is available since MediaWiki 1.43.
   */
  prop?: OneOrMore<
    | "categories"
    | "categorieshtml"
    | "displaytitle"
    | "encodedjsconfigvars"
    | "externallinks"
    | "headhtml"
    | "images"
    | "indicators"
    | "iwlinks"
    | "jsconfigvars"
    | "langlinks"
    | "limitreportdata"
    | "limitreporthtml"
    | "links"
    | "modules"
    | "parsetree"
    | "parsewarnings"
    | "parsewarningshtml"
    | "properties"
    | "revid"
    | "sections"
    | "subtitle"
    | "templates"
    | "text"
    | "wikitext"
    | "headitems"
    | "tocdata"
  >;
  /**
   * CSS class to use to wrap the parser output.
   */
  wrapoutputclass?: string;
  /**
   * Do a pre-save transform on the input before parsing it. Only valid when used with text.
   */
  pst?: boolean;
  /**
   * Do a pre-save transform (PST) on the input, but don't parse it. Returns the same wikitext, after a PST has been applied. Only valid when used with text.
   */
  onlypst?: boolean;
  /**
   * @deprecated
   */
  effectivelanglinks?: boolean;
  /**
   * Only parse the content of the section with this identifier.
   * When `new`, parse text and sectiontitle as if adding a new section to the page.
   * `new` is allowed only when specifying text.
   */
  section?: string;
  /**
   * New section title when section is `new`.
   * Unlike page editing, this does not fall back to summary when omitted or empty.
   */
  sectiontitle?: string;
  /**
   * @deprecated
   */
  disablepp?: boolean;
  /**
   * Omit the limit report ("NewPP limit report") from the parser output.
   */
  disablelimitreport?: boolean;
  /**
   * Omit edit section links from the parser output.
   */
  disableeditsection?: boolean;
  /**
   * Do not deduplicate inline stylesheets in the parser output.
   */
  disablestylededuplication?: boolean;
  /**
   * Whether to include internal merge strategy information in jsconfigvars.
   */
  showstrategykeys?: boolean;
  /**
   * @deprecated
   */
  generatexml?: boolean;
  /**
   * Parse in preview mode.
   */
  preview?: boolean;
  /**
   * Parse in section preview mode (enables preview mode too).
   */
  sectionpreview?: boolean;
  /**
   * Omit table of contents in output.
   */
  disabletoc?: boolean;
  /**
   * Apply the selected skin to the parser output. May affect the following properties: `text`, `langlinks`, `headitems`, `modules`, `jsconfigvars`, `indicators`.
   *
   * The "authentication-popup", "json" values are available since MediaWiki 1.43.
   */
  useskin?:
    | "apioutput"
    | "fallback"
    | "minerva"
    | "monobook"
    | "timeless"
    | "vector"
    | "vector-2022"
    | "authentication-popup"
    | "json";
  /**
   * Content serialization format used for the input text. Only valid when used with text.
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
   * Content model of the input text. If omitted, title must be specified, and default will be the model of the specified title. Only valid when used with text.
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
   * @since MediaWiki 1.41
   * @deprecated
   */
  parsoid?: boolean;
  /**
   * Use the ArticleParserOptions hook to ensure the options used match those used for article page views
   *
   * @since MediaWiki 1.43
   */
  usearticle?: boolean;
  /**
   * Which wikitext parser to use
   *
   * @since MediaWiki 1.45
   */
  parser?: "default" | "legacy" | "parsoid";
}

declare module "../registry" {
  interface ActionParams {
    parse: ApiParseParams;
  }
}
