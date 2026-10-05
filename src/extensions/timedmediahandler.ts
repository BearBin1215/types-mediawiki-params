/**
 * Opt-in extension pack: **TimedMediaHandler** (`action=timedtext`, `action=transcodereset`, `prop=videoinfo`, `prop=transcodestatus`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/timedmediahandler";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:TimedMediaHandler
 */

import type { ApiLimit, OneOrMore } from "../common";

/**
 * Request parameters for the `timedtext` action provided by the extension.
 *
 * Provides timed text content for usage by <track> elements
 */
export interface ApiTimedtextParams {
  /**
   * The media file title for which to retrieve timed text
   */
  title?: string;
  /**
   * The pageid of the media file for which to retrieve timed text
   */
  pageid?: number;
  /**
   * The file format in which to return timed text
   */
  trackformat: "srt" | "vtt";
  /**
   * The language of the timed text to retrieve
   */
  lang?: string;
}
/**
 * Request parameters for the `transcodereset` action provided by the extension.
 *
 * Users with the 'transcode-reset' right can reset and re-run a transcode job.
 */
export interface ApiTranscoderesetParams {
  /**
   * The media file title.
   */
  title: string;
  /**
   * The transcode key you wish to reset. Fetch from action=query&prop=transcodestatus.
   */
  transcodekey?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `prop=videoinfo` query module provided by the extension.
 *
 * Extends imageinfo to include video source (derivatives) information
 */
export interface ApiQueryVideoinfoParams {
  /**
   * Which file information to get
   */
  viprop?: OneOrMore<
    | "archivename"
    | "badfile"
    | "bitdepth"
    | "canonicaltitle"
    | "comment"
    | "commonmetadata"
    | "derivatives"
    | "dimensions"
    | "extmetadata"
    | "mediatype"
    | "metadata"
    | "mime"
    | "parsedcomment"
    | "sha1"
    | "size"
    | "thumbmime"
    | "timedtext"
    | "timestamp"
    | "uploadwarning"
    | "url"
    | "user"
    | "userid"
  >;
  /**
   * How many file revisions to return per file.
   */
  vilimit?: ApiLimit;
  /**
   * Timestamp to start listing from.
   */
  vistart?: string;
  /**
   * Timestamp to stop listing at.
   */
  viend?: string;
  /**
   * If viprop=url is set, a URL to an image scaled to this width will be returned.
   * For performance reasons if this option is used, no more than 50 scaled images will be returned.
   */
  viurlwidth?: number;
  /**
   * Similar to viurlwidth.
   */
  viurlheight?: number;
  /**
   * Version of metadata to use. If `latest` is specified, use latest version. Defaults to `1` for backwards compatibility.
   */
  vimetadataversion?: string;
  /**
   * What language to fetch extmetadata in. This affects both which translation to fetch, if multiple are available, as well as how things like numbers and various values are formatted.
   */
  viextmetadatalanguage?: string;
  /**
   * If translations for extmetadata property are available, fetch all of them.
   */
  viextmetadatamultilang?: boolean;
  /**
   * If specified and non-empty, only these keys will be returned for viprop=extmetadata.
   */
  viextmetadatafilter?: OneOrMore<string>;
  /**
   * A handler specific parameter string. For example, PDFs might use `page15-100px`. viurlwidth must be used and be consistent with viurlparam.
   */
  viurlparam?: string;
  /**
   * If `badfilecontexttitleprop=badfile` is set, this is the page title used when evaluating the MediaWiki:Bad image list
   */
  vibadfilecontexttitle?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  vicontinue?: string;
  /**
   * Look only for files in the local repository.
   */
  vilocalonly?: boolean;
}
/**
 * Request parameters for the `prop=transcodestatus` query module provided by the extension.
 *
 * Get transcode status for a given file page.
 */
export interface ApiQueryTranscodestatusParams {}

declare module "../registry" {
  interface ActionParams {
    timedtext: ApiTimedtextParams;
    transcodereset: ApiTranscoderesetParams;
  }
  interface QueryPropParams {
    videoinfo: ApiQueryVideoinfoParams;
    transcodestatus: ApiQueryTranscodestatusParams;
  }
}
