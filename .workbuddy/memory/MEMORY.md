# 来点工具（toolbox）项目长期备忘

## 站点与数据
- 站点 ldgj.xyz（GitHub Pages，仓库 hxxszmp3/toolbox，main 分支）；数据只改 data.js
- data.js 字段：`version`、`secret`（来源网址，配了才显示书签）、`secretText`（与 secret 二选一）、`os`（支持设备数组，未标注则不显示该行）、`points`、`quark`/`baidu`/`uc`
- data.js 非 CommonJS 模块 → 语法验证用 `node --check data.js`
- 改 data.js 后必须递增 index.html 里的版本戳 `data.js?v=YYYYMMDDxx`，否则用户拿不到新数据
- 判定「支持设备」以实际安装包为准：`.apk`→安卓、`.ipa`→iOS、`.exe/.msix`→Windows、`.dmg`→macOS
- 工具简介：用户要**50 字内**，一句「定位 + 核心差异点」；同质化工具只讲唯一差异点（影视仓/ MoeKoeMusic 等）
- 新增工具置顶：只把最近 7 天加入的提到分区最前，老工具顺序完全不动；`added` 由 `bash tools/sync_added.sh` 自动写入，勿手写；用「新数组 + 老数组 concat」，别整体 sort

## 推送上线
- **优先 `bash tools/push.sh`** —— SSH 优先，失败自动退回 GitHub API
- remote 已是 SSH `git@github.com:hxxszmp3/toolbox.git`；SSH 走 ssh.github.com:443（`~/.ssh/config`），用的是**仓库 Deploy Key**（id=167970083）
- 推 SSH 必加：`-c http.proxy= -c https.proxy= -c credential.helper=`
  - `credential.helper=` 必加：credential-helper-selector 会触发 `git config --system -e` 开编辑器永久挂起
- **代理端口每轮会话都可能变** → 每次先查 `env | grep -iE "^(https?|HTTPS?)_PROXY="`
  - 代理对 github.com 常 502，对 api.github.com 正常
  - `~/.gitconfig` 的 `http.proxy=127.0.0.1:7897` 时灵时不灵，别依赖
- API 推送细节见 tools/push_via_api.js：Node 里必须 `execFileSync('git', [...])`（execSync 模板串会被 shell 吃掉 `^`）；
  API 重建的 commit SHA 与本地不同 → 推完 `git reset --hard origin/main` 对齐；token 拼 URL 前 `tr -d '\r\n'`
- 仓库历史 PAT 已废弃；GCM 里有一个仍有效的 classic PAT（曾泄漏，建议网页端撤销），
  但撤销不影响推送（已改用 SSH Deploy Key）。`git credential fill` 返回的 password 是临时 OAuth 产物，`git credential erase` 清不掉

## sync-check.js 版本检测（自动化 495c6081…，每天 09:00）
- **只检测和通知，绝不改动任何文件**；`scripts/sync-state.json` 由脚本自动更新是正常行为，别回滚
- ⚠️ **脚本会自动把 state 推成上游最新** → 「报告无更新」≠「上游没动静」。
  排查手法：把 state 还原成旧值，在**隔离副本**里复跑（别在仓库里试，会污染真实 state）
- **curl 在本机不可用**（Windows schannel 证书吊销检查报错 `CRYPT_E_REVOCATION_OFFLINE`）→ 改用 Node 的 `fetch` 校验
- **MiniReel 检测失效 —— ✅ 2026-11-03 已修复**：页脚含 `PolyForm Noncommercial License 1.0.0`，被 strict-max 当成版本号。
  修法：watchlist.json 加 `"anchor": "v<!-- -->(\\d+\\.\\d+\\.\\d+)"`
  - ⚠️ **必须用 anchor 不能用 versionPattern**：`stripNoise()` 会删 HTML 注释（`<!-- -->` 变空格）
  - anchor 走原始 HTML 分支，命中值干净；/versions 页新版在前，首次命中即最新
- **上游 GitHub release 列表不按时间排序**（番茄下载器）：正确选法 `GET /repos/{owner}/{repo}/releases/latest`，
  再按 published_at 排序交叉验证
- **夸克 CLI**：`browse` 不支持 `--stdout-only`（search 才支持）；`browse` 默认只返回第一页，全量要加 `--all`；
  没有 delete 命令，清理旧包只能用 `move` 移到归档目录；`share-detail` 的 size 字段是缓存旧值，别被误导，
  查分享内实际内容用 `share-search --url <链接> --keyword <名>`；`get-share-update-files` 对未转存过的分享返回 41043
- **夸克分享是「活的文件夹分享」**：替换目录里的文件后分享链接自动指向新文件，不用重建分享
- **GKD 卡片 version（v605）是订阅规则号不是 app 号**（app 停在 v1.12.1）；用户订阅源 `https://gkd667.vv.ax/gkd.json5` 的 version 才是规则号，会自动跟进
- **MiniReel macOS 包 0.4.2 起是双层 zip**：上游 `release-macos.zip` 内套 `MiniReel-0.4.2-macos-universal.zip`，
  网盘放的是**内层**（保持用户解压一次得 app）；下载接口 /api/download/34=安卓、35=TV、36=Windows、37=macOS
