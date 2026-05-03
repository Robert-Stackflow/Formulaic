#!/usr/bin/env python3
"""
统计 content 目录下的文档字符数、单词数等信息
"""

import os
import re
from pathlib import Path
from collections import defaultdict
from typing import Dict, Tuple


def remove_frontmatter(content: str) -> str:
    """移除 MDX 文件的 frontmatter"""
    # 匹配 --- 包裹的 frontmatter
    pattern = r'^---\s*\n.*?\n---\s*\n'
    return re.sub(pattern, '', content, flags=re.DOTALL)


def remove_code_blocks(content: str) -> str:
    """移除代码块"""
    # 移除 ``` 包裹的代码块
    pattern = r'```[\s\S]*?```'
    return re.sub(pattern, '', content)


def count_chinese_chars(text: str) -> int:
    """统计中文字符数"""
    return len(re.findall(r'[一-鿿]', text))


def count_english_words(text: str) -> int:
    """统计英文单词数"""
    # 移除中文字符后统计英文单词
    text_without_chinese = re.sub(r'[一-鿿]', '', text)
    words = re.findall(r'\b[a-zA-Z]+\b', text_without_chinese)
    return len(words)


def count_lines(content: str) -> int:
    """统计行数"""
    return len(content.splitlines())


def analyze_file(file_path: Path) -> Dict[str, int]:
    """分析单个文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 移除 frontmatter
        content_without_fm = remove_frontmatter(content)

        # 移除代码块
        content_without_code = remove_code_blocks(content_without_fm)

        return {
            'total_chars': len(content),
            'content_chars': len(content_without_fm),
            'text_chars': len(content_without_code),
            'chinese_chars': count_chinese_chars(content_without_code),
            'english_words': count_english_words(content_without_code),
            'lines': count_lines(content),
            'files': 1
        }
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return {
            'total_chars': 0,
            'content_chars': 0,
            'text_chars': 0,
            'chinese_chars': 0,
            'english_words': 0,
            'lines': 0,
            'files': 0
        }


def format_number(num: int) -> str:
    """格式化数字，添加千位分隔符"""
    return f"{num:,}"


def main():
    content_dir = Path(__file__).parent

    # 统计各个目录
    stats_by_dir = defaultdict(lambda: {
        'total_chars': 0,
        'content_chars': 0,
        'text_chars': 0,
        'chinese_chars': 0,
        'english_words': 0,
        'lines': 0,
        'files': 0
    })

    # 总计
    total_stats = {
        'total_chars': 0,
        'content_chars': 0,
        'text_chars': 0,
        'chinese_chars': 0,
        'english_words': 0,
        'lines': 0,
        'files': 0
    }

    # 遍历所有 .md 和 .mdx 文件
    for ext in ['*.md', '*.mdx']:
        for file_path in content_dir.rglob(ext):
            # 跳过 node_modules 等目录
            if 'node_modules' in file_path.parts or '.git' in file_path.parts:
                continue

            # 获取相对于 content 目录的第一级目录名
            try:
                relative_path = file_path.relative_to(content_dir)
                if len(relative_path.parts) > 1:
                    dir_name = relative_path.parts[0]
                else:
                    dir_name = 'root'
            except ValueError:
                dir_name = 'other'

            # 分析文件
            file_stats = analyze_file(file_path)

            # 累加到目录统计
            for key in file_stats:
                stats_by_dir[dir_name][key] += file_stats[key]
                total_stats[key] += file_stats[key]

    # 打印结果
    print("=" * 80)
    print("Content 目录文档统计")
    print("=" * 80)
    print()

    # 按目录打印
    print(f"{'目录':<20} {'文件数':>8} {'总字符':>12} {'中文字符':>12} {'英文单词':>12} {'行数':>10}")
    print("-" * 80)

    for dir_name in sorted(stats_by_dir.keys()):
        stats = stats_by_dir[dir_name]
        print(f"{dir_name:<20} {stats['files']:>8} "
              f"{format_number(stats['total_chars']):>12} "
              f"{format_number(stats['chinese_chars']):>12} "
              f"{format_number(stats['english_words']):>12} "
              f"{format_number(stats['lines']):>10}")

    print("-" * 80)
    print(f"{'总计':<20} {total_stats['files']:>8} "
          f"{format_number(total_stats['total_chars']):>12} "
          f"{format_number(total_stats['chinese_chars']):>12} "
          f"{format_number(total_stats['english_words']):>12} "
          f"{format_number(total_stats['lines']):>10}")
    print()

    # 详细统计
    print("=" * 80)
    print("详细统计")
    print("=" * 80)
    print(f"总文件数:           {format_number(total_stats['files'])}")
    print(f"总字符数:           {format_number(total_stats['total_chars'])}")
    print(f"内容字符数:         {format_number(total_stats['content_chars'])} (去除 frontmatter)")
    print(f"文本字符数:         {format_number(total_stats['text_chars'])} (去除代码块)")
    print(f"中文字符数:         {format_number(total_stats['chinese_chars'])}")
    print(f"英文单词数:         {format_number(total_stats['english_words'])}")
    print(f"总行数:             {format_number(total_stats['lines'])}")
    print()

    # 计算平均值
    if total_stats['files'] > 0:
        print("=" * 80)
        print("平均统计")
        print("=" * 80)
        print(f"平均每篇字符数:     {format_number(total_stats['total_chars'] // total_stats['files'])}")
        print(f"平均每篇中文字符:   {format_number(total_stats['chinese_chars'] // total_stats['files'])}")
        print(f"平均每篇英文单词:   {format_number(total_stats['english_words'] // total_stats['files'])}")
        print(f"平均每篇行数:       {format_number(total_stats['lines'] // total_stats['files'])}")
        print()


if __name__ == '__main__':
    main()
