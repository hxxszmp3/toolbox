#!/usr/bin/env bash
# 推送脚本：优先走 SSH（推荐），代理对 github.com 返回 502 时退回 GitHub API
#
# 用法：
#   bash tools/push.sh              # 正常推送
#   bash tools/push.sh --force      # 强推（配合 --force-with-lease）
#
# 为什么不用 git push 直连：
#   本机代理对 github.com 常返回 502（CONNECT tunnel failed），
#   但对 api.github.com 正常。SSH 走 ssh.github.com:443 可直连，最稳。
set -e
cd "$(dirname "$0")/.."

FORCE=""
[ "$1" = "--force" ] && FORCE="--force-with-lease"

# remote 必须是 SSH 形式
CURRENT=$(git remote get-url origin)
case "$CURRENT" in
  git@github.com:*) ;;
  *)
    echo "remote 不是 SSH 形式，当前：$CURRENT"
    echo "如需切换：git remote set-url origin git@github.com:hxxszmp3/toolbox.git"
    exit 1
    ;;
esac

# git 必加参数：credential.helper= 防 credential-helper-selector 触发交互式编辑器永久挂起
echo "=== 尝试 SSH 推送 ==="
if timeout 120 git -c credential.helper= -c http.proxy= -c https.proxy= push $FORCE origin main 2>&1 | tail -6; then
  if git ls-remote --exit-code origin main >/dev/null 2>&1; then
    echo "✓ 推送成功"
    exit 0
  fi
fi

echo
echo "=== SSH 推送失败，退回 GitHub API 方式 ==="
PROXY=$(env | grep -iE "^https?_proxy=" | head -1 | cut -d= -f2 | sed -E 's#^https?://##')
if [ -z "$PROXY" ]; then
  echo "未找到代理，API 方式需要代理访问 api.github.com"
  exit 1
fi
echo "使用代理：$PROXY"

PASS=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | sed -n 's/^password=//p' | tr -d '\r\n')
if [ -z "$PASS" ]; then
  echo "凭据管理器无可用凭据，API 方式无法进行"
  exit 1
fi

node tools/push_via_api.js "$PROXY" "$PASS" $FORCE
