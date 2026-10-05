/**
 * Request parameters for the `emailuser` action.
 *
 * Email a user.
 */
export interface ApiEmailuserParams {
  /**
   * User to send the email to.
   */
  target: string;
  /**
   * Subject header.
   */
  subject: string;
  /**
   * Email body.
   */
  text: string;
  /**
   * Send a copy of this mail to me.
   */
  ccme?: boolean;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    emailuser: ApiEmailuserParams;
  }
}
