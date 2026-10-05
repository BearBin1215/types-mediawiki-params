/**
 * Request parameters for the `validatepassword` action.
 *
 * Validate a password against the wiki's password policies.
 * Validity is reported as `Good` if the password is acceptable, `Change` if the password may be used for login but must be changed, or `Invalid` if the password is not usable.
 */
export interface ApiValidatepasswordParams {
  /**
   * Password to validate.
   */
  password: string;
  /**
   * Username, for use when testing account creation. The named user must not exist.
   */
  user?: string;
  /**
   * Email address, for use when testing account creation.
   */
  email?: string;
  /**
   * Real name, for use when testing account creation.
   */
  realname?: string;
}

declare module "../registry" {
  interface ActionParams {
    validatepassword: ApiValidatepasswordParams;
  }
}
