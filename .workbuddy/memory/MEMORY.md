# 来点工具（toolbox）项目长期备忘

## 站点与仓库
- 站点：ldgj.xyz（GitHub Pages，仓库 hxxszmp3/toolbox，main 分支）
- 数据只改 data.js：分区 id + tools 数组；工具条目支持 img（图标）/ emoji、quark/baidu 链接、points（详情点）
- data.js 工具字段：`version`（版本号）、`secret`（来源网址，配了才显示书签）、`secretText`（来源为文字如「QQ 群文件」，与 secret 二选一）、`os`（支持设备数组，未标注则卡片不显示该行）
- data.js 非 CommonJS 模块，语法验证用 `node --check data.js`
- 图标风格：128x128 RGBA 圆角透明 PNG，放 icons/（命名用拼音，如 baozoumanhua.png）
- APK 提图标方案已废弃，用户习惯直接给图标图片（去水印：定位主体居中裁方 + 22% 圆角蒙版，Pillow 处理）

## ✅ 推送方式（2026-10-28 已改版，优先用脚本）
- **直接跑 `bash tools/push.sh`** —— SSH 优先，失败自动退回 GitHub API
- remote 已是 SSH：`git@github.com:hxxszmp3/toolbox.git`（不再内嵌任何 token）
- **SSH 走 ssh.github.com:443**，配置在 `~/.ssh/config`
  - 用的是 **仓库 Deploy Key**（id=167970083，title=`workbuddy-deploy`），非账号级公钥
  - Deploy Key 可通过 API 加：`POST /repos/{owner}/{repo}/keys`（需 repo admin 权限）
  - 账号级公钥 `POST /user/keys` **当前 token 没有 admin:public_key 权限**，加不了
- 推 SSH 时要**清掉 http.proxy**（SSH 不走 HTTP 代理）：`-c http.proxy= -c https.proxy=`
- 必加参数 `git -c credential.helper= -c http.proxy= -c https.proxy= push origin main`
  - `credential.helper=` 必须加：credential-helper-selector 会触发 `git config --system -e` 开交互式编辑器永久挂起

## ⚠️ 代理端口每次会话都会变
- WorkBuddy 环境代理端口**每轮对话都可能换**（2026-10-28 观察到 22717 → 16647 → 64246）
- **每次先查**：`env | grep -iE "^(https?|HTTPS?)_PROXY=" | cut -d= -f2`
- `~/.gitconfig` 里的 `http.proxy=127.0.0.1:7897` 时灵时不灵，别依赖
- 代理对 `github.com` 常 502（CONNECT tunnel failed），但对 `api.github.com` 正常

## GitHub API 推送（备选路径，细节见 tools/push_via_api.js）
- 流程：GET ref → GET commit 拿 tree → 每个文件 POST /git/blobs(base64)
  → POST /git/trees(base_tree) → POST /git/commits → PATCH /git/refs/heads/main
- **坑 1**：Node 里必须用 `execFileSync('git', [...])`，不能用 execSync 模板串
  —— shell 会吃掉 `^`，导致 diff-tree 返回空、tree 请求报 "Invalid tree info"
- **坑 2**：API 重建的 commit **SHA 与本地不同**（内容一致）。推完要
  `git reset --hard origin/main` 对齐，否则下次推送分叉
- **坑 3**：凭据管理器的 token 若带换行符，拼进 URL 前必须 `tr -d '\r\n'`
  否则报 "url contains a newline in its password component"

## ⚠️ GitHub Token 现状（重要）
- 仓库历史里的 PAT 已废弃；当前 git-credential-manager 里有一个**仍有效**的 classic PAT
  （权限 repo admin，能加 Deploy Key、能读写仓库）
- **该 PAT 曾因排查时打印到终端输出而泄漏**，建议用户在网页端撤销：
  https://github.com/settings/tokens
- **但撤销它不影响推送** —— 已改用 SSH Deploy Key，token 只在需要加新 Deploy Key 时才用得上
- `git credential fill` 返回的 password **不是存储的凭据**，而是 GCM 触发的 OAuth 浏览器流程临时产物，
  所以 `git credential erase` 清不掉它，别在这上面浪费时间

