import type { OneOrMore } from "../common";

/**
 * Request parameters for the `clientlogin` action.
 *
 * Log in to the wiki using the interactive flow.
 * The general procedure to use this module is:
 * Fetch the fields available from `action=query&meta=authmanagerinfo` with `amirequestsfor=login`, and a `login` token from `action=query&meta=tokens`.
 * Present the fields to the user, and obtain their submission.
 * Post to this module, supplying loginreturnurl and any relevant fields.
 * Check the `status` in the response.
 * If you received `PASS` or `FAIL`, you're done. The operation either succeeded or it didn't.
 * If you received `UI`, present the new fields to the user and obtain their submission. Then post to this module with logincontinue and the relevant fields set, and repeat step 4.
 * If you received `REDIRECT`, direct the user to the `redirecttarget` and wait for the return to loginreturnurl. Then post to this module with logincontinue and any fields passed to the return URL, and repeat step 4.
 * If you received `RESTART`, that means the authentication worked but we don't have a linked user account. You might treat this as `UI` or as `FAIL`.
 */
export interface ApiClientloginParams {
  /**
   * Only use these authentication requests, by the `id` returned from `action=query&meta=authmanagerinfo` with `amirequestsfor=login` or from a previous response from this module.
   */
  loginrequests?: OneOrMore<string>;
  /**
   * Format to use for returning messages.
   */
  loginmessageformat?: "html" | "none" | "raw" | "wikitext";
  /**
   * Merge field information for all authentication requests into one array.
   */
  loginmergerequestfields?: boolean;
  /**
   * Preserve state from a previous failed login attempt, if possible.
   */
  loginpreservestate?: boolean;
  /**
   * Return URL for third-party authentication flows, must be absolute. Either this or logincontinue is required.
   * Upon receiving a `REDIRECT` response, you will typically open a browser or web view to the specified `redirecttarget` URL for a third-party authentication flow. When that completes, the third party will send the browser or web view to this URL. You should extract any query or POST parameters from the URL and pass them as a logincontinue request to this API module.
   */
  loginreturnurl?: string;
  /**
   * This request is a continuation after an earlier `UI` or `REDIRECT` response. Either this or loginreturnurl is required.
   */
  logincontinue?: boolean;
  /**
   * A "login" token retrieved from action=query&meta=tokens
   */
  logintoken: string;
  /**
   * Instead of logging in, reauthenticate for getting temporary access to a security-sensitive operation. This must be done when already logged in, using the fields suplied by `action=query&meta=authmanagerinfo` when called with the amireauthenticate parameter. The value of the parameter should be the same as that of amireauthenticate.
   *
   * @since MediaWiki 1.47
   */
  loginreauthenticate?: string;
}

declare module "../registry" {
  interface ActionParams {
    clientlogin: ApiClientloginParams;
  }
}
