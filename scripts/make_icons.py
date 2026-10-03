# -*- coding: utf-8 -*-
"""生成站点图标：favicon.ico / icon-192 / icon-512 / maskable-512 / og 分享图"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(ROOT, 'icons')
os.makedirs(ICONS, exist_ok=True)

PRIMARY = (37, 99, 235, 255)          # #2563eb
WHITE = (255, 255, 255, 255)
S = 512  # 基准画布


def rounded_canvas(size, radius):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=PRIMARY)
    return img, d


def draw_wrench(d, scale, ox, oy, color=WHITE):
    """以 512 画布为基准画扳手（近似 lucide wrench）：开口环 + 斜柄"""
    def p(x):
        return ox + x * scale
    # 环（开口朝右上）
    r = 58 * scale
    cx, cy = p(176), p(176)
    bbox = [cx - r, cy - r, cx + r, cy + r]
    d.arc(bbox, start=95, end=320, fill=color, width=int(46 * scale))
    # 柄（左上 -> 右下），端点补圆
    x1, y1, x2, y2 = p(204), p(204), p(344), p(344)
    w = int(50 * scale)
    d.line([(x1, y1), (x2, y2)], fill=color, width=w)
    rr = w // 2
    for x, y in [(x1, y1), (x2, y2)]:
        d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=color)


def make_icon(size, radius, wrench_scale, wrench_center):
    img, d = rounded_canvas(size, int(radius * size / S))
    ws = wrench_scale * size / S
    draw_wrench(d, ws, wrench_center[0] * size / S, wrench_center[1] * size / S)
    return img


# ---------- favicon.ico（多尺寸） ----------
icon512 = make_icon(S, 115, 1.0, (0, 0))
ico_path = os.path.join(ROOT, 'favicon.ico')
icon512.resize((48, 48), Image.LANCZOS).save(ico_path, sizes=[(16, 16), (32, 32), (48, 48)])
print('OK favicon.ico')

# ---------- PWA 图标 ----------
icon512.resize((192, 192), Image.LANCZOS).save(os.path.join(ICONS, 'icon-192.png'))
icon512.save(os.path.join(ICONS, 'icon-512.png'))
print('OK icon-192.png / icon-512.png')

# ---------- maskable（全出血方形 + 内容缩到安全区） ----------
mask = Image.new('RGBA', (S, S), PRIMARY)
md = ImageDraw.Draw(mask)
draw_wrench(md, 0.72, 72, 72)  # 整体缩到 72% 居中（安全区）
mask.save(os.path.join(ICONS, 'maskable-512.png'))
print('OK maskable-512.png')

# ---------- OG 分享图 1200x630 ----------
W, H = 1200, 630
og = Image.new('RGBA', (W, H), PRIMARY)
od = ImageDraw.Draw(og)
draw_wrench(od, 1.35, -140, 90)  # 左侧大扳手

def load_font(size, bold=True):
    for f in (['msyhbd.ttc', 'msyh.ttc'] if bold else ['msyh.ttc', 'msyhbd.ttc']):
        try:
            return ImageFont.truetype(os.path.join('C:/Windows/Fonts', f), size)
        except Exception:
            continue
    return ImageFont.truetype('arial.ttf', size)

f1 = load_font(128)
od.text((500, 195), '来点工具', font=f1, fill=WHITE)
sub = 'ldgj.xyz · 免费软件 / 工具 / 素材下载'
fsize = 46
sub_x = 505
# 副标题自适应字号，保证不出画布
while fsize > 20:
    f2 = load_font(fsize, bold=False)
    if sub_x + od.textlength(sub, font=f2) <= W - 40:
        break
    fsize -= 2
od.text((sub_x, 375), sub, font=f2, fill=(214, 227, 255, 255))
og.convert('RGB').save(os.path.join(ICONS, 'og.png'), quality=90)
print('OK icons/og.png')
