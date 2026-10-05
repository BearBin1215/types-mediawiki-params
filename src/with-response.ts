/**
 * Request → response correlation over the sibling package
 * types-mediawiki-response (an OPTIONAL peer dependency: the main entry of
 * this package never touches it — only this subpath resolves it, and only
 * consumers who import this subpath need it installed).
 *
 * The `prop=` selectors of a query request determine which per-page fields
 * the response's `query.pages` entries can carry. `QueryResponseFor`
 * projects the merged response pages down to exactly the requested modules,
 * reusing the response package's own `QueryPage<K>` projection.
 *
 * For a non-query action the correlation is a lookup by the `action` literal:
 * `ActionResponseFor<A>` is the response package's `Api<Action>Response`, and
 * `ActionResponseOf<Req>` recovers the same from a request type.
 *
 * Typical use inside a thin wrapper (gadget or bot code): the module selectors
 * stay generic, so the object literal at the call site picks them and the
 * response comes back projected.
 *
 * ```ts
 * import type {
 *     QueryListParams,
 *     QueryMetaParams,
 *     QueryPropParams,
 *     QueryRequest,
 * } from "types-mediawiki-params";
 * import { defineQuery } from "types-mediawiki-params/define";
 * import type { QueryResponseFor } from "types-mediawiki-params/with-response";
 *
 * async function query<
 *     P extends keyof QueryPropParams & string = never,
 *     L extends keyof QueryListParams & string = never,
 *     M extends keyof QueryMetaParams & string = never,
 * >(params: QueryRequest<P, L, M>): Promise<QueryResponseFor<P>> {
 *     // `mw.Api` resolves `Record<string, any>`; this is where the shape comes in.
 *     return (await api.get(defineQuery(params))) as QueryResponseFor<P>;
 * }
 *
 * const res = await query({ action: "query", prop: "revisions", titles, rvprop: ["ids"] });
 * res.query.pages?.[0]?.revisions // typed; `.links` is a compile error
 * ```
 *
 * The other actions read the same way, with the action as the single type
 * parameter:
 *
 * ```ts
 * async function post<A extends ActionWithResponse>(
 *     params: ActionRequestFor<A>,
 * ): Promise<ActionResponseFor<A>> {
 *     return (await api.post(defineAction(params))) as ActionResponseFor<A>;
 * }
 * ```
 *
 * `QueryResponseOf<Req>` / `ActionResponseOf<Req>` below recover the same
 * response from a request *type* instead of a selector type parameter — use
 * them when the request type is what carries the selection (a `define*`
 * result, or the wrapper's own `Req`). For query, do not constrain a wrapper on
 * the bare entry type: `Req extends QueryRequest` defaults every selector to
 * `never`, so no module literal fits, and the wide `QueryRequest<all module
 * names>` form demands every covered module's required parameters.
 * `ActionRequest` is a discriminated union, so the single-parameter shape does
 * work on that side.
 */
import type {
  ApiAcquireTempUserNameResponse,
  ApiBlockResponse,
  ApiChangeAuthenticationDataResponse,
  ApiChangeContentModelResponse,
  ApiCheckTokenResponse,
  ApiClearHasMsgResponse,
  ApiClientLoginResponse,
  ApiCompareResponse,
  ApiCreateAccountResponse,
  ApiDeleteResponse,
  ApiEditResponse,
  ApiEmailUserResponse,
  ApiExpandTemplatesResponse,
  ApiFileRevertResponse,
  ApiImageRotateResponse,
  ApiImportResponse,
  ApiLanguageSearchResponse,
  ApiLoginResponse,
  ApiLogoutResponse,
  ApiManageTagsResponse,
  ApiMergeHistoryResponse,
  ApiMoveResponse,
  ApiOptionsResponse,
  ApiPage,
  ApiParseResponse,
  ApiPatrolResponse,
  ApiProtectResponse,
  ApiPurgeResponse,
  ApiQueryResponse,
  ApiQueryResult,
  ApiRemoveAuthenticationDataResponse,
  ApiResetPasswordResponse,
  ApiRevisionDeleteResponse,
  ApiRollbackResponse,
  ApiSetNotificationTimestampResponse,
  ApiSetPageLanguageResponse,
  ApiStashEditResponse,
  ApiTagResponse,
  ApiUnblockResponse,
  ApiUndeleteResponse,
  ApiUploadResponse,
  ApiUserrightsResponse,
  ApiValidatePasswordResponse,
  ApiWatchResponse,
  QueryPage,
} from "types-mediawiki-response";

import type { OneOrMore, PipeSplit } from "./common";
import type { QueryRequest } from "./core/query/request";
// `QueryPropParams` comes from the barrel, not from `./registry`: a consumer may
// import this subpath without ever touching the main entry, and only the barrel
// pulls the registry augmentations from `src/core/**` into this file's graph.
// (tsc drops a bare `import type {}`, so the reference has to be a used name.)
import type { QueryPropParams } from "./index";

/**
 * A `action=query` response with `query.pages` projected to the `prop=`
 * modules the request selected: page entries carry the page identity plus
 * the fields of exactly those modules. List and meta results are already
 * fully typed by the response package's merged `ApiQueryResult` and need no
 * projection.
 */
