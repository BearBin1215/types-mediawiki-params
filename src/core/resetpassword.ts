/**
 * Request parameters for the `resetpassword` action.
 *
 * Send a password reset email to a user.
 */
export interface ApiResetpasswordParams {
  /**
   * User being reset.
   */
  user?: string;
  /**
   * Email address of the user being reset.
   */
  email?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   *
   * Required only when the wiki enables a password-reset route ($wgPasswordResetRoutes); without one the parameter does not exist.
   */
  token?: string;
}

declare module "../registry" {
  interface ActionParams {
    resetpassword: ApiResetpasswordParams;
  }
}
