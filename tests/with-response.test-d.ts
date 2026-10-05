/**
 * Request → response correlation tests for the `./with-response` subpath: the
 * query projection and the action-side lookup. The response package is an
 * optional peer; these tests run against the devDependency install.
 */
import { expectTypeOf } from "expect-type";
import type {
  ApiBlockResponse,
  ApiClearHasMsgResponse,
  ApiEditResponse,
  ApiPage,
  ApiPageIdentity,
  ApiParseResponse,
  ApiQueryResponse,
  ApiUnblockResponse,
  ApiUploadResponse,
} from "types-mediawiki-response";

import { defineAction, defineQuery } from "../src/define";
import type { ActionParams, ActionRequest, ActionRequestFor } from "../src";
import type { PipeSplit } from "../src/common";
import type {
  ActionResponseFor,
  ActionResponseOf,
  ActionWithResponse,
  QueryResponseFor,
  QueryResponseOf,
} from "../src/with-response";

/** Page entry type of a (projected or merged) query response. */
type PageOf<R> = R extends { query: { pages?: (infer U)[] | undefined } } ? U : never;

// == Single prop: pages project to the requested module ==

type RevisionsPage = PageOf<QueryResponseFor<"revisions">>;
expectTypeOf<RevisionsPage["revisions"]>().toEqualTypeOf<ApiPage["revisions"]>();
expectTypeOf<RevisionsPage>().toExtend<ApiPageIdentity>();
expectTypeOf<RevisionsPage["index"]>().toEqualTypeOf<ApiPage["index"]>();
expectTypeOf<RevisionsPage>().not.toHaveProperty("links");

// == Several props: the fields of all selected modules are present ==

type BothPage = PageOf<QueryResponseFor<"revisions" | "links">>;
expectTypeOf<BothPage["revisions"]>().toEqualTypeOf<ApiPage["revisions"]>();
expectTypeOf<BothPage["links"]>().toEqualTypeOf<ApiPage["links"]>();
expectTypeOf<BothPage>().not.toHaveProperty("categories");

// == Non-projectable selection degrades to the merged response ==

// prop=info writes its fields directly onto the page object (no `info` key);
// projecting would silently drop them, so the merged view is kept.
expectTypeOf<QueryResponseFor<"info">>().toEqualTypeOf<ApiQueryResponse>();
expectTypeOf<QueryResponseFor<"revisions" | "info">>().toEqualTypeOf<ApiQueryResponse>();

// == Inference from a request type (the wrapper author's loop) ==

const req = defineQuery({ action: "query", prop: "revisions", titles: "X", rvprop: ["ids"] });
expectTypeOf<PageOf<QueryResponseOf<typeof req>>["revisions"]>().toEqualTypeOf<
  ApiPage["revisions"]
>();
expectTypeOf<PageOf<QueryResponseOf<typeof req>>>().not.toHaveProperty("links");

type Wrapped<Req> = { request: Req; response: QueryResponseOf<Req> };
expectTypeOf<PageOf<Wrapped<typeof req>["response"]>>().toEqualTypeOf<
  PageOf<QueryResponseFor<"revisions">>
>();

// == Pipe-joined selectors: split back into the union, then projected ==

const pipeReq = defineQuery({ action: "query", prop: "revisions|links", titles: "X" });
expectTypeOf<PageOf<QueryResponseOf<typeof pipeReq>>["revisions"]>().toEqualTypeOf<
  ApiPage["revisions"]
>();
expectTypeOf<PageOf<QueryResponseOf<typeof pipeReq>>["links"]>().toEqualTypeOf<ApiPage["links"]>();
expectTypeOf<PageOf<QueryResponseOf<typeof pipeReq>>>().not.toHaveProperty("categories");

// Manual split also works: PipeSplit feeds QueryResponseFor directly.
expectTypeOf<PageOf<QueryResponseFor<PipeSplit<"revisions|links">>>["links"]>().toEqualTypeOf<
  ApiPage["links"]
>();

// == Action side: the `action` literal looks the response type up ==

expectTypeOf<ActionResponseFor<"edit">>().toEqualTypeOf<ApiEditResponse>();
expectTypeOf<ActionResponseFor<"upload">>().toEqualTypeOf<ApiUploadResponse>();
expectTypeOf<ActionResponseFor<"parse">>().toEqualTypeOf<ApiParseResponse>();

// The payload is keyed by the action it came from. `action=unblock`'s response
// type lives next to block's in the response package.
expectTypeOf<ActionResponseFor<"block">>().toEqualTypeOf<ApiBlockResponse>();
expectTypeOf<ActionResponseFor<"unblock">>().toEqualTypeOf<ApiUnblockResponse>();
expectTypeOf<ActionResponseFor<"block">>().toHaveProperty("block");

// == The mapping covers exactly the actions the response package models ==

// Every mapped key is a covered action of this package.
expectTypeOf<ActionWithResponse>().toExtend<keyof ActionParams & string>();

// The four without a response type there stay out of the mapping even with
// every extension pack active (the in-repo program activates all packs).
// The exact "nothing else is left out" equality for the core-only program is
// pinned in the consumer harness (scripts/check-ext-consumer.ts).
type UnmappedCore = "cspreport" | "linkaccount" | "paraminfo" | "unlinkaccount";
expectTypeOf<Exclude<UnmappedCore, ActionWithResponse>>().toEqualTypeOf<UnmappedCore>();

// == Inference from a request type ==

expectTypeOf<ActionResponseOf<ActionRequestFor<"edit">>>().toEqualTypeOf<ApiEditResponse>();

const editReq = defineAction({ action: "edit", pageid: 1, text: "x", token: "+\\" });
expectTypeOf<ActionResponseOf<typeof editReq>>().toEqualTypeOf<ApiEditResponse>();

type ActionWrapped<Req> = { request: Req; response: ActionResponseOf<Req> };
expectTypeOf<ActionWrapped<typeof editReq>["response"]>().toEqualTypeOf<ApiEditResponse>();

// The documented wrapper signature works end to end: `Req` inferred from the
// literal at the call site still recovers the action's response type.
declare function postWrapper<Req extends ActionRequest>(params: Req): ActionResponseOf<Req>;
expectTypeOf(postWrapper({ action: "clearhasmsg" })).toEqualTypeOf<ApiClearHasMsgResponse>();

// An action with no modelled response projects to `never`, so it drops out of a
// wide request union instead of widening it to `unknown`.
expectTypeOf<
  ActionResponseOf<{ action: "edit" } | { action: "cspreport" }>
>().toEqualTypeOf<ApiEditResponse>();

// The mapping keys on `action` alone: `onlypst=1` keeps the full parse response.
const pstReq = defineAction({ action: "parse", text: "x", onlypst: true });
expectTypeOf<ActionResponseOf<typeof pstReq>>().toEqualTypeOf<ApiParseResponse>();

// == Generator-carrying requests project too (structural array fallback) ==

// The exact-set first branch stays at three type parameters (inferring the
// generator would re-introduce a deferred conditional); a request with a
// generator falls through to the structural `prop` match.
const genReq = defineQuery({
  action: "query",
  generator: "allpages",
  gaplimit: 5,
  prop: "revisions",
});
expectTypeOf<PageOf<QueryResponseOf<typeof genReq>>["revisions"]>().toEqualTypeOf<
  ApiPage["revisions"]
>();
