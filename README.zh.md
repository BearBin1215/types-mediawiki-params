# types-mediawiki-params

[English](README.md) | 简体中文

MediaWiki Action API 请求参数的 TypeScript 类型库，与 [types-mediawiki-response](https://github.com/BearBin1215/types-mediawiki-response)（响应侧）成对。

- **封闭设计**：只接受随你所选模块声明的参数，编译期拦截错误参数。
- **必填校验**：漏掉 API 要求的参数即编译不过。
- **枚举取值**：枚举字段支持良好，按可扩展性分为封闭、开放。
- **JSDoc 覆盖**：每个字段都带 JSDoc 描述，IDE 悬停即文档。
- **跨版本**：覆盖 MediaWiki 1.39–1.47 的参数并集，版本事实以 `@since` / `@deprecated` 标注。
- **纯类型**：只有 `./define` 带实现（两个身份函数），包本身不会进入你的产物。

## 安装

```bash
npm install -D types-mediawiki-params
```

| 导入                            | 内容                                               |
| ------------------------------- | -------------------------------------------------- |
| `types-mediawiki-params`        | 请求参数类型（纯声明）                             |
| `types-mediawiki-params/ext/*`  | 可选启用的扩展参数包                               |
| `types-mediawiki-params/define` | `defineQuery` / `defineAction`，唯一带运行时的文件 |

## 用法

### 纯字面量：`satisfies`

使用 `satisfies` 按请求类型校验字面量、原样保留该值，`mw.Api` 的参数记录直接接受。

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

- query 要在类型参数里写明所选模块。
- 非 query 用判别联合 `ActionRequest`，无需类型参数，`action` 字面量自己挑成员。

拼错的参数、别的模块的参数、漏掉的必填参数都会在 `satisfies` 处报错。

### 身份函数

`defineAction`、`defineQuery` 按请求类型校验字面量，然后原样返回同一个对象，并把它标注成 `mw.Api` 参数记录可接受的形式。

```ts
import { defineAction, defineQuery } from "types-mediawiki-params/define";

api.get(defineQuery({ action: "query", prop: "revisions", titles, rvprop: ["ids", "timestamp"] }));
api.post(defineAction({ action: "parse", text: "{{Template}}" }));
```

相比 `satisfies`，身份函数提供推断功能，模块选择器直接从字面量读出，无需手写`QueryRequest<…>` 等类型。

必填参数不能省——类型反映的是 API 的要求。只有用 `postWithToken` 这类会注入 token 的方法时，才改用下面的 `ClientToken`，不必写占位值。

## 使用说明

### 客户端注入 token 时使用 `ClientToken`

`mw.Api` 提供的 `postWithToken( tokenType, { ...params })` 等方法会自己取并注入 token，`ClientToken` 把该参数变成可选，其余约束不变：

```ts
import type { ActionRequest, ClientToken } from "types-mediawiki-params";

api.postWithToken("csrf", {
  action: "edit",
  pageid,
  text,
  summary,
} satisfies ClientToken<ActionRequest>);
```

token 参数会被自动识别，`token`、`logintoken` 等变成可选，未传入时不会报错。直接使用 `satisfies ActionRequest` 会导致 TS 误认为缺少 `token` 参数。

用身份函数时，用 `defineActionWithToken` 替代 `defineAction`，使 token 可选：

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

### `generator` 参数相关性

凡可作生成器的模块都能用作 `generator=`。选中一个模块后，它的参数以生成器线格式解锁：原前缀前加 `g`：`ap*` → `gap*`（`aplimit` → `gaplimit`）、`sr*` → `gsr*`（`srsearch` → `gsrsearch`）等。

```ts
defineQuery({
  action: "query",
  generator: "allpages", // prop=info 或拼错的模块名都过不了编译
  gaplimit: 5,
  gapprefix: "Template:",
  prop: "revisions",
  rvprop: ["ids", "timestamp"],
});
```

不写 `generator: "allpages"` 时，`gap*` 参数是未知参数，相关性是双向的。必填在生成器形态下依旧必填。

若把请求包进自己的泛型函数，类型参数列表里要保留第四个 `G extends GeneratorNames`（对应 `QueryRequest` 的第四参数），`generator` 字段才能参与推断。

### 管道字符串形态的选择器

线格式（`prop=revisions|links`，真正向服务端发出的东西）走 `QueryStringRequest`，类型层先把字符串拆回模块联合，约束与数组形态完全一致：

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

字符串里若有本库未覆盖的模块名（如 `revisions|revisionz`），编译会报错并点出那个模块名。

`defineQuery` 按形态分流，选择器里含 `|` 就走字符串重载。此时 `rv*` 与 `pl*` 都可用，其余一概不可。

两种形态互不通用：`QueryRequest` 上写 `prop: "revisions|links"` 是错误，`QueryStringRequest` 上写 `prop: ["revisions", "links"]` 同样是错误。

数组形态只接受可变数组（`string[]`），`as const` / readonly 数组不被接受，否则无法直接交给 `mw.Api`；需要传入只读数组时应当复制一个对象再传入（`[...items]`）。

### 扩展参数：`./ext/*`

本包提供扩展模块。`./ext/*` 下的可选启用参数包把扩展模块接进同一套规则——同样的封闭枚举、同样的必填约束——且完全不碰默认导出：

```ts
import type {} from "types-mediawiki-params/ext/flaggedrevs";

api.post({
  action: "review",
  revid: "12345",
  comment: "Ok",
  flag_accuracy: "1", // 级别值随站点配置（$wgFlaggedRevsTags）而变
  token: "+\\",
});
```

- 激活只要一行导入包文件本身（`import type {}`），或从中引你正要用的参数接口。什么都不引，扩展模块就完全不进联合：没装该扩展的 wiki 上，`action=review` 是未知模块，而不是被默默放行的请求。
  - 推荐在 tsconfig 的 include 范围内放一个 .d.ts 文件，通过 `import type {} from "types-mediawiki-params/ext/xxx"` 引入对应扩展后对全项目生效。
- 共 30 个包，一扩展一文件，合计 69 个模块，含各扩展的 query 模块，如 `meta=notifications`、`prop=videoinfo`。
- 扩展包是单版本事实，没有跨版本并集，因此不声称跨版本的 `@since`。配置门控注册的模块（Echo 的 `echoarticlereminder` / `echopushsubscriptions`）会在文档里写明开关。

### 本库没建模的参数：`ApiRawParams`

```ts
import type { ApiRawParams, QueryRequest } from "types-mediawiki-params";

const params: ApiRawParams & QueryRequest<"revisions"> = {
  action: "query",
  prop: "revisions",
  titles,
  someExtensionParam: "value", // 未经类型化直达 API，且在调用处看得见
};
```

本库的参数类型故意不接受任意键 `[key: string]: any`，所以要用逃生门时，得显式写成 `ApiRawParams & QueryRequest<…>` 这样的交叉，用以让请求参数接受本包未定义的字段。

### `formatversion=2`

每个请求入口都钉住 `formatversion?: "2"`，让由本库类型描述的请求总是索取 v2 线格式。`ApiBaseParams` 仍保留 `"1" | "2" | "latest"`，供自行组合信封类型时使用。

## 编译不过的场景

以下写法都属于本包可以在编译期阻拦的错误：

| 请求                                              | 为什么过不了                     |
| ------------------------------------------------- | -------------------------------- |
| `{ list: "allpages", tials: "Main Page" }`        | 信封参数拼错                     |
| `{ list: "allpages", apdri: "ascending" }`        | 模块参数拼错                     |
| `{ titles, rvprop: "ids" }`                       | 未选 `prop=revisions` 却用 `rv*` |
| `{ prop: "revisions", plnamespace: 0 }`           | `pl*` 属于 `prop=links`          |
| `{ list: "search" }`                              | 漏掉必填 `srsearch`              |
| `{ list: "allpages", apnamespace: "Main" }`       | 枚举外取值                       |
| `{ prop: "revisionz" }`                           | 未知模块名                       |
| `{ prop: "revisions\|links" }` 写在数组形态入口上 | 管道串属于 `QueryStringRequest`  |
| `{ action: "edit", pageid: 1, from: "Other" }`    | `from` 属于 `action=move`        |
| `{ gaplimit: 5 }`（未选 `generator`）             | `gap*` 属于 `generator=allpages` |
| `{ generator: "info" }`                           | `prop=info` 不能作生成器         |

## 相关包

- [types-mediawiki-response](https://github.com/BearBin1215/types-mediawiki-response)——响应侧，按模块名与本库对齐。

## 参与开发

本包核心代码均由 AI 生成，通过 源代码精读+本地搭建服务后发起请求 交叉验证，工作量较大，因此不建议人工手写。如果你想参与本库的开发，建议同样准备好对应的环境后交由 AI 完成。

## 许可

[MIT](https://github.com/BearBin1215/types-mediawiki-params/blob/main/LICENSE) © [BearBin](https://github.com/BearBin1215)
