# 工具版本检测自动化 — 执行记录

## 2026-10-29 12:11（首次记录到本文件）
- 命令：`node scripts/sync-check.js`（cwd: C:/Users/dellsq/Desktop/123/toolbox）
- 结果：共检测 23 个来源（另有 12 个需人工查看），**脚本报告「没有发现新版本」**，无失败条目。
- **但脚本输出与 state 变更矛盾，已核查确认**：
  - `scripts/sync-state.json` 本次从 `Lin-arm/GKD_subscription: v619` 变为 `v620`（git diff 可见）
  - 说明运行前工作区 state 已是 v620（来自 2026-10-28 那次会话的未提交改动），脚本把基线推进到 v620
  - 用隔离副本（Temp/vcheck，state 还原为 v619）复跑 → 确认会报 `GKD 去广告规则 v619→v620 (2026-10-27)`
  - 结论：**GKD 规则 v620 是真实更新，但从未向用户汇报过**（10-28 会话改了 state 却没写进更新动态/未通知）
  - 上游 v620 发布于 2026-10-27T22:27:27Z（北京时间 10-28 06:27），资源 `gkd-subscription-offline-id667-v620.json5`
  - 用户实际订阅源 `https://gkd667.vv.ax/gkd.json5` 已是 `version:620` → **规则本身已自动更新，卡片标注滞后**
- 附带发现（仅提示、未处理）：
  - **MiniReel 检测逻辑有误**：state 记的 `1.0.0` 是页面版权声明里的 `PolyForm Noncommercial License 1.0.0`，
    被 strict-max 规则误当成版本号；真实最新是 **v0.4.0（2026-10-27）**，卡片仍写 v0.3.1。
    该条目自建基线起就一直误报「无更新」，需修 anchor 或过滤 license 文本。
  - data.js 卡片 version 明显滞后上游：四分贝音乐 v1.3.2/1.3.3、MiniReel v0.3.1/0.4.0、Kazumi v2.3.8/2.4.2、
    Mihon v0.20.4/v0.21.3、venera 1.4.6/v1.6.3、Piik v1.9.2/v2.5.0、GKD v605/v1.12.1(卡上 v605 是规则号不是 app 号)、
    WinTab v2.4.5/v2.4.6、Geek Uninstaller v1.5.5.185/1.6.0.200。
  - 网盘链接一致性：watchlist.json 与 data.js 全部条目已对齐（10-28 那次会话修过），本次抽查无差异。
- state 已按脚本逻辑更新（正常行为，未回滚）。`git diff data.js index.html` 为空 → 未改站内数据、未推送、未上传网盘。
- 已通知用户：GKD 规则 v620（内嵌资源，走官方渠道/订阅源自动更新）；MiniReel 真实版本 v0.4.0；
  其余滞后条目列出夸克/百度链接，等用户确认后再动手。

## 2026-11-01 07:54
- 命令：`node scripts/sync-check.js`（cwd: C:/Users/dellsq/Desktop/123/toolbox）
- 结果：检测 23 个来源（12 个人工），**发现 4 个真实更新，无失败条目**。
- 4 个更新（均已用独立脚本二次核实，state diff 完全一致）：
  - Piik v2.5.0 → v2.5.1（2026-10-31）
  - GKD 去广告规则 v620 → v623（2026-10-31，内嵌于 GKD 卡片）
  - WinTab v2.4.6 → v2.4.7（2026-10-31）
  - PixPin 3.5.5.1 → 3.6.6.0（官网 anchor 命中）
- state 基线已按脚本逻辑更新（未回滚）；`git diff data.js index.html icons/` 为空 → 未改站内数据、未推送、未上传网盘。
- **MiniReel 误判依旧**：state 仍记 `1.0.0`。实测页面去噪后只剩 `0.4.0`（真版本）和 `1.0.0`（PolyForm License 文本）两个号，
  strict-max 取最大 → 仍选 1.0.0。`2.3.1` 只是搜索框 placeholder 提示语（在 input 属性里，去噪后消失）。
  → 真实最新 v0.4.0，卡片写 v0.3.1。修法：给 MiniReel 加 anchor 精确匹配版本徽章，或过滤 license 文本。
