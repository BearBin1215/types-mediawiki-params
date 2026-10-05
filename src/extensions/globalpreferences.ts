/**
 * Opt-in extension pack: **GlobalPreferences** (`action=globalpreferences`, `action=globalpreferenceoverrides`).
 *
 * Not in the default export: importing anything from this file — even just
 * the parameter interface you are about to use — activates the registry
 * augmentation at the bottom, which merges the modules into the request
 * gating automatically (no manual `declare module`):
 *
 * ```ts
 * import type {} from "types-mediawiki-params/ext/globalpreferences";
 * ```
 *
 * @see https://www.mediawiki.org/wiki/Extension:GlobalPreferences
 */

import type { OneOrMore } from "../common";

/**
 * Request parameters for the `globalpreferences` action provided by the extension.
 *
 * Change global preferences of the current user.
 * Only preferences registered for the current wiki can be changed locally.
 */
export interface ApiGlobalpreferencesParams {
  /**
   * Reset global preferences. Removes all, or, depending on the value of the `resetkinds` parameter, some types of global preferences and make them not global anymore.
   */
  reset?: boolean;
  /**
   * List of types of preferences to reset when the reset option is set.
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
   * List of changes, formatted name=value (e.g. skin=vector). If no value is given (not even an equals sign), e.g., preferencename|otherpreference|..., the preference will be made non-global. If any value passed contains the pipe character (`|`), use the alternative multiple-value separator for correct operation.
   */
  change?: OneOrMore<string>;
  /**
   * The name of the preference that should be set to the value given by optionvalue.
   */
  optionname?: string;
  /**
   * The value for the preference specified by optionname.
   */
  optionvalue?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}
/**
 * Request parameters for the `globalpreferenceoverrides` action provided by the extension.
 *
 * Change local overrides for global preferences for the current user.
 * Global values for affected preferences will be ignored.
 */
export interface ApiGlobalpreferenceoverridesParams {
  /**
   * Reset local overrides. Removes all, or, depending on the value of the `resetkinds` parameter, some types of local overrides and makes them global again.
   */
  reset?: boolean;
  /**
   * List of types of overrides to reset when the reset option is set.
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
   * List of changes, formatted name=value (e.g. skin=vector). If no value is given (not even an equals sign), e.g., preferencename|otherpreference|..., the override will be removed. If any value passed contains the pipe character (`|`), use the alternative multiple-value separator for correct operation.
   */
  change?: OneOrMore<string>;
  /**
   * The name of the override that should be set to the value given by optionvalue.
   */
  optionname?: string;
  /**
   * The value for the override specified by optionname.
   */
  optionvalue?: string;
  /**
   * A "csrf" token retrieved from action=query&meta=tokens
   */
  token: string;
}

declare module "../registry" {
  interface ActionParams {
    globalpreferences: ApiGlobalpreferencesParams;
    globalpreferenceoverrides: ApiGlobalpreferenceoverridesParams;
  }
}
