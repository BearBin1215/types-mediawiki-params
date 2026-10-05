/**
 * Request parameters for the `login` action.
 *
 * Log in and get authentication cookies.
 * This action should only be used in combination with Special:BotPasswords; use for main-account login is deprecated and may fail without warning. To safely log in to the main account, use `action=clientlogin`.
 */
export interface ApiLoginParams {
  /**
   * Username.
   */
  lgname?: string;
  /**
   * Password.
   */
  lgpassword?: string;
  /**
   * Domain (optional).
   */
  lgdomain?: string;
  /**
   * A "login" token retrieved from action=query&meta=tokens
   */
  lgtoken?: string;
}

declare module "../registry" {
  interface ActionParams {
    login: ApiLoginParams;
  }
}
