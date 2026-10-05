# 开发笔记 / Authoring notes

> 给 agent 的知识库:可复用的判断规则与踩坑成因。**AGENTS.md** 只留硬约束速查;字段级事实归类型的 JSDoc 与 paraminfo 快照,本文只写判断规则。

## 1. 环境与取证

### 1.1 版本舰队快照(跨版本事实源)

| 文件                                        | 来源                                                                                | 用途                                                                                                                                                                                                                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/paraminfo/versions/{1.39…1.46}.json` | 本库舰队容器(`mw139`…`mw146`,SQLite 起站,脚本 `scripts/container/fleet-bringup.sh`) | **核心参数事实的权威源**:每版本自发现模块集(main/json/query + 全部 query 子模块 + 核心 action),含 required/multi/枚举/deprecated。bootstrap 与 audit 都只消费这些(经 `scripts/paraminfo-union.ts` 并集)。                                                                  |
| `tests/paraminfo/versions/org-1.47.json`    | mediawiki.org(1.47-wmf,非 localhost 时自动 1.5s 礼貌间隔 + 429 退避)                | 只贡献两样:**白名单参数**(`paraminfo-union.ts` 的 `ORG_ONLY_CORE`,源码证实的 core 条件注册参数)与各模块 **help 文案**(最新散文)。org 永不:扩张模块集(锁定为发布版舰队)、贡献枚举值、参与移除判定。37 个 org-only 候选的逐项甄别记录:`tests/paraminfo/org-1.47-review.md`。 |
| `tests/paraminfo/baseline.json`             | 拷贝自 types-mediawiki-response(1.43.9,**装载扩展**的容器)                          | 历史文件:扩展参数包的事实源已由 `ext.json` 取代;核心代码生成早已不用。仍被 `fetch:paraminfo` 无参模式读取(supplement 遗留链路)。                                                                                                                                           |
| `tests/paraminfo/ext.json`                  | `MW_API=<fixture> pnpm fetch:paraminfo:ext`(1.43.9 装载 26 个扩展的 mw-fixture)     | **扩展包参数事实的权威源**(`scripts/bootstrap-extensions.ts` 与 `audit:paraminfo --ext` 消费):18 个 ext query 模块 + 42 个 ext action,含 apihelp 描述。fixture 缺的模块(Wikibase 家族/globaluserinfo/description)从 org-1.47 快照逐模块兜底,出处记在 `moduleSources`。     |
| `tests/paraminfo/supplement.json`           | `pnpm fetch:paraminfo` 无参模式                                                     | 遗留;基座事实已并入 versions 快照。                                                                                                                                                                                                                                        |

刷新:`MW_API=<endpoint> pnpm fetch:paraminfo <name>`。apihelp HTML 逐模块抓取(`action=help&wrap=1`,**单模块一次请求**;多模块会拼接成一份 HTML)。paraminfo 自 MW 1.38 起不带 description —— apihelp HTML 是 JSDoc 描述的素材源(解析规则见 fetch-paraminfo.ts 头注释)。**解析前会剥掉页脚**(`printfooter` 与 `<script>`:内含每请求变化的 `wgBackendResponseTime`/`wgHostname` 及 ResourceLoader 警告),否则重抓会因计时值产生假 diff(见 `parseHelpHtml`)。Git Bash 下 `docker exec -w` 需加 `MSYS_NO_PATHCONV=1`。

### 1.2 paraminfo fv2 的参数名已剥前缀

`action=paraminfo&formatversion=2` 返回的模块级 `prefix`(如 `"rv"`)与参数名 `name`(如 `"prop"`)是**拆开的**:真实请求参数名 = `prefix + name`(`rvprop`)。`prefix` 为空串的模块直接用 `name`。bootstrap 与 audit 都必须走这条重建规则,别拿剥过的名字直接当参数名。

### 1.3 跨版本并集语义(1.39–1.47)

- 参数/模块:任一覆盖版本存在即建模;`since` = 首个携带版本,`until` = 末个携带版本;`until` 之后全部缺席 → 判定为移除,移除版本 = `until` 的下一个覆盖版本。org 快照**不参与**移除判定与模块生死:mediawiki.org 可把模块以 `ApiDisabled`(空参数)提供 —— imagerotate 教训,10 个参数被误判"1.47 移除",已撤销。
- 类型事实(required/multi/type/deprecated)取**该参数最后存在的版本** —— 类型优先服务现役 wiki。
- 枚举值 = 发布版舰队(1.39–1.46)并集;org 一律不贡献枚举值。
- 跨参数互斥(如 edit 的 title/pageid)不入类型,apihelp 文案已把它们带进 JSDoc。
- 版本标签归一:org 快照名 `org-1.47` 在产物标签中输出为 `1.47`(`versionLabel()`)。

### 1.4 paraminfo 反映的是「配置中的 wiki」,不只是版本

`$wgWatchlistExpiry` 关闭的 wiki 上,`watchlistexpiry` **不在 paraminfo 里**,但它是 1.39 起就有的 core 参数(ApiBlock 等源码条件注册);org(wmf)配置开启才看得到。推论:**fleet paraminfo 的缺席不证明参数不存在**;org 上 `source: MediaWiki` 也不证明是 core(ConfirmEdit 的 captchaword 经 hook 注入 core 模块,source 仍显示 MediaWiki)。唯一判据是**干净发布版源码有无注册代码**(`docker exec <容器> grep ...`);源码证实为 core 的条件注册参数进 `ORG_ONLY_CORE` 白名单,JSDoc 带 `note`(如 "Only available when $wgWatchlistExpiry is enabled.")。**所有证据站(含 org)都关闭**该配置、连 org 快照都没有的参数,进 `SOURCE_ONLY_CORE`(全快照缺席注入,自带 `since`/`type`/`note`/`doc`;现仅 `upload.copystatus`/`source` ← `$wgUseCopyrightUpload`)。⚠️ 反过来,某参数在 core 源码里**只被读取**(`isset($params['x'])`)却找不到注册代码时,它是由扩展经 `APIGetAllowedParams` 注入的,别当 core 收 —— `parse.mobileformat`(MobileFrontend)与 `edit.editorinterface`(VisualEditor/DiscussionTools)就是这样被误收、2026-10 复核后撤销的。

**必填/存在性受配置影响的参数**同理:证据站跑默认配置,`required` 反映的是默认值;配置一开可能变成必填(或参数整个不存在)。按 response 库「配置依赖 · 门控键->可选」的口径**声明可选 + JSDoc 点名配置**,别按默认值收紧:核心走 `paraminfo-union.ts` 的 `CONFIG_GATED_PARAMS`(`resetpassword.token` ← `$wgPasswordResetRoutes`,经 `ApiResetPassword::hasAnyRoutes()`/`needsToken()`),扩展走 `ext-modules.ts` 的 `CONFIG_GATED_EXT_PARAMS`(`checkuser.cureason` ← `$wgCheckUserForceSummary`;`abuselogprivatedetails.reason` ← `$wgAbuseFilterPrivateDetailsForceReason`)。注意:9 份快照(1.39–1.46 + org-1.47,含高度配置的 mediawiki.org)的 `required` **零差异** —— 因为证据站都用默认配置,**别据此断定配置不影响必填**。核心 `token` 由 `ApiBase::getFinalParams()` 在 `needsToken()` 为真时以 `REQUIRED => true` 加入,故凡 `needsToken()` 读配置的 action 都要按此口径处理。

**枚举的开放/封闭同样按 response 库 §3.10 的判据**:集合能被「核心版本升级之外」的东西改变 → 开放。已核开放的请求参数(进 `paraminfo-union.ts` 的 `OPEN_ENUM_PARAMS`,生成 `'已捕获值' | (string & {})` 并在 JSDoc 点名机制),附源码 + 实况双重证据:`contentmodel` 族(`$wgContentHandlers` + `extension.json` ContentHandlers + `GetContentModels` 钩子;实测 fixture 有 `Scribunto`/`GadgetDefinition`/`MassMessageListContent` 而干净站没有,**同一请求** `contentmodel=Scribunto` 在 fixture 过枚举校验、在干净 1.46 报 `badvalue`)、`contentformat` 族(`IContentHandlerFactory::getAllContentFormats()`;fixture 10 vs 干净站 11)、`setpagelanguage.lang`(`LanguageNameUtils::getLanguageNames()`;SUPPORTED 分支按"扩展里的 messages 文件"判定,源码注释明说扩展语言计入)、`checktoken.type`/`query+tokens.type`(core + `ApiQueryTokensRegisterTypes` 钩子;fixture 无扩展用此钩子,故**只有源码级证据**,实况两侧同为 7 值)、`paraminfo.querymodules`(实测 fixture 89 vs 干净站 64)、`block.actionrestrictions`(core + `GetAllBlockActions` 钩子:`ServiceWiring` 用 `new BlockActionInfo( $services->getHookContainer() )`,Thanks 扩展经 `GetAllBlockActions` 注册 `thanks`,org-1.47 快照可见)、`allpages.apprtype`/`apprlevel`(`$wgRestrictionTypes`/`$wgRestrictionLevels`)、`protectedtitles.ptlevel`(`$wgRestrictionLevels`)、`allusers.augroup`/`auexcludegroup`/`aurights` 与 `contributors.pcgroup`/`pcexcludegroup`/`pcrights`(`UserGroupManager::listAllGroups()` / `PermissionManager::getAllPermissions()`)、`logevents.letype`/`leaction`(`$wgLogTypes` / `$wgLogActions`+`$wgLogActionsHandlers`)、`search.srsort`(`SearchEngine::getValidSorts()`,且仅单搜索后端时注册)。**反例(仍封闭,别误开)**:`options.global`(`ApiOptions::getAllowedParams` 硬编码 `ignore/update/override/create`;fixture 3 值 vs 1.46 4 值属**版本**差异——`create` 是后加的核心值,由 union 吸收,与配置无关)。

**配置门控的存在性会伪装成版本边界**:`block.actionrestrictions` 在 1.39–1.44 由 `$wgEnablePartialActionBlocks` 门控(默认关),默认配置的舰队在 1.39–1.44 看不到它,union 会误标 `@since 1.45`。`CONFIG_GATED_PARAMS` 因此支持 `since` 覆写,并把该参数各值的 `since` 一并归到同一起点(否则会生成 "The … values are available since MediaWiki 1.45." 这类与参数 `since` 自相矛盾的散文)。

### 1.5 apihelp 消息键的陷阱(已绕开)

i18n 消息键用**未加前缀**的参数名,继承组还带 `+base` 段(`apihelp-query+revisions+base-param-prop` 对应 `rvprop`),与 paraminfo 全名对不上 —— 别走 `meta=allmessages`,直接解析 `action=help` 的 HTML(参数以 `id="<path>:<全名>"` 成对出现,`<dd class="description">` 为描述)。解析出的 `help.params` 键就是**全名**(prefix+name):fv2 的 paraminfo 参数名剥了前缀,查 help 前必须按 §1.2 重建,否则前缀模块的参数描述全部落空(checkuser 教训)。

### 1.6 扩展取证 wiki(mw-fixture 现状)

mw-fixture(1.43.9)已从纯净站改造成**扩展取证站**:27 个扩展常驻(镜像自带的 AbuseFilter/CategoryTree/DiscussionTools/Echo/Gadgets/Linter/OATHAuth/PageImages/Scribunto/SpamBlacklist/TemplateData/TextExtracts/Thanks/TitleBlacklist/VisualEditor 直接 `wfLoadExtension`,其余 12 个(含 Babel)从 gerrit `REL1_43` 分支克隆到 `D:\Repositories\mw-refs\extensions\` 后 `docker cp` 进容器;LocalSettings.php 留有 `.bak` 备份与注释块),另有 Echo 两个开关强制开启(`$wgAllowArticleReminderNotification`/`$wgEchoEnablePush`,见下)。重抓:`MW_API=http://localhost:8080/api.php pnpm fetch:paraminfo:ext`。新增扩展的流程:克隆 REL1_43 → docker cp → 追加 `wfLoadExtension` → `update.php --quick` → 把模块名加进 `scripts/ext-modules.ts` 的 `EXT_MODULES` → 重抓。

