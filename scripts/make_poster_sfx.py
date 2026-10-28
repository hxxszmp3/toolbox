# -*- coding: utf-8 -*-
"""生成「百万剪辑狮的音效库」目录海报，输出到桌面。
3:4 竖版（1080x1440），纯目录展示：13 个一级分类 + 全部二级子类。
无二维码、无链接、无引导话术（小红书用，目录本身即内容）。

数据来源：夸克网盘 share-detail 递归抓取（tools 目录外的临时目录 qk3/tree.json）
用法：python scripts/make_poster_sfx.py
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import json

W, H = 1080, 1440
CANVAS_H = 1900   # 先画在更高的画布上，最后裁到 1440
DESKTOP = r'C:\Users\dellsq\Desktop'
FONT_DIR = r'C:\Windows\Fonts'
TREE = os.path.join(os.environ.get('TEMP', r'C:\Users\dellsq\AppData\Local\Temp'),
                    'qk3', 'tree.json')
OUT = os.path.join(DESKTOP, '音效库目录海报.png')


def font(size, bold=True):
    names = (['msyhbd.ttc', 'msyh.ttc', 'simhei.ttf'] if bold
             else ['msyh.ttc', 'simhei.ttf'])
    for n in names:
        p = os.path.join(FONT_DIR, n)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def center(d, text, y, f, fill, cx=W / 2):
    w = d.textlength(text, font=f)
    d.text((cx - w / 2, y), text, font=f, fill=fill)


def rounded(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def load_tree():
    with open(TREE, encoding='utf-8') as f:
        return json.load(f)


def build_categories():
    """把抓到的目录树整理成 [(一级分类, [二级子类...]), ...]"""
    tree = load_tree()
    tops = []
    for t in tree:
        if t['depth'] == 0 and not any(x['name'] == t['name'] for x in tops):
            tops.append({'name': t['name'], 'path': t['path']})

    cats = []
    for t in tops:
        kids = tree[:]
        sub = []
        for x in kids:
            if x['depth'] == 1 and x['type'] == 'dir' and x['path'].startswith(t['path'] + ' / '):
                if x['name'] not in sub:
                    sub.append(x['name'])
        # 统计该分类下的文件数
        cnt = sum(1 for x in tree
                  if x['type'] == 'file' and x['path'].startswith(t['path'] + ' / '))
        cats.append({'name': t['name'], 'subs': sub, 'files': cnt,
                     'paths': [t['path']]})

    # 「体育音效」有两个同名目录，合并计数；「体育音效(1)」并入
    merged = []
    for c in cats:
        hit = next((m for m in merged if m['name'] == c['name']), None)
        if hit:
            hit['files'] += c['files']
            for s in c['subs']:
                if s not in hit['subs']:
                    hit['subs'].append(s)
            hit['paths'].extend(c['paths'])
        else:
            merged.append({'name': c['name'], 'subs': list(c['subs']),
                           'files': c['files'], 'paths': list(c['paths'])})

    # 体育音效(1) 只有「#观众」，而体育音效里也有 #观众 → 视为重复副本
    out = []
    for c in merged:
        if c['name'] == '体育音效(1)':
            continue
        out.append(c)

    # 网络音效没有子目录但有 28 个文件，单列展示文件名
    for c in out:
        if c['name'] == '网络音效':
            files = []
            for x in tree:
                if x['type'] != 'file':
                    continue
                if any(x['path'].startswith(p + ' / ') for p in c['paths']):
                    files.append(x['name'])
            # 文件名较长，去掉扩展名并只展示前 12 个
            cleaned = []
            for fn in files:
                short = fn.rsplit('.', 1)[0].strip()
                if short and short not in cleaned:
                    cleaned.append(short)
            c['files_list'] = cleaned[:12]

    # 按子目录数量从多到少，视觉上更平衡
    out.sort(key=lambda c: (-len(c['subs']), c['name']))
    return out


# ==================== 配色 ====================
BG_TOP = (238, 246, 255)
BG_BOT = (226, 238, 252)
BLUE = (37, 99, 235)
BLUE_D = (29, 78, 216)
INK = (15, 23, 42)
TXT = (51, 65, 85)
MUTED = (100, 116, 139)
LINE = (203, 213, 225)
CARD = (255, 255, 255)

# 每个分类一个色相，做成标签条便于视觉分区
HUES = [
    (59, 130, 246), (139, 92, 246), (236, 72, 153), (16, 185, 129),
    (245, 158, 11), (239, 68, 68), (14, 165, 233), (168, 85, 247),
    (34, 197, 94), (249, 115, 22), (6, 182, 212), (132, 204, 22),
    (244, 114, 182),
]


def main():
    cats = build_categories()

    # ---------- 背景 ----------
    img = Image.new('RGB', (W, CANVAS_H), BG_TOP)
    d = ImageDraw.Draw(img)
    for y in range(CANVAS_H):
        t = y / CANVAS_H
        d.line([(0, y), (W, y)],
               fill=(int(BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * t),
                     int(BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * t),
                     int(BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * t)))

    # ---------- 顶部标题 ----------
    f_kicker = font(26, True)
    kicker = '音 效 库 · 完 整 目 录'
    kw = d.textlength(kicker, font=f_kicker)
    rounded(d, ((W - kw) / 2 - 26, 46, (W + kw) / 2 + 26, 104), 29,
            fill=(219, 234, 254), outline=(147, 197, 253), width=2)
    d.text(((W - kw) / 2, 60), kicker, font=f_kicker, fill=BLUE_D)

    f_title = font(62, True)
    center(d, '百万剪辑狮的音效库', 134, f_title, INK)

    # 数据条
    f_meta = font(30, False)
    total_files = sum(c['files'] for c in cats)
    total_subs = sum(len(c['subs']) for c in cats)
    meta = f'{len(cats)} 大类 · {total_subs} 个子类 · 2123 个音效'
    center(d, meta, 216, f_meta, MUTED)

    # 分隔线
    d.line([(80, 272), (W - 80, 272)], fill=(191, 219, 254), width=3)

    # ---------- 目录区：双栏卡片 ----------
    top = 294
    gap = 18
    col_w = (W - 80 - gap) / 2
    card_x = [40, 40 + col_w + gap]

    # 先算每个分类需要的高度
    f_cat = font(29, True)
    f_sub = font(22, False)
    f_cnt = font(19, False)

    def cat_height(c):
        lines = []
        if c['subs'] or c.get('files_list'):
            cur = []
            items = c['subs'] or c.get('files_list') or []
            for s in items:
                trial = cur + [s]
                w = sum(d.textlength(x, font=f_sub) + 22 for x in trial)
                if w > col_w - 56 and cur:
                    lines.append(cur)
                    cur = [s]
                else:
                    cur = trial
            if cur:
                lines.append(cur)
        return 56 + len(lines) * 36 + 34

    heights = [cat_height(c) for c in cats]

    # 均分到两栏：逐个放到较矮的一栏
    col_h = [0, 0]
    placed = [[], []]
    for c, h in zip(cats, heights):
        k = 0 if col_h[0] <= col_h[1] else 1
        placed[k].append((c, h))
        col_h[k] += h + 12

    for k in (0, 1):
        y = top
        for idx, (c, h) in enumerate(placed[k]):
            hue = HUES[(idx + k * 5) % len(HUES)]
            box = (card_x[k], y, card_x[k] + col_w, y + h)
            rounded(d, box, 22, fill=CARD, outline=LINE, width=2)
            # 左侧色条
            rounded(d, (card_x[k] + 16, y + 16, card_x[k] + 26, y + 50), 5, fill=hue)

            # 分类名
            d.text((card_x[k] + 40, y + 18), c['name'], font=f_cat, fill=INK)

            # 文件数
            cnt_txt = f"{c['files']}"
            cw = d.textlength(cnt_txt, font=f_cnt)
            d.text((card_x[k] + col_w - 22 - cw, y + 28), cnt_txt,
                   font=f_cnt, fill=(148, 163, 184))

            # 子类
            sy = y + 58
            if c['subs'] or c.get('files_list'):
                cur = []
                lines = []
                items = c['subs'] or c.get('files_list') or []
                for s in items:
                    trial = cur + [s]
                    w = sum(d.textlength(x, font=f_sub) + 22 for x in trial)
                    if w > col_w - 56 and cur:
                        lines.append(cur)
                        cur = [s]
                    else:
                        cur = trial
                if cur:
                    lines.append(cur)
                for ln in lines:
                    x = card_x[k] + 40
                    for s in ln:
                        sw = d.textlength(s, font=f_sub)
                        # 小圆角标签
                        rounded(d, (x, sy, x + sw + 20, sy + 28), 8,
                                fill=(241, 245, 249))
                        d.text((x + 10, sy + 3), s, font=f_sub, fill=TXT)
                        x += sw + 22
                    sy += 32
            elif c.get('files_list'):
                # 网络音效：直接列文件名
                x = card_x[k] + 40
                for s in c['files_list']:
                    sw = d.textlength(s, font=f_sub)
                    if x + sw + 22 > card_x[k] + col_w - 16:
                        x = card_x[k] + 40
                        sy += 32
                    rounded(d, (x, sy, x + sw + 20, sy + 28), 8,
                            fill=(241, 245, 249))
                    d.text((x + 10, sy + 3), s, font=f_sub, fill=TXT)
                    x += sw + 22

            y += h + 12

    # ---------- 底部信息条 ----------
    # ---------- 底部信息条（先画在画布底部，缩放后落在最终底部） ----------
    f_foot = font(26, False)
    foot = '2.78 GB · WAV / MP3 双格式 · 剪辑直接拖入时间线'
    fw = d.textlength(foot, font=f_foot)
    fy = CANVAS_H - 96
    rounded(d, ((W - fw) / 2 - 30, fy, (W + fw) / 2 + 30, fy + 60), 30,
            fill=(219, 234, 254), outline=(147, 197, 253), width=2)
    d.text(((W - fw) / 2, fy + 9), foot, font=f_foot, fill=BLUE_D)

    # ---------- 缩放到目标高度 ----------
    scale = H / float(CANVAS_H)
    img = img.resize((W, H), Image.LANCZOS)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    img.save(OUT, 'PNG')
    print('已生成:', os.path.abspath(OUT), img.size)
    print('分类数:', len(cats), '子类总数:', total_subs)


if __name__ == '__main__':
    main()