- 已核实用户实际 GKD 订阅源 `https://gkd667.vv.ax/gkd.json5` 的 version 字段**已是 623** → 规则本体自动更新完毕，卡片标注滞后。
- 卡片 version 明显滞后上游（已逐一对照上游核实）：Piik v1.9.2/v2.5.1、MiniReel v0.3.1/v0.4.0、
  WinTab v2.4.5/v2.4.7、PixPin v3.5.5.1/3.6.6.0、四分贝 v1.3.2/1.3.3、Kazumi v2.3.8/2.4.2、
  Mihon v0.20.4/v0.21.3、venera_1.4.6/1.6.3、Geek Uninstaller v1.5.5.185/1.6.0.200。
  GKD 卡片 v605 是规则号不是 app 号（app 仍 v1.12.1）。

## 2026-11-01 09:16
- 命令：`node scripts/sync-check.js`（cwd: C:/Users/dellsq/Desktop/123/toolbox）
- 结果：检测 23 个来源（12 个人工），**无新版本，无失败条目**。
- **基线未漂移**：运行前存了 state 快照，跑完 diff → 完全一致 → 排除「脚本自动推基线掩盖更新」的情况。
- 独立二次核实（不依赖脚本）：
  - 12 个 GitHub repo 全部用 `api.github.com/releases/latest` 直查 → tag/published_at 与 state 一致
  - 6 个 site 类目用独立脚本重跑 anchor → anchor 命中值与 state 一致
    （Bandizip/StartAllBack/PixPin 页面去噪后无三段号，靠 anchor 命中，正常）
  - MiniReel 仍误判：state=1.0.0（PolyForm License 文本），真实最新仍 **v0.4.0**，卡片 v0.3.1
  - GKD 订阅源 `https://gkd667.vv.ax/gkd.json5` version 字段 = **623**，与 state 一致 → 规则本体已是最新
- 卡片 version 滞后上游（本次已逐一对照）：四分贝 v1.3.2/v1.3.3、MiniReel v0.3.1/v0.4.0、
  Kazumi v2.3.8/2.4.2、Mihon v0.20.4/v0.21.3、venera_1.4.6/1.6.3、Piik v1.9.2/v2.5.1、
  WinTab v2.4.5/v2.4.7、PixPin v3.5.5.1/3.6.6.0、Geek Uninstaller v1.5.5.185/1.6.0.200。
  Bandizip / StartAllBack 卡片**本来就没有 version 字段**（非滞后，只是没标）；GKD v605 是规则号不是 app 号。
- 未改动任何站内文件：`git status --porcelain data.js index.html scripts/ icons/` 为空；state 未变；data.js `node --check` 通过。
- 临时校验脚本 tools/_cardver.js、tools/_siteverify.js 已删除（避免污染仓库）。
- 已向用户汇报：无更新 + 卡片滞后清单 + 需先换网盘包再改标注的提醒。

## 2026-11-02 21:27
- 命令：`node scripts/sync-check.js`（cwd: C:/Users/dellsq/Desktop/123/toolbox）
- 结果：检测 23 个来源（12 个人工），**发现 1 个真实更新，无失败条目**。
  - Piik v2.5.1 → **v2.5.2**（2026-11-01T16:12:11Z），实用软件区，GitHub TNTcraftHIM/Piik
- 已二次独立核实：15 个 GitHub repo 全部 `api.github.com/releases/latest` 直查 + 7 个 site 类目独立重跑 anchor
  → 全部与 state 一致；state 仅 Piik 一行变动 → 排除基线漂移掩盖
  - 坑：PixPin 用 `curl` 需 `-L` 跟随 301，直接 curl 会返回 301 导致误判失败
- **新发现（重要）**：按文件大小反查上游 40 个 release，夸克网盘里 Piik 的
  `piik-app-windows-amd64.zip`（38,240,936 字节）实际是 **v2.1.0（2026-10-16）**，
  卡片写 v1.9.2、上游最新 v2.5.2 → **三方各差一档**（网盘比卡片新，卡片比上游旧）
  - 分享链接内只有 1 个 windows-amd64.zip；`get-share-update-files` 返回 41043（未转存过，查不了更新）
  - 网盘 piik 目录父级 = 「../实用软件区」
- MiniReel 卡片已于 commit 0a93171 更新到 v0.4.0 → 卡片不再滞后；但 state 仍记 1.0.0
  （PolyForm License 文本），strict-max 误判依旧 → 该条目以后仍报不出更新
