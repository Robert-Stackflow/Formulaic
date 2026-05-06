/**
 * 统计文本字数（中文字符 + 英文单词）
 */
export function countWords(text: string): number {
  if (!text) return 0;

  // 移除 Markdown 语法
  let cleanText = text
    // 移除代码块
    .replace(/```[\s\S]*?```/g, "")
    // 移除行内代码
    .replace(/`[^`]*`/g, "")
    // 移除链接
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // 移除图片
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, "")
    // 移除列表标记
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    // 移除引用标记
    .replace(/^>\s+/gm, "")
    // 移除粗体和斜体标记
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1")
    // 移除删除线
    .replace(/~~([^~]+)~~/g, "$1")
    // 移除 HTML 标签
    .replace(/<[^>]+>/g, "")
    // 移除多余空白
    .replace(/\s+/g, " ")
    .trim();

  // 统计中文字符
  const chineseChars = cleanText.match(/[一-龥]/g) || [];
  const chineseCount = chineseChars.length;

  // 移除中文字符后统计英文单词
  const textWithoutChinese = cleanText.replace(/[一-龥]/g, " ");
  const englishWords = textWithoutChinese
    .split(/\s+/)
    .filter((word) => word.length > 0 && /[a-zA-Z]/.test(word));
  const englishCount = englishWords.length;

  return chineseCount + englishCount;
}

/**
 * 计算阅读时间（分钟）
 * 中文：300字/分钟
 * 英文：200词/分钟
 */
export function calculateReadingTime(text: string): number {
  if (!text) return 0;

  const cleanText = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/<[^>]+>/g, "");

  // 统计中文字符
  const chineseChars = cleanText.match(/[一-龥]/g) || [];
  const chineseCount = chineseChars.length;

  // 统计英文单词
  const textWithoutChinese = cleanText.replace(/[一-龥]/g, " ");
  const englishWords = textWithoutChinese
    .split(/\s+/)
    .filter((word) => word.length > 0 && /[a-zA-Z]/.test(word));
  const englishCount = englishWords.length;

  // 计算阅读时间
  const chineseTime = chineseCount / 300; // 300字/分钟
  const englishTime = englishCount / 200; // 200词/分钟

  const totalMinutes = Math.ceil(chineseTime + englishTime);
  return Math.max(1, totalMinutes); // 至少1分钟
}
