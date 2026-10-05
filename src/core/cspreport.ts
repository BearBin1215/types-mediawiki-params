/**
 * Request parameters for the `cspreport` action.
 *
 * Used by browsers to report violations of the Content Security Policy. This module should never be used, except when used automatically by a CSP compliant web browser.
 */
export interface ApiCspreportParams {
  /**
   * Mark as being a report from a monitoring policy, not an enforced policy
   */
  reportonly?: boolean;
  /**
   * What generated the CSP header that triggered this report
   */
  source?: string;
}

declare module "../registry" {
  interface ActionParams {
    cspreport: ApiCspreportParams;
  }
}
