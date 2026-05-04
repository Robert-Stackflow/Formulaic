from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import Optional

FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.S)
KEY_VALUE_RE = re.compile(r"^([A-Za-z0-9_\-]+)\s*:\s*(.*)$")
INDEX_RE = re.compile(r"^(\d+)")


def parse_frontmatter(text: str) -> dict[str, object]:
    """解析 Markdown 文件开头的 YAML frontmatter。"""
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}

    block = match.group(1)
    data: dict[str, object] = {}
    current_list_key: Optional[str] = None

    for raw_line in block.splitlines():
        line = raw_line.rstrip()
        if not line.strip():
            continue

        if line.startswith("  - ") and current_list_key:
            value = line[4:].strip()
            data.setdefault(current_list_key, [])
            assert isinstance(data[current_list_key], list)
            data[current_list_key].append(value)
            continue

        current_list_key = None
        kv_match = KEY_VALUE_RE.match(line)
        if not kv_match:
            continue

        key, value = kv_match.group(1), kv_match.group(2).strip()
        if value == "":
            data[key] = []
            current_list_key = key
            continue

        if value.startswith('"') and value.endswith('"') and len(value) >= 2:
            value = value[1:-1]
        elif value.startswith("'") and value.endswith("'") and len(value) >= 2:
            value = value[1:-1]

        data[key] = value

    return data


def build_new_name(frontmatter: dict[str, object]) -> Optional[str]:
    """根据 frontmatter 生成新文件名：index-id-slug.mdx。"""
    file_id = frontmatter.get("id")
    slug = frontmatter.get("slug")
    if file_id is None or slug is None:
        return None

    # 兼容旧逻辑：如果文件名没有前缀 index，则返回 None，调用方会跳过。
    return f"{str(file_id).strip()}-{str(slug).strip()}.mdx"


def build_target_name(md_file: Path, frontmatter: dict[str, object]) -> Optional[str]:
    """根据源文件名前缀 index 与 frontmatter 生成目标文件名。"""
    match = INDEX_RE.match(md_file.stem)
    if not match:
        return None

    index = match.group(1)
    new_name = build_new_name(frontmatter)
    if not new_name:
        return None

    return f"{index}-{new_name}"


def rename_markdown_files(root: Path, dry_run: bool = True) -> None:
    for md_file in root.rglob("*.md"):
        text = md_file.read_text(encoding="utf-8")
        frontmatter = parse_frontmatter(text)
        new_name = build_target_name(md_file, frontmatter)

        if not new_name:
            print(
                f"跳过：{md_file}，未找到文件名前缀 index 或完整的 frontmatter id/slug"
            )
            continue

        target = md_file.with_name(new_name)
        if target == md_file:
            print(f"跳过：{md_file}，文件名已符合目标格式")
            continue

        if target.exists():
            print(f"冲突：{target} 已存在，跳过 {md_file}")
            continue

        if dry_run:
            print(f"预览：{md_file.name} -> {target.name}")
        else:
            md_file.rename(target)
            print(f"已重命名：{md_file.name} -> {target.name}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="遍历 Markdown 文件，根据 frontmatter 重命名为 id-slug.mdx"
    )
    parser.add_argument(
        "root",
        nargs="?",
        default=str(Path.cwd()),
        help="要遍历的根目录，默认当前目录",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="真正执行重命名；默认只预览，不修改文件",
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        raise FileNotFoundError(f"目录不存在：{root}")

    rename_markdown_files(root, dry_run=not args.apply)


if __name__ == "__main__":
    main()
