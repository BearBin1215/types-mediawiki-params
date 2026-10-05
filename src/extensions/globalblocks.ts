/**
 * Opt-in extension pack: **GlobalBlocking** (`action=globalblock`, `list=globalblocks`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/globalblocks";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:GlobalBlocking
 */

import type { ApiLimit, OneOrMore } from "../common";

/**
 * Request parameters for the `globalblock` action provided by the extension.
 *
 * Globally block or unblock a user.
 */
export interface ApiGlobalblockParams {
  /**
   * ID of the global block to modify or unblock (obtained through `list=globalblocks`). Cannot be used together with target.
   */
  id?: number;
  /**
   * The target IP address or username. Cannot be used together with id.
   */
  target?: string;
  /**
   * If specified, will block or reblock the user. Determines how long the block will last for, e.g. "5 months" or "2 weeks". If set to "infinite" or "indefinite" the block will never expire.
   */
  expiry?: string;
  /**
   * If specified, will unblock the user.
   */
  unblock?: boolean;
  /**
   * The reason for blocking/unblocking.
   */
  reason: string;
  /**
   * Specify this if the block should only affect logged-out users globally.
   */
  anononly?: boolean;
  /**
   * Specify this if the global block should not prevent account creation.
   */
  "allow-account-creation"?: boolean;
  /**
   * Specify this if the global block should trigger global autoblocks.
   */
  "enable-autoblock"?: boolean;
  /**
   * Specify this if the existing block on the target should be modified
   */
  modify?: boolean;
  /**
   * Block the user locally as well. Cannot be used together with id.
   */
  alsolocal?: boolean;
  /**
   * Revoke talk page access locally. Cannot be used together with id.
   */
  localblockstalk?: boolean;
  /**
   * Revoke email access locally. Cannot be used together with id.
   */
  localblocksemail?: boolean;
  /**
   * Specify this if the block should only affect logged-out users locally. Cannot be used together with id.
   */
  localanononly?: boolean;
  /**
   * Specify this if the local block should not prevent account creation. Cannot be used together with id.
   */
  "local-allow-account-creation"?: boolean;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `list=globalblocks` query module provided by the extension.
 *
 * List all globally blocked IP addresses.
 */
export interface ApiQueryGlobalblocksParams {
  /**
   * The timestamp to start enumerating from.
   */
  bgstart?: string;
  /**
   * The timestamp to stop enumerating at.
   */
  bgend?: string;
  /**
   * In which direction to enumerate
   */
  bgdir?: "newer" | "older";
  /**
   * Pipe-separated list of block IDs to list.
   */
  bgids?: OneOrMore<number>;
  /**
   * @deprecated
   */
  bgaddresses?: OneOrMore<string>;
  /**
   * Pipe-separated list of usernames, IP addresses, or IP ranges to search for. To search for IP blocks inside a given range, use bgip instead.
   */
  bgtargets?: OneOrMore<string>;
  /**
   * Get all blocks applying to this IP address or CIDR range, including range blocks. Cannot be used together with bgaddresses or bgtargets. CIDR ranges broader than /16 are not accepted.
   */
  bgip?: string;
  /**
   * The maximum amount of blocks to list.
   */
  bglimit?: ApiLimit;
  /**
   * Which properties to get.
   *
   * The "address" value is deprecated.
   */
  bgprop?: OneOrMore<
    "by" | "expiry" | "id" | "range" | "reason" | "target" | "timestamp" | "address"
  >;
}

declare module "../registry" {
  interface ActionParams {
    globalblock: ApiGlobalblockParams;
  }
  interface QueryListParams {
    globalblocks: ApiQueryGlobalblocksParams;
  }
}
