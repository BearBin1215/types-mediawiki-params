import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=imageinfo` query module.
 *
 * Returns file information and upload history.
 */
export interface ApiQueryImageinfoParams {
  /**
   * Which file information to get
   */
  iiprop?: OneOrMore<
    | "archivename"
    | "badfile"
    | "bitdepth"
    | "canonicaltitle"
    | "comment"
    | "commonmetadata"
    | "dimensions"
    | "extmetadata"
    | "mediatype"
    | "metadata"
    | "mime"
    | "parsedcomment"
    | "sha1"
    | "size"
    | "thumbmime"
    | "timestamp"
    | "uploadwarning"
    | "url"
    | "user"
    | "userid"
  >;
  /**
   * How many file revisions to return per file.
   */
  iilimit?: ApiLimit;
  /**
   * Timestamp to start listing from.
   */
  iistart?: string;
  /**
   * Timestamp to stop listing at.
   */
  iiend?: string;
  /**
   * If iiprop=url is set, a URL to an image scaled to this width will be returned.
   * For performance reasons if this option is used, no more than 50 scaled images will be returned.
   */
  iiurlwidth?: number;
  /**
   * Similar to iiurlwidth.
   */
  iiurlheight?: number;
  /**
   * Version of metadata to use. If `latest` is specified, use latest version. Defaults to `1` for backwards compatibility.
   */
  iimetadataversion?: string;
  /**
   * What language to fetch extmetadata in. This affects both which translation to fetch, if multiple are available, as well as how things like numbers and various values are formatted.
   */
  iiextmetadatalanguage?: string;
  /**
   * If translations for extmetadata property are available, fetch all of them.
   */
  iiextmetadatamultilang?: boolean;
  /**
   * If specified and non-empty, only these keys will be returned for iiprop=extmetadata.
   */
  iiextmetadatafilter?: OneOrMore<string>;
  /**
   * A handler specific parameter string. For example, PDFs might use `page15-100px`. iiurlwidth must be used and be consistent with iiurlparam.
   */
  iiurlparam?: string;
  /**
   * If `badfilecontexttitleprop=badfile` is set, this is the page title used when evaluating the MediaWiki:Bad image list
   */
  iibadfilecontexttitle?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  iicontinue?: string;
  /**
   * Look only for files in the local repository.
   */
  iilocalonly?: boolean;
}

declare module "../../registry" {
  interface QueryPropParams {
    imageinfo: ApiQueryImageinfoParams;
  }
}
