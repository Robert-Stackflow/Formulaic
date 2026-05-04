"use client";

import { useEffect, useState } from "react";
import {
  GitCommitIcon,
  CalendarIcon,
  UserIcon,
  Eye,
  Users,
  MessageSquareIcon,
} from "lucide-react";
import { fetchPVData, type PVData } from "@/lib/api/pv";
import { fetchLastCommit, type CommitInfo } from "@/lib/api/github";
import {
  listenGiscusMetadata,
  type DiscussionData,
} from "@/lib/api/giscus";

interface PageInfoCardProps {
  owner: string;
  repo: string;
  filePath: string;
  pageUrl: string;
}

export function PageInfoCard({
  owner,
  repo,
  filePath,
  pageUrl,
}: PageInfoCardProps) {
  const [commitInfo, setCommitInfo] = useState<CommitInfo | null>(null);
  const [pvData, setPvData] = useState<PVData | null>(null);
  const [discussionData, setDiscussionData] = useState<DiscussionData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch commit info
        const commit = await fetchLastCommit(owner, repo, filePath);
        if (commit) {
          setCommitInfo(commit);
        }

        // Fetch PV data
        const pv = await fetchPVData();
        if (pv) {
          setPvData(pv);
        }
      } catch (error) {
        console.error("Error fetching page info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [owner, repo, filePath]);

  // Listen for Giscus metadata events
  useEffect(() => {
    const cleanup = listenGiscusMetadata(pageUrl, (data) => {
      setDiscussionData(data);
    });

    return cleanup;
  }, [pageUrl]);

  if (loading) {
    return (
      <div className="rounded-lg border border-fd-border bg-fd-card p-4">
        <h3 className="text-sm font-semibold text-fd-foreground mb-3">
          页面信息
        </h3>
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-fd-muted rounded w-3/4"></div>
          <div className="h-4 bg-fd-muted rounded w-1/2"></div>
          <div className="h-4 bg-fd-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-fd-border bg-fd-card p-4">
      <h3 className="text-sm font-semibold text-fd-foreground mb-3">
        页面信息
      </h3>

      <div className="space-y-3 text-xs">
        {/* PV Stats */}
        {pvData && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-fd-muted-foreground">
                <Eye className="w-3.5 h-3.5" />
                <span>浏览次数</span>
              </div>
              <span className="font-medium text-fd-foreground">
                {pvData.page_pv > 0 ? pvData.page_pv : pvData.page_uv}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-fd-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>独立访客</span>
              </div>
              <span className="font-medium text-fd-foreground">
                {pvData.page_uv}
              </span>
            </div>
          </div>
        )}

        {/* Commit Info */}
        {commitInfo && (
          <div className="space-y-2 border-t border-fd-border pt-3">
            <a
              href={`https://github.com/${owner}/${repo}/commit/${commitInfo.sha}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between group"
              title={commitInfo.message}
            >
              <div className="flex items-center gap-2 text-fd-muted-foreground">
                <GitCommitIcon className="w-3.5 h-3.5" />
                <span>最后提交</span>
              </div>
              <code className="font-mono text-fd-foreground group-hover:text-fd-primary transition-colors">
                {commitInfo.sha}
              </code>
            </a>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-fd-muted-foreground">
                <UserIcon className="w-3.5 h-3.5" />
                <span>作者</span>
              </div>
              <span className="text-fd-foreground">{commitInfo.author}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-fd-muted-foreground">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>更新时间</span>
              </div>
              <span className="text-fd-foreground">{commitInfo.date}</span>
            </div>
          </div>
        )}

        {/* Discussion Info */}
        {discussionData && (
          <div className="pt-3 border-t border-fd-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-fd-muted-foreground">
                <MessageSquareIcon className="w-3.5 h-3.5" />
                <span>评论数</span>
              </div>
              <span className="font-medium text-fd-foreground">
                {discussionData.totalCommentCount}
              </span>
            </div>
          </div>
        )}

        {/* No data message */}
        {!pvData && !commitInfo && !discussionData && (
          <p className="text-sm text-fd-muted-foreground">暂无数据</p>
        )}
      </div>
    </div>
  );
}
