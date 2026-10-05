import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `meta=siteinfo` query module.
 *
 * Return general information about the site.
 */
export interface ApiQuerySiteinfoParams {
  /**
   * Which information to get
   *
   * The "autocreatetempuser" value is available since MediaWiki 1.41.
   * The "autopromote", "autopromoteonce", "clientlibraries" values are available since MediaWiki 1.42.
   * The "copyuploaddomains" value is available since MediaWiki 1.45.
   * The "doubleunderscores", "sbom" values are available since MediaWiki 1.46.
   * The "crosssiteajaxdomains" value is available since MediaWiki 1.47.
   */
  siprop?: OneOrMore<
    | "dbrepllag"
    | "defaultoptions"
    | "extensions"
    | "extensiontags"
    | "fileextensions"
    | "functionhooks"
    | "general"
    | "interwikimap"
    | "languages"
    | "languagevariants"
    | "libraries"
    | "magicwords"
    | "namespacealiases"
    | "namespaces"
    | "protocols"
    | "restrictions"
    | "rightsinfo"
    | "showhooks"
    | "skins"
    | "specialpagealiases"
    | "statistics"
    | "uploaddialog"
    | "usergroups"
    | "variables"
    | "autocreatetempuser"
    | "autopromote"
    | "autopromoteonce"
    | "clientlibraries"
    | "copyuploaddomains"
    | "doubleunderscores"
    | "sbom"
    | "crosssiteajaxdomains"
  >;
  /**
   * Return only local or only nonlocal entries of the interwiki map.
   */
  sifilteriw?: "!local" | "local";
  /**
   * List all database servers, not just the one lagging the most.
   */
  sishowalldb?: boolean;
  /**
   * Lists the number of users in user groups.
   */
  sinumberingroup?: boolean;
  /**
   * Language code for localised language names (best effort) and skin names.
   */
  siinlanguagecode?: string;
}

declare module "../../registry" {
  interface QueryMetaParams {
    siteinfo: ApiQuerySiteinfoParams;
  }
}
