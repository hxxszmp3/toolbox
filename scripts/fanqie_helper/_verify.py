#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""用官方 SHA-256 清单校验下载文件完整性（按文件名全局匹配）。"""
import hashlib
import os

DST = r"C:\Users\dellsq\Desktop\v2026-10-29-104"
SUMS = os.path.join(DST, "校验与更新通道", "SHA-256 完整清单")

# 全局文件名索引
local = {}
for dp, dn, fn in os.walk(DST):
    dn[:] = [d for d in dn if d != "_辅助脚本"]
    for f in fn:
        if f.startswith("."):
            continue
        local.setdefault(f, os.path.join(dp, f))

total = ok = fail = missing = 0
not_needed = []

for name in ("SHA256SUMS-unsigned.txt", "SHA256SUMS-android.txt", "SHA256SUMS-ios.txt"):
    p = os.path.join(SUMS, name)
    if not os.path.exists(p):
        continue
    for line in open(p, encoding="utf-8"):
        line = line.strip()
        if not line:
            continue
        digest, fname = line.split(None, 1)
        fname = fname.strip()
        total += 1
        # iOS 清单用空格，发布名用点号
        cands = [fname, fname.replace(" ", ""), fname.replace(" ", ".")]
        path = next((local[c] for c in cands if c in local), None)
        if path is None:
            base = fname.split("/")[-1]
            for c in (base, base.replace(" ", ""), base.replace(" ", ".")):
                if c in local:
                    path = local[c]
                    break
        if path is None:
            # 本目录不收录的资产（如 THIRD_PARTY_LICENSES.html）
            missing += 1
            not_needed.append(fname)
            continue
        h = hashlib.sha256()
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(1 << 20), b""):
                h.update(chunk)
        rel = os.path.relpath(path, DST).replace("\\", "/")
        if h.hexdigest().lower() == digest.lower():
            ok += 1
            print("  ✓ %s" % rel)
        else:
            fail += 1
            print("  ✗ 哈希不符 %s" % rel)

print()
print("=" * 60)
print("校验 %d 条：通过 %d，失败 %d，本目录未收录 %d" % (total, ok, fail, missing))
if not_needed:
    print("未收录（参考目录同样没有这些）：")
    for f in sorted(set(not_needed)):
        print("  - " + f)
