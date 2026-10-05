/**
 * Request parameters for the `languagesearch` action.
 *
 * Search for language names in any script.
 *
 * @since MediaWiki 1.46
 */
export interface ApiLanguagesearchParams {
  /**
   * Search string.
   *
   * @since MediaWiki 1.46
   */
  search: string;
  /**
   * Number of spelling mistakes allowed in the search string.
   *
   * @since MediaWiki 1.46
   */
  typos?: number;
}

declare module "../registry" {
  interface ActionParams {
    languagesearch: ApiLanguagesearchParams;
  }
}
