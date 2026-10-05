import type { ApiLimit, OneOrMore } from "../../common";

/**
 * Request parameters for the `list=blocks` query module.
 *
 * List all blocked users and IP addresses.
 */
export interface ApiQueryBlocksParams {
  /**
   * The timestamp to start enumerating from.
   */
  bkstart?: string;
  /**
   * The timestamp to stop enumerating at.
   */
  bkend?: string;
  /**
   * In which direction to enumerate
   */
  bkdir?: "newer" | "older";
  /**
   * List of block IDs to list (optional).
   */
  bkids?: OneOrMore<number>;
  /**
   * List of users to search for (optional).
   */
  bkusers?: OneOrMore<string>;
  /**
   * Get all blocks applying to this IP address or CIDR range, including range blocks.
   * Cannot be used together with bkusers. CIDR ranges broader than IPv4/16 or IPv6/19 are not accepted.
   */
  bkip?: string;
  /**
   * The maximum number of blocks to list.
   */
  bklimit?: ApiLimit;
  /**
   * Which properties to get
   *
   * The "parsedreason" value is available since MediaWiki 1.44.
   */
  bkprop?: OneOrMore<
    | "by"
    | "byid"
    | "expiry"
    | "flags"
    | "id"
    | "range"
    | "reason"
    | "restrictions"
    | "timestamp"
    | "user"
    | "userid"
    | "parsedreason"
  >;
  /**
   * Show only items that meet these criteria.
   * For example, to see only indefinite blocks on IP addresses, set `bkshow=ip|!temp`.
   */
  bkshow?: OneOrMore<"!account" | "!ip" | "!range" | "!temp" | "account" | "ip" | "range" | "temp">;
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  bkcontinue?: string;
}

declare module "../../registry" {
  interface QueryListParams {
    blocks: ApiQueryBlocksParams;
  }
}
