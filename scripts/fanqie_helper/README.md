# 番茄小说下载器 · 版本升级工具（跨版本通用）

- 项目：<https://github.com/POf-L/Fanqie-novel-Downloader>
- 用途：小说、漫画、短剧的下载与阅读工具
- 作用：把某个版本目录升级到最新 release，下载 → SHA-256 校验 → 备份 → 替换 → 清理旧文件

## ⚠️ 选版本：不能信列表第一条，也不能比版本号数字

上游 release 列表**不是按发布时间排序**的，且版本号里的数字与新旧无关
（同一天里 540 / 858 / 1543 三个 build 混着发，列表首位往往不是最新的）。

实测（2026-11-01）：

| 列表位 | 版本 | 发布时间(北京) | 说明 |
|---|---|---|---|
| 1 | 2026.10.31-858-r776 | 10/31 17:16 | 列表首位，但**不是**最新 |
| 2 | 2026.10.31-540-r775 | 10/31 13:55 | 更早 |
| 3 | **2026.10.31-1543-r777** | **11/1 00:01** | ✅ 实际最新 |
| 7 | 2026.10.29-1422-r774 | 10/29 22:38 | 排在更早的 104 后面 |

**正确做法**：用 `releases/latest` 接口（读 GitHub 的 Latest 标记），或按
`published_at` 排序取最大。`_update_to_new.py` 已采用前者，并会打印
所有候选版本及发布时间供人工核对。

分类结构沿用 `E:\网盘推广\工具箱\小说区\番茄小说下载器\v2026-10-24-1638` 的既有规范：
**平台 → 发行形态 → 架构条目**。

> 注：分发包内的 `.sig` Minisign 签名文件已移除（普通用户用不到）。
> 自动更新所需的签名**内嵌在 `latest.json` 中**，不受影响。

---

## 目录结构

```
v2026-10-29-104/
├── Windows/                       🪟
│   ├── 安装包（推荐）/            NSIS 安装器，保留安装目录与卸载信息
│   │   ├── 64位（常用）/          FanqieNovelDownloader-tauri-windows-x64-setup.exe
│   │   └── ARM64（Surface骁龙本）/ FanqieNovelDownloader-tauri-windows-arm64-setup.exe
│   └── 便携版（无需安装）/        原位覆盖当前 exe 并重启，不创建安装项
│       ├── 64位/                  FanqieNovelDownloader-tauri-windows-x64-portable.exe
│       └── ARM64/                 FanqieNovelDownloader-tauri-windows-arm64-portable.exe
│
├── macOS/                         🍎
│   ├── DMG安装镜像（推荐）/
│   │   ├── 苹果M芯片（推荐）/     FanqieNovelDownloader-tauri-darwin-aarch64.dmg
│   │   └── 英特尔芯片/            FanqieNovelDownloader-tauri-darwin-x64.dmg
│   └── APP压缩包/
│       ├── 苹果芯片/              FanqieNovelDownloader-tauri-darwin-aarch64.zip
│       └── 英特尔芯片/            FanqieNovelDownloader-tauri-darwin-x64.zip
│
├── Linux/                         🐧
│   ├── DEB包（Debian、Ubuntu等）/ 体积小，推荐
│   │   ├── 64位/                  FanqieNovelDownloader-tauri-linux-amd64.deb
│   │   └── ARM64/                 FanqieNovelDownloader-tauri-linux-arm64.deb
│   └── AppImage（免安装）/        需赋予执行权限
│       ├── 64位/                  FanqieNovelDownloader-tauri-amd64.AppImage
│       └── ARM64/                 FanqieNovelDownloader-tauri-aarch64.AppImage
│
├── 安卓/                          🤖
│   ├── 手机安装包/
│   │   ├── 64位arm64-v8a（现代手机，推荐）/  ...-android-arm64-v8a.apk
│   │   ├── 32位armeabi-v7a（老旧手机）/       ...-android-armeabi-v7a.apk
│   │   ├── 通用版universal（兼容所有设备）/   ...-android-universal.apk
│   │   └── x86_64（模拟器、部分平板）/         ...-android-x86_64.apk
│   └── 应用商店包/
│       └── AAB（上架用）/         ...-android.aab
│
├── iOS/                           📱
│   └── 无签名IPA（需自行侧载）/   ...-Fanqie.Novel.Downloader.ipa
│
├── 校验与更新通道/                🔐
│   ├── SHA-256 完整清单/          SHA256SUMS-unsigned.txt / -android.txt / -ios.txt
│   ├── 自动更新元数据/            latest.json
│   ├── Minisign更新包/            darwin-*.app.tar.gz
│   └── 说明文件/                  SIGNING.txt / ABIS.txt
│
└── _辅助脚本/                     下载与校验脚本，非发行文件
```

---

## ⚠️ Linux AppImage 架构提示（上游命名问题）

上游部分 release 会把 aarch64 的 AppImage 命名为 `amd64`。
下载后用 `file xxx.AppImage` 确认，含 "ARM aarch64" 即为 ARM64。
x86_64 设备请改用 DEB 包。

## ⚠️ 签名与安装说明

这是一个**未签名版**：

- **Windows**：未做 Authenticode 签名，运行会提示"未知发布者"或 SmartScreen 警告。
  解决：右键 → 属性 → 勾选「解除锁定」→ 确定，再运行。
- **macOS**：未做 Developer ID 签名与公证，首次打开被 Gatekeeper 拦截。
  解决：系统设置 → 隐私与安全性 → 点「仍要打开」。不要全局关闭 Gatekeeper。
  打开 DMG 后把应用拖进「应用程序」文件夹。
- **Linux**：AppImage 需先 `chmod +x` 再执行。
- **Android**：需 Android 7.0 及以上。APK 带 Android 安装签名，可覆盖升级。
- **iOS**：IPA **无 Apple 签名**，需用 AltStore / Sideloadly / TrollStore 侧载。
  安装后在「设置 → 通用 → VPN 与设备管理」信任开发者证书。需 iOS 14 及以上。

> 自动更新通道用独立的 Minisign 密钥签名，与厂商签名不是同一套机制。

## 🔄 旧便携版升级

旧便携客户端无法安全识别发行形态，需**手动下载同架构的 `windows-*-portable.exe` 覆盖原文件**一次。
迁移后才会保持原路径和便携形态自动更新。不要用 setup.exe 覆盖便携版。

## 🛠️ _辅助脚本

| 文件 | 用途 |
|---|---|
| `_rebuild.sh` | 按参考目录结构重建整个目录（含批量下载） |
| `_compare_ref.py` | 与参考目录 v2026-10-24-1638 做结构一致性比对 |
| `_verify.py` | 用官方 SHA-256 清单校验完整性 |
| `_redownload_bad.py` | 自动重下校验不完整的文件 |
| `_download.sh` | 早期版本的下载脚本 |
| `_download_extra.sh` | 早期版本的补充下载脚本 |
