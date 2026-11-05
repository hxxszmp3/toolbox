/* 小说专区全部 10 张宣传海报数据
 * 文案依据：夸克网盘实际文件清单 + 网络搜索核实的产品信息 + 已有素材包文案
 * 规则：无任何引导元素（网址/二维码/下载按钮）；无截图的工具不放截图区
 */
const path = require('path');
const { html, cdpShot, dataUri, ASSET, OUT } = require('./poster.js');

const icon = n => dataUri(path.join(ASSET, 'icon_' + n + '.png'));
const shot = n => dataUri(path.join(ASSET, n));

const TOOLS = [
  /* ---------- 0. 指尖文库 ---------- */
  {
    key: 'wenku8', out: '指尖文库.png',
    c: '#4F46E5', bg: 'linear-gradient(170deg,#F1F0FF 0%,#FFFFFF 45%,#F5F0FF 100%)',
    b1: '#DDD6FE', b2: '#C7D2FE', dot: '#C7D2FE', shadowc: 'rgba(79,70,229,.30)',
    icon: icon('wenku8'), heroIcon: icon('wenku8'),
    pill: 'Wenku8 Flutter 重写版 · 开源',
    title: '指尖文库',
    subtitle: '轻小说的翻页手感',
    sub2: '翻页跟手不费眼 · 支持本地导入与自定义书源',
    features: [
      '翻页动画跟手，长看不累',
      '书架排版干净，阅读参数随意调',
      '支持本地导入，TXT / EPUB 直接看',
      '0.3.7 自带书源，直连轻小说文库',
      '界面干净无广告，阅读不被打扰',
      '开源项目，源码公开可查',
    ],
    stats: [['0.3.7', '唯一带书源版'], ['FLUTTER', '重写更顺滑'], ['0 广告', '纯净阅读']],
    tags: [{ text: '手机 安卓', primary: true }, { text: '开源' }, { text: '无广告' }],
    bottom: '轻小说党的翻页体验，比不少付费阅读器还顺',
    bar: '开源免费 · 装好别更新',
  },

  /* ---------- 1. 阅读 MD3 版 ---------- */
  {
    key: 'md3', out: '阅读MD3版.png',
    c: '#4F46E5', bg: 'linear-gradient(170deg,#F4F2FF 0%,#FFFFFF 45%,#EEF6FF 100%)',
    b1: '#DDD6FE', b2: '#BFDBFE', dot: '#C7D2FE', shadowc: 'rgba(79,70,229,.32)',
    icon: icon('yuedu-md3'),
    pill: '开源阅读重构 · Material Design 3',
    title: '阅读 MD3 版',
    subtitle: '一个 App 读全网小说',
    sub2: '免费无广告 · 附 4 份精选书源 · 7000+ 条可用',
    shots: [{ src: shot('shot_md3.jpg'), wide: true }],
    features: [
      'MD3 全新界面，清爽不花哨',
      '附 4 份书源合集，7000+ 条',
      '自定义书源规则，想加哪站加哪站',
      '支持 TXT / EPUB 本地阅读',
      '书架分组管理，追更不迷路',
      '夜间护眼，长时间阅读不累',
    ],
    stats: [['7000+', '可用书源'], ['4 份', '精选合集'], ['25MB', '安装包体积']],
    tags: [{ text: '手机 安卓', primary: true }, { text: '附赠 7000+ 条书源' }],
    bottom: '导入书源就能看全网小说，开箱即用',
    bar: '开源免费 · 无广告无内购',
  },

  /* ---------- 2. 番茄小说下载器 ---------- */
  {
    key: 'fanqie', out: '番茄小说下载器.png',
    c: '#E8452C', bg: 'linear-gradient(170deg,#FFF3EF 0%,#FFFFFF 45%,#FFECEF 100%)',
    b1: '#FED7AA', b2: '#FECDD3', dot: '#FCD5CE', shadowc: 'rgba(232,69,44,.30)',
    icon: icon('fanqie'),
    pill: 'Rust + Tauri 打造 · 精美版客户端',
    title: '番茄小说下载器',
    subtitle: '无广告在线阅读 · 一键导出',
    sub2: '全设备支持 · 免登录搜索 · 批量导入下载',
    shots: [{ src: shot('shot_fanqie_wide.jpg'), wide: true }],
    features: [
      '无广告在线阅读，界面干净清爽',
      '一键导出 TXT / EPUB 本地文件',
      '段评直接看，追更互动不落下',
      '免登录搜索，批量导入下载',
      '分类发现找书，热门榜单全都有',
      '历史书库随时续读，进度不丢',
    ],
    stats: [['5 端', '全平台通用'], ['TXT', '一键导出'], ['免登录', '直接搜索']],
    tags: [{ text: '电脑 Windows', primary: true }, { text: '电脑 macOS' },
           { text: '电脑 Linux' }, { text: '手机 安卓' }, { text: '手机 iOS' }],
    bottom: '搜到就能存下来，追更存稿两不误',
    bar: '免费 · 无广告 · 全设备通用',
  },

  /* ---------- 3. 七猫小说下载器 ---------- */
  {
    key: 'qimao', out: '七猫小说下载器.png',
    c: '#F0522D', bg: 'linear-gradient(170deg,#FFF4EC 0%,#FFFFFF 45%,#FFF0F2 100%)',
    b1: '#FED7AA', b2: '#FECDD3', dot: '#FED7AA', shadowc: 'rgba(240,82,45,.30)',
    icon: icon('qimao'),
    pill: '七猫 / 番茄 · 搜到就能存',
    title: '七猫小说下载器',
    subtitle: '整本存本地，离线接着看',
    sub2: '五大平台通用 · 封面作者标签一次抓全',
    shots: [{ src: shot('shot_qimao2.png') }, { src: shot('shot_qimao1.png') }],
    features: [
      '搜到就能下，整本打包带走',
      '封面 / 作者 / 标签 / 简介一次抓全',
      '安卓 · iOS · macOS · Linux 全端通用',
      '夜间模式，睡前刷书不刺眼',
      '标签分类找书，几十万册任选',
      '随时转存，一键存进网盘',
    ],
    stats: [['5 端', '全平台通用'], ['整本', '打包下载'], ['离线', '断网也能看']],
    tags: [{ text: '手机 安卓', primary: true }, { text: '手机 iOS' },
           { text: '电脑 macOS' }, { text: '电脑 Linux' }],
    bottom: '搜一次存下来，地铁上没网也能翻',
    bar: '免费 · 无广告 · 全平台通用',
  },

  /* ---------- 4. 摸鱼神器 ReadCat ---------- */
  {
    key: 'moyu', out: '摸鱼神器ReadCat.png',
    c: '#0F766E', bg: 'linear-gradient(170deg,#EFFAF6 0%,#FFFFFF 45%,#FFF8EC 100%)',
    b1: '#99F6E4', b2: '#FDE68A', dot: '#A7F3D0', shadowc: 'rgba(15,118,110,.28)',
    icon: icon('moyu'), heroIcon: icon('moyu'),
    pill: '开源免费 · 老板键防摸鱼',
    title: '摸鱼神器 ReadCat',
    subtitle: '老板键一按，痕迹全无',
    sub2: '本地阅读器 · 支持 EPUB / PDF / TXT / DOCX',
    features: [
      '一键老板键，界面任务栏进程全隐',
      '书源插件聚合搜索，几十万小说随便搜',
      'TTS 语音朗读，躺平听书也带劲',
      '进度书签自动记住，随时接着读',
      '四种翻页模式，滚动仿页都行',
      '自定义字体行距，排版随心调',
    ],
    stats: [['6 种', '格式通吃'], ['老板键', '一键隐藏'], ['0 追踪', '纯本地']],
    tags: [{ text: '电脑 Windows', primary: true }, { text: '免费开源' }],
    bottom: '界面一收，谁都看不出你在读小说',
    bar: '无广告 · 无账号 · 100% 本地',
  },

  /* ---------- 5. 小说下载器 SoNovel ---------- */
  {
    key: 'sonovel', out: '小说下载器.png',
    c: '#0E8C86', bg: 'linear-gradient(170deg,#EAF9F7 0%,#FFFFFF 45%,#EEF7FF 100%)',
    b1: '#99F6E4', b2: '#BFDBFE', dot: '#A7F3D0', shadowc: 'rgba(14,140,134,.28)',
    icon: icon('xiaoshuo'), heroIcon: icon('xiaoshuo'),
    pill: 'GitHub 开源 · 免费无广告',
    title: '小说下载器',
    subtitle: '一键把全网小说搬进电脑',
    sub2: 'SoNovel · Windows / macOS / Linux',
    features: [
      '多书源聚合搜索，书名作者都能搜',
      '支持 EPUB / TXT / HTML / PDF 导出',
      'WebUI + 命令行双模式，随心使用',
      '并发下载 + 自动重试，稳定快速',
      '自定义书源规则，想加哪站加哪站',
      '书架分类管理，追更批量拉取',
    ],
    stats: [['4 格式', '导出可选'], ['多端', '三系统通用'], ['0 广告', '干净清爽']],
    tags: [{ text: '电脑 Windows', primary: true }, { text: '电脑 macOS' }, { text: '电脑 Linux' }],
    bottom: '追更 · 批量下载 · 离线阅读，一个工具全搞定',
    bar: '开源免费 · 电脑端小说下载神器',
  },

  /* ---------- 6. 笔趣阁 5.0 ---------- */
  {
    key: 'biquge', out: '笔趣阁5.0.png',
    c: '#5B4BE8', bg: 'linear-gradient(170deg,#F1EEFF 0%,#FFFFFF 45%,#F0F4FF 100%)',
    b1: '#DDD6FE', b2: '#C7D2FE', dot: '#C7D2FE', shadowc: 'rgba(91,75,232,.28)',
    icon: icon('biquge'), heroIcon: icon('biquge'),
    pill: '免费小说聚合 · 无需登录',
    title: '笔趣阁 5.0',
    subtitle: '书源一导入，海量免费随便看',
    sub2: '安卓直接装 · 苹果自签也能用',
    features: [
      '聚合多站书源，分类齐全不重复',
      '内置免费小说书源，开箱即读',
      '搜索发现两栏，追更不迷路',
      '阅读设置自由调，字体行距随心改',
      '安卓一键安装，零门槛上手',
      '苹果自签安装包，附图文教程',
    ],
    stats: [['8+ 份', '内置书源'], ['无需', '注册登录'], ['全端', '安卓+iOS']],
    tags: [{ text: '手机 安卓', primary: true }, { text: '手机 iOS' }, { text: '免费无广告' }],
    bottom: '装上就能看，不用折腾也不用付费',
    bar: '免费小说 · 无广告 · 无会员',
  },

  /* ---------- 7. 开源软件 + 开源书源 ---------- */
  {
    key: 'kaiyuan', out: '开源阅读+书源.png',
    c: '#2563EB', bg: 'linear-gradient(170deg,#EDF3FF 0%,#FFFFFF 45%,#EEFBFF 100%)',
    b1: '#BFDBFE', b2: '#A7F3D0', dot: '#BFDBFE', shadowc: 'rgba(37,99,235,.28)',
    icon: icon('kaiyuan'), heroIcon: icon('kaiyuan'),
    pill: '老牌开源阅读 · 附书源大礼包',
    title: '开源阅读 + 书源',
    subtitle: '老牌免费阅读器，书源直接送',
    sub2: '安卓装包即用 · 附十几份精选书源',
    features: [
      '知名开源阅读器，口碑一直很稳',
      '附十几份精选书源，开箱能读',
      '晋江 / 番茄 / 起点正版源都有',
      '自定义书源，想加哪站加哪站',
      '书架本地保存，不联网也翻书',
      '苹果端另附安装说明，照做就行',
    ],
    stats: [['十几份', '精选书源'], ['0 广告', '纯净阅读'], ['免费', '开源无内购']],
    tags: [{ text: '手机 安卓', primary: true }, { text: '手机 iOS' }, { text: '附赠书源大包' }],
    bottom: '开源免费的书源大礼包，导入就能看',
    bar: '开源阅读 · 书源附赠 · 永久免费',
  },

  /* ---------- 8. 星盒 ---------- */
  {
    key: 'xinghe', out: '星盒.png',
    c: '#7C3AED', bg: 'linear-gradient(170deg,#F3EEFF 0%,#FFFFFF 45%,#FFF0F6 100%)',
    b1: '#DDD6FE', b2: '#FBCFE8', dot: '#DDD6FE', shadowc: 'rgba(124,58,237,.28)',
    icon: icon('xinghe'), heroIcon: icon('xinghe'),
    pill: '全能工具箱 · 200+ 实用工具',
    title: '星盒',
    subtitle: '一个 App，娱乐工具全包',
    sub2: '小说 · 音乐 · 影视 · 动漫 · 壁纸都有',
    features: [
      '小说音乐影视动漫，想看就看',
      '200+ 实用工具，10 大分类随用',
      '短视频去水印解析，多平台通吃',
      '图集批量解析，一键去水印',
      '所有功能全免费，无会员无内购',
      '不用注册登录，打开就能直接用',
    ],
    stats: [['200+', '实用工具'], ['10 类', '功能分类'], ['0 元', '永久免费']],
    tags: [{ text: '手机 安卓', primary: true }, { text: '免费无广告' }, { text: '每周更新' }],
    bottom: '追剧听书找壁纸，一个工具箱全包',
    bar: '全能免费 · 无广告 · 无需登录',
  },

  /* ---------- 9. 知乎盐选文章提取 ---------- */
  {
    key: 'zhihu', out: '知乎盐选文章提取.png',
    c: '#0F6CBD', bg: 'linear-gradient(170deg,#EAF4FF 0%,#FFFFFF 45%,#F0F8FF 100%)',
    b1: '#BFDBFE', b2: '#BAE6FD', dot: '#BFDBFE', shadowc: 'rgba(15,108,189,.28)',
    icon: icon('zhihu'), heroIcon: icon('zhihu'),
    pill: '长截图转文字 · OCR 识别',
    title: '知乎盐选文章提取',
    subtitle: '长截图一键转成 TXT',
    sub2: '电脑端小工具 · 识别后直接编辑',
    features: [
      '长截图拖进去，自动识别成文字',
      '识别结果直接存成 TXT 可编辑',
      '整篇长文一次处理，不用分次截',
      '中英文混排都能认，字准不乱码',
      '本地处理，截图不上传不外传',
      '单文件免安装，双击就能用',
    ],
    stats: [['OCR', '文字识别'], ['TXT', '直接导出'], ['本地', '不上传']],
    tags: [{ text: '电脑 Windows', primary: true }, { text: '免安装' }, { text: '本地处理' }],
    bottom: '截图转文字，复制粘贴不再手敲',
    bar: '免费小工具 · 截图秒变可编辑文本',
  },

  /* ---------- 10. 600G 小说合集 ---------- */
  {
    key: 'novel600g', out: '600G小说合集.png',
    c: '#B45309', bg: 'linear-gradient(170deg,#FFF7E8 0%,#FFFFFF 45%,#FFF3E2 100%)',
    b1: '#FDE68A', b2: '#FED7AA', dot: '#FDE68A', shadowc: 'rgba(180,83,9,.26)',
    icon: icon('600g'), heroIcon: icon('600g'),
    pill: '一次打包 · 够看很久',
    title: '600G 小说合集',
    subtitle: '起点番茄热门，多为精校版',
    sub2: '6 万多本小说存进网盘，慢慢看',
    features: [
      '六万多本小说，一次打包带走',
      '起点番茄热门榜作品都在里面',
      '多为精校版，错字少看着舒服',
      '按书名分文件夹，检索不费劲',
      '配本地阅读器就能直接打开看',
      '网盘在线看，不用先下全量',
    ],
    stats: [['634G', '合集体量'], ['6 万+', '收录本数'], ['精校', '多数版本']],
    tags: [{ text: '网盘资源', primary: true }, { text: '起点番茄热门' }, { text: '精校版' }],
    bottom: '存进去慢慢看，一次备好几年书荒',
    bar: '免费分享 · 网盘在线读',
  },
];

(async () => {
  const only = process.argv[2];
  const list = only ? TOOLS.filter(t => t.key === only) : TOOLS;
  for (const t of list) {
    const out = path.join(OUT, t.out);
    const r = await cdpShot(html(t), out);
    const kb = (require('fs').statSync(out).size / 1024).toFixed(0);
    console.log(`${r.overflow > 0 ? '✗' : '✓'} ${t.out.padEnd(24)} ${kb}KB  溢出:${r.overflow}px`);
  }
})();
