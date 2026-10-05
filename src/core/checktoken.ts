/**
 * Request parameters for the `checktoken` action.
 *
 * Check the validity of a token from `action=query&meta=tokens`.
 */
export interface ApiChecktokenParams {
  /**
   * Type of token being tested.
   *
   * Open union: token types come from core plus the ApiQueryTokensRegisterTypes hook.
   */
  type:
    | "createaccount"
    | "csrf"
    | "login"
    | "patrol"
    | "rollback"
    | "userrights"
    | "watch"
    | (string & {});
  /**
   * Token to test.
   */
  token: string;
  /**
   * Maximum allowed age of the token, in seconds.
   */
  maxtokenage?: number;
}

declare module "../registry" {
  interface ActionParams {
    checktoken: ApiChecktokenParams;
  }
}
