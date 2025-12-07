import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import pangu from 'pangu';
import type { Root, Content, Text } from 'mdast';

// 解决 pangu 可能的类型缺失
const spacing = pangu.spacingText;

// 简单的 CJK (中日韩) 字符正则检测
const CJK_REGEX = /[\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

/**
 * 插件 1: 使用 Pangu 处理纯文本节点内部的中英文空格
 * (处理如: "我爱Coding" -> "我爱 Coding")
 */
const remarkPanguTextPlugin = () => {
  return (tree: Root) => {
    visit(tree, 'text', (node) => {
      if (node.value) {
        node.value = spacing(node.value);
      }
    });
  };
};

/**
 * 插件 2: 专门处理 InlineMath ($...$) 与周围文本的空格
 * (处理如: "中文$x$中文" -> "中文 $x$ 中文")
 */
const remarkMathSpacingPlugin = () => {
  return (tree: Root) => {
    // 遍历所有父节点 (Paragraph, Heading 等可能包含 phrasing content 的节点)
    visit(tree, (node: any) => {
      if (!node.children || !Array.isArray(node.children)) return;

      const children = node.children as Content[];

      // 遍历子节点寻找 inlineMath
      for (let i = 0; i < children.length; i++) {
        const current = children[i];

        if (current.type === 'inlineMath') {
          const prev = children[i - 1];
          const next = children[i + 1];

          // 1. 处理左侧: Text + InlineMath
          if (prev && prev.type === 'text') {
            const textNode = prev as Text;
            const lastChar = textNode.value.slice(-1);
            
            // 如果前一个文本节点以 CJK 结尾，且没有以空格结尾
            if (CJK_REGEX.test(lastChar) && !/\s$/.test(textNode.value)) {
              textNode.value += ' ';
            }
          }

          // 2. 处理右侧: InlineMath + Text
          if (next && next.type === 'text') {
            const textNode = next as Text;
            const firstChar = textNode.value.charAt(0);
            
            // 如果后一个文本节点以 CJK 开头，且没有以空格开头
            if (CJK_REGEX.test(firstChar) && !/^\s/.test(textNode.value)) {
              textNode.value = ' ' + textNode.value;
            }
          }
        }
      }
    });
  };
};

/**
 * 格式化单个文件
 */
async function formatFile(filePath: string) {
  try {
    const originalContent = await fs.readFile(filePath, 'utf-8');

    const processor = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ['yaml', 'toml']) 
      .use(remarkGfm)
      .use(remarkMath) // 必须启用，否则 $...$ 会被当成普通文本 text
      // .use(remarkMdx)
      
      // === 自定义处理流程 ===
      .use(remarkPanguTextPlugin)   // 1. 先处理文本内部
      .use(remarkMathSpacingPlugin) // 2. 再处理公式边缘
      // ===================
      
      .use(remarkStringify, {
        bullet: '-',
        fences: true,
        listItemIndent: 'one',
        resourceLink: true,
        rule: '-',
        // 关键配置：确保 math 输出时使用 $ 符号而不是其他格式
        handlers: {
          // 这里通常不需要手动配置 math handler，remark-math/remark-stringify 配合良好
          // 但保持默认配置能确保 $x$ 不会被转义
        }
      });

    const file = await processor.process(originalContent);
    const newContent = String(file);

    if (originalContent !== newContent) {
      await fs.writeFile(filePath, newContent, 'utf-8');
      console.log(`✅ Formatted: ${filePath}`);
    } else {
      console.log(`✨ Skipped (No changes): ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
  }
}

/**
 * 主函数
 */
async function main() {
  const rootDir = process.argv[2] || '.';
  console.log(`🔍 Searching in: ${path.resolve(rootDir)}`);

  const files = await glob('**/*.{md,mdx}', {
    cwd: rootDir,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**'],
    absolute: true,
  });

  if (files.length === 0) {
    console.log('⚠️  No markdown files found.');
    return;
  }

  console.log(`🚀 Found ${files.length} files. Processing...`);
  await Promise.all(files.map(file => formatFile(file)));
  console.log('🎉 Done!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});