**⚠️ 1.43 核心快照不能再从这个 fixture 抓**:它已装载 27 个扩展,`fetch:paraminfo 1.43` 会把扩展模块当成核心(89 query/86 action 而非 62/44)。刷新 1.43 核心须临时起一个干净 1.43(`docker run -d --name mw143clean -p 8088:80 mediawiki:1.43` + `install.php`,抓完即删),并把快照里的 `localhost:<port>` 归一回 8080 约定。

## 2. 类型系统规则(原型实测结论)

原型:`_scratch-tmwapi/exp1–3.ts`(依赖 TS 5.6 验证)。

- **参数类型(函数入参位置)禁裸条件类型**:未解析的条件类型会让泛型推断坍缩为 `never`、对象字面量全部宽化,门控整体失效(exp2 的教训)。never 归一用分布式写法 `UnionToIntersection<P extends any ? Registry[P] : never>`(`P = never` 时自然得到 `unknown`)。
- `OneOrMore<T> = T | T[]`(**仅可变数组**,Phase 4 定案,详见 §6):readonly 会让 `define*` 产物赋不进 `mw.Api` 的参数记录。
- **多值选择器双形态(1.47 期定案)**:数组形态(`QueryRequest`,`prop: ["revisions","links"]`)与管道字符串形态(`QueryStringRequest`,`prop: "revisions|links"` —— 原始线格式,供直连 fetch 的客户端)共存,`defineQuery` 以重载分流(单名走数组重载,含 `|` 走字符串重载)。字符串形态经 `PipeSplit`(common.ts,三行模板字面量递归,**无需 type-fest** —— 其目录里也没有 Split 工具)还原模块联合,门控等同数组形态;非法段经 `ValidPipeSegments` 哨兵(缺 `__invalidModule` 属性错误,报错文本含可疑段联合)拦截。递归约束(`${Names}|${PipeSource}`)不可行(TS2456 循环引用),故约束只验首段、后续段靠哨兵。
- **⚠️ 延迟条件成员毒化 `extends` 推断匹配**:`Req extends QueryStringRequest<infer SP,…>` 会失败 —— 目标类型含依赖 `SP` 的延迟条件成员(哨兵)时,TS 要求 source 可赋值给条件的**两个分支**,哨兵的错误分支永不满足;具体类型参数(`QueryStringRequest<"revisions|links",…>`)却能匹配。解法:下游联动(`QueryResponseOf`)对字符串形态用**宽松结构匹配**(`Req extends { prop?: infer SP extends string }`),只对 prop 字段推断。写入类型前先用探针验证分支匹配(exp4 系列方法)。
- 泛型推断点(`prop?: OneOrMore<P>` 等)缺省 `never`,`keyof Registry & string` 约束;非字面量变量(`prop: someTypedVar`)会退化成并集放行,是有意的宽松降级。
- **Simplify(A/B 已定)**:给 `QueryRequest` 包 `Simplify` 拍平交集,六类违规用例的报错输出与交集版**逐字一致**,唯一差异是 hover —— 别名形式(`QueryRequest<"revisions", never, never>`)更紧凑。**结论:不引入**,交集原样保留。

