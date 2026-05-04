from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Iterable

FOLDER_TITLE_RE = re.compile(r"^\d+\.\s*(.+)$")
LEADING_INDEX_RE = re.compile(r"^(\d+)")
FOLDER_SLUG_TO_TITLE = {
    "hash": "哈希",
    "two-pointers": "双指针",
    "sliding-window": "滑动窗口",
    "substring": "子串",
    "array": "普通数组",
    "matrix": "矩阵",
    "linked-list": "链表",
    "binary-tree": "二叉树",
    "graph": "图论",
    "backtracking": "回溯",
    "binary-search": "二分查找",
    "stack": "栈",
    "heap": "堆",
    "greedy": "贪心算法",
    "dynamic-programming": "动态规划",
    "multidimensional-dp": "多维动态规划",
    "techniques": "技巧",
}


def parse_title(name: str) -> str:
    """从文件夹名中提取标题，兼容 1. 哈希 和 1-hash。"""
    match = FOLDER_TITLE_RE.match(name)
    if match:
        return match.group(1).strip()

    if "-" in name:
        prefix, slug = name.split("-", 1)
        if prefix.strip().isdigit() and slug.strip() in FOLDER_SLUG_TO_TITLE:
            return FOLDER_SLUG_TO_TITLE[slug.strip()]

    return name.strip()


def sort_key(path: Path) -> tuple[int, int | str, str]:
    """按照前缀数字优先排序，没有数字前缀的排在后面。"""
    match = LEADING_INDEX_RE.match(path.stem if path.is_file() else path.name)
    if match:
        return (0, int(match.group(1)), path.name)
    return (1, path.name)


def collect_pages(folder: Path) -> list[str]:
    """收集当前文件夹的页面列表，包含 index 以及直接子项。"""
    pages: list[str] = ["index"]

    children = [
        child
        for child in folder.iterdir()
        if child.name not in {"index.mdx", "meta.json"}
    ]
    children.sort(key=sort_key)

    for child in children:
        if child.is_file() and child.suffix.lower() in {".md", ".mdx"}:
            pages.append(child.stem)
        elif child.is_dir():
            pages.append(child.name)

    return pages


def build_index_mdx(title: str) -> str:
    """生成 index.mdx 内容。"""
    description = f"{title}相关的题目"
    return (
        "---\n"
        f"title: {title}\n"
        f"description: {description}\n"
        "index: true\n"
        "---\n"
    )


def build_meta_json(title: str, pages: Iterable[str]) -> str:
    """生成 meta.json 内容。"""
    data = {
        "title": title,
        "description": f"{title}相关的题目",
        "root": True,
        "pages": list(pages),
    }
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def generate_for_folder(folder: Path) -> None:
    title = parse_title(folder.name)
    index_path = folder / "index.mdx"
    meta_path = folder / "meta.json"

    index_path.write_text(build_index_mdx(title), encoding="utf-8")
    meta_path.write_text(
        build_meta_json(title, collect_pages(folder)), encoding="utf-8"
    )

    print(f"已生成：{index_path}")
    print(f"已生成：{meta_path}")


def iter_target_folders(root: Path) -> Iterable[Path]:
    """遍历 root 下所有需要生成文件的子文件夹。"""
    for path in root.rglob("*"):
        if path.is_dir():
            yield path


def main() -> None:
    parser = argparse.ArgumentParser(
        description="为每个文件夹生成 index.mdx 和 meta.json"
    )
    parser.add_argument(
        "root",
        nargs="?",
        default=str(Path.cwd()),
        help="要处理的根目录，默认当前目录",
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        raise FileNotFoundError(f"目录不存在：{root}")

    for folder in iter_target_folders(root):
        # 跳过根目录本身，只处理其内部文件夹。
        if folder == root:
            continue
        generate_for_folder(folder)


if __name__ == "__main__":
    main()
