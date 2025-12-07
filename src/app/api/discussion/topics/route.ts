import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

// GET - 获取主题列表（支持按板块筛选、搜索和排序）或获取作者列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("board_id");
    const getAuthors = searchParams.get("get_authors") === "true";

    const db = getDb();
    // 如果请求作者列表
    if (getAuthors && boardId) {
      const authorsQuery = `
        SELECT DISTINCT u.username
        FROM discussion_topics t
        LEFT JOIN users u ON t.created_by = u.id
        WHERE t.board_id = ? AND u.username IS NOT NULL
        ORDER BY u.username ASC
      `;
      const authors = db.prepare(authorsQuery).all(boardId) as {
        username: string;
      }[];
      return NextResponse.json({
        authors: authors.map((a) => a.username),
      });
    }

    const sortBy = searchParams.get("sort") || "created_at";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;
    const searchQuery = searchParams.get("search")?.trim();
    const authorFilter = searchParams.get("author")?.trim();
    const tagsFilter = searchParams.get("tags")?.trim(); // 标签筛选，逗号分隔
    const statusFilter = searchParams.get("status")?.trim(); // 状态筛选: all, closed-only, hide-closed, resolved-only, hide-resolved

    const params: any[] = [];
    const conditions: string[] = [];

    // 构建基础查询和搜索优先级
    let query = "";
    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`;
      query = `
        SELECT DISTINCT
          t.*,
          u.username as author_name,
          u.avatar as author_avatar,
          CASE 
            WHEN t.title LIKE ? THEN 3
            WHEN t.content LIKE ? THEN 2
            ELSE 1
          END as search_priority
        FROM discussion_topics t
        LEFT JOIN users u ON t.created_by = u.id
        LEFT JOIN discussion_replies r ON t.id = r.topic_id
      `;
      // 先添加搜索相关的参数
      params.push(searchPattern, searchPattern);
      // 搜索条件
      conditions.push(
        "(t.title LIKE ? OR t.content LIKE ? OR r.content LIKE ?)"
      );
      params.push(searchPattern, searchPattern, searchPattern);
    } else {
      query = `
        SELECT DISTINCT
          t.*,
          u.username as author_name,
          u.avatar as author_avatar
        FROM discussion_topics t
        LEFT JOIN users u ON t.created_by = u.id
      `;
    }

    // 板块筛选
    if (boardId) {
      conditions.push("t.board_id = ?");
      params.push(boardId);
    }

    // 作者筛选
    if (authorFilter) {
      conditions.push("u.username = ?");
      params.push(authorFilter);
    }

    // 标签筛选
    if (tagsFilter) {
      const tags = tagsFilter.split(",").map((tag) => tag.trim());
      const tagConditions = tags.map(() => "t.tags LIKE ?").join(" OR ");
      conditions.push(`(${tagConditions})`);
      tags.forEach((tag) => {
        params.push(`%"${tag}"%`);
      });
    }

    // 状态筛选
    if (statusFilter) {
      switch (statusFilter) {
        case "closed-only":
          conditions.push("t.closed_at IS NOT NULL");
          break;
        case "hide-closed":
          conditions.push("t.closed_at IS NULL");
          break;
        case "resolved-only":
          conditions.push("t.is_resolved = 1");
          break;
        case "hide-resolved":
          conditions.push("t.is_resolved = 0");
          break;
        // "all" 不添加任何条件
      }
    }

    // 添加WHERE条件
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // 排序逻辑
    let orderBy = "";
    if (searchQuery) {
      // 搜索时按匹配优先级排序
      orderBy = "t.is_pinned DESC, search_priority DESC, ";
    } else {
      orderBy = "t.is_pinned DESC, ";
    }

    switch (sortBy) {
      case "reply_count":
        orderBy += "t.reply_count DESC, t.created_at DESC";
        break;
      case "like_count":
        orderBy += "t.like_count DESC, t.created_at DESC";
        break;
      case "watch_count":
        orderBy += "t.watch_count DESC, t.created_at DESC";
        break;
      case "created_at":
      default:
        orderBy += "t.created_at DESC";
        break;
    }

    query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const topics = db.prepare(query).all(...params);

    // 获取总数（考虑搜索和筛选）
    let countQuery = `
      SELECT COUNT(DISTINCT t.id) as total 
      FROM discussion_topics t
      LEFT JOIN users u ON t.created_by = u.id
    `;

    if (searchQuery) {
      countQuery += " LEFT JOIN discussion_replies r ON t.id = r.topic_id";
    }

    const countConditions: string[] = [];
    const countParams: any[] = [];

    if (boardId) {
      countConditions.push("t.board_id = ?");
      countParams.push(boardId);
    }

    if (authorFilter) {
      countConditions.push("u.username = ?");
      countParams.push(authorFilter);
    }

    if (tagsFilter) {
      const tags = tagsFilter.split(",").map((tag) => tag.trim());
      const tagConditions = tags.map(() => "t.tags LIKE ?").join(" OR ");
      countConditions.push(`(${tagConditions})`);
      tags.forEach((tag) => {
        countParams.push(`%"${tag}"%`);
      });
    }

    if (statusFilter) {
      switch (statusFilter) {
        case "closed-only":
          countConditions.push("t.closed_at IS NOT NULL");
          break;
        case "hide-closed":
          countConditions.push("t.closed_at IS NULL");
          break;
        case "resolved-only":
          countConditions.push("t.is_resolved = 1");
          break;
        case "hide-resolved":
          countConditions.push("t.is_resolved = 0");
          break;
      }
    }

    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`;
      countConditions.push(
        "(t.title LIKE ? OR t.content LIKE ? OR r.content LIKE ?)"
      );
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (countConditions.length > 0) {
      countQuery += " WHERE " + countConditions.join(" AND ");
    }

    const countResult = db.prepare(countQuery).get(...countParams) as {
      total: number;
    };

    return NextResponse.json({
      topics,
      pagination: {
        page,
        limit,
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error("Get topics error:", error);
    return NextResponse.json({ error: "获取主题列表失败" }, { status: 500 });
  }
}

// POST - 创建新主题
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const db = getDb();
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(session.user.email) as any;

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 检查发帖权限
    if (user.role !== "admin" && !user.can_post_discuss) {
      return NextResponse.json({ error: "没有发帖权限" }, { status: 403 });
    }

    const { board_id, title, content, tags } = await request.json();

    if (!board_id || !title || !content) {
      return NextResponse.json(
        { error: "板块、标题和内容不能为空" },
        { status: 400 }
      );
    }

    // 检查板块是否存在
    const board = db
      .prepare("SELECT * FROM discussion_boards WHERE id = ?")
      .get(board_id);
    if (!board) {
      return NextResponse.json({ error: "板块不存在" }, { status: 404 });
    }

    // 敏感词检测
    const sensitiveWords = db
      .prepare("SELECT word, type, is_regex FROM sensitive_words")
      .all() as Array<{ word: string; type: string; is_regex: number }>;
    const combinedText = `${title} ${content}`;

    for (const sw of sensitiveWords) {
      let matched = false;
      if (sw.is_regex === 1 || sw.type === "regex") {
        try {
          const regex = new RegExp(sw.word, "i");
          matched = regex.test(combinedText);
        } catch (e) {
          console.error(`Invalid regex pattern: ${sw.word}`, e);
        }
      } else {
        matched = combinedText.toLowerCase().includes(sw.word.toLowerCase());
      }

      if (matched) {
        return NextResponse.json({ error: `内容包含敏感词` }, { status: 400 });
      }
    }

    const result = db
      .prepare(
        `
        INSERT INTO discussion_topics (board_id, title, content, tags, created_by, last_reply_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `
      )
      .run(board_id, title, content, tags || null, user.id);

    const topicId = result.lastInsertRowid;

    // 创建者自动关注该主题
    db.prepare(
      "INSERT OR IGNORE INTO discussion_watches (topic_id, user_id) VALUES (?, ?)"
    ).run(topicId, user.id);

    // 更新主题的关注数
    db.prepare(
      "UPDATE discussion_topics SET watch_count = watch_count + 1 WHERE id = ?"
    ).run(topicId);

    const topic = db
      .prepare("SELECT * FROM discussion_topics WHERE id = ?")
      .get(topicId);

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    console.error("Create topic error:", error);
    return NextResponse.json({ error: "创建主题失败" }, { status: 500 });
  }
}
