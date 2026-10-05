import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `prop=info` query module.
 *
 * Get basic page information.
 */
export interface ApiQueryInfoParams {
  /**
   * Which additional properties to get
   *
   * The "editintro", "preloadcontent" values are available since MediaWiki 1.41.
   * The "watchlistlabels" value is available since MediaWiki 1.46.
   */
  inprop?: OneOrMore<
    | "associatedpage"
    | "displaytitle"
    | "linkclasses"
    | "notificationtimestamp"
    | "preload"
    | "protection"
    | "subjectid"
    | "talkid"
    | "url"
    | "varianttitles"
    | "visitingwatchers"
    | "watched"
    | "watchers"
    | "readable"
    | "editintro"
    | "preloadcontent"
    | "watchlistlabels"
  >;
  /**
   * The context title to use when determining extra CSS classes (e.g. link colors) when inprop contains linkclasses.
   */
  inlinkcontext?: string;
  /**
   * Test whether the current user can perform certain actions on the page.
   */
  intestactions?: OneOrMore<string>;
  /**
   * Detail level for intestactions. Use the main module's errorformat and errorlang parameters to control the format of the messages returned.
   */
  intestactionsdetail?: "boolean" | "full" | "quick";
  /**
   * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   */
  incontinue?: string;
  /**
   * Test whether performing intestactions would automatically create a temporary account.
   *
   * @since MediaWiki 1.41
   */
  intestactionsautocreate?: boolean;
  /**
   * Title of a custom page to use as preloaded content.
   *
   * @since MediaWiki 1.41
   */
  inpreloadcustom?: string;
  /**
   * Parameters for the custom page being used as preloaded content.
   *
   * @since MediaWiki 1.41
   */
  inpreloadparams?: OneOrMore<string>;
  /**
   * Return preloaded content for a new section on the page, rather than a new page.
   *
   * @since MediaWiki 1.41
   */
  inpreloadnewsection?: boolean;
  /**
   * Some intro messages come with optional wrapper frames. Use `moreframes` to include them or `lessframes` to omit them.
   *
   * @since MediaWiki 1.41
   */
  ineditintrostyle?: "lessframes" | "moreframes";
  /**
   * List of intro messages to remove from the response. Use this if a specific message is not relevant to your tool, or if the information is conveyed in a different way.
   *
   * @since MediaWiki 1.41
   */
  ineditintroskip?: OneOrMore<string>;
  /**
   * Title of a custom page to use as an additional intro message.
   *
   * @since MediaWiki 1.41
   */
  ineditintrocustom?: string;
  /**
   * Whether to consider the links as having a default caption (caption is a suffix of link target and preceded by slash, colon or start-of-string). It can have impact on the returned link classes.
   *
   * @since MediaWiki 1.46
   */
  indefaultlinkcaption?: boolean;
}

declare module "../../registry" {
  interface QueryPropParams {
    info: ApiQueryInfoParams;
  }
}
