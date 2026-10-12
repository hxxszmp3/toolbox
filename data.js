/* =====================================================================
   来点工具 · 数据区（只改这个文件即可新增/修改工具）
   分区名统一四字；color=主色 soft=浅色
   img=真实图标  emoji=按功能自动配的图标  quark=夸克 baidu=百度(可省) cmd=指令
   version=最新版本号(可省)  secret=下载来源网址(可省，配了才显示左上角书签)
   secretText=来源为文字而非网址时用(如「QQ 群文件」)，与 secret 二选一
   os=支持设备(可省，如 ['Windows','安卓']；不确定就留空不写)
   added=首次加入日期(由 tools/sync_added.sh 自动写入，勿手改)，
         前端按此倒序把最新软件排在分区最前
   ===================================================================== */
const SECTIONS = [
  {
    id:'novel', icon:'📖', name:'小说专区', desc:'免费看小说、下小说', added:'2026-10-04', color:'#3b82f6', soft:'#eff6ff',
    tools:[
      { name:'小说下载器', desc:'全网小说搜索下载，一键导出 TXT/EPUB', added:'2026-10-04', img:'icons/xiaoshuo.png', version:'v1.11.0', os:['Windows','macOS','Linux'], secret:'https://github.com/freeok/so-novel/releases', quark:'https://pan.quark.cn/s/6c73fb388aea', baidu:'https://pan.baidu.com/s/1SHWmlXxW3FYTBf_2f_yruQ?pwd=i32n' },
      { name:'番茄小说下载器', desc:'番茄小说资源下载', added:'2026-10-04', img:'icons/fanqie.png', version:'v2.4.15', os:['Windows','macOS','Linux','安卓'], secret:'https://github.com/zhongbai2333/Tomato-Novel-Downloader', quark:'https://pan.quark.cn/s/867ce5b0aad5', baidu:'https://pan.baidu.com/s/1Rg_Ffo3vqfSU4EdQVlJPhA?pwd=f46i' },
      { name:'七猫小说下载器', desc:'七猫免费小说下载', added:'2026-10-04', img:'icons/qimao.png', version:'v1.0.0', os:['Windows','macOS','Linux','安卓','iOS'], secret:'https://github.com/shing-yu/swiftcat-downloader', quark:'https://pan.quark.cn/s/a6feae8cc3d1', baidu:'https://pan.baidu.com/s/1IEjRs6QI0SSxz0_8MbAdXw?pwd=paqi' },
      { name:'笔趣阁 5.0', desc:'海量书源免费阅读', added:'2026-10-04', img:'icons/biquge.png', version:'5.0', os:['安卓'], secret:'https://www.bqgapp.cn/', quark:'https://pan.quark.cn/s/efae8b3e1325', baidu:'https://pan.baidu.com/s/1ecJhyMWNgQfw6v5uCt2ySg?pwd=azf3' },
      { name:'开源软件 + 开源书源', desc:'开源阅读 + 书源合集', added:'2026-10-04', img:'icons/kaiyuan.png', os:['安卓'], quark:'https://pan.quark.cn/s/938c4b40974e', baidu:'https://pan.baidu.com/s/169DT7lXgr0DLeB8pkTWUyQ?pwd=e0m5' },
      { name:'星盒', desc:'多功能聚合神器（小说/音乐/影视/动漫）', added:'2026-10-04', img:'icons/xinghe.png', version:'v2.7.0', os:['安卓'], secret:'https://www.istarbox.app/download', quark:'https://pan.quark.cn/s/7fc3a192ddc2', baidu:'https://pan.baidu.com/s/18Des_vBGkeHMCgBgans8Tw?pwd=j5q4' },
      { name:'摸鱼神器', desc:'电脑端看小说，隐蔽摸鱼', added:'2026-10-04', img:'icons/moyu.png', os:['Windows'], quark:'https://pan.quark.cn/s/33a420bf77d2', baidu:'https://pan.baidu.com/s/1iSVaAHf-_udfr1SGlIp82g?pwd=rscq' },
      { name:'知乎盐选文章提取', desc:'提取知乎盐选文章（需自备会员）', added:'2026-10-04', img:'icons/zhihu.png', os:['Windows'], quark:'https://pan.quark.cn/s/22496116e151' },
      { name:'600G小说合集', desc:'600多G小说合集，起点番茄热门小说，多为精校版，配本地阅读器即可看', added:'2026-10-05', emoji:'📚', quark:'https://pan.quark.cn/s/b819a88df377' },
    ]
  },
  {
    id:'music', icon:'🎵', name:'音乐专区', desc:'免费听歌、下歌', added:'2026-10-04', color:'#8b5cf6', soft:'#f5f3ff',
    tools:[
      { name:'敦伦调调', desc:'全网音乐免费听 / 下载', added:'2026-10-04', img:'icons/dunlun.png', version:'v1.0.10', os:['安卓'], secret:'https://app.4848948.xyz/', quark:'https://pan.quark.cn/s/21d0a48a9ee9', baidu:'https://pan.baidu.com/s/1ObfiNgOTdDpkxcEVFZZ4kA?pwd=3dcd' },
      { name:'星盒', desc:'聚合音乐资源神器', added:'2026-10-04', img:'icons/xinghe.png', version:'v2.7.0', os:['安卓'], secret:'https://www.istarbox.app/download', quark:'https://pan.quark.cn/s/7fc3a192ddc2', baidu:'https://pan.baidu.com/s/1cs_YNcijpn15Gx6CK-lNqA?pwd=3w3y' },
      { name:'zpod', desc:'播客 / 音乐播放器', added:'2026-10-04', img:'icons/zpod.png', version:'v3.0.10', os:['Windows','安卓','iOS'], secret:'https://zpod.net/#landing-downloads', quark:'https://pan.quark.cn/s/8e670e877201', baidu:'https://pan.baidu.com/s/1k8lnZ3KKz7eVV-yTLovZlQ?pwd=4if2' },
      { name:'星音乐', desc:'聚合 QQ 音乐、网易云、酷我、酷狗四大平台，一站搜歌下歌', added:'2026-10-04', img:'icons/xingyinyue.png', version:'v2.0', os:['安卓'], secret:'https://music.istarbox.app/', quark:'https://pan.quark.cn/s/42f30fcaeea5', baidu:'https://pan.baidu.com/s/1KcaQEt15ZQTOoXMiTHucxg?pwd=ck1c' },
      { name:'莫比音乐', desc:'高品质音乐平台（收费）', added:'2026-10-04', tag:'收费', img:'icons/mobi.png', os:['安卓','iOS','Windows'], secretText:'QQ 群文件', quark:'https://pan.quark.cn/s/f70a57a9420a', baidu:'https://pan.baidu.com/s/1___-VnWKyPtabXOOupRi2Q?pwd=rsc8' },
      { name:'四分贝音乐', desc:'windows系统下载mp3、flac等格式，自动下载封面和歌词lrc文件', added:'2026-10-04', img:'icons/sifenbei.png', version:'v1.3.2', os:['Windows'], secret:'https://www.4fb.cn/soft/pc/2816.html', quark:'https://pan.quark.cn/s/6a5f6874a275', baidu:'https://pan.baidu.com/s/1J_8b-pnAKg9qLcuP5ULrxw?pwd=4a38' },
      { name:'米兔音乐', desc:'免费音乐', added:'2026-10-04', img:'icons/mitu.png', os:['Windows'], secret:'https://www.qqmp3.vip/', quark:'https://pan.quark.cn/s/724b9a1e77cf', baidu:'https://pan.baidu.com/s/1_hEL82wFT2481t8gvmzAog?pwd=jjam' },
      { name:'无损音乐', desc:'FLAC 无损音乐在线试听 / 下载', added:'2026-10-04', emoji:'🎧', os:['网页'], web:'https://flac.music.hi.cn/' },
    ]
  },
  {
    id:'video', icon:'🎬', name:'影视专区', desc:'聚合影视资源', added:'2026-10-04', color:'#ef4444', soft:'#fef2f2',
    tools:[
      { name:'星盒', desc:'聚合影视资源，看电影追剧', added:'2026-10-04', img:'icons/xinghe.png', version:'v2.7.0', os:['安卓'], secret:'https://www.istarbox.app/download', quark:'https://pan.quark.cn/s/7fc3a192ddc2', baidu:'https://pan.baidu.com/s/18Des_vBGkeHMCgBgans8Tw?pwd=j5q4' },
      { name:'Sparkle', desc:'番剧影视、漫画、壁纸一体化的安卓应用，全部免费无广告，影视最高 4K 高清，可看可下载', added:'2026-10-11', img:'icons/sparkle.png', os:['安卓'], quark:'https://pan.quark.cn/s/3e86c984820f', baidu:'https://pan.baidu.com/s/1DJbbLI_O8wGfA9KUh5Tzmg?pwd=mwki' },
      { name:'MiniReel', desc:'第三方红果短剧客户端，免费无广告，手机/电视/电脑全平台', added:'2026-10-04', img:'icons/minireel.png', version:'v0.3.1', os:['安卓','Android TV','Windows','macOS','Linux'], secret:'https://minireel.weppp.cyou:54267/versions', quark:'https://pan.quark.cn/s/c326807e1024', baidu:'https://pan.baidu.com/s/1CEqs_PTYrxYEzSz_40DAbQ?pwd=fgf1' },
    ]
  },
  {
    id:'anime', icon:'🎨', name:'动漫专区', desc:'动漫资源', added:'2026-10-04', color:'#f97316', soft:'#fff7ed',
    tools:[
      { name:'Kazumi', desc:'免费无广告聚合全网番剧源，看番时能开弹幕和 4K 超清，Win/Mac/安卓/iOS/鸿蒙都能用', added:'2026-10-08', img:'icons/kazumi.png', version:'v2.3.8', os:['Windows','macOS','Linux','安卓','iOS','鸿蒙'], secret:'https://github.com/Predidit/Kazumi/releases', quark:'https://pan.quark.cn/s/e40c2f5efb4d', baidu:'https://pan.baidu.com/s/1BI-tnat5ZSVEKe21TJXlQw?pwd=hsqy' },
      { name:'动漫共和国', desc:'海量高清动漫免费看，日更新番，支持安卓 / 苹果 / Windows 多端同步', added:'2026-10-04', img:'icons/dongman.png', version:'v1.4.4', os:['安卓','iOS','Windows'], secret:'https://www.oneghg.com/', quark:'https://pan.quark.cn/s/561a59d10235', baidu:'https://pan.baidu.com/s/1gM3uc3zolfNc4CDSgBcuTg?pwd=stjc' },
      { name:'星盒', desc:'聚合动漫资源', added:'2026-10-04', img:'icons/xinghe.png', version:'v2.7.0', os:['安卓'], secret:'https://www.istarbox.app/download', quark:'https://pan.quark.cn/s/7fc3a192ddc2', baidu:'https://pan.baidu.com/s/10DAk0iXqSrakMpqFVVUdJw?pwd=6w0m' },
    ]
  },
  {
    id:'comic', icon:'📚', name:'漫画专区', desc:'漫画资源', added:'2026-10-04', color:'#f59e0b', soft:'#fffbeb',
    tools:[
      { name:'Mihon', desc:'免费开源安卓漫画阅读器（Tachiyomi 继任者）', added:'2026-10-04', img:'icons/mihon.png', version:'v0.20.4', os:['安卓'], secret:'https://github.com/mihonapp/mihon', quark:'https://pan.quark.cn/s/14966eac05db', baidu:'https://pan.baidu.com/s/11FGWmCzzpJ7gVCjh26lvIg?pwd=9gmn' },
      { name:'venera_1.4.6', desc:'漫画阅读器', added:'2026-10-04', emoji:'📖', version:'1.4.6', os:['安卓'], secret:'https://github.com/venera-app/venera', quark:'https://pan.quark.cn/s/ca0afa3bf4b0', baidu:'https://pan.baidu.com/s/1J_O7CFwJEgtow6ibGD_9qA?pwd=ai9w' },
      { name:'Sparkle', desc:'漫画聚合阅读器，看热门 / 找漫画 / 畅销榜 / 全网热议，也能下载离线看', added:'2026-10-11', img:'icons/sparkle.png', os:['安卓'], quark:'https://pan.quark.cn/s/3e86c984820f', baidu:'https://pan.baidu.com/s/1DJbbLI_O8wGfA9KUh5Tzmg?pwd=mwki' },
      { name:'抱走漫画', desc:'免费无广告的多源漫画聚合阅读器，装完直接看，离线也能缓存下载', added:'2026-10-05', img:'icons/baozoumanhua.png', version:'1.0.7', os:['安卓'], secretText:'QQ 群文件', quark:'https://pan.quark.cn/s/b3c9435bd0a4', baidu:'https://pan.baidu.com/s/1rLGyBCQYtHYV_NV9g1xZNw?pwd=1o1m' },
    ]
  },
  {
    id:'game', icon:'🎮', name:'游戏专区', desc:'童年经典游戏合集', added:'2026-10-04', color:'#22c55e', soft:'#f0fdf4',
    tools:[
      { name:'手机破解游戏合集', desc:'2812 款手机破解游戏（495GB），动作、策略、经营、模拟、塔防等类型齐全，通勤路上随手玩', added:'2026-10-04', emoji:'📱', os:['安卓'], quark:'https://pan.quark.cn/s/c830ec006605' },
      { name:'980款Steam移植手游合集', desc:'980 款 Steam 移植手机游戏版大合集', added:'2026-10-04', emoji:'🎮', os:['安卓'], quark:'https://pan.quark.cn/s/7749692bbebf' },
      { name:'115款童年经典街机游戏', desc:'童年街机游戏大合集，一键怀旧', added:'2026-10-04', emoji:'🕹️', os:['安卓'], quark:'https://pan.quark.cn/s/5f081f6ffff0' },
    ]
  },
  {
    id:'data', icon:'📂', name:'资料专区', desc:'干货资料合集', added:'2026-10-04', color:'#14b8a6', soft:'#f0fdfa',
    tools:[
      { name:'168部经典漫画合集', desc:'灌篮高手、七龙珠、火影忍者、海贼王、柯南、哆啦A梦、蜡笔小新、圣斗士星矢、JOJO、老夫子、阿衰等 168 部经典漫画打包，多数为高清彩版与全卷合集', added:'2026-10-12', emoji:'📕', quark:'https://pan.quark.cn/s/99dcc16a7c8d' },
      { name:'AI漫剧最全教程', desc:'做 AI 漫剧的整套资料，含教程、工作流、提示词和专用 Skill，看完就能照着开工', added:'2026-10-06', emoji:'🎬', quark:'https://pan.quark.cn/s/e6e64016a0b0' },
      { name:'高性价比人生指南', desc:'614 条循证生活建议，讲怎么活得久、少生病、少花冤枉钱和避坑，每条都标了成本收益和出处', added:'2026-10-04', emoji:'🧭', quark:'https://pan.quark.cn/s/8a03cc957f40', baidu:'https://pan.baidu.com/s/1n4XxIXfgKk_uIS9XyOQaXw?pwd=sm8j' },
      { name:'Z-Library 电子书', desc:'免费电子书下载，海量图书资源', added:'2026-10-04', emoji:'📚', web:'https://zh.z-library.sk/' },
      { name:'自媒体运营宝典', desc:'自媒体运营干货教程合集', added:'2026-10-04', emoji:'📘', quark:'https://pan.quark.cn/s/843970d3a819', baidu:'https://pan.baidu.com/s/1i-dcqE_dTVIu4I48PxdLBg?pwd=s8q5' },
      { name:'古龙小说全集', desc:'古龙武侠小说在线阅读，70多部经典作品', added:'2026-10-04', emoji:'📖', web:'https://www.gulongwang.com/' },
      { name:'自媒体人必备', desc:'自媒体运营干货资料包', added:'2026-10-04', emoji:'✍️', quark:'https://pan.quark.cn/s/12d673d50af9' },
      { name:'中国各省旅游攻略', desc:'全国各省旅游攻略合集', added:'2026-10-04', emoji:'🗺️', quark:'https://pan.quark.cn/s/a7bd03521366' },
    ]
  },
  {
    id:'wallpaper', icon:'🖼️', name:'壁纸专区', desc:'高清壁纸合集', added:'2026-10-04', color:'#ec4899', soft:'#fdf2f8',
    tools:[
      { name:'超级齐全的壁纸合集', desc:'海量高清壁纸打包下载', added:'2026-10-04', emoji:'🌆', quark:'https://pan.quark.cn/s/3ebe11700a02' },
    ]
  },
  {
    id:'software', icon:'🛠️', name:'实用软件', desc:'效率工具、黑科技软件', added:'2026-10-04', color:'#6366f1', soft:'#eef2ff',
    tools:[
      { name:'Piik', desc:'免费开源屏幕共享工具，P2P 优先，支持浏览器查看、桌面应用', added:'2026-10-04', img:'icons/piik.png', version:'v1.9.2', os:['Windows'], secret:'https://github.com/TNTcraftHIM/Piik', quark:'https://pan.quark.cn/s/ba0b83672f29', baidu:'https://pan.baidu.com/s/1yqT4XvIXji-UmR2_jWHRKg?pwd=s53t' },
      { name:'VideoToNotes', desc:'视频转文章，导入视频字幕即可导出公众号排版文章', added:'2026-10-04', img:'icons/videotonotes.png', os:['Windows'], quark:'https://pan.quark.cn/s/d38a3d2bd7f0', baidu:'https://pan.baidu.com/s/1BiTkU9YGXdQt0XHzax33Fg?pwd=5h5t' },
      { name:'谷歌浏览器', desc:'多系统安装包：安卓手机/平板、电视TV、鸿蒙、mac、Windows', added:'2026-10-04', img:'icons/chrome.png', os:['Windows','macOS','安卓','鸿蒙','Android TV'], quark:'https://pan.quark.cn/s/fa06f51cda42' },
      { name:'Bandizip', desc:'免费 Windows 解压/压缩软件，速度快，支持绝大多数格式', added:'2026-10-04', img:'icons/bangzip.png', os:['Windows'], secret:'https://cn.bandisoft.com/bandizip/', quark:'https://pan.quark.cn/s/f192f2851391', baidu:'https://pan.baidu.com/s/1X5h5sOA4wHqURaId1XyTig?pwd=2vqs' },
      { name:'GKD', desc:'安卓开源去开屏广告，天天更新，3 个全局规则基本够用', added:'2026-10-04', img:'icons/gkd.png', version:'v605', os:['安卓'], secret:'https://github.com/gkd-kit/gkd/releases', quark:'https://pan.quark.cn/s/1c9e604664a7', baidu:'https://pan.baidu.com/s/10XQkKe7a_RxKdJ-Yg-4RHw?pwd=wb7c' },
      { name:'WinTab', desc:'WinTab 窗口标签页工具，多窗口 1 键收成标签页', added:'2026-10-04', img:'icons/wintab.png', version:'v2.4.4', os:['Windows'], secret:'https://github.com/OUBIGFA/WinTab', quark:'https://pan.quark.cn/s/f67eb0e6fc34', baidu:'https://pan.baidu.com/s/187Z2jh57IWYFkA86QsacXQ?pwd=3s6d' },
      { name:'UU远程', desc:'网易UU远程，跨平台远程控制（手机 / 电脑 / 电视）', added:'2026-10-04', img:'icons/uuyc.png', os:['Windows','macOS','安卓','iOS','Android TV'], secret:'https://uuyc.163.com/', quark:'https://pan.quark.cn/s/43bcafcc4700', baidu:'https://pan.baidu.com/s/1mkCfPAE1KeYZP_4omt4_dw?pwd=76bm' },
      { name:'铁汁', desc:'TieZ 剪贴板助手，永久记录 + AI 翻译 + 局域网互传', added:'2026-10-04', img:'icons/tiez.png', os:['Windows','macOS'], secret:'https://tiez.name666.top/zh/', quark:'https://pan.quark.cn/s/93a33db44a9a', baidu:'https://pan.baidu.com/s/1o4OG6Y9QmZjTi1g-mdCV7Q?pwd=kdww' },
      { name:'Win11开始菜单增强工具', desc:'StartAllBack · Win11 恢复 Win7/Win10 经典界面', added:'2026-10-04', img:'icons/startallback.png', os:['Windows'], secret:'https://www.ghxi.com/startallback.html', quark:'https://pan.quark.cn/s/7c3ec837f3eb', baidu:'https://pan.baidu.com/s/1J5qCg9swBFnPKqdnLBkCnA?pwd=t7nc' },
      { name:'Windows电脑护眼工具', desc:'CareUEyes · 过滤蓝光、定时休息，护眼防疲劳', added:'2026-10-04', img:'icons/careueyes.png', os:['Windows'], quark:'https://pan.quark.cn/s/b099a45177b0', baidu:'https://pan.baidu.com/s/1j9hGgLO8PPaHSNR2g7yDqA?pwd=f739' },
      { name:'李跳跳', desc:'跳过 App 开屏广告', added:'2026-10-04', img:'icons/litiaotiao.png', os:['安卓'], quark:'https://pan.quark.cn/s/b12c4e900948', baidu:'https://pan.baidu.com/s/1_3tevGSdkFjLL3UXcYwRkA?pwd=jr1q' },
      { name:'录屏软件合集', desc:'四款口碑电脑录屏软件合集：OBS Studio 免费开源直播录屏、ShareX 截图标注与长图、FastStone Capture 经典轻量、Apowersoft 录屏大师新手友好', added:'2026-10-11', emoji:'🎥', os:['Windows','macOS','Linux'], quark:'https://pan.quark.cn/s/d4a4b3d25c3f', baidu:'https://pan.baidu.com/s/1xlJOaxI7NSdo82h87BrR9w?pwd=6yg4' },
      { name:'PixPin', desc:'免费截图与录屏工具，截图 / 贴图 / 长截图 / OCR / 录屏一站式搞定', added:'2026-10-11', emoji:'📸', version:'v3.5.5.1', os:['Windows','macOS'], secret:'https://pixpin.cn/', quark:'https://pan.quark.cn/s/755242ca07b3', baidu:'https://pan.baidu.com/s/11rrM9pdPKr7baQi1wInaMg?pwd=arhn' },
      { name:'极限投屏', desc:'一部手机控制 500 台电脑，批量开关机、装系统、远程操控机房', added:'2026-10-04', img:'icons/jixian.png', version:'v5.0.0.3', os:['Windows'], secret:'https://my.feishu.cn/docx/QRMhd9nlmorAGgxVLImczxSdnYf', quark:'https://pan.quark.cn/s/c63e905b0bb4', baidu:'https://pan.baidu.com/s/1GfuV0rHaoTaK77CZz8os3A?pwd=anb2' },
      { name:'带壳截图', desc:'给截图加手机壳效果', added:'2026-10-04', emoji:'📱', os:['安卓','Windows'], quark:'https://pan.quark.cn/s/74e3ddac7600', baidu:'https://pan.baidu.com/s/17Fx9y01I-d7T-ZVZNTR6jw?pwd=uumt' },
      { name:'非剪', desc:'视频剪辑', added:'2026-10-04', emoji:'✂️', version:'v4.0.13', os:['Windows'], quark:'https://pan.quark.cn/s/54d85a05c3d0', baidu:'https://pan.baidu.com/s/1MsyTlVlobPxdq2K_XGe0Wg?pwd=ppar' },
      { name:'团子素材解析', desc:'豆包视频图片去水印', added:'2026-10-11', img:'icons/tuanzi.png', version:'v1.1.8', os:['Windows'], quark:'https://pan.quark.cn/s/f6af0a41f370', baidu:'https://pan.baidu.com/s/1qNyFeZoUDKtg3-DiGX7wGg?pwd=3heb' },
      { name:'Geek Uninstaller', desc:'免费开源强力卸载工具，卸载后自动扫描残留文件与注册表并清理干净', added:'2026-10-11', img:'icons/geek.png', version:'v1.5.5.185', os:['Windows'], secret:'https://geekuninstaller.com/', quark:'https://pan.quark.cn/s/d5fd8dcd78fc', baidu:'https://pan.baidu.com/s/1ysTcO4Y-cxprVhawrXDC8w?pwd=ccsc' },
      { name:'公众号文章下载器', desc:'下载公众号文章', added:'2026-10-04', emoji:'📄', os:['Windows'], secret:'https://changfengbox.top/wechat', quark:'https://pan.quark.cn/s/2101a43cc4d1', baidu:'https://pan.baidu.com/s/1t-ogHr3RgaiE-x3w_06t1A?pwd=u5nx' },
      { name:'qq音乐转MP3格式', desc:'音乐格式转换', added:'2026-10-04', emoji:'🎶', os:['Windows'], quark:'https://pan.quark.cn/s/809f293713a7', baidu:'https://pan.baidu.com/s/1XMShkHb3ak2i5a1VLODzjw?pwd=dwns' },
      { name:'刷圈兔', desc:'微信、支付宝、QQ 模拟工具，仅供娱乐，请勿用于非法用途', added:'2026-10-04', emoji:'🐰', os:['安卓'], quark:'https://pan.quark.cn/s/9c65f279682a', baidu:'https://pan.baidu.com/s/1xR-hreaSPe3xM4eu1b7thg?pwd=ezy3' },
      { name:'飞鼠格式转换助手', desc:'音视频 / 文档格式转换', added:'2026-10-04', img:'icons/flyingmouse.png', version:'v0.7.10', os:['Windows'], secret:'https://github.com/LaoFeng-mouse/flyingmouse-format', quark:'https://pan.quark.cn/s/54d36d2d91dd', baidu:'https://pan.baidu.com/s/1g-EPPoxSKZJQIuzRqfdXvA?pwd=61xj' },
      { name:'AI视频无痕去字幕', desc:'AI 去除视频字幕', added:'2026-10-04', emoji:'🎞️', version:'v1.4.0', os:['Windows'], secret:'https://github.com/YaoFANGUK/video-subtitle-remover', quark:'https://pan.quark.cn/s/4059abee799d', baidu:'https://pan.baidu.com/s/1GdsTfpiBIgbrwP0y35Zk2A?pwd=7p7v' },
      { name:'QQ空间恢复软件', desc:'QQ 空间数据恢复', added:'2026-10-04', emoji:'💾', os:['Windows'], quark:'https://pan.quark.cn/s/fbc7d2f4e05c', baidu:'https://pan.baidu.com/s/1IZRzK4VsDpzJKcuAK4YeQQ?pwd=44ka' },
      { name:'Win自动更新关闭工具', desc:'关闭 Windows 自动更新', added:'2026-10-04', emoji:'🛑', os:['Windows'], quark:'https://pan.quark.cn/s/a66636a1bc90', baidu:'https://pan.baidu.com/s/18PwazXQO1lrhh_GtQaX4ow?pwd=q4sy' },
    ]
  },
  {
    id:'ai', icon:'🤖', name:'AI专区', desc:'AI 提效 skill', added:'2026-10-04', color:'#0ea5e9', soft:'#f0f9ff',
    tools:[
      { name:'jev-chat（AI参谋）', desc:'聊天辅助工具，读懂对方、给回复建议', added:'2026-10-04', emoji:'💬', os:['安卓','Windows','macOS'], points:[
        '<b>是什么 & 能干嘛</b>：装在手机/电脑上的对话副驾，在微信/QQ/飞书里告诉你对方想干什么、有没有坑、给几条回复建议，最终发不发由你决定（安卓支持微信/QQ/飞书等，mac 仅支持微信）',
        '<b>怎么用</b>：从 GitHub 下载对应版本（安卓 APK / Windows / macOS），并在 <a href="https://openrouter.ai" target="_blank" rel="noopener">openrouter.ai</a> 注册免费获取 jev 模型密钥填入',
        '<b>GitHub 原地址</b>：<a href="https://github.com/jev-chat/jev-chat-jarvis" target="_blank" rel="noopener">github.com/jev-chat/jev-chat-jarvis</a>',
      ]},
      { name:'HowToLiveBetter', desc:'高性价比人生指南，循证生活 skill', added:'2026-10-04', emoji:'🧭', os:['Windows','macOS','Linux'], cmd:'npx skills add eternity4719/HowToLiveBetter', points:[
        '<b>是什么 & 能干嘛</b>：按性价比排序的循证生活指南——长寿防病、急救、省钱理财、法律红线、失业工伤、医保社保、恋爱婚育、怀孕育儿、创业合规、出国技能等 612 条建议，每条写明成本、收益、证据等级和出处（只引期刊论文与官方文件）',
        '<b>GitHub 原地址</b>：<a href="https://github.com/eternity4719/HowToLiveBetter" target="_blank" rel="noopener">github.com/eternity4719/HowToLiveBetter</a>',
      ]},
      { name:'book-to-skill', desc:'把任何书籍/文档转成 AI Skill，AI 直接基于原文回答', added:'2026-10-04', emoji:'📚', os:['Windows','macOS','Linux'], cmd:'npx skills add virgiliojr94/book-to-skill', points:[
        '<b>是什么 & 能干嘛</b>：把书籍/文档（PDF、EPUB、Word、HTML、Markdown、TXT 等）转成 AI Skill，让 AI 基于原文回答——比如民法典、劳动法十几万字做成 Skill，不编造答案',
        '<b>GitHub 原地址</b>：<a href="https://github.com/virgiliojr94/book-to-skill" target="_blank" rel="noopener">github.com/virgiliojr94/book-to-skill</a>',
      ]},
      { name:'夸克网盘 skill', desc:'夸克网盘 AI 助手 skill（实测不如手动来得快，静待优化）', added:'2026-10-04', emoji:'☁️', os:['Windows','macOS','Linux'] },
      { name:'淬火学习 skill', desc:'号称能让学习速度提升 10 倍的 skill', added:'2026-10-04', emoji:'🔥', os:['Windows','macOS','Linux'], cmd:'npx -y skills add Biancuihuo/cuihuo-skills -g --all', points:[
        '<b>是什么 & 能干嘛</b>：号称学习速度提升 10 倍的 skill，不是让你学得更快，而是只学该学的、学完真会了',
        '<b>GitHub 原地址</b>：<a href="https://github.com/Biancuihuo/cuihuo-skills" target="_blank" rel="noopener">github.com/Biancuihuo/cuihuo-skills</a>',
      ]},
    ]
  },
];

