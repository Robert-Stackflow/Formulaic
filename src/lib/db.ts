import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// 读取默认配置
const defaultConfigPath = path.join(process.cwd(), "scripts/default.json");
const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, "utf-8"));

// 数据库文件路径
const dbDir = path.join(process.cwd(), "data");
const dbPath = path.join(dbDir, "wiki.db");

// 确保数据目录存在
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 创建数据库连接
export function getDb() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

// 初始化数据库表结构
export function initDatabase() {
  console.log("Initializing database...");
  const db = getDb();
  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      student_id TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      role TEXT DEFAULT 'user',
      disabled INTEGER DEFAULT 0,
      can_view_todo INTEGER DEFAULT 0,
      can_edit_todo INTEGER DEFAULT 0,
      can_create_todo_board INTEGER DEFAULT 0,
      can_view_discuss INTEGER DEFAULT 0,
      can_post_discuss INTEGER DEFAULT 0,
      can_create_discuss_board INTEGER DEFAULT 0,
      notification_reply INTEGER DEFAULT 1,
      notification_watch INTEGER DEFAULT 0,
      notification_email TEXT,
      notification_pushplus TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // TODO 看板表
  db.exec(`
    CREATE TABLE IF NOT EXISTS todo_boards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // TODO 列表表（看板中的列）
  db.exec(`
    CREATE TABLE IF NOT EXISTS todo_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      board_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      tags TEXT,
      position INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (board_id) REFERENCES todo_boards(id) ON DELETE CASCADE
    )
  `);

  // TODO 卡片表
  db.exec(`
    CREATE TABLE IF NOT EXISTS todo_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      position INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at DATETIME,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (list_id) REFERENCES todo_lists(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 讨论板块表
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_boards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT DEFAULT '#3b82f6',
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 讨论标签表（预定义）
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      color TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 讨论主题表
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      board_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT,
      status TEXT DEFAULT 'open',
      is_pinned INTEGER DEFAULT 0,
      is_resolved INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      reply_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      watch_count INTEGER DEFAULT 0,
      last_reply_at DATETIME,
      closed_at DATETIME,
      closed_by INTEGER,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (board_id) REFERENCES discussion_boards(id) ON DELETE CASCADE,
      FOREIGN KEY (closed_by) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 讨论回复表
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      parent_id INTEGER,
      is_answer INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (topic_id) REFERENCES discussion_topics(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES discussion_replies(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 讨论点赞表
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      topic_id INTEGER,
      reply_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (topic_id) REFERENCES discussion_topics(id) ON DELETE CASCADE,
      FOREIGN KEY (reply_id) REFERENCES discussion_replies(id) ON DELETE CASCADE,
      CHECK ((topic_id IS NOT NULL AND reply_id IS NULL) OR (topic_id IS NULL AND reply_id IS NOT NULL)),
      UNIQUE(user_id, topic_id),
      UNIQUE(user_id, reply_id)
    )
  `);

  // 讨论关注表
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_watches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      topic_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, topic_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (topic_id) REFERENCES discussion_topics(id) ON DELETE CASCADE
    )
  `);

  // 讨论编辑历史表
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_edit_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER,
      reply_id INTEGER,
      content_before TEXT NOT NULL,
      content_after TEXT NOT NULL,
      edited_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (topic_id) REFERENCES discussion_topics(id) ON DELETE CASCADE,
      FOREIGN KEY (reply_id) REFERENCES discussion_replies(id) ON DELETE CASCADE,
      FOREIGN KEY (edited_by) REFERENCES users(id) ON DELETE CASCADE,
      CHECK ((topic_id IS NOT NULL AND reply_id IS NULL) OR (topic_id IS NULL AND reply_id IS NOT NULL))
    )
  `);

  // 敏感词表
  db.exec(`
    CREATE TABLE IF NOT EXISTS sensitive_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT UNIQUE NOT NULL,
      type TEXT DEFAULT 'text',
      description TEXT,
      is_regex INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建默认管理员用户（如果不存在）
  const adminExists = db
    .prepare(`SELECT * FROM users WHERE username = ?`)
    .get(defaultConfig.admin.username);
  if (!adminExists) {
    const bcrypt = require("bcryptjs");
    const passwordHash = bcrypt.hashSync(defaultConfig.admin.password, 10);
    db.prepare(
      `
      INSERT INTO users (username, email, student_id, password_hash, role, can_view_todo, can_edit_todo, can_create_todo_board, can_view_discuss, can_post_discuss, can_create_discuss_board)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
      defaultConfig.admin.username,
      defaultConfig.admin.email,
      defaultConfig.admin.student_id,
      passwordHash,
      defaultConfig.admin.role,
      1,
      1,
      1,
      1,
      1,
      1
    );
    console.log(
      `Default admin user created: ${defaultConfig.admin.username} / ${defaultConfig.admin.password}`
    );
  }

  // 添加默认敏感词
  const insertWord = db.prepare(
    "INSERT OR IGNORE INTO sensitive_words (word, type, description, is_regex) VALUES (?, ?, ?, ?)"
  );
  defaultConfig.sensitiveWords.forEach((item: any) => {
    const isRegex = item.type === "regex" ? 1 : 0;
    insertWord.run(item.word, item.type, item.description || null, isRegex);
  });

  // 添加默认讨论标签
  const insertTag = db.prepare(
    "INSERT OR IGNORE INTO discussion_tags (name, color, description, icon) VALUES (?, ?, ?, ?)"
  );
  defaultConfig.discussionTags.forEach((tag: any) =>
    insertTag.run(tag.name, tag.color, tag.description, tag.icon || null)
  );

  // 创建默认讨论板块
  const boardExists = db
    .prepare("SELECT * FROM discussion_boards LIMIT 1")
    .get();
  if (!boardExists) {
    const adminUser = db
      .prepare(
        "SELECT id FROM users WHERE role IN ('superadmin', 'admin') LIMIT 1"
      )
      .get() as { id: number } | undefined;
    if (adminUser) {
      const insertBoard = db.prepare(
        "INSERT INTO discussion_boards (name, description, icon, color, created_by) VALUES (?, ?, ?, ?, ?)"
      );
      defaultConfig.discussionBoards.forEach((board: any) => {
        insertBoard.run(
          board.name,
          board.description,
          board.icon,
          board.color,
          adminUser.id
        );
      });
    }
  }

  // 创建默认 TODO 看板
  const todoBoardExists = db.prepare("SELECT * FROM todo_boards LIMIT 1").get();
  if (!todoBoardExists && defaultConfig.todoBoards) {
    const adminUser = db
      .prepare(
        "SELECT id FROM users WHERE role IN ('superadmin', 'admin') LIMIT 1"
      )
      .get() as { id: number } | undefined;
    if (adminUser) {
      const insertBoard = db.prepare(
        "INSERT INTO todo_boards (title, description, created_by) VALUES (?, ?, ?)"
      );
      const insertList = db.prepare(
        "INSERT INTO todo_lists (board_id, title, description, tags, position) VALUES (?, ?, ?, ?, ?)"
      );
      const insertCard = db.prepare(
        "INSERT INTO todo_cards (list_id, title, description, position, created_by) VALUES (?, ?, ?, ?, ?)"
      );

      defaultConfig.todoBoards.forEach((board: any) => {
        const boardResult = insertBoard.run(
          board.title,
          board.description,
          adminUser.id
        );
        const boardId = boardResult.lastInsertRowid;

        if (board.lists && Array.isArray(board.lists)) {
          board.lists.forEach((list: any, listIndex: number) => {
            const listResult = insertList.run(
              boardId,
              list.title,
              list.description || "",
              JSON.stringify(list.tags || []),
              listIndex
            );
            const listId = listResult.lastInsertRowid;

            if (list.cards && Array.isArray(list.cards)) {
              list.cards.forEach((card: any, cardIndex: number) => {
                insertCard.run(
                  listId,
                  card.title,
                  card.description || "",
                  cardIndex,
                  adminUser.id
                );
              });
            }
          });
        }
      });
    }
  }

  db.close();
  console.log("Database initialized successfully");
}

/**
 * 导入 Mock 数据
 */
export function importMockData() {
  console.log("Importing mock data...");

  const db = getDb();

  // 读取 mock 配置
  const mockConfigPath = path.join(process.cwd(), "scripts/mock.json");
  if (!fs.existsSync(mockConfigPath)) {
    console.log("mock.json not found, skipping mock data import");
    return;
  }

  const mockConfig = JSON.parse(fs.readFileSync(mockConfigPath, "utf-8"));

  // 导入用户数据
  if (mockConfig.users && Array.isArray(mockConfig.users)) {
    const insertUser = db.prepare(
      `INSERT OR IGNORE INTO users (
        username, email, student_id, password_hash, role,
        can_view_todo, can_edit_todo, can_create_todo_board, can_view_discuss, can_post_discuss, can_create_discuss_board
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const bcrypt = require("bcryptjs");
    mockConfig.users.forEach((user: any) => {
      const passwordHash = bcrypt.hashSync(user.password, 10);
      insertUser.run(
        user.username,
        user.email,
        user.student_id,
        passwordHash,
        user.role || "user",
        user.can_view_todo || 0,
        user.can_edit_todo || 0,
        user.can_create_todo_board || 0,
        user.can_view_discuss || 0,
        user.can_post_discuss || 0,
        user.can_create_discuss_board || 0
      );
    });
    console.log(`Imported ${mockConfig.users.length} mock users`);
  }

  // 导入 TODO 看板数据
  if (mockConfig.todoBoards && Array.isArray(mockConfig.todoBoards)) {
    const adminUser = db
      .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
      .get() as { id: number } | undefined;

    if (adminUser) {
      const insertBoard = db.prepare(
        "INSERT INTO todo_boards (title, description, created_by) VALUES (?, ?, ?)"
      );
      const insertList = db.prepare(
        "INSERT INTO todo_lists (board_id, title, description, tags, position) VALUES (?, ?, ?, ?, ?)"
      );
      const insertCard = db.prepare(
        "INSERT INTO todo_cards (list_id, title, description, position, created_by) VALUES (?, ?, ?, ?, ?)"
      );

      mockConfig.todoBoards.forEach((board: any) => {
        const boardResult = insertBoard.run(
          board.title,
          board.description,
          adminUser.id
        );
        const boardId = boardResult.lastInsertRowid;

        if (board.lists && Array.isArray(board.lists)) {
          board.lists.forEach((list: any, listIndex: number) => {
            const listResult = insertList.run(
              boardId,
              list.title,
              list.description || "",
              JSON.stringify(list.tags || []),
              listIndex
            );
            const listId = listResult.lastInsertRowid;

            if (list.cards && Array.isArray(list.cards)) {
              list.cards.forEach((card: any, cardIndex: number) => {
                insertCard.run(
                  listId,
                  card.title,
                  card.description || "",
                  cardIndex,
                  adminUser.id
                );
              });
            }
          });
        }
      });
      console.log(`Imported ${mockConfig.todoBoards.length} mock TODO boards`);
    }
  }

  // 导入讨论主题数据
  if (
    mockConfig.discussionTopics &&
    Array.isArray(mockConfig.discussionTopics)
  ) {
    const getUserId = db.prepare("SELECT id FROM users WHERE username = ?");
    const getBoardId = db.prepare(
      "SELECT id FROM discussion_boards WHERE name = ?"
    );
    const insertTopic = db.prepare(
      `INSERT INTO discussion_topics (
        board_id, title, content, tags, created_by, view_count
      ) VALUES (?, ?, ?, ?, ?, ?)`
    );
    const insertReply = db.prepare(
      `INSERT INTO discussion_replies (
        topic_id, content, created_by
      ) VALUES (?, ?, ?)`
    );

    mockConfig.discussionTopics.forEach((topic: any) => {
      const board = getBoardId.get(topic.board) as { id: number } | undefined;
      const author = getUserId.get(topic.author) as { id: number } | undefined;

      if (board && author) {
        const topicResult = insertTopic.run(
          board.id,
          topic.title,
          topic.content,
          JSON.stringify(topic.tags || []),
          author.id,
          topic.views || 0
        );
        const topicId = topicResult.lastInsertRowid;

        // 导入回复
        if (topic.comments && Array.isArray(topic.comments)) {
          topic.comments.forEach((comment: any) => {
            const replyAuthor = getUserId.get(comment.author) as
              | { id: number }
              | undefined;
            if (replyAuthor) {
              insertReply.run(topicId, comment.content, replyAuthor.id);
            }
          });
        }
      }
    });
    console.log(
      `Imported ${mockConfig.discussionTopics.length} mock discussion topics`
    );
  }

  db.close();
  console.log("Mock data imported successfully");
}
