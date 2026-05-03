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
import { set } from "zod";

interface PageInfoCardProps {
  owner: string;
  repo: string;
  filePath: string;
  pageUrl: string;
}

interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  date: string;
}

interface PVData {
  page_pv: number;
  page_uv: number;
  site_pv: number;
  site_uv: number;
}

interface DiscussionData {
  totalCommentCount: number;
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
        const commitResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&page=1&per_page=1`,
        );

        if (commitResponse.ok) {
          const commitData = await commitResponse.json();
          if (commitData && commitData.length > 0) {
            const commit = commitData[0];
            setCommitInfo({
              sha: commit.sha.substring(0, 7),
              message: commit.commit.message.split("\n")[0],
              author: commit.committer.login,
              date: new Date(commit.commit.author.date)
                .toISOString()
                .replace("T", " ")
                .substring(0, 19),
            });
          }
        }

        // Fetch PV data
        const pvResponse = await fetch("https://pv.cloudchewie.com/api", {
          method: "POST",
          headers: {
            Authorization:
              "Bearer e9a61a0ea664a1ddff341165c3643a1a.1ddc26ca6681535bfd2486b9b30147b903dfb6cb",
          },
        });

        if (pvResponse.ok) {
          const pvResult = await pvResponse.json();
          if (pvResult.success && pvResult.data) {
            setPvData(pvResult.data);
          }
        }

        setPvData({
          page_pv: 100, // Example data, replace with actual values
          page_uv: 80,
          site_pv: 600,
          site_uv: 500,
        });

        // Fetch discussion data
        const discussionResponse = await fetch(
          `https://giscus.app/api/discussions?repo=${owner}/${repo}&term=${encodeURIComponent(pageUrl)}&category=General&number=0&strict=false&last=15`,
        );

        if (discussionResponse.ok) {
          const discussionResult = await discussionResponse.json();
          if (discussionResult && discussionResult.discussion) {
            setDiscussionData({
              totalCommentCount:
                discussionResult.discussion.totalCommentCount || 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching page info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [owner, repo, filePath]);

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
