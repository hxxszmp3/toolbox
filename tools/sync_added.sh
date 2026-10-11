#!/usr/bin/env bash
# 新增/修改工具后跑一次：重新计算所有工具的 added 首次加入日期并写回 data.js。
# 用法：bash tools/sync_added.sh
set -e
cd "$(dirname "$0")/.."
bash tools/dump_git_history.sh
node tools/sync_added.js
