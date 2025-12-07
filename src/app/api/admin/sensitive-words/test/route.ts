import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils";

// 测试文本是否包含敏感词
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "请提供要测试的文本" },
        { status: 400 }
      );
    }

    // 获取所有敏感词
    const db = getDb();
    const words = db.prepare("SELECT * FROM sensitive_words").all() as Array<{
      id: number;
      word: string;
      type: string;
      is_regex: number;
    }>;

    const matches: Array<{ word: string; type: string }> = [];
    const lowerText = text.toLowerCase();

    for (const wordData of words) {
      const isRegex = wordData.is_regex === 1 || wordData.type === "regex";

      if (isRegex) {
        // 正则表达式匹配
        try {
          const regex = new RegExp(wordData.word, "gi");
          if (regex.test(text)) {
            matches.push({
              word: wordData.word,
              type: "regex",
            });
          }
        } catch (e) {
          // 忽略无效的正则表达式
          console.error(`Invalid regex: ${wordData.word}`, e);
        }
      } else {
        // 文本匹配（不区分大小写）
        if (lowerText.includes(wordData.word.toLowerCase())) {
          matches.push({
            word: wordData.word,
            type: "text",
          });
        }
      }
    }

    return NextResponse.json({
      isSensitive: matches.length > 0,
      matches,
      totalWords: words.length,
    });
  } catch (error) {
    console.error("Test sensitive words error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
