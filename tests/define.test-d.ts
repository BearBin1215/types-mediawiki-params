/**
 * Tests for the `./define` identity helpers: the inferred literal selectors
 * keep their gating, and the results stay assignable to `mw.Api`'s parameter
 * record (`UnknownApiParams`) — that assignability is the reason `OneOrMore`
 * only allows mutable arrays.
 */
import { defineAction, defineQuery } from "../src/define";

/** Mirrors types-mediawiki's `mw.Api.get` parameter record (a type alias). */
type UnknownApiParams = Record<string, string | number | boolean | string[] | number[] | undefined>;

declare function mwApiGet(parameters: UnknownApiParams): void;

// == defineQuery: selectors infer, gating applies ==

mwApiGet(
  defineQuery({
    action: "query",
    prop: "revisions",
    titles: "Main Page",
    rvprop: ["ids", "timestamp"],
  }),
);
mwApiGet(defineQuery({ action: "query", list: "search", srsearch: "Main Page" }));

// Pipe-joined selectors route to the string overload — same gating, wire form.
mwApiGet(
  defineQuery({
    action: "query",
    prop: "revisions|links",
    titles: "X",
    rvprop: "ids",
    plnamespace: 0,
  }),
);
// @ts-expect-error a required parameter of a pipe-selected module (srsearch)
mwApiGet(defineQuery({ action: "query", prop: "search|allpages" }));
// @ts-expect-error an invalid pipe segment
mwApiGet(defineQuery({ action: "query", prop: "revisionz|links" }));

// @ts-expect-error another module's parameter
mwApiGet(defineQuery({ action: "query", prop: "revisions", plnamespace: 0 }));
// @ts-expect-error required srsearch missing
mwApiGet(defineQuery({ action: "query", list: "search" }));

// == defineAction: the action literal selects the parameter set ==

mwApiGet(defineAction({ action: "clearhasmsg" }));
mwApiGet(defineAction({ action: "edit", pageid: 1, text: "x", token: "+\\" }));
mwApiGet(defineAction({ action: "block", user: "Example", token: "+\\" }));

// @ts-expect-error another action's parameter
mwApiGet(defineAction({ action: "edit", pageid: 1, text: "x", token: "+\\", reason: "y" }));
// @ts-expect-error required token missing
mwApiGet(defineAction({ action: "edit", pageid: 1, text: "x" }));
