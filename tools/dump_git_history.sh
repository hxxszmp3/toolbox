#!/usr/bin/env bash
# 导出 data.js 的历史工具名清单，供 sync_added.js 计算首次出现日期。
# 输出：tools/.git_history.txt，每行 "日期<TAB>工具名,工具名,..."，按提交从旧到新。
set -e
cd "$(dirname "$0")/.."
OUT="tools/.git_history.txt"
: > "$OUT"

git log --reverse --format='%H %ad' --date=short -- data.js | while read -r H D; do
  # 只取 tools 区域（UPDATES 之前的部分），排除更新记录里的 name 字段
  NAMES=$(git show "$H:data.js" \
    | sed '/^const UPDATES/,$d' \
    | grep -o "name:'[^']*'" \
    | sed "s/name:'//; s/'//" \
    | sort -u | paste -sd, -)
  printf '%s\t%s\n' "$D" "$NAMES" >> "$OUT"
done

echo "已生成 $OUT（$(wc -l < "$OUT") 条提交记录）"
