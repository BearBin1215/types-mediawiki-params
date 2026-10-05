/**
 * Request parameters for the `clearhasmsg` action.
 *
 * Clears the `hasmsg` flag for the current user.
 */
export interface ApiClearhasmsgParams {}

declare module "../registry" {
  interface ActionParams {
    clearhasmsg: ApiClearhasmsgParams;
  }
}
