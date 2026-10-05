import type { OneOrMore } from "../../common";

/**
 * Request parameters for the `list=codexicons` query module.
 *
 * Get Codex icons
 *
 * @since MediaWiki 1.44
 */
export interface ApiQueryCodexiconsParams {
  /**
   * Names of icons
   *
   * @since MediaWiki 1.44
   */
  names: OneOrMore<string>;
}

declare module "../../registry" {
  interface QueryListParams {
    codexicons: ApiQueryCodexiconsParams;
  }
}
