/**
 * Request parameters for the `filerevert` action.
 *
 * Revert a file to an old version.
 */
export interface ApiFilerevertParams {
  /**
   * Target filename, without the File: prefix.
   */
  filename: string;
  /**
   * Upload comment.
   */
  comment?: string;
  /**
   * Archive name of the revision to revert to.
   */
  archivename: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    filerevert: ApiFilerevertParams;
  }
}