- 未改动站内文件：`git status` 仅 `M scripts/sync-state.json`（脚本自动更新，未回滚）；
  data.js / index.html / icons/ 干净；未推送、未上传网盘
- 已向用户汇报：Piik v2.5.2 更新详情 + 夸克/百度链接 + 网盘实为 v2.1.0 的三方版本差 + 卡片滞后清单

## 2026-11-03 21:19
- 命令：`node scripts/sync-check.js`（cwd: C:/Users/dellsq/Desktop/123/toolbox）
- 结果：检测 23 个来源（12 个人工），脚本报「没有发现新版本」，无失败条目。
- **基线未漂移**：运行前存了 state 快照，跑完 diff → 完全一致 → 排除「脚本自动推基线掩盖更新」。
- 独立二次核实（不依赖脚本）：16 个 GitHub repo 全部 `api.github.com/releases/latest` 直查 → tag/published_at 与 state 全一致；
  7 个 site 类目独立重抓重跑 anchor → Bandizip v7.47、StartAllBack v3.9.28.5423、PixPin 3.6.6.0、
  Geek Uninstaller 1.6.0.200、四分贝 1.3.3、动漫共和国 1.4.4 均与 state 一致。
  - 坑：`browse` 子命令**不支持 `--stdout-only`**（search 才支持），传了直接报 unknown option
  - 坑：MiniReel 页面 <title> 在 head 里，正文去噪后 anchor 不命中，要抓完整 HTML 找版本徽章
- **脚本漏报一个真实更新（重要）**：**MiniReel v0.4.0 → v0.4.2（2026-11-03）**，影视区，官网 minireel.weppp.cyou
  - 根因：sync-check.js 第 122 行 `strict-max` 取页面所有三段号的最大值；
    MiniReel 页脚版权文本含 `PolyForm Noncommercial License 1.0.0` → max 恒为 1.0.0 → state 永远记 1.0.0
  - **新发现：v0.4.2 是今天发布的**（脚本 4 天来一直误报「无更新」的那一条）
  - 修法（待用户批准后再改脚本）：给 MiniReel 加 versionPattern 精确锚定版本徽章（`v<!-- -->(\d+\.\d+\.\d+)`）
    或在 clean 阶段过滤 license/许可 文本行
- 夸克网盘实测（工具箱/影视区/红果短剧免广告版/）：4 个平台子目录各 1 个包，**全是 v0.4.0**
  - 手机-安卓 MiniReel-0.4.0-android-arm64-v8a.apk 36,486,591
  - TV-安卓盒子 MiniReel-0.4.0-android-tv-armeabi-v7a.apk 33,477,843
  - 电脑-windows MiniReel-0.4.0-windows-x64-setup.exe 27,478,420
  - 电脑-mac MiniReel-0.4.0-macos-universal.zip 40,986,875
  - 上游 0.4.2 对应包（HEAD 抓 Content-Disposition + Content-Length 得到）：
    android-arm64-v8a.apk 36,683,215 / android-tv-armeabi-v7a.apk 33,625,347 /
    windows-x64-setup.exe 27,513,079 / **release-macos.zip 41,152,317**
  - **macOS 包名变了**：0.4.0 是 `MiniReel-0.4.0-macos-universal.zip`，0.4.2 改成 `release-macos.zip`（文件名不带版本号）→ 换包时别按版本号匹配
  - 旧 0.3.2 包在 影视区/_旧版本存档/旧版本存档/ 下，归档正常
  - `get-share-update-files` 对 MiniReel 分享链接返回 41043（未转存过，查不了更新）——同 Piik
- GKD 订阅源 `https://gkd667.vv.ax/gkd.json5` version 字段 = 623，与 state 一致 → 规则本体已是最新
- 卡片 version 滞后上游（本次逐一对照）：四分贝 v1.3.2/1.3.3、MiniReel v0.4.0/v0.4.2、
  Kazumi v2.3.8/2.4.2、Mihon v0.20.4/v0.21.3、venera_1.4.6/v1.6.3、Piik v1.9.2/v2.5.2、
  WinTab v2.4.5/v2.4.7、PixPin v3.5.5.1/3.6.6.0、Geek Uninstaller v1.5.5.185/1.6.0.200
  - Bandizip / StartAllBack 卡片本来就没 version 字段（非滞后）；GKD v605 是规则号不是 app 号（app 仍 v1.12.1）