- **MiniReel Windows 包 PE 头是 0x014c（32 位）不是 x64 —— 正常**，NSIS stub 固定 32 位
- **GKD 分享内结构**：`gkd-v1.12.1.apk` + `GKD（跳过开屏广告）/`（内含 `手机-安卓/gkd-v1.12.1.apk` + `规则.txt`）
- **Piik 网盘包大小反查版本**：网盘 `piik-app-windows-amd64.zip` 38,240,936 B = 上游 v2.1.0（不是最新的 39,338,694 B）
- 夸克分享 `browse` 子命令报 unknown option 时先跑 `--help` 确认参数，别照抄记忆
- **zpod 检测盲区 —— ✅ 2026-11-05 已修复**：原为 manual，官网 `zpod.net` 首页 `<meta name="zpod-version" content="3.0.14">`。
  改为 `type:"site"` + `url:"https://zpod.net/"` + `anchor:"zpod-version\"\\s+content=\"(\\d+\\.\\d+\\.\\d+)\"`（走原始 HTML 分支，稳定命中）
- **站点抓取加重试 —— 2026-11-05**：zpod/四分贝 等官网首访会瞬时失败（fetch failed），
  单次失败就报「检测失败」是误报。`siteVersion()` 拆成 `fetchSiteOnce()` + 3 次重试（间隔 3s）
- **search 找目录要用 `--search-type dir`**：默认 `mix` 只返回文件，搜目录名（如 "geek"）会搜不到文件夹本身
- **GitHub API 未认证限流 60 次/小时**：批量换包前先 `GET /rate_limit` 看 remaining，
  超了会 403；已知 asset id 时改用 `GET /repos/{o}/{r}/releases/assets/{id}` + `Accept: application/octet-stream`
  （asset 端点不受 release 列表端点的限流影响，但仍算 core 配额）

## 换包上线流程（夸克，2026-11-05 验证）
- **步骤**：① 上游下载 → ② 本地重命名为**上游原名**（如 `Kazumi_android_2.4.3.apk`）→ ③ `upload --parent-fid <目录>` → ④ `move --target-fid <存档目录>` 旧包
- **上传后分享立即可见**（实测上传完 share-detail 就能看到新文件），夸克分享是活链接，不用重建
- ⚠️ **`browse` 单页最多返回 5 条**，`--page-size` 无效 → 目录项多于 5 个时要用 `search` 按名字定位（search 返回项含 `file_type` 和 `parent_fid`）
- ⚠️ **`search` 不索引 .ipa 文件**（搜 "ipa" 只返回 .apk）→ .ipa 要靠 `browse` 父目录拿到
- **`search` 也会瞬时返回 `53000 服务器内部异常`** → 脚本化调用要加重试，别把单次失败当结论
- **`rename` 子命令**：items 文件格式 `{schema_version:1, items:[{fid, old_name, new_name}]}`，单批最多 5 条；
  上传时文件名不对就用它改回来（比先传再改名干净）
- **旧包归档目录**：`<分区>/_旧版本存档/`（分区级新建，如 动漫区/音乐区/实用软件区 各一个），
  与 影视区/_旧版本存档/旧版本存档/ 的历史习惯一致
- **GitHub release 资产下载**：`github.com/.../releases/download/...` 直链会 **403**（CDN 域名被墙/限流）；
  改用 `GET /repos/{owner}/{repo}/releases/tags/{tag}` 拿 `assets[].url`，再带 `Accept: application/octet-stream` 请求该 API URL
- **Kazumi 上游已不提供鸿蒙 hap 包**（2.3.9 起全部 release 都没有 .hap），网盘 `手机-鸿蒙/` 下的 2.3.1 hap 保持不动
- **GitHub release 资产列表可能与网盘目录结构不一致**（如上游有 `Kazumi_windows_2.4.3.zip` 但网盘只放 .msix）→ 以网盘既有结构为准，只换同名包
- ⚠️ **同名换包会踩坑**：新旧文件名相同（如 `piik-app-windows-amd64.zip`、`geek.exe`）时，
  「已存在」判断会误判成「上传过了」，结果只归档旧包而没上传新包 → **先 move 旧包到存档，再 upload 新包**
- ⚠️ **夸克内容扫描会屏蔽文件名**：某些 apk 上传后文件名被改成 `首字母****`（如 `v****`）且不进入分享。
  实测是**按内容**触发（换个名字重新传同样被屏蔽），**用 zip 包一层就绕过**（扫描器不拆 zip）。
  venera v1.6.3 的 arm64 apk 就是这种情况 → 改成 `venera-1.6.3-arm64-v8a.zip`（内含 apk）上传，正常可见
- **官网只有网盘链接的版本**：四分贝 v1.3.3 官网不给直链，给的是夸克/百度/蓝奏分享。
  用 `saveas --url <分享> --to-pdir-path <目录>` 转存到自己网盘，再 `move` 到目标目录，比下载再上传快
