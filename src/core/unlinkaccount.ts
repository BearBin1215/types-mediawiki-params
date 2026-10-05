/**
 * Request parameters for the `unlinkaccount` action.
 *
 * Remove a linked third-party account from the current user.
 */
export interface ApiUnlinkaccountParams {
  /**
   * Use this authentication request, by the `id` returned from `action=query&meta=authmanagerinfo` with `amirequestsfor=unlink`.
   */
  request: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    unlinkaccount: ApiUnlinkaccountParams;
  }
}
