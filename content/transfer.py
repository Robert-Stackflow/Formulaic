#!/usr/bin/env python3
"""
将 content 目录下的所有 .md 文件转换为 .mdx 文件
"""

from pathlib import Path


def convert_md_to_mdx(content_dir: Path, dry_run: bool = False):
    """
    将目录下的所有 .md 文件转换为 .mdx 文件

    Args:
        content_dir: content 目录路径
        dry_run: 如果为 True，只显示将要转换的文件，不实际执行
    """
    md_files = list(content_dir.rglob("*.md"))

    if not md_files:
        print("没有找到 .md 文件")
        return

    print(f"找到 {len(md_files)} 个 .md 文件")
    print()

    converted_count = 0
    skipped_count = 0

    for md_file in md_files:
        # 跳过 node_modules 和 .git 目录
        if 'node_modules' in md_file.parts or '.git' in md_file.parts:
            continue

        # 生成新的 .mdx 文件路径
        mdx_file = md_file.with_suffix('.mdx')

        # 检查 .mdx 文件是否已存在
        if mdx_file.exists():
            print(f"⏭️  跳过 (已存在): {md_file.relative_to(content_dir)} -> {mdx_file.name}")
            skipped_count += 1
            continue

        if dry_run:
            print(f"🔄 将转换: {md_file.relative_to(content_dir)} -> {mdx_file.name}")
        else:
            try:
                # 重命名文件
                md_file.rename(mdx_file)
                print(f"✅ 已转换: {md_file.relative_to(content_dir)} -> {mdx_file.name}")
                converted_count += 1
            except Exception as e:
                print(f"❌ 转换失败: {md_file.relative_to(content_dir)} - {e}")

    print()
    print("=" * 60)
    if dry_run:
        print("预览模式 - 未实际执行转换")
        print(f"将转换: {len(md_files) - skipped_count} 个文件")
        print(f"将跳过: {skipped_count} 个文件 (已存在 .mdx)")
    else:
        print(f"✅ 成功转换: {converted_count} 个文件")
        print(f"⏭️  跳过: {skipped_count} 个文件 (已存在 .mdx)")
        print(f"📊 总计: {len(md_files)} 个文件")
    print("=" * 60)


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="将 content 目录下的所有 .md 文件转换为 .mdx 文件"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="预览模式，只显示将要转换的文件，不实际执行"
    )
    parser.add_argument(
        "--path",
        type=str,
        default=".",
        help="content 目录路径 (默认: 当前目录)"
    )

    args = parser.parse_args()

    content_dir = Path(args.path).resolve()

    if not content_dir.exists():
        print(f"❌ 错误: 目录不存在: {content_dir}")
        return

    print(f"📁 扫描目录: {content_dir}")
    print()

    if args.dry_run:
        print("🔍 预览模式 - 不会实际修改文件")
        print()

    # 询问用户确认
    if not args.dry_run:
        response = input("⚠️  这将重命名所有 .md 文件为 .mdx，是否继续? (y/N): ")
        if response.lower() != 'y':
            print("❌ 已取消")
            return
        print()

    convert_md_to_mdx(content_dir, args.dry_run)


if __name__ == '__main__':
    main()
