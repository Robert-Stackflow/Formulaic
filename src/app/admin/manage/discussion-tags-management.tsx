import React, { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { IconPicker } from "@/components/icon-picker";
import { ColorPicker } from "@/components/color-picker";
import { FormDialog } from "@/components/form-dialog";
import { Dialog } from "@/components/dialog";
import LoadingButton from "@/components/loading-button";
import { showToast } from "@/components/toast";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";
import { DiscussionTag } from "@/types/admin";

interface DiscussionTagsManagementProps {
  discussionTags: DiscussionTag[];
  loadData: () => Promise<void>;
}

/**
 * 主题标签管理 Tab 内容
 */
export const DiscussionTagsManagement: React.FC<
  DiscussionTagsManagementProps
> = ({ discussionTags, loadData }) => {
  // 复制所有与主题标签管理相关的 useState
  const [editingTag, setEditingTag] = useState<DiscussionTag | null>(null);
  const [showTagForm, setShowTagForm] = useState(false);
  const [tagForm, setTagForm] = useState({
    name: "",
    color: "#3b82f6",
    description: "",
    icon: "",
  });
  const [submitCreatingTag, setSubmitCreatingTag] = useState(false);
  const [submitEditingTag, setSubmitEditingTag] = useState(false);
  const [submitDeletingTag, setSubmitDeletingTag] = useState(false);
  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);

  // 复制所有 handleCreateTag, handleUpdateTag, handleDeleteTag, startEditTag 等函数
  // 主题标签管理函数
  const handleCreateTag = async () => {
    if (!tagForm.name || !tagForm.color) {
      showToast("名称和颜色不能为空", "error");
      return;
    }

    setSubmitCreatingTag(true);
    const result = await apiPost("/api/admin/discussion-tags", tagForm, {
      showSuccessToast: true,
      successMessage: "主题标签创建成功",
    });
    setSubmitCreatingTag(false);

    if (result.success) {
      setTagForm({ name: "", color: "#3b82f6", description: "", icon: "" });
      setShowTagForm(false);
      loadData();
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag) return;

    setSubmitEditingTag(true);
    const result = await apiPatch(
      "/api/admin/discussion-tags",
      {
        id: editingTag.id,
        name: tagForm.name,
        color: tagForm.color,
        description: tagForm.description,
        icon: tagForm.icon,
      },
      {
        showSuccessToast: true,
        successMessage: "主题标签更新成功",
      }
    );
    setSubmitEditingTag(false);

    if (result.success) {
      setEditingTag(null);
      setShowTagForm(false);
      setTagForm({ name: "", color: "#3b82f6", description: "", icon: "" });
      loadData();
    }
  };

  const handleDeleteTag = async () => {
    if (!deletingTagId) return;

    setSubmitDeletingTag(true);
    const result = await apiDelete(
      `/api/admin/discussion-tags?id=${deletingTagId}`,
      {
        showSuccessToast: true,
        successMessage: "主题标签删除成功",
      }
    );
    setSubmitDeletingTag(false);
    setDeletingTagId(null);

    if (result.success) {
      loadData();
    }
  };

  const startEditTag = (tag: DiscussionTag) => {
    setEditingTag(tag);
    setTagForm({
      name: tag.name,
      color: tag.color,
      description: tag.description || "",
      icon: tag.icon || "",
    });
    setShowTagForm(true);
  };

  return (
    <>
      {/* 主题标签管理 */}
      {
        <div className="space-y-4">
          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowTagForm(true)}
              className="px-4 py-2 cursor-pointer bg-fd-primary text-fd-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              创建新标签
            </button>
          </div>

          {/* 主题标签列表 */}
          <div className="px-4 py-4 bg-fd-card border border-fd-border rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-fd-foreground">
              主题标签列表
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {discussionTags.map((tag: DiscussionTag) => (
                <div
                  key={tag.id}
                  className="border border-fd-border rounded-lg p-4 bg-fd-muted/30 hover:border-fd-primary transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {tag.icon && (
                        <IconRenderer
                          iconName={tag.icon}
                          className="w-5 h-5"
                          style={{ color: tag.color }}
                        />
                      )}
                      {!tag.icon && (
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: tag.color }}
                        />
                      )}
                      <span className="font-medium text-fd-foreground">
                        {tag.name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditTag(tag)}
                        className="px-2 py-1 text-xs cursor-pointer bg-blue-600 dark:bg-blue-700 text-white rounded hover:opacity-90"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => setDeletingTagId(tag.id)}
                        className="px-2 py-1 text-xs cursor-pointer bg-red-600 dark:bg-red-700 text-white rounded hover:opacity-90"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  {tag.description && (
                    <p className="text-sm text-fd-muted-foreground mb-2">
                      {tag.description}
                    </p>
                  )}
                  {tag.icon && (
                    <p className="text-xs text-fd-muted-foreground">
                      图标: {tag.icon}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {discussionTags.length === 0 && (
              <p className="text-center text-fd-muted-foreground py-8">
                暂无主题标签
              </p>
            )}
          </div>
        </div>
      }

      {/* 添加/编辑主题标签对话框 */}
      <FormDialog
        isOpen={showTagForm}
        onClose={() => {
          setShowTagForm(false);
          setEditingTag(null);
          setTagForm({
            name: "",
            color: "#3b82f6",
            description: "",
            icon: "",
          });
        }}
        title={editingTag ? "编辑主题标签" : "创建主题标签"}
        footer={
          <>
            <button
              onClick={() => {
                setShowTagForm(false);
                setEditingTag(null);
                setTagForm({
                  name: "",
                  color: "#3b82f6",
                  description: "",
                  icon: "",
                });
              }}
              className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              取消
            </button>
            <LoadingButton
              onClick={editingTag ? handleUpdateTag : handleCreateTag}
              loading={editingTag ? submitEditingTag : submitCreatingTag}
              disabled={!tagForm.name || !tagForm.color}
              loadingText={editingTag ? "更新中..." : "创建中..."}
              normalText={editingTag ? "更新" : "创建"}
              iconName={editingTag ? "Save" : "Plus"}
            />
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium mb-2 text-fd-foreground">
            主题标签名称 <span className="text-red-500">*</span>
          </label>
          <input
            autoFocus
            type="text"
            value={tagForm.name}
            onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
            placeholder="例如: bug"
            className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-fd-foreground">
            描述
          </label>
          <input
            type="text"
            value={tagForm.description}
            onChange={(e) =>
              setTagForm({
                ...tagForm,
                description: e.target.value,
              })
            }
            placeholder="主题标签描述"
            className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
          />
        </div>

        <div>
          <IconPicker
            value={tagForm.icon || "Tag"}
            onChange={(icon) => setTagForm({ ...tagForm, icon })}
            label="图标"
          />
        </div>

        <div>
          <ColorPicker
            value={tagForm.color}
            onChange={(color) => setTagForm({ ...tagForm, color })}
            label="颜色 *"
          />
        </div>
      </FormDialog>
      {/* 删除主题标签确认对话框 */}
      <Dialog
        isOpen={deletingTagId !== null}
        onClose={() => setDeletingTagId(null)}
        title="确认删除"
        description="确定要删除这个主题标签吗？此操作不可恢复。"
        onConfirm={handleDeleteTag}
        loading={submitDeletingTag}
        loadingText="删除中..."
        confirmText="删除"
        cancelText="取消"
      />
    </>
  );
};
