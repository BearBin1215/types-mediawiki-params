import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=tags` query module.
 *
 * List change tags.
 */
export interface ApiQueryTagsParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  tgcontinue?: string;
  /**
   * The maximum number of tags to list.
   */
  tglimit?: ApiLimit;
  /**
   * Which properties to get
   */
  tgprop?: OneOrMore<"active" | "defined" | "description" | "displayname" | "hitcount" | "source">;
}

declare module "../../registry" {
  interface QueryListParams {
    tags: ApiQueryTagsParams;
  }
}