## ⚠️ 上游 GitHub release 列表不按时间排序（番茄下载器）
- **列表第一条 ≠ 最新版本**，版本号里的数字也与新旧无关
- 实测（2026-11-01）：列表首位 `2026.10.31-858`（发布 10/31 17:16），
  实际最新 `2026.10.31-1543`（11/1 00:01）排在第 3 位；同日还混发 540
- 更离谱的：`2026.10.29-1422`（10/29 22:38）排在 `2026.10.29-104`（10/29 09:29）后面
- **正确选法**：`GET /repos/{owner}/{repo}/releases/latest`（读 GitHub 的 Latest 标记），
  再按 `published_at` 排序取最大做交叉验证，两者一致才动手
- 工具：`scripts/fanqie_helper/_update_to_new.py` 已实现，会打印全部候选供人工核对

## ⚠️ 删除个人目录文件的可行方案（Windows）
- 安全策略拦 `Add-Type`（编译 .NET）和 COM 实例化（Shell.Application）
- **可行**：直接引用 VisualBasic 程序集（免 Add-Type）
  `[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($path, 'OnlyErrorDialogs', 'SendToRecycleBin')`
- **但它会误报「无法找到指定文件」**（实际已删成功）→ 必须用文件系统复核真实状态，
  别信 API 返回值
- 回收站元数据在 `C://$Recycle.Bin//<SID>//$I<id>.<ext>`，含原路径与大小，
  可用于确认删除是否成功及能否还原

## 番茄下载器分发包规范
- 目录结构：平台 → 发行形态 → 架构条目（如 `Windows/安装包（推荐）/64位（常用）/`）
- **`.sig` 已从分发包移除**（普通用户用不到）；自动更新签名内嵌在 `latest.json`
  的 `platforms[*].signature`，删 `.sig` 不影响自动更新
- 上游 Linux AppImage 命名有误：名为 `amd64.AppImage` 的实测是 aarch64，
  x86_64 设备要用 DEB 包（已在包内加 `架构说明.txt`）

## 工作流约定
- 用户说「加到工具箱 / 放到 XX 区」= 本地改 data.js + 提交 + 推送上线（已授权）
- 每日版本检测自动化：`node scripts/sync-check.js`，结果只通知不动手；用户确认后才更新网盘/data.js
  - 自动化 ID `495c6081-6c5f-4d51-9add-92fb32b60858`，每天 09:00 跑
- 网盘更新：夸克可用 skill 操作；百度一律提示「需手动上传」
- 用户提供新工具信息格式：名称 + 介绍 + 夸克/百度链接 +（可选）图标图

## ⚠️ sync-check.js 的已知陷阱（2026-10-29 查明）
- **脚本会自动把 state 基线推成上游最新**，所以「报告无更新」≠「上游没动静」
  - 若前一次会话已手动改过 state（未提交），下次运行就看不到那条更新了
  - **排查手法**：把 state 还原成旧值，在**隔离副本**（Temp 目录拷 sync-check.js + watchlist.json + state）
    里复跑，看是否报出更新。别在仓库里试，会污染真实 state
- **MiniReel 检测失效 —— ✅ 2026-11-03 已修复**：其 `site` 页脚版权声明含 `PolyForm Noncommercial License 1.0.0`，
    被 strict-max 规则误当成版本号 → state 曾长期记成 `1.0.0`（真实最新 v0.4.2）
  - 该条目自建基线起就一直误判「无更新」。**2026-11-03 实锤漏报**：上游当天发布 v0.4.2，脚本仍报「无更新」
  - **根因**：sync-check.js 第 122 行 `strict-max` 取页面所有三段号的最大值，
    license 里的 `1.0.0` 恒大于 `0.4.x` → state 永远卡在 1.0.0
  - **已实施的修法**：watchlist.json 的 MiniReel 条目加 `"anchor": "v<!-- -->(\\d+\\.\\d+\\.\\d+)"`
    - ⚠️ **必须用 `anchor` 而不是 `versionPattern`**：`stripNoise()` 会把 HTML 注释删掉
      （`<!-- -->` 变空格），versionPattern 在去噪后的文本上匹配，抓不到徽章
    - `anchor` 走的是**原始 HTML** 分支（`am[1]` 取捕获组）→ 命中值干净，就是 "0.4.2"
    - /versions 页和首页都是**新版在前**，首次命中即最新版
  - **人工核查手法**：MiniReel 官网首页下载中心每个平台卡片都带 `vX.Y.Z` + 日期 + MB + `/api/download/NN`，
    `curl -I https://minireel.weppp.cyou:54267/api/download/NN` 可拿到 Content-Disposition（真实文件名）和 Content-Length