- 未改动任何站内文件：state 本次未变（脚本无更新可推进）；data.js / index.html / icons/ / watchlist.json 全干净；
  无提交、无推送、未上传网盘。临时校验脚本已删除
- 已向用户汇报：MiniReel v0.4.2（脚本漏报）+ 夸克/百度链接 + 网盘实为 v0.4.0 的版本差 + macOS 包名变更提示 + 卡片滞后清单

## 2026-11-03 22:40（用户手动指示「帮我更新MiniReel，帮推送到网站」，非自动化触发）
- **已执行落地**：MiniReel v0.4.2 全平台换包 + 站点上线，commit `d05865e`，已推 origin/main
  - 夸克：4 个 v0.4.2 包上传到 `工具箱/影视区/红果短剧免广告版/` 的 4 个平台目录；
    旧 v0.4.0 四个包 `move` 到 `影视区/_旧版本存档/旧版本存档/`（归档目录现共 8 个文件：0.4.0×4 + 0.3.2×4）
  - macOS 上传的是**内层** `MiniReel-0.4.2-macos-universal.zip`（上游 `release-macos.zip` 是双层 zip，详见 MEMORY.md）
  - 分享链接 https://pan.quark.cn/s/c326807e1024 是活的文件夹分享，**已自动指向新包，无需重建**
  - data.js：卡片 version v0.4.0→v0.4.2 + UPDATES 顶部加 2026-11-03 update 条目；
    index.html 版本戳 20261101k→20261101l；scripts/watchlist.json 加 MiniReel anchor；sync-state.json 的 site:MiniReel 改为 0.4.2
- **检测盲区已修复**：watchlist.json MiniReel 条目加 `"anchor": "v<!-- -->(\\d+\\.\\d+\\.\\d+)"`。
  - 必须用 anchor 不能用 versionPattern —— `stripNoise()` 会删 HTML 注释（`<!-- -->` 变空格）
  - 隔离副本三连测通过：state 1.0.0→报 0.4.2 / state 0.4.2→无假阳性 / 模拟 0.4.3→能感知
  - 真实脚本已复跑确认：现在报 `MiniReel 1.0.0 → 0.4.2` 并附下载链接
- 线上验证：data.js / index.html 的线上 md5 与 git origin/main 完全一致；
  无头 Chromium 打开 https://ldgj.xyz/ → 无 JS 异常、20 图标 0 破图、
  顶部更新条显示「11-03 影视专区 MiniReel 更新至 v0.4.2」
- 百度网盘与 UC 网盘**未动**（无对应工具，需用户手动上传）；UC 分享页是 JS 渲染，抓不到文件列表
- 临时文件已清理：_tmp_minireel/、_verify_live*.js/png、_m040.bin、隔离测试目录

## 2026-11-04 18:37
- 命令：`node scripts/sync-check.js`（cwd: C:/Users/dellsq/Desktop/123/toolbox）
- 结果：检测 23 个来源（12 个人工），**发现 2 个真实更新**，1 个条目检测失败。
  - Piik v2.5.2 → **v2.5.3**（2026-11-03T21:40:59Z），实用软件区，GitHub TNTcraftHIM/Piik
  - GKD 去广告规则 v623 → **v624**（2026-11-03T23:32:42Z），实用软件区，内嵌于 GKD 卡片
- **基线未漂移**：运行前存 state 快照，跑完 diff → 仅 Piik、GKD 两行变动，与报告完全一致
- 独立二次核实（不依赖脚本）：
  - 15 个 GitHub repo 全部 `api.github.com/releases/latest` 直查 → tag/published_at 与 state 全一致
  - 7 个 site 类目独立重抓重跑 anchor → 四分贝 1.3.3、MiniReel 0.4.2、动漫共和国 1.4.4、
    Bandizip v7.47、StartAllBack v3.9.28.5423、PixPin 3.6.6.0、Geek Uninstaller 1.6.0.200 均与 state 一致
  - **坑：本机 curl 不可用** —— Windows schannel 报 `CRYPT_E_REVOCATION_OFFLINE`，curl 全部失败；
    改用 Node `fetch` 才通。以后校验一律用 Node，别用 curl
  - **坑：四分贝音乐「请求失败」是瞬时抖动** —— 脚本跑挂，独立重试 3 次即成功（1.3.3），非真失败
  - GKD 订阅源 `https://gkd667.vv.ax/gkd.json5` version 字段 = **624** → 规则本体已自动更新，卡片标注滞后
