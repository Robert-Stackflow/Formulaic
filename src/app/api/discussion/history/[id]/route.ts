import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

type RouteParams = Promise<{ id: string }>;

// GET - 获取主题或回复的编辑历史
export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "topic"; // topic 或 reply

    let history;
    const db = getDb();
    if (type === "topic") {
      history = db
        .prepare(
          `
          SELECT 
            h.*,
            u.username as editor_name
          FROM discussion_edit_history h
          LEFT JOIN users u ON h.edited_by = u.id
          WHERE h.topic_id = ?
          ORDER BY h.created_at DESC
        `
        )
        .all(id);
    } else {
      history = db
        .prepare(
          `
          SELECT 
            h.*,
            u.username as editor_name
          FROM discussion_edit_history h
          LEFT JOIN users u ON h.edited_by = u.id
          WHERE h.reply_id = ?
          ORDER BY h.created_at DESC
        `
        )
        .all(id);
    }

    return NextResponse.json({
      success: true,
      data: { history },
    });
  } catch (error: any) {
    console.error("获取编辑历史失败:", error);
    return NextResponse.json(
      { error: error.message || "获取编辑历史失败" },
      { status: 500 }
    );
  }
}
