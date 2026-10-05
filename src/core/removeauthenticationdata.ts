/**
 * Request parameters for the `removeauthenticationdata` action.
 *
 * Remove authentication data for the current user.
 */
export interface ApiRemoveauthenticationdataParams {
  /**
   * Use this authentication request, by the `id` returned from `action=query&meta=authmanagerinfo` with `amirequestsfor=remove`.
   */
  request: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    removeauthenticationdata: ApiRemoveauthenticationdataParams;
  }
}