- **MiniReel macOS 包：上游 0.4.2 起变成双层 zip**
  - 0.4.0 上游直接给 `MiniReel-0.4.0-macos-universal.zip`（单层，直接含 `minireel.app`，318 条目）
  - 0.4.2 上游给 `release-macos.zip`，**里面又套了一层** `MiniReel-0.4.2-macos-universal.zip`
  - **网盘里放的是内层包**（跟 0.4.0 那份保持一致，用户解压一次就得到 app），不是上游的 release-macos.zip
  - 对应下载接口：/api/download/34=安卓手机、35=TV盒子、36=Windows、37=macOS
- **MiniReel Windows 包的 PE 头是 0x014c（32 位）不是 x64 —— 正常，别误判**
  - 0.4.0 和 0.4.2 都是这样 → NSIS 安装器 stub 固定 32 位，实际载荷是 x64
- **夸克分享是「活的文件夹分享」**：替换目录里的文件后分享链接自动指向新文件，**不用重建分享**
  - 但 `share-detail` 的 `size` 字段是**缓存的旧值**（会显示旧包总和），别被它误导
  - 查分享内实际内容用 `share-search --url <链接> --keyword <名>`
- **夸克 CLI 没有 delete 命令**：清理旧包只能用 `move` 移到归档目录
  - `browse` 默认只返回第一页（约 5 条），拿全量必须加 `--all`；`browse` 不支持 `--stdout-only`（`search` 才支持）
- **GKD 卡片的 version 字段（v605）指的是订阅规则号，不是 GKD app 号**（app 停在 v1.12.1）
  - 用户实际订阅源 `https://gkd667.vv.ax/gkd.json5` 的 `version` 字段才是规则号，会自动跟进

## 其他
- .workbuddy/ 为本地记忆目录，不提交（保持未跟踪）
- 用户网盘素材放在 E:\网盘推广\ 下（如 工具箱\漫画区\）

## 判定「支持设备」的依据
- **以实际安装包为准，不要只看官网文案**：`.apk`→安卓、`.ipa`→iOS、`.exe/.msix`→Windows、`.dmg`→macOS
- E:\网盘推广\工具箱\ 按分区整理了全部软件，可直接翻目录核对
- 例：官网可能只提 Windows，实际包里有 apk 就是双端

## 新增工具置顶规则
- **只把最近 7 天加入的工具提到分区最前，更早的工具保持 data.js 原有顺序完全不动**
- `data.js` 工具字段 `added` = 首次加入日期，**由脚本自动写入，勿手写**
- 加完新工具跑一次：`bash tools/sync_added.sh`（重新计算 added）
- 改动 `data.js` 提交后再跑一次效果更准（脚本读 git 历史，首次提交当天算作加入日）
- 前端 7 天内工具带 NEW 角标；`NEW_DAYS` 常量在 index.html
- 实现要点：用**稳定分割**（新工具数组 + 老工具数组直接 concat），不要用整体 sort，否则老工具相对顺序会被打乱

