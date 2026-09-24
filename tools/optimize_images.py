"""Optimize existing WebP files in place, keeping names and dimensions."""
from pathlib import Path
from io import BytesIO
from PIL import Image

root = Path(__file__).resolve().parents[1]
before = after = 0
for path in sorted((root / 'assets/img').rglob('*.webp')):
    original = path.stat().st_size
    before += original
    with Image.open(path) as image:
        image.load()
        size = image.size
        output = BytesIO()
        image.save(output, format='WEBP', quality=80, method=6)
    data = output.getvalue()
    with Image.open(BytesIO(data)) as check:
        check.load()
        assert check.size == size
    if len(data) < original:
        path.write_bytes(data)
    final = path.stat().st_size
    after += final
    print(f'{path.relative_to(root)}: {original:,} -> {final:,}', flush=True)
print(f'TOTAL: {before:,} -> {after:,} bytes; saved {100 * (1 - after / before):.1f}%')
