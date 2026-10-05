/**
 * Extension pack behavior, in-repo (this program activates every pack under
 * src/extensions/, since tsconfig includes the whole src tree):
 *
 *  - activated packs join the query module unions and the `ActionRequest`
 *    discriminated union with the same gating as core modules: module
 *    correlation, closed enums, required parameters;
 *  - the audit-side facts (per-snapshot parameter sets, registry landing
 *    spots) are checked by `pnpm audit:paraminfo --ext`;
 *  - packs are request-only: ext actions are not in `ActionWithResponse`, and
 *    wide-union response inference drops them instead of degrading.
 *
 * Activation/isolation/specificity against the *published* package — where
 * packs are opt-in — is the consumer harness's job (scripts/check-ext-consumer.ts).
 */
import { expectTypeOf } from "expect-type";
import type {
  ActionRequest,
  ActionRequestFor,
  QueryListParams,
  QueryMetaParams,
  QueryPropParams,
  QueryRequest,
  QueryStringRequest,
} from "../src";
import type { PipeSource } from "../src/common";
import { defineQuery } from "../src/define";
import type { ActionResponseOf } from "../src/with-response";

/** The entry a wrapper author writes — mirrors the documented generic signature. */
declare function apiQuery<
  P extends keyof QueryPropParams & string = never,
  L extends keyof QueryListParams & string = never,
  M extends keyof QueryMetaParams & string = never,
>(params: QueryRequest<P, L, M>): void;

declare function apiQueryString<SP extends PipeSource<keyof QueryPropParams & string> = never>(
  params: QueryStringRequest<SP>,
): void;

// == Extension modules gate like core modules ==

// CheckUser: required selector `curequest` and `cutoken` (the module-specific
// checkuser token), then its own parameters.
apiQuery({
  action: "query",
  list: "checkuser",
  curequest: "ipusers",
  cutarget: "ExampleUser",
  cutoken: "abc123",
});
apiQuery({
  action: "query",
  list: ["checkuser", "checkuserlog"],
  curequest: "ipusers",
  cutarget: "ExampleUser",
  cutoken: "abc123",
  culimit: "max",
});
apiQuery({
  action: "query",
  list: "checkuser",
  curequest: "ipusers",
  cutoken: "abc123",
  // @ts-expect-error another module's parameter (rvprop belongs to prop=revisions)
  rvprop: "ids",
});
// @ts-expect-error typo'd module name
apiQuery({ action: "query", list: "checkuser2", curequest: "ipusers" });
// @ts-expect-error missing required curequest/cutarget
apiQuery({ action: "query", list: "checkuser", cutoken: "abc123" });
// @ts-expect-error closed enum: not a curequest value
apiQuery({ action: "query", list: "checkuser", curequest: "ipuserz", cutoken: "abc123" });

// Pipe-string form gates the same way.
apiQueryString({ action: "query", prop: "pageimages", piprop: "thumbnail" });
// @ts-expect-error unknown segment in the pipe string
apiQueryString({ action: "query", prop: "pageimages|nonexistent" });

// Wikibase family (org-1.47 facts) behaves like any prop module.
apiQuery({ action: "query", prop: "pageterms", wbptterms: "label" });
apiQuery({ action: "query", prop: ["description", "pageterms"], wbptterms: "label" });

// == Action-side: ext actions enter the discriminated union ==

const review: ActionRequest = {
  action: "review",
  comment: "ok",
  flag_accuracy: "2",
  token: "+\\",
};
expectTypeOf(review).toHaveProperty("action");

// Cross-action parameter leakage is caught: `default` belongs to stabilize.
const wrongAction: ActionRequest = {
  action: "review",
  token: "+\\",
  // @ts-expect-error stabilize's required `default` is not review's
  default: "stable",
};
expectTypeOf(wrongAction).toHaveProperty("action");

// Missing required token fails.
const noToken: ActionRequest = {
  action: "review",
  comment: "ok",
  // @ts-expect-error token is required on review
  token: undefined,
};
expectTypeOf(noToken).toHaveProperty("action");

// Hyphenated module names work through the quoted registry keys; the
// config-gated registration is a JSDoc note, not a type-level fact.
const scribunto: ActionRequestFor<"scribunto-console"> = {
  action: "scribunto-console",
  question: "p()",
  token: "+\\",
};
expectTypeOf(scribunto).toHaveProperty("action");

// Site-state enums open up (review tags come from $wgFlaggedRevsTags):
// `flag_accuracy` takes any string, not just the capture wiki's levels.

// == Packs are request-only: with-response unchanged ==

// Ext actions are not in ActionResponseMap, so they drop out of
// ActionResponseOf as `never` — never widening the response type.
expectTypeOf<ActionResponseOf<ActionRequestFor<"review">>>().toEqualTypeOf<never>();

// defineQuery accepts ext modules like core ones.
const extReq = defineQuery({ action: "query", prop: "pageimages", piprop: "thumbnail" });
expectTypeOf(extReq).not.toBeNever();

// == The query-module coverage of already-modeled extensions ==

// Echo's meta=notifications (the extension's most-used module).
apiQuery({
  action: "query",
  meta: "notifications",
  notprop: ["list", "count"],
  notfilter: "!read",
  notlimit: 20,
});
// @ts-expect-error another module's parameter (rvprop belongs to prop=revisions)
apiQuery({ action: "query", meta: "notifications", notprop: "list", rvprop: "ids" });

// Babel's meta=babel: `babuser` is required (a user name).
apiQuery({ action: "query", meta: "babel", babuser: "Example" });
// @ts-expect-error babuser is required on meta=babel
apiQuery({ action: "query", meta: "babel" });
// @ts-expect-error another module's parameter (rvprop belongs to prop=revisions)
apiQuery({ action: "query", meta: "babel", babuser: "Example", rvprop: "ids" });

// AbuseFilter lists, GlobalBlocking list, TimedMediaHandler prop modules.
apiQuery({ action: "query", list: "abusefilters", abfstartid: 1 });
apiQuery({ action: "query", list: "globalblocks", bgaddresses: "1.2.3.4" });
apiQuery({ action: "query", prop: "videoinfo", titles: "File:V.ogv", viprop: "url" });
