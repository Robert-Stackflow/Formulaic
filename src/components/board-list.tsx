"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Dialog } from "./dialog";
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/lib/api-client";
import { showToast } from "./toast";
import { usePermissions } from "@/hooks/use-permissions";
import { Trash2, Edit2, ChevronDown, ChevronRight, X } from "lucide-react";
import { DropdownMenu } from "./dropdown-menu";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./card";
import LoadingButton from "./loading-button";

interface CardType {
  id: number;
  list_id: number;
  title: string;
  description: string;
  position: number;
  completed: number;
  completed_at: string | null;
  creator_name: string;
}

interface List {
  id: number;
  board_id: number;
  title: string;
  description?: string;
  tags?: string;
  position: number;
  cards: CardType[];
}

interface BoardListProps {
  list: List;
  boardId: string;
  onUpdate: () => void;
}

interface DiscussionTag {
  id: number;
  name: string;
  color: string;
  description: string | null;
  icon: string | null;
}

export default function BoardList({ list, boardId, onUpdate }: BoardListProps) {
  const { canEditTodo } = usePermissions();
  const [availableTags, setAvailableTags] = useState<DiscussionTag[]>([]);

  // 获取主题标签
  useEffect(() => {
    const fetchTags = async () => {
      const result = await apiGet("/api/admin/discussion-tags");
      if (result.success && result.data) {
        setAvailableTags(result.data.tags || []);
      }
    };
    fetchTags();
  }, []);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [editCardTitle, setEditCardTitle] = useState("");
  const [editCardDescription, setEditCardDescription] = useState("");
  const [deleteListDialogOpen, setDeleteListDialogOpen] = useState(false);
  const [submitEditingList, setSubmitEditingList] = useState(false);
  const [submitDeletingList, setSubmitDeletingList] = useState(false);
  const [submitCreatingCard, setSubmitCreatingCard] = useState(false);
  const [submitEditingCard, setSubmitEditingCard] = useState(false);
  const [submitDeletingCard, setSubmitDeletingCard] = useState(false);

  // 菜单已用 DropdownMenu 替换，无需 showMenu
  const [showPending, setShowPending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  // 菜单已用 DropdownMenu 替换，无需 menuRef
  const [editData, setEditData] = useState({
    title: list.title,
    description: list.description || "",
    tags: list.tags ? JSON.parse(list.tags) : ([] as string[]),
  });
  const [showTagSelector, setShowTagSelector] = useState(false);
  const { setNodeRef } = useDroppable({ id: list.id });

  const listTags = useMemo(() => {
    try {
      return list.tags ? JSON.parse(list.tags) : [];
    } catch {
      return [];
    }
  }, [list.tags]);

  const { pendingCards, completedCards } = useMemo(() => {
    const pending = list.cards
      .filter((c) => !c.completed)
      .sort((a, b) => a.position - b.position);
    const completed = list.cards
      .filter((c) => c.completed)
      .sort((a, b) => {
        if (!a.completed_at || !b.completed_at) return 0;
        return (
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime()
        );
      });
    return { pendingCards: pending, completedCards: completed };
  }, [list.cards]);

  const createCard = async () => {
    if (!newCardTitle.trim()) return;

    setSubmitCreatingCard(true);

    try {
      const result = await apiPost(
        "/api/todos/cards",
        {
          listId: list.id,
          title: newCardTitle,
          description: newCardDescription,
        },
        {
          showSuccessToast: true,
          successMessage: "待办已添加",
        }
      );

      if (result.success) {
        setNewCardTitle("");
        setNewCardDescription("");
        setShowAddCard(false);
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to create card:", error);
    } finally {
      setSubmitCreatingCard(false);
    }
  };

  const toggleComplete = async (cardId: number, completed: boolean) => {
    try {
      const result = await apiPut("/api/todos/cards", {
        cardId,
        completed: completed ? 1 : 0,
        completed_at: completed ? new Date().toISOString() : null,
      });

      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to toggle card:", error);
    }
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    setEditCardTitle(card.title);
    setEditCardDescription(card.description);
  };

  const saveCardEdit = async () => {
    if (!editingCard || !editCardTitle.trim()) return;

    setSubmitEditingCard(true);

    try {
      const result = await apiPut(
        "/api/todos/cards",
        {
          cardId: editingCard.id,
          title: editCardTitle,
          description: editCardDescription,
        },
        {
          showSuccessToast: true,
          successMessage: "待办已更新",
        }
      );

      if (result.success) {
        setEditingCard(null);
        setEditCardTitle("");
        setEditCardDescription("");
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to update card:", error);
    } finally {
      setSubmitEditingCard(false);
    }
  };

  const deleteCard = async (cardId: number) => {
    setSubmitDeletingCard(true);
    const result = await apiDelete(`/api/todos/cards?id=${cardId}`, {
      showSuccessToast: true,
      successMessage: "待办已删除",
    });

    setSubmitDeletingCard(false);

    if (result.success) {
      onUpdate();
    }
  };

  const saveListInfo = async () => {
    if (!editData.title.trim()) return;

    setSubmitEditingList(true);

    const result = await apiPut(
      "/api/todos/lists",
      {
        listId: list.id,
        title: editData.title,
        description: editData.description,
        tags: JSON.stringify(editData.tags),
      },
      {
        showSuccessToast: true,
        successMessage: "列表信息更新成功",
      }
    );

    setSubmitEditingList(false);

    if (result.success) {
      setShowEditDialog(false);
      setShowTagSelector(false);
      onUpdate();
    }
  };

  const deleteList = async () => {
    setSubmitDeletingList(true);
    const result = await apiDelete(`/api/todos/lists?id=${list.id}`, {
      showSuccessToast: true,
      successMessage: "列表删除成功",
    });

    setSubmitDeletingList(false);

    if (result.success) {
      onUpdate();
    }
  };

  const toggleTag = (tagValue: string) => {
    setEditData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagValue)
        ? prev.tags.filter((t: string) => t !== tagValue)
        : [...prev.tags, tagValue],
    }));
  };

  const openEditDialog = () => {
    setEditData({
      title: list.title,
      description: list.description || "",
      tags: list.tags ? JSON.parse(list.tags) : [],
    });
    setShowEditDialog(true);
  };

  return (
    <div className="flex-shrink-0 w-72 bg-fd-muted/30 block p-3 bg-fd-card hover:shadow-md border border-fd-border rounded-lg transition-all flex flex-col max-h-[calc(100vh-12rem)]">
      <div className="mb-3 flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-fd-foreground">{list.title}</h3>
            </div>
            {list.description && (
              <p className="text-xs text-fd-muted-foreground mb-1">
                {list.description}
              </p>
            )}
            {listTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {listTags.map((tagValue: string) => {
                  const tag = availableTags.find((t) => t.name === tagValue);
                  return tag ? (
                    <span
                      key={tagValue}
                      className="inline-block text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      {tag.description || tag.name}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
          {canEditTodo() && (
            <div className="flex-shrink-0 opacity-80 hover:opacity-100">
              <DropdownMenu
                items={[
                  {
                    label: "编辑",
                    icon: <Edit2 className="w-4 h-4" />,
                    onClick: (e) => {
                      e.stopPropagation();
                      openEditDialog();
                    },
                  },
                  {
                    label: "删除",
                    icon: <Trash2 className="w-4 h-4" />,
                    onClick: (e) => {
                      e.stopPropagation();
                      setDeleteListDialogOpen(true);
                    },
                    className:
                      "text-red-600 dark:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-950/20",
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto min-h-0 pr-1">
        {/* 未完成区域 */}
        {pendingCards.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setShowPending(!showPending)}
              className="w-full flex items-center justify-between text-xs text-fd-muted-foreground mb-2 hover:text-fd-foreground transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1">
                {showPending ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                <span>未完成</span>
                <span className="bg-fd-muted px-1.5 py-0.5 rounded">
                  {pendingCards.length}
                </span>
              </div>
            </button>
            <div
              className={`space-y-2 transition-all duration-300 ease-in-out ${
                showPending
                  ? "max-h-[10000px] opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <SortableContext
                items={pendingCards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {pendingCards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    onToggleComplete={toggleComplete}
                    onEdit={canEditTodo() ? handleEditCard : undefined}
                    onDelete={canEditTodo() ? deleteCard : undefined}
                    submitDeletingCard={submitDeletingCard}
                    submitEditingCard={submitEditingCard}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        )}

        {/* 已完成区域 */}
        {completedCards.length > 0 && (
          <div>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full flex items-center justify-between text-xs text-fd-muted-foreground mb-2 hover:text-fd-foreground transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1">
                {showCompleted ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                <span>已完成</span>
                <span className="bg-fd-muted px-1.5 py-0.5 rounded">
                  {completedCards.length}
                </span>
              </div>
            </button>
            <div
              className={`space-y-2 transition-all duration-300 ease-in-out ${
                showCompleted
                  ? "max-h-[10000px] opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              {completedCards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onToggleComplete={toggleComplete}
                  onEdit={canEditTodo() ? handleEditCard : undefined}
                  onDelete={canEditTodo() ? deleteCard : undefined}
                  submitDeletingCard={submitDeletingCard}
                  submitEditingCard={submitEditingCard}
                />
              ))}
            </div>
          </div>
        )}

        {!canEditTodo() &&
          pendingCards.length === 0 &&
          completedCards.length === 0 && (
            <div className="text-center py-4 text-fd-muted-foreground">
              暂无待办
            </div>
          )}
      </div>

      {canEditTodo() && (
        <div className="mt-3 flex-shrink-0">
          {editingCard ? (
            <div className="space-y-2 bg-fd-accent/50 p-3 rounded-md border border-fd-primary">
              <div className="text-xs font-medium text-fd-foreground mb-2">
                编辑待办
              </div>
              <input
                type="text"
                value={editCardTitle}
                onChange={(e) => setEditCardTitle(e.target.value)}
                placeholder="待办标题..."
                className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-sm text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
              />
              <textarea
                value={editCardDescription}
                onChange={(e) => setEditCardDescription(e.target.value)}
                placeholder="待办描述（可选）..."
                className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-sm text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <LoadingButton
                  loading={submitEditingCard}
                  onClick={saveCardEdit}
                  disabled={!editCardTitle.trim()}
                  loadingText={"保存中..."}
                  normalText={"保存"}
                  iconName={"Save"}
                />
                <button
                  onClick={() => {
                    setEditingCard(null);
                    setEditCardTitle("");
                    setEditCardDescription("");
                  }}
                  className="px-3 py-1.5 cursor-pointer text-sm bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  取消
                </button>
              </div>
            </div>
          ) : showAddCard ? (
            <div className="space-y-2">
              <input
                autoFocus
                type="text"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="待办标题..."
                className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-sm text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (newCardTitle.trim()) {
                      createCard();
                    }
                  }
                }}
              />
              <textarea
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                placeholder="待办描述（可选）..."
                className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-sm text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <LoadingButton
                  loading={submitCreatingCard}
                  onClick={createCard}
                  disabled={!newCardTitle.trim()}
                  loadingText={"添加中..."}
                  normalText={"添加"}
                  iconName={"Plus"}
                  className="px-3 py-1.5"
                />
                <button
                  onClick={() => {
                    setShowAddCard(false);
                    setNewCardTitle("");
                    setNewCardDescription("");
                  }}
                  className="px-3 py-1.5 cursor-pointer text-sm bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddCard(true)}
              className="w-full p-2 cursor-pointer text-sm text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground rounded-md transition-colors"
            >
              + 添加待办
            </button>
          )}
        </div>
      )}

      {/* 删除列表确认对话框 */}
      <Dialog
        isOpen={deleteListDialogOpen}
        onClose={() => setDeleteListDialogOpen(false)}
        onConfirm={deleteList}
        title="删除列表"
        description={`确定要删除列表“${list.title}”吗？列表内的所有卡片都将被删除，此操作无法撤销。`}
        confirmText="删除"
        type="danger"
        loading={submitDeletingList}
        loadingText="删除中..."
      />

      {/* 编辑列表对话框 */}
      {showEditDialog && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={() => {
              setShowEditDialog(false);
              setShowTagSelector(false);
            }}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-fd-card border border-fd-border rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-200">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-fd-border">
                <h2 className="text-lg font-semibold text-fd-foreground">
                  编辑列表
                </h2>
                <button
                  onClick={() => {
                    setShowEditDialog(false);
                    setShowTagSelector(false);
                  }}
                  className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-fd-foreground mb-1">
                    列表标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    placeholder="输入列表标题..."
                    className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fd-foreground mb-1">
                    列表描述
                  </label>
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    placeholder="列表描述（可选）..."
                    rows={3}
                    className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fd-foreground mb-1">
                    标签
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTagSelector(!showTagSelector)}
                      className="w-full px-3 py-2 cursor-pointer bg-fd-background border border-fd-border rounded-md text-left text-fd-foreground hover:border-fd-primary transition-colors"
                    >
                      {editData.tags.length > 0
                        ? `已选 ${editData.tags.length} 个标签`
                        : "选择标签..."}
                    </button>
                    {showTagSelector && (
                      <div className="absolute z-50 mt-1 w-full bg-fd-card border border-fd-border rounded-lg shadow-lg p-2 space-y-1 max-h-60 overflow-y-auto">
                        {availableTags.map((tag) => (
                          <label
                            key={tag.id}
                            className="flex items-center gap-2 p-2 hover:bg-fd-muted/50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={editData.tags.includes(tag.name)}
                              onChange={() => toggleTag(tag.name)}
                              className="w-4 h-4 rounded border-fd-border text-fd-primary focus:ring-fd-primary"
                            />
                            <span
                              className="px-2 py-0.5 text-xs rounded-full text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.description || tag.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {editData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editData.tags.map((tagValue: string) => {
                        const tag = availableTags.find(
                          (t) => t.name === tagValue
                        );
                        return tag ? (
                          <span
                            key={tagValue}
                            className="px-2 py-1 text-xs rounded-full text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.description || tag.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-2 justify-end px-6 py-4 border-t border-fd-border">
                <button
                  onClick={() => {
                    setShowEditDialog(false);
                    setShowTagSelector(false);
                  }}
                  className="px-4 py-2 bg-fd-secondary cursor-pointer text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  取消
                </button>
                <LoadingButton
                  loading={submitEditingList}
                  onClick={saveListInfo}
                  disabled={!editData.title.trim()}
                  loadingText={"保存中..."}
                  normalText={"保存"}
                  iconName={"Save"}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
