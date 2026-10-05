/**
 * Opt-in extension pack: **FlaggedRevs** (`action=review`, `action=flagconfig`, `action=stabilize`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/flaggedrevs";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:FlaggedRevs
 */

/**
 * Request parameters for the `review` action provided by the extension.
 *
 * Review a revision by approving or de-approving it.
 */
export interface ApiReviewParams {
  /**
   * The revision ID for which to set the flags.
   */
  revid?: string;
  /**
   * Comment for the review.
   */
  comment?: string;
  /**
   * If set, revision will be unapproved rather than approved.
   */
  unapprove?: boolean;
  /**
   * Set the flag accuracy to the specified value.
   *
   * The tag name and its level count are configured per wiki through $wgFlaggedRevsTags; accepted values are the integers 0…maxLevel as configured.
   */
  flag_accuracy?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `flagconfig` action provided by the extension.
 *
 * Get basic information about review flag configuration for this site.
 * The following parameters are returned for each tag:
 * name
 * The key name of this tag.
 * levels
 * Number of levels the tag has (above "not tagged").
 * Flagged revisions have an assigned level for each tag. The highest tier that all the tags meet is the review tier of the entire revision.
 */
export interface ApiFlagconfigParams {}
/**
 * Request parameters for the `stabilize` action provided by the extension.
 *
 * Change page stability settings.
 *
 * Which parameter set serves this action depends on $wgFlaggedRevsProtection: the default (general) mode declared here, or the protection mode (`protectlevel` instead of `default`/`autoreview`).
 */
export interface ApiStabilizeParams {
  /**
   * Default revision to show.
   */
  default: "latest" | "stable";
  /**
   * Auto-review restriction.
   *
   * Levels come from $wgFlaggedRevsRestrictionLevels plus `none`.
   */
  autoreview?: string;
  /**
   * Expiry for these settings.
   */
  expiry?: string;
  /**
   * Reason.
   */
  reason?: string;
  /**
   * Review this page.
   */
  review?: boolean;
  /**
   * Title of the page to be stabilized.
   */
  title: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    review: ApiReviewParams;
    flagconfig: ApiFlagconfigParams;
    stabilize: ApiStabilizeParams;
  }
}
