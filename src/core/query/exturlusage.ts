import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=exturlusage` query module.
 *
 * Enumerate pages that contain a given URL.
 */
export interface ApiQueryExturlusageParams {
  /**
   * Which pieces of information to include
   */
  euprop?: OneOrMore<"ids" | "title" | "url">;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  eucontinue?: string;
  /**
   * Protocol of the URL. If empty and euquery is set, the protocol is `http` and `https`. Leave both this and euquery empty to list all external links.
   *
   * The "wikipedia" value is available since MediaWiki 1.45.
   */
  euprotocol?:
    | ""
    | "bitcoin"
    | "ftp"
    | "ftps"
    | "geo"
    | "git"
    | "gopher"
    | "http"
    | "https"
    | "irc"
    | "ircs"
    | "magnet"
    | "mailto"
    | "matrix"
    | "mms"
    | "news"
    | "nntp"
    | "redis"
    | "sftp"
    | "sip"
    | "sips"
    | "sms"
    | "ssh"
    | "svn"
    | "tel"
    | "telnet"
    | "urn"
    | "worldwind"
    | "xmpp"
    | "wikipedia";
  /**
   * Search string without protocol. See Special:LinkSearch. Leave empty to list all external links.
   */
  euquery?: string;
  /**
   * The page namespaces to enumerate.
   * Note: Due to miser mode, using this may result in fewer than eulimit results returned before continuing; in extreme cases, zero results may be returned.
   */
  eunamespace?: OneOrMore<number>;
  /**
   * How many pages to return.
   */
  eulimit?: ApiLimit;
  /**
   * @deprecated
   */
  euexpandurl?: boolean;
}

declare module "../../registry" {
  interface QueryListParams {
    exturlusage: ApiQueryExturlusageParams;
  }
  interface QueryGeneratorParams {
    exturlusage: ApiQueryExturlusageParams;
  }
}