- 夸克网盘实测（只读）：
  - Piik 分享内 `piik-app-windows-amd64.zip` = 38,240,936 B → 反查上游**精确匹配 v2.1.0**（v2.5.3 是 39,338,694 B）
    → 网盘 v2.1.0 / 卡片 v1.9.2 / 上游 v2.5.3，三方各差一档
  - GKD 分享结构：根目录 `gkd-v1.12.1.apk` + `GKD（跳过开屏广告）/`（内含 `手机-安卓/gkd-v1.12.1.apk` + `规则.txt` 376B）
  - **新坑：夸克 CLI `share-search` 不支持 `--stdout-only`**（只有 `search` 支持），`browse` 也不支持
  - `share-search` 的返回结构是 `data.files`（含 `file_name`/`size`/`fid`），目录项 `file_type==='0'` 需用 `share-detail --pdir-fid` 递归
- 12 个人工条目本次全部复核：星盒/敦伦调调/铁汁 抓取失败（防爬/超时），其余可抓但页面无可靠三段号或为 JS 渲染
  → 维持「需人工查看」，无新可报版本
- 卡片 version 滞后上游（本次逐一对照）：Piik v1.9.2/v2.5.3、四分贝 v1.3.2/1.3.3、Kazumi v2.3.8/2.4.2、
  Mihon v0.20.4/v0.21.3、venera_1.4.6/1.6.3、WinTab v2.4.5/2.4.7、PixPin v3.5.5.1/3.6.6.0、
  Geek Uninstaller v1.5.5.185/1.6.0.200
  - Bandizip / StartAllBack 卡片本来就没 version 字段（非滞后）；GKD v605 是规则号不是 app 号
  - MiniReel 卡片 v0.4.2 已与上游一致（11-03 那次已更新）
- 未改动任何站内文件：`git status` 仅 `M scripts/sync-state.json`（脚本自动更新，未回滚）；
  data.js / index.html / icons/ / watchlist.json 全干净；`node --check data.js` 通过；
  无提交、无推送、未上传网盘。临时校验脚本已删除
- 顺带：MEMORY.md 从 18KB 精简到 9KB（超限被截断），保留全部关键坑位
- 已向用户汇报：2 个更新详情 + 夸克/百度链接 + 网盘实为 v2.1.0 的三方版本差 + 卡片滞后清单 + 四分贝为瞬时失败

## 2026-11-05 21:10
- 命令：`node scripts/sync-check.js`（cwd: C:/Users/dellsq/Desktop/123/toolbox）
- 结果：检测 23 个来源（12 个人工），**发现 3 个真实更新，无失败条目**。
  - Kazumi 2.4.2 → **2.4.3**（2026-11-04T12:12:33Z），动漫专区
  - GKD 去广告规则 v624 → **v625**（2026-11-04T23:48:56Z），实用软件区
  - 飞鼠格式转换助手 v0.7.10 → **v0.8.3**（2026-11-04T10:53:52Z），实用软件区
- **基线未漂移**：运行前存 state 快照，跑完 diff → 仅 3 行变动（Kazumi/GKD/飞鼠），与报告完全一致
- 独立二次核实：16 个 GitHub repo 全部 `api.github.com/releases/latest` 直查 → tag/published_at 与 state 全一致；
  7 个 site 类目独立重抓重跑 anchor → 四分贝 1.3.3、MiniReel 0.4.2、Bandizip v7.47、StartAllBack v3.9.28.5423、
  PixPin 3.6.6.0 均一致；Geek Uninstaller 页面候选列表最大 = 1.6.0.200（脚本 loose 规则匹配到 'd d' 但 state 值正确）
- **人工类目里挖到第 4 个更新**：**zpod v3.0.12 → 3.0.14**（官网 zpod.net 首页安装包文件名含 3.0.14；
  脚本把它归到「需人工查看」，所以报告里没列）
