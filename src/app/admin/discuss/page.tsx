"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingContent } from "@/components/loading";
import { PageLayout, PageHeader } from "@/components/page-layout";
import { showToast } from "@/components/toast";
import { Dialog } from "@/components/dialog";
import Link from "next/link";
import { usePermissions } from "@/hooks/use-permissions";
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api-client";
import { IconPicker } from "@/components/icon-picker";
import { ColorPicker } from "@/components/color-picker";
import { IconRenderer } from "@/components/icon-renderer";
import { FormDialog } from "@/components/form-dialog";
import { Loader2, Plus } from "lucide-react";
import { DropdownMenu } from "@/components/dropdown-menu";
import { Edit, Trash2 } from "lucide-react";
import LoadingButton from "@/components/loading-button";

interface Board {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  topic_count: number;
  created_by: number;
}

export default function DiscussPage() {
  const { session, hasPermission } = usePermissions();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [creating, setCreating] = useState(false);
  const [submitDeletingBoard, setSubmitDeletingBoard] = useState(false);
  const [submitEditingBoard, setSubmitEditingBoard] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [deletingBoardId, setDeletingBoardId] = useState<number | null>(null);
  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
    icon: "MessageCircle",
    color: "#3b82f6",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const result = await apiGet("/api/discussion/boards");
    if (result.success && result.data) {
      setBoards(result.data.boards);
    }
    setLoading(false);
  };

  const createBoard = async () => {
    if (!newBoard.name.trim()) {
      setError("板块名称不能为空");
      return;
    }

    setCreating(true);
    const result = await apiPost("/api/discussion/boards", newBoard, {
      showSuccessToast: true,
      successMessage: "板块创建成功",
    });
    setCreating(false);

    if (result.success) {
      setShowCreateBoard(false);
      setNewBoard({
        name: "",
        description: "",
        icon: "MessageCircle",
        color: "#3b82f6",
      });
      setError("");
      fetchBoards();
    } else if (result.error) {
      setError(result.error);
    }
  };

  const startEditBoard = (board: Board) => {
    setEditingBoard(board);
    setNewBoard({
      name: board.name,
      description: board.description,
      icon: board.icon,
      color: board.color,
    });
    setShowCreateBoard(true);
  };

  const updateBoard = async () => {
    if (!editingBoard) return;
    if (!newBoard.name.trim()) {
      setError("板块名称不能为空");
      return;
    }

    setSubmitEditingBoard(true);
    const result = await apiPatch(
      `/api/discussion/boards/${editingBoard.id}`,
      newBoard,
      {
        showSuccessToast: true,
        successMessage: "板块更新成功",
      }
    );
    setSubmitEditingBoard(false);

    if (result.success) {
      setShowCreateBoard(false);
      setEditingBoard(null);
      setNewBoard({
        name: "",
        description: "",
        icon: "MessageCircle",
        color: "#3b82f6",
      });
      setError("");
      fetchBoards();
    } else if (result.error) {
      setError(result.error);
    }
  };

  const deleteBoard = async () => {
    if (!deletingBoardId) return;
    setSubmitDeletingBoard(true);
    const result = await apiDelete(
      `/api/discussion/boards/${deletingBoardId}`,
      {
        showSuccessToast: true,
        successMessage: "板块已删除",
      }
    );
    setSubmitDeletingBoard(false);
    if (result.success) {
      fetchBoards();
      setDeletingBoardId(null);
    }
  };

  const handleSubmit = () => {
    if (editingBoard) {
      updateBoard();
    } else {
      createBoard();
    }
  };

  const canCreateBoard = hasPermission("can_create_discuss_board");

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="讨论区"
        description="选择一个板块开始讨论"
        action={
          session &&
          canCreateBoard && (
            <button
              onClick={() => setShowCreateBoard(true)}
              className="px-4 py-2 bg-fd-primary cursor-pointer text-fd-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm"
            >
              创建板块
            </button>
          )
        }
      />

      {!session && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-300 dark:border-yellow-800 p-4 rounded-lg text-center">
          <p className="text-yellow-800 dark:text-yellow-300">
            请先登录才能发起讨论
          </p>
        </div>
      )}

      {loading ? (
        <LoadingContent message="加载讨论区..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <div
              key={board.id}
              className="relative p-6 bg-fd-card hover:border-fd-primary border border-fd-border rounded-lg transition-all group"
            >
              <Link href={`/discuss/boards/${board.id}`} className="block">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0" style={{ color: board.color }}>
                    <IconRenderer iconName={board.icon} className="w-10 h-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-fd-foreground mb-1 truncate">
                      {board.name}
                    </h3>
                    <p className="text-sm text-fd-muted-foreground line-clamp-2 mb-2">
                      {board.description}
                    </p>
                    <div className="text-xs text-fd-muted-foreground">
                      {board.topic_count} 个主题
                    </div>
                  </div>
                </div>
              </Link>
              {canCreateBoard && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100">
                  <DropdownMenu
                    items={[
                      {
                        label: "编辑",
                        icon: <Edit className="w-4 h-4" />,
                        onClick: (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          startEditBoard(board);
                        },
                      },
                      {
                        label: "删除",
                        icon: <Trash2 className="w-4 h-4" />,
                        onClick: (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeletingBoardId(board.id);
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

      {!loading && boards.length === 0 && (
        <div className="text-center py-12 text-fd-muted-foreground">
          暂无讨论板块
        </div>
      )}

      {/* 创建讨论区板块模态框 */}
      <FormDialog
        isOpen={showCreateBoard}
        onClose={() => {
          setShowCreateBoard(false);
          setEditingBoard(null);
          setError("");
          setNewBoard({
            name: "",
            description: "",
            icon: "MessageCircle",
            color: "#3b82f6",
          });
        }}
        title={editingBoard ? "编辑板块" : "创建讨论板块"}
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateBoard(false);
                setEditingBoard(null);
                setError("");
                setNewBoard({
                  name: "",
                  description: "",
                  icon: "MessageCircle",
                  color: "#3b82f6",
                });
              }}
              className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              取消
            </button>
            <LoadingButton
              onClick={handleSubmit}
              loading={creating || submitEditingBoard}
              loadingText={editingBoard ? "更新中..." : "创建中..."}
              normalText={editingBoard ? "更新" : "创建"}
              iconName={editingBoard ? "Save" : "Plus"}
            />
          </>
        }
      >
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <div>
            <label className="block text-sm font-medium mb-2 text-fd-foreground">
              板块名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={newBoard.name}
              onChange={(e) =>
                setNewBoard({ ...newBoard, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
              placeholder="例如：综合讨论"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-fd-foreground">
              板块描述
            </label>
            <textarea
              value={newBoard.description}
              onChange={(e) =>
                setNewBoard({ ...newBoard, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary resize-none"
              rows={3}
              placeholder="简要描述板块用途..."
            />
          </div>
          <div>
            <IconPicker
              value={newBoard.icon}
              onChange={(icon) => setNewBoard({ ...newBoard, icon })}
              label="图标"
            />
          </div>
          <div className="mt-2">
            <ColorPicker
              value={newBoard.color}
              onChange={(color) => setNewBoard({ ...newBoard, color })}
              label="颜色"
            />
          </div>
        </div>
      </FormDialog>

      {/* 删除板块确认对话框 */}
      <Dialog
        isOpen={deletingBoardId !== null}
        onClose={() => setDeletingBoardId(null)}
        title="确认删除板块"
        description="确定要删除这个板块吗？所有相关主题也将被删除，此操作不可恢复。"
        onConfirm={deleteBoard}
        confirmText="删除"
        cancelText="取消"
        type="danger"
        loading={submitDeletingBoard}
        loadingText="删除中..."
      />
    </PageLayout>
  );
}
