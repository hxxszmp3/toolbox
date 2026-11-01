#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""番茄小说下载器 · 版本升级工具

把一个版本目录升级到上游最新 release：
    选版本 → 下载 → SHA-256 校验 → 备份 → 替换 → 清理旧版本文件

用法：
    python _update_to_new.py [目标目录]
    # 默认 C:\\Users\\dellsq\\Desktop\\v2026.10.31-1543

⚠️ 选版本的两个坑（2026-11-01 实测）：
  1. 上游 release 列表**不是按发布时间排序**的，列表第一条往往不是最新的。
  2. 版本号里的数字与新旧无关（同一天里 540 / 858 / 1543 混着发）。
  正确做法：用 releases/latest 接口（读 GitHub 的 Latest 标记），
  并按 published_at 排序交叉验证。本脚本两者都做，并打印候选列表供人工核对。
"""
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys

REPO = "POf-L/Fanqie-novel-Downloader"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
DEFAULT_DST = r"C:\Users\dellsq\Desktop\v2026.10.31-1543"

MIRRORS = [
    "https://gh-proxy.com/https://github.com/%s/releases/download/%s/",
    "https://github.com/%s/releases/download/%s/",
]

# GitHub release 资源名 → 目标目录内的相对路径
# 目录结构沿用既有规范：平台 → 发行形态 → 架构条目
PATH_MAP = {
    "FanqieNovelDownloader-tauri-windows-x64-setup.exe":
        r"Windows\安装包（推荐）\64位（常用）\FanqieNovelDownloader-tauri-windows-x64-setup.exe",
    "FanqieNovelDownloader-tauri-windows-arm64-setup.exe":
        r"Windows\安装包（推荐）\ARM64（Surface骁龙本）\FanqieNovelDownloader-tauri-windows-arm64-setup.exe",
    "FanqieNovelDownloader-tauri-windows-x64-portable.exe":
        r"Windows\便携版（无需安装）\64位\FanqieNovelDownloader-tauri-windows-x64-portable.exe",
    "FanqieNovelDownloader-tauri-windows-arm64-portable.exe":
        r"Windows\便携版（无需安装）\ARM64\FanqieNovelDownloader-tauri-windows-arm64-portable.exe",
    "FanqieNovelDownloader-tauri-darwin-x64.dmg":
        r"macOS\DMG安装镜像（推荐）\英特尔芯片\FanqieNovelDownloader-tauri-darwin-x64.dmg",
    "FanqieNovelDownloader-tauri-darwin-aarch64.dmg":
        r"macOS\DMG安装镜像（推荐）\苹果M芯片（推荐）\FanqieNovelDownloader-tauri-darwin-aarch64.dmg",
    "FanqieNovelDownloader-tauri-darwin-x64.zip":
        r"macOS\APP压缩包\英特尔芯片\FanqieNovelDownloader-tauri-darwin-x64.zip",
    "FanqieNovelDownloader-tauri-darwin-aarch64.zip":
        r"macOS\APP压缩包\苹果芯片\FanqieNovelDownloader-tauri-darwin-aarch64.zip",
    "FanqieNovelDownloader-tauri-linux-amd64.deb":
        r"Linux\DEB包（Debian、Ubuntu等）\64位\FanqieNovelDownloader-tauri-linux-amd64.deb",
    "FanqieNovelDownloader-tauri-linux-arm64.deb":
        r"Linux\DEB包（Debian、Ubuntu等）\ARM64\FanqieNovelDownloader-tauri-linux-arm64.deb",
    "FanqieNovelDownloader-tauri-amd64.AppImage":
        r"Linux\AppImage（免安装）\64位\FanqieNovelDownloader-tauri-amd64.AppImage",
    "FanqieNovelDownloader-tauri-aarch64.AppImage":
        r"Linux\AppImage（免安装）\ARM64\FanqieNovelDownloader-tauri-aarch64.AppImage",
    "SHA256SUMS-unsigned.txt":
        r"校验与更新通道\SHA-256 完整清单\SHA256SUMS-unsigned.txt",
    "SHA256SUMS-android.txt":
        r"校验与更新通道\SHA-256 完整清单\SHA256SUMS-android.txt",
    "SHA256SUMS-ios.txt":
        r"校验与更新通道\SHA-256 完整清单\SHA256SUMS-ios.txt",
    "latest.json":
        r"校验与更新通道\自动更新元数据\latest.json",
    "SIGNING.txt":
        r"校验与更新通道\说明文件\SIGNING.txt",
    "ABIS.txt":
        r"校验与更新通道\说明文件\ABIS.txt",
    "FanqieNovelDownloader-tauri-darwin-x64.app.tar.gz":
        r"校验与更新通道\Minisign更新包\FanqieNovelDownloader-tauri-darwin-x64.app.tar.gz",
    "FanqieNovelDownloader-tauri-darwin-aarch64.app.tar.gz":
        r"校验与更新通道\Minisign更新包\FanqieNovelDownloader-tauri-darwin-aarch64.app.tar.gz",
}

# 需要按版本号命名（文件名含日期）的资源
VERSIONED_PATTERNS = [
    ("FanqieNovelDownloader-{v}-android-arm64-v8a.apk",
     r"安卓\手机安装包\64位arm64-v8a（现代手机，推荐）"),
    ("FanqieNovelDownloader-{v}-android-armeabi-v7a.apk",
     r"安卓\手机安装包\32位armeabi-v7a（老旧手机）"),
    ("FanqieNovelDownloader-{v}-android-universal.apk",
     r"安卓\手机安装包\通用版universal（兼容所有设备）"),
    ("FanqieNovelDownloader-{v}-android-x86_64.apk",
     r"安卓\手机安装包\x86_64（模拟器、部分平板）"),
    ("FanqieNovelDownloader-{v}-android.aab",
     r"安卓\应用商店包\AAB（上架用）"),
    ("FanqieNovelDownloader-{v}-Fanqie.Novel.Downloader.ipa",
     r"iOS\无签名IPA（需自行侧载）"),
]


def curl(url, out=None):
    args = ["curl", "-sL", "--max-time", "120", "-H", "User-Agent: " + UA]
    if out:
        args += ["-o", out]
    args.append(url)
    r = subprocess.run(args, capture_output=True)
    return r.stdout.decode("utf-8", errors="replace")


def pick_latest():
    """选最新版本：releases/latest（GitHub 的 Latest 标记）+ 按发布时间交叉验证"""
    print("=== 候选版本（按列表顺序，注意：列表不按时间排） ===")
    lst = curl("https://api.github.com/repos/%s/releases?per_page=10" % REPO)
    releases = json.loads(lst)
    for i, r in enumerate(releases, 1):
        mark = " [草稿]" if r.get("draft") else (
            " [预发布]" if r.get("prerelease") else "")
        print("  %2d. %-40s 发布 %s%s" % (
            i, r["tag_name"], r["published_at"][:19].replace("T", " "), mark))

    latest = json.loads(curl(
        "https://api.github.com/repos/%s/releases/latest" % REPO))
    tag = latest["tag_name"]

    published = [r for r in releases
                 if not r.get("draft") and not r.get("prerelease")]
    by_time = max(published, key=lambda r: r["published_at"])["tag_name"]

    print()
    print("  releases/latest 标记 → %s" % tag)
    print("  按发布时间排序最大  → %s" % by_time)
    if tag != by_time:
        print("  ⚠ 两者不一致，以 Latest 标记为准，请人工核对上面时间")
    else:
        print("  ✓ 两者一致")
    print()
    return tag, latest


def build_map(new_ver):
    """组装资源名 → 相对路径映射"""
    m = dict(PATH_MAP)
    for pattern, folder in VERSIONED_PATTERNS:
        name = pattern.format(v=new_ver)
        m[name] = os.path.join(folder, name)
    return m


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for c in iter(lambda: f.read(1 << 20), b""):
            h.update(c)
    return h.hexdigest()


def fetch(url, dest):
    for attempt in range(1, 4):
        r = subprocess.run(
            ["curl", "-sL", "--fail", "--max-time", "1800",
             "-H", "User-Agent: " + UA, "-o", dest, url],
            capture_output=True)
        if r.returncode == 0 and os.path.exists(dest) and os.path.getsize(dest) > 0:
            return True
        print("      尝试 %d 失败，重试" % attempt)
    return False


def main():
    dst = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_DST
    if not os.path.isdir(dst):
        raise SystemExit("目标目录不存在: %s" % dst)
    tmp = os.path.join(os.path.dirname(dst), "_tmp_fanqie_new")

    tag, rel = pick_latest()
    new_ver = rel["name"].split()[-1]

    m = re.search(r"v(\d{4}\.\d{2}\.\d{2}-\d+)", os.path.basename(dst))
    if m and m.group(1) == new_ver:
        print("目标目录已是最新版本 %s，无需升级。" % new_ver)
        return

    # 扫出旧版本号（用于清理残留）
    old_vers = set()
    for dp, dn, fn in os.walk(dst):
        for f in fn:
            mm = re.search(r"(\d{4}\.\d{2}\.\d{2}-\d+)", f)
            if mm and mm.group(1) != new_ver:
                old_vers.add(mm.group(1))

    mapping = build_map(new_ver)
    sizes = {a["name"]: a["size"] for a in rel["assets"]}
    todo = {k: v for k, v in mapping.items() if k in sizes}
    missing = [k for k in mapping if k not in sizes]
    if missing:
        print("⚠ release 中缺少以下预期资源（跳过）: %s" % missing)

    print("\n=== 下载 %d 个文件 ===" % len(todo))
    if os.path.isdir(tmp):
        shutil.rmtree(tmp)
    os.makedirs(tmp)

    failed = []
    for i, (name, relpath) in enumerate(todo.items(), 1):
        want = sizes[name]
        dest = os.path.join(tmp, name)
        print("[%2d/%d] %s  (%.1fMB)" % (i, len(todo), name, want / 1024 / 1024))
        ok = False
        for base in MIRRORS:
            if fetch(base % (REPO, tag) + name, dest):
                got = os.path.getsize(dest)
                if got == want:
                    ok = True
                    break
                print("      大小不符 %d != %d，换源" % (got, want))
        if ok:
            print("      ✓ %d 字节" % os.path.getsize(dest))
        else:
            failed.append(name)
            print("      ✗ 失败")

    if failed:
        print("\n下载失败 %d 个：%s" % (len(failed), failed))
        print("未做任何替换，原目录保持不变。")
        sys.exit(1)

    # SHA-256 校验
    print("\n=== SHA-256 校验 ===")
    sums = {}
    for f in ("SHA256SUMS-unsigned.txt", "SHA256SUMS-android.txt", "SHA256SUMS-ios.txt"):
        p = os.path.join(tmp, f)
        if not os.path.exists(p):
            continue
        for line in open(p, encoding="utf-8"):
            line = line.strip()
            if line:
                d, fn = line.split(None, 1)
                sums[fn.strip()] = d.strip()

    ok = bad = 0
    for name in todo:
        if name.endswith(".sig"):
            continue
        p = os.path.join(tmp, name)
        if not os.path.exists(p):
            continue
        digest = sums.get(name) or sums.get(name.split("/")[-1])
        if digest is None:
            continue
        if sha256(p).lower() == digest.lower():
            ok += 1
        else:
            bad += 1
            print("  ✗ 哈希不符:", name)
    print("校验: 通过 %d，失败 %d" % (ok, bad))
    if bad:
        print("存在校验失败文件，终止替换。")
        sys.exit(1)

    # 备份
    print("\n=== 备份 ===")
    backup = dst + "_backup_old"
    if os.path.isdir(backup):
        shutil.rmtree(backup)
    shutil.copytree(dst, backup)
    print("已备份到:", backup)

    # 替换
    print("\n=== 替换 ===")
    for name, relpath in todo.items():
        target = os.path.join(dst, relpath)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        shutil.copy2(os.path.join(tmp, name), target)
        print("  ✓", relpath)

    # 清理旧版本残留
    print("\n=== 清理旧版本文件 ===")
    for dp, dn, fn in os.walk(dst):
        for f in fn:
            mm = re.search(r"(\d{4}\.\d{2}\.\d{2}-\d+)", f)
            if mm and mm.group(1) in old_vers:
                p = os.path.join(dp, f)
                os.remove(p)
                print("  已删除:", os.path.relpath(p, dst))

    shutil.rmtree(tmp, ignore_errors=True)
    print("\n完成。目标目录: %s" % dst)
    print("版本: %s" % new_ver)


if __name__ == "__main__":
    main()
