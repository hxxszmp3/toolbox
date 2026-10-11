/* 自动计算每个工具的首次加入日期，写回 data.js 的 added 字段。
   用法：node tools/sync_added.js
   原理：遍历 data.js 的提交历史，从旧到新找出每个工具名首次出现的提交日期。
   渲染端按 added 倒序排列，无 added 的老工具保持原有顺序排在后面。
   实现前提：data.js 中每个工具条目独占一行（当前项目一直遵循该约定）。 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const file = 'data.js';
const abs = path.join(root, file);

/* 沙箱禁止 node 起子进程，所以 git 的活儿交给 shell 预先生成，
   本脚本只读 dump 文件做纯计算。生成命令见 tools/dump_git_history.sh */
const dump = path.join(__dirname, '.git_history.txt');
if (!fs.existsSync(dump)){
  console.error('缺少 ' + dump + '，请先执行 tools/dump_git_history.sh（或 bash tools/sync_added.sh）');
  process.exit(1);
}

/* 1. 读取 dump：每行 "日期<TAB>工具名,工具名,..."，已按提交从旧到新排序 */
const firstSeen = new Map();
fs.readFileSync(dump, 'utf8').split(/\r?\n/).filter(Boolean).forEach(line => {
  const i = line.indexOf('\t');
  if (i < 0) return;
  const d = line.slice(0, i).trim();
  line.slice(i + 1).split(',').map(s => s.trim()).filter(Boolean).forEach(n => {
    if (n && !firstSeen.has(n)) firstSeen.set(n, d);
  });
});

/* 3. 逐行回写 added 字段 */
const src = fs.readFileSync(abs, 'utf8');
const lines = src.split(/\r?\n/);
let changed = 0, missing = [];

lines.forEach((line, i) => {
  const m = /name:'([^']+)'/.exec(line);
  if (!m) return;
  const name = m[1];
  const d = firstSeen.get(name);
  if (!d){ missing.push(name); return; }
  let L = line.replace(/,?\s*added:'[\d-]+'/, '');
  if (!L.includes('added:')){
    /* 插到 desc 之后（version/os 之前），保持字段顺序统一 */
    L = L.replace(/(desc:'[^']*',)/, `$1 added:'${d}',`);
  }
  if (L !== line){ lines[i] = L; changed++; }
});

const out = lines.join('\n');
if (out !== src){
  fs.writeFileSync(abs, out, 'utf8');
  console.log(`已写入 ${changed} 处 added 字段`);
} else {
  console.log('无需改动');
}
if (missing.length) console.log('未找到提交记录(首次出现在未提交改动中):', missing.join(' '));

/* 4. 排序预览 */
const S = new Function(fs.readFileSync(abs, 'utf8') + ';return SECTIONS')();
S.forEach(s => {
  const d = s.tools.filter(t => t.added);
  console.log(`${s.name}(${s.id}) ${d.length}/${s.tools.length} 有日期，最新：` +
    d.slice().sort((a, b) => b.added.localeCompare(a.added)).slice(0, 5)
      .map(t => `${t.name}[${t.added}]`).join(' '));
});
