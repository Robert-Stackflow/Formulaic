import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("请输入邮箱和密码");
        }

        const db = getDb();
        const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
        const user = stmt.get(credentials.email) as any;

        if (!user) {
          throw new Error("邮箱或密码错误");
        }

        // 检查用户是否被禁用
        if (user.disabled === 1) {
          throw new Error("该账号已被禁用，请联系管理员");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isPasswordValid) {
          throw new Error("邮箱或密码错误");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username,
          image: user.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger }) {
      try {
        // 首次登录或刷新时，从数据库获取用户完整信息
        if (user) {
          token.id = user.id;
        }

        // 每次都从数据库获取最新的用户权限信息
        if (token.id) {
          const db = getDb();
          const stmt = db.prepare(
            "SELECT id, username, email, role, disabled, can_view_todo, can_edit_todo, can_create_todo_board, can_view_discuss, can_post_discuss, can_create_discuss_board FROM users WHERE id = ?"
          );
          const dbUser = stmt.get(token.id) as any;

          // 如果用户被禁用或不存在，返回空token使session失效
          if (!dbUser || dbUser.disabled === 1) {
            return null as any;
          }

          if (dbUser) {
            token.role = dbUser.role;
            token.can_create_discuss_board =
              dbUser.can_create_discuss_board === 1;
            token.can_post_discuss = dbUser.can_post_discuss === 1;
            token.can_view_discuss = dbUser.can_view_discuss === 1;
            token.can_edit_todo = dbUser.can_edit_todo === 1;
            token.can_view_todo = dbUser.can_view_todo === 1;
            token.can_create_todo_board = dbUser.can_create_todo_board === 1;
          }
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user && token) {
          (session.user as any).id = token.id as string;
          (session.user as any).role = token.role;
          (session.user as any).can_create_discuss_board =
            token.can_create_discuss_board;
          (session.user as any).can_post_discuss = token.can_post_discuss;
          (session.user as any).can_view_discuss = token.can_view_discuss;
          (session.user as any).can_edit_todo = token.can_edit_todo;
          (session.user as any).can_view_todo = token.can_view_todo;
          (session.user as any).can_create_todo_board =
            token.can_create_todo_board;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
  events: {
    async signOut() {
      // 用户登出时的处理
    },
  },
};