## 3. paraminfo → TS 映射规则

bootstrap 与手工润色共用,以 baseline.json 字段为准:

| paraminfo `type`                                                                 | TS 类型                                                      |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `string[]`(枚举)                                                                 | 字面量联合(封闭;`deprecatedvalues` 照常并入,参数 JSDoc 注明) |
| `"string"` / `"text"` / `"title"` / `"user"` / `"raw"` / `"tags"` / `"password"` | `string`                                                     |
| `"integer"`                                                                      | `number`                                                     |
| `"boolean"`                                                                      | `boolean`                                                    |
| `"limit"`                                                                        | `number \| "max"`                                            |
| `"namespace"`                                                                    | `number`                                                     |
| `"timestamp"` / `"expiry"`                                                       | `string`                                                     |
| `"submodule"`                                                                    | 遇到再定(核心 query 子模块暂无)                              |

`multi: true` → 包 `OneOrMore<…>`;`required: true` → 去掉 `?`;`deprecated` → `@deprecated` JSDoc;`default` 不建模(请求侧默认值不构成约束)。

## 4. Agent 操作准则

- 舰队容器(mw-fixture 1.43 @8080,mw139–mw146 @8081–8087)已获授权并常驻,取证脚本可直接用;再起新容器、删容器、覆盖 `tests/paraminfo/` 快照前需确认。起站配方:`scripts/container/fleet-bringup.sh`。
- `src/core/<stem>.ts` 与 `src/core/query/<stem>.ts` 是**可再生的生成文件**(bootstrap 原地覆写,含 apihelp 描述):手工润色若被重跑冲掉,优先改 `paraminfo-union.ts`/`bootstrap-registry.ts` 或快照,别跟生成器对抗;bootstrap 保护 `request.ts` 与两个 barrel 的手写部分,并自动清理过期生成文件。
- `common.ts`/`registry.ts`/`action.ts`/`core/query/request.ts`/`define.ts`/`with-response.ts` 是**纯手写层**:bootstrap 不碰它们。
- audit 报错优先怀疑生成映射或手改笔误,其次才怀疑快照;改快照是最后手段且需先核对容器实况。
- 消费者模拟验证(`.mw-scratch` 下写单文件 + `tsc --ignoreConfig`)时,增广文件必须显式逐个 `import type {}`(见 §5)。

