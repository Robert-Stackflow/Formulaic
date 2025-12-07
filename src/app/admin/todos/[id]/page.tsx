"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/page-layout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import BoardList from "@/components/board-list";
import Card from "@/components/card";
import { LoadingPage } from "@/components/loading";
import { apiGet, apiPost, apiPatch, apiPut } from "@/lib/api-client";
import { X } from "lucide-react";
import { FormDialog } from "@/components/form-dialog";
import LoadingButton from "@/components/loading-button";

interface Card {
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
  cards: Card[];
}

interface Board {
  id: number;
  title: string;
  description: string;
}

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { session, canEditTodo } = usePermissions();
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [boardId, setBoardId] = useState<string>("");
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newListTags, setNewListTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<
    Array<{
      id: number;
      name: string;
      color: string;
      description: string | null;
      icon: string | null;
    }>
  >([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [submitCreatingList, setSubmitCreatingList] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    params.then((p) => setBoardId(p.id));
  }, [params]);

  useEffect(() => {
    if (boardId) {
      fetchBoard();
      fetchTags();
    }
  }, [boardId]);

  const fetchTags = async () => {
    const result = await apiGet("/api/admin/discussion-tags");
    if (result.success && result.data) {
      setAvailableTags(result.data.tags || []);
    }
  };

  const fetchBoard = async () => {
    const result = await apiGet(`/api/todos/boards/${boardId}`);
    if (result.success && result.data) {
      setBoard(result.data.board);
      setLists(result.data.lists);
      if (result.data.board?.title) {
        document.title = `${result.data.board.title} - TODO 看板 - Formulaic`;
      }
    }
  };

  const toggleTag = (tagName: string) => {
    setNewListTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const getTagColor = (tagName: string) => {
    const tag = availableTags.find((t) => t.name === tagName);
    return tag ? tag.color : "#gray";
  };

  const getTagDescription = (tagName: string) => {
    const tag = availableTags.find((t) => t.name === tagName);
    return tag ? tag.description || tag.name : tagName;
  };

  const createList = async () => {
    if (!newListTitle.trim() || !boardId) return;

    setSubmitCreatingList(true);

    const result = await apiPost(
      "/api/todos/lists",
      {
        boardId: boardId,
        title: newListTitle,
        description: newListDescription.trim() || undefined,
        tags: newListTags.length > 0 ? JSON.stringify(newListTags) : undefined,
      },
      {
        showSuccessToast: true,
        successMessage: "列表已创建",
      }
    );

    setSubmitCreatingList(false);

    if (result.success) {
      setNewListTitle("");
      setNewListDescription("");
      setNewListTags([]);
      setShowAddList(false);
      fetchBoard();
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeList = lists.find((list) =>
      list.cards.some((card) => card.id === active.id)
    );
    const card = activeList?.cards.find((c) => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeListId = lists.find((list) =>
      list.cards.some((card) => card.id === active.id)
    )?.id;
    const overListId = lists.find(
      (list) =>
        list.cards.some((card) => card.id === over.id) || list.id === over.id
    )?.id;

    if (!activeListId || !overListId || activeListId === overListId) return;

    setLists((lists) => {
      const activeList = lists.find((list) => list.id === activeListId)!;
      const overList = lists.find((list) => list.id === overListId)!;
      const activeCard = activeList.cards.find(
        (card) => card.id === active.id
      )!;

      return lists.map((list) => {
        if (list.id === activeListId) {
          return {
            ...list,
            cards: list.cards.filter((card) => card.id !== active.id),
          };
        }
        if (list.id === overListId) {
          return {
            ...list,
            cards: [...list.cards, { ...activeCard, list_id: overListId }],
          };
        }
        return list;
      });
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeListId = lists.find((list) =>
      list.cards.some((card) => card.id === active.id)
    )?.id;
    const overListId = lists.find(
      (list) =>
        list.cards.some((card) => card.id === over.id) || list.id === over.id
    )?.id;

    if (!activeListId || !overListId) return;

    // Update card position via API
    await apiPut("/api/todos/cards", {
      cardId: active.id,
      listId: overListId,
    });
  };

  if (!board) {
    return <LoadingPage message="加载看板详情..." />;
  }

  return (
    <PageLayout maxWidth="2xl">
      <Link
        href="/todos"
        className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>返回看板列表</span>
      </Link>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fd-foreground">
            {board.title}
          </h1>
          <p className="text-fd-muted-foreground">{board.description}</p>
        </div>
        {canEditTodo() && (
          <button
            onClick={() => setShowAddList(true)}
            className="px-4 py-2 bg-fd-primary text-white text-sm cursor-pointer rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span>添加列表</span>
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 pb-4 [column-fill:balance]">
          {lists.map((list) => (
            <div key={list.id} className="break-inside-avoid mb-4">
              <BoardList list={list} boardId={boardId} onUpdate={fetchBoard} />
            </div>
          ))}
        </div>

        {lists.length === 0 &&
          (canEditTodo() ? (
            <div className="text-center py-12 text-fd-muted-foreground">
              还没有列表，
              {session ? (
                <button
                  onClick={() => setShowAddList(true)}
                  className="text-fd-primary hover:underline cursor-pointer"
                >
                  来创建第一个吧！
                </button>
              ) : (
                "登录后可以创建列表"
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-fd-muted-foreground">
              暂无列表
            </div>
          ))}

        <DragOverlay>
          {activeCard ? (
            <Card card={activeCard} isDragging onToggleComplete={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 新建列表对话框 */}
      <FormDialog
        isOpen={showAddList}
        onClose={() => {
          setShowAddList(false);
          setNewListTitle("");
          setNewListDescription("");
          setNewListTags([]);
          setShowTagSelector(false);
        }}
        title="添加列表"
        maxWidth="md"
        footer={
          <>
            <button
              onClick={() => {
                setShowAddList(false);
                setNewListTitle("");
                setNewListDescription("");
                setNewListTags([]);
                setShowTagSelector(false);
              }}
              className="px-4 py-2 bg-fd-secondary cursor-pointer text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              取消
            </button>
            <LoadingButton
              loading={submitCreatingList}
              onClick={createList}
              disabled={!newListTitle.trim()}
              loadingText={"添加中..."}
              normalText={"添加"}
              iconName={"Plus"}
            />
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-fd-foreground mb-1">
            列表标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
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
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
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
              {newListTags.length > 0
                ? `已选 ${newListTags.length} 个标签`
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
                      checked={newListTags.includes(tag.name)}
                      onChange={() => toggleTag(tag.name)}
                      className="w-4 h-4 rounded border-fd-border text-fd-primary focus:ring-fd-primary"
                    />
                    <span
                      className="px-2 py-0.5 text-xs rounded-full text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.description}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {newListTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {newListTags.map((tagName) => (
                <span
                  key={tagName}
                  className="px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: getTagColor(tagName) }}
                >
                  {getTagDescription(tagName)}
                </span>
              ))}
            </div>
          )}
        </div>
      </FormDialog>
    </PageLayout>
  );
}
