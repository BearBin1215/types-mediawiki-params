/**
 * Request parameters for the `logout` action.
 *
 * Log out and clear session data.
 */
export interface ApiLogoutParams {
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * Log the user out from all their devices (rather than their current device only).
   *
   * @since MediaWiki 1.47
   */
  global?: boolean;
}

declare module "../registry" {
  interface ActionParams {
    logout: ApiLogoutParams;
  }
}