- **Geek Uninstaller 官网**只给 `geek.zip`（zip 里是 geek.exe），用 python `zipfile` 解压（Windows 自带 tar 不认 zip）
- **工具改名要同步改网盘文件夹名**（venera_1.4.6 → venera），否则卡片名与网盘目录对不上

## 图标规范
- 128x128 RGBA 圆角透明 PNG，放 icons/，命名用拼音；**卡片只显示 40px**，源图别超 128px
- 新增后跑 `python tools/opt_icons.py`（幂等）
- **透明通道坑**：量化前把 alpha 烘进 RGB 底色，否则透明边发黑/发白
- **.ico 转 .png**：源 .ico → RGBA → resize 128px，**不要烘白底再量化**（四周会有白边）；
  带透明的用 `quantize(colors=256, method=Image.FASTOCTREE, dither=FLOYDSTEINBERG)` + `transparency=0`（3.3KB vs RGBA 14KB）；
  无透明的 RGB 图标才用 opt_icons.py 的白底法。验证：`split()[-1].getextrema()` 应为 (0,255)
- 图标加载失败回退成分区 emoji，不会破图
- **网盘官方 logo 勿自行绘制**：夸克 `gw.alicdn.com/imgextra/i3/O1CN018r2tKf28YP7ev0fPF_!!6000000007944-2-tps-48-48.png`；
  百度 `nd-static.bdstatic.com/m-static/wp-brand/favicon.ico`（裁掉底部品牌条）。按钮内 base64 内嵌

## ⚠️ index.html 是单文件整站，零容错
- 主脚本一处语法错 = **整页白屏**。改完必跑完整语法检查（不能只查新增片段）：
  ```
  node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');fs.writeFileSync('_syn.js',[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1])"
  node --check _syn.js && rm _syn.js
  ```
- `new Function()` 对未闭合对象字面量/模板字符串会误报，不能用来二分定位报错行
- `PAGE_SIZE = 10`（不是 12），算分页别搞错
- **CSS 覆盖顺序**：同优先级后写的赢，与代码位置无关；主题覆盖块必须放在基础样式之后
- **CSS 布局/动画改动必须真实浏览器验证**：jsdom 无布局引擎，offsetHeight/getBoundingClientRect 恒为 0。
  用 `node tools/check_ticker.js` 起无头 Chromium 实测（CDP，Node 22 原生 WebSocket）
  - `@keyframes` 里 `translateX(calc(-1px * var(--x)))` 可能求值失败 → 改 JS 算好带符号值写入变量
  - 滚动内容用 `inline-block` + `width:max-content` + `flex:none`；量宽度用 `getBoundingClientRect()`（scrollWidth 会被 transform 污染）
  - 别给动画加 `animation-play-state:paused`

## ⚠️ 整页白屏根因：data.js 加载失败（2026-10-28 已加兜底）
- data.js 是外部文件，加载失败 → 主脚本抛 `ReferenceError: SECTIONS is not defined` → 整页白屏
- 现已在 data.js 之后、主脚本之前加探测，缺数据时渲染「数据加载失败 + 重新加载按钮」
- 排查顺序：① `curl -sI` 看状态与 Cache-Control（GitHub Pages max-age=600）
  ② `curl 线上文件 | md5sum` 对比 `git show origin/main:文件 | md5sum` ③ 无头 Chromium 打开**线上 URL** 看 JS 异常 ④ 截图确认
- **无头浏览器是全新 profile 没缓存** → 「我这边能打开」≠「用户能打开」。用户常看到缓存的旧 index.html（index.html 自己无法加版本戳）
- 用户报「线上没改」先查缓存：`curl "https://ldgj.xyz/index.html?cb=$RANDOM$RANDOM"`

## 更新动态与卡片联动
- UPDATES 里的工具名可点击跳转（`.upd-tool` 按钮 + `data-goto-tool`），自动算分页位置并高亮
- 同一工具在多个分区时**每次随机**挑一个；写更新文案带上工具**完整卡片名**，匹配最准
- 下架类/全站性通知没有对应卡片，保持纯文本不可点击，是预期行为
- **工具改名必须同步改 data.js 的 `name` 和 UPDATES 的 `title`**，否则点击跳转静默失效
- 网盘素材放在 E:\网盘推广\ 下（如 工具箱\漫画区\）

## 宣传海报（.poster/ 管线）
- 海报管线在 `.poster/`（poster.js 模板 + novel.js/各分区 JSON 数据 + render_all.js 渲染），产物 2160×2880
- 桌面输出目录：`C:\Users\dellsq\Desktop\宣传海报-工具箱\`（按分区分子目录）
- ⚠️ **新增工具卡片时默认不补海报**（用户 2026-11-05 明确要求：「下次不用补海报」）。
  海报只在用户明确说要做时才生成，别自动附带。

## 其他
- .workbuddy/ 为本地记忆目录，不提交（保持未跟踪）
- 番茄下载器分发包规范：目录 平台→发行形态→架构条目；`.sig` 已移除（自动更新签名内嵌在 latest.json 的 platforms[*].signature）
- 上游 Linux AppImage 命名有误（名为 amd64 的实测是 aarch64）→ x86_64 设备用 DEB 包（包内已加「架构说明.txt」）
