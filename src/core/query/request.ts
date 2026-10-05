/**
 * Gated entry types for `action=query` — the query action's request
 * machinery. The per-module parameter facts live in the sibling files, one
 * per module; this module composes them.
 *
 * Two request shapes exist and gate identically:
 *
 *  - `QueryRequest` — module selectors as names or arrays (`prop:
 *    ["revisions", "links"]`); the selected modules are inferred from the
 *    literal and their parameter sets intersect;
 *  - `QueryStringRequest` — module selectors as pipe-joined strings
 *    (`prop: "revisions|links"`, the raw API wire form); the modules are
 *    recovered with {@link PipeSplit} and gate the same way.
 *
 * In both, parameters of unselected modules are unknown — a typo'd parameter
 * name, a value outside a module's enum, a missing required parameter, or
 * another module's parameter all fail compilation.
 */
import type {
  ApiBaseParams,
  OneOrMore,
  PipeSource,
  PipeSplit,
  UnionToIntersection,
} from "../../common";
import type {
  QueryGeneratorParams,
  QueryListParams,
  QueryMetaParams,
  QueryPropParams,
} from "../../registry";

type PropNames = keyof QueryPropParams & string;
type ListNames = keyof QueryListParams & string;
type MetaNames = keyof QueryMetaParams & string;
/** Modules that can act as a `generator=` (paraminfo-flagged subset of prop/list). */
export type GeneratorNames = keyof QueryGeneratorParams & string;

/** Parameter shapes contributed by the selected `prop=` modules. */
export type QueryPropParamsFor<P extends PropNames> = UnionToIntersection<
  P extends any ? QueryPropParams[P] : never
>;

/** Parameter shapes contributed by the selected `list=` modules. */
export type QueryListParamsFor<L extends ListNames> = UnionToIntersection<
  L extends any ? QueryListParams[L] : never
>;

/** Parameter shapes contributed by the selected `meta=` modules. */
export type QueryMetaParamsFor<M extends MetaNames> = UnionToIntersection<
  M extends any ? QueryMetaParams[M] : never
>;

/**
 * The generator wire form of a module's parameters: acting as `generator=`
 * re-registers every parameter with a `g` prepended to the module prefix
 * (`aplimit` → `gaplimit`, `srsearch` → `gsrsearch`). Required-ness and enums
 * carry over unchanged.
 */
type GeneratorForm<P> = { [K in keyof P as `g${string & K}`]: P[K] };

/**
 * Parameter shape contributed by the selected `generator=` module, in its
 * generator wire form. Neither `never` (no generator selected) nor the full
 * module union (a non-literal selector) contributes anything.
 */
export type QueryGeneratorParamsFor<G extends GeneratorNames> = [G] extends [never]
  ? unknown
  : [GeneratorNames] extends [G]
    ? unknown
    : UnionToIntersection<G extends any ? GeneratorForm<QueryGeneratorParams[G]> : never>;

/** Envelope-independent query framework fields, shared by both request shapes. */
type QueryBase<G extends GeneratorNames> = {
  action: "query";
  formatversion?: "2";
  /** Titles of the pages to work on (max 50 normal / 500 bot per request). */
  titles?: OneOrMore<string>;
  /** Page ids of the pages to work on (max 50 normal / 500 bot per request). */
  pageids?: OneOrMore<number>;
  /** Revision ids of the revisions to work on (max 50 normal / 500 bot). */
  revids?: OneOrMore<number>;
  /**
   * Which module to use as a generator, feeding its results in as pages.
   * Only modules paraminfo flags as generator-capable are accepted, and the
   * selected module's own parameters (`gap*`-style prefixes) become available
   * on the request. Cannot be combined with `titles`/`pageids`/`revids`
   * (mutual exclusion left to the API).
   */
  generator?: G;
  /** Automatically resolve redirects in `titles`, `pageids`, and `revids`. */
  redirects?: boolean;
  /** Convert titles to their variant language where relevant. */
  converttitles?: boolean;
  /** Include the `pageids` array with the standard `query` output. */
  indexpageids?: boolean;
  /** Export the current revisions of the pages as XML. */
  export?: boolean;
  /** Wrap the XML export in a `<api>` element. */
  exportnowrap?: boolean;
  /** Schema version to use for the XML export. */
  exportschema?: "0.10" | "0.11";
  /** Include interwiki URLs in each page's data. */
  iwurl?: boolean;
  /** Continuation cursor from a previous response's `continue` object. */
  continue?: string;
  /** Continue printing the raw (legacy) `query-continue` data instead. */
  rawcontinue?: boolean;
};

/** Flags a pipe-joined selector with segments that are not covered modules:
 * the missing `__invalidModule` property names the offending union. */
type ValidPipeSegments<S extends string, N extends string> =
  PipeSplit<S> extends N ? unknown : { __invalidModule: PipeSplit<S> };

/**
 * A `action=query` request. The `prop` / `list` / `meta` selectors are
 * inferred as literal types, and the parameter sets of exactly those modules
 * become available on the request.
 *
 * An array selects several modules at once (`prop: ["revisions", "links"]`);
 * their parameter sets intersect. When the selectors are not literal (a
 * variable typed with the module union), the request degrades to accepting
 * every covered module's parameters.
 */
export type QueryRequest<
  P extends PropNames = never,
  L extends ListNames = never,
  M extends MetaNames = never,
  G extends GeneratorNames = never,
> = ApiBaseParams &
  QueryBase<G> & {
    /** Which per-page data to get, as `prop=` module names. */
    prop?: OneOrMore<P>;
    /** Which lists to get, as `list=` module names. */
    list?: OneOrMore<L>;
    /** Which metadata to get, as `meta=` module names. */
    meta?: OneOrMore<M>;
  } & QueryPropParamsFor<P> &
  QueryListParamsFor<L> &
  QueryMetaParamsFor<M> &
  QueryGeneratorParamsFor<G>;

/**
 * The string-form of {@link QueryRequest}: module selectors as pipe-joined
 * strings (`prop: "revisions|links"`) — the raw API wire form, for clients
 * that build query strings directly. Modules are recovered with `PipeSplit`
 * and the same module-parameter gating applies; a selector segment that is
 * not a covered module fails compilation through a missing
 * `__invalidModule` property that names the offending union.
 */
export type QueryStringRequest<
  SP extends PipeSource<PropNames> = never,
  SL extends PipeSource<ListNames> = never,
  SM extends PipeSource<MetaNames> = never,
  G extends GeneratorNames = never,
> = ApiBaseParams &
  QueryBase<G> & {
    /** Which per-page data to get, pipe-joined `prop=` module names. */
    prop?: SP;
    /** Which lists to get, pipe-joined `list=` module names. */
    list?: SL;
    /** Which metadata to get, pipe-joined `meta=` module names. */
    meta?: SM;
  } & QueryPropParamsFor<Extract<PipeSplit<SP>, PropNames>> &
  QueryListParamsFor<Extract<PipeSplit<SL>, ListNames>> &
  QueryMetaParamsFor<Extract<PipeSplit<SM>, MetaNames>> &
  QueryGeneratorParamsFor<G> &
  ValidPipeSegments<SP, PropNames> &
  ValidPipeSegments<SL, ListNames> &
  ValidPipeSegments<SM, MetaNames>;
