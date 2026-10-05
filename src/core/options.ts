import type { OneOrMore } from "../common";

/**
 * Request parameters for the `options` action.
 *
 * Change preferences of the current user.
 * Only options which are registered in core or in one of installed extensions, or options with keys prefixed with `userjs-` (intended to be used by user scripts), can be set.
 */
export interface ApiOptionsParams {
  /**
   * Resets preferences to the site defaults.
   */
  reset?: boolean;
  /**
   * List of types of options to reset when the reset option is set.
   */
  resetkinds?: OneOrMore<
    | "all"
    | "registered"
    | "registered-checkmatrix"
    | "registered-multiselect"
    | "special"
    | "unused"
    | "userjs"
  >;
  /**
   * List of changes, formatted name=value (e.g. skin=vector). If no value is given (not even an equals sign), e.g., optionname|otheroption|..., the option will be reset to its default value. If any value passed contains the pipe character (`|`), use the alternative multiple-value separator for correct operation.
   */
  change?: OneOrMore<string>;
  /**
   * The name of the option that should be set to the value given by optionvalue.
   */
  optionname?: string;
  /**
   * The value for the option specified by optionname. When optionname is set but optionvalue is omitted, the option will be reset to its default value.
   */
  optionvalue?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
  /**
   * What to do if the option was set globally using the GlobalPreferences extension.
   * `ignore`: Do nothing. The option remains with its previous value.
   * `override`: Add a local override.
   * `update`: Update the option globally.
   * `create`: Set the option globally, overriding any local value.
   *
   * The "create" value is available since MediaWiki 1.45.
   * @since MediaWiki 1.43
   */
  global?: "ignore" | "override" | "update" | "create";
}

declare module "../registry" {
  interface ActionParams {
    options: ApiOptionsParams;
  }
}
