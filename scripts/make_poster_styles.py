# -*- coding: utf-8 -*-
"""生成「600G小说合集」另两版宣传海报（不同风格），输出到桌面。
风格 A：深色高端质感（Dark Premium）
风格 B：杂志拼贴风（Magazine Collage）
共同元素：链接打码 + 「工具箱 - 小说专区获取」+ 共 69235 本 · TXT
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

W, H = 1080, 1440
DESKTOP = r'C:\Users\dellsq\Desktop'
FONT_DIR = r'C:\Windows\Fonts'


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


def mosaic_bar(width, height, base, dark, light, segs, gap, blur=8):
    """生成一条模糊马赛克色块（用于打码）"""
    im = Image.new('RGB', (width, height), base)
    bd = ImageDraw.Draw(im)
    x, i = 10, 0
    while x < width - 10:
        seg = min(segs[i % len(segs)], width - 10 - x)
        if seg <= 0:
            break
        bd.rounded_rectangle((x, height // 2 - 20, x + seg, height // 2 + 20),
                             radius=9, fill=dark if i % 2 else light)
        x += seg + gap
        i += 1
    return im.filter(ImageFilter.GaussianBlur(blur))


# ============================================================
# 风格 A：深色高端质感
# ============================================================
def style_dark():
    WELL = (18, 22, 34)
    CARD = (28, 34, 50)
    GOLD = (240, 180, 74)
    GOLD_D = (196, 140, 44)
    TXT = (238, 241, 248)
    MUTED = (140, 152, 174)
    BORDER = (58, 68, 92)

    img = Image.new('RGB', (W, H), WELL)
    d = ImageDraw.Draw(img)

    # 顶部渐变光晕（用同心圆模拟，避免复杂渐变）
    glow = Image.new('RGB', (W, H), WELL)
    gd = ImageDraw.Draw(glow)
    for r in range(760, 0, -14):
        t = 1 - r / 760
        c = (int(WELL[0] + (44 - WELL[0]) * t),
             int(WELL[1] + (52 - WELL[1]) * t),
             int(WELL[2] + (78 - WELL[2]) * t))
        gd.ellipse((W / 2 - r, -180 - r * 0.35, W / 2 + r, -180 + r * 0.65), fill=c)
    img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(60)), 0.85)
    d = ImageDraw.Draw(img)

    # 外边框
    d.rectangle((36, 36, W - 36, H - 36), outline=(48, 57, 78), width=3)

    # 顶部品牌
    f_brand = font(30, True)
    center(d, '来 点 工 具', 112, f_brand, GOLD)
    f_brand2 = font(22, False)
    center(d, 'N O V E L   C O L L E C T I O N', 162, f_brand2, MUTED)

    # 主数字
    f_big = font(250, True)
    bw = d.textlength('600G', font=f_big)
    d.text(((W - bw) / 2, 236), '600G', font=f_big, fill=GOLD)

    f_cn = font(70, True)
    center(d, '小说合集', 522, f_cn, TXT)

    # 金色分隔（短线 + 菱形点）
    d.line([(W / 2 - 150, 630), (W / 2 - 22, 630)], fill=GOLD_D, width=3)
    d.line([(W / 2 + 22, 630), (W / 2 + 150, 630)], fill=GOLD_D, width=3)
    d.polygon([(W / 2, 620), (W / 2 + 10, 630), (W / 2, 640), (W / 2 - 10, 630)], fill=GOLD)

    # 数量条
    f_num = font(34, True)
    center(d, '共 69235 本  ·  TXT 格式', 674, f_num, TXT)

    # 卖点（左对齐列表 + 金色小方块）
    f_pt = font(33, False)
    pts = [
        '全网热门小说 基本都收录',
        '近 600G 超大合集  一次存够',
        '多为精校版  排版干净无乱码',
        '免费无广告  配本地阅读器即看',
        '支持离线阅读  手机电脑都能用',
    ]
    y = 762
    for p in pts:
        d.rectangle((168, y + 14, 182, y + 28), fill=GOLD)
        d.text((204, y), p, font=f_pt, fill=(206, 214, 230))
        y += 62

    # 下载区域卡片
    card = (110, 1090, W - 110, 1372)
    d.rounded_rectangle(card, radius=26, fill=CARD, outline=BORDER, width=2)
    d.line([(110 + 26, 1090 + 128), (W - 110 - 26, 1090 + 128)], fill=BORDER, width=2)

    f_hint = font(38, True)
    center(d, '下载链接', 1116, f_hint, TXT)

    bar = mosaic_bar(W - 300, 76, CARD, (150, 152, 168), (212, 196, 160), [78, 38, 58, 30, 68, 44], 18)
    img.paste(bar, (150, 1176))

    f_cta = font(54, True)
    center(d, '工具箱 - 小说专区获取', 1284, f_cta, GOLD)

    out = os.path.join(DESKTOP, '海报-深色质感版.png')
    img.save(out, 'PNG')
    return out


# ============================================================
# 风格 B：杂志拼贴风
# ============================================================
def style_magazine():
    PAPER = (247, 244, 237)
    INK = (26, 26, 26)
    RED = (214, 58, 46)
    TEAL = (24, 116, 118)
    YELLOW = (248, 205, 78)
    GRAY = (120, 116, 108)
    TEAL_50 = (226, 241, 240)
    YELLOW_50 = (255, 247, 224)

    img = Image.new('RGB', (W, H), PAPER)
    d = ImageDraw.Draw(img)

    # 纸张纹理：细横线
    for y in range(0, H, 6):
        d.line([(0, y), (W, y)], fill=(238, 234, 225))

    # 顶部色块
    d.rectangle((0, 0, W, 168), fill=INK)
    f_top = font(34, True)
    d.text((60, 44), '来点工具 · 小说专区', font=f_top, fill=PAPER)
    f_top2 = font(24, False)
    d.text((60, 100), 'NOVEL  PACK  /  2026  EDITION', font=f_top2, fill=GRAY)

    # 红色标签（旋转感用方块错位模拟，避免旋转文字）
    d.rectangle((W - 220, 0, W, 168), fill=RED)
    f_tag = font(40, True)
    tw = d.textlength('精校', font=f_tag)
    d.text(((W - 220 + W) / 2 - tw / 2, 30), '精校', font=f_tag, fill=PAPER)
    tw2 = d.textlength('收藏', font=f_tag)
    d.text(((W - 220 + W) / 2 - tw2 / 2, 88), '收藏', font=f_tag, fill=PAPER)

    # 主体：黄色大色块上的巨字
    d.rectangle((60, 222, W - 60, 560), fill=YELLOW)
    d.rectangle((60, 222, W - 60, 560), outline=INK, width=5)

    f_big = font(210, True)
    bw = d.textlength('600G', font=f_big)
    d.text(((W - bw) / 2, 236), '600G', font=f_big, fill=INK)

    f_sub = font(58, True)
    center(d, '小 说 合 集', 458, f_sub, RED)

    # 黑色数量条
    d.rectangle((60, 592, W - 60, 674), fill=TEAL)
    f_num = font(40, True)
    center(d, '共 69235 本  ·  TXT 格式', 612, f_num, PAPER)

    # 卖点：左右交错的两栏标签
    f_pt = font(31, False)
    pts = [
        '全网热门小说 基本都收录',
        '近 600G 超大合集  一次存够',
        '多为精校版  排版干净无乱码',
        '免费无广告  配本地阅读器即看',
        '支持离线阅读  手机电脑都能用',
    ]
    y = 720
    for i, p in enumerate(pts):
        pw = d.textlength(p, font=f_pt)
        if i % 2 == 0:
            box = (78, y - 8, 78 + pw + 40, y + 52)
            d.rectangle(box, fill=TEAL_50, outline=INK, width=3)
            d.text((98, y), p, font=f_pt, fill=(18, 74, 76))
        else:
            box = (W - 78 - pw - 40, y - 8, W - 78, y + 52)
            d.rectangle(box, fill=YELLOW_50, outline=INK, width=3)
            d.text((W - 78 - pw - 20, y), p, font=f_pt, fill=(120, 88, 12))
        y += 74

    # 下载区（黑框卡片）
    card = (78, 1116, W - 78, 1366)
    d.rectangle(card, fill=PAPER, outline=INK, width=5)
    d.rectangle((78, 1116, W - 78, 1186), fill=INK)

    f_hint = font(38, True)
    center(d, '下载链接', 1128, f_hint, PAPER)

    bar = mosaic_bar(W - 250, 70, PAPER, (150, 148, 140), (110, 108, 102), [70, 34, 52, 28, 60, 40], 16, blur=7)
    img.paste(bar, (125, 1206))

    f_cta = font(50, True)
    center(d, '工具箱 - 小说专区获取', 1294, f_cta, RED)

    out = os.path.join(DESKTOP, '海报-杂志拼贴版.png')
    img.save(out, 'PNG')
    return out


a = style_dark()
b = style_magazine()
print('已生成:')
print(' ', a)
print(' ', b)
