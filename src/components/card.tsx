"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useRef, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { DropdownMenu } from "./dropdown-menu";
import { Dialog } from "./dialog";
import LoadingWrapper from "./loading-wrapper";

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

interface CardProps {
  card: CardType;
  isDragging?: boolean;
  onToggleComplete: (cardId: number, completed: boolean) => void;
  onEdit?: (card: CardType) => void;
  onDelete?: (cardId: number) => void;
  submitEditingCard?: boolean;
  submitDeletingCard?: boolean;
}

export default function Card({
  card,
  isDragging,
  onToggleComplete,
  onEdit,
  onDelete,
  submitEditingCard,
  submitDeletingCard,
}: CardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const hasEditPermission = onEdit !== undefined || onDelete !== undefined;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: card.id,
    disabled: !hasEditPermission,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      transition ||
      (card.completed ? "all 0.3s ease-out" : "all 0.2s ease-in-out"),
    opacity: isSortableDragging || isDragging ? 0.5 : 1,
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating || !hasEditPermission) return;

    setIsUpdating(true);
    await onToggleComplete(card.id, !card.completed);
    setIsUpdating(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-fd-card border border-fd-border p-3 hover:border-fd-primary rounded-md transition-all ${
        hasEditPermission
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      } relative group ${card.completed ? "opacity-70" : ""}`}
    >
      <div className="flex items-start gap-2">
        <LoadingWrapper loading={isUpdating}>
          <button
            onClick={handleToggle}
            disabled={isUpdating || !hasEditPermission}
            className={`mt-0.5 flex-shrink-0 ${
              hasEditPermission
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            {...({} as any)}
          >
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                card.completed
                  ? "bg-fd-primary border-fd-primary"
                  : "border-fd-border hover:border-fd-primary"
              }`}
            >
              {card.completed ? (
                <svg
                  className="w-3 h-3 text-fd-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : null}
            </div>
          </button>
        </LoadingWrapper>
        <div
          className="flex-1 min-w-0"
          {...attributes}
          {...(hasEditPermission ? listeners : {})}
        >
          <div className="flex items-start gap-2 mb-1">
            <div
              className={`flex-1 font-medium text-sm text-fd-foreground ${
                card.completed ? "line-through" : ""
              }`}
            >
              {card.title}
            </div>
            {/* 更多操作按钮 */}
            {(onEdit || onDelete) && (
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100">
                <DropdownMenu
                  items={
                    [
                      onEdit
                        ? {
                            label: "编辑",
                            icon: <Edit2 className="w-4 h-4" />,
                            onClick: (e: React.MouseEvent) => {
                              e.stopPropagation();
                              onEdit(card);
                            },
                          }
                        : undefined,
                      onDelete
                        ? {
                            label: "删除",
                            icon: <Trash2 className="w-4 h-4" />,
                            onClick: (e: React.MouseEvent) => {
                              e.stopPropagation();
                              setDeleteDialogOpen(true);
                            },
                            className:
                              "text-fd-destructive hover:!bg-fd-destructive/10",
                          }
                        : undefined,
                    ].filter(
                      Boolean
                    ) as import("@/components/dropdown-menu").DropdownMenuItem[]
                  }
                />
              </div>
            )}
          </div>
          {card.description && (
            <div
              className={`text-xs text-fd-muted-foreground mb-2 ${
                card.completed ? "line-through" : ""
              }`}
            >
              {card.description}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-fd-muted-foreground">
            <span>@{card.creator_name}</span>
            {card.completed && card.completed_at ? (
              <span className="text-fd-success">
                ✓ {formatDate(card.completed_at)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {onDelete && (
        <Dialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={async () => await onDelete(card.id)}
          title="删除卡片"
          description={`确定要删除卡片"${card.title}"吗？此操作无法撤销。`}
          confirmText="删除"
          type="danger"
          loading={submitDeletingCard}
          loadingText="删除中..."
        />
      )}
    </div>
  );
}