/* =====================================================================
   更新动态 · 按天记录网站新增 / 版本更新 / 链接修复
   date: 'YYYY-MM-DD'  type: new(新增) | update(版本更新) | fix(修复优化)
   section: 所属分区 id（用于点击跳转 + 取色）  title: 一句话标题
   desc: 补充说明（可省）  link: {quark,baidu}（可省）
   新增一条：在数组最前面 unshift 即可，站点按日期倒序展示
   ===================================================================== */
const UPDATES = [
  { date:'2026-10-12', type:'update', section:'video', title:'红果短剧免广告版 MiniReel 更新至 v0.3.1', desc:'第三方红果短剧客户端新版本，免费无广告，支持手机 / 电视 / 电脑全平台',
    link:{ quark:'https://pan.quark.cn/s/c326807e1024', baidu:'https://pan.baidu.com/s/1CEqs_PTYrxYEzSz_40DAbQ?pwd=fgf1' } },
  { date:'2026-10-12', type:'new', section:'data', title:'资料区新增：168 部经典漫画合集', desc:'灌篮高手、七龙珠、火影忍者、海贼王、柯南、哆啦A梦、蜡笔小新、圣斗士星矢、JOJO、老夫子、阿衰等 168 部经典作品打包，多数为高清彩版与全卷合集',
    link:{ quark:'https://pan.quark.cn/s/99dcc16a7c8d' } },
  { date:'2026-10-11', type:'update', section:'video', title:'Sparkle 上线影视专区与漫画专区', desc:'番剧影视、漫画、壁纸一体化的安卓应用，全部免费无广告，影视最高 4K 高清，可看可下载' },
  { date:'2026-10-11', type:'update', section:'software', title:'录屏合集、团子素材解析上线，支持设备全站校准', desc:'4 款录屏软件合并为一张合集卡片；豆包去水印升级为团子素材解析（v1.1.8）；全站支持设备逐条比对实际安装包重新核验' },
  { date:'2026-10-11', type:'fix', section:'', title:'移除卡片上直接显示的 GitHub 地址', desc:'Mihon / Piik / 高性价比人生指南不再明文展示项目地址，下载来源统一收进右上角书签（需管理员密码）；AI 专区作为开源 skill 入口，保留地址方便安装' },
  { date:'2026-10-11', type:'update', section:'music', title:'星音乐 v2.0、zpod v3.0.10 版本号上线', desc:'七猫小说下载器补充 iOS 支持' },
  { date:'2026-10-11', type:'update', section:'software', title:'实用软件区录屏合集扩为 4 款', desc:'OBS Studio、ShareX、FastStone Capture、Apowersoft 录屏大师各一张卡片，均为 Windows 口碑之作' },
  { date:'2026-10-11', type:'fix', section:'software', title:'下架批量下载抖音视频插件、WPS 会员版本', desc:'违规 / 风险资源已从站点移除' },
  { date:'2026-10-11', type:'update', section:'music', title:'星音乐更换全新图标', desc:'蓝底音符星标图标上线，简介改为一句话概括' },
  { date:'2026-10-08', type:'new', section:'anime', title:'动漫区新增 Kazumi：开源追番聚合神器', desc:'免费无广告，聚合全网番剧源，支持弹幕 + Anime4K 超分，Win / Mac / Linux / 安卓 / iOS / 鸿蒙全平台（v2.3.8）',
    link:{ quark:'https://pan.quark.cn/s/e40c2f5efb4d', baidu:'https://pan.baidu.com/s/1BI-tnat5ZSVEKe21TJXlQw?pwd=hsqy' } },
  { date:'2026-10-06', type:'new', section:'data', title:'资料区新增：AI 漫剧最全教程', desc:'教程 + 工作流 + 提示词 + Skill 一整套，夸克网盘分享' },
  { date:'2026-10-05', type:'new', section:'comic', title:'漫画区新增：抱走漫画', desc:'轻量好用的漫画聚合阅读器' },
  { date:'2026-10-05', type:'new', section:'novel', title:'小说区新增：600G 小说合集（69235 本 TXT）', desc:'全网小说资源打包合集，持续补充' },
  { date:'2026-10-04', type:'new', section:'software', title:'实用软件区新增：每日版本检测', desc:'接入 GitHub 版本监控，每天自动检测 GKD 等开源工具的新版本' },
  { date:'2026-10-04', type:'new', section:'video', title:'MiniReel 调整至影视专区', desc:'红果短剧客户端，从实用软件移动到影视专区' },
  { date:'2026-10-04', type:'fix', section:'', title:'网站全面优化上线', desc:'新增 hash 路由（链接可分享 / 刷新保持）、全局搜索增强、暗色模式自适应、SEO + PWA、链接巡检、404 页、数据拆分' },
  { date:'2026-10-03', type:'new', section:'comic', title:'漫画区新增：Mihon 安卓漫画阅读器', desc:'开源漫画阅读器，源站自选' },
  { date:'2026-10-02', type:'new', section:'software', title:'实用软件区新增：Piik 屏幕共享工具', desc:'跨设备屏幕 / 窗口共享' },
  { date:'2026-10-02', type:'new', section:'software', title:'实用软件区新增：VideoToNotes 视频转文章', desc:'把视频内容自动转成结构化笔记' },
  { date:'2026-10-01', type:'new', section:'software', title:'实用软件区新增：谷歌浏览器', desc:'Chrome 稳定版下载入口' },
  { date:'2026-10-01', type:'new', section:'game', title:'游戏区新增：手机破解游戏合集 / Steam 移植手游合集', desc:'两类合集资源一次性补齐' },
  { date:'2026-09-28', type:'new', section:'ai', title:'AI 专区新增：HowToLiveBetter 高性价比人生指南', desc:'612 条循证生活建议，离线文档 + Skill 两种用法' },
  { date:'2026-09-28', type:'new', section:'software', title:'实用软件区新增：Bandizip 解压软件', desc:'轻量好用的解压工具' },
  { date:'2026-09-28', type:'new', section:'software', title:'实用软件区新增：GKD 去广告', desc:'安卓开源去开屏广告，内置规则订阅' },
  { date:'2026-09-28', type:'new', section:'ai', title:'AI 专区新增：jev-chat（AI参谋）', desc:'聊天辅助工具，微信 / QQ / 飞书场景下的对话副驾' },
];
