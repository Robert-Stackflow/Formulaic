import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

type RouteParams = Promise<{ id: string }>;

// POST - 置顶/取消置顶主题 (仅管理员)
export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    // 检查管理员权限
    const authCheck = await requireAdmin();
    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { id } = await params;

    // 获取主题
    const db = getDb();
    const topic = db
      .prepare("SELECT is_pinned FROM discussion_topics WHERE id = ?")
      .get(id) as { is_pinned: number } | undefined;

    if (!topic) {
      return NextResponse.json({ error: "主题不存在" }, { status: 404 });
    }

    // 切换置顶状态
    const newPinnedState = topic.is_pinned === 1 ? 0 : 1;
    db.prepare("UPDATE discussion_topics SET is_pinned = ? WHERE id = ?").run(
      newPinnedState,
      id
    );

    return NextResponse.json({
      pinned: newPinnedState,
    });
  } catch (error: any) {
    console.error("置顶主题失败:", error);
    return NextResponse.json(
      { error: error.message || "置顶主题失败" },
      { status: 500 }
    );
  }
}
