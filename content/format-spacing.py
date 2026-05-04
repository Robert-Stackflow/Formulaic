#!/usr/bin/env python3
"""
使用 pangu 为 MDX 文件自动添加中英文之间的空格
需要先安装: pip install pangu
"""

import re
from pathlib import Path
from typing import Tuple


def install_pangu():
    """检查并安装 pangu"""
    try:
        import pangu
        return True
    except ImportError:
        print("pangu 未安装，正在安装...")
        import subprocess
        try:
            subprocess.check_call(["pip", "install", "pangu"])
            print("✅ pangu 安装成功")
            return True
        except Exception as e:
            print(f"❌ pangu 安装失败: {e}")
            print("请手动运行: pip install pangu")
            return False


def extract_frontmatter(content: str) -> Tuple[str, str, str]:
    """
    提取 frontmatter、内容和代码块
    返回: (frontmatter, content, full_content)
    """
    # 匹配 frontmatter
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.match(frontmatter_pattern, content, re.DOTALL)

    if match:
        frontmatter = match.group(0)
        rest_content = content[len(frontmatter):]
        return frontmatter, rest_content, content
    else:
        return "", content, content


def protect_code_blocks(content: str) -> Tuple[str, dict]:
    """
    保护代码块，避免被 pangu 处理
    返回: (处理后的内容, 代码块映射)
    """
    code_blocks = {}
    counter = 0

    # 匹配代码块 ```...```
    def replace_code_block(match):
        nonlocal counter
        placeholder = f"___CODE_BLOCK_{counter}___"
        code_blocks[placeholder] = match.group(0)
        counter += 1
        return placeholder

    # 匹配行内代码 `...`
    def replace_inline_code(match):
        nonlocal counter
        placeholder = f"___INLINE_CODE_{counter}___"
        code_blocks[placeholder] = match.group(0)
        counter += 1
        return placeholder

    # 先保护代码块
    content = re.sub(r'```[\s\S]*?```', replace_code_block, content)
    # 再保护行内代码
    content = re.sub(r'`[^`\n]+?`', replace_inline_code, content)

    return content, code_blocks


def restore_code_blocks(content: str, code_blocks: dict) -> str:
    """恢复代码块"""
    for placeholder, original in code_blocks.items():
        content = content.replace(placeholder, original)
    return content


def format_mdx_file(file_path: Path, dry_run: bool = False) -> bool:
    """
    格式化单个 MDX 文件
    返回: 是否有修改
    """
    try:
        import pangu
    except ImportError:
        print("❌ 请先安装 pangu: pip install pangu")
        return False

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        # 提取 frontmatter
        frontmatter, content, _ = extract_frontmatter(original_content)

        # 保护代码块
        protected_content, code_blocks = protect_code_blocks(content)

        # 使用 pangu 格式化
        formatted_content = pangu.spacing_text(protected_content)

        # 恢复代码块
        formatted_content = restore_code_blocks(formatted_content, code_blocks)

        # 组合 frontmatter 和内容
        final_content = frontmatter + formatted_content

        # 检查是否有变化
        if final_content == original_content:
            return False

        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(final_content)

        return True

    except Exception as e:
        print(f"❌ 处理文件失败 {file_path}: {e}")
        return False


def format_all_mdx_files(content_dir: Path, dry_run: bool = False):
    """格式化所有 MDX 文件"""

    # 查找所有 .mdx 和 .md 文件
    mdx_files = list(content_dir.rglob("*.mdx")) + list(content_dir.rglob("*.md"))

    if not mdx_files:
        print("没有找到 MDX/MD 文件")
        return

    print(f"找到 {len(mdx_files)} 个文件")
    print()

    modified_count = 0
    skipped_count = 0

    for mdx_file in mdx_files:
        # 跳过 node_modules 和 .git 目录
        if 'node_modules' in mdx_file.parts or '.git' in mdx_file.parts:
            continue

        relative_path = mdx_file.relative_to(content_dir)

        if dry_run:
            # 预览模式：检查是否需要修改
            has_changes = format_mdx_file(mdx_file, dry_run=True)
            if has_changes:
                print(f"🔄 将修改: {relative_path}")
                modified_count += 1
            else:
                print(f"⏭️  无需修改: {relative_path}")
                skipped_count += 1
        else:
            # 实际修改
            has_changes = format_mdx_file(mdx_file, dry_run=False)
            if has_changes:
                print(f"✅ 已格式化: {relative_path}")
                modified_count += 1
            else:
                print(f"⏭️  无需修改: {relative_path}")
                skipped_count += 1

    print()
    print("=" * 60)
    if dry_run:
        print("预览模式 - 未实际执行修改")
        print(f"将修改: {modified_count} 个文件")
        print(f"无需修改: {skipped_count} 个文件")
    else:
        print(f"✅ 已格式化: {modified_count} 个文件")
        print(f"⏭️  无需修改: {skipped_count} 个文件")
        print(f"📊 总计: {len(mdx_files)} 个文件")
    print("=" * 60)


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="使用 pangu 为 MDX 文件自动添加中英文之间的空格"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="预览模式，只显示将要修改的文件，不实际执行"
    )
    parser.add_argument(
        "--path",
        type=str,
        default=".",
        help="content 目录路径 (默认: 当前目录)"
    )

    args = parser.parse_args()

    # 检查并安装 pangu
    if not install_pangu():
        return

    content_dir = Path(args.path).resolve()

    if not content_dir.exists():
        print(f"❌ 错误: 目录不存在: {content_dir}")
        return

    print(f"📁 扫描目录: {content_dir}")
    print()

    if args.dry_run:
        print("🔍 预览模式 - 不会实际修改文件")
        print()
    else:
        response = input("⚠️  这将修改所有 MDX/MD 文件，添加中英文空格，是否继续? (y/N): ")
        if response.lower() != 'y':
            print("❌ 已取消")
            return
        print()

    format_all_mdx_files(content_dir, args.dry_run)


if __name__ == '__main__':
    main()
