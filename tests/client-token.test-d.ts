/**
 * Tests for `ClientToken`: the token-named parameter of a request handed to
 * `mw.Api`'s token-injecting method (`postWithToken`) becomes optional, while
 * every other gate holds.
 */
import { defineActionWithToken } from "../src/define";
import type { ClientToken } from "../src/common";
import type { ActionRequest } from "../src/index";

/** Mirrors types-mediawiki's `mw.Api` parameter record. */
type UnknownApiParams = Record<string, string | number | boolean | string[] | number[] | undefined>;
declare const postWithToken: (tokenType: string, parameters: UnknownApiParams) => void;

declare const pageid: number;
declare const text: string;
declare const summary: string;

// The `token` parameter is injected by mw.Api, so it is optional here.
postWithToken("csrf", {
  action: "edit",
  pageid,
  text,
  summary,
} satisfies ClientToken<ActionRequest>);

// The same type covers another token name (`logintoken`).
postWithToken("login", { action: "clientlogin" } satisfies ClientToken<ActionRequest>);

// An explicit token is still accepted.
postWithToken("csrf", {
  action: "edit",
  pageid,
  text,
  summary,
  token: "+\\",
} satisfies ClientToken<ActionRequest>);

// A required non-token parameter is unaffected.
postWithToken("csrf", { action: "move", to: "New name" } satisfies ClientToken<ActionRequest>);

// @ts-expect-error another action's parameter
postWithToken("csrf", { action: "edit", pageid, reason: "x" } satisfies ClientToken<ActionRequest>);
// @ts-expect-error required `to` missing
postWithToken("csrf", { action: "move" } satisfies ClientToken<ActionRequest>);
// @ts-expect-error unknown action
postWithToken("csrf", { action: "editt", pageid } satisfies ClientToken<ActionRequest>);

// Through `defineActionWithToken`: same gating, token optional.
postWithToken("csrf", defineActionWithToken({ action: "edit", pageid, text, summary }));
postWithToken("login", defineActionWithToken({ action: "clientlogin" }));
// @ts-expect-error another action's parameter
postWithToken("csrf", defineActionWithToken({ action: "edit", pageid, reason: "x" }));
