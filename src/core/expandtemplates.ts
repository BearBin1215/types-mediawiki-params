import type { OneOrMore } from "../common";

/**
 * Request parameters for the `expandtemplates` action.
 *
 * Expands all templates within wikitext.
 */
export interface ApiExpandtemplatesParams {
  /**
   * Title of the page.
   */
  title?: string;
  /**
   * Wikitext to convert.
   */
  text: string;
  /**
   * Revision ID, for `{{REVISIONID}}` and similar variables.
   */
  revid?: number;
  /**
   * Which pieces of information to get.
   * Note that if no values are selected, the result will contain the wikitext, but the output will be in a deprecated format.
   */
  prop?: OneOrMore<
    | "categories"
    | "encodedjsconfigvars"
    | "jsconfigvars"
    | "modules"
    | "parsetree"
    | "properties"
    | "ttl"
    | "volatile"
    | "wikitext"
  >;
  /**
   * Whether to include HTML comments in the output.
   */
  includecomments?: boolean;
  /**
   * Whether to include internal merge strategy information in jsconfigvars.
   */
  showstrategykeys?: boolean;
  /**
   * @deprecated
   */
  generatexml?: boolean;
}

declare module "../registry" {
  interface ActionParams {
    expandtemplates: ApiExpandtemplatesParams;
  }
}
