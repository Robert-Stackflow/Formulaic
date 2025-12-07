import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const { words } = await request.json();

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        { error: "请提供要导入的敏感词列表" },
        { status: 400 }
      );
    }

    // 获取现有的敏感词
    const db = getDb();
    const existingWords = db
      .prepare("SELECT word FROM sensitive_words")
      .all() as { word: string }[];
    const existingSet = new Set(existingWords.map((w) => w.word.toLowerCase()));

    // 处理新格式（支持对象和字符串）
    const wordsToImport = words.map((item) => {
      if (typeof item === "string") {
        // 兼容旧格式：纯字符串
        return {
          word: item.trim(),
          type: "text",
          is_regex: 0,
        };
      } else {
        // 新格式：对象
        return {
          word: item.word.trim(),
          type: item.type || "text",
          is_regex: item.is_regex || 0,
        };
      }
    });

    // 过滤掉已存在的词和空词
    const newWords = wordsToImport.filter(
      (item) =>
        item.word.length > 0 && !existingSet.has(item.word.toLowerCase())
    );

    // 验证正则表达式
    let invalidRegexCount = 0;
    const validWords = newWords.filter((item) => {
      if (item.type === "regex" || item.is_regex === 1) {
        try {
          new RegExp(item.word);
          return true;
        } catch (e) {
          invalidRegexCount++;
          return false;
        }
      }
      return true;
    });

    // 批量插入
    const stmt = db.prepare(
      "INSERT INTO sensitive_words (word, type, is_regex) VALUES (?, ?, ?)"
    );
    const insertMany = db.transaction(
      (items: Array<{ word: string; type: string; is_regex: number }>) => {
        for (const item of items) {
          stmt.run(item.word, item.type, item.is_regex);
        }
      }
    );

    insertMany(validWords);

    return NextResponse.json({
      success: true,
      count: validWords.length,
      skipped: words.length - validWords.length,
      invalidRegex: invalidRegexCount,
    });
  } catch (error) {
    console.error("Batch import error:", error);
    return NextResponse.json({ error: "批量导入失败" }, { status: 500 });
  }
}
