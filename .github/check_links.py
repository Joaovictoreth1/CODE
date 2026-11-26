from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.anchors = set()
        self.links = []
        self.feed(path.read_text(encoding="utf-8-sig"))

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if value and (name == "id" or (tag == "a" and name == "name")):
                self.anchors.add(value)
            if value and name in ("href", "src", "poster", "action"):
                self.links.append((self.getpos()[0], value))


def main():
    root = Path.cwd()
    pages = {path.resolve(): Page(path) for path in sorted(root.glob("*.html"))}
    if not pages:
        raise SystemExit("No HTML files found")
    failures = []
    for source, page in pages.items():
        for line, link in page.links:
            url = urlsplit(link)
            if url.scheme or url.netloc:
                continue
            path = unquote(url.path)
            target = (root / path.lstrip("/") if path.startswith("/") else source.parent / path).resolve() if path else source
            if target.is_dir():
                target /= "index.html"
            if not target.is_file() or not target.is_relative_to(root):
                failures.append(f"{source.name}:{line}: missing local target {link}")
            elif url.fragment and target.suffix == ".html":
                target_page = pages.get(target) or Page(target)
                if unquote(url.fragment) not in target_page.anchors:
                    failures.append(f"{source.name}:{line}: missing local anchor {link}")
    if failures:
        raise SystemExit("\n".join(failures))
    print(f"Local links OK ({len(pages)} HTML files)")


if __name__ == "__main__":
    main()
