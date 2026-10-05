# types-mediawiki-params 落地方案(交接文档)

> **读者**:接手本仓库的 agent。本文自足,不依赖任何历史会话。推荐阅读顺序:**AGENTS.md(硬约束)→ 本文(现状/架构/任务)→ dev-docs/authoring.md(判断规则与踩坑,遇到具体问题时查)**。姊妹库:`D:\Repositories\types-mediawiki-response`(已发布 v1.0.0)。

## 1. 项目定位(一句话)

MediaWiki Action API **请求参数**的类型库,与 types-mediawiki-response(响应侧)成对。核心价值 = 三重门控:参数名封闭(拼写错误编译期报错)、模块相关(选了 `prop=revisions` 才能用 `rv*`)、必填/枚举封闭(缺 token、错枚举值报错);外加请求→响应联动(选了什么模块,响应 `pages` 就投影成什么形状)。对标 types-mediawiki-api 2.0.0(开放索引签名、无判别、全可选 —— 六类漏检实测全过编译),本库把全部漏检钉成了永固回归。

## 2. 当前状态

提交史(自下而上,均为已完成):

| 提交      | 内容                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `65c8409` | 脚手架(工程配置镜像 response 库)+ paraminfo 基线拷贝                                                 |
| `2c3655d` | 门控类型层(common/registry/query)+ 73 个 query 模块骨架 + 双向审计                                   |
| `78a5fbf` | 45 个核心 action + `ActionRequest` 判别联合 + `./define` 子路径(双格式发布)                          |
| `3e6aba4` | `QueryRequest` 移入 `core/query/request.ts`;`action=query` 不入 `ActionParams`(防绕过门控)           |
| `18f8e99` | **跨版本并集 1.39–1.47**(8 版本容器舰队 + org 快照)+ apihelp JSDoc 全覆盖 + org-only 甄别 + 交叉验证 |
| `68a68bd` | `./with-response` 子路径(联动可行性验证通过)                                                         |

**已交付能力**:

- 118 个模块参数接口(64 query 子模块 + 45 核心 action + main/json/query 基座),覆盖 MediaWiki 1.39–1.47 并集,**每个模块与参数都带 apihelp 描述**及 `@since`/`@deprecated`/值级版本标注/条件注册 note。
- 门控入口:`QueryRequest<P, L, M>`(泛型推断点)、`QueryStringRequest<SP, SL, SM>`(管道字符串形态,`PipeSplit` 还原模块联合 + 非法段哨兵)、`ActionRequest`(按 `action` 字面量判别的联合,edit 里传 move 的 `from` 会报错 —— 实测)。两侧信封一律钉 `formatversion?: "2"`(响应库 fv2-only)。
- `./define` 子路径:`defineQuery`(数组/管道双重载)/`defineAction` 身份函数,产物直接可传 `mw.Api.get`(可赋值性专门设计);ESM+CJS 双格式,attw 全模式绿。
- `./with-response` 子路径:`QueryResponseFor<P>`(pages 按所选 prop 模块投影)+ `QueryResponseOf<Req>`(从 defineQuery 返回值推断,数组与管道两种形态都支持)+ `ActionResponseFor<A>`/`ActionResponseOf<Req>`(action → 响应库 `Api<Action>Response` 的显式映射表,41 个 action 建模齐;`cspreport`/`linkaccount`/`paraminfo`/`unlinkaccount` 响应侧未建模,不在映射内);optional peer。**包装器可用签名已用真实 `types-mediawiki` 实测校准**(query 侧保留三模块类型参数 + 边界一次 `as`,见 authoring §7)。
- `./mw` 子路径(**gadget / 无打包工具场景**):一行 `/// <reference types="types-mediawiki-params/mw" />` + 一行 `const api: mwParams.Api = new mw.Api()`(**无需断言** —— 合并声明使类实例可赋值给面类型,见 authoring §7③),之后**对象字面量在实参处门控、响应类型自动推断**(`api.post({action:"edit", …})` → `ApiEditResponse`),全程零 import、零 per-call 胶水;其他 `mw.Api` 成员经 `Omit` 保留。同一行引用还会把门控重载**合并**进 `mw.Api` 自身(同名竞争下接不住字面量,只让闭包类型请求可用 —— 见 authoring §7)。TS 7/bundler 与 TS 5.9/node10 两种解析都实测过(scratch harness 依赖假安装:先 `pnpm scratch:install`;reference 指令不走 paths,pnpm 也不自链)。可选 peer:`types-mediawiki`。
- `./ext/*` 扩展参数包(**P1-1 已落地**):30 个 pack / 69 个扩展模块(27 query + 42 action;含已建模扩展的 query 模块补全:Echo meta=notifications 等 8 个,另含 Babel meta=babel),与 response 库扩展集合对齐;激活 = `import type {} from "types-mediawiki-params/ext/<pack>"`(或引任一参数接口),激活后模块进四张注册表 → 门控自动生效;参数包**只做请求侧**(ext action 不进 ActionResponseMap,联动留合并缝)。事实源 `tests/paraminfo/ext.json`(fixture 1.43 直抓 + org-1.47 兜底 7 模块);配置门控注册(Echo 两模块)与站点状态枚举(FlaggedRevs `flag_*`/`autoreview`)源码取证后开 note/开 string。审计 `--ext` 模式 + 消费者 harness(`check:ext`,8 项:隔离/空引激活/具名激活/特异性/旧缝/reference 不激活/emit 擦除与对照)全绿。
- generator 参数相关性(**P2 首项已落地**):paraminfo 自带 `generator` 标记(快照现成携带,零重抓);第五张注册表 `QueryGeneratorParams` + `QueryRequest`/`QueryStringRequest` 第四泛型 `G`;generator 线格式经 `GeneratorForm` 模板字面量键重映射(`aplimit`→`gaplimit`),必填/枚举随行;`QueryResponseOf` 三参推断 + 结构化数组分支兜底带 generator 的请求。宽联合守卫方向与嵌套调用约束回退两个坑见 authoring §9。
- 取证流水线(全部可重跑):容器舰队 → `fetch:paraminfo` → `versions/*.json`(9 份快照)→ `paraminfo-union.ts` 并集 → `bootstrap:registry` 生成 → `audit:paraminfo` 双向审计 + 版本标签机器校验(当前全绿);扩展线:`fetch:paraminfo:ext` → `ext.json` → `bootstrap:extensions` → `audit:paraminfo --ext`(全绿)。
- 测试四套(`tests/*.test-d.ts`):query 门控回归(types-mediawiki-api 六类漏检的 @ts-expect-error)、action 门控(含跨 action 旗舰用例)、define 可赋值性、with-response 联动契约。

**当前 `pnpm check` 与 `pnpm check:pack` 全绿。**

> **暂缓发布(2026-10)**:`./with-response` 与 `./mw` 已从 `exports` / `typesVersions` 摘除,并从 `tsconfig.build.json` 排除(不进 `dist`),两个 optional peer 随之移除——本包现为**零依赖、零 peer 的纯 params 包**。源码与 `tests/with-response.test-d.ts`、`tests/mw.test-d.ts` 留在仓内,由 `pnpm test` 继续守住;发布面守卫 `scripts/check-publish-surface.ts`(`pnpm check:surface`,已并入 `check`)钉住"发布物只含 `.` / `./define` / `./ext/*`"。解冻时须一并恢复:`scripts/check-ext-consumer.ts` 里依赖 `with-response` 的 exact-set 检查,以及 `scripts/install-scratch.ts` / `.mw-scratch/`(`./mw` 的手动 harness)。

## 3. 架构与数据流(接手必读)

### 3.1 文件分层