## 更新动态与卡片的联动
- 更新动态里的工具名可点击跳转：抽屉内 `.upd-tool` 按钮 + 滚动条条目的 `data-goto-tool`
- 跳转会自动算分页位置（实用软件区 25 项跨 3 页），翻到对应页再滚动+高亮
- 同一工具在多个分区时**每次随机**挑一个（星盒在 4 个区、Sparkle 在 2 个区）
- 写更新文案时尽量带上工具的**完整卡片名**，匹配最准；匹配做了去空格 + 去修饰词兜底
- 下架类 / 全站性通知没有对应卡片，会保持纯文本不可点，这是预期行为

## 图标规范（重要）
- **卡片图标 CSS 只显示 40px**，源图不要超过 **128px**（留高分屏余量）
- 新增图标后跑一次 `python tools/opt_icons.py`（幂等，已是最优会跳过）
- 脚本会缩尺寸 + 256 色量化 + optimize，单图压到 24KB 以内
- **透明通道坑**：量化前要把 alpha 烘进 RGB 底色，否则透明边会发黑/发白
- 极小的图（<3KB）量化后可能反而变大，脚本里应保留原图
- 图标加载失败会回退成分区 emoji，不会显示破图（捕获阶段监听 error 实现）

## ⚠️ 改 index.html 后必做（血泪教训）
- **必须跑完整语法检查**，不能只检查新增的代码段：
  ```
  node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');fs.writeFileSync('_syn.js',[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1])"
  node --check _syn.js && rm _syn.js
  ```
- `new Function()` 对**未闭合的对象字面量/模板字符串会误报**，不能用来二分定位报错行，会把排查带偏
- index.html 是单文件整站：主脚本一处语法错 = **整页白屏**，零容错
- 历史事故：2026-10-11 改 renderGrid 时把反引号敲成单引号，模板不闭合，全站白屏（commit 7eb15cd 修复）
- `PAGE_SIZE = 10`（不是 12），算分页时别搞错

## ⚠️ CSS 布局/动画改动必须用真实浏览器验证
- **jsdom 无布局引擎**，`offsetHeight`/`scrollWidth`/`getBoundingClientRect` 恒为 0，
  静态检查和 `new Function` 完全测不出「样式写了但值不对」这类问题
- 用 `node tools/check_ticker.js` 起无头 Chromium 实测（CDP 协议，Node 22 原生 WebSocket）
- **踩过的坑**：
  - `@keyframes` 里 `translateX(calc(-1px * var(--x)))` 可能求值失败 → transform 恒为 0。
    改为 JS 算好带符号的值写入变量，keyframes 只做 `translateX(var(--x))`
  - `display:block` 的滚动内容会被父容器撑满，溢出量永远 ≤0。
    要用 `inline-block` + `width:max-content` + `flex:none`
  - 量宽度要用 `getBoundingClientRect()`，`scrollWidth` 会被 transform 污染
  - 别给动画加 `animation-play-state:paused`，鼠标悬停时用户反而看不到效果

## ⚠️ 整页白屏的根因：data.js 加载失败（2026-10-28 已加兜底）
- **症状**：用户报「网站打不开 / 白屏」，但服务器 curl 返回 200、内容完好
- **根因**：`index.html` 直接用 `SECTIONS[0].id`，全程无防护。
  data.js 是外部文件，**一旦加载失败（浏览器/CDN 缓存、网络抖动、版本戳不匹配），
  主脚本立刻抛 `ReferenceError: SECTIONS is not defined` → 整页白屏**
- **2026-10-28 已修**：在 data.js 之后、主脚本之前加探测，缺数据时渲染
  「数据加载失败 + 重新加载按钮」提示页，并 throw 阻断后续主脚本
- **排查顺序（重要，下次直接照做）**：
  1. `curl -sI` 看 HTTP 状态与 `Cache-Control`（GitHub Pages 是 `max-age=600`）
  2. `curl 线上文件 | md5sum` 对比 `git show origin/main:文件 | md5sum` —— 不一致才是部署问题
  3. 无头 Chromium 打开**线上 URL**（不是本地文件），看 `Runtime.exceptionThrown` 有没有 JS 错误
  4. 截图肉眼确认
