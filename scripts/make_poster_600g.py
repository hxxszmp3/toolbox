# -*- coding: utf-8 -*-
"""生成「600G小说合集」宣传海报（1080x1440）。
链接区域做模糊打码，突出「工具箱 - 小说专区获取」。
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

W, H = 1080, 1440
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'poster-600g.png')

# ---------- 配色 ----------
BG_TOP = (255, 251, 245)
BG_BOT = (255, 240, 232)
BLUE = (37, 99, 235)
BLUE_D = (29, 78, 216)
BLUE_50 = (239, 246, 255)
ORANGE = (249, 115, 22)
ORANGE_50 = (255, 247, 237)
INK = (24, 32, 46)
GRAY = (110, 122, 140)
LINE = (226, 232, 240)

FONT_DIRS = [r'C:\Windows\Fonts']


def font(size, bold=True):
    names = (['msyhbd.ttc', 'msyh.ttc', 'simhei.ttf'] if bold
             else ['msyh.ttc', 'simhei.ttf'])
    for n in names:
        p = os.path.join(FONT_DIRS[0], n)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def center(d, text, y, f, fill):
    w = d.textlength(text, font=f)
    d.text(((W - w) / 2, y), text, font=f, fill=fill)


def rounded(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


# ---------- 背景（纵向细渐变） ----------
img = Image.new('RGB', (W, H), BG_TOP)
d = ImageDraw.Draw(img)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=(
        int(BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * t),
        int(BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * t),
        int(BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * t),
    ))

# ---------- 顶部标签 ----------
tag = '来点工具  ·  小说专区'
f_tag = font(30, True)
tw = d.textlength(tag, font=f_tag)
rounded(d, ((W - tw) / 2 - 32, 62, (W + tw) / 2 + 32, 132), 35,
        fill=BLUE_50, outline=(191, 219, 254), width=2)
d.text(((W - tw) / 2, 78), tag, font=f_tag, fill=BLUE_D)

# ---------- 主标题：600G ----------
f_big = font(230, True)
big = '600G'
bw = d.textlength(big, font=f_big)
d.text(((W - bw) / 2, 176), big, font=f_big, fill=BLUE)

f_sub = font(62, True)
center(d, '小 说 合 集', 448, f_sub, INK)

# ---------- 卖点 ----------
f_pt = font(34, False)
pts = [
    '全网热门小说 基本都收录',
    '近 600G 超大合集  一次存够',
    '多为精校版  排版干净无乱码',
    '免费无广告  配本地阅读器即看',
    '支持离线阅读  手机电脑都能用',
]
y = 560
for p in pts:
    pw = d.textlength(p, font=f_pt)
    rounded(d, ((W - pw) / 2 - 26, y - 8, (W + pw) / 2 + 26, y + 50), 29,
            fill=(255, 255, 255), outline=LINE, width=2)
    d.text(((W - pw) / 2, y), p, font=f_pt, fill=(51, 65, 85))
    y += 70

# ---------- 合并板块：下载链接 + 马赛克 + 工具专区引导 ----------
box = (110, 950, W - 110, 1400)
rounded(d, box, 32, fill=(241, 245, 249), outline=(203, 213, 225), width=3)

f_hint = font(40, True)
center(d, '下载链接', 992, f_hint, INK)

# 模糊的马赛克条：模拟被遮挡的链接
blur = Image.new('RGB', (W - 300, 76), (241, 245, 249))
bd = ImageDraw.Draw(blur)
x = 12
i = 0
while x < blur.width - 12:
    seg = [78, 38, 58, 30, 68, 44][i % 6]
    seg = min(seg, blur.width - 12 - x)
    if seg <= 0:
        break
    bd.rounded_rectangle((x, 18, x + seg, 58), radius=9,
                         fill=(148, 163, 184) if i % 2 else (100, 116, 139))
    x += seg + 18
    i += 1
blur = blur.filter(ImageFilter.GaussianBlur(8))
img.paste(blur, (150, 1056))

# 分隔线
d.line([(190, 1178), (W - 190, 1178)], fill=(203, 213, 225), width=3)

# 引导语
f_cta = font(58, True)
center(d, '工具箱 - 小说专区获取', 1216, f_cta, ORANGE)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, 'PNG')
print('已生成:', os.path.abspath(OUT), img.size)
