/* 无头 Chromium 验证卡片下载按钮：网盘图标 + 提示小字是否正确渲染。
   用法：node tools/check_btns.js */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8977;
const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.ico':'image/x-icon', '.ico':'image/ico+xml', '.webmanifest':'application/json' };

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
  const proc = spawn(exe, ['--remote-debugging-port=9335','--disable-gpu','--no-sandbox','--headless=new','--window-size=1280,1000','about:blank'], { stdio:'ignore' });
  const get = url => new Promise((res, rej) => { http.get(url, r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d))); }).on('error', rej); });

  await new Promise(r => setTimeout(r, 2500));
  try {
    const tabs = await get('http://127.0.0.1:9335/json/list');
    const ws2 = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
    let id = 0; const waiters = {};
    ws2.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && waiters[m.id]){ waiters[m.id](m); delete waiters[m.id]; } });
    const send = (method, params={}) => new Promise(res => { const i = ++id; waiters[i] = res; ws2.send(JSON.stringify({id:i, method, params})); });
    const evalJS = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue:true, awaitPromise:true }); return r.result && r.result.result ? r.result.result.value : null; };
    await new Promise(r => ws2.addEventListener('open', r));
    await send('Page.enable'); await send('Runtime.enable');
    await send('Page.navigate', { url:`http://127.0.0.1:${PORT}/index.html` });
    await new Promise(r => setTimeout(r, 2500));

    const probe = `(() => {
      const card = [...document.querySelectorAll('.tool')].find(c => c.querySelector('.dl-quark') && c.querySelector('.dl-baidu'));
      if (!card) return { err:'未找到同时有夸克+百度的卡片' };
      const qb = card.querySelector('.dl-quark'), bb = card.querySelector('.dl-baidu');
      const tips = card.querySelector('.tool-tips');
      const icoQ = qb.querySelector('img'), icoB = bb.querySelector('img');
      const rq = icoQ ? icoQ.getBoundingClientRect() : null;
      return {
        toolName: card.dataset.tool,
        quarkText: qb.textContent.trim(),
        quarkHasIco: !!icoQ,
        quarkLoaded: icoQ ? icoQ.naturalWidth > 0 : false,
        quarkNatural: icoQ ? icoQ.naturalWidth + 'x' + icoQ.naturalHeight : 'n/a',
        quarkIsB64: icoQ ? icoQ.src.slice(0,22) : 'n/a',
        quarkIcoH: rq ? Math.round(rq.height) : 0,
        baiduText: bb.textContent.trim(),
        baiduHasIco: !!icoB,
        tipsText: tips ? tips.textContent.trim() : null,
        tipsSize: tips ? getComputedStyle(tips).fontSize : null,
        tipsColor: tips ? getComputedStyle(tips).color : null,
        btnH: Math.round(qb.getBoundingClientRect().height)
      };
    })()`;

    const r = await evalJS(probe);
    console.log('=== 首个带夸克+百度的卡片 ===');
    console.log(JSON.stringify(r, null, 2));

    /* 统计整体覆盖率 */
    const stat = await evalJS(`(() => {
      const cards=[...document.querySelectorAll('.tool')];
      const withQ=cards.filter(c=>c.querySelector('.dl-quark'));
      return {
        total: cards.length,
        withQuark: withQ.length,
        quarkWithIco: withQ.filter(c=>c.querySelector('img')).length,
        quarkWithTips: withQ.filter(c=>c.querySelector('.tool-tips')).length,
        baiduWithIco: cards.filter(c=>c.querySelector('img')).length,
        webOnly: cards.filter(c=>c.querySelector('.web-link')).length,
        cmdOnly: cards.filter(c=>c.querySelector('.cmd-wrap')).length
      };
    })()`);
    console.log('\n=== 本页覆盖统计 ===');
    console.log(JSON.stringify(stat, null, 2));

    console.log('\n=== 判定 ===');
    const ok = r && !r.err && r.quarkHasIco && r.baiduHasIco && r.tipsText;
    console.log(ok ? '✓ 图标与提示均已渲染' : '✗ 存在问题');

    /* 截一张卡片区域的图，用肉眼确认排版与图标观感 */
    const box = await evalJS(`(() => {
      const c=[...document.querySelectorAll('.tool')].find(x=>x.querySelector('.dl-baidu'));
      if(!c) return null;
      const b=c.getBoundingClientRect();
      return { x: Math.round(b.x)-8, y: Math.round(b.y)-8, width: Math.round(b.width)+16, height: Math.round(b.height)+16 };
    })()`);
    if (box){
      const shot = await send('Page.captureScreenshot', {
        format:'png',
        clip:{ x:box.x, y:box.y, width:box.width, height:box.height, scale:2 }
      });
      if (shot.result && shot.result.data){
        fs.writeFileSync(path.join(__dirname, '..', 'btn_preview.png'), Buffer.from(shot.result.data, 'base64'));
        console.log('已保存 btn_preview.png');
      }
    }

    /* 截亮色 + 暗色两张，用肉眼确认 logo 清晰度与按钮配色 */
    for (const [scheme, tag] of [['light','light'], ['dark','dark']]){
      await send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-color-scheme', value: scheme }] });
      await new Promise(r => setTimeout(r, 400));
      const box = await evalJS(`(() => {
        const c=[...document.querySelectorAll('.tool')].find(x=>x.querySelector('.dl-baidu'));
        if(!c) return null;
        const b=c.getBoundingClientRect();
        return { x: Math.round(b.x)-8, y: Math.round(b.y)-8, width: Math.round(b.width)+16, height: Math.round(b.height)+16 };
      })()`);
      if (box){
        const shot = await send('Page.captureScreenshot', {
          format:'png', clip:{ x:box.x, y:box.y, width:box.width, height:box.height, scale:2 }
        });
        if (shot.result && shot.result.data){
          fs.writeFileSync(path.join(__dirname,'..','btn_'+tag+'.png'), Buffer.from(shot.result.data,'base64'));
          console.log('已保存 btn_'+tag+'.png');
        }
      }
    }

    ws2.close();
  } catch (e) { console.log('失败:', e.message); }
  proc.kill(); server.close(); process.exit(0);
});