# 来点工具（toolbox）项目长期备忘

## 站点与仓库
- 站点：ldgj.xyz（GitHub Pages，仓库 hxxszmp3/toolbox，main 分支）
- 数据只改 data.js：分区 id + tools 数组；工具条目支持 img（图标）/ emoji、quark/baidu 链接、points（详情点）
- data.js 工具字段：`version`（版本号）、`secret`（来源网址，配了才显示书签）、`secretText`（来源为文字如「QQ 群文件」，与 secret 二选一）、`os`（支持设备数组，未标注则卡片不显示该行）
- data.js 非 CommonJS 模块，语法验证用 `node --check data.js`
- 图标风格：128x128 RGBA 圆角透明 PNG，放 icons/（命名用拼音，如 baozoumanhua.png）
- APK 提图标方案已废弃，用户习惯直接给图标图片（去水印：定位主体居中裁方 + 22% 圆角蒙版，Pillow 处理）

## ⚠️ git push 必加参数（重要）
- 该仓库 push 必须用：`git -c credential.helper= -c http.version=HTTP/1.1 push origin main`
- 原因：默认凭据助手 credential-helper-selector 会触发 `git config --system -e` 开交互式编辑器导致永久挂起
- 代理：~/.gitconfig http.proxy=127.0.0.1:7897（存活）；shell 环境变量 127.0.0.1:17824（已死）
- remote URL 内嵌了用户 PAT（勿改动、勿外泄）；push 遇 remote rejected Internal Server Error 多为 GitHub 端抖动，重试即可

## 工作流约定
- 用户说「加到工具箱 / 放到 XX 区」= 本地改 data.js + 提交 + 推送上线（已授权）
- 每日版本检测自动化：`node scripts/sync-check.js`，结果只通知不动手；用户确认后才更新网盘/data.js
- 网盘更新：夸克可用 skill 操作；百度一律提示「需手动上传」
- 用户提供新工具信息格式：名称 + 介绍 + 夸克/百度链接 +（可选）图标图

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
