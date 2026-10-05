import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `meta=filerepoinfo` query module.
 *
 * Return meta information about image repositories configured on the wiki.
 */
export interface ApiQueryFilerepoinfoParams {
  /**
   * Which repository properties to get (properties available may vary on other wikis).
   */
  friprop?: OneOrMore<
    | "canUpload"
    | "displayname"
    | "favicon"
    | "initialCapital"
    | "local"
    | "name"
    | "rootUrl"
    | "scriptDirUrl"
    | "thumbUrl"
    | "url"
  >;
}

declare module "../../registry" {
  interface QueryMetaParams {
    filerepoinfo: ApiQueryFilerepoinfoParams;
  }
}
