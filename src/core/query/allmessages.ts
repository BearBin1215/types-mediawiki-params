import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `meta=allmessages` query module.
 *
 * Return messages from this site.
 */
export interface ApiQueryAllmessagesParams {
  /**
   * Which messages to output. `*` (default) means all messages.
   */
  ammessages?: OneOrMore<string>;
  /**
   * Which properties to get.
   */
  amprop?: OneOrMore<"default">;
  /**
   * Set to enable parser, will preprocess the wikitext of message (substitute magic words, handle templates, etc.).
   */
  amenableparser?: boolean;
  /**
   * If set, do not include the content of the messages in the output.
   */
  amnocontent?: boolean;
  /**
   * Also include local messages, i.e. messages that don't exist in the software but do exist as in the MediaWiki namespace.
   * This lists all MediaWiki-namespace pages, so it will also list those that aren't really messages such as Common.js.
   */
  amincludelocal?: boolean;
  /**
   * Arguments to be substituted into message.
   */
  amargs?: OneOrMore<string>;
  /**
   * Return only messages with names that contain this string.
   */
  amfilter?: string;
  /**
   * Return only messages in this customisation state.
   */
  amcustomised?: "all" | "modified" | "unmodified";
  /**
   * Return messages in this language.
   */
  amlang?: string;
  /**
   * Return messages starting at this message.
   */
  amfrom?: string;
  /**
   * Return messages ending at this message.
   */
  amto?: string;
  /**
   * Page name to use as context when parsing message (for amenableparser option).
   */
  amtitle?: string;
  /**
   * Return messages with this prefix.
   */
  amprefix?: string;
}

declare module "../../registry" {
  interface QueryMetaParams {
    allmessages: ApiQueryAllmessagesParams;
  }
}
