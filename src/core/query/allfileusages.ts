import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=allfileusages` query module.
 *
 * List all file usages, including non-existing.
 */
export interface ApiQueryAllfileusagesParams {
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  afcontinue?: string;
  /**
   * The title of the file to start enumerating from.
   */
  affrom?: string;
  /**
   * The title of the file to stop enumerating at.
   */
  afto?: string;
  /**
   * Search for all file titles that begin with this value.
   */
  afprefix?: string;
  /**
   * Only show distinct file titles. Cannot be used with afprop=ids.
   * When used as a generator, yields target pages instead of source pages.
   */
  afunique?: boolean;
  /**
   * Which pieces of information to include
   */
  afprop?: OneOrMore<"ids" | "title">;
  /**
   * How many total items to return.
   */
  aflimit?: ApiLimit;
  /**
   * The direction in which to list.
   */
  afdir?: "ascending" | "descending";
}

declare module "../../registry" {
  interface QueryListParams {
    allfileusages: ApiQueryAllfileusagesParams;
  }
  interface QueryGeneratorParams {
    allfileusages: ApiQueryAllfileusagesParams;
  }
}
