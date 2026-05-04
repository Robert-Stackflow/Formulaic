"use client";

import { useState } from "react";
import { ThumbsUpIcon, ThumbsDownIcon, AlertCircleIcon, EditIcon, CheckIcon } from "lucide-react";

interface DocFeedbackProps {
  githubEditUrl: string;
  githubIssueUrl: string;
}

export function DocFeedback({ githubEditUrl, githubIssueUrl }: DocFeedbackProps) {
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  const handleFeedback = (type: "helpful" | "not-helpful") => {
    setFeedback(type);
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 3000);
  };

  return (
    <div className="pt-4 border-t border-fd-border" id="doc-feedback">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Feedback Section */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-fd-foreground">
            这篇文档有帮助吗？
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback("helpful")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                feedback === "helpful"
                  ? "bg-fd-success/10 text-fd-success border border-fd-success/30"
                  : "bg-fd-card border border-fd-border text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-foreground/30"
              }`}
              disabled={feedback !== null}
            >
              <ThumbsUpIcon className="w-4 h-4" />
              有帮助
            </button>
            <button
              onClick={() => handleFeedback("not-helpful")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                feedback === "not-helpful"
                  ? "bg-fd-warning/10 text-fd-warning border border-fd-warning/30"
                  : "bg-fd-card border border-fd-border text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-foreground/30"
              }`}
              disabled={feedback !== null}
            >
              <ThumbsDownIcon className="w-4 h-4" />
              需要改进
            </button>
          </div>
          {showThanks && (
            <span className="inline-flex items-center gap-1.5 text-sm text-fd-success animate-in fade-in slide-in-from-left-2">
              <CheckIcon className="w-4 h-4" />
              感谢反馈！
            </span>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={githubIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-fd-card border border-fd-border text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-foreground/30 transition-all"
          >
            <AlertCircleIcon className="w-4 h-4" />
            报告问题
          </a>
          <a
            href={githubEditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-fd-card border border-fd-border text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-foreground/30 transition-all"
          >
            <EditIcon className="w-4 h-4" />
            在 GitHub 上编辑
          </a>
        </div>
      </div>
    </div>
  );
}
