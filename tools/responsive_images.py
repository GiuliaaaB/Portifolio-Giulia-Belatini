from pathlib import Path
import re
from PIL import Image
root = Path(__file__).resolve().parents[1]
# Keep full-resolution originals; browsers select smaller derivatives as needed.
def variant(path, width):
    dest = path.parent / 'responsive' / f'{path.stem}-{width}.webp'
    dest.parent.mkdir(exist_ok=True)
    if not dest.exists():
        with Image.open(path) as im:
            im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS).save(dest, 'WEBP', quality=80, method=6)
    return dest
for page in root.rglob('index.html'):
    text = page.read_text(encoding='utf-8')
    def update(match):
        tag = match[0]
        src = re.search(r'src="([^"]+)"', tag)
        if not src or not src[1].endswith('.webp'): return tag
        url = src[1]
        if '/responsive/' in url: return tag
        tag = re.sub(r'\s+(?:srcset|sizes)="[^"]*"', '', tag)
        path = page.parent / url
        with Image.open(path) as im: width, height = im.size
        # Gallery thumbnails have an empty alt; the containing button supplies the label.
        if 'alt=""' in tag:
            dest = path.parent / 'responsive' / f'{path.stem}-thumb.webp'
            dest.parent.mkdir(exist_ok=True)
            with Image.open(path) as im:
                crop_height = min(im.height, round(im.width * 150 / 240))
                im.crop((0, 0, im.width, crop_height)).resize((240, 150), Image.Resampling.LANCZOS).save(dest, 'WEBP', quality=75, method=6)
            new_url = url.rsplit('/', 1)[0] + '/responsive/' + dest.name
            tag = tag.replace(url, new_url)
            tag = re.sub(r'width="\d+"', 'width="240"', tag)
            return re.sub(r'height="\d+"', 'height="150"', tag)
        entries = []
        for w in (480, 960):
            if w < width:
                dest = variant(path, w)
                entries.append(url.rsplit('/', 1)[0] + '/responsive/' + dest.name + f' {w}w')
        entries.append(f'{url} {width}w')
        if page.parent == root:
            sizes = '(max-width: 700px) 90vw, 44vw'
            tag = tag.replace(' fetchpriority="high"', '')
            if 'loading=' not in tag: tag = tag[:-1] + ' loading="lazy">'
        else:
            sizes = '(max-width: 800px) 90vw, (max-width: 1200px) 50vw, 800px'
        return tag[:-1] + ' srcset="' + ', '.join(entries) + '" sizes="' + sizes + '">'
    text = re.sub(r'<img\b[^>]*>', update, text)
    page.write_text(text, encoding='utf-8')
print('Responsive images and cropped gallery thumbnails generated.')
