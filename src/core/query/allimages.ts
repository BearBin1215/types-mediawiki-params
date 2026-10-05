import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=allimages` query module.
 *
 * Enumerate all images sequentially.
 */
export interface ApiQueryAllimagesParams {
  /**
   * Property to sort by.
   */
  aisort?: "name" | "timestamp";
  /**
   * The direction in which to list.
   */
  aidir?: "ascending" | "descending" | "newer" | "older";
  /**
   * The image title to start enumerating from. Can only be used with aisort=name.
   */
  aifrom?: string;
  /**
   * The image title to stop enumerating at. Can only be used with aisort=name.
   */
  aito?: string;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  aicontinue?: string;
  /**
   * The timestamp to start enumerating from. Can only be used with aisort=timestamp.
   */
  aistart?: string;
  /**
   * The timestamp to end enumerating. Can only be used with aisort=timestamp.
   */
  aiend?: string;
  /**
   * Which file information to get
   */
  aiprop?: OneOrMore<
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
    | "timestamp"
    | "url"
    | "user"
    | "userid"
  >;
  /**
   * Search for all image titles that begin with this value. Can only be used with aisort=name.
   */
  aiprefix?: string;
  /**
   * Limit to images with at least this many bytes.
   */
  aiminsize?: number;
  /**
   * Limit to images with at most this many bytes.
   */
  aimaxsize?: number;
  /**
   * SHA1 hash of image. Overrides aisha1base36.
   */
  aisha1?: string;
  /**
   * SHA1 hash of image in base 36 (used in MediaWiki).
   */
  aisha1base36?: string;
  /**
   * Only return files where the last version was uploaded by this user. Can only be used with aisort=timestamp. Cannot be used together with aifilterbots.
   */
  aiuser?: string;
  /**
   * How to filter files uploaded by bots. Can only be used with aisort=timestamp. Cannot be used together with aiuser.
   */
  aifilterbots?: "all" | "bots" | "nobots";
  /**
   * Disabled due to miser mode.
   */
  aimime?: OneOrMore<string>;
  /**
   * How many images in total to return.
   */
  ailimit?: ApiLimit;
}

declare module "../../registry" {
  interface QueryListParams {
    allimages: ApiQueryAllimagesParams;
  }
  interface QueryGeneratorParams {
    allimages: ApiQueryAllimagesParams;
  }
}
