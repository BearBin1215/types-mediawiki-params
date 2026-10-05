import type { OneOrMore } from "../common";

/**
 * Request parameters for the `upload` action.
 *
 * Upload a file, or get the status of pending uploads.
 * Several methods are available:
 * Upload file contents directly, using the file parameter.
 * Upload the file in pieces, using the filesize, chunk, and offset parameters.
 * Have the MediaWiki server fetch a file from a URL, using the url parameter.
 * Complete an earlier upload that failed due to warnings, was uploaded in pieces, or stored otherwise in the upload stash, using the filekey parameter.
 * Note that the HTTP POST must be done as a file upload (i.e. using `multipart/form-data`) when sending the file or chunk.
 */
export interface ApiUploadParams {
  /**
   * Target filename. If not set, and file is used, then the filename from that will be used.
   */
  filename?: string;
  /**
   * Upload comment. Also used as the initial page text for new files if text is not set.
   */
  comment?: string;
  /**
   * Change tags to apply to the upload log entry and file page revision.
   */
  tags?: OneOrMore<string>;
  /**
   * Initial page text for new files.
   */
  text?: string;
  /**
   * @deprecated
   */
  watch?: boolean;
  /**
   * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   */
  watchlist?: "nochange" | "preferences" | "watch";
  /**
   * Ignore any warnings.
   */
  ignorewarnings?: boolean;
  /**
   * File contents and other details. You must supply either this or filekey or url.
   */
  file?: File;
  /**
   * URL to fetch the file from. You must supply either this or file or filekey.
   */
  url?: string;
  /**
   * Key that identifies a previous upload that was stashed temporarily. You must supply either this or file or url.
   */
  filekey?: string;
  /**
   * @deprecated
   */
  sessionkey?: string;
  /**
   * If set, the server will stash the file temporarily instead of adding it to the repository.
   */
  stash?: boolean;
  /**
   * Filesize of entire upload.
   */
  filesize?: number;
  /**
   * Offset of chunk in bytes.
   */
  offset?: number;
  /**
   * Chunk contents.
   */
  chunk?: File;
  /**
   * Make potentially large file operations asynchronous when possible.
   */
  async?: boolean;
  /**
   * Only fetch the upload status for the given file key.
   */
  checkstatus?: boolean;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   *
   * Only available when $wgWatchlistExpiry is enabled.
   */
  watchlistexpiry?: string;
  /**
   * Generate the file description page wikitext server-side from comment, license, copystatus and source, overriding the text parameter. Extensions may alter the generated text via the UploadForm:getInitialPageText hook. autotext exists to allow `action=upload` to match the behavior of Special:Upload and the importImages maintenance script.
   *
   * @since MediaWiki 1.47
   */
  autotext?: boolean;
  /**
   * License selected for the upload. This is a template name. Only used together with autotext to generate the file description page wikitext.
   *
   * @since MediaWiki 1.47
   */
  license?: string;
  /**
   * Copyright status of the file (depends on $wgUseCopyrightUpload). Only used together with autotext to generate the file description page wikitext.
   *
   * Only registered when $wgUseCopyrightUpload is enabled.
   * @since MediaWiki 1.47
   */
  copystatus?: string;
  /**
   * Source of the file (depends on $wgUseCopyrightUpload). Only used together with autotext to generate the file description page wikitext.
   *
   * Only registered when $wgUseCopyrightUpload is enabled.
   * @since MediaWiki 1.47
   */
  source?: string;
}

declare module "../registry" {
  interface ActionParams {
    upload: ApiUploadParams;
  }
}
