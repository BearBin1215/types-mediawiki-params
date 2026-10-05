# types-mediawiki-params

English | [简体中文](README.zh.md)

TypeScript types for MediaWiki Action API request parameters — the request-side sibling of [types-mediawiki-response](https://github.com/BearBin1215/types-mediawiki-response).

- **Closed by design**: only the parameters declared for the modules you select are accepted; a wrong name is a compile error, not a key the API quietly ignores.
- **Required is required**: omitting a parameter the API requires is a compile error.
- **Enum values**: enum fields are well supported, split into closed and open by how extensible they are.
- **JSDoc coverage**: every field carries a JSDoc description, visible on hover in your IDE.
- **Cross-version**: the parameter union of MediaWiki 1.39–1.47, version facts as `@since` / `@deprecated` tags.
- **Pure types**: only `./define` ships an implementation (two identity functions); nothing here reaches your bundle.

## Installation

```bash
npm install -D types-mediawiki-params
```

| Import                          | Contents                                                      |
| ------------------------------- | ------------------------------------------------------------- |
| `types-mediawiki-params`        | request parameter types (declarations only)                   |
| `types-mediawiki-params/ext/*`  | opt-in extension parameter packs                              |
| `types-mediawiki-params/define` | `defineQuery` / `defineAction` — the only file with a runtime |

## Usage

### Plain literals — `satisfies`

`satisfies` checks the literal against the request type and leaves the value as written, so `mw.Api`'s parameter record accepts it unchanged:

```ts
import type { ActionRequest, QueryRequest } from "types-mediawiki-params";

api.get({
  action: "query",
  prop: "revisions",
  titles,
  rvprop: ["ids", "timestamp"],
} satisfies QueryRequest<"revisions">);

api.post({
  action: "parse",
  text: "{{Template}}",
} satisfies ActionRequest);
```

- For a query, name the selected modules in the type argument.
- For a non-query action, the discriminated `ActionRequest` union needs none — the `action` literal picks the member.

A misspelled parameter, another module's parameter, or a missing required one fails at the `satisfies`.

### Identity helpers

`defineAction` and `defineQuery` validate the literal against the request type and return the same object, typed so `mw.Api`'s parameter record accepts it:

```ts
import { defineAction, defineQuery } from "types-mediawiki-params/define";

api.get(defineQuery({ action: "query", prop: "revisions", titles, rvprop: ["ids", "timestamp"] }));
api.post(defineAction({ action: "parse", text: "{{Template}}" }));
```

What they add over `satisfies` is inference — the module selectors are read off the literal, so `QueryRequest<…>` never has to be written out.

Required parameters cannot be omitted — the types reflect what the API requires. Only when using a token-injecting method such as `postWithToken` do you switch to `ClientToken` (below) instead of a placeholder.

## Usage notes

### Client-injected tokens — `ClientToken`

`mw.Api`'s `postWithToken( tokenType, { ...params })` fetches and injects the token itself, so the request handed to it carries none. `ClientToken` makes that parameter optional and leaves every other constraint in place:

```ts
import type { ActionRequest, ClientToken } from "types-mediawiki-params";

api.postWithToken("csrf", {
  action: "edit",
  pageid,
  text,
  summary,
} satisfies ClientToken<ActionRequest>);
```

Token-named parameters are detected automatically: `token`, `logintoken` and the like become optional and may be omitted. Using `satisfies ActionRequest` directly would make TypeScript complain that `token` is missing.

With the identity helpers, use `defineActionWithToken` in place of `defineAction` to make the token optional:

```ts
api.postWithToken(
  "csrf",
  defineActionWithToken({
    action: "edit",
    pageid,
    text,
  }),
);
```

### `generator=` correlation

Any module paraminfo flags as generator-capable can be used as `generator=`. Selecting one unlocks its parameters in generator wire form — the original prefix with a `g` prepended: `ap*` → `gap*` (`aplimit` → `gaplimit`), `sr*` → `gsr*` (`srsearch` → `gsrsearch`), and so on.

```ts
defineQuery({
  action: "query",
  generator: "allpages", // prop=info or a typo fails to compile
  gaplimit: 5,
  gapprefix: "Template:",
  prop: "revisions",
  rvprop: ["ids", "timestamp"],
});
```

Without `generator: "allpages"`, the `gap*` parameters are unknown — the correlation runs both ways. Required parameters stay required in generator form.

If you wrap the request in your own generic function, keep the fourth type parameter `G extends GeneratorNames` (matching `QueryRequest`'s fourth parameter) so the `generator` field takes part in inference.

### Pipe-joined selectors

The wire form (`prop=revisions|links`, what actually goes to the server) is handled by `QueryStringRequest`, which splits the string back into the module union at the type level; the constraints match the array form exactly:

```ts
api.get(
  defineQuery({
    action: "query",
    prop: "revisions|links",
    titles,
    rvprop: "ids",
    plnamespace: 0,
  }),
);
```

A segment that is not a covered module (e.g. `revisions|revisionz`) fails to compile and names the offending module.

`defineQuery` routes on the shape: a selector containing `|` goes to the string overload. Both `rv*` and `pl*` are available, nothing else is.

The two forms are not interchangeable: `prop: "revisions|links"` on `QueryRequest` is an error, and `prop: ["revisions", "links"]` on `QueryStringRequest` is one too.

The array form accepts mutable arrays only (`string[]`); `as const` / readonly arrays are not accepted, since they could not be handed to `mw.Api` directly. To pass a readonly array, copy it first (`[...items]`).

### Extension parameters — `./ext/*`

This package covers extension modules. The opt-in packs under `./ext/*` put extension modules under the same rules — same closed enums, same required flags — without touching the default export:

```ts
import type {} from "types-mediawiki-params/ext/flaggedrevs";

api.post({
  action: "review",
  revid: "12345",
  comment: "Ok",
  flag_accuracy: "1", // levels are per-wiki config ($wgFlaggedRevsTags)
  token: "+\\",
});
```

- Activation is a single import — of the pack file (`import type {}`), or of any parameter interface you use from it. Importing nothing keeps the extension's modules out of the unions, so on a wiki without the extension `action=review` is an unknown module instead of a silently accepted request.
  - A `.d.ts` inside the tsconfig `include` range is a convenient home for that import: `import type {} from "types-mediawiki-params/ext/xxx"` then activates the pack project-wide.
- 30 packs, one file per extension, 69 modules total, including each extension's query modules such as `meta=notifications` and `prop=videoinfo`.
- Extension packs are single-version facts with no cross-version union, so no cross-version `@since` is claimed. Config-gated registrations (Echo's `echoarticlereminder` / `echopushsubscriptions`) say so in their docs.

### Parameters this package does not model — `ApiRawParams`

```ts
import type { ApiRawParams, QueryRequest } from "types-mediawiki-params";

const params: ApiRawParams & QueryRequest<"revisions"> = {
  action: "query",
  prop: "revisions",
  titles,
  someExtensionParam: "value", // reaches the API untyped, visibly so
};
```

The parameter types deliberately reject arbitrary keys (`[key: string]: any`), so the escape hatch is an explicit intersection like `ApiRawParams & QueryRequest<…>`, letting the request carry fields this package does not define.

### `formatversion=2`

Every request entry pins `formatversion?: "2"` so a request typed here always asks for the v2 wire format. `ApiBaseParams` still declares `"1" | "2" | "latest"` for anyone composing their own envelope type.

## What does not compile

These request shapes are all errors this package catches at compile time:

| Request                                                | Why it fails                                         |
| ------------------------------------------------------ | ---------------------------------------------------- |
| `{ list: "allpages", tials: "Main Page" }`             | envelope parameter misspelled                        |
| `{ list: "allpages", apdri: "ascending" }`             | module parameter misspelled                          |
| `{ titles, rvprop: "ids" }`                            | `rv*` used without selecting `prop=revisions`        |
| `{ prop: "revisions", plnamespace: 0 }`                | `pl*` belongs to `prop=links`                        |
| `{ list: "search" }`                                   | required `srsearch` missing                          |
| `{ list: "allpages", apnamespace: "Main" }`            | value outside the parameter's enum                   |
| `{ prop: "revisionz" }`                                | unknown module name                                  |
| `{ prop: "revisions\|links" }` on the array-form entry | pipe-joined selectors belong to `QueryStringRequest` |
| `{ action: "edit", pageid: 1, from: "Other" }`         | `from` belongs to `action=move`                      |
| `{ gaplimit: 5 }` (no `generator`)                     | `gap*` belongs to `generator=allpages`               |
| `{ generator: "info" }`                                | `prop=info` cannot act as a generator                |

## Related packages

- [types-mediawiki-response](https://github.com/BearBin1215/types-mediawiki-response) — the response side; keyed module-for-module against this package.

## Contributing

This package's core code is AI-generated, cross-checked by reading the sources and by hitting locally hosted wikis; the workload is large, so hand-writing it is not advised. To contribute, set up the same environment and hand the work to AI as well.

## License

[MIT](https://github.com/BearBin1215/types-mediawiki-params/blob/main/LICENSE) © [BearBin](https://github.com/BearBin1215)