| 层     | 文件                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 性质                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 手写层 | `src/common.ts`(OneOrMore/UnionToIntersection/ApiLimit/ApiBaseParams/ApiRawParams 逃生门)、`src/registry.ts`(五张声明合并缝:QueryPropParams/QueryListParams/QueryMetaParams/QueryGeneratorParams/ActionParams)、`src/action.ts`(ActionRequest)、`src/core/query/request.ts`(QueryRequest 门控机制)、`src/define.ts`、`src/with-response.ts`、`src/mw.ts`(全局 `mw.Api` 增广,不入 barrel)                                                                                                                                                                                                                                                                        | bootstrap 不碰;改动直接改原文                                                                |
| 生成层 | `src/core/<action>.ts` ×45、`src/core/query/<stem>.ts` ×64、两个 barrel(`src/core/index.ts`、`src/core/query/index.ts`)、`src/extensions/<pack>.ts` ×30(独立生成器,见下)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | bootstrap 原地覆写 + 自动清理过期文件;手工润色会被重跑冲掉,**要改先改生成器或快照**          |
| 事实层 | `tests/paraminfo/versions/{1.39,1.40,1.41,1.42,1.43,1.44,1.45,1.46,org-1.47}.json`、`tests/paraminfo/ext.json`(扩展包权威源:fixture 直抓 + org-1.47 逐模块兜底,`moduleSources` 记出处)                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 参数事实权威源;`baseline.json`(response 库拷贝的历史快照)已退役,只剩 supplement 遗留链路在读 |
| 脚本层 | `scripts/fetch-paraminfo.ts`(版本化抓取+apihelp HTML 解析)、`scripts/paraminfo-capture.ts`(共享抓取助手)、`scripts/paraminfo-union.ts`(并集模型,含 `ORG_ONLY_CORE` 白名单)、`scripts/fetch-ext-paraminfo.ts`(ext 抓取,含 org 兜底)、`scripts/ext-modules.ts`(EXT_MODULES/扩展名/配置门控与站点状态清单,fetch/bootstrap/audit 三方共用)、`scripts/bootstrap-registry.ts`(核心生成)、`scripts/bootstrap-extensions.ts`(ext pack 生成)、`scripts/audit-paraminfo.ts`(AST 双向审计+标签校验;`--ext` 审扩展包)、`scripts/check-ext-consumer.ts`(ext 消费者 harness)、`scripts/prune-dist.ts`(define 双格式收尾)、`scripts/container/fleet-bringup.sh`(舰队起站+抓取) | tsx 运行;AST 用 `typescript5` 别名依赖(TS 7 无编译器 API)                                    |

### 3.2 数据流

```
MediaWiki 容器舰队(mw139–mw146) + mediawiki.org(org-1.47)
   │  MW_API=<endpoint> pnpm fetch:paraminfo <name>          (paraminfo + apihelp HTML)
   ▼
tests/paraminfo/versions/*.json ──► scripts/paraminfo-union.ts(并集:存在性并集/事实取末版/枚举取舰队/org 白名单)
   │  pnpm bootstrap:registry                                  (生成 src/core/**,含描述与版本标签)
   ▼
src/core/**(生成)+ 手写层 ──► pnpm audit:paraminfo(AST 对照并集 + @since/@deprecated 精确校验)
   │
   ▼
pnpm check(format+lint+typecheck+audit+check:ext+check:pack) / pnpm check:pack(build+attw)

扩展线:mw-fixture(1.43 装载 26 扩展,见 authoring §1.6)
   │  MW_API=http://localhost:8080/api.php pnpm fetch:paraminfo:ext
   ▼
tests/paraminfo/ext.json(fixture 缺的模块逐个从 org-1.47 兜底,moduleSources 记出处)
   │  pnpm bootstrap:extensions                                (生成 src/extensions/<pack>.ts ×30)
   ▼
src/extensions/** ──► pnpm audit:paraminfo --ext(对 ext.json 双向对照,无版本标签)
```

### 3.3 依赖方向(不可违反)

