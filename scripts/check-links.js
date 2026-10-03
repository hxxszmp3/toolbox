#!/usr/bin/env node
/* 链接巡检：从 data.js 提取所有 URL 并检测可达性
 * 用法：node scripts/check-links.js
 * 分级：❌ 失效（超时/连接失败/5xx/404）  ⚠ 需人工确认（403/429，多为网盘反爬）  ✔ 正常
 */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const dataPath = path.join(__dirname, '..', 'data.js');
const src = fs.readFileSync(dataPath, 'utf8');
const urls = [...new Set((src.match(/https?:\/\/[^\s'"\\)\]]+/g) || []))];

if (!urls.length) { console.log('data.js 中没有找到链接'); process.exit(0); }
console.log(`共 ${urls.length} 个链接，开始检测…\n`);

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const TIMEOUT = 15000;
const CONCURRENCY = 5;

function check(url) {
  return new Promise(resolve => {
    const mod = url.startsWith('https') ? https : http;
    let settled = false;
    const finish = r => { if (!settled) { settled = true; resolve(r); } };
    const req = mod.request(url, {
      method: 'HEAD',
      timeout: TIMEOUT,
      headers: { 'User-Agent': UA, 'Accept': '*/*' },
    }, res => {
      res.resume();
      finish({ url, status: res.statusCode });
    });
    req.on('timeout', () => { req.destroy(); finish({ url, status: 0, err: 'timeout' }); });
    req.on('error', e => finish({ url, status: 0, err: e.message }));
    req.end();
  });
}

function grade(status) {
  if (status >= 200 && status < 400) return 'ok';
  if (status === 403 || status === 429) return 'warn';
  return 'fail'; // 404 / 5xx / 0(超时或连接失败)
}

async function run() {
  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    results.push(...await Promise.all(batch.map(check)));
    process.stdout.write(`  进度 ${Math.min(i + CONCURRENCY, urls.length)}/${urls.length}\r`);
  }
  console.log('\n');

  const bad = [], warn = [];
  for (const r of results) {
    const g = grade(r.status);
    const line = `${r.url}  (HTTP ${r.status || (r.err || '无响应')})`;
    if (g === 'fail') { bad.push(line); console.log('❌ 失效      ' + line); }
    else if (g === 'warn') { warn.push(line); console.log('⚠  需人工确认 ' + line); }
  }

  console.log(`\n汇总：正常 ${results.length - bad.length - warn.length} / 需人工确认 ${warn.length} / 失效 ${bad.length}`);
  if (bad.length) {
    console.log('\n以下链接确认失效，请在 data.js 中更换：');
    bad.forEach(l => console.log('  - ' + l));
    process.exit(1);
  }
  console.log('没有确认失效的链接。');
}

run().catch(e => { console.error(e); process.exit(1); });
