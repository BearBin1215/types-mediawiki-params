import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `meta=tokens` query module.
 *
 * Gets tokens for data-modifying actions.
 */
export interface ApiQueryTokensParams {
  /**
   * Types of token to request.
   *
   * Open union: token types come from core plus the ApiQueryTokensRegisterTypes hook.
   */
  type?: OneOrMore<
    | "createaccount"
    | "csrf"
    | "login"
    | "patrol"
    | "rollback"
    | "userrights"
    | "watch"
    | (string & {})
  >;
}

declare module "../../registry" {
  interface QueryMetaParams {
    tokens: ApiQueryTokensParams;
  }
}
