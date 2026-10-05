/**
 * Tests for the `./mw` global pack: a gated request handed straight to `mw.Api`
 * is legal and comes back projected. The last section pins what merging cannot
 * reach — a fresh object literal — so the documented limits stay accurate.
 */
import { expectTypeOf } from "expect-type";
import type { ApiPage, ApiPageIdentity } from "types-mediawiki-response";

import type { ActionRequestFor, QueryRequest, QueryStringRequest } from "../src";
import { defineQuery } from "../src/define";
// The pack is global and type-only: importing it for its side effects on `mw.Api`
// is the whole point of the test.
// oxlint-disable-next-line import/no-empty-named-blocks
import type {} from "../src/mw";

declare const api: mw.Api;

/** Page entry of a projected response. */
type PageOf<R> = R extends { query: { pages?: (infer U)[] | undefined } } ? U : never;

// == A gated request value is legal on mw.Api, and projected ==

declare const revisionsReq: QueryRequest<"revisions">;

async function readRevisions() {
  return api.get(revisionsReq);
}

type RevisionsResponse = Awaited<ReturnType<typeof readRevisions>>;
expectTypeOf<PageOf<RevisionsResponse>["revisions"]>().toEqualTypeOf<ApiPage["revisions"]>();
expectTypeOf<PageOf<RevisionsResponse>>().toExtend<ApiPageIdentity>();
// @ts-expect-error prop=links was not requested
void (null as unknown as PageOf<RevisionsResponse>).links;

// == The same through a pipe-joined request value ==

declare const pipeReq: QueryStringRequest<"revisions|links">;

async function readPipe() {
  return api.get(pipeReq);
}

type PipeResponse = Awaited<ReturnType<typeof readPipe>>;
expectTypeOf<PageOf<PipeResponse>["revisions"]>().toEqualTypeOf<ApiPage["revisions"]>();
expectTypeOf<PageOf<PipeResponse>["links"]>().toEqualTypeOf<ApiPage["links"]>();
// @ts-expect-error prop=categories was not requested
void (null as unknown as PageOf<PipeResponse>).categories;

// == Actions: postWithEditToken returns that action's response ==

declare const editReq: ActionRequestFor<"edit">;

async function writeEdit() {
  return api.postWithEditToken(editReq);
}

type EditResponse = Awaited<ReturnType<typeof writeEdit>>;
expectTypeOf<EditResponse>().toHaveProperty("edit");
// @ts-expect-error action=edit returns no move object
void (null as unknown as EditResponse).move;

// == The facade: literals gated at the argument, responses inferred ==

declare const facade: mwParams.Api;

async function facadeLiteral() {
  return facade.get({ action: "query", prop: "revisions", titles: "T", rvprop: ["ids"] });
}

type FacadeRevisions = Awaited<ReturnType<typeof facadeLiteral>>;
expectTypeOf<PageOf<FacadeRevisions>["revisions"]>().toEqualTypeOf<ApiPage["revisions"]>();
// @ts-expect-error prop=links was not requested
void (null as unknown as PageOf<FacadeRevisions>).links;

// Gating reports on the argument itself, not merely on the response.
// @ts-expect-error misspelled envelope parameter
facade.get({ action: "query", prop: "revisions", tials: "T" });
// @ts-expect-error action=edit requires token
facade.post({ action: "edit", pageid: 1, text: "x" });
// @ts-expect-error `from` belongs to action=move
facade.post({ action: "edit", pageid: 1, text: "x", token: "+\\", from: "Other" });

async function facadeAction() {
  return facade.post({ action: "edit", pageid: 1, text: "x", token: "+\\" });
}
type FacadeEdit = Awaited<ReturnType<typeof facadeAction>>;
expectTypeOf<FacadeEdit>().toHaveProperty("edit");
expectTypeOf<FacadeEdit>().not.toHaveProperty("move");

// A `defineQuery` result keeps flowing through.
async function facadeDefined() {
  return facade.get(defineQuery({ action: "query", prop: "links", titles: "T" }));
}
expectTypeOf<PageOf<Awaited<ReturnType<typeof facadeDefined>>>["links"]>().toEqualTypeOf<
  ApiPage["links"]
>();

// Everything else on mw.Api survives the swap.
expectTypeOf(facade.getEditToken).toBeFunction();
expectTypeOf(facade.getUserInfo).toBeFunction();

// == Obtaining the facade needs no assertion ==

// The merged interface repeats the gated signatures on the class itself, so the
// instance satisfies the facade outright and the documented annotation form
// compiles. Keep the two hand-written method lists in step, or this stops
// compiling with them.
const directFacade: mwParams.Api = new mw.Api();
expectTypeOf(directFacade.getEditToken).toBeFunction();

// == Documented limit: a literal is still claimed by mw.Api's own signature ==

async function literalStaysLoose() {
  return api.get({ action: "query", prop: "revisions", rvprop: "ids", tials: "Main Page" });
}

type LooseResponse = Awaited<ReturnType<typeof literalStaysLoose>>;
// Not gated (the typo passed), not projected: `ApiResponse` is `Record<string, any>`.
expectTypeOf<LooseResponse["query"]>().toBeAny();
expectTypeOf<LooseResponse["anyTypoAtAll"]>().toBeAny();