## 5. 踩坑记录(实施期)

- **TypeScript 7 的 npm 包不带 JS 编译器 API**:`require('typescript')` 只剩 `version`,`ts.createSourceFile` 等全没了(tsc 本体照常工作)。脚本需要 AST 时用别名依赖 `typescript5`(npm alias 到 TS 5.x),见 `scripts/audit-paraminfo.ts`。另外 TS 7 的 CLI 在传文件参数时必须加 `--ignoreConfig`,否则报 TS5112。
- **paraminfo type 数组的嵌套数组元素是展示标记**:如 FlaggedRevs 贡献的 `["sreview"]` 与限制级别并列;请求侧接受的是普通字符串值。bootstrap 与 audit 一律扁平化(去重后并入联合)。
- **`declare module` 增广块内的接口引用不算"使用"**:生成文件不要 import 注册表接口(`noUnusedLocals` 会报 TS6196),增广块本身解析目标模块作用域。
- **脱离项目单文件编译时增广不生效**:`import "../src/index"` 不会拉入 `src/core/query/*` 的增广文件(tsconfig include 才覆盖),注册表为空、门控全哑。scratch 实验须显式 `import type {} from "../src/core/query/<stem>"` 逐个引入。
- **模块参数接口命名**:query 子模块 `ApiQuery<Pascal>Params`,action `Api<Pascal>Params`,stem 仅首字母大写(`allpages` → `ApiQueryAllPagesParams`),机械规则,audit 以此核对注册表落点。

## 6. action 侧实施记录(Phase 4)

