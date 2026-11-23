/* 无头 Chromium 实测：量测资料区各卡片 .tool-dl 行的 y 坐标，检查跨卡片对齐 */
const http = require('http');
const { spawn } = require('child_process');

const PORT = 8976;
const server = http.createServer((q, r) => {
  let f = require('path').join('C:/Users/dellsq/Desktop/123/toolbox', decodeURIComponent(q.url.split('?')[0]));
  if (require('fs').existsSync(f) && require('fs').statSync(f).isDirectory()) f = require('path').join(f, 'index.html');
  if (!require('fs').existsSync(f)) { r.writeHead(404); return r.end('nf'); }
  r.writeHead(200, { 'Content-Type': { '.html':'text/html; charset=utf-8', '.js':'text/javascript' }[require('path').extname(f)] || 'application/octet-stream' });
  require('fs').createReadStream(f).pipe(r);
});

server.listen(PORT, async () => {
  const exe = 'C:/Users/dellsq/AppData/Local/ms-playwright/chromium_headless_shell-1169/chrome-win/headless_shell.exe';
  const proc = spawn(exe, ['--remote-debugging-port=9334','--disable-gpu','--no-sandbox','--headless=new','--window-size=1280,900','about:blank'], { stdio: 'ignore' });
  const get = url => new Promise((res, rej) => http.get(url, r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }).on('error', rej));
  await new Promise(r => setTimeout(r, 2500));
  const tabs = await get('http://127.0.0.1:9334/json/list');
  const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => setTimeout(r, 1000));
  let id = 0; const waiters = {};
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && waiters[m.id]) { waiters[m.id](m); delete waiters[m.id]; } });
  const send = (method, params = {}) => new Promise(res => { const i = ++id; waiters[i] = res; ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJS = async expr => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return r.result.result.value;
  };
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/index.html' });
  await new Promise(r => setTimeout(r, 3000));
  // 切到资料专区
  await evalJS(`[...document.querySelectorAll('.tab')].find(t=>t.textContent.includes('资料专区')).click()`);
  await new Promise(r => setTimeout(r, 800));
  const out = await evalJS(`(() => {
    const cards = [...document.querySelectorAll('.grid .tool')];
    return JSON.stringify(cards.slice(0, 3).map(c => {
      const name = c.querySelector('.tool-name').textContent.trim();
      const kids = [...c.children].map(k => {
        const r = k.getBoundingClientRect();
        return (k.className||k.tagName).toString().slice(0,30) + ':' + Math.round(r.top) + '-' + Math.round(r.bottom) + ' h' + Math.round(r.height) + ' mt' + getComputedStyle(k).marginTop;
      });
      return { name, cardTop: Math.round(c.getBoundingClientRect().top), cardBottom: Math.round(c.getBoundingClientRect().bottom), kids };
    }));
  })()`);
  console.log(out);
  proc.kill(); server.close(); process.exit(0);
});
