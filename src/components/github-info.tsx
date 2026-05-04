"use client";

import { useEffect, useState } from "react";
import { GitCommitIcon, CalendarIcon, UserIcon } from "lucide-react";

interface GitHubInfoProps {
  owner: string;
  repo: string;
  filePath: string;
}

interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export function GitHubInfo({ owner, repo, filePath }: GitHubInfoProps) {
  const [commitInfo, setCommitInfo] = useState<CommitInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitInfo = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&page=1&per_page=1`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch commit info");
        }

        const data = await response.json();
        if (data && data.length > 0) {
          const commit = data[0];
          setCommitInfo({
            sha: commit.sha.substring(0, 7),
            message: commit.commit.message.split("\n")[0],
            author: commit.commit.author.name,
            date: new Date(commit.commit.author.date).toLocaleDateString("zh-CN"),
          });
        }
      } catch (error) {
        console.error("Error fetching commit info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitInfo();
  }, [owner, repo, filePath]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-fd-muted-foreground/60 mt-1.5 animate-pulse">
        <GitCommitIcon className="w-3.5 h-3.5" />
        <span>加载中...</span>
      </div>
    );
  }

  if (!commitInfo) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5 text-xs text-fd-muted-foreground/70 mt-1.5">
      <a
        href={`https://github.com/${owner}/${repo}/commit/${commitInfo.sha}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-fd-muted-foreground hover:text-fd-primary transition-colors"
        title={commitInfo.message}
      >
        <GitCommitIcon className="w-3.5 h-3.5" />
        <code className="font-mono text-[11px]">{commitInfo.sha}</code>
      </a>
      <span className="text-fd-muted-foreground/40">•</span>
      <div className="inline-flex items-center gap-1.5">
        <UserIcon className="w-3.5 h-3.5" />
        <span>{commitInfo.author}</span>
      </div>
      <span className="text-fd-muted-foreground/40">•</span>
      <div className="inline-flex items-center gap-1.5">
        <CalendarIcon className="w-3.5 h-3.5" />
        <span>{commitInfo.date}</span>
      </div>
    </div>
  );
}