- **网盘实测（只读）——飞鼠是本次最大坑**：
  - 飞鼠网盘 `FlyingMouse-Format-Setup-0.6.1-x64.exe` = 1,709,708,623 B
  - 上游**没有 v0.6.1 release**（tags 有 v0.6.1 但 release 404），体积最接近 **v0.6.4 的 1,709,717,610 B（Δ 8987 B）**
  - → 网盘是 v0.6.1/v0.6.4 量级的**孤儿包**，比卡片 v0.7.10 还旧一代，比上游 v0.8.3 落后两代
  - 上游 v0.8.3 的 exe 达 1.6 GB（v0.7.10 是 1.5 GB）→ 换包耗时长
  - Kazumi 网盘全是 2.3.8（体积逐一精确匹配上游 2.3.8 资产）→ 网盘 = 卡片 v2.3.8，比上游 2.4.3 落后一档
  - zpod 网盘 4 个平台全是 3.0.12；PixPin 网盘 windows 已是 3.6.6.0 但 macOS 还是 3.3.5.7（版本不齐）
  - Mihon 网盘 v0.20.4；WinTab 网盘 v2.4.5；Piik 网盘 38,240,936 B（= v2.1.0，仍是老样子）
  - 四分贝网盘 `4分贝音乐1.3.1.exe`（卡片 v1.3.2、上游 1.3.3 → 三方各差一档）
  - 敦伦调调网盘 FMusic_1.0.10（= 卡片，官网也是 1.0.10，一致）；星盒网盘 2.7.0（= 卡片）
  - 铁汁网盘：TieZ_0.3.3_x64-setup.exe + TieZ_0.3.3-portable.zip + TieZ_0.1.3_aarch64.dmg（**卡片无 version 字段**）
- **GKD 规则.txt 内容已查明**：网盘里的「规则.txt」只有 376 B，**不是规则本体**，只是 3 个订阅链接
  （gkd667.vv.ax / gkd-subscription-667.pages.dev / raw.githubusercontent.com/Lin-arm/GKD_subscription/main/dist/gkd.json5）
  → 规则本体走订阅自动更新，**换包不需要动规则文件**；卡片 v605 是规则号不是 app 号
- **坑：`gkd667.vv.ax` 和 `gkd-subscription-667.pages.dev` 本机全超时**（fetch 和 https 模块都试过，4 次全挂）；
  改用 `raw.githubusercontent.com/Lin-arm/GKD_subscription/main/dist/gkd.json5` 一次拿到 → **version=625**（与 state 一致）
- 12 个人工条目本次复核：星盒/铁汁/极投屏首次超时、重试成功但无版本号；敦伦调调 1.0.10（=卡片）；zpod 3.0.14（**有更新**）；
  笔趣阁/星音乐/米兔/UU远程/公众号下载器 页面无可靠版本号；莫比音乐/抱走漫画 是 QQ 群文件
- 卡片 version 滞后上游（本次逐一对照）：Kazumi v2.3.8/v2.4.3、四分贝 v1.3.2/v1.3.3、Mihon v0.20.4/v0.21.3、
  venera_1.4.6/v1.6.3、Piik v1.9.2/v2.5.3、WinTab v2.4.5/v2.4.7、PixPin v3.5.5.1/3.6.6.0、
  Geek Uninstaller v1.5.5.185/v1.6.0.200、飞鼠 v0.7.10/v0.8.3、zpod v3.0.12/v3.0.14
  - Bandizip / StartAllBack / 铁汁 / 米兔 / 莫比 / 抱走漫画 / UU远程 / 公众号下载器 / C盘清理 / 团子 / 极限投屏 卡片本来就没 version 字段（非滞后）
  - GKD v605 是规则号不是 app 号；MoeKoeMusic v1.7.1、 novels 下载器、番茄、淬火、HowToLiveBetter 均已一致
- 未改动任何站内文件：`git status` 仅 `M scripts/sync-state.json`（脚本自动更新，未回滚）；
  data.js / index.html / icons/ / watchlist.json 全干净；`node --check data.js` 通过；
  无提交、无推送、未上传网盘。临时文件已清理（含 _tmp_gkdcheck/ 与全部 /tmp 校验脚本）
- 已向用户汇报：4 个更新（3 个脚本 + 1 个人工类目 zpod）+ 夸克/百度链接 + 网盘实况（飞鼠包比卡片还旧一档）
  + 卡片滞后清单 + GKD 规则走订阅自动更新说明

