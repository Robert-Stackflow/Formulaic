import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      can_create_discuss_board?: boolean;
      can_post_discuss?: boolean;
      can_view_discuss?: boolean;
      can_edit_todo?: boolean;
      can_view_todo?: boolean;
      can_create_todo_board?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    can_create_discuss_board?: boolean;
    can_post_discuss?: boolean;
    can_view_discuss?: boolean;
    can_edit_todo?: boolean;
    can_view_todo?: boolean;
    can_create_todo_board?: boolean;
  }
}
