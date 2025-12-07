import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// POST - 增加浏览量
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const db = getDb();
    db.prepare(
      "UPDATE discussion_topics SET view_count = view_count + 1 WHERE id = ?"
    ).run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Increment view count error:", error);
    return NextResponse.json({ error: "增加浏览量失败" }, { status: 500 });
  }
}
