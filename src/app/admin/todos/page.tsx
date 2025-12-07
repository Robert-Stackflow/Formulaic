"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import { LoadingContent } from "@/components/loading";
import { DropdownMenu } from "@/components/dropdown-menu";
import { PageLayout, PageHeader } from "@/components/page-layout";
import { Dialog } from "@/components/dialog";
import { FormDialog } from "@/components/form-dialog";
import { showToast } from "@/components/toast";
import { apiGet, apiPost, apiDelete, apiPut } from "@/lib/api-client";
import { usePermissions } from "@/hooks/use-permissions";
import LoadingButton from "@/components/loading-button";

interface Todo {
  id: number;
  title: string;
  description: string;
  creator_name: string;
  created_at: string;
  updated_at: string;
  pending_count: number;
}

export default function TodosPage() {
  const { session, canCreateTodoBoard, canEditTodo } = usePermissions();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editingBoard, setEditingBoard] = useState<Todo | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<number | null>(null);
  const [submitCreatingBoard, setSubmitCreatingBoard] = useState(false);
  const [submitEditingBoard, setSubmitEditingBoard] = useState(false);
  const [submitDeletingBoard, setSubmitDeletingBoard] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const result = await apiGet("/api/todos/boards");
    if (result.success && result.data) {
      setTodos(result.data.boards ?? []);
    } else {
      setTodos([]);
    }
    setLoading(false);
  };

  const createTodoBoard = async () => {
    if (!newTodo.title.trim()) return;

    setSubmitCreatingBoard(true);

    const result = await apiPost("/api/todos/boards", newTodo, {
      showSuccessToast: true,
      successMessage: "看板已创建",
    });

    setSubmitCreatingBoard(false);

    if (result.success) {
      setShowCreateModal(false);
      setNewTodo({ title: "", description: "" });
      fetchBoards();
    }
  };

  const updateBoard = async () => {
    if (!editingBoard || !editData.title.trim()) return;

    setSubmitEditingBoard(true);

    const result = await apiPut(
      `/api/todos/boards/${editingBoard.id}`,
      editData,
      {
        showSuccessToast: true,
        successMessage: "看板已更新",
      }
    );

    setSubmitEditingBoard(false);

    if (result.success) {
      setEditingBoard(null);
      setEditData({ title: "", description: "" });
      fetchBoards();
    }
  };

  const deleteBoard = async () => {
    if (!boardToDelete) return;

    setSubmitDeletingBoard(true);

    const result = await apiDelete(`/api/todos/boards/${boardToDelete}`, {
      showSuccessToast: true,
      successMessage: "看板删除成功",
    });

    setSubmitDeletingBoard(false);

    if (result.success) {
      fetchBoards();
    }
  };

  const handleEditBoard = (board: Todo) => {
    setEditingBoard(board);
    setEditData({ title: board.title, description: board.description });
  };

  const handleDeleteBoard = (boardId: number) => {
    setBoardToDelete(boardId);
    setDeleteDialogOpen(true);
  };

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="TODO 看板"
        description="管理项目任务和工作流程"
        action={
          canCreateTodoBoard() ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-fd-primary cursor-pointer text-fd-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm"
            >
              创建看板
            </button>
          ) : undefined
        }
      />
      {!session && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-300 dark:border-yellow-800 p-4 rounded-lg text-center">
          <p className="text-yellow-800 dark:text-yellow-300">
            请先登录才能创建看板
          </p>
        </div>
      )}
      {loading ? (
        <LoadingContent message="加载TODO看板..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.length > 0 &&
            todos.map((board: Todo) => (
              <div
                key={board.id}
                className="relative group p-6 bg-fd-card hover:border-fd-primary border border-fd-border rounded-lg transition-all"
              >
                <Link href={`/todos/${board.id}`} className="block">
                  <h2 className="text-xl font-semibold mb-2 text-fd-foreground pr-8">
                    {board.title}
                  </h2>
                  <p className="text-fd-muted-foreground mb-4 line-clamp-2">
                    {board.description || "暂无描述"}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-fd-muted-foreground">
                      创建者: {board.creator_name}
                    </span>
                    {board.pending_count > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                        {board.pending_count} 个待办
                      </span>
                    )}
                  </div>
                </Link>
                {canEditTodo() && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100">
                    <DropdownMenu
                      items={[
                        {
                          label: "编辑",
                          icon: <Edit2 className="w-4 h-4" />,
                          onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditBoard(board);
                          },
                        },
                        {
                          label: "删除",
                          icon: <Trash2 className="w-4 h-4" />,
                          onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteBoard(board.id);
                          },
                          className:
                            "text-red-600 dark:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-950/20",
                        },
                      ]}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
      {!loading && todos.length === 0 && (
        <div className="text-center py-12 text-fd-muted-foreground">
          还没有看板，{session ? "创建一个吧！" : "登录后可以创建看板"}
        </div>
      )}

      {/* 编辑看板模态框 */}
      <FormDialog
        isOpen={editingBoard !== null}
        onClose={() => {
          setEditingBoard(null);
          setEditData({ title: "", description: "" });
        }}
        title="编辑看板"
        footer={
          <>
            <button
              onClick={() => {
                setEditingBoard(null);
                setEditData({ title: "", description: "" });
              }}
              className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              取消
            </button>
            <LoadingButton
              loading={submitEditingBoard}
              onClick={updateBoard}
              loadingText={"保存中..."}
              normalText={"保存"}
              iconName={"Save"}
            />
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium mb-2 text-fd-foreground">
            标题
          </label>
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
            placeholder="输入看板标题"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-fd-foreground">
            描述
          </label>
          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
            rows={3}
            placeholder="输入看板描述"
          />
        </div>
      </FormDialog>

      {/* 删除确认对话框 */}
      <Dialog
        isOpen={deleteDialogOpen}
        loading={submitDeletingBoard}
        onClose={() => {
          setDeleteDialogOpen(false);
          setBoardToDelete(null);
        }}
        onConfirm={deleteBoard}
        title="删除看板"
        description="确定要删除这个看板吗？看板内的所有列表和卡片都将被删除，此操作无法撤销。"
        confirmText="删除"
        loadingText="删除中..."
        type="danger"
      />

      {/* 创建TODO看板模态框 */}
      <FormDialog
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="创建新看板"
        footer={
          <>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              取消
            </button>
            <LoadingButton
              loading={submitCreatingBoard}
              onClick={createTodoBoard}
              loadingText={"创建中..."}
              normalText={"创建"}
              iconName={"Plus"}
            />
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium mb-2 text-fd-foreground">
            标题
          </label>
          <input
            type="text"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
            placeholder="输入看板标题"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-fd-foreground">
            描述
          </label>
          <textarea
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
            className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
            rows={3}
            placeholder="输入看板描述"
          />
        </div>
      </FormDialog>
    </PageLayout>
  );
}
