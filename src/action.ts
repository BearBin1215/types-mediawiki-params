/**
 * Gated entry types for the non-query actions (`edit`, `parse`, `block`, …).
 *
 * `ActionRequest` is a union discriminated by the `action` literal: an object
 * must fully match one covered action's parameter set, so a misspelled action
 * name, another action's parameter, or a missing required parameter all fail
 * compilation without any generics.
 */
import type { ApiBaseParams } from "./common";
import type { ActionParams } from "./registry";

/**
 * The envelope every action request carries: {@link ApiBaseParams} with
 * `formatversion` pinned to `"2"` — the only wire format the sibling response
 * package (types-mediawiki-response) models, so a request typed against these
 * entries always yields a payload those response types describe. Same pinning
 * as `QueryRequest`.
 */
type ActionEnvelope = Omit<ApiBaseParams, "formatversion"> & { formatversion?: "2" };

/** A request to one of the covered non-query actions. */
export type ActionRequest = ActionEnvelope &
  {
    [A in keyof ActionParams]: { action: A } & ActionParams[A];
  }[keyof ActionParams];

/** A request to one specific non-query action. */
export type ActionRequestFor<A extends keyof ActionParams & string> = ActionEnvelope & {
  action: A;
} & ActionParams[A];
