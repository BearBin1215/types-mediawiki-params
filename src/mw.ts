/// <reference types="types-mediawiki" />
/**
 * Global `mw.Api` typings for gadget and wiki-script work: one reference per
 * project, then a request literal is gated at the argument and its response is
 * inferred — `api.post({ action: "edit", … })` comes back as an edit response,
 * with no per-call helper, wrapper, or assertion.
 *
 * Activate it from any file your tsconfig covers, conventionally `types.d.ts`:
 *
 * ```ts
 * /// <reference types="types-mediawiki-params/mw" />
 * ```
 *
 * Then annotate the object where it is created. This is the only line of glue,
 * once per project, and it needs no import because the entry types arrive as
 * the global `mwParams` namespace:
 *
 * ```ts
 * const api: mwParams.Api = new mw.Api();
 *
 * const res = await api.get({ action: "query", prop: "revisions", titles, rvprop: ["ids"] });
 * res.query.pages?.[0]?.revisions; // typed
 * res.query.pages?.[0]?.links; // compile error — prop=links was not requested
 *
 * const done = await api.post({ action: "edit", pageid, text, token: "+\\" });
 * done.edit?.result; // typed
 * await api.post({ action: "edit", pageid, text }); // compile error — token is required
 * ```
 *
 * Two forms, same method list (kept in sync by hand — see the note on the
 * merged interface for why `extends` is not available):
 *
 * - `mwParams.Api` (the facade, shown above) captures object literals because
 *   its `get` / `post` are ours alone: the loose `UnknownApiParams` signature is
 *   gone from the type, so nothing else can claim the call. Gating reports at the
 *   argument, the response needs no assertion, and every other `mw.Api` member
 *   survives through `Omit<mw.Api, …>`.
 * - The merged `mw.Api` interface (below) needs no cast at all, but declaration
 *   merging cannot outrank the class's own overloads: a fresh literal, or a
 *   `defineQuery` / `defineAction` result, still matches `UnknownApiParams` first
 *   and resolves to `ApiResponse`. What the merge does add is that a *typed
 *   request value* is legal to pass and comes back projected — such a value was
 *   rejected outright before this reference.
 *
 * No assertion is involved. The merged interface below repeats the gated
 * signatures on the class itself, so an `mw.Api` instance satisfies
 * `mwParams.Api` outright and the annotation is checked by the compiler, not
 * trusted like a cast. The direction is one-way: the facade is not assignable
 * back to `mw.Api`, because it has dropped the loose signature — that missing
 * direction is the gating. `tests/mw.test-d.ts` pins the assignment; keep the
 * two method lists in step or this documented form stops compiling.
 *
 * Peers: `types-mediawiki` provides the `mw` namespace, and
 * `types-mediawiki-response` (the optional peer of `./with-response`) provides
 * the response types these signatures return.
 */
import type {
  ActionRequest as GatedActionRequest,
  ActionRequestFor as GatedActionRequestFor,
} from "./action";
import type {
  ApiBaseParams as GatedApiBaseParams,
  ApiRawParams as GatedApiRawParams,
  OneOrMore as GatedOneOrMore,
  PipeSource,
  PipeSplit,
} from "./common";
import type {
  QueryRequest as GatedQueryRequest,
  QueryStringRequest as GatedQueryStringRequest,
} from "./core/query/request";
import type { ActionResponseFor, ActionWithResponse, QueryResponseFor } from "./with-response";
// The registries come from the barrel: consumers reach this file through a
// global reference without ever importing the main entry, and only the barrel
// pulls the `src/core/**` registry augmentations into the graph (a bare
// `import type {}` is dropped by the declaration emit).
import type {
  ActionParams,
  QueryGeneratorParams,
  QueryListParams,
  QueryMetaParams,
  QueryPropParams,
} from "./index";

type PropNames = keyof QueryPropParams & string;
type ListNames = keyof QueryListParams & string;
type MetaNames = keyof QueryMetaParams & string;
type GeneratorNames = keyof QueryGeneratorParams & string;

/** The gated request methods — the only place their signatures are written. */
export interface GatedApiMethods {
  /** Array form first: contextual typing then steers `defineQuery` to its array overload. */
  get<
    P extends PropNames = never,
    L extends ListNames = never,
    M extends MetaNames = never,
    G extends GeneratorNames = never,
  >(
    parameters: GatedQueryRequest<P, L, M, G>,
    ajaxOptions?: mw.Api.AjaxSettings,
  ): mw.Api.AbortablePromise<[QueryResponseFor<P>]>;
  get<
    SP extends PipeSource<PropNames> = never,
    SL extends PipeSource<ListNames> = never,
    SM extends PipeSource<MetaNames> = never,
    G extends GeneratorNames = never,
  >(
    parameters: GatedQueryStringRequest<SP, SL, SM, G>,
    ajaxOptions?: mw.Api.AjaxSettings,
  ): mw.Api.AbortablePromise<[QueryResponseFor<Extract<PipeSplit<SP>, PropNames>>]>;

  post<A extends ActionWithResponse>(
    parameters: GatedActionRequestFor<A>,
    ajaxOptions?: mw.Api.AjaxSettings,
  ): mw.Api.AbortablePromise<[ActionResponseFor<A>]>;
  post<
    P extends PropNames = never,
    L extends ListNames = never,
    M extends MetaNames = never,
    G extends GeneratorNames = never,
  >(
    parameters: GatedQueryRequest<P, L, M, G>,
    ajaxOptions?: mw.Api.AjaxSettings,
  ): mw.Api.AbortablePromise<[QueryResponseFor<P>]>;
  post<
    SP extends PipeSource<PropNames> = never,
    SL extends PipeSource<ListNames> = never,
    SM extends PipeSource<MetaNames> = never,
    G extends GeneratorNames = never,
  >(
    parameters: GatedQueryStringRequest<SP, SL, SM, G>,
    ajaxOptions?: mw.Api.AjaxSettings,
  ): mw.Api.AbortablePromise<[QueryResponseFor<Extract<PipeSplit<SP>, PropNames>>]>;

