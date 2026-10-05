import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=images` query module.
 *
 * Returns all files contained on the given pages.
 */
export interface ApiQueryImagesParams {
  /**
   * How many files to return.
   */
  imlimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  imcontinue?: string;
  /**
   * Only list these files. Useful for checking whether a certain page has a certain file.
   */
  imimages?: OneOrMore<string>;
  /**
   * The direction in which to list.
   */
  imdir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryPropParams {
    images: ApiQueryImagesParams;
  }
  interface QueryGeneratorParams {
    images: ApiQueryImagesParams;
  }
}
