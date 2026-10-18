#!/usr/bin/env node
/*
 * 工具版本检测脚本
 * ------------------------------------------------------------
 * 读取 scripts/watchlist.json，逐条检查版本，与 scripts/sync-state.json
 * 记录的上次版本比对，输出「有更新」清单。
 *
 * 支持三种来源：
 *   type=github → 查 GitHub 最新 release tag（api.github.com）
 *   type=site   → 抓取网页，按 versionPattern 正则提取版本号
 *   type=manual → 无公开接口（如 QQ 群文件），不检测，只在汇总里列出
 *
 * 用法：
 *   node scripts/sync-check.js            # 人类可读报告
 *   node scripts/sync-check.js --json     # 输出 JSON（供自动化消费）
 *   node scripts/sync-check.js --init     # 记录当前版本为基线，不报告差异
 *
 * 说明：
 *   - 首次运行（无 state 文件）会自动建立基线，不会把所有工具报成"有更新"。
 *   - state 的 key：github 用 repo，site/manual 用 "site:<name>"。
 *     每次运行按当前 watchlist 重建 state，已从 watchlist 删除的条目会自动清除。
 *   - token 来源：环境变量 GITHUB_TOKEN，或从 git remote origin 的 URL 中提取。
 *     未授权时 GitHub 限额为 60 次/小时；本清单 github 条目 <20，通常够用。
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

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const SITE_TIMEOUT = 20000;

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

/* ---------------- GitHub 来源 ---------------- */

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

/* ---------------- 网页来源 ---------------- */

/** 默认的版本号正则（按 t.pattern 指定的模式取用） */
const PATTERNS = {
  // 三段及以上：1.2.3 / 1.2.3.4 —— 最稳，噪声最少
  strict: '[0-9]+\\.[0-9]+\\.[0-9]+(?:\\.[0-9]+)*',
  // 两段及以上的宽松模式，噪声多，仅在没有三段号时兜底
  loose: '[0-9]+\\.[0-9]+(?:\\.[0-9]+)*',
};

/**
 * 从 HTML 里提取版本号，按以下优先级依次尝试：
 *   1. 站点自定义版本锚点锚定的版本号（像 PixPin 下载页的 data-version="…"）
 *   2. 恰好只有一个不同的三段版本号 → 直接采用
 *   3. 多个三段版本号 → 取数值最大者（通常就是最新版）
 *   4. 退化为两段宽松模式：取出现次数最多的（同频次取最大）
 * 命中即返回；全部为空则返回失败。
 */
function extractVersion(html, t) {
  // 1) 自定义锚点 —— 在「原始 HTML」上匹配（属性/JSON 里也可能带版本号）
  if (t.anchor) {
    try {
      const am = String(html).match(new RegExp(t.anchor, 'i'));
      if (am) {
        const v = (am[1] || am[0] || '').trim();
        if (/[0-9]/.test(v)) return { ok: true, tag: v, how: 'anchor' };
      }
    } catch (e) {
      return { ok: false, error: 'anchor 不是合法正则：' + e.message };
    }
  }

  // 后续在「去噪文本」上匹配
  const clean = stripNoise(html);

  // 2)/3) 三段版本号
  const strictHits = matchAll(clean, t.versionPattern || PATTERNS.strict);
  if (strictHits.length) {
    const uniq = [...new Set(strictHits)];
    if (uniq.length === 1) return { ok: true, tag: uniq[0], how: 'strict-unique' };
    const best = uniq.sort((a, b) => compareVer(b, a))[0];
    return { ok: true, tag: best, how: 'strict-max' };
  }

  // 4) 两段兜底
  const looseHits = matchAll(clean, PATTERNS.loose);
  if (looseHits.length) {
    const freq = new Map();
    for (const h of looseHits) freq.set(h, (freq.get(h) || 0) + 1);
    const ranked = [...freq.entries()].sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return compareVer(b[0], a[0]);
    });
    return { ok: true, tag: ranked[0][0], how: 'loose' };
  }

  return { ok: false, error: '页面里没匹配到版本号' };
}

/** 去掉 script/style/注释等噪声，避免把内联数字/时间戳误当版本号 */
function stripNoise(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ');   // 去掉标签本身，只留可见文本
}

function matchAll(text, pattern) {
  const re = new RegExp(pattern, 'g');
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push(m[0]);
    if (out.length > 400) break;
  }
  return out;
}

function nums(v) {
  return String(v).split(/[.\-_]/).map(s => parseInt(s, 10)).filter(n => !isNaN(n));
}