- 包内:core/** → registry → common;action.ts/request.ts → common+registry;**define.ts / with-response.ts / mw.ts → index(必须是从 barrel 的"被用到的具名导入":空 `import type {}` 会被声明 emit 丢掉,子路径就不自足了,见 authoring §7)**;mw.ts 另引 with-response.ts;`index.ts` 不含 mw.ts(全局增广必须显式启用)。**无环**。
- 对外:**本库 → types-mediawiki-response 单向 optional peer**(with-response 与 mw 两个子路径)、**→ types-mediawiki 单向 optional peer**(仅 mw 子路径,取 `mw` 命名空间)。response 库永不依赖本库(其定位:响应类型不编码请求形状)。

## 4. 环境(本机现状)

| 项               | 值                                                                                                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 容器             | `mw-fixture`(1.43.9, :8080)、`mw139`(1.39.17, :8081)、`mw140`(:8082)、`mw141`(:8083)、`mw142`(:8084)、`mw144`(:8085)、`mw145`(:8086)、`mw146`(1.46.0, :8087);全部 SQLite 纯净站,API 直连 `http://localhost:<port>/api.php` |
| 重建舰队         | `bash scripts/container/fleet-bringup.sh`(起站+install+抓快照一条龙;镜像已在本地)                                                                                                                                          |
| 扩展取证站       | `mw-fixture` 已装载 26 个扩展 + Echo 两开关(详列 authoring §1.6;LocalSettings 留 `.bak`);扩展源码在 `D:\Repositories\mw-refs\extensions\`(gerrit REL1_43)                                                                  |
| Git Bash 坑      | `docker exec -w` 必须 `MSYS_NO_PATHCONV=1`(一切带绝对路径的 `docker exec` 同理)                                                                                                                                            |
| 工具链           | Node 24、pnpm 10.34.3(corepack)、TS 7(开发)+ TS 5.9(脚本 AST 别名 `typescript5`)                                                                                                                                           |
| devDeps 里的两库 | `types-mediawiki-response`(with-response 测试/attw 用)、`_scratch-tmwapi` 目录是早期原型(可删)                                                                                                                             |

## 5. 待办(按优先级;完成后在本文件勾掉并提交)

### P0-1 ✅ action 侧 `formatversion` 钉 `"2"` 【小,半小时】

- 原状:`QueryRequest` 钉了 `formatversion?: "2"`(与 response 库 fv2-only 对齐),但 `ActionRequest`/`ActionRequestFor` 继承 `ApiBaseParams` 的完整 `"1" | "2" | "latest"` —— 不一致。
- 落地:`src/action.ts` 加私有 `ActionEnvelope = Omit<ApiBaseParams, "formatversion"> & { formatversion?: "2" }`,`ActionRequest`/`ActionRequestFor` 换用它;`defineAction` 的入/出参同步改成 `ActionRequestFor<A>`(它原先手写 `ApiBaseParams & { action: A } & ActionParams[A]`,不改就是绕过钉死的旁门)。
- 验收:`tests/action.test-d.ts` 钉住 `"1"`/`"latest"` 两条 @ts-expect-error + `"2"` 正向 + `ActionRequestFor<"edit">["formatversion"]` 精确等于 `"2" | undefined`;`pnpm check`/`check:pack` 绿。

### P0-2 examples 三消费场景 + `check:examples` 【半天,已决定后置到首个版本发布之后】

- 三场景照抄 response 库 `examples/` 的工程形态(pnpm workspace 子包 + 各自 tsconfig):**web-ts**(演示门控 + define + with-response,放几个 `@ts-expect-error` 展示拦截)、**web-js**(纯 JSDoc/编辑器体验)、**node-bot**(wrapper 模式样板 —— 签名须用实测可用形态:`query<P extends keyof QueryPropParams & string = never, L…, M…>(params: QueryRequest<P, L, M>): Promise<QueryResponseFor<P>>`,内部 `return (await api.get(defineQuery(params))) as QueryResponseFor<P>`;action 侧 `post<A extends ActionWithResponse>(params: ActionRequestFor<A>): Promise<ActionResponseFor<A>>`。裸 `Req extends QueryRequest` 不成立,详见 authoring §7)。
- 根 package.json 加 `"check:examples": "pnpm run build && pnpm --filter ./examples/* run typecheck"`,并入 `check` 链(response 库同款;workspace 配置:`pnpm-workspace.yaml` 加 `examples/*`)。
- 验收:`pnpm check:examples` 绿 —— 这是发布形态的集成校验(消费者视角)。

### P0-3 ◑ README(中英)+ GitHub 建仓 + CI 完成,发版暂缓

- README 已交付(中英双份 `README.md` / `README.zh.md`):与 types-mediawiki-api 的九行对比表(**已对 types-mediawiki-api@2.1.0 复测**,TS 7 `--skipLibCheck` 下九条全编译通过,脚手架 `.mw-scratch/harness.ts`)、`./define` 与 `./with-response` 用法(包装器签名按实测形态写)、`ApiRawParams` 逃生门、`OneOrMore` 可变数组定案、版本覆盖与取证声明(1.39–1.47 并集 + org 白名单一句话)、`formatversion=2` 对齐声明、"尚未建模"清单(generator 相关性 / ext 包 / `as const`)。
- GitHub:私有仓 `BearBin1215/types-mediawiki-params` 已建并推送;`.github/workflows/ci.yml`(抄 response 库体例,跑 `check` + `check:pack`,Node 22 + corepack + pnpm 10.34.3)。**`publish.yml` 未落** —— 发版暂缓,不预先提交需要 NPM_TOKEN 的死配置,发版时连同 `release` 流程一起补。
- **⚠️ 顺带纠出的文档缺陷(已修)**:`./define` 与 `./with-response` 的头注释示例按真实 `types-mediawiki@2.1.0` 编译不过 —— ① `defineAction({action:"edit", pageid, text, summary})` 缺必填 `token`;② `Req extends QueryRequest` 单参数包装器不成立;③ `return api.get(...)` 无边界断言赋不给具体响应类型。现示例即消费者 harness 的实测内容(`.mw-scratch/{consumer,form_e,form_f,readme_check}.ts` + `tsconfig.json`,配 `paths` 指 `dist`),README 每条代码块都过过编译器。
- **追加:`./mw` 子路径(gadget / 无打包工具场景)** —— 一行 `/// <reference types="types-mediawiki-params/mw" />` 给 `mw.Api` 加门控重载 + 全局 `mwParams` 命名空间,消费侧零 import;`src/mw.ts` 手写、不入 barrel(全局增广必须显式启用)。同时**揪出并修掉一个发布物缺陷**:子路径原先靠 `import type {} from "./index"` 撑自足性,而声明 emit 会丢弃空导入 —— 只 import `./define` 的消费者注册表为空、`defineQuery` 直接不可用;现改为"从 barrel 具名导入并被签名使用",`./define`/`./with-response`/`./mw` 三条隔离用例已实测(另加 `tests/mw.test-d.ts`)。可选 peer 新增 `types-mediawiki`(仅 `./mw` 需要)。
- README 三条修订:去掉 types-mediawiki-api 对比(改为"编译不过什么"自我陈述)、去掉状态行、中文标点全量改全角。
- 剩余(发版窗口再做):`0.1.0`(bumpp)+ P0-2 examples。**examples 动手前先读 authoring §7 的包装器签名结论,并复用其"消费者 harness 搭法"**(含只 import 单个子路径的隔离用例)。

### P1-1 ✅ 扩展参数包 `./ext/*`(Phase 5)

- 落地与原计划一致,偏差两点:① 数据源从 `baseline.json`(response 库拷贝、无 apihelp 描述、扩展集不全)升级为**重新取证** —— mw-fixture 装载 26 个扩展(镜像自带 15 + gerrit REL1_43 克隆 11,源码留 `D:\Repositories\mw-refs\extensions\`),`fetch:paraminfo:ext` 直抓带描述的快照 `tests/paraminfo/ext.json`;GlobalUserInfo(依赖 CentralAuth)、Wikibase(需 composer)、description(= Wikibase Client,无独立扩展)不做容器安装,从 org-1.47 快照逐模块兜底并在 `moduleSources` 与 interface JSDoc 注明。② response 库 `EXT_MODULES` 的 `sitematrix` 前缀有错(实为顶层 action),本库已纠正。
- 机制:一扩展一文件 `src/extensions/<pack>.ts`,`declare module "../registry"` 增广四张注册表;exports 加 `./ext/*`(types + typesVersions 兜底);**参数包只做请求侧**,ext action 不进 `ActionResponseMap`(联动留合并缝,避免 pack 消费者被迫装 response peer)。站点状态枚举(FlaggedRevs `flag_*`/`autoreview`)与配置门控注册(Echo `echoarticlereminder`/`echopushsubscriptions`)按源码取证开 `string`+note。结论与坑见 authoring §8。
- 审计:`audit:paraminfo --ext`(`audit:paraminfo` 串联跑)—— 双向参数对照 + 注册表落点 + 接口命名 + pack↔EXT_MODULES 组成,无版本标签校验(单版本事实)。
- 验收已达成:`tests/ext.test-d.ts`(in-repo 全 pack 激活下的门控行为:模块相关性、封闭枚举、必填、连字符键、`never` 消失);消费者 harness `check:ext` 九项全 PASS(隔离/核心程序 `Exclude` 全等=4/空引激活/具名激活/特异性/消费者旧缝/reference 不激活/emit 擦除+对照);`pnpm check`(含 check:ext + check:pack)全绿,attw 对 `ext/*` 通配 🟢。

### P1-2 ✅ with-response 的 action 侧映射【可选,半天】

- 机制:`src/with-response.ts` 加导出 interface `ActionResponseMap`(action 名 → 响应库 `Api<Action>Response`,41 项;与四张参数注册表同款声明合并缝,P1-1 ext pack 可增广)+ `ActionWithResponse` 键联合 + `ActionResponseFor<A>` 索引 + `ActionResponseOf<Req>`(从 `{ action: infer A extends ActionWithResponse }` 推断,包装作者闭环)。
- 覆盖差:`cspreport`/`linkaccount`/`paraminfo`/`unlinkaccount` 响应库未建模,不入映射(约束即报错);宽联合推断里它们落 `never` 直接从联合消失,不放宽整个响应类型。
- 已知限制:映射只按 `action` 取键,`action=parse&onlypst=1` 的窄形态 `ApiParseOnlyPstResponse` 不细分 —— 写在 `parse` 条目的 JSDoc 里。
- 契约面扩大:`tests/with-response.test-d.ts` 现钉 41 项映射的精确响应类型,外加 `Exclude<keyof ActionParams & string, ActionWithResponse>` 恰为上述 4 个 —— 响应库给它们补建类型时本库 CI 先响,提醒收编。主入口零 response 类型引用不变(dist 除 `with-response.d.ts` 无 response import,attw 全绿)。

### P2(排队)

- ~~`generator=allpages` → `gap*` 参数相关性~~ ✅ 已落地(见 §2 已交付能力与 authoring §9)。
- TS 地板矩阵 CI:发布物在 TS 5.x 最低支持版跑 typecheck(gadget 生态有老 TS;types-mediawiki 自身 devDep 还在 TS 4.2)。
- `AGENTS.md` 正式化回收(去"早期安排"声明,补命令清单/工作流 —— 对齐 response 库体例)。
- 文档站(Rspress + typedoc,抄 response 库 docs 工作区)。

## 6. 风险与开放问题

- **response 库契约**:with-response 依赖其 `QueryPage`/`ApiPage`/`ApiQueryResult`/`ApiQueryResponse` 四个导出 + 41 个 `Api<Action>Response` 命名(注意成对项同文件:`ApiUnblockResponse` 在 `block`、`ApiUndeleteResponse` 在 `delete`);变更会破坏联动 —— `tests/with-response.test-d.ts` 是契约测试,漂移会先在本库 CI 炸响。peer 范围 `^1.0.0`,response 出 major 时本库需跟进评估。
- **types-mediawiki 契约(仅 `./mw`)**:面类型与合并声明都取 `mw.Api` 的 `get`/`post`/`postWithEditToken`/`postWithToken` 与 `Api.AbortablePromise`/`Api.AjaxSettings`;其签名形态(`UnknownApiParams` 参数 + resolve 元组 `[ApiResponse, jqXHR]`)一变,`tests/mw.test-d.ts` 与消费者 harness 会先响。**两条结构性限制别写成承诺**:① 合并声明那条路径永远管不到对象字面量(同名竞争,类的开放签名先命中),管字面量只能走面类型;② 实例可赋给面类型,前提是合并声明与面方法保持同一份清单(失步即断,`tests/mw.test-d.ts` 以直接赋值钉住);反向不可赋 —— 面类型丢掉了开放签名,这个缺口正是门控。
- **org 快照重抓**:mediawiki.org 每次重抓都可能带来新的扩展/集群污染参数 —— 流程:跑 `scripts/tmp-*.ts` 式 diff(可参考 git 历史里的甄别脚本),新候选项按 `org-1.47-review.md` 的判据(1.46 源码 grep)逐项裁定,进 `ORG_ONLY_CORE` 或剔除。ext.json 的 org 兜底模块同理:重抓 ext 时兜底取自仓库内 org 快照,org 重抓会连带影响 Wikibase 家族等 6 个模块的事实,audit 差异先查这里。
- **单模块程序 generator 退化**:宽联合守卫 `[GeneratorNames] extends [G]` 在程序内注册表只剩一个 generator 模块时会把唯一成员误判为宽联合 → 该模块的 generator 参数不做关联(降级不报错);全程序/发布物不受影响。
- **ext.json 与 fixture 漂移**:mw-fixture 的扩展集/配置开关(§4 表)变化后须重跑 `fetch:paraminfo:ext` 并跑 `audit:paraminfo --ext`;新增扩展先查 `ext-modules.ts` 的 EXT_MODULES。
- **容器易失**:机器重启后容器还在(数据在容器层),`docker rm` 后即丢 —— 舰队 `fleet-bringup.sh` 可完整重建;**mw-fixture 的扩展装载不在 fleet-bringup 里**,若 fixture 被删,扩展取证站要按 authoring §1.6 的流程手工重建(26 个 `wfLoadExtension` + 2 个 Echo 开关,源码在 mw-refs)。
- **容器易失**:机器重启后容器还在(数据在容器层),`docker rm` 后即丢 —— `fleet-bringup.sh` 可完整重建。
- **`as const` 不支持**:OneOrMore 为可赋值性放弃 readonly,已在 authoring §6 定案;若未来消费者强烈要求,解法是 define 产物加双重断言出口,不要回退数组可变性。
- **`.oxfmtrc.json` 被精简**(样式项移除,只留 ignorePatterns):会话中途发生在工作区,已按原样提交;若非有意,恢复自 response 库同文件。

## 7. 快速命令参考

```bash
pnpm check            # format:check + lint + typecheck + audit(核心+ext) + check:ext + check:pack(主质量门)
pnpm check:pack       # build + attw(发布安全)
pnpm check:ext        # ext 消费者 harness(隔离/激活/特异性/emit,内含 build)
pnpm scratch:install  # 假装本包进 .mw-scratch/node_modules(根目录 ts-*.json harness 的 reference 指令依赖它;build 后重跑)
pnpm build            # dist/*.d.ts + define 双格式 + prune
pnpm bootstrap:registry            # 从并集重新生成 src/core/**(保护手写层)
pnpm bootstrap:extensions          # 从 ext.json 重新生成 src/extensions/**
MW_API=http://localhost:8081/api.php pnpm fetch:paraminfo 1.39   # 刷新某版本快照
MW_API=http://localhost:8080/api.php pnpm fetch:paraminfo:ext    # 重抓扩展快照(需扩展取证站)
bash scripts/container/fleet-bringup.sh   # 舰队重建+全量抓取
docker exec mw146 grep -rn "<param>" /var/www/html/includes/Api/   # 源码取证(Git Bash 加 MSYS_NO_PATHCONV=1)
```
