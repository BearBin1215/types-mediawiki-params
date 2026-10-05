# org-1.47 候选甄别记录(1.47.0-wmf.22 vs 发布版舰队 1.39–1.46)

org 快照自发现会带入宿主 wiki(mediawiki.org)的扩展与生产配置,逐项甄别如下。
核对手段:1.46 容器源码 grep(`mw146`)、1.39 容器源码 grep(`mw139`)、org paraminfo 的 source 字段。

## 收入核心包(源码证实为 core,2 项)

| 参数                                                                                             | since | 证据                                                                                                                                         |
| ------------------------------------------------------------------------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `watchlistexpiry`(block/edit/delete/move/protect/rollback/unblock/undelete/upload/userrights 等) | 1.39  | ApiBlock/ApiEditPage/ApiUnblock/ApiUpload 1.39–1.46 源码均在;`$wgWatchlistExpiry` 条件注册(舰队容器默认关闭,故 paraminfo 无);JSDoc 带 note。 |
| `watch.expiry`                                                                                   | 1.39  | ApiWatch.php 1.39/1.46 源码均在,同上条件注册。                                                                                               |

**撤销误收(2026-10 复核,1.47-wmf.22 源码可及后)**:`parse.mobileformat` 与 `edit.editorinterface` 曾按「1.47 新增 core」收入,实为扩展注入 —— 1.39/1.46/1.47 三版 core 源码里 `mobileformat` 只被 **读取**(`ApiParse.php` 的 `isset( $params['mobileformat'] )`),从无注册代码;`editorinterface` 在 1.47 全 core 源码树 0 命中。两者均由扩展向 core 模块注入参数(MobileFrontend 向 `action=parse`,VisualEditor/DiscussionTools 向 `action=edit`),按「核心模型只收 core」原则从 `ORG_ONLY_CORE` 移除。

## 排除(扩展 / 生产集群,33 项)

| 参数                                                               | 判定                                                                            | 证据                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| edit.captchaword / captchaid / wgConfirmEditForceShowCaptcha       | ConfirmEdit(经 hook 注入 core 模块,paraminfo source 仍显示 MediaWiki)           | 1.46 ApiEditPage 无注册;org 装 ConfirmEdit。            |
| edit/logout.checkuserclienthints                                   | CheckUser                                                                       | 1.46 无。                                               |
| edit.discussiontoolsautosubscribe                                  | DiscussionTools                                                                 | 1.46 无。                                               |
| expandtemplates/parse.templatesandbox* ×9                          | TemplateSandbox                                                                 | 1.46 无。                                               |
| search.srqiprofile/srqdprofile、prefixsearch.psprofile             | CirrusSearch                                                                    | 1.46 无。                                               |
| logout.global                                                      | CentralAuth                                                                     | ApiLogout.php 1.46 源码 0 命中。                        |
| clientlogin.loginreauthenticate、authmanagerinfo.amireauthenticate | CentralAuth/AuthManager 相关,无法从可及源码证实为 core → 按「拒绝猜测」剔除     | ApiClientLogin/ApiQueryAuthManagerInfo 1.46 均 0 命中。 |
| upload.license / upload.autotext                                   | 生产集群内建补丁                                                                | ApiUpload.php 1.46 源码 0 命中。                        |
| imagerotate.* 的「移除」                                           | **误报撤销**:org 上该模块为 ApiDisabled(站点禁用),非版本移除;org 不参与移除判定 | org paraminfo classname=ApiDisabled。                   |

## 机制结论

- org 快照只贡献:白名单参数(fleet 模块集内)、core 模块的 help 文案(最新散文)。
- org 永不:扩张模块集、贡献枚举值、触发移除判定。

## 2026-10 复核(1.47-wmf.22 源码可及后的改判)

拿到 `wmf/1.47.0-wmf.22` core 源码(稀疏克隆于 `mw-refs/core-wmf22`)后,对当年按「1.46 源码 0 命中」判出的排除项做终审:

### 改判收入(4 项 + 2 组枚举值)

| 事实                                                                                                                | 证据                                                               |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `logout.global`(boolean)                                                                                            | ApiLogout.php `getAllowedParams` 注册;1.46 无 → **1.47 新增 core** |
| `upload.autotext`(boolean)/ `upload.license`(string)                                                                | ApiUpload.php:1307/1311 无条件注册;1.46 无 → **1.47 新增 core**    |
| `clientlogin.loginreauthenticate`(string)                                                                           | ApiClientLogin.php:130 注册;1.46 无 → **1.47 新增 core**           |
| `authmanagerinfo.amireauthenticate`(string)                                                                         | ApiQueryAuthManagerInfo.php:118 注册;1.46 无 → **1.47 新增 core**  |
| `siteinfo.siprop` += `crosssiteajaxdomains`                                                                         | 1.47 ApiQuerySiteinfo.php:119/1060;1.46 无                         |
| `languageinfo.liprop` += digittransforms/digitgroupingpattern/minimumgroupingdigits/namespacenames/namespacealiases | 1.47 ApiQueryLanguageinfo.php 13 值 vs 1.46 8 值                   |

均已进 `paraminfo-union.ts` 的 `ORG_ONLY_CORE`(参数)与 `ORG_ONLY_CORE_VALUES`(值级,新增机制)。

### 维持排除

`captchaword`/`templatesandbox*`/`psprofile`/`discussiontoolsautosubscribe` 等(1.47 core 仍 0 命中,确认扩展注入)。枚举级 org-only 值(tokens.type 的 CentralAuth token 类型、内容模型扩展值、CirrusSearch 的 srsort 值、querypage 扩展子页、tags)**值本身**仍不收(org 不贡献枚举值);但凡值集由注册表/钩子/站点配置决定的参数,其**类型**按 §3.10 开成 `… | (string & {})`(如 `srsort` ← `getValidSorts()`、`letype` ← `$wgLogTypes`),使扩展值在类型层被接受。

### 方法边界

org 上因站点配置关闭而隐藏的 core 参数不可能从快照发现。2026-10 已补做 1.47-wmf.22 全量 `getAllowedParams` 源码提取(含 `getConfig()` 读取扫描):

- 被配置隐藏存在性的 core 参数只有 `upload.copystatus` / `upload.source`(`$wgUseCopyrightUpload`,默认 false;该配置 1.47 起标记弃用、功能移除中)。两者 1.47 新增(1.39–1.46 源码与 i18n 均无),**已建模**:经 `paraminfo-union.ts` 的 `SOURCE_ONLY_CORE`(全快照缺席参数注入机制,与只认 org 快照的 `ORG_ONLY_CORE` 互补)注入,声明可选 + note,`@since 1.47`。
- `watchlistexpiry` / `expiry` 由 `ApiWatchlistTrait` 条件注册,已进 `ORG_ONLY_CORE`。
- 其余 `getAllowedParams` 内的配置读取只改帮助文案或默认值(MiserMode、ActiveUserDays、BlockCIDRLimit、RCMaxAge、FeedClasses、OpenSearchDefaultLimit 等),不改参数存在性;`$wgRestrictionLevels`/`$wgRestrictionTypes`/`$wgLogTypes` 等决定**值集**的已在 `OPEN_ENUM_PARAMS` 开成开放联合。
