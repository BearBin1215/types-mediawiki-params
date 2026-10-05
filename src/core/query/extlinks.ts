import type { ApiLimit } from "../../common";

/**
 * Request parameters for the `prop=extlinks` query module.
 *
 * Returns all external URLs (not interwikis) from the given pages.
 */
export interface ApiQueryExtlinksParams {
  /**
   * How many links to return.
   */
  ellimit?: ApiLimit;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  elcontinue?: string;
  /**
   * Protocol of the URL. If empty and elquery is set, the protocol is `http` and `https`. Leave both this and elquery empty to list all external links.
   *
   * The "wikipedia" value is available since MediaWiki 1.45.
   */
  elprotocol?:
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
   * Search string without protocol. Useful for checking whether a certain page contains a certain external url.
   */
  elquery?: string;
  /**
   * @deprecated
   */
  elexpandurl?: boolean;
}

declare module "../../registry" {
  interface QueryPropParams {
    extlinks: ApiQueryExtlinksParams;
  }
}