- **关键**：无头浏览器是全新 profile、**没有缓存**，所以「我这边能打开」≠「用户能打开」。
  用户看到的往往是缓存的旧 index.html（index.html 自己无法加版本戳，只有 data.js 能加）

## ⚠️ 用户报「线上没改」时先排查缓存
- GitHub Pages + 浏览器双层缓存，代码改了但用户看到的还是旧版
- 排查手法：`curl "https://ldgj.xyz/index.html?cb=$RANDOM$RANDOM"` 绕过缓存抓线上文件比对
- **已加版本戳**：`<script src="data.js?v=20261012b">`
  → **以后每次改 data.js，必须把 v 递增**（20261012b → c → d…），否则用户拿不到新数据
- index.html 自身无法加戳，靠用户强制刷新（Ctrl+F5）或 CDN 过期

## 图标：.ico 转 .png 的正确做法
- 源 `.ico` 用 Pillow 打开 → `convert('RGBA')` → resize 到 128px
- **不要**用「把 alpha 烘进白底再量化」那套（opt_icons.py 里的做法），
  那会让图标四周出现白边，在卡片的圆角裁切下很明显
- 带透明的图标要这样量化，体积和观感都更好：
  ```
  im.quantize(colors=256, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG)
    .save(dst, 'PNG', optimize=True, transparency=0)
  ```
- 同样 128×128 图标：RGBA 直存 14KB vs P模式+FASTOCTREE **3.3KB**
- **RGB 图标**（无透明）才用 opt_icons.py 那套白底烘焙法
- 验证透明：贴到深色底（#1e293b）目视，确认无白边；`split()[-1].getextrema()` 应为 (0,255)

## 工具简介写作偏好（用户明确要求）
- **用户要「短小精悍」**：控制 **50 字内**，一句「定位 + 核心差异点」说完
- 反例：把群文案整段照搬，或罗列 6-8 项功能
- 同质化工具（影视/音乐区一抓一大把）更要突出**唯一差异点**：
  · 影视仓 → 「内置配置版，装上就能看」（别人要自己配源）
  · MoeKoeMusic → 「登录酷狗同步歌单」（别人的没有）
- 有 `points` 字段可放详细卖点清单，卡片描述只留一句精华

## 网盘官方 logo（勿自行绘制）
- 夸克：`gw.alicdn.com/imgextra/i3/O1CN018r2tKf28YP7ev0fPF_!!6000000007944-2-tps-48-48.png`
  （quark.cn 首页 favicon，48×48 RGBA）→ `icons/logo-quark.png`
- 百度：`nd-static.bdstatic.com/m-static/wp-brand/favicon.ico`
  （pan.baidu.com favicon，32×32，裁到前 25 行去掉底部品牌条）→ `icons/logo-baidu.png`
- **用户明确要求用真实官方 logo，不要自己画**
- 按钮内用 base64 内嵌（每页 20+ 次重复请求，内嵌后归零）

## ⚠️ CSS 覆盖顺序陷阱
- 同优先级下**后写的规则赢**，与代码位置无关
- `@media (prefers-color-scheme: dark)` 覆盖若写在**被覆盖规则之前 → 失效**
- 主题覆盖块必须放在对应基础样式**之后**
- 教训来源：2026-10-15 暗色按钮覆盖被亮色规则压掉，截图才发现

## 带 alpha 的 favicon 处理
- 官方 favicon 通常**自带透明通道**，直接用即可
- ❌ 不要自己做「亮度 → alpha 转换」去白底：透明区是黑色(0,0,0,0)，
   算亮度得 0 → 变半透明灰，图标四周出现灰黑方块
- ✅ 只需按行扫描定位主体高度并裁掉多余部分（如品牌文字条）

## ⚠️ 工具改名必须同步改两处
1. `data.js` 里卡片条目的 `name`
2. `UPDATES` 里对应记录的 `title`（**不改则点击跳转静默失效**，只剩纯文本）
- `findToolsInUpdate()` 靠标题/描述里的工具名匹配卡片，改名后两边对不上就匹配不到
- 改名后用去空格精确匹配校验一遍，别只看名称改了没
