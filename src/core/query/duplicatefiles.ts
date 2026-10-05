import type { ApiLimit } from "../../common";

/**
 * Request parameters for the `prop=duplicatefiles` query module.
 *
 * List all files that are duplicates of the given files based on hash values.
 */
export interface ApiQueryDuplicatefilesParams {
  /**
   * How many duplicate files to return.
   */
  dflimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  dfcontinue?: string;
  /**
   * The direction in which to list.
   */
  dfdir?: "ascending" | "descending";
  /**
   * Look only for files in the local repository.
   */
  dflocalonly?: boolean;
}

declare module "../../registry" {
  interface QueryPropParams {
    duplicatefiles: ApiQueryDuplicatefilesParams;
  }
  interface QueryGeneratorParams {
    duplicatefiles: ApiQueryDuplicatefilesParams;
  }
}