- **action 事实源与 query 同源(并集时代)**:二者都经 `paraminfo-union.ts` 从 `tests/paraminfo/versions/` 取;早期"action 取 supplement.actions"是过渡态,已废弃。baseline.json 的 action 组数据(扩展污染)与 supplement.json 均不再参与生成。`action=query` 本体不入 `ActionParams`(归 `QueryRequest` 专属门控,否则可绕过模块门控),在 fetch 脚本 `SKIP_ACTIONS`;feed×3/help/opensearch/rsd 同样跳过(非 JSON 输出)。
- **站点状态参数**:参数名 `tags`/`add`/`remove`/`interwikisource` 的枚举值来自 wiki 运行时状态(自动标签、用户组、interwiki 表),不是 schema;一律映射开放 `string`(`SITE_STATE_PARAMS`,bootstrap 与 audit 两处同步)。空枚举(纯净容器上 tags 为 `[]`)同理回退 string。
- **OneOrMore 只收可变数组**:`types-mediawiki` 的 `UnknownApiParams` 是 `type` 别名 + `string[]`;带 `readonly` 的产物赋不进去。可变数组换取 `define*` 产物直接可传 `mw.Api.get` —— 这是 `./define` 的核心价值,别为 `as const` 便利性回退。
- **隐式索引签名规则**:TS 只给类型别名的对象字面量类型隐式索引签名,interface 及含 interface 成员的交集都没有 —— 封闭的请求类型**永远**不能直接赋给 `UnknownApiParams` 形态的参数。解法是 `define*` 返回类型叠 `ApiRawParams &`(校验发生在入参,返回侧的索引签名只是赋值通行证);用 `as` 收尾是身份函数的预期形态。
- **`./define` 双格式发布**:define.ts 相对导入必须带显式 `.js` 扩展(否则 `.d.mts` 在 node16-ESM 下解析失败);`prune-dist.ts` 把声明复制成 `.d.mts`/`.d.cts`、运行时改名 `.mjs`/`.cjs`(无 `"type"` 字段的包里 `.js` 在 node16-ESM 按 CJS 解析,attw 报 masquerading);`typesVersions` 兜 node10。tsc 的两条额外编译 pass 会把整个 import 图的空 `.js` 桩打出来,prune 负责清掉。
- **生成文件现在含 barrel**(`src/core/query/index.ts`、`src/core/index.ts`):增广必须能从入口 import 图到达,否则消费者侧注册表是空的 —— 这是 response 库 barrel 全量 re-export 的同款理由。

## 7. 请求→响应联动(./with-response,可行性验证结论)

- **发布形态定案**:作为**本库的捆绑子路径**(非 response 库捆绑、非独立包)。决定性论据是泛型流向 —— `P` 从请求侧 `prop` 字面量推断产生,联动类型天然消费本库的 `QueryRequest`/`QueryPropParams`、伸向 response 库的 `QueryPage`/`ApiQueryResponse`;放 response 侧则依赖倒转且违反其"响应类型不编码请求形状"的定位。机制:`optional peer(types-mediawiki-response ^1.0.0)` + devDep(本库测试/attw 用);主入口 `dist/*.d.ts` 零 response 类型引用(JSDoc 提及不算)。
- **`ApiPage` 没有同名键的 prop 模块**:`prop=info` 的字段(contentmodel/length/touched…)直接内联在页对象上,`QueryPage<"info">` 不成立。凡选中此类模块,**降级为完整合并视图** `ApiQueryResponse` —— 投影会因省略内联字段而撒谎,合并视图才是准确形态。判定写法:`[P] extends [Extract<P, keyof ApiPage>] ? Projected : ApiQueryResponse`。响应侧若新增此类模块,在本库同步该降级集合。
- **`QueryResponseOf<Req>` / `ActionResponseOf<Req>` 推断闭环**:前者 `Req extends QueryRequest<infer P, infer _L, infer _M> ? QueryResponseFor<P> : never`(管道形态另走 `{ prop?: infer SP extends string }` 的宽松结构匹配),后者按 `{ action: infer A extends ActionWithResponse }` 读回 action。注意:「入参位置禁裸条件类型」的规则(§2)**只限入参**;返回值/别名位置的条件推断是安全且必需的。
- **⚠️ 包装器签名:query 侧必须保留三模块类型参数**(2026-10-03 用真实 `types-mediawiki@2.1.0` + 本库 `dist` 实测,脚手架见 `.mw-scratch/consumer.ts`、`form_f.ts`):
  - **可用**:`query<P extends PropNames = never, L extends ListNames = never, M extends MetaNames = never>(params: QueryRequest<P, L, M>): Promise<QueryResponseFor<P>>`(调用点字面量选模块,响应按 `P` 投影);action 侧单参数即可 —— `post<A extends ActionWithResponse>(params: ActionRequestFor<A>): Promise<ActionResponseFor<A>>`(`action: A` 在 `ActionRequestFor` 里能推断),`Req extends ActionRequest` 也可(判别联合按分支匹配)。
  - **不可用**:`Req extends QueryRequest`(裸入口当约束)—— 默认 `P=L=M=never`,于是 `prop: "revisions"` 这类字面量永不匹配;`Req extends QueryRequest<全部模块名>`(宽约束)—— 交集带进未选模块的必填参数,实测撞上 `query+codexicons` 的必填 `names`。
  - **边界断言是必需的,不是偷懒**:`mw.Api.get/post` 解析为 `ApiResponse = Record<string, any>`,它赋不给任何具体响应类型(裸 `return api.get(...)` 报 TS2322),包装器只能在返回处 `as QueryResponseFor<P>` —— 响应形状由此注入,这正是联动类型的落点。入参侧无需断言:`define*` 产物直接喂 `mw.Api` 的参数记录实测通过(门控发生在入参)。