type ProjectedQueryResponse<P extends keyof ApiPage> = Omit<ApiQueryResponse, "query"> & {
  query: Omit<ApiQueryResult, "pages"> & { pages?: QueryPage<P>[] };
};

/**
 * Some prop modules write their fields directly onto the page object instead
 * of under a same-named key (`prop=info` contributes `contentmodel`,
 * `length`, `touched`, …). A selection including any of them skips the
 * projection — the response package's merged view is the accurate shape,
 * while a projected one would silently drop those fields.
 */
export type QueryResponseFor<P extends keyof QueryPropParams & string> = [P] extends [
  Extract<P, keyof ApiPage>,
]
  ? ProjectedQueryResponse<Extract<P, keyof ApiPage>>
  : ApiQueryResponse;

/**
 * Projects the response type of a (possibly inferred) query request type:
 * `QueryResponseOf<ReturnType<typeof defineQuery>>`, or — inside a wrapper —
 * `QueryResponseOf<Req>` straight from the wrapper's parameter type. Both
 * request shapes work: array-form selectors infer the module union directly;
 * pipe-joined string selectors are split back into the union first.
 *
 * The later branches match `prop` structurally on purpose: the string request
 * type carries a deferred invalid-segment sentinel member, and a full-shape
 * `extends` against it would demand assignability to both conditional
 * branches — the sentinel branch can never be satisfied. The same limitation
 * keeps the first branch at three type parameters: inferring the generator
 * parameter too would re-introduce a deferred conditional and poison the
 * match, so generator-carrying requests fall through to the structural
 * branches.
 */
export type QueryResponseOf<Req> =
  Req extends QueryRequest<infer P, infer _L, infer _M>
    ? QueryResponseFor<P>
    : Req extends { prop?: infer SP extends string }
      ? QueryResponseFor<Extract<PipeSplit<SP>, keyof QueryPropParams & string>>
      : Req extends { prop?: OneOrMore<infer P2 extends keyof QueryPropParams & string> }
        ? QueryResponseFor<P2>
        : never;

/**
 * The response package's response type for each covered non-query action,
 * keyed by the `action` literal. A declaration-merging seam like the parameter
 * registries: an extension params pack adds the entries for the actions it
 * registers.
 *
 * `action=query` is deliberately absent — its response is projected from the
 * selected modules, not fixed by the action name.
 */
export interface ActionResponseMap {
  acquiretempusername: ApiAcquireTempUserNameResponse;
  block: ApiBlockResponse;
  changeauthenticationdata: ApiChangeAuthenticationDataResponse;
  changecontentmodel: ApiChangeContentModelResponse;
  checktoken: ApiCheckTokenResponse;
  clearhasmsg: ApiClearHasMsgResponse;
  clientlogin: ApiClientLoginResponse;
  compare: ApiCompareResponse;
  createaccount: ApiCreateAccountResponse;
  delete: ApiDeleteResponse;
  edit: ApiEditResponse;
  emailuser: ApiEmailUserResponse;
  expandtemplates: ApiExpandTemplatesResponse;
  filerevert: ApiFileRevertResponse;
  imagerotate: ApiImageRotateResponse;
  import: ApiImportResponse;
  languagesearch: ApiLanguageSearchResponse;
  login: ApiLoginResponse;
  logout: ApiLogoutResponse;
  managetags: ApiManageTagsResponse;
  mergehistory: ApiMergeHistoryResponse;
  move: ApiMoveResponse;
  options: ApiOptionsResponse;
  /** With `onlypst=1` the payload is narrower — `ApiParseOnlyPstResponse`. */
  parse: ApiParseResponse;
  patrol: ApiPatrolResponse;
  protect: ApiProtectResponse;
  purge: ApiPurgeResponse;
  removeauthenticationdata: ApiRemoveAuthenticationDataResponse;
  resetpassword: ApiResetPasswordResponse;
  revisiondelete: ApiRevisionDeleteResponse;
  rollback: ApiRollbackResponse;
  setnotificationtimestamp: ApiSetNotificationTimestampResponse;
  setpagelanguage: ApiSetPageLanguageResponse;
  stashedit: ApiStashEditResponse;
  tag: ApiTagResponse;
  unblock: ApiUnblockResponse;
  undelete: ApiUndeleteResponse;
  upload: ApiUploadResponse;
  userrights: ApiUserrightsResponse;
  validatepassword: ApiValidatePasswordResponse;
  watch: ApiWatchResponse;
}

/** Covered actions whose response the sibling package models. */
export type ActionWithResponse = keyof ActionResponseMap & string;

/**
 * The response of one specific non-query action.
 *
 * Four covered actions have no response type in types-mediawiki-response yet —
 * `cspreport`, `linkaccount`, `paraminfo`, `unlinkaccount` — so they are
 * outside this lookup; their request types are unaffected.
 */
export type ActionResponseFor<A extends ActionWithResponse> = ActionResponseMap[A];

/**
 * Projects the response type of a (possibly inferred) action request type:
 * `ActionResponseOf<ReturnType<typeof defineAction>>`, or — inside a wrapper —
 * `ActionResponseOf<Req>` straight from the wrapper's parameter type. A
 * request whose `action` has no modelled response projects to `never`.
 */
export type ActionResponseOf<Req> = Req extends { action: infer A extends ActionWithResponse }
  ? ActionResponseFor<A>
  : never;
