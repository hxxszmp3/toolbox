/* GitHub Git Data API 推送（SSH 不可用时的备选路径）
 *
 * 用法：node tools/push_via_api.js <proxy> <token> [--force-with-lease]
 *
 * 为什么需要这条路径：本机代理对 github.com 常返回 502，但对 api.github.com 正常，
 * 而 git push 必须访问 github.com。API 方式绕开这一点。
 *
 * 注意两个坑：
 *   1. 必须用 execFileSync('git', [...])，不能用 execSync(`git ... ${sha}^ ...`)——
 *      shell 会吃掉 ^，导致 diff-tree 返回空、tree 请求报 "Invalid tree info"。
 *   2. API 重建的 commit SHA 与本地不同（内容一致）。推完需
 *      git reset --hard origin/main 对齐，否则下次推送会分叉。
 */
const { execSync, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const TMP = path.join(os.tmpdir(), '_push_via_api');
fs.mkdirSync(TMP, { recursive: true });

const PROXY = process.argv[2];
const TOKEN = process.argv[3];
const FORCE = process.argv.includes('--force-with-lease');
const REPO = 'hxxszmp3/toolbox';
const BRANCH = 'main';
const API = `https://api.github.com/repos/${REPO}`;

const GIT = (cmd) => execSync(cmd, { encoding: 'utf8', cwd: ROOT, maxBuffer: 100 * 1024 * 1024 });
const GITF = (args) => execFileSync('git', args, { encoding: 'utf8', cwd: ROOT, maxBuffer: 100 * 1024 * 1024 });

async function api(method, p, body) {
  const file = path.join(TMP, 'req.json');
  if (body) fs.writeFileSync(file, JSON.stringify(body));
  const args = ['-s', '--proxy', `http://${PROXY}`, '--max-time', '120', '-X', method,
    '-H', `Authorization: Bearer ${TOKEN}`, '-H', 'Accept: application/vnd.github+json'];
  if (body) args.push('-H', 'Content-Type: application/json', '--data-binary', `@${file}`);
  args.push(`${API}${p}`);
  const out = execSync(`curl ${args.map(a => `"${a}"`).join(' ')}`,
    { encoding: 'utf8', maxBuffer: 200 * 1024 * 1024 });
  try { return JSON.parse(out); } catch (e) { return { parse_error: out.slice(0, 300) }; }
}

(async () => {
  const ref = await api('GET', `/git/ref/heads/${BRANCH}`);
  const remoteSha = ref.object.sha;
  console.log('远端 HEAD:', remoteSha);

  const baseTree = (await api('GET', `/git/commits/${remoteSha}`)).tree.sha;
  const shas = GIT(`git log --format=%H ${remoteSha}..HEAD`).trim().split('\n').filter(Boolean).reverse();
  if (!shas.length) { console.log('本地无待推送提交'); process.exit(0); }
  console.log('待推送提交:', shas.length);

  let curTree = baseTree, curParent = remoteSha;
  for (const sha of shas) {
    const msg = GIT(`git log -1 --format=%B ${sha}`).trim();
    const [aName, aEmail, aDate] = GIT(`git log -1 --format="%an|%ae|%aI" ${sha}`).trim().split('|');
    const parent = GITF(['rev-parse', sha + '^']).trim();
    const files = GITF(['diff-tree', '-r', '--no-commit-id', '--name-only', parent, sha])
      .trim().split('\n').filter(Boolean);

    const items = [];
    for (const f of files) {
      const mode = GITF(['ls-tree', sha, '--', f]).trim().split(/\s+/)[0] || '100644';
      const b64 = execFileSync('git', ['cat-file', '-p', `${sha}:${f}`],
        { cwd: ROOT, maxBuffer: 100 * 1024 * 1024 }).toString('base64');
      const blob = await api('POST', '/git/blobs', { content: b64, encoding: 'base64' });
      if (!blob.sha) { console.error('blob 失败:', f, JSON.stringify(blob).slice(0, 200)); process.exit(1); }
      items.push({ path: f, mode, type: 'blob', sha: blob.sha });
    }

    const nt = await api('POST', '/git/trees', { base_tree: curTree, tree: items });
    if (!nt.sha) { console.error('tree 失败:', JSON.stringify(nt).slice(0, 300)); process.exit(1); }

    const nc = await api('POST', '/git/commits', {
      message: msg, tree: nt.sha, parents: [curParent],
      author: { name: aName, email: aEmail, date: aDate }
    });
    if (!nc.sha) { console.error('commit 失败:', JSON.stringify(nc).slice(0, 300)); process.exit(1); }
    console.log(`  ${sha.slice(0, 8)} → ${nc.sha.slice(0, 8)}  (${items.length} 文件)`);
    curTree = nt.sha; curParent = nc.sha;
  }

  const up = await api('PATCH', `/git/refs/heads/${BRANCH}`, { sha: curParent, force: FORCE });
  if (!up.object) { console.error('更新 ref 失败:', JSON.stringify(up).slice(0, 300)); process.exit(1); }
  console.log('✓ 推送成功 →', up.object.sha);
  console.log('  注意：API 重建的 SHA 与本地不同，请执行 git reset --hard origin/main 对齐');
})();
