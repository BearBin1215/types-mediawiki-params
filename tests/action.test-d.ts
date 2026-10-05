/**
 * Gating regression tests for `ActionRequest` — the non-query actions.
 *
 * `ActionRequest` is a discriminated union keyed by the `action` literal, so
 * these need no generics: an object literal must fully match one covered
 * action's parameter set.
 */
import { expectTypeOf } from "expect-type";
import type { ActionParams, ActionRequest, ActionRequestFor } from "../src";

declare function apiAction(params: ActionRequest): void;

// == Valid requests compile ==

apiAction({ action: "clearhasmsg" });
apiAction({ action: "purge", titles: "Main Page" });
apiAction({ action: "compare", fromtitle: "A", totitle: "B" });
apiAction({
  action: "edit",
  pageid: 1,
  text: "New content",
  summary: "Test edit",
  token: "+\\",
  minor: true,
});
apiAction({ action: "parse", page: "Main Page", prop: ["text", "langlinks"] });

// == Gating ==

// Misspelled action name.
// @ts-expect-error "editt" is not a covered action
apiAction({ action: "editt", text: "x" });

// Another action's parameter.
// @ts-expect-error srsearch belongs to list=search
apiAction({ action: "edit", text: "x", token: "+\\", srsearch: "y" });

// Another ACTION's parameter that really exists elsewhere in the union
// (move's `from` next to action=edit): the action discriminant narrows
// excess-property checking to the edit branch.
// @ts-expect-error from belongs to action=move
apiAction({ action: "edit", pageid: 1, text: "x", token: "+\\", from: "Other" });

// A required parameter left out — write actions require their token.
// @ts-expect-error action=edit requires token
apiAction({ action: "edit", text: "x" });

// An unknown parameter.
// @ts-expect-error txet is not an edit parameter
apiAction({ action: "edit", pageid: 1, txet: "x", token: "+\\" });

// A value outside a parameter's enum.
// @ts-expect-error watchlist takes no "sometimes"
apiAction({ action: "edit", pageid: 1, token: "+\\", watchlist: "sometimes" });

// The response envelope is pinned: these types pair up with the formatversion=2
// response shapes of types-mediawiki-response.
// @ts-expect-error formatversion is pinned to "2"
apiAction({ action: "clearhasmsg", formatversion: "1" });
// @ts-expect-error formatversion is pinned to "2"
apiAction({ action: "clearhasmsg", formatversion: "latest" });
apiAction({ action: "clearhasmsg", formatversion: "2" });

// == Shape assertions ==

// The registry is keyed by action name.
expectTypeOf<ActionParams>().toHaveProperty("edit");
expectTypeOf<ActionParams>().toHaveProperty("parse");

// Requiredness survives the union: ApiEditParams["token"] has no `?`.
expectTypeOf<ActionRequestFor<"edit">["token"]>().toEqualTypeOf<string>();

// The pinned envelope collapses to the single modelled formatversion.
expectTypeOf<ActionRequestFor<"edit">["formatversion"]>().toEqualTypeOf<"2" | undefined>();

// Site-state parameters (applied tags) are open strings.
expectTypeOf<ActionRequestFor<"edit">["tags"]>().toEqualTypeOf<string | string[] | undefined>();

// == 1.47 core additions (source-verified in wmf/1.47.0-wmf.22, org whitelist) ==

apiAction({ action: "logout", global: true, token: "+\\" });
// @ts-expect-error global belongs to logout, not edit
apiAction({ action: "edit", global: true });
apiAction({ action: "upload", autotext: true, license: "CC-BY-SA", token: "+\\" });
