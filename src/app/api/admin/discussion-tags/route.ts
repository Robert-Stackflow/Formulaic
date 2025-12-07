import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

// GET - 获取所有讨论标签（所有登录用户可访问）
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const db = getDb();
    const tags = db
      .prepare("SELECT * FROM discussion_tags ORDER BY name ASC")
      .all();

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Get tags error:", error);
    return NextResponse.json({ error: "获取标签失败" }, { status: 500 });
  }
}

// POST - 创建新标签
export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireAdmin();
    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { name, color, description, icon } = await request.json();

    if (!name || !color) {
      return NextResponse.json(
        { error: "名称和颜色不能为空" },
        { status: 400 }
      );
    }

    // 检查标签是否已存在
    const db = getDb();
    const existing = db
      .prepare("SELECT * FROM discussion_tags WHERE name = ?")
      .get(name);

    if (existing) {
      return NextResponse.json({ error: "标签已存在" }, { status: 400 });
    }

    const result = db
      .prepare(
        "INSERT INTO discussion_tags (name, color, description, icon) VALUES (?, ?, ?, ?)"
      )
      .run(name, color, description || null, icon || null);

    const tag = db
      .prepare("SELECT * FROM discussion_tags WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("Create tag error:", error);
    return NextResponse.json({ error: "创建标签失败" }, { status: 500 });
  }
}

// PATCH - 更新标签
export async function PATCH(request: NextRequest) {
  try {
    const authCheck = await requireAdmin();
    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { id, name, color, description, icon } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "缺少标签ID" }, { status: 400 });
    }

    // 检查标签是否存在
    const db = getDb();
    const tag = db
      .prepare("SELECT * FROM discussion_tags WHERE id = ?")
      .get(id);

    if (!tag) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 });
    }

    // 如果修改了名称，检查新名称是否已被使用
    if (name && name !== (tag as any).name) {
      const existing = db
        .prepare("SELECT * FROM discussion_tags WHERE name = ? AND id != ?")
        .get(name, id);

      if (existing) {
        return NextResponse.json({ error: "标签名称已存在" }, { status: 400 });
      }
    }

    // 更新标签
    db.prepare(
      "UPDATE discussion_tags SET name = ?, color = ?, description = ?, icon = ? WHERE id = ?"
    ).run(
      name || (tag as any).name,
      color || (tag as any).color,
      description !== undefined ? description : (tag as any).description,
      icon !== undefined ? icon : (tag as any).icon,
      id
    );

    const updatedTag = db
      .prepare("SELECT * FROM discussion_tags WHERE id = ?")
      .get(id);

    return NextResponse.json({ tag: updatedTag });
  } catch (error) {
    console.error("Update tag error:", error);
    return NextResponse.json({ error: "更新标签失败" }, { status: 500 });
  }
}

// DELETE - 删除标签
export async function DELETE(request: NextRequest) {
  try {
    const authCheck = await requireAdmin();
    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "缺少标签ID" }, { status: 400 });
    }

    // 检查标签是否存在
    const db = getDb();
    const tag = db
      .prepare("SELECT * FROM discussion_tags WHERE id = ?")
      .get(id);

    if (!tag) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 });
    }

    // 删除标签
    db.prepare("DELETE FROM discussion_tags WHERE id = ?").run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tag error:", error);
    return NextResponse.json({ error: "删除标签失败" }, { status: 500 });
  }
}
