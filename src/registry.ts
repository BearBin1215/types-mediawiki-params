/**
 * Module parameter registries: maps from module name to the parameter shape
 * that module contributes.
 *
 * These interfaces are declaration-merging seams, on purpose. Every module
 * file under `src/core/query/` merges its entry in from its own file, and
 * extension params packs (subpath `./ext/*`) add theirs the same way. Never
 * close them with an index signature or a `Record` — the closed key set is
 * what makes module-name typos a compile error, and the open interface is
 * what lets packs extend the union.
 *
 * Keyed interfaces (do not instantiate — build requests with `QueryRequest`).
 */
export interface QueryPropParams {
  /** `prop=` modules: per-page data, keyed by module name. */
}

export interface QueryListParams {
  /** `list=` modules: list data, keyed by module name. */
}

export interface QueryMetaParams {
  /** `meta=` modules: site/user metadata, keyed by module name. */
}

/**
 * Modules that can act as a `generator=` — the subset of `prop=` / `list=`
 * modules paraminfo flags with `generator: true`. Selecting one via the
 * `generator` field of a `QueryRequest` makes exactly its parameters (the
 * `gap*`-style prefixed set) available on the request.
 */
export interface QueryGeneratorParams {
  /** Generator-capable query modules, keyed by module name. */
}

/** Non-query actions, keyed by action name (e.g. `edit`). */
export interface ActionParams {}
