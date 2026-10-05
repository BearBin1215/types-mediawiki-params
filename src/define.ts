/**
 * Identity helpers making the gated request types usable directly with
 * `mw.Api` (or any wrapper taking a plain parameters object): the helper
 * infers and validates the request, then hands the object back unchanged.
 *
 * The results are assignable to `mw.Api`'s parameter record, so gadget code
 * reads:
 *
 * ```ts
 * import { defineActionWithToken, defineQuery } from "types-mediawiki-params/define";
 *
 * api.get(
 *     defineQuery({ action: "query", prop: "revisions", titles, rvprop: ["ids", "timestamp"] }),
 * );
 * // mw.Api injects the token for you:
 * api.postWithToken( "csrf", defineActionWithToken({ action: "edit", pageid, text, summary }) );
 * ```
 *
 * Without a helper, a plain object literal is still gated through any
 * function whose parameter is `QueryRequest` / `ActionRequest` / `ActionRequestFor`.
 */
import type { ApiRawParams, ClientToken, PipeSource } from "./common.js";
import type { ActionRequest, ActionRequestFor } from "./action.js";
import type { GeneratorNames, QueryRequest, QueryStringRequest } from "./core/query/request.js";
// The registries come from the barrel rather than `./registry.js`: a consumer of
// this subpath may never import the main entry, and only the barrel pulls the
// `src/core/**` registry augmentations into this file's graph. A bare
// `import type {}` would be dropped by the declaration emit, so these names have
// to be the ones the signatures use.
import type { ActionParams, QueryListParams, QueryMetaParams, QueryPropParams } from "./index.js";

/**
 * Validate a `action=query` request. The `prop` / `list` / `meta` selectors
 * are inferred as literal types and the parameter sets of exactly those modules
 * become available. `generator` takes a generator-capable module name (the
 * fourth type parameter) and unlocks that module's own parameters.
 *
 * The result is intersected with `ApiRawParams` so it stays assignable to
 * `mw.Api`'s parameter record (a closed type without an index signature is
 * not) — the gating has already happened on the way in.
 */
export function defineQuery<
  P extends keyof QueryPropParams & string = never,
  L extends keyof QueryListParams & string = never,
  M extends keyof QueryMetaParams & string = never,
  G extends GeneratorNames = never,
>(params: QueryRequest<P, L, M, G>): ApiRawParams & QueryRequest<P, L, M, G>;

/**
 * String-form variant: module selectors as pipe-joined strings
 * (`prop: "revisions|links"` — the raw API wire form). The modules are
 * recovered at the type level and the same gating applies; `generator` stays a
 * plain module name.
 */
export function defineQuery<
  SP extends PipeSource<keyof QueryPropParams & string> = never,
  SL extends PipeSource<keyof QueryListParams & string> = never,
  SM extends PipeSource<keyof QueryMetaParams & string> = never,
  G extends GeneratorNames = never,
>(params: QueryStringRequest<SP, SL, SM, G>): ApiRawParams & QueryStringRequest<SP, SL, SM, G>;

export function defineQuery(
  params: QueryRequest | QueryStringRequest,
): ApiRawParams & (QueryRequest | QueryStringRequest) {
  // The gated type has no index signature, so it does not literally satisfy
  // the ApiRawParams intersection in the return type; the validation already
  // happened on the way in.
  return params as ApiRawParams & (QueryRequest | QueryStringRequest);
}

/**
 * Validate a non-query action request. The `action` literal selects the
 * parameter set: another action's parameters, unknown parameters and missing
 * required parameters are compile errors.
 *
 * The result is intersected with `ApiRawParams` so it stays assignable to
 * `mw.Api`'s parameter record — the gating has already happened on the way in.
 */
export function defineAction<A extends keyof ActionParams & string>(
  params: ActionRequestFor<A>,
): ApiRawParams & ActionRequestFor<A> {
  return params as ApiRawParams & ActionRequestFor<A>;
}

/**
 * Validate a non-query action request whose token `mw.Api` injects for you
 * (`postWithToken`): the same gating as {@link defineAction}, with every
 * token-named parameter optional (see {@link ClientToken}).
 */
export function defineActionWithToken(
  params: ClientToken<ActionRequest>,
): ApiRawParams & ClientToken<ActionRequest> {
  return params as ApiRawParams & ClientToken<ActionRequest>;
}
