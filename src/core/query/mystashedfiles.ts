import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=mystashedfiles` query module.
 *
 * Get a list of files in the current user's upload stash.
 */
export interface ApiQueryMystashedfilesParams {
  /**
   * Which properties to fetch for the files.
   */
  msfprop?: OneOrMore<"size" | "type">;
  /**
   * How many files to get.
   */
  msflimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  msfcontinue?: string;
}

declare module "../../registry" {
  interface QueryListParams {
    mystashedfiles: ApiQueryMystashedfilesParams;
  }
}
