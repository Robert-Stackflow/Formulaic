export interface User {
  id: number;
  username: string;
  email: string;
  student_id: string;
  role: string;
  disabled: number;
  can_view_todo: number;
  can_edit_todo: number;
  can_create_todo_board: number;
  can_view_discuss: number;
  can_post_discuss: number;
  can_create_board: number;
  created_at: string;
}

export interface SensitiveWord {
  id: number;
  word: string;
  type?: string;
  is_regex?: number;
  description?: string;
  created_at: string;
}

export interface DiscussionTag {
  id: number;
  name: string;
  color: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}