  postWithEditToken<A extends ActionWithResponse>(
    params: GatedActionRequestFor<A>,
    ajaxOptions?: mw.Api.AjaxSettings,
  ): mw.Api.AbortablePromise<[ActionResponseFor<A>]>;
  postWithToken<A extends ActionWithResponse>(
    tokenType: string,
    params: GatedActionRequestFor<A>,
    ajaxOptions?: mw.Api.AjaxSettings,
  ): mw.Api.AbortablePromise<[ActionResponseFor<A>]>;
}

/** The `mw.Api` members the facade swaps out. */
type GatedMethodNames = "get" | "post" | "postWithEditToken" | "postWithToken";

declare global {
  /** This package's entry types, reachable without an import statement. */
  namespace mwParams {
    /**
     * `mw.Api` with its request methods swapped for the gated ones: object
     * literals are checked at the argument and responses come back typed.
     * Obtain it with `const api: mwParams.Api = new mw.Api()` — the merged
     * signatures make the instance satisfy this type, no assertion needed.
     */
    export type Api = GatedApiMethods & Omit<mw.Api, GatedMethodNames>;
    export type QueryRequest<
      P extends keyof QueryPropParams & string = never,
      L extends keyof QueryListParams & string = never,
      M extends keyof QueryMetaParams & string = never,
      G extends keyof QueryGeneratorParams & string = never,
    > = GatedQueryRequest<P, L, M, G>;
    export type QueryStringRequest<
      SP extends PipeSource<keyof QueryPropParams & string> = never,
      SL extends PipeSource<keyof QueryListParams & string> = never,
      SM extends PipeSource<keyof QueryMetaParams & string> = never,
      G extends keyof QueryGeneratorParams & string = never,
    > = GatedQueryStringRequest<SP, SL, SM, G>;
    export type ActionRequest = GatedActionRequest;
    export type ActionRequestFor<A extends keyof ActionParams & string> = GatedActionRequestFor<A>;
    export type ApiBaseParams = GatedApiBaseParams;
    export type ApiRawParams = GatedApiRawParams;
    export type OneOrMore<T> = GatedOneOrMore<T>;
  }

  namespace mw {
    /**
     * The same methods merged onto the real class, for code that keeps `mw.Api`.
     *
     * These repeat {@link GatedApiMethods} on purpose: `interface Api extends
     * GatedApiMethods` is rejected (TS2430), because a merged member must be
     * assignable to the class's own one and our resolve tuple is shorter than
     * `[ApiResponse, jqXHR]` is. Keep the two lists in step — `tests/mw.test-d.ts`
     * pins both paths. The repetition is also what lets a class instance satisfy
     * the {@link mwParams.Api} facade outright, so consumers obtain the facade
     * with a plain annotation and no assertion.
     */
    interface Api {
      get<
        P extends PropNames = never,
        L extends ListNames = never,
        M extends MetaNames = never,
        G extends GeneratorNames = never,
      >(
        parameters: GatedQueryRequest<P, L, M, G>,
        ajaxOptions?: Api.AjaxSettings,
      ): Api.AbortablePromise<[QueryResponseFor<P>]>;
      get<
        SP extends PipeSource<PropNames> = never,
        SL extends PipeSource<ListNames> = never,
        SM extends PipeSource<MetaNames> = never,
        G extends GeneratorNames = never,
      >(
        parameters: GatedQueryStringRequest<SP, SL, SM, G>,
        ajaxOptions?: Api.AjaxSettings,
      ): Api.AbortablePromise<[QueryResponseFor<Extract<PipeSplit<SP>, PropNames>>]>;

      post<A extends ActionWithResponse>(
        parameters: GatedActionRequestFor<A>,
        ajaxOptions?: Api.AjaxSettings,
      ): Api.AbortablePromise<[ActionResponseFor<A>]>;
      post<
        P extends PropNames = never,
        L extends ListNames = never,
        M extends MetaNames = never,
        G extends GeneratorNames = never,
      >(
        parameters: GatedQueryRequest<P, L, M, G>,
        ajaxOptions?: Api.AjaxSettings,
      ): Api.AbortablePromise<[QueryResponseFor<P>]>;
      post<
        SP extends PipeSource<PropNames> = never,
        SL extends PipeSource<ListNames> = never,
        SM extends PipeSource<MetaNames> = never,
        G extends GeneratorNames = never,
      >(
        parameters: GatedQueryStringRequest<SP, SL, SM, G>,
        ajaxOptions?: Api.AjaxSettings,
      ): Api.AbortablePromise<[QueryResponseFor<Extract<PipeSplit<SP>, PropNames>>]>;

      postWithEditToken<A extends ActionWithResponse>(
        params: GatedActionRequestFor<A>,
        ajaxOptions?: Api.AjaxSettings,
      ): Api.AbortablePromise<[ActionResponseFor<A>]>;
      postWithToken<A extends ActionWithResponse>(
        tokenType: string,
        params: GatedActionRequestFor<A>,
        ajaxOptions?: Api.AjaxSettings,
      ): Api.AbortablePromise<[ActionResponseFor<A>]>;
    }
  }
}
