/**
 * Request parameters for the `acquiretempusername` action.
 *
 * Acquire a temporary user username and stash it in the current session, if temp account creation is enabled and the current user is logged out. If a name has already been stashed, returns the same name.
 * If the user later performs an action that results in temp account creation, the stashed username will be used for their account. It may also be used in previews. However, the account is not created yet, and the name is not visible to other users.
 *
 * @since MediaWiki 1.41
 */
export interface ApiAcquiretempusernameParams {}

declare module "../registry" {
  interface ActionParams {
    acquiretempusername: ApiAcquiretempusernameParams;
  }
}
