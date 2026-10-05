# AGENTS.md

MediaWiki Action API 请求参数类型库。

## 定位

- 只做**请求参数**类型;响应类型归 types-mediawiki-response,本库不重复建模。两库按模块名 1:1 对齐键位。
- 请求→响应联动(`./with-response`)与 `mw.Api` 全局包(`./mw`)**暂缓发布**:源码留在仓内、由 `pnpm test` 继续守住,但既不进 `exports` 也不进 `dist`(守卫见 `scripts/check-publish-surface.ts`)。合并单包时再解冻。
- 主入口纯类型;唯一带实现的是 `./define` 子路径的极小 identity helper(让 mw.Api 直接调用场景开箱即得门控)。
- 参数覆盖 MediaWiki 1.39–1.47 的并集;扩展模块走 `./ext/*` 可选参数包(1.43 扩展取证快照 + org 兜底);信封参数按 `formatversion=2` 对齐。

## 行为准则

- **拒绝猜测**:参数前缀、枚举、必填、多值、废弃只认 `action=paraminfo`(核心:各版本快照 `tests/paraminfo/versions/` 的并集;扩展:`tests/paraminfo/ext.json`,fixture 缺的模块由 org 快照兜底并注明),版本边界与参数互斥用容器实测 + 同版本源码取证,如实标证据级别,不虚构。
- **冲突回源码,拿不准问用户**,不默默选一个。
- **先探测环境、改状态先确认**:起删容器、覆盖基线快照等操作先征得同意,别假装跑过。
- **回核一片、就地纠错**:改一处顺手重核同模块既有声明,修复直接改原文,不写会话流水。

## 类型设计要点

- 扩展点留**可声明合并的空 interface**(注册表本身就是 merge 缝),别用 `Record<string, unknown>` 之类封死。
- 参数枚举的**开放/封闭判据同 response 库**(其 §3.10):集合能被「核心版本升级之外」的东西改变(注册表 / 钩子 / 站点配置 / 外部规范)→ **开放**(`'已捕获值' | (string & {})`,已捕获值只作 autocomplete,JSDoc 点名机制);核心代码硬编码 → **封闭**(未知值即运行时错误)。核心开放清单在 `scripts/paraminfo-union.ts` 的 `OPEN_ENUM_PARAMS`(contentmodel/contentformat 族、`setpagelanguage.lang`、token type、`paraminfo.querymodules`、`block.actionrestrictions`),扩展侧站点状态枚举走 `ext-modules.ts` 的 `SITE_STATE_EXT_PARAMS`;audit 强制开放枚举带 `(string & {})`。
- 必填参数以 paraminfo `required` 为准、**不带 `?`**(response 库默认可选,本库相反)。
- **配置影响必填/存在时例外**:不按证据站的默认值收紧 —— 声明**可选** + JSDoc 点名该配置(同 response 库「配置依赖 · 门控键->可选」)。核心走 `scripts/paraminfo-union.ts` 的 `CONFIG_GATED_PARAMS`,扩展走 `scripts/ext-modules.ts` 的 `CONFIG_GATED_EXT_PARAMS`;已用三处:`resetpassword.token`(`$wgPasswordResetRoutes`)、`checkuser.cureason`(`$wgCheckUserForceSummary`)、`abuselogprivatedetails.reason`(`$wgAbuseFilterPrivateDetailsForceReason`)。
- 门控逃生门走显式独立类型(如 `ApiRawParams`),不给注册表开索引签名。
- 版本事实一律 `@since` / `@deprecated` 标签,不写叙述句;扩展参数包是单版本事实、无并集,只写 `@deprecated` 与来源/配置 note,不虚标 `@since`。
- JSDoc 沿用 response 库规范:面向消费方、一体成型、英文、通用举例只用 mediawiki.org 一族。

## 目录安排

```
├── src/
│   ├── index.ts              # 主入口(纯类型)
│   ├── common.ts             # OneOrMore、ApiBaseParams、ApiRawParams(逃生门)
│   ├── registry.ts           # 注册表 interface map(按 action 与 query 的 prop/list/meta 分,留 merge 缝)
│   ├── action.ts             # ActionRequest 判别联合(横跨全部 action 的入口)
│   ├── core/query/           # 一模块一文件,声明合并进注册表;request.ts = QueryRequest 门控机制(手写),index.ts = barrel(生成)
│   ├── core/<action>.ts      # query 之外的 action 参数(bootstrap 生成;action=query 归 request.ts,不入联合)
│   ├── extensions/           # 扩展参数包 ×30(./ext/*,bootstrap-extensions 生成;declare module 增广注册表;只做请求侧)
│   ├── define.ts             # ./define 子路径:identity helper
│   ├── with-response.ts      # 请求→响应联动【暂缓发布:不进 exports/dist,源码留仓由 test 守住】
│   └── mw.ts                 # 全局 mw.Api 增广 + mwParams 命名空间【暂缓发布,同上;不入 barrel】
├── scripts/                  # fetch:paraminfo(+ext)、paraminfo-union、ext-modules(共享清单)、bootstrap:registry(+extensions)、audit:paraminfo(--ext)、check:ext(消费者 harness)、check-publish-surface(发布面守卫)、install-scratch(scratch harness 假安装)、prune-dist(见 dev-docs)
├── tests/                    # .test-d.ts:expectTypeOf 正向 + @ts-expect-error 负向(已知漏检钉成回归);paraminfo/ 快照为事实层
├── examples/                 # web-ts / web-js / node-bot 消费场景
├── dev-docs/                 # 内部开发笔记(判断规则与踩坑,不上文档站)
└── docs/                     # 文档站(Rspress,后置)
```
