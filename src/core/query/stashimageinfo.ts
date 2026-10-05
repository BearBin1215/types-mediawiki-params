import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=stashimageinfo` query module.
 *
 * Returns file information for stashed files.
 */
export interface ApiQueryStashimageinfoParams {
  /**
   * Key that identifies a previous upload that was stashed temporarily.
   */
  siifilekey?: OneOrMore<string>;
  /**
   * @deprecated
   */
  siisessionkey?: OneOrMore<string>;
  /**
   * Which file information to get
   */
  siiprop?: OneOrMore<
    | "badfile"
    | "bitdepth"
    | "canonicaltitle"
    | "commonmetadata"
    | "dimensions"
    | "extmetadata"
    | "metadata"
    | "mime"
    | "sha1"
    | "size"
    | "thumbmime"
    | "timestamp"
    | "url"
  >;
  /**
   * If siiprop=url is set, a URL to an image scaled to this width will be returned.
   * For performance reasons if this option is used, no more than 50 scaled images will be returned.
   */
  siiurlwidth?: number;
  /**
   * Similar to siiurlwidth.
   */
  siiurlheight?: number;
  /**
   * A handler specific parameter string. For example, PDFs might use `page15-100px`. siiurlwidth must be used and be consistent with siiurlparam.
   */
  siiurlparam?: string;
}

declare module "../../registry" {
  interface QueryPropParams {
    stashimageinfo: ApiQueryStashimageinfoParams;
  }
}