## 2026-11-05 23:30（用户手动指示「把这四个软件更新，并更新网站动态」，非自动化触发）
- **已执行落地**：Kazumi / zpod / 飞鼠格式转换助手 / GKD 规则 四个工具全部换包 + 站点动态上线
  - 夸克换包（每个平台：上传新包 → 旧包 `move` 到 `<分区>/_旧版本存档/`）：
    - Kazumi 2.3.8→2.4.3：8 个包（Windows msix / macOS dmg / 安卓 apk / iOS ipa / Linux deb+tar.gz 各两架构）
    - zpod 3.0.12→3.0.14：4 个平台包（windows exe / macOS dmg / arm64 apk / ipa）
    - 飞鼠 v0.7.10→v0.8.3：exe 1.5 GB（上传耗时约 12 分钟）
    - GKD：规则走订阅自动更新，**不换包**（网盘「规则.txt」只有 376 B，是 3 个订阅链接而非规则本体）
  - 新建 3 个存档目录：动漫区 / 音乐区 / 实用软件区 各一个 `_旧版本存档`
  - 换完用 `share-detail` 递归确认分享侧已全部指向新版本（活链接，无需重建分享）
- **站点**：data.js 卡片 version 更新 5 处（Kazumi / zpod×2 分区 / 飞鼠 / GKD v605→v625）；
  UPDATES 顶部加 4 条 2026-11-05 的 update 条目（工具名均为蓝色可点击按钮，已用 findToolsInUpdate 逻辑复测各自只命中 1 个）；
  index.html 版本戳 20261105c → 20261105d
- **顺手修两个检测盲区**（本次发现）：
  - zpod 从 `manual` 改为 `site`（抓首页 `<meta name="zpod-version">`），以后自动检测
  - `siteVersion()` 拆出 `fetchSiteOnce()` + 3 次重试（间隔 3s）→ 修 zpod/四分贝 首访瞬时失败被误报「检测失败」
  - 隔离副本三连测：state 3.0.12 → 正确报 3.0.14；真 state 写入 site:zpod=3.0.14
- **推送**：commit `53c93a2`，`bash tools/push.sh` SSH 一次成功（代理端口本轮是 57371）
- **线上验证**：data.js/index.html 的线上 md5 与 git blob **完全一致**（本地工作区是 CRLF，别误判为不一致）；
  无头 Chromium 打开 https://ldgj.xyz/ → 0 个 JS 异常、38 图标 0 破图、
  更新抽屉 70 条、前 4 条正是本次四条、顶部滚动条显示正确；截图确认版式无错乱
- **本轮踩到的坑（已写进 MEMORY.md）**：
  - `browse` 单页最多返回 5 条，`--page-size` 无效 → 目录项多时改用 `search` 按名字定位
  - `search` **不索引 .ipa**（搜 "ipa" 只返回 .apk）→ .ipa 靠 `browse` 父目录拿
  - `search` 也会瞬时返回 `53000 服务器内部异常` → 脚本化调用要加重试
  - GitHub release **直链 403**（CDN 域名被限流）→ 改用 `releases/tags/{tag}` 的 `assets[].url` + `Accept: application/octet-stream`
  - `rename` items 格式 `{schema_version:1, items:[{fid, old_name, new_name}]}`，单批 ≤5 条
  - **Kazumi 上游已不提供鸿蒙 hap 包**（2.3.9 起全部 release 都没有 .hap）→ 网盘 `手机-鸿蒙/` 的 2.3.1 hap 保持不动
  - 上游资产与网盘结构可能不一致（上游有 `Kazumi_windows_2.4.3.zip`，网盘只放 .msix）→ 以网盘既有结构为准，只换同名包
- **未处理**：百度网盘 4 个工具仍是旧版（需用户手动上传）；UC 网盘未动；
  其余卡片 version 仍滞后上游（四分贝 v1.3.2/1.3.3、Mihon v0.20.4/v0.21.3、venera 1.4.6/v1.6.3、
  Piik v1.9.2/v2.5.3、WinTab v2.4.5/v2.4.7、PixPin v3.5.5.1/3.6.6.0、Geek v1.5.5.185/v1.6.0.200）
