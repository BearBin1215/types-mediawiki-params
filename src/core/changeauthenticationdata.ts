/**
 * Request parameters for the `changeauthenticationdata` action.
 *
 * Change authentication data for the current user.
 */
export interface ApiChangeauthenticationdataParams {
  /**
   * Use this authentication request, by the `id` returned from `action=query&meta=authmanagerinfo` with `amirequestsfor=change`.
   */
  changeauthrequest: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  changeauthtoken: string;
}

declare module "../registry" {
  interface ActionParams {
    changeauthenticationdata: ApiChangeauthenticationdataParams;
  }
}
