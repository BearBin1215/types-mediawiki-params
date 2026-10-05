/**
 * Shared atoms for request parameter types.
 *
 * Envelope facts (`ApiBaseParams`) mirror the `main` and `json` paraminfo
 * modules of the covered MediaWiki versions (the 1.39–1.47 union); `action`
 * is deliberately not part of it — every request entry pins its own action
 * literal.
 */

/**
 * One value or a list of values: how MediaWiki multi-value parameters accept
 * input. `mw.Api` joins array items with `|`. Pipe-joined strings are accepted
 * by the string-form request entries (`QueryStringRequest`), which split them
 * back into module unions with {@link PipeSplit}; the array-form entries take
 * arrays only. Mutable arrays only, so gated requests (and the `./define`
 * helpers' results) stay assignable to `mw.Api`'s parameter record; `as const`
 * arrays do not fit that record.
 */
export type OneOrMore<T> = T | T[];

/**
 * Splits a pipe-joined value list into the union of its parts:
 * `"revisions|links"` → `"revisions" | "links"`. MediaWiki accepts
 * pipe-joined strings for multi-value parameters; this is the type-level
 * counterpart (no library needed — plain template literal recursion).
 */
export type PipeSplit<S extends string> = S extends `${infer Head}|${infer Rest}`
  ? PipeSplit<Rest> | Head
  : S;

/** Accepts a single name or a pipe-joined list whose FIRST segment is one of `N`. */
export type PipeSource<N extends string> = N | `${N}|${string}`;

/** Intersects the members of a union. A `never` union collapses to `unknown`. */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/** List-limit parameters accept an integer or `"max"`. */
export type ApiLimit = number | "max";

/**
 * Envelope parameters shared by every action: authentication, output format,
 * error shaping. Facts from the `main` and `json` paraminfo modules.
 */
export interface ApiBaseParams {
  /** Response format. `mw.Api` sends `json` by default. */
  format?: "json" | "jsonfm" | "none" | "php" | "phpfm" | "rawfm" | "xml" | "xmlfm";
  /** Assert the user is not logged in, logged in, or a bot member. */
  assert?: "anon" | "bot" | "user";
  /** Assert the user is logged in as this name (or via a message when set). */
  assertuser?: string;
  /**
   * Wait at most this many seconds for the database replication lag to drop
   * below it; errors with `maxlag` otherwise. Intended for automated clients.
   */
  maxlag?: number;
  /** Set the `s-maxage` cache-control header to this many seconds. */
  smaxage?: number;
  /** Set the `max-age` cache-control header to this many seconds. */
  maxage?: number;
  /** Echo the request id back in the response (any string echoes as-is). */
  requestid?: string;
  /** Include the hostnames serving the request in the response. */
  servedby?: boolean;
  /** Include the current wiki timestamp in the response. */
  curtimestamp?: boolean;
  /** Include the languages the response content is available in. */
  responselanginfo?: boolean;
  /**
   * Access the API from another origin using CORS; set to `*` for public
   * access from any origin, or the exact origin of the calling page.
   */
  origin?: string;
  /** Language to use for message translations; `default` uses the user's. */
  uselang?: string;
  /** Language variant to use for content output. */
  variant?: string;
  /**
   * Include CORS response headers intended for cross-origin images and other
   * read-only content loaded by unauthenticated clients.
   * @since MediaWiki 1.44
   */
  crossorigin?: boolean;
  /** Format to use for error and warning text output. */
  errorformat?: "bc" | "html" | "none" | "plaintext" | "raw" | "wikitext";
  /** Language to use for message translations in error and warning text. */
  errorlang?: string;
  /** Apply custom messages from the wiki for errors and warnings. */
  errorsuselocal?: boolean;
  /** JSONP callback wrapping the response (format `json`/`jsonfm` only). */
  callback?: string;
  /** Serialize `*` content keys as UTF-8 instead of hex-encoded octets. */
  utf8?: boolean;
  /** Serialize `*` content keys as hex-encoded octets instead of UTF-8. */
  ascii?: boolean;
  /**
   * Response wire format. Request entries of this package pin `"2"`:
   * the sibling response types (types-mediawiki-response) model `formatversion=2`.
   */
  formatversion?: "1" | "2" | "latest";
}

/**
 * Escape hatch for parameters this package does not model — the index
 * signature the registries intentionally omit. Bypasses all gating: use it
 * for parameters from extensions without a params pack, or newer wiki
 * versions, and prefer a real declaration (or an extension pack) over it.
 */
export interface ApiRawParams {
  [parameter: string]: string | number | boolean | string[] | number[] | undefined;
}

/** The token parameter of a request type: its string key ending in `token`. */
type TokenKeyOf<T> = {
  [K in keyof T]-?: K extends string ? (Lowercase<K> extends `${string}token` ? K : never) : never;
}[keyof T];

/** One union member with its token parameter made optional. */
type ClientTokenMember<T> = Omit<T, TokenKeyOf<T>> & { [K in TokenKeyOf<T>]?: string };

/**
 * A request whose token parameter is supplied by `mw.Api` — through
 * `postWithToken( tokenType, … )` — rather than by the caller, so it becomes
 * optional here. Every token-named parameter is covered, so the same type
 * serves `token` (csrf) and the actions that use another one (`logintoken`,
 * `createtoken`, `changeauthtoken`, `linktoken`). Everything else stays gated.
 *
 * ```ts
 * api.postWithToken( "csrf", {
 *     action: "edit",
 *     pageid,
 *     text,
 *     summary,
 * } satisfies ClientToken<ActionRequest> );
 * ```
 */
export type ClientToken<R> = R extends unknown ? ClientTokenMember<R> : never;
