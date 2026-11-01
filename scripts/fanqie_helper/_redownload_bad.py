#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""重下校验不完整的文件：按 GitHub 官方 API 的 asset 大小逐个核对，必要时重下。"""
import hashlib
import json
import os
import subprocess
import sys

DST = r"C:\Users\dellsq\Desktop\v2026-10-29-104"
SUMS = os.path.join(DST, "校验与更新通道", "SHA-256 完整清单")
TAG = "unsigned-v2026.10.29-104-r768"
MIRROR = "https://gh-proxy.com/https://github.com/POf-L/Fanqie-novel-Downloader/releases/download/" + TAG
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

# 官方 asset 大小
api = "https://api.github.com/repos/POf-L/Fanqie-novel-Downloader/releases/tags/" + TAG
raw = subprocess.run(["curl", "-s", "--max-time", "40", api], capture_output=True).stdout
rel = json.loads(raw.decode("utf-8"))
sizes = {a["name"]: a["size"] for a in rel["assets"]}

# 文件名索引
local = {}
for dp, dn, fn in os.walk(DST):
    dn[:] = [d for d in dn if d != "_辅助脚本"]
    for f in fn:
        if not f.startswith("."):
            local.setdefault(f, os.path.join(dp, f))


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for c in iter(lambda: f.read(1 << 20), b""):
            h.update(c)
    return h.hexdigest()


# 收集需要重下的文件
bad = []
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
        cands = [fname, fname.replace(" ", ""), fname.replace(" ", ".")]
        path = next((local[c] for c in cands if c in local), None)
        if path is None:
            continue
        if sha256(path).lower() != digest.lower():
            bad.append((path, fname))
            local.pop(fname, None)

if not bad:
    print("所有文件校验通过，无需重下。")
    sys.exit(0)

print("需要重下 %d 个文件：" % len(bad))
for path, fname in bad:
    want = sizes.get(fname, -1)
    cur = os.path.getsize(path) if os.path.exists(path) else 0
    print("  - %s" % fname)
    print("      本地 %d 字节 / 官方 %d 字节" % (cur, want))
    if want > 0 and cur == want:
        print("      大小相同但哈希不同，重新下载")
    # 重新下载
    url = MIRROR + "/" + fname
    for a in range(1, 4):
        r = subprocess.run(
            ["curl", "-sL", "--fail", "--max-time", "900", "-H", "User-Agent: " + UA, "-o", path, url],
            capture_output=True)
        if r.returncode == 0 and os.path.exists(path):
            new = os.path.getsize(path)
            if want <= 0 or new == want:
                print("      ✓ 重下完成 (%d 字节)" % new)
                break
            print("      重下后 %d 字节，仍不符，重试" % new)
        else:
            print("      重试 %d" % a)
    local[fname] = path

print()
print("重新校验…")
ok = fail = 0
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
        cands = [fname, fname.replace(" ", ""), fname.replace(" ", ".")]
        path = next((local[c] for c in cands if c in local), None)
        if path is None:
            continue
        if sha256(path).lower() == digest.lower():
            ok += 1
        else:
            fail += 1
            print("  ✗ 仍不符:", fname)

print("通过 %d，失败 %d" % (ok, fail))
sys.exit(1 if fail else 0)
