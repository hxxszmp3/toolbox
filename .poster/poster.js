/* 宣传海报渲染管线 —— HTML/CSS 排版 + CDP 截图
 *
 * 尺寸 1080×1440（3:4），deviceScaleFactor=2 输出 2160×2880
 * 风格蓝本：异次元宣传海报（结构层级）+ 番茄小说下载器海报（无引导）
 * 硬性要求：全程不出现网址 / 二维码 / 下载按钮等引导元素
 */
const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/dellsq/Desktop/123/toolbox';
const ASSET = path.join(ROOT, '.poster/assets');
const OUT = path.join(ROOT, '.poster/out');
fs.mkdirSync(OUT, { recursive: true });

const W = 1080, H = 1440, SCALE = 2;

/* ---------- 素材路径 ---------- */
const E = 'E:/网盘推广/工具箱/小说区';
const SHOT = {
  md3: path.join(E, '阅读MD3重构版版（带精品书源）/软件截图/IMG_20261101_201545_825.jpg'),
  qimao1: path.join(E, '七猫小说下载器/软件截图/已加壳_be4b4d6079a16a3b37e88ba0b649f468_20260907223517.png'),
  qimao2: path.join(E, '七猫小说下载器/软件截图/已加壳_Screenshot_2026-09-07-22-32-24-22_6d54ea4f1017f840be4c2093221a2cc5_20260907223517.png'),
};

function dataUri(p) {
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';
  return 'data:' + mime + ';base64,' + fs.readFileSync(p).toString('base64');
}