/** 版本号比较：a>b 返回 1，a<b 返回 -1，相等 0 */
function compareVer(a, b) {
  const A = nums(a), B = nums(b);
  const len = Math.max(A.length, B.length);
  for (let i = 0; i < len; i++) {
    const x = A[i] || 0, y = B[i] || 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

async function siteVersion(t) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), SITE_TIMEOUT);
  try {
    const res = await fetch(t.url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      redirect: 'follow',
      signal: ctrl.signal
    });
    if (!res.ok) return { ok: false, error: 'HTTP ' + res.status };
    const html = await res.text();
    const r = extractVersion(html, t);
    if (r.ok) r.bytes = html.length;   // 便于判断是否被盾页拦截
    return r;
  } catch (e) {
    const msg = e.name === 'AbortError' ? `超时（>${SITE_TIMEOUT / 1000}s）` : e.message;
    return { ok: false, error: '请求失败：' + msg };
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------- 主流程 ---------------- */

function stateKey(t) {
  if (t.type === 'github') return t.repo;
  return 'site:' + t.name;
}

(async () => {
  if (!fs.existsSync(WATCH_FILE)) {
    console.error('找不到 watchlist.json：' + WATCH_FILE);
    process.exit(1);
  }
  const watch = JSON.parse(fs.readFileSync(WATCH_FILE, 'utf8'));
  const all = watch.tools || [];
  const targets = all.filter(t => (t.type === 'github' && t.repo) || (t.type === 'site' && t.url));
  const manualList = all.filter(t => t.type === 'manual');

  let state = {};
  const freshState = !fs.existsSync(STATE_FILE);
  if (!freshState) {
    try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch (e) { state = {}; }
  }

  const token = getToken();
  const updated = [];
  const baseline = [];
  const errors = [];
  const nextState = {};

  for (const t of targets) {
    const key = stateKey(t);
    const r = t.type === 'github'
      ? await latestRelease(t.repo, token)
      : await siteVersion(t);

    if (!r.ok) {
      errors.push({ name: t.name, section: t.section, source: key, error: r.error });
      // 查不到就保留旧值，避免下次误报
      if (state[key]) nextState[key] = state[key];
      continue;
    }

    const prev = state[key];
    if (freshState || initMode || !prev) {
      baseline.push({ name: t.name, source: key, tag: r.tag });
    } else if (prev !== r.tag) {
      updated.push({
        name: t.name,
        section: t.section,
        type: t.type,
        source: key,
        from: prev,
        to: r.tag,
        published: r.published || '',
        url: r.url || t.url || '',
        assetHint: t.assetHint || '',
        quark: t.quark || '',
        baidu: t.baidu || '',
        embeddedIn: t.embeddedIn || ''
      });
    }
    nextState[key] = r.tag;
  }

  fs.writeFileSync(STATE_FILE, JSON.stringify(nextState, null, 2) + '\n');

  const report = {
    checked: targets.length,
    manual: manualList.map(t => ({ name: t.name, section: t.section, source: t.source || '' })),
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
  console.log('共检测 ' + targets.length + ' 个来源' +
    (manualList.length ? '（另有 ' + manualList.length + ' 个需人工查看）' : '') + '\n');

  if (baseline.length) {
    console.log('【已建立基线】' + baseline.length + ' 个（首次记录当前版本，下次起才会报更新）');
    baseline.forEach(b => console.log('  · ' + b.name + '  ' + b.tag));
    console.log('');
  }

  if (!updated.length) {
    console.log('✅ 没有发现新版本');
  } else {
    console.log('🔔 发现 ' + updated.length + ' 个工具更新：\n');
    updated.forEach(u => {
      console.log('  ● ' + u.name + '  [' + u.section + ']');
      console.log('    ' + u.from + '  →  ' + u.to + (u.published ? '   (' + u.published + ')' : ''));
      if (u.assetHint) console.log('    下载：' + u.assetHint);
      if (u.embeddedIn) console.log('    ⚠ 内嵌于「' + u.embeddedIn + '」卡片，需更新卡片内资源文件');
      if (u.quark) console.log('    夸克：' + u.quark);
      if (u.baidu) console.log('    百度：' + u.baidu + '  ← 需手动更新');
      console.log('');
    });
  }

  if (errors.length) {
    console.log('⚠️  ' + errors.length + ' 个条目检测失败：');
    errors.forEach(e => console.log('  · ' + e.name + '（' + e.source + '）：' + e.error));
    console.log('');
  }

  if (manualList.length) {
    console.log('📌 需人工查看（无公开接口）：');
    manualList.forEach(m => console.log('  · ' + m.name + '  [' + m.section + ']  ' + (m.source || '')));
  }
})();
