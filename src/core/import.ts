import type { OneOrMore } from "../common";

/**
 * Request parameters for the `import` action.
 *
 * Import a page from another wiki, or from an XML file.
 * Note that the HTTP POST must be done as a file upload (i.e. using multipart/form-data) when sending a file for the xml parameter.
 */
export interface ApiImportParams {
  /**
   * Log entry import summary.
   */
  summary?: string;
  /**
   * Uploaded XML file.
   */
  xml?: File;
  /**
   * For uploaded imports: interwiki prefix to apply to unknown usernames (and known users if assignknownusers is set).
   */
  interwikiprefix?: string;
  /**
   * For interwiki imports: wiki to import from.
   */
  interwikisource?: string;
  /**
   * For interwiki imports: page to import.
   */
  interwikipage?: string;
  /**
   * For interwiki imports: import the full history, not just the current version.
   */
  fullhistory?: boolean;
  /**
   * For interwiki imports: import all included templates as well.
   */
  templates?: boolean;
  /**
   * Import to this namespace. Cannot be used together with rootpage.
   */
  namespace?: number;
  /**
   * Assign edits to local users where the named user exists locally.
   */
  assignknownusers?: boolean;
  /**
   * Import as subpage of this page. Cannot be used together with namespace.
   */
  rootpage?: string;
  /**
   * Change tags to apply to the entry in the import log and to the dummy revision on the imported pages.
   */
  tags?: OneOrMore<string>;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    import: ApiImportParams;
  }
}
