"""Dependency-free source validation and production packaging for the static site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import shutil
import sys

ROOT = Path(__file__).resolve().parent.parent
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.nodes = []
        self.stack = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.nodes.append((tag, attrs))
        if tag not in VOID:
            self.stack.append(tag)
    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(f'Unexpected closing tag: {tag}')
        else:
            self.stack.pop()


def check():
    parser = SiteParser()
    parser.feed((ROOT / 'index.html').read_text(encoding='utf-8-sig'))
    errors = parser.errors
    if parser.stack:
        errors.append(f'Unclosed tags: {parser.stack}')
    ids = [a['id'] for _, a in parser.nodes if 'id' in a]
    if len(ids) != len(set(ids)):
        errors.append('Duplicate HTML IDs')
    if sum(t == 'h1' for t, _ in parser.nodes) != 1:
        errors.append('Expected exactly one h1')
    assets = {'index.html'}
    for tag, attrs in parser.nodes:
        for key in ('href', 'src'):
            value = attrs.get(key, '')
            if value.startswith('#') and value[1:] not in ids:
                errors.append(f'Broken anchor: {value}')
            elif value and not urlsplit(value).scheme and not value.startswith('#'):
                relative = urlsplit(value).path
                if not (ROOT / relative).is_file():
                    errors.append(f'Missing asset: {relative}')
                assets.add(relative)
        if tag == 'img' and not all(key in attrs for key in ('alt','width','height')):
            errors.append('Image missing alt or intrinsic dimensions')
        if tag in ('input','select','textarea'):
            if not any(t == 'label' and a.get('for') == attrs.get('id') for t, a in parser.nodes):
                errors.append(f'Unlabelled control: {attrs.get("id")}')
        if tag == 'a' and attrs.get('target') == '_blank' and 'noopener' not in attrs.get('rel',''):
            errors.append('External link missing noopener')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'PASS: HTML nesting, unique IDs, anchors, labels, image attributes, and {len(assets)} local files.')
    return assets

if __name__ == '__main__':
    assets = check()
    if len(sys.argv) > 1 and sys.argv[1] == 'build':
        output = ROOT / 'dist'
        output.mkdir(exist_ok=True)
        for asset in sorted(assets):
            destination = output / asset
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / asset, destination)
        print(f'PASS: Production site packaged in dist ({sum((output / a).stat().st_size for a in assets):,} bytes).')
