#!/usr/bin/env node
/*
 * 工具更新检测脚本
 * ------------------------------------------------------------
 * 读取 scripts/watchlist.json，逐个查询 GitHub 仓库的最新 release，
 * 与 scripts/sync-state.json 里记录的上次版本比对，输出「有更新」清单。
 *
 * 用法：
 *   node scripts/sync-check.js            # 人类可读报告
 *   node scripts/sync-check.js --json     # 输出 JSON（供自动化消费）
 *   node scripts/sync-check.js --init     # 记录当前版本为基线，不报告差异
 *
 * 说明：
 *   - 首次运行（无 state 文件）会自动建立基线，不会把所有工具报成"有更新"。
 *   - token 来源：环境变量 GITHUB_TOKEN，或从 git remote origin 的 URL 中提取。
 *     未授权时 GitHub 限额为 60 次/小时，本清单条目少，通常够用。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const WATCH_FILE = path.join(__dirname, 'watchlist.json');
const STATE_FILE = path.join(__dirname, 'sync-state.json');

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const initMode = argv.includes('--init');

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const url = execSync('git remote get-url origin', {
      cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore']
    }).toString().trim();
    const m = url.match(/https:\/\/[^:]+:([^@]+)@/);
    return m ? m[1] : '';
  } catch (e) {
    return '';
  }
}

async function latestRelease(repo, token) {
  const headers = {
    'User-Agent': 'ldgj-sync-check',
    'Accept': 'application/vnd.github+json'
  };
  if (token) headers.Authorization = 'token ' + token;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers });
    if (res.status === 404) return { ok: false, error: '仓库或 release 不存在 (404)' };
    if (res.status === 403) return { ok: false, error: '接口限流 (403)，稍后重试或更换 token' };
    if (!res.ok) return { ok: false, error: 'HTTP ' + res.status };
    const j = await res.json();
    return {
      ok: true,
      tag: j.tag_name,
      title: j.name || '',
      url: j.html_url,
      published: (j.published_at || '').slice(0, 10),
      assets: (j.assets || []).map(a => a.name)
    };
  } catch (e) {
    return { ok: false, error: '请求失败：' + e.message };
  }
}

(async () => {
  if (!fs.existsSync(WATCH_FILE)) {
    console.error('找不到 watchlist.json：' + WATCH_FILE);
    process.exit(1);
  }
  const watch = JSON.parse(fs.readFileSync(WATCH_FILE, 'utf8'));
  const targets = (watch.tools || []).filter(t => t.type === 'github' && t.repo);

  let state = {};
  const freshState = !fs.existsSync(STATE_FILE);
  if (!freshState) {
    try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch (e) { state = {}; }
  }

  const token = getToken();
  const updated = [];
  const baseline = [];
  const errors = [];

  for (const t of targets) {
    const r = await latestRelease(t.repo, token);
    if (!r.ok) {
      errors.push({ name: t.name, repo: t.repo, error: r.error });
      continue;
    }
    const prev = state[t.repo];
    if (freshState || initMode || !prev) {
      baseline.push({ name: t.name, repo: t.repo, tag: r.tag, published: r.published });
    } else if (prev !== r.tag) {
      updated.push({
        name: t.name,
        section: t.section,
        repo: t.repo,
        from: prev,
        to: r.tag,
        published: r.published,
        url: r.url,
        assetHint: t.assetHint || '',
        quark: t.quark || '',
        baidu: t.baidu || ''
      });
    }
    state[t.repo] = r.tag;
  }

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');

  const report = {
    checked: targets.length,
    updated,
    baseline,
    errors,
    time: new Date().toISOString()
  };

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log('工具更新检测报告  ' + new Date().toLocaleString('zh-CN'));
  console.log('共检测 ' + targets.length + ' 个 GitHub 来源\n');

  if (baseline.length) {
    console.log('【已建立基线】' + baseline.length + ' 个（记录当前版本，下次起才会报更新）');
    baseline.forEach(b => console.log('  · ' + b.name + '  ' + b.tag));
    console.log('');
  }

  if (!updated.length) {
    console.log('✅ 没有发现新版本');
  } else {
    console.log('🔔 发现 ' + updated.length + ' 个工具更新：\n');
    updated.forEach(u => {
      console.log('  ● ' + u.name + '  [' + u.section + ']');
      console.log('    ' + u.from + '  →  ' + u.to + '   (' + u.published + ')');
      if (u.assetHint) console.log('    下载：' + u.assetHint);
      if (u.quark) console.log('    夸克：' + u.quark);
      if (u.baidu) console.log('    百度：' + u.baidu + '  ← 需手动更新');
      console.log('');
    });
  }

  if (errors.length) {
    console.log('⚠️  ' + errors.length + ' 个条目检测失败：');
    errors.forEach(e => console.log('  · ' + e.name + ' (' + e.repo + ')：' + e.error));
  }
})();
