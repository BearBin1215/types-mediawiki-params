import type { OneOrMore } from "../common";

/**
 * Request parameters for the `linkaccount` action.
 *
 * Link an account from a third-party provider to the current user.
 * The general procedure to use this module is:
 * Fetch the fields available from `action=query&meta=authmanagerinfo` with `amirequestsfor=link`, and a `csrf` token from `action=query&meta=tokens`.
 * Present the fields to the user, and obtain their submission.
 * Post to this module, supplying linkreturnurl and any relevant fields.
 * Check the `status` in the response.
 * If you received `PASS` or `FAIL`, you're done. The operation either succeeded or it didn't.
 * If you received `UI`, present the new fields to the user and obtain their submission. Then post to this module with linkcontinue and the relevant fields set, and repeat step 4.
 * If you received `REDIRECT`, direct the user to the `redirecttarget` and wait for the return to linkreturnurl. Then post to this module with linkcontinue and any fields passed to the return URL, and repeat step 4.
 * If you received `RESTART`, that means the authentication worked but we don't have a linked user account. You might treat this as `UI` or as `FAIL`.
 */
export interface ApiLinkaccountParams {
  /**
   * Only use these authentication requests, by the `id` returned from `action=query&meta=authmanagerinfo` with `amirequestsfor=link` or from a previous response from this module.
   */
  linkrequests?: OneOrMore<string>;
  /**
   * Format to use for returning messages.
   */
  linkmessageformat?: "html" | "none" | "raw" | "wikitext";
  /**
   * Merge field information for all authentication requests into one array.
   */
  linkmergerequestfields?: boolean;
  /**
   * Return URL for third-party authentication flows, must be absolute. Either this or linkcontinue is required.
   * Upon receiving a `REDIRECT` response, you will typically open a browser or web view to the specified `redirecttarget` URL for a third-party authentication flow. When that completes, the third party will send the browser or web view to this URL. You should extract any query or POST parameters from the URL and pass them as a linkcontinue request to this API module.
   */
  linkreturnurl?: string;
  /**
   * This request is a continuation after an earlier `UI` or `REDIRECT` response. Either this or linkreturnurl is required.
   */
  linkcontinue?: boolean;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  linktoken: string;
}

declare module "../registry" {
  interface ActionParams {
    linkaccount: ApiLinkaccountParams;
  }
}
