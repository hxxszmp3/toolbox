/* =====================================================================
   来点工具 · 数据区（只改这个文件即可新增/修改工具）
   分区名统一四字；color=主色 soft=浅色
   img=真实图标  emoji=按功能自动配的图标  quark=夸克 baidu=百度(可省) cmd=指令
   ===================================================================== */
const SECTIONS = [
  {
    id:'novel', icon:'📖', name:'小说专区', desc:'免费看小说、下小说', color:'#3b82f6', soft:'#eff6ff',
    tools:[
      { name:'小说下载器', desc:'全网小说搜索下载，一键导出 TXT/EPUB', img:'icons/xiaoshuo.png', quark:'https://pan.quark.cn/s/6c73fb388aea', baidu:'https://pan.baidu.com/s/1SHWmlXxW3FYTBf_2f_yruQ?pwd=i32n' },
      { name:'番茄小说下载器', desc:'番茄小说资源下载', img:'icons/fanqie.png', quark:'https://pan.quark.cn/s/867ce5b0aad5', baidu:'https://pan.baidu.com/s/1Rg_Ffo3vqfSU4EdQVlJPhA?pwd=f46i' },
      { name:'七猫小说下载器', desc:'七猫免费小说下载', img:'icons/qimao.png', quark:'https://pan.quark.cn/s/a6feae8cc3d1', baidu:'https://pan.baidu.com/s/1IEjRs6QI0SSxz0_8MbAdXw?pwd=paqi' },
      { name:'笔趣阁 5.0', desc:'海量书源免费阅读', img:'icons/biquge.png', quark:'https://pan.quark.cn/s/efae8b3e1325', baidu:'https://pan.baidu.com/s/1ecJhyMWNgQfw6v5uCt2ySg?pwd=azf3' },
      { name:'开源软件 + 开源书源', desc:'开源阅读 + 书源合集', img:'icons/kaiyuan.png', quark:'https://pan.quark.cn/s/938c4b40974e', baidu:'https://pan.baidu.com/s/169DT7lXgr0DLeB8pkTWUyQ?pwd=e0m5' },
      { name:'星盒', desc:'多功能聚合神器（小说/音乐/影视/动漫）', img:'icons/xinghe.png', quark:'https://pan.quark.cn/s/7fc3a192ddc2', baidu:'https://pan.baidu.com/s/18Des_vBGkeHMCgBgans8Tw?pwd=j5q4' },
      { name:'摸鱼神器', desc:'电脑端看小说，隐蔽摸鱼', img:'icons/moyu.png', quark:'https://pan.quark.cn/s/33a420bf77d2', baidu:'https://pan.baidu.com/s/1iSVaAHf-_udfr1SGlIp82g?pwd=rscq' },
      { name:'知乎盐选文章提取', desc:'提取知乎盐选文章（需自备会员）', img:'icons/zhihu.png', quark:'https://pan.quark.cn/s/22496116e151' },
      { name:'600G小说合集', desc:'600多G小说合集，起点番茄热门小说，多为精校版，配本地阅读器即可看', emoji:'📚', quark:'https://pan.quark.cn/s/b819a88df377' },
    ]
  },
  {
    id:'music', icon:'🎵', name:'音乐专区', desc:'免费听歌、下歌', color:'#8b5cf6', soft:'#f5f3ff',
    tools:[
      { name:'敦伦调调', desc:'全网音乐免费听 / 下载', img:'icons/dunlun.png', quark:'https://pan.quark.cn/s/21d0a48a9ee9', baidu:'https://pan.baidu.com/s/1ObfiNgOTdDpkxcEVFZZ4kA?pwd=3dcd' },
      { name:'星盒', desc:'聚合音乐资源神器', img:'icons/xinghe.png', quark:'https://pan.quark.cn/s/7fc3a192ddc2', baidu:'https://pan.baidu.com/s/1cs_YNcijpn15Gx6CK-lNqA?pwd=3w3y' },
      { name:'zpod', desc:'播客 / 音乐播放器', img:'icons/zpod.png', quark:'https://pan.quark.cn/s/8e670e877201', baidu:'https://pan.baidu.com/s/1k8lnZ3KKz7eVV-yTLovZlQ?pwd=4if2' },
      { name:'星音乐', desc:'聚合qq音乐，网易云音乐，酷我音乐，酷狗音乐四大平台搜索源', img:'icons/xingyinyue.png', quark:'https://pan.quark.cn/s/42f30fcaeea5', baidu:'https://pan.baidu.com/s/1KcaQEt15ZQTOoXMiTHucxg?pwd=ck1c' },
      { name:'莫比音乐', desc:'高品质音乐平台（收费）', tag:'收费', img:'icons/mobi.png', quark:'https://pan.quark.cn/s/f70a57a9420a', baidu:'https://pan.baidu.com/s/1___-VnWKyPtabXOOupRi2Q?pwd=rsc8' },
      { name:'四分贝音乐', desc:'windows系统下载mp3、flac等格式，自动下载封面和歌词lrc文件', img:'icons/sifenbei.png', quark:'https://pan.quark.cn/s/6a5f6874a275', baidu:'https://pan.baidu.com/s/1J_8b-pnAKg9qLcuP5ULrxw?pwd=4a38' },
      { name:'米兔音乐', desc:'免费音乐', img:'icons/mitu.png', quark:'https://pan.quark.cn/s/724b9a1e77cf', baidu:'https://pan.baidu.com/s/1_hEL82wFT2481t8gvmzAog?pwd=jjam' },
      { name:'无损音乐', desc:'FLAC 无损音乐在线试听 / 下载', emoji:'🎧', web:'https://flac.music.hi.cn/' },
    ]
  },
  {
    id:'video', icon:'🎬', name:'影视专区', desc:'聚合影视资源', color:'#ef4444', soft:'#fef2f2',
    tools:[
      { name:'星盒', desc:'聚合影视资源，看电影追剧', img:'icons/xinghe.png', quark:'https://pan.quark.cn/s/7fc3a192ddc2', baidu:'https://pan.baidu.com/s/18Des_vBGkeHMCgBgans8Tw?pwd=j5q4' },
      { name:'MiniReel', desc:'第三方红果短剧客户端，免费无广告，手机/电视/电脑全平台', img:'icons/minireel.png', quark:'https://pan.quark.cn/s/c326807e1024', baidu:'https://pan.baidu.com/s/1CEqs_PTYrxYEzSz_40DAbQ?pwd=fgf1' },
    ]
  },
  {
    id:'anime', icon:'🎨', name:'动漫专区', desc:'动漫资源', color:'#f97316', soft:'#fff7ed',
    tools:[
      { name:'动漫共和国', desc:'动漫追番 App，支持安卓 / 苹果 / Windows', img:'icons/dongman.png', quark:'https://pan.quark.cn/s/561a59d10235', baidu:'https://pan.baidu.com/s/1gM3uc3zolfNc4CDSgBcuTg?pwd=stjc' },
      { name:'星盒', desc:'聚合动漫资源', img:'icons/xinghe.png', quark:'https://pan.quark.cn/s/7fc3a192ddc2', baidu:'https://pan.baidu.com/s/10DAk0iXqSrakMpqFVVUdJw?pwd=6w0m' },
    ]
  },
  {
    id:'comic', icon:'📚', name:'漫画专区', desc:'漫画资源', color:'#f59e0b', soft:'#fffbeb',
    tools:[
      { name:'AI漫剧最全教程', desc:'大佬付费购买的漫剧全套资料：教程+工作流+提示词+漫剧专用 Skill，比机构课程还全', emoji:'🎬', quark:'https://pan.quark.cn/s/e6e64016a0b0' },
      { name:'Mihon', desc:'免费开源安卓漫画阅读器（Tachiyomi 继任者）', img:'icons/mihon.png', quark:'https://pan.quark.cn/s/14966eac05db', baidu:'https://pan.baidu.com/s/11FGWmCzzpJ7gVCjh26lvIg?pwd=9gmn', points:[
        '<b>GitHub 地址</b>：<a href="https://github.com/mihonapp" target="_blank" rel="noopener">github.com/mihonapp</a>',
      ]},
      { name:'venera_1.4.6', desc:'漫画阅读器', emoji:'📖', quark:'https://pan.quark.cn/s/ca0afa3bf4b0', baidu:'https://pan.baidu.com/s/1J_O7CFwJEgtow6ibGD_9qA?pwd=ai9w' },
      { name:'抱走漫画', desc:'大佬开发，免费无广，自带多个漫画源，无需手动安装漫画插件，安装即可阅读，还可下载至本地导入漫画阅读器离线阅读（仅安卓）', img:'icons/baozoumanhua.png', quark:'https://pan.quark.cn/s/b3c9435bd0a4', baidu:'https://pan.baidu.com/s/1rLGyBCQYtHYV_NV9g1xZNw?pwd=1o1m' },
    ]
  },
  {
    id:'game', icon:'🎮', name:'游戏专区', desc:'童年经典游戏合集', color:'#22c55e', soft:'#f0fdf4',
    tools:[
      { name:'手机破解游戏合集', desc:'2812 款手机破解游戏（495GB），动作/策略/经营/模拟/生存/塔防等全类型', emoji:'📱', quark:'https://pan.quark.cn/s/c830ec006605' },
      { name:'980款Steam移植手游合集', desc:'980 款 Steam 移植手机游戏版大合集', emoji:'🎮', quark:'https://pan.quark.cn/s/7749692bbebf' },
      { name:'115款童年经典街机游戏', desc:'童年街机游戏大合集，一键怀旧', emoji:'🕹️', quark:'https://pan.quark.cn/s/5f081f6ffff0' },
    ]
  },
  {
    id:'data', icon:'📂', name:'资料专区', desc:'干货资料合集', color:'#14b8a6', soft:'#f0fdfa',
    tools:[
      { name:'高性价比人生指南', desc:'循证生活指南：怎么活得久、少生病、少花冤枉钱、避坑，614 条建议，每条写明成本收益和证据出处', emoji:'🧭', quark:'https://pan.quark.cn/s/8a03cc957f40', baidu:'https://pan.baidu.com/s/1n4XxIXfgKk_uIS9XyOQaXw?pwd=sm8j', points:[
        '<b>GitHub 地址</b>：<a href="https://github.com/eternity4719/HowToLiveBetter" target="_blank" rel="noopener">github.com/eternity4719/HowToLiveBetter</a>',
      ]},
      { name:'Z-Library 电子书', desc:'免费电子书下载，海量图书资源', emoji:'📚', web:'https://zh.z-library.sk/' },
      { name:'自媒体运营宝典', desc:'自媒体运营干货教程合集', emoji:'📘', quark:'https://pan.quark.cn/s/843970d3a819', baidu:'https://pan.baidu.com/s/1i-dcqE_dTVIu4I48PxdLBg?pwd=s8q5' },
      { name:'古龙小说全集', desc:'古龙武侠小说在线阅读，70多部经典作品', emoji:'📖', web:'https://www.gulongwang.com/' },
      { name:'自媒体人必备', desc:'自媒体运营干货资料包', emoji:'✍️', quark:'https://pan.quark.cn/s/12d673d50af9' },
      { name:'中国各省旅游攻略', desc:'全国各省旅游攻略合集', emoji:'🗺️', quark:'https://pan.quark.cn/s/a7bd03521366' },
    ]
  },
  {
    id:'wallpaper', icon:'🖼️', name:'壁纸专区', desc:'高清壁纸合集', color:'#ec4899', soft:'#fdf2f8',
    tools:[
      { name:'超级齐全的壁纸合集', desc:'海量高清壁纸打包下载', emoji:'🌆', quark:'https://pan.quark.cn/s/3ebe11700a02' },
    ]
  },
  {
    id:'software', icon:'🛠️', name:'实用软件', desc:'效率工具、黑科技软件', color:'#6366f1', soft:'#eef2ff',
    tools:[
      { name:'Piik', desc:'免费开源屏幕共享工具，P2P 优先，支持浏览器查看、桌面应用', img:'icons/piik.png', quark:'https://pan.quark.cn/s/ba0b83672f29', baidu:'https://pan.baidu.com/s/1yqT4XvIXji-UmR2_jWHRKg?pwd=s53t', points:[
        '<b>GitHub 地址</b>：<a href="https://github.com/TNTcraftHIM/Piik/releases" target="_blank" rel="noopener">github.com/TNTcraftHIM/Piik/releases</a>',
      ]},
      { name:'VideoToNotes', desc:'视频转文章，导入视频字幕即可导出公众号排版文章', img:'icons/videotonotes.png', quark:'https://pan.quark.cn/s/d38a3d2bd7f0', baidu:'https://pan.baidu.com/s/1BiTkU9YGXdQt0XHzax33Fg?pwd=5h5t' },
      { name:'谷歌浏览器', desc:'多系统安装包：安卓手机/平板、电视TV、鸿蒙、mac、Windows', img:'icons/chrome.png', quark:'https://pan.quark.cn/s/fa06f51cda42' },
      { name:'Bandizip', desc:'免费 Windows 解压/压缩软件，速度快，支持绝大多数格式', img:'icons/bangzip.png', quark:'https://pan.quark.cn/s/f192f2851391', baidu:'https://pan.baidu.com/s/1X5h5sOA4wHqURaId1XyTig?pwd=2vqs' },
      { name:'GKD', desc:'安卓开源去开屏广告，天天更新，3 个全局规则基本够用', img:'icons/gkd.png', quark:'https://pan.quark.cn/s/1c9e604664a7', baidu:'https://pan.baidu.com/s/10XQkKe7a_RxKdJ-Yg-4RHw?pwd=wb7c', points:[
        '<b>GKD 下载</b>：<a href="https://github.com/gkd-kit/gkd" target="_blank" rel="noopener">github.com/gkd-kit/gkd</a>',
        '<b>去广告规则</b>：<a href="https://github.com/Lin-arm/GKD_subscription" target="_blank" rel="noopener">github.com/Lin-arm/GKD_subscription</a>',
      ]},
      { name:'WinTab', desc:'WinTab 窗口标签页工具，多窗口 1 键收成标签页', img:'icons/wintab.png', quark:'https://pan.quark.cn/s/f67eb0e6fc34', baidu:'https://pan.baidu.com/s/187Z2jh57IWYFkA86QsacXQ?pwd=3s6d' },
      { name:'UU远程', desc:'网易UU远程，跨平台远程控制（手机 / 电脑 / 电视）', img:'icons/uuyc.png', quark:'https://pan.quark.cn/s/43bcafcc4700', baidu:'https://pan.baidu.com/s/1mkCfPAE1KeYZP_4omt4_dw?pwd=76bm' },
      { name:'铁汁', desc:'TieZ 剪贴板助手，永久记录 + AI 翻译 + 局域网互传', img:'icons/tiez.png', quark:'https://pan.quark.cn/s/93a33db44a9a', baidu:'https://pan.baidu.com/s/1o4OG6Y9QmZjTi1g-mdCV7Q?pwd=kdww' },
      { name:'Win11开始菜单增强工具', desc:'StartAllBack · Win11 恢复 Win7/Win10 经典界面', img:'icons/startallback.png', quark:'https://pan.quark.cn/s/7c3ec837f3eb', baidu:'https://pan.baidu.com/s/1J5qCg9swBFnPKqdnLBkCnA?pwd=t7nc' },
      { name:'Windows电脑护眼工具', desc:'CareUEyes · 过滤蓝光、定时休息，护眼防疲劳', img:'icons/careueyes.png', quark:'https://pan.quark.cn/s/b099a45177b0', baidu:'https://pan.baidu.com/s/1j9hGgLO8PPaHSNR2g7yDqA?pwd=f739' },
      { name:'李跳跳', desc:'跳过 App 开屏广告', img:'icons/litiaotiao.png', quark:'https://pan.quark.cn/s/b12c4e900948', baidu:'https://pan.baidu.com/s/1_3tevGSdkFjLL3UXcYwRkA?pwd=jr1q' },
      { name:'电脑录屏软件', desc:'屏幕录制', emoji:'🎥', quark:'https://pan.quark.cn/s/d4a4b3d25c3f', baidu:'https://pan.baidu.com/s/1xlJOaxI7NSdo82h87BrR9w?pwd=6yg4' },
      { name:'电脑截图软件', desc:'PixPin 截图工具', emoji:'📸', quark:'https://pan.quark.cn/s/755242ca07b3', baidu:'https://pan.baidu.com/s/11rrM9pdPKr7baQi1wInaMg?pwd=arhn' },
      { name:'极限投屏', desc:'手机电脑无线互投', img:'icons/jixian.png', quark:'https://pan.quark.cn/s/c63e905b0bb4', baidu:'https://pan.baidu.com/s/1GfuV0rHaoTaK77CZz8os3A?pwd=anb2' },
      { name:'带壳截图', desc:'给截图加手机壳效果', emoji:'📱', quark:'https://pan.quark.cn/s/74e3ddac7600', baidu:'https://pan.baidu.com/s/17Fx9y01I-d7T-ZVZNTR6jw?pwd=uumt' },
      { name:'非剪', desc:'视频剪辑', emoji:'✂️', quark:'https://pan.quark.cn/s/54d85a05c3d0', baidu:'https://pan.baidu.com/s/1MsyTlVlobPxdq2K_XGe0Wg?pwd=ppar' },
      { name:'豆包去水印', desc:'图片 + 视频去水印', emoji:'🧽', quark:'https://pan.quark.cn/s/f6af0a41f370', baidu:'https://pan.baidu.com/s/1qNyFeZoUDKtg3-DiGX7wGg?pwd=3heb' },
      { name:'卸载软件', desc:'Geek 强力卸载，清理残留', emoji:'🗑️', quark:'https://pan.quark.cn/s/d5fd8dcd78fc', baidu:'https://pan.baidu.com/s/1ysTcO4Y-cxprVhawrXDC8w?pwd=ccsc' },
      { name:'批量下载抖音视频插件', desc:'DataTool 抖音视频批量下载', emoji:'📥', quark:'https://pan.quark.cn/s/1c0c61aca758', baidu:'https://pan.baidu.com/s/1G5_CW63FDj9ZHHWdXmz6pA?pwd=wu75' },
      { name:'公众号文章下载器', desc:'下载公众号文章', emoji:'📄', quark:'https://pan.quark.cn/s/2101a43cc4d1', baidu:'https://pan.baidu.com/s/1t-ogHr3RgaiE-x3w_06t1A?pwd=u5nx' },
      { name:'qq音乐转MP3格式', desc:'音乐格式转换', emoji:'🎶', quark:'https://pan.quark.cn/s/809f293713a7', baidu:'https://pan.baidu.com/s/1XMShkHb3ak2i5a1VLODzjw?pwd=dwns' },
      { name:'刷圈兔', desc:'朋友圈工具', emoji:'🐰', quark:'https://pan.quark.cn/s/9c65f279682a', baidu:'https://pan.baidu.com/s/1xR-hreaSPe3xM4eu1b7thg?pwd=ezy3' },
      { name:'WPS会员版本', desc:'WPS Office 会员版', emoji:'📝', quark:'https://pan.quark.cn/s/c82f17805ea3', baidu:'https://pan.baidu.com/s/1_OjqOiqSttR2_MAZbXRDQw?pwd=6isy' },
      { name:'飞鼠格式转换助手', desc:'音视频 / 文档格式转换', img:'icons/flyingmouse.png', quark:'https://pan.quark.cn/s/54d36d2d91dd', baidu:'https://pan.baidu.com/s/1g-EPPoxSKZJQIuzRqfdXvA?pwd=61xj' },
      { name:'AI视频无痕去字幕', desc:'AI 去除视频字幕', emoji:'🎞️', quark:'https://pan.quark.cn/s/4059abee799d', baidu:'https://pan.baidu.com/s/1GdsTfpiBIgbrwP0y35Zk2A?pwd=7p7v' },
      { name:'QQ空间恢复软件', desc:'QQ 空间数据恢复', emoji:'💾', quark:'https://pan.quark.cn/s/fbc7d2f4e05c', baidu:'https://pan.baidu.com/s/1IZRzK4VsDpzJKcuAK4YeQQ?pwd=44ka' },
      { name:'Win自动更新关闭工具', desc:'关闭 Windows 自动更新', emoji:'🛑', quark:'https://pan.quark.cn/s/a66636a1bc90', baidu:'https://pan.baidu.com/s/18PwazXQO1lrhh_GtQaX4ow?pwd=q4sy' },
    ]
  },
  {
    id:'ai', icon:'🤖', name:'AI专区', desc:'AI 提效 skill', color:'#0ea5e9', soft:'#f0f9ff',
    tools:[
      { name:'jev-chat（AI参谋）', desc:'聊天辅助工具，读懂对方、给回复建议', emoji:'💬', points:[
        '<b>是什么 & 能干嘛</b>：装在手机/电脑上的对话副驾，在微信/QQ/飞书里告诉你对方想干什么、有没有坑、给几条回复建议，最终发不发由你决定（安卓支持微信/QQ/飞书等，mac 仅支持微信）',
        '<b>怎么用</b>：从 GitHub 下载对应版本（安卓 APK / Windows / macOS），并在 <a href="https://openrouter.ai" target="_blank" rel="noopener">openrouter.ai</a> 注册免费获取 jev 模型密钥填入',
        '<b>GitHub 原地址</b>：<a href="https://github.com/jev-chat/jev-chat-jarvis" target="_blank" rel="noopener">github.com/jev-chat/jev-chat-jarvis</a>',
      ]},
      { name:'HowToLiveBetter', desc:'高性价比人生指南，循证生活 skill', emoji:'🧭', cmd:'npx skills add eternity4719/HowToLiveBetter', points:[
        '<b>是什么 & 能干嘛</b>：按性价比排序的循证生活指南——长寿防病、急救、省钱理财、法律红线、失业工伤、医保社保、恋爱婚育、怀孕育儿、创业合规、出国技能等 612 条建议，每条写明成本、收益、证据等级和出处（只引期刊论文与官方文件）',
        '<b>GitHub 原地址</b>：<a href="https://github.com/eternity4719/HowToLiveBetter" target="_blank" rel="noopener">github.com/eternity4719/HowToLiveBetter</a>',
      ]},
      { name:'book-to-skill', desc:'把任何书籍/文档转成 AI Skill，AI 直接基于原文回答', emoji:'📚', cmd:'npx skills add virgiliojr94/book-to-skill', points:[
        '<b>是什么 & 能干嘛</b>：把书籍/文档（PDF、EPUB、Word、HTML、Markdown、TXT 等）转成 AI Skill，让 AI 基于原文回答——比如民法典、劳动法十几万字做成 Skill，不编造答案',
        '<b>GitHub 原地址</b>：<a href="https://github.com/virgiliojr94/book-to-skill" target="_blank" rel="noopener">github.com/virgiliojr94/book-to-skill</a>',
      ]},
      { name:'夸克网盘 skill', desc:'夸克网盘 AI 助手 skill（实测不如手动来得快，静待优化）', emoji:'☁️' },
      { name:'淬火学习 skill', desc:'号称能让学习速度提升 10 倍的 skill', emoji:'🔥', cmd:'npx -y skills add Biancuihuo/cuihuo-skills -g --all', points:[
        '<b>是什么 & 能干嘛</b>：号称学习速度提升 10 倍的 skill，不是让你学得更快，而是只学该学的、学完真会了',
        '<b>GitHub 原地址</b>：<a href="https://github.com/Biancuihuo/cuihuo-skills" target="_blank" rel="noopener">github.com/Biancuihuo/cuihuo-skills</a>',
      ]},
    ]
  },
];
