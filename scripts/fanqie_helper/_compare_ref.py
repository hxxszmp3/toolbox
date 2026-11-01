#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""对比目标目录与参考目录的分类结构是否完全一致。"""
import os
import sys

REF = r"E:\网盘推广\工具箱\小说区\番茄小说下载器\v2026-10-24-1638"
DST = r"C:\Users\dellsq\Desktop\v2026-10-29-104"

SKIP = {"_辅助脚本"}


def tree(root):
    """返回 {相对目录: [文件名列表]}"""
    out = {}
    for dp, dn, fn in os.walk(root):
        dn[:] = sorted(d for d in dn)
        rel = os.path.relpath(dp, root)
        rel = "" if rel == "." else rel
        if any(part in SKIP for part in rel.split(os.sep)):
            continue
        if rel == "":
            dn[:] = [d for d in dn if d not in SKIP]
        files = sorted(f for f in fn if not f.startswith("."))
        out[rel] = files
    return out


def strip_version(name):
    """去掉文件名里的版本号，便于跨版本对比结构"""
    import re
    return re.sub(r"\d{4}\.\d{2}\.\d{2}-\d+", "VER", name)


ref = tree(REF)
dst = tree(DST)

print("=== 参考目录 %s ===" % os.path.basename(REF))
for d, fs in sorted(ref.items()):
    print("  %s/  (%d)" % (d or ".", len(fs)))

print()
print("=== 目标目录 %s ===" % os.path.basename(DST))
for d, fs in sorted(dst.items()):
    print("  %s/  (%d)" % (d or ".", len(fs)))

print()
print("=" * 66)

# 目录集合对比
ref_dirs = set(ref.keys())
dst_dirs = set(dst.keys())
only_ref = ref_dirs - dst_dirs
only_dst = dst_dirs - ref_dirs

if only_ref:
    print("✗ 参考有、目标缺目录:")
    for d in sorted(only_ref):
        print("    " + (d or "."))
if only_dst:
    print("✗ 目标多出的目录:")
    for d in sorted(only_dst):
        print("    " + (d or "."))

# 逐目录文件数与文件名对比
bad = 0
for d in sorted(ref_dirs & dst_dirs):
    rf = [strip_version(f) for f in ref[d]]
    df = [strip_version(f) for f in dst[d]]
    if rf != df:
        bad += 1
        print("✗ %s 文件不一致" % (d or "."))
        print("    参考:", rf)
        print("    目标:", df)

if not only_ref and not only_dst and bad == 0:
    print("✓ 目录结构与参考完全一致（%d 个目录，%d 个文件）" % (
        len(ref_dirs), sum(len(v) for v in ref.values())))
else:
    print("存在 %d 处差异" % (len(only_ref) + len(only_dst) + bad))

sys.exit(0 if (not only_ref and not only_dst and bad == 0) else 1)
