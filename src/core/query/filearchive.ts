import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=filearchive` query module.
 *
 * Enumerate all deleted files sequentially.
 */
export interface ApiQueryFilearchiveParams {
  /**
   * The image title to start enumerating from.
   */
  fafrom?: string;
  /**
   * The image title to stop enumerating at.
   */
  fato?: string;
  /**
   * Search for all image titles that begin with this value.
   */
  faprefix?: string;
  /**
   * The direction in which to list.
   */
  fadir?: "ascending" | "descending";
  /**
   * SHA1 hash of image. Overrides fasha1base36.
   */
  fasha1?: string;
  /**
   * SHA1 hash of image in base 36 (used in MediaWiki).
   */
  fasha1base36?: string;
  /**
   * Which image information to get
   */
  faprop?: OneOrMore<
    | "archivename"
    | "bitdepth"
    | "description"
    | "dimensions"
    | "mediatype"
    | "metadata"
    | "mime"
    | "parseddescription"
    | "sha1"
    | "size"
    | "timestamp"
    | "user"
  >;
  /**
   * How many images to return in total.
   */
  falimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  facontinue?: string;
}

declare module "../../registry" {
  interface QueryListParams {
    filearchive: ApiQueryFilearchiveParams;
  }
}
