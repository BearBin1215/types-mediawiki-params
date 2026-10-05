/**
 * Request parameters for the `mergehistory` action.
 *
 * Merge page histories.
 */
export interface ApiMergehistoryParams {
  /**
   * Title of the page from which history will be merged. Cannot be used together with fromid.
   */
  from?: string;
  /**
   * Page ID of the page from which history will be merged. Cannot be used together with from.
   */
  fromid?: number;
  /**
   * Title of the page to which history will be merged. Cannot be used together with toid.
   */
  to?: string;
  /**
   * Page ID of the page to which history will be merged. Cannot be used together with to.
   */
  toid?: number;
  /**
   * Timestamp up to which revisions will be moved from the source page's history to the destination page's history. If omitted, the entire page history of the source page will be merged into the destination page. May specify "timestamp|revid" to split two revisions with the same timestamp.
   */
  timestamp?: string;
  /**
   * Reason for the history merge.
   */
  reason?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * Timestamp from which revisions will be moved from the source page's history to the destination page's history. If omitted, all revisions before the timestamp parameter (or the entire history if neither are specified) will be merged into the destination page. May specify "timestamp|revid" to split two revisions with the same timestamp.
   *
   * @since MediaWiki 1.45
   */
  starttimestamp?: string;
}

declare module "../registry" {
  interface ActionParams {
    mergehistory: ApiMergehistoryParams;
  }
}
