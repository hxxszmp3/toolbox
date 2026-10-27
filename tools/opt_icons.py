# 图标压缩：把大尺寸 PNG 缩到卡片实际显示尺寸附近，并做颜色量化
# 背景：卡片图标只显示 40px，但 sparkle.png / mobi.png 是 1024×1024，
#       sparkle 单个 1.5MB，占 icons/ 总量 2.3MB 的 65%，首屏被它拖慢。
# 用法：python tools/opt_icons.py
# 幂等：已是最优尺寸且体积达标则跳过，中途可随时重跑。
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICON_DIR = os.path.join(ROOT, 'icons')

# 卡片图标显示 40px；取 128px 留足 3 倍余量覆盖高分屏，避免大屏下发虚
TARGET = 128
MIN_SIZE = 160      # 小于此尺寸不动，避免反复处理已很小的图
TARGET_BYTES = 24 * 1024   # 单图目标上限，超出则更强量化


def human(n):
    return '%.1fK' % (n / 1024)


def total_dir():
    return sum(os.path.getsize(os.path.join(ICON_DIR, f)) for f in os.listdir(ICON_DIR))


def process(path):
    name = os.path.basename(path)
    orig = os.path.getsize(path)
    try:
        im = Image.open(path)
    except Exception as e:
        return name, orig, orig, '跳过(无法读取: %s)' % e

    im.load()
    w, h = im.size
    if max(w, h) <= MIN_SIZE and orig <= TARGET_BYTES:
        return name, orig, orig, '已最优'

    # 超大图先缩到目标尺寸；小图保留原尺寸只做量化
    if max(w, h) > TARGET:
        scale = TARGET / float(max(w, h))
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))),
                       Image.LANCZOS)

    # 量化分两种走法：
    # 1) 带透明通道的图 → FASTOCTREE + transparency=0，保留透明像素。
    #    绝不能把 alpha 烘进白底再量化，否则四周出现白边，
    #    在卡片的圆角裁切下非常明显（踩过的坑）。
    # 2) 不带透明的 RGB 图 → 白底烘焙法（本来就无 alpha，烘焙等价于直接量化）。
    has_alpha = im.mode in ('RGBA', 'LA') or (
        im.mode == 'P' and 'transparency' in im.info)

    if has_alpha:
        im = im.convert('RGBA')
        for colors in (256, 128, 64):
            q = im.quantize(colors=colors, method=Image.FASTOCTREE,
                            dither=Image.FLOYDSTEINBERG)
            tmp = path + '.tmp.png'
            q.save(tmp, 'PNG', optimize=True, transparency=0)
            new = os.path.getsize(tmp)
            if new <= TARGET_BYTES or colors == 64:
                os.replace(tmp, path)
                break
            os.remove(tmp)
    else:
        im = im.convert('RGB')
        # 先试 256 色，不够小再降到 128/64
        for colors in (256, 128, 64):
            q = im.quantize(colors=colors, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
            tmp = path + '.tmp.png'
            q.save(tmp, 'PNG', optimize=True)
            new = os.path.getsize(tmp)
            if new <= TARGET_BYTES or colors == 64:
                os.replace(tmp, path)
                break
            os.remove(tmp)

    return name, orig, os.path.getsize(path), '%.1f%%' % ((1 - os.path.getsize(path) / orig) * 100)


def main():
    before = total_dir()
    print('压缩前：%d 个图标，共 %s' % (len(os.listdir(ICON_DIR)), human(before)))
    print('-' * 66)
    saved = []
    for f in sorted(os.listdir(ICON_DIR)):
        p = os.path.join(ICON_DIR, f)
        if not os.path.isfile(p):
            continue
        name, orig, new, note = process(p)
        flag = '' if orig == new else '  <-- 节省 %s' % human(orig - new)
        print('%-24s %8s -> %-8s %s%s' % (name[:24], human(orig), human(new), note, flag))
        if orig != new:
            saved.append((name, orig - new))

    after = total_dir()
    print('-' * 66)
    print('压缩后：共 %s，减少 %s（降幅 %.0f%%）' % (
        human(after), human(before - after), (before - after) / float(before) * 100))
    saved.sort(key=lambda x: -x[1])
    if saved:
        print('收益前五：')
        for n, d in saved[:5]:
            print('  %-22s 省 %s' % (n[:22], human(d)))


if __name__ == '__main__':
    main()
