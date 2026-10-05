/**
 * Request parameters for the `meta=authmanagerinfo` query module.
 *
 * Retrieve information about the current authentication status.
 */
export interface ApiQueryAuthmanagerinfoParams {
  /**
   * Test whether the user's current authentication status is sufficient for the specified security-sensitive operation.
   */
  amisecuritysensitiveoperation?: string;
  /**
   * Fetch information about the authentication requests needed for the specified authentication action.
   */
  amirequestsfor?:
    | "change"
    | "create"
    | "create-continue"
    | "link"
    | "link-continue"
    | "login"
    | "login-continue"
    | "remove"
    | "unlink";
  /**
   * Merge field information for all authentication requests into one array.
   */
  amimergerequestfields?: boolean;
  /**
   * Format to use for returning messages.
   */
  amimessageformat?: "html" | "none" | "raw" | "wikitext";
  /**
   * Add requests needed to reauthenticate for a security-sensitive operation. Must be used with `amirequestsfor=login` and while in a logged-in session. The value of the parameter is the operation name, which can be found in the `reauthenticate` error returned when trying the operation that needs reauthentication.
   *
   * @since MediaWiki 1.47
   */
  amireauthenticate?: string;
}

declare module "../../registry" {
  interface QueryMetaParams {
    authmanagerinfo: ApiQueryAuthmanagerinfoParams;
  }
}
