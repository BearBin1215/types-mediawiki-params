/**
 * Gating regression tests for `QueryRequest`.
 *
 * The `@ts-expect-error` cases are the failure modes observed with
 * types-mediawiki-api 2.0.0 (open index signature, no module correlation,
 * nothing required): each of them compiled there and fails here. They are
 * pinned so the gating cannot silently regress.
 */
import { expectTypeOf } from "expect-type";
import type {
  QueryListParams,
  QueryMetaParams,
  QueryPropParams,
  QueryRequest,
  QueryStringRequest,
  QueryGeneratorParams,
} from "../src";
import type { ApiLimit, OneOrMore, PipeSource } from "../src/common";

/** The entry a wrapper author writes — mirrors the documented generic signature. */
declare function apiQuery<
  P extends keyof QueryPropParams & string = never,
  L extends keyof QueryListParams & string = never,
  M extends keyof QueryMetaParams & string = never,
  G extends keyof QueryGeneratorParams & string = never,
>(params: QueryRequest<P, L, M, G>): void;

// == Valid requests compile ==

apiQuery({ action: "query", prop: "revisions", titles: "Main Page", rvprop: ["ids", "timestamp"] });
apiQuery({ action: "query", prop: ["revisions", "links"], rvprop: "ids", plnamespace: 0 });
apiQuery({ action: "query", list: "search", srsearch: "Main Page" });
apiQuery({ action: "query", meta: ["siteinfo", "userinfo"], siprop: "general", uiprop: "rights" });

const selected: ("revisions" | "links")[] = ["revisions", "links"];
apiQuery({ action: "query", prop: selected, titles: "Main Page" });

// == Gating regressions (all compiled against types-mediawiki-api 2.0.0) ==

// Parameter name typo — the open index signature swallowed it there.
// @ts-expect-error unknown parameter names are excess properties
apiQuery({ action: "query", list: "allpages", tials: "Main Page" });
// @ts-expect-error even inside the selected module, a typo'd parameter is excess
apiQuery({ action: "query", list: "allpages", apdri: "ascending" });

// A module's parameters without selecting its module.
// @ts-expect-error rvprop requires prop=revisions
apiQuery({ action: "query", titles: "Main Page", rvprop: "ids" });

// Another module's parameter next to a selection.
// @ts-expect-error plnamespace belongs to prop=links
apiQuery({ action: "query", prop: "revisions", plnamespace: 0 });

// A required parameter left out.
// @ts-expect-error list=search requires srsearch
apiQuery({ action: "query", list: "search" });

// A value outside the parameter's enum.
// @ts-expect-error apnamespace takes namespace ids
apiQuery({ action: "query", list: "allpages", apnamespace: "Main" });

// Pipe-joined strings are not array-form selectors — the array-form entry
// takes arrays; pipes go through QueryStringRequest (see below).
// @ts-expect-error "revisions|links" is not a module name
apiQuery({ action: "query", prop: "revisions|links", titles: "Main Page" });

// An unknown module name.
// @ts-expect-error "revisionz" is not a covered prop module
apiQuery({ action: "query", prop: "revisionz", titles: "Main Page" });

// Envelope pinning: response types assume formatversion=2.
// @ts-expect-error formatversion is pinned to "2" on query requests
apiQuery({ action: "query", formatversion: "1" });

// == String-form selectors (pipe-joined): identical gating, wire-form input ==

declare function apiQueryString<
  SP extends PipeSource<keyof QueryPropParams & string> = never,
  SL extends PipeSource<keyof QueryListParams & string> = never,
  SM extends PipeSource<keyof QueryMetaParams & string> = never,
  G extends keyof QueryGeneratorParams & string = never,
>(params: QueryStringRequest<SP, SL, SM, G>): void;

// Segments recover the module union: rv* and pl* both gate in.
apiQueryString({
  action: "query",
  prop: "revisions|links",
  titles: "Main Page",
  rvprop: "ids",
  plnamespace: 0,
});

// @ts-expect-error typo'd parameter of a pipe-selected module
apiQueryString({ action: "query", prop: "revisions|links", rvpropp: "ids" });

// @ts-expect-error cross-module leak: apfrom belongs to list=allpages
apiQueryString({ action: "query", prop: "revisions|links", apfrom: "X" });

// @ts-expect-error an invalid segment (sentinel property names the union)
apiQueryString({ action: "query", prop: "revisions|revisionz" });

// == Shape assertions ==

expectTypeOf<QueryRequest<"revisions">["rvprop"]>().toEqualTypeOf<
  | OneOrMore<
      | "comment"
      | "content"
      | "contentmodel"
      | "flags"
      | "ids"
      | "parsedcomment"
      | "roles"
      | "sha1"
      | "size"
      | "slotsha1"
      | "slotsize"
      | "tags"
      | "timestamp"
      | "user"
      | "userid"
      | "parsetree"
    >
  | undefined
>();

// Requiredness is real: no `undefined` sneaks into the type of srsearch.
expectTypeOf<QueryRequest<never, "search">["srsearch"]>().toEqualTypeOf<string>();

// Both shapes pin the envelope to the formatversion the response types model
// (`ApiBaseParams`' wider union never reaches the request).
expectTypeOf<QueryRequest["formatversion"]>().toEqualTypeOf<"2" | undefined>();
expectTypeOf<QueryStringRequest["formatversion"]>().toEqualTypeOf<"2" | undefined>();

// == Generator parameter correlation ==

// A generator-capable module selected via `generator` unlocks its own
// parameters in generator wire form (`ap*` → `gap*`).
apiQuery({ action: "query", generator: "allpages", gaplimit: 5, gapprefix: "Foo" });
apiQuery({ action: "query", generator: "search", gsrsearch: "X", gsrlimit: 10, prop: "revisions" });

// @ts-expect-error the generator module's non-generator form stays out (`apfrom` is for list=allpages)
apiQuery({ action: "query", generator: "allpages", apfrom: "X" });

// @ts-expect-error generator parameters without a generator selected
apiQuery({ action: "query", gaplimit: 5 });

// @ts-expect-error generator correlation applies: `list=search` demands srsearch (→ gsrsearch)
apiQuery({ action: "query", generator: "search" });

// @ts-expect-error not every module can be a generator (prop=info cannot)
apiQuery({ action: "query", generator: "info" });

// @ts-expect-error unknown generator module
apiQuery({ action: "query", generator: "allpagez" });

// The generator wire form renames, does not loosen: gaplimit keeps aplimit's type.
expectTypeOf<QueryRequest<never, never, never, "allpages">["gaplimit"]>().toEqualTypeOf<
  ApiLimit | undefined
>();

// == 1.47 core additions (source-verified, org whitelist) ==

apiQuery({ action: "query", meta: "siteinfo", siprop: "crosssiteajaxdomains" });
apiQuery({ action: "query", meta: "languageinfo", liprop: ["namespacenames", "digittransforms"] });
