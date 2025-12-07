import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET - 获取所有标签
export async function GET() {
  try {
    const db = getDb();
    const tags = db
      .prepare(
        `
        SELECT * FROM discussion_tags
        ORDER BY created_at ASC
      `
      )
      .all();

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Get tags error:", error);
    return NextResponse.json({ error: "获取标签列表失败" }, { status: 500 });
  }
}
