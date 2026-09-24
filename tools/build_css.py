"""Conservatively compact CSS whitespace without altering strings or rule order."""
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
src = (root / 'css/style.css').read_text(encoding='utf-8')
# Keep quoted strings untouched, including SVG data URLs and escaped characters.
tokens = re.findall(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|/\*[\s\S]*?\*/|\s+|[^\s\'"/]+|.', src)
result = ''.join(t if t.startswith(('"', "'")) else '' if t.startswith('/*') else ' ' if t.isspace() else t for t in tokens).strip()
(root / 'css/style.min.css').write_text(result, encoding='utf-8')
print(f'CSS: {len(src.encode()):,} -> {len(result.encode()):,} bytes')
for page in root.rglob('index.html'):
    text = page.read_text(encoding='utf-8')
    text = text.replace('style.css?v=20260924-11', 'style.min.css?v=20260924-11')
    page.write_text(text, encoding='utf-8')
