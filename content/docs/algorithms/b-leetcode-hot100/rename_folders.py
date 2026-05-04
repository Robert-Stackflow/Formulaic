from __future__ import annotations

import argparse
from pathlib import Path

FOLDER_SLUG_MAP = {
    "哈希": "hash",
    "双指针": "two-pointers",
    "滑动窗口": "sliding-window",
    "子串": "substring",
    "普通数组": "array",
    "矩阵": "matrix",
    "链表": "linked-list",
    "二叉树": "binary-tree",
    "图论": "graph",
    "回溯": "backtracking",
    "二分查找": "binary-search",
    "栈": "stack",
    "堆": "heap",
    "贪心算法": "greedy",
    "动态规划": "dynamic-programming",
    "多维动态规划": "multidimensional-dp",
    "技巧": "techniques",
}


def build_target_name(folder: Path) -> str | None:
    """根据中文目录名生成英文 slug 名称，例如 1. 哈希 -> 1-hash。"""
    name = folder.name.strip()
    if "." not in name:
        return None

    prefix, rest = name.split(".", 1)
    index = prefix.strip()
    title = rest.strip()
    slug = FOLDER_SLUG_MAP.get(title)
    if not index.isdigit() or not slug:
        return None

    return f"{index}-{slug}"


def rename_folders(root: Path, dry_run: bool = True) -> None:
    folders = [p for p in root.iterdir() if p.is_dir()]
    folders.sort(
        key=lambda p: (
            int(p.name.split(".", 1)[0].strip()) if p.name[:1].isdigit() else 10**9
        )
    )

    for folder in folders:
        target_name = build_target_name(folder)
        if not target_name:
            print(f"跳过：{folder.name}，无法解析目标名称")
            continue

        target = folder.with_name(target_name)
        if target.exists():
            print(f"冲突：{target.name} 已存在，跳过 {folder.name}")
            continue

        if dry_run:
            print(f"预览：{folder.name} -> {target.name}")
        else:
            folder.rename(target)
            print(f"已重命名：{folder.name} -> {target.name}")


def main() -> None:
    parser = argparse.ArgumentParser(description="重命名一级文件夹为 index-slug 形式")
    parser.add_argument(
        "root",
        nargs="?",
        default=str(Path.cwd()),
        help="要处理的根目录，默认当前目录",
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

    rename_folders(root, dry_run=not args.apply)


if __name__ == "__main__":
    main()
