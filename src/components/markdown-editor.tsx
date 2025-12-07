"use client";

import { useState } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "输入内容...",
  minHeight = "300px",
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  // 简单的Markdown渲染（可以后续替换为专业库如react-markdown）
  const renderMarkdown = (text: string) => {
    let html = text
      // 标题
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold my-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold my-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h2 class="text-2xl font-bold my-4">$1</h2>')
      // 粗体
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      // 斜体
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      // 代码块
      .replace(
        /```(.*?)```/gims,
        '<pre class="bg-fd-muted p-3 rounded my-2 overflow-x-auto"><code>$1</code></pre>'
      )
      // 行内代码
      .replace(
        /`(.*?)`/gim,
        '<code class="bg-fd-muted px-1.5 py-0.5 rounded text-sm">$1</code>'
      )
      // 链接
      .replace(
        /\[(.*?)\]\((.*?)\)/gim,
        '<a href="$2" class="text-fd-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // 列表
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      // 换行
      .replace(/\n/gim, "<br />");

    return html;
  };

  return (
    <div className="border border-fd-border rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center gap-1 px-3 py-2 bg-fd-muted/30 border-b border-fd-border">
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className={`px-3 py-1 text-sm cursor-pointer rounded transition-colors ${
            !showPreview
              ? "bg-fd-primary text-fd-primary-foreground"
              : "text-fd-muted-foreground hover:bg-fd-muted"
          }`}
        >
          编辑
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className={`px-3 py-1 text-sm cursor-pointer rounded transition-colors ${
            showPreview
              ? "bg-fd-primary text-fd-primary-foreground"
              : "text-fd-muted-foreground hover:bg-fd-muted"
          }`}
        >
          预览
        </button>
        <div className="ml-auto text-xs text-fd-muted-foreground">
          支持 Markdown 格式
        </div>
      </div>

      {/* 编辑/预览区域 */}
      <div style={{ minHeight }}>
        {!showPreview ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-fd-background text-fd-foreground resize-none focus:outline-none"
            style={{ minHeight }}
          />
        ) : (
          <div
            className="p-4 prose prose-sm max-w-none text-fd-foreground"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        )}
      </div>

      {/* 提示 */}
      {!showPreview && (
        <div className="px-4 py-2 bg-fd-muted/20 border-t border-fd-border text-xs text-fd-muted-foreground">
          <span className="font-medium">快捷提示：</span> **粗体** *斜体* `代码`
          [链接](url) # 标题
        </div>
      )}
    </div>
  );
}
