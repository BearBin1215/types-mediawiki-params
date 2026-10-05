import type { OneOrMore } from "../common";

/**
 * Request parameters for the `createaccount` action.
 *
 * Create a new user account.
 * The general procedure to use this module is:
 * Fetch the fields available from `action=query&meta=authmanagerinfo` with `amirequestsfor=create`, and a `createaccount` token from `action=query&meta=tokens`.
 * Present the fields to the user, and obtain their submission.
 * Post to this module, supplying createreturnurl and any relevant fields.
 * Check the `status` in the response.
 * If you received `PASS` or `FAIL`, you're done. The operation either succeeded or it didn't.
 * If you received `UI`, present the new fields to the user and obtain their submission. Then post to this module with createcontinue and the relevant fields set, and repeat step 4.
 * If you received `REDIRECT`, direct the user to the `redirecttarget` and wait for the return to createreturnurl. Then post to this module with createcontinue and any fields passed to the return URL, and repeat step 4.
 * If you received `RESTART`, that means the authentication worked but we don't have a linked user account. You might treat this as `UI` or as `FAIL`.
 */
export interface ApiCreateaccountParams {
  /**
   * Only use these authentication requests, by the `id` returned from `action=query&meta=authmanagerinfo` with `amirequestsfor=create` or from a previous response from this module.
   */
  createrequests?: OneOrMore<string>;
  /**
   * Format to use for returning messages.
   */
  createmessageformat?: "html" | "none" | "raw" | "wikitext";
  /**
   * Merge field information for all authentication requests into one array.
   */
  createmergerequestfields?: boolean;
  /**
   * Preserve state from a previous failed login attempt, if possible.
   * If `action=query&meta=authmanagerinfo` returned true for `hasprimarypreservedstate`, requests marked as `primary-required` should be omitted. If it returned a non-empty value for `preservedusername`, that username must be used for the username parameter.
   */
  createpreservestate?: boolean;
  /**
   * Return URL for third-party authentication flows, must be absolute. Either this or createcontinue is required.
   * Upon receiving a `REDIRECT` response, you will typically open a browser or web view to the specified `redirecttarget` URL for a third-party authentication flow. When that completes, the third party will send the browser or web view to this URL. You should extract any query or POST parameters from the URL and pass them as a createcontinue request to this API module.
   */
  createreturnurl?: string;
  /**
   * This request is a continuation after an earlier `UI` or `REDIRECT` response. Either this or createreturnurl is required.
   */
  createcontinue?: boolean;
  /**
   * A "createaccount" token retrieved from action=query&meta=tokens
   */
  createtoken: string;
}

declare module "../registry" {
  interface ActionParams {
    createaccount: ApiCreateaccountParams;
  }
}
