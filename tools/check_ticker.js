/* 无头 Chromium 实测：确认横向滚动动画真的在跑、位移是否生效。
   用法：node tools/check_ticker.js <页面url> */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8975;
const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.ico':'image/x-icon', '.svg':'image/svg+xml', '.webmanifest':'application/json' };

const server = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)){ r.writeHead(404); return r.end('nf'); }
  r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
});

server.listen(PORT, async () => {
  const { spawn } = require('child_process');
  const exe = 'C:/Users/dellsq/AppData/Local/ms-playwright/chromium_headless_shell-1169/chrome-win/headless_shell.exe';
  const proc = spawn(exe, [
    '--remote-debugging-port=9333',
    '--disable-gpu', '--no-sandbox', '--headless=new',
    '--window-size=1280,900',
    'about:blank'
  ], { stdio: 'ignore' });

  const get = url => new Promise((res, rej) => {
    http.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej);
  });

  await new Promise(r => setTimeout(r, 2500));
  try {
    const tabs = await get('http://127.0.0.1:9333/json/list');
    const ws = tabs.find(t => t.type === 'page').webSocketDebuggerUrl;

    /* 极简 CDP 客户端（Node 22 原生 WebSocket，无需装 ws） */
    const ws2 = new WebSocket(ws);
    const onMsg = fn => ws2.addEventListener('message', e => fn(JSON.parse(e.data)));
    const onOpen = fn => ws2.addEventListener('open', fn);
    let id = 0;
    const waiters = {};
    onMsg(msg => {
      if (msg.id && waiters[msg.id]){ waiters[msg.id](msg); delete waiters[msg.id]; }
    });
    const send = (method, params = {}) => new Promise(res => {
      const i = ++id; waiters[i] = res;
      ws2.send(JSON.stringify({ id: i, method, params }));
    });
    const evalJS = async expr => {
      const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      return r.result && r.result.result ? r.result.result.value : null;
    };

    await new Promise(r => onOpen(r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    await new Promise(r => setTimeout(r, 2500));

    /* 把当天的更新记录在页面里直接改长，确保触发滚动分支。
       用 DOM 直接改 data.js 已不生效（renderTicker 会重绘），
       所以改为临时改窄视口 + 换超长标题，两种做法都试一遍。 */
    await send('Emulation.setDeviceMetricsOverride', {
      width: 520, height: 800, deviceScaleFactor: 1, mobile: true
    });
    await send('Page.reload', {});
    await new Promise(r => setTimeout(r, 1800));

    /* 第一次 renderTicker 已在页面加载时跑过；这里改完数据后只调一次，
       若反复调用会让 tickerTimer 被覆盖、旧链失联，测出来的时序就不准了 */
    const changed = await evalJS(`(() => {
      try {
        if (typeof UPDATES !== 'undefined' && UPDATES[0]) {
          UPDATES[0].title = '这是一条刻意写得非常非常长的测试标题用来验证横向滚动动画是否真的会运行以及位移是否生效一二三四五六七八九十甲乙丙丁';
        }
        renderTicker();
        const t = document.querySelector('.ticker-item .tk-scroll');
        return t ? t.textContent.slice(0, 20) + '|len=' + t.textContent.length : 'none';
      } catch (e) { return 'ERR:' + e.message; }
    })()`);
    console.log('注入后的标题:', changed);
    await new Promise(r => setTimeout(r, 900));

    const probe = `(() => {
      const box = document.querySelector('.ticker-item .tk-text');
      const run = document.querySelector('.ticker-item .tk-scroll');
      if (!box || !run) return { err: '元素未找到' };
      const cs = getComputedStyle(run);
      const boxW = box.getBoundingClientRect().width;
      const runW = run.getBoundingClientRect().width;
      return {
        boxW: Math.round(boxW),
        runW: Math.round(runW),
        over: Math.round(runW - boxW),
        cls: run.className,
        dist: cs.getPropertyValue('--tk-scroll-dist').trim(),
        animName: cs.animationName,
        animDur: cs.animationDuration,
        transform: cs.transform
      };
    })()`;

    const a = await evalJS(probe);
    console.log('【动画开始时】');
    console.log(JSON.stringify(a, null, 2));

    await new Promise(r => setTimeout(r, 1400));
    const b = await evalJS(probe);
    console.log('\n【1.4 秒后】');
    console.log(JSON.stringify(b, null, 2));

    console.log('\n=== 判定 ===');
    if (!a || a.err) console.log('✗ 元素未找到');
    else if (a.over <= 1) console.log('· 未溢出（boxW=' + a.boxW + ' >= runW=' + a.runW + '），走静态分支，不滚动');
    else if (a.animName === 'tkRoll' && b.transform !== a.transform) console.log('✓ 横向滚动生效：transform 已从 ' + a.transform + ' 变为 ' + b.transform);
    else console.log('✗ 未滚动：animName=' + a.animName + ' transform=' + a.transform + ' → ' + b.transform);

    /* 时序验证：连续采样 22 秒，记录 track 位移变化点，
       检查每次翻页的间隔是否 ≥ 本条的「滚动时长 + 尾停」 */
    console.log('\n=== 时序采样（22 秒）===');
    const samples = [];
    const t0 = Date.now();
    for (let i = 0; i < 44; i++){
      const s = await evalJS(`(() => {
        const tr = document.getElementById('tickerTrack');
        const run = document.querySelector('.ticker-item.rolling .tk-scroll') || document.querySelector('.ticker-item .tk-scroll');
        return {
          y: (tr.style.transform || ''),
          cls: run ? run.className : '',
          dur: run ? getComputedStyle(run).animationDuration : '0s'
        };
      })()`);
      samples.push({ t: Date.now() - t0, y: s.y, rolling: s.cls.includes('rolling'), dur: s.dur });
      await new Promise(r => setTimeout(r, 500));
    }
    let prev = null;
    samples.forEach(s => {
      if (s.y !== prev){ console.log('  ' + (s.t / 1000).toFixed(1) + 's  ' + (s.y || '(none)') + '  rolling=' + s.rolling + ' dur=' + s.dur); prev = s.y; }
    });

    /* 检查纵向翻页计时 */
    const t = await evalJS(`document.getElementById('tickerTrack').style.transform || '(未设置)'`);
    console.log('track 纵向位移:', t);

    ws2.close();
  } catch (e) {
    console.log('失败:', e.message);
  }
  proc.kill();
  server.close();
  process.exit(0);
});