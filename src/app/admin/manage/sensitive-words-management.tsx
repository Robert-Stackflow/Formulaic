import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  X,
  Copy,
  Eye,
  EyeOff,
  FileInput,
  Plus,
  Bug,
  ListStart,
} from "lucide-react";
import { Dialog } from "@/components/dialog";
import LoadingButton from "@/components/loading-button";
import { showToast } from "@/components/toast";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";
import { SensitiveWord } from "@/types/admin";

interface SensitiveWordsManagementProps {
  sensitiveWords: SensitiveWord[];
  loadData: () => Promise<void>;
}

/**
 * 敏感词管理 Tab 内容
 */
export const SensitiveWordsManagement: React.FC<
  SensitiveWordsManagementProps
> = ({ sensitiveWords, loadData }) => {
  // 复制所有与敏感词管理相关的 useState 和 useRef
  const [newWord, setNewWord] = useState("");
  const [newWordType, setNewWordType] = useState<"text" | "regex">("text");
  const [bulkWords, setBulkWords] = useState("");
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showWordTypeDropdown, setShowWordTypeDropdown] = useState(false);
  const [testText, setTestText] = useState("");
  const [testResult, setTestResult] = useState<{
    isSensitive: boolean;
    matches: Array<{ word: string; type: string }>;
  } | null>(null);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [submitTestingWords, setSubmitTestingWords] = useState(false);
  const [submitCreatingWord, setSubmitCreatingWord] = useState(false);
  const [submitDeletingWord, setSubmitDeletingWord] = useState(false);
  const [submitCreatingBatchWords, setSubmitCreatingBatchWords] =
    useState(false);
  const [deletingWordId, setDeletingWordId] = useState<number | null>(null);
  const [editorHeight, setEditorHeight] = useState(300);

  const wordTypeDropdownRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleTestSensitiveWords = async () => {
    if (!testText.trim()) {
      setTestResult(null);
      return;
    }

    setSubmitTestingWords(true);
    const result = await apiPost<{
      isSensitive: boolean;
      matches: Array<{ word: string; type: string }>;
    }>("/api/admin/sensitive-words/test", { text: testText });
    setSubmitTestingWords(false);

    if (result.success && result.data) {
      setTestResult({
        isSensitive: result.data.isSensitive,
        matches: result.data.matches || [],
      });
    }
  };

  const handleExportSensitiveWords = () => {
    if (sensitiveWords.length === 0) {
      showToast("没有敏感词可导出", "error");
      return;
    }

    // 构建导出内容，格式与导入格式一致
    const exportContent = sensitiveWords
      .map((word) => {
        if (word.is_regex === 1 || word.type === "regex") {
          return `regex:${word.word}`;
        }
        return word.word;
      })
      .join("\n");

    // 创建下载链接
    const blob = new Blob([exportContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sensitive-words-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`已导出 ${sensitiveWords.length} 个敏感词`, "success");
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.name.endsWith(".txt")) {
      showToast("请选择 .txt 文件", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setBulkWords(content);
      showToast(`已加载文件：${file.name}`, "success");
    };
    reader.onerror = () => {
      showToast("文件读取失败", "error");
    };
    reader.readAsText(file, "utf-8");

    // 重置 input 以便可以重复选择同一文件
    event.target.value = "";
  };

  const handleAddWord = async () => {
    if (!newWord.trim()) return;

    setSubmitCreatingWord(true);
    const result = await apiPost(
      "/api/admin/sensitive-words",
      {
        word: newWord.trim(),
        type: newWordType,
        is_regex: newWordType === "regex" ? 1 : 0,
      },
      {
        showSuccessToast: true,
        successMessage: "敏感词添加成功",
      }
    );
    setSubmitCreatingWord(false);

    if (result.success) {
      setNewWord("");
      loadData();
    }
  };

  const handleDeleteWord = async () => {
    if (!deletingWordId) return;

    setSubmitDeletingWord(true);

    const result = await apiDelete(
      `/api/admin/sensitive-words?id=${deletingWordId}`,
      {
        showSuccessToast: true,
        successMessage: "敏感词删除成功",
      }
    );

    setSubmitDeletingWord(false);
    setDeletingWordId(null);

    if (result.success) {
      loadData();
    }
  };

  const handleBulkImport = async () => {
    const lines = bulkWords
      .split("\n")
      .map((w: string) => w.trim())
      .filter((w: string) => w.length > 0);

    if (lines.length === 0) {
      showToast("请输入至少一个敏感词", "error");
      return;
    }

    // 解析每行，支持 regex: 前缀
    const wordsData = lines
      .map((line) => {
        if (line.startsWith("regex:") || line.startsWith("REGEX:")) {
          const word = line.substring(6).trim();
          return { word, type: "regex", is_regex: 1 };
        } else {
          return { word: line, type: "text", is_regex: 0 };
        }
      })
      .filter((item) => item.word.length > 0);

    if (wordsData.length === 0) {
      showToast("请输入至少一个有效的敏感词", "error");
      return;
    }

    setSubmitCreatingBatchWords(true);
    const result = await apiPost<{
      count: number;
      skipped: number;
      invalidRegex: number;
    }>(
      "/api/admin/sensitive-words/batch",
      { words: wordsData },
      { showSuccessToast: false }
    );
    setSubmitCreatingBatchWords(false);

    if (result.success && result.data) {
      let message = `成功导入 ${result.data.count} 个敏感词`;
      if (result.data.skipped > 0) {
        message += `，跳过 ${result.data.skipped} 个重复词`;
      }
      if (result.data.invalidRegex > 0) {
        message += `，${result.data.invalidRegex} 个无效正则`;
      }
      showToast(message, "success");
      setBulkWords("");
      setShowBulkImport(false);
      loadData();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wordTypeDropdownRef.current &&
        !wordTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowWordTypeDropdown(false);
      }
    };

    if (showWordTypeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWordTypeDropdown]);

  return (
    <>
      {/* 敏感词管理 */}
      {
        <div className="space-y-4">
          {/* 操作按钮 */}
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder={
                newWordType === "regex" ? "输入正则表达式" : "输入敏感词"
              }
              className="flex-1 min-w-[200px] px-3 py-2 bg-fd-card border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
              onKeyPress={(e) => e.key === "Enter" && handleAddWord()}
            />
            <div className="relative" ref={wordTypeDropdownRef}>
              <button
                type="button"
                onClick={() => setShowWordTypeDropdown(!showWordTypeDropdown)}
                className="px-3 py-2 bg-fd-card cursor-pointer border border-fd-border rounded-md text-fd-foreground flex items-center gap-2 hover:border-fd-primary focus:outline-none focus:ring-2 focus:ring-fd-primary transition-colors whitespace-nowrap"
              >
                <span>{newWordType === "regex" ? "正则" : "文本"}</span>
                <ChevronDown
                  className={`h-4 w-4 text-fd-muted-foreground transition-transform ${
                    showWordTypeDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showWordTypeDropdown && (
                <div className="absolute z-10 w-full cursor-pointer mt-1 bg-fd-card border border-fd-border rounded-md shadow-lg overflow-hidden animate-in fade-in duration-200">
                  <div
                    onClick={() => {
                      setNewWordType("text");
                      setShowWordTypeDropdown(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-fd-muted/50 text-fd-foreground transition-colors ${
                      newWordType === "text" ? "bg-fd-muted/30" : ""
                    }`}
                  >
                    文本
                  </div>
                  <div
                    onClick={() => {
                      setNewWordType("regex");
                      setShowWordTypeDropdown(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-fd-muted/50 text-fd-foreground transition-colors ${
                      newWordType === "regex" ? "bg-fd-muted/30" : ""
                    }`}
                  >
                    正则
                  </div>
                </div>
              )}
            </div>
            <LoadingButton
              onClick={handleAddWord}
              loading={submitCreatingWord}
              disabled={!newWord.trim()}
              loadingText={"添加中..."}
              normalText={"添加"}
              iconName={"Plus"}
            />
            <button
              onClick={() => {
                setShowTestPanel(!showTestPanel);
                if (!showTestPanel) setShowBulkImport(false);
              }}
              className="px-4 py-2 cursor-pointer bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30 rounded-md hover:bg-blue-500/20 dark:hover:bg-blue-500/30 transition-all whitespace-nowrap"
            >
              {showTestPanel ? "关闭测试" : "测试"}
            </button>
            <button
              onClick={() => {
                setShowBulkImport(!showBulkImport);
                if (!showBulkImport) setShowTestPanel(false);
              }}
              className="px-4 py-2 cursor-pointer bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 transition-all whitespace-nowrap"
            >
              {showBulkImport ? "关闭批量导入" : "批量导入"}
            </button>
            <button
              onClick={handleExportSensitiveWords}
              disabled={sensitiveWords.length === 0}
              className="px-4 py-2 cursor-pointer bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 border border-violet-500/30 rounded-md hover:bg-violet-500/20 dark:hover:bg-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              导出
            </button>
          </div>

          {showBulkImport && (
            <div className="border border-fd-border rounded-lg p-4 bg-fd-card">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-fd-foreground">
                    批量导入敏感词（每行一个）
                  </label>
                  <label className="px-3 py-1.5 cursor-pointer bg-fd-primary/10 hover:bg-fd-primary/20 text-fd-primary text-sm rounded-md transition-colors border border-fd-primary/30">
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                    <FileInput className="w-4 h-4 inline-block mr-1 -mt-1" />
                    从文件导入
                  </label>
                </div>
                <div className="text-xs text-fd-muted-foreground space-y-1">
                  <p>• 默认为文本类型，直接输入即可</p>
                  <p>
                    • 正则表达式请使用{" "}
                    <code className="px-1 py-0.5 bg-fd-muted rounded text-purple-600 dark:text-purple-400">
                      regex:
                    </code>{" "}
                    前缀
                  </p>
                </div>
              </div>
              {/* 编辑器和预览表格 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {/* 左侧：编辑器 */}
                <div>
                  <textarea
                    autoFocus
                    ref={(el) => {
                      editorRef.current = el;
                      if (el) {
                        const resizeObserver = new ResizeObserver(() => {
                          if (el) {
                            setEditorHeight(el.offsetHeight);
                          }
                        });
                        resizeObserver.observe(el);
                        return () => resizeObserver.disconnect();
                      }
                    }}
                    value={bulkWords}
                    onChange={(e) => setBulkWords(e.target.value)}
                    placeholder={[
                      "敏感词1",
                      "regex:\\b违规\\b",
                      "敏感词2",
                      "regex:[0-9]{6}",
                    ].join("\n")}
                    className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-fd-primary resize-y min-h-[300px]"
                  />
                </div>

                {/* 右侧：预览表格 */}
                <div
                  className="border border-fd-border rounded-md overflow-hidden flex flex-col"
                  style={{ height: `${editorHeight}px` }}
                >
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-fd-muted sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-fd-foreground border-b border-fd-border w-20">
                            类型
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-fd-foreground border-b border-fd-border">
                            敏感词
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(bulkWords || "")
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line, index) => {
                            const isRegex = line.trim().startsWith("regex:");
                            const word = isRegex
                              ? line.trim().substring(6)
                              : line.trim();
                            return (
                              <tr
                                key={index}
                                className="border-b border-fd-border/50 hover:bg-fd-muted/30"
                              >
                                <td className="px-3 py-2">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${
                                      isRegex
                                        ? "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300"
                                        : "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                                    }`}
                                  >
                                    {isRegex ? "正则" : "文本"}
                                  </span>
                                </td>
                                <td className="px-3 py-2 font-mono text-fd-foreground break-all">
                                  {word}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    {!bulkWords.trim() && (
                      <div className="text-center py-8 text-fd-muted-foreground text-sm">
                        在左侧输入敏感词，这里会实时预览
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => {
                    setBulkWords("");
                    setShowBulkImport(false);
                  }}
                  className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  取消
                </button>
                <LoadingButton
                  onClick={handleBulkImport}
                  loading={submitCreatingBatchWords}
                  disabled={!bulkWords.trim()}
                  loadingText={"导入中..."}
                  normalText={"导入"}
                  iconName={"ListStart"}
                />
              </div>
            </div>
          )}

          {/* 测试敏感词面板 */}
          {showTestPanel && (
            <div className="border border-fd-border rounded-lg p-4 bg-fd-card">
              <label className="block text-sm font-medium mb-2 text-fd-foreground">
                测试文本是否包含敏感词
              </label>
              <textarea
                autoFocus
                value={testText}
                onChange={(e) => {
                  setTestText(e.target.value);
                  setTestResult(null);
                }}
                placeholder="输入要测试的文本..."
                rows={4}
                className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground text-sm focus:outline-none focus:ring-2 focus:ring-fd-primary"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex-1">
                  {testResult && (
                    <div className="text-sm">
                      {testResult.isSensitive ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                              包含敏感词
                            </span>
                            <span className="text-fd-muted-foreground">
                              匹配到 {testResult.matches.length} 个敏感词
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {testResult.matches.map((match, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900"
                              >
                                {match.word}
                                {match.type === "regex" && (
                                  <span className="text-purple-600 dark:text-purple-400">
                                    (正则)
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800">
                          未包含敏感词
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTestText("");
                      setTestResult(null);
                      setShowTestPanel(false);
                    }}
                    className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    取消
                  </button>
                  <LoadingButton
                    onClick={handleTestSensitiveWords}
                    loading={submitTestingWords}
                    disabled={!testText.trim()}
                    loadingText={"测试中..."}
                    normalText={"开始测试"}
                    iconName={"Bug"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 敏感词列表 */}
          <div className="px-4 py-4 bg-fd-card border border-fd-border rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-fd-foreground">
              敏感词列表
            </h3>
            <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {sensitiveWords.map((word: SensitiveWord) => (
                <div
                  key={word.id}
                  className="border flex items-center gap-2 p-3 bg-fd-muted/40 rounded-md transition-colors hover:border-fd-primary "
                >
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span
                      className="text-fd-foreground truncate"
                      title={word.word}
                    >
                      {word.word}
                    </span>
                    {(word.is_regex === 1 || word.type === "regex") && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 whitespace-nowrap">
                        正则
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (navigator?.clipboard?.writeText) {
                        navigator.clipboard.writeText(word.word);
                        showToast("已复制到剪贴板", "success");
                      } else {
                        const textarea = document.createElement("textarea");
                        textarea.value = word.word;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);

                        showToast("已复制（兼容模式）", "success");
                      }
                    }}
                    className="p-1 cursor-pointer text-fd-muted-foreground hover:text-fd-foreground transition-colors flex-shrink-0"
                    title="复制"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingWordId(word.id)}
                    className="px-3 py-1 cursor-pointer text-xs font-medium bg-red-600 dark:bg-red-700 text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
            {sensitiveWords.length === 0 && (
              <p className="text-center text-fd-muted-foreground py-8">
                暂无敏感词
              </p>
            )}
          </div>
        </div>
      }

      {/* 删除敏感词确认对话框 */}
      <Dialog
        isOpen={deletingWordId !== null}
        onClose={() => setDeletingWordId(null)}
        title="确认删除"
        description="确定要删除这个敏感词吗？此操作不可恢复。"
        onConfirm={handleDeleteWord}
        loading={submitDeletingWord}
        loadingText="删除中..."
        confirmText="删除"
        cancelText="取消"
      />
    </>
  );
};