- **⚠️ 子路径自足性:空 `import type {}` 会被声明 emit 丢弃**(2026-10-03 实测,曾酿成发布物缺陷):`import type {} from "./index"` 只活在 `src`,tsc 出 `.d.ts` 时整条删掉,靠它撑自足性等于没有 —— 当时消费者只 import `types-mediawiki-params/define`,注册表是空的,`defineQuery({ action: "query", prop: "revisions", … })` 直接报"没有匹配的重载",`with-response` 同症(`keyof QueryPropParams` 退化 `never`)。修法:子路径要自足,就**从 barrel 具名导入且被签名真正用到**(`import type { QueryPropParams } from "./index"`),emit 才会保留这条引用;`define.ts`/`with-response.ts`/`mw.ts` 现都如此。新增子路径后必须再跑一遍"只 import 该子路径"的隔离用例。
- **⚠️ 声明合并排不到类自身签名之前,但门控推断本身没坏**(逐项实测):给 `mw.Api` 合并一个**新方法名**(`interface Api { s1<P…>(params: QueryRequest<P,L,M>): … }`)时,对象字面量照样匹配、拿到投影,拼写错误在实参处报错 —— 说明 `QueryRequest<P,L,M>` 的推断在方法位也没问题。真正的限制是**同名竞争**:同名 `get` 时类自己那条 `UnknownApiParams` 开放签名先命中,字面量与带 `ApiRawParams` 索引签名的 `define*` 结果一律落到 `ApiResponse`;只有闭包类型(被开放签名拒绝的那种)才会轮到合并进来的重载。
- **字面量要门控 + 响应自动推断,靠门控面类型(facade),不靠合并**:`mwParams.Api = 门控方法 & Omit<mw.Api, "get"|"post"|"postWithEditToken"|"postWithToken">`,消费侧一行 `const api: mwParams.Api = new mw.Api()`,之后 `api.post({ action: "edit", … })` 直接得到 `ApiEditResponse`。三条实测注意:① 合并处不能写 `interface Api extends GatedApiMethods` —— TS2430(合并成员必须可赋给类自身同名成员,而我们的 resolve 元组比 `[ApiResponse, jqXHR]` 短),所以面类型与合并声明是**两份手写清单**,由 `tests/mw.test-d.ts` 把两条路径同时钉住;② 面类型里**数组形态重载必须排在管道形态之前**,否则外层调用的上下文类型会把 `defineQuery(…)` 推进字符串重载,冒出「缺 `__invalidModule`」这种莫名其妙的错;③ 面类型的获取**不需要断言**:合并声明与面方法是同一份手写清单,类实例因此结构上可赋给 `mwParams.Api`,`const api: mwParams.Api = new mw.Api()` 直接成立(单个 `as` 也合法,但注解形态才是被检查过的);TS 7.0.2 与 TS 5.9.3 双实测。合并接口落地前曾测得相反结论(`as unknown as` 必需)—— 教训:合并声明改变了类的结构,涉及「实例↔面类型」可赋值性的结论要随实现重测;tests/mw.test-d.ts 以直接赋值钉住,两份清单失步该形态即断。
- **探针纪律**:验证"命中哪个重载"只能用 `const reveal: { forceError: true } = value` 逼报错打印实际类型;属性访问式探针(`value.marker`)在 `Record<string, any>` 上永远"通过",是假阳性(我这样误判过一次)。
- **消费者 harness 的搭法**(P0-2 examples 直接复用):临时目录装 `types-mediawiki` 与 `types-mediawiki-response`,把本包 `dist` + `package.json` 拷进 `node_modules/types-mediawiki-params`(`npm i` 会清掉拷入的外来包,装完再拷),然后分三组 tsconfig 验:bundler + `/// <reference types="types-mediawiki-params/mw" />`;只 import 单个子路径的隔离用例;`typescript5` + `moduleResolution: node`(TS 7 已移除 `node10`,老 gadget 工具链仍要用 5.x 验一遍)。
- **契约测试双职**:`tests/with-response.test-d.ts` 同时是两库之间的**契约测试** —— response 库若更名/改形 `QueryPage`/`ApiPage`/`ApiQueryResult`/`ApiQueryResponse`,本库 CI 先炸,不会静默传染消费者。peer 升版判定以这些断言为准。
- **expect-type 断言风格**:投影类型的字段类型是 response 库的真实类型(如 `ApiPage["revisions"]`),手写精确形状做 `toEqualTypeOf` 是不变式比较、必然脆断;用**结构性断言**:字段存活(`toEqualTypeOf<ApiPage["revisions"]>`)+ 属性存缺(`toHaveProperty`/`not.toHaveProperty`)+ 整体 `toExtend<ApiPageIdentity>`。
- **action 侧联动 = 查表,不是投影**:一个 action 一个顶层响应键,没有 query 那种按所选模块收窄的余地。形态定为导出的具名 interface `ActionResponseMap`(声明合并缝,与四张参数注册表同款,P1-1 ext pack 在此增广)+ `ActionResponseFor<A>` 索引 + `ActionResponseOf<Req>` 用 `{ action: infer A extends ActionWithResponse }` 推断。**未建模响应的 action 不进映射**,而不是映射到 `unknown`/`ApiEnvelope`:约束端报错比宽类型撒谎有用,宽联合推断时它们消失为 `never`。映射只按 `action` 取键,`action=parse&onlypst=1` 的窄形态 `ApiParseOnlyPstResponse` 取不到 —— 已知限制写进 `parse` 条目的 JSDoc 即可,别为此在查表里套条件类型。留意成对项同文件:`ApiUnblockResponse` 在 `block`、`ApiUndeleteResponse` 在 `delete`。
- **信封钉 `formatversion="2"` 的两种写法**:query 侧在 `QueryBase` 里写 `formatversion?: "2"`,与 `ApiBaseParams` 交叠后联合被收窄到 `"2"`;action 侧用 `Omit<ApiBaseParams, "formatversion"> & { formatversion?: "2" }`(入口一眼可见钉了什么,不必再造 `QueryBase` 那样的中间层)。两侧落地类型都是 `"2" | undefined`,由 `tests/{query,action}.test-d.ts` 的 `toEqualTypeOf` 钉住。**新增自定义信封的入口时同理**,别让 `ApiBaseParams` 的完整联合漏到底层;`defineAction` 必须复用 `ActionRequestFor` —— 自己手写 `ApiBaseParams & { action: A } & ActionParams[A]` 就是绕过钉死的旁门。