/* ---------- 模板 ---------- */
function html(t) {
  const shots = (t.shots || []).map(s =>
    s.wide
      ? `<div class="shot wide"><img src="${s.src}"></div>`
      : `<div class="shot"><img src="${s.src}"></div>`
  ).join('');

  const feats = t.features.map(f => `
      <div class="feat"><span class="ck">✓</span><span class="ft">${f}</span></div>`).join('');

  const tags = t.tags.map(g => `<span class="tag ${g.primary ? 'p' : ''}">${g.text}</span>`).join('');

  const ns = (t.shots || []).length;
  const wide = (t.shots || []).some(s => s.wide);
  /* 单张宽图 → 高 428；两张竖图 → 高 386 免得溢出 */
  const shH = t.shH || (ns >= 2 ? 386 : 428);
  const vars = `--c:${t.c};--bg:${t.bg};--b1:${t.b1};--b2:${t.b2};--dot:${t.dot};--shadowc:${t.shadowc};--sh-h:${shH}px`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{
  font-family:"Microsoft YaHei","Noto Sans SC","PingFang SC",sans-serif;
  background:var(--bg);color:#12203a;position:relative;
  -webkit-font-smoothing:antialiased;
}
.deco{position:absolute;inset:0;overflow:hidden}
.deco .blob{position:absolute;border-radius:50%;filter:blur(2px);opacity:.5}
.dots{position:absolute;inset:0;
  background-image:radial-gradient(var(--dot) 2.2px,transparent 2.2px);
  background-size:26px 26px;opacity:.5}
.inner{position:relative;z-index:2;width:${W}px;height:${H}px;
  display:flex;flex-direction:column;align-items:center;padding:36px 54px 34px}

/* 图标 */
.icon{width:128px;height:128px;margin-bottom:14px;flex:none}
.icon img{width:100%;height:100%;display:block}

/* 顶部药丸 */
.pill-top{background:var(--c);color:#fff;font-size:26px;font-weight:700;
  padding:11px 28px;border-radius:40px;letter-spacing:.5px;
  box-shadow:0 8px 22px var(--shadowc);margin-bottom:16px;flex:none}

/* 主标题 */
h1{font-size:82px;line-height:1.05;font-weight:900;color:#0d1b31;
  text-align:center;letter-spacing:-1px;flex:none}
.subtitle{font-size:41px;font-weight:800;color:var(--c);text-align:center;
  margin-top:10px;letter-spacing:-.5px;flex:none}
.sub2{font-size:24px;font-weight:600;color:#7b8798;text-align:center;
  margin-top:8px;flex:none}

/* 截图区 */
.shots{display:flex;flex-direction:row;flex-wrap:nowrap;gap:20px;
  align-items:center;justify-content:center;
  margin:18px 0 26px;flex:none;height:var(--sh-h,428px)}
.shot{height:var(--sh-h,428px);width:250px;flex:none;
  display:flex;align-items:center;justify-content:center;
  background:#fff;border-radius:20px;padding:10px;
  box-shadow:0 10px 24px rgba(28,58,110,.14),0 0 0 2px var(--c)}
.shot img{max-height:calc(var(--sh-h,428px) - 22px);max-width:100%;
  object-fit:contain;display:block;border-radius:12px}
.shot.wide{width:auto;flex:1 1 0;min-width:0;padding:12px}
.shot.wide img{max-height:calc(var(--sh-h,428px) - 26px);width:100%;object-fit:contain}

/* 无截图时的大图标区 */
.heroicon{width:290px;height:290px;flex:none;
  display:flex;align-items:center;justify-content:center}
.heroicon img{width:100%;height:100%;object-fit:contain}
.heroicon img{width:100%;height:100%}

/* 功能点卡片 */
.features{width:100%;background:#fff;border-radius:26px;padding:26px 30px;
  display:grid;grid-template-columns:1fr 1fr;gap:18px 26px;
  box-shadow:0 10px 28px rgba(28,58,110,.09);flex:none}
.feat{display:flex;align-items:flex-start;gap:10px}
.ck{width:29px;height:29px;border-radius:50%;background:var(--c);color:#fff;
  font-size:17px;font-weight:900;display:flex;align-items:center;
  justify-content:center;flex:none;margin-top:2px}
.ft{font-size:24px;font-weight:700;color:#1c2b45;line-height:1.32}

/* 数据条：纯信息展示，非引导 */
.stats{width:100%;display:grid;grid-template-columns:repeat(3,1fr);
  gap:16px;margin-top:18px;flex:none}
.stat{background:#fff;border-radius:18px;padding:19px 10px;text-align:center;
  box-shadow:0 6px 18px rgba(28,58,110,.07)}
.stat .n{font-size:37px;font-weight:900;color:var(--c);line-height:1.1}
.stat .l{font-size:20px;font-weight:700;color:#7b8798;margin-top:5px}

/* 标签行 */
.tags{display:flex;gap:13px;justify-content:center;flex-wrap:wrap;
  margin-top:20px;flex:none}
.tag{background:#fff;border:2px solid var(--c);color:var(--c);
  font-size:23px;font-weight:800;padding:9px 22px;border-radius:40px}
.tag.p{background:var(--c);color:#fff}

/* 底部卖点 */
.bottom{margin-top:auto;text-align:center;flex:none;padding-top:22px}
.bottom .line{font-size:29px;font-weight:800;color:#1c2b45;letter-spacing:-.3px}
.bottom .bar{display:inline-block;margin-top:14px;background:var(--c);color:#fff;
  font-size:23px;font-weight:800;padding:11px 32px;border-radius:40px;
  box-shadow:0 8px 20px var(--shadowc)}
  </style></head><body style="${vars}">
  <div class="deco">
    <div class="dots"></div>
    <div class="blob" style="width:520px;height:520px;background:var(--b1);top:-170px;right:-150px"></div>
    <div class="blob" style="width:420px;height:420px;background:var(--b2);bottom:-140px;left:-130px"></div>
  </div>
  <div class="inner">
    ${t.heroIcon && !t.shots ? '' : `<div class="icon"><img src="${t.icon}"></div>`}
    <div class="pill-top">${t.pill}</div>
    <h1>${t.title}</h1>
    <div class="subtitle">${t.subtitle}</div>
    ${t.sub2 ? `<div class="sub2">${t.sub2}</div>` : ''}
    ${shots ? `<div class="shots">${shots}</div>`
            : (t.heroIcon ? `<div class="shots"><div class="heroicon"><img src="${t.heroIcon}"></div></div>` : '')}
    <div class="features">${feats}</div>
    ${t.stats ? `<div class="stats">${t.stats.map(x =>
      `<div class="stat"><div class="n">${x[0]}</div><div class="l">${x[1]}</div></div>`).join('')}</div>` : ''}
    <div class="tags">${tags}</div>
    <div class="bottom">
      <div class="line">${t.bottom}</div>
      <div class="bar">${t.bar}</div>
    </div>
  </div>
</body></html>`;
}

/* ---------- 渲染 ---------- */
async function cdpShotAuto(t, outPath) {
  /* 内容略超画布时，自动压缩截图区高度重试（最多 4 次，每次 -14px） */
  let shH = t.shH || (t.shots && t.shots.length >= 2 ? 386 : 428);
  for (let i = 0; i < 4; i++) {
    const r = await cdpShot(html({ ...t, shH }), outPath);
    if (r.overflow <= 0) return r;
    shH -= 14;
    if (shH < 250) break;
  }
  return await cdpShot(html({ ...t, shH }), outPath);
}

/* 找一个真正空闲的端口（随机撞端口会撞上残留的 Chrome 实例） */
function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', () => {
      /* 被占用就再试一个 */
      freePort().then(resolve, reject);
    });
    srv.listen(0, '127.0.0.1', () => {
      const p = srv.address().port;
      srv.close(() => resolve(p));
    });
  });
}

async function cdpShot(htmlText, outPath) {
  const port = await freePort();
  return new Promise((resolve, reject) => {
    const exe = 'C:/Users/dellsq/AppData/Local/ms-playwright/chromium-1169/chrome-win/chrome.exe';
    const profile = path.join(require('os').tmpdir(), 'poster_chrome_' + port);
    fs.mkdirSync(profile, { recursive: true });
    const proc = spawn(exe, ['--remote-debugging-port=' + port, '--disable-gpu', '--no-sandbox',
      '--headless=new', '--hide-scrollbars', '--font-render-hinting=none',
      '--user-data-dir=' + profile,
      `--window-size=${W},${H}`, 'about:blank'], { stdio: 'ignore' });
    const get = u => new Promise((res, rej) => {
      http.get(u, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej);
    });
    setTimeout(async () => {
      try {
        const tabs = await get('http://127.0.0.1:' + port + '/json/list');
        const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
        let id = 0; const w = {};
        ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && w[m.id]) { w[m.id](m); delete w[m.id]; } });
        await new Promise(r => ws.addEventListener('open', r));
        const send = (m, p = {}) => new Promise(res => { const i = ++id; w[i] = res; ws.send(JSON.stringify({ id: i, method: m, params: p })); });
        await send('Page.enable');
        await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: SCALE, mobile: false });
        const tmpHtml = path.join(require('os').tmpdir(), 'poster_' + Date.now() + '.html');
        fs.writeFileSync(tmpHtml, htmlText, 'utf8');
        await send('Page.navigate', { url: 'file:///' + tmpHtml.replace(/\\/g, '/') });
        await new Promise(r => setTimeout(r, 2200));
        try { fs.unlinkSync(tmpHtml); } catch (e) {}
        // 溢出检测：内容高度是否超过画布
        const ov = await send('Runtime.evaluate', { expression: `(()=>{
          const inner=document.querySelector('.inner');
          const kids=[...inner.children];
          const last=kids[kids.length-1].getBoundingClientRect();
          const first=kids[0].getBoundingClientRect();
          return {over:Math.round(last.bottom - ${H}), top:Math.round(first.top),
                  scrollH:inner.scrollHeight, clientH:inner.clientHeight};
        })()`, returnByValue: true });
        const o = ov.result && ov.result.result ? ov.result.result.value : {};
        if (o.over > 0) console.log('  ⚠ 内容超出画布 ' + o.over + 'px');
        const vp = await send('Runtime.evaluate', { expression: 'window.innerWidth+"x"+window.innerHeight+"@"+devicePixelRatio', returnByValue: true });
        const v = vp.result && vp.result.result ? String(vp.result.result.value) : '';
        let shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        /* 视口被改过（内容会平铺）→ 复位后重截 */
        if (!v.startsWith('1080x1440@2')) {
          await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: SCALE, mobile: false });
          await new Promise(r => setTimeout(r, 900));
          shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        }
        fs.writeFileSync(outPath, Buffer.from(shot.result.data, 'base64'));
        proc.kill(); resolve({ out: outPath, overflow: o.over || 0, vp: v });
      } catch (e) { proc.kill(); reject(e); }
    }, 2500);
  });
}

module.exports = { html, cdpShot, cdpShotAuto, dataUri, SHOT, ASSET, OUT, W, H, SCALE };