## 8. 扩展参数包(./ext/*,P1-1 实施结论)

- **机制与 response 库同款,增广目标不同**:一扩展一文件 `src/extensions/<pack>.ts`,文件内一个 `declare module "../registry"` 块把该包全部模块合并进四张注册表(按 `group` 分落 QueryPropParams/QueryListParams/QueryMetaParams/ActionParams);门控入口吃 `keyof <注册表> & string`,pack 激活后自动进联合,**门控机制零改动**。激活 = `import type {} from "types-mediawiki-params/ext/<pack>"`(空 import 对本机制就够了:TS 不删未命名 import 除非是空类型导入被 emit 丢弃的场景 —— 那是「子路径要自足」的问题,pack 文件本身就是增广载体,不存在)。实测 `/// <reference types="...">` **不激活**增广,与 response 库结论一致;消费者 harness 钉死。
- **参数包只做请求侧,别 import response 库**:ext pack 一旦 `import type { ApiReviewResponse } from "types-mediawiki-response/ext/flaggedrevs"`,所有 ext pack 消费者(哪怕只要请求门控的 gadget)都得装 optional peer。联动留给 `with-response.ts` 的 `ActionResponseMap` 合并缝(与四张注册表同款),由消费侧自行合并,response 类型本来就在 response 库自己的 `ext/*` 下。因此 ext action 不在 `ActionWithResponse` 里,宽联合推断下落 `never` 消失,不放宽响应类型。
- **with-response 全等不变式只能钉在核心程序**:in-repo 的 typecheck 程序 include 整个 `src/`,`tests/` 里所有 pack 恒激活,`Exclude<keyof ActionParams & string, ActionWithResponse>` 必然混入 ext action —— 全等断言搬到 check:ext harness(无 pack 激活的程序)钉 `= 4 个未建模 action`,in-repo 只留成员断言(4 个仍被排除 + `ActionWithResponse ⊆ ActionParams`)。**以后加 pack 不用改断言;给响应库补建核心 action 响应时,先炸的是 harness 全等。**
- **EXT_MODULES 以 response 库为准但别照抄错处**:`sitematrix` 在 response 库的映射写成 `query+sitematrix`,实际 SiteMatrix 注册的是**顶层 action**(`action=sitematrix`,extension.json 的 `APIModules` 直挂)——它们的抓取也因此把它列 absent。本库 `scripts/ext-modules.ts` 已纠正并注释。
- **单版本事实的标注纪律**:ext 模块无跨版本并集 → 不写 `@since`;paraminfo `deprecated` 照常 `@deprecated`;参数从 org 快照兜底的,interface JSDoc 注明来源;配置门控注册与配置决定形态的,接口文档写明开关(Echo 两开关、FlaggedRevs 两个变体)。全部进 `audit:paraminfo --ext` 的机器校验范围(参数双向 + 注册表落点 + 接口命名),唯独无版本标签校验。
- **站点状态枚举在 ext 侧也有,且要源码取证**:FlaggedRevs 的 `flag_*` 参数(名与级别都来自 `$wgFlaggedRevsTags`,`ApiReview::getAllowedParams` 的 `'flag_' . getTagName()`)与 `stabilize.autoreview`(`$wgFlaggedRevsRestrictionLevels + 'none'`)是配置状态,按核心 `SITE_STATE_PARAMS` 同款规则开 `string` + note;`stabilize.default` 硬编码 `['latest','stable']` 是 schema 枚举,保持封闭。逐条查过 mw-refs 里克隆的扩展源码(`ApiReview.php`/`ApiStabilizeGeneral.php`),别靠猜。
- **连字符参数名与模块名**:`allow-account-creation`(globalblock)这类线格式参数名与 `scribunto-console` 这种模块名不是合法 TS 标识符 —— 成员名与**注册表键**都要 `JSON.stringify` 引号化(消费侧写的本就是线格式 `"allow-account-creation": true`);接口名做 Pascal 时按连字符分词(`ScribuntoConsole`),注册表键保持真名(`scribunto-console`)。
- **pack 文件内多模块只共享一条 import**:每模块各发 `import type { OneOrMore }` 会 TS2300 重复标识符 —— 生成器在 pack 级聚合 `usesOneOrMore`/`usesApiLimit` 发一条。
- **消费者 harness(check:ext)的坑**:tsc 诊断走 **stdout**,`execFileSync` 失败时只打印 err.message + stderr 会只见 "Command failed" —— err.stdout 也要打;pnpm 的 node_modules 是符号链接,Windows 下 `cpSync` 必须 `dereference: true` 否则 EPERM;`null as SomeInterface` 会被 TS2352 拒(无重叠),用 `declare const` 探针;**`@ts-expect-error` 抑制成功 = 编译 clean**,断言"应该报错"的场景要断言 check 失败(`!check(...)`),断言"错误被指令吞掉、但这是预期"的场景(reference 不激活)断言 check 成功 —— 两种语义别搞反。
- **多行对象字面量的 `@ts-expect-error` 贴属性行**:多余属性错误(TS2351/2561)报在**属性行**,缺必填(TS2345)报在**调用行** —— 测试里多行字面量的负向断言,指令位置跟着报错位置走(ext.test-d.ts 实测)。
- **组织快照兜底的键是裸名**:`versions/*.json`(含 org-1.47)的 `actions`/`queryModules` 键都是**裸 stem**,而 EXT_MODULES 条目带 `query+` 前缀 —— 兜底查找必须剥前缀,help 的键则仍是带前缀的 path。

## 9. generator 参数相关性(P2 实施结论)

- **事实零成本**:paraminfo 的模块对象自带 `generator: true` 标记(1.39 起就有),`fetch-paraminfo` 把整个模块对象存进快照,所以 9 份版本快照**现成携带**该事实,无需重抓。union 模型取发布版舰队并集(`ModuleUnion.generator`),org 不参与(与模块集纪律一致)。ext.json 同样自带(来自 fixture 或 org 兜底模块)。
- **第五张注册表**:`QueryGeneratorParams`(module 名 → 该模块参数接口),核心由 bootstrap-registry 对 `generator=true` 的 query 模块在同一条 `declare module` 块里追加第二个 interface;ext pack 由 bootstrap-extensions 同样追加。审计两种模式都核对「generator-capable 必须有 QueryGeneratorParams 条目;不 capable 必须没有」。
- **generator 线格式 = g 前缀重映射**:`generator=allpages` 的请求参数是 `gaplimit`(不是 `aplimit`)—— 生成器形态把每个参数名前加 `g`(= 模块前缀再冠 g)。类型层用模板字面量键重映射 `GeneratorForm<P> = { [K in keyof P as \`g${string & K}\`]: P[K] }`,在 `QueryGeneratorParamsFor<G>` 里套在注册表值外,注册表存原始接口、生成文件与审计零改动。
- **QueryRequest/QueryStringRequest 增加第四泛型 `G extends GeneratorNames = never`**,`generator?: G` 取代原先开放的 `generator?: string`。**行为变化**:字面量里的 `generator` 从"接受任意串"变为封闭门控 —— 这是 README「尚未建模」清单的最后一项落地。
- **⚠️ 宽联合守卫必须反转方向**:`QueryGeneratorParamsFor` 要在 `G=never`(未选生成器)与 `G=全联合`(嵌套调用时外层上下文类型把未解析的 G 实例化成**约束**)两种情况下返回 `unknown`。全联合判定必须写 `[GeneratorNames] extends [G]`(整个联合可赋给 G 才算宽),写成 `[G] extends [GeneratorNames]` 是错的 —— 单成员元组永远可赋给联合元组,守卫恒真、门控全哑(实测踩过)。
- **约束回退的两个表现**(同一根因,嵌套调用 `facade.get(defineQuery({...}))` 实测):① G 落到约束全联合 → 所有 generator 模块的必填参数(gpwppropname 等)被拉进请求;② 字面量写了非法 generator 名(如 `prop=info` 不可作生成器)时,候选违反约束被丢弃 → G 落到约束 → 静默放行。宽联合守卫把①②的参数面都清成 unknown;②的 generator 字段本身仍会被封闭联合拦住("info" ∉ GeneratorNames)。
- **QueryResponseOf 第一分支保持三参推断**:`Req extends QueryRequest<infer P, infer L, infer M>` —— 给它加 `infer _G` 会引入新的延迟条件成员,匹配直接毒化成 never(§2 哨兵教训的同款)。带 generator 的请求由新增的结构化数组分支 `{ prop?: OneOrMore<infer P2 extends ...> }` 接住,投影不丢(实测 ProjectedQueryResponse<"revisions"> 正确)。
- **测试助手的连带维护**:任何手写 `QueryRequest<P, L, M>` 签名(测试 declare function、README 包装器示例、mw.ts 两份清单)都要补第四参;漏掉的直接表现为「generator 字段类型是 undefined」。
