"use client";

import { useEffect, useState } from "react";
import {
  GitCommitIcon,
  CalendarIcon,
  Eye,
  Users,
  MessageSquareIcon,
  FileTextIcon,
  ClockIcon,
  BookOpenIcon,
  ScanEye,
  User,
  UserPen,
} from "lucide-react";
import { fetchPVData, type PVData } from "@/lib/api/pv";
import { fetchLastCommit, type CommitInfo } from "@/lib/api/github";
import { listenGiscusMetadata, type DiscussionData } from "@/lib/api/giscus";
import { fetchWordCount, type WordCountResponse } from "@/lib/api/docs-stats";

// 字数统计组件
function WordCountSection({ pageUrl }: { pageUrl: string }) {
  const [data, setData] = useState<WordCountResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWordCount(pageUrl)
      .then((result) => {
        if (result) setData(result);
      })
      .catch((error) => console.error("Error fetching word count:", error))
      .finally(() => setLoading(false));
  }, [pageUrl]);

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse border-t border-fd-border pt-3">
        <div className="h-4 bg-fd-muted rounded w-3/4"></div>
        <div className="h-4 bg-fd-muted rounded w-2/3"></div>
        <div className="h-4 bg-fd-muted rounded w-3/4"></div>
      </div>
    );
  }

  if (!data?.page) return null;

  return (
    <div className="space-y-2 border-t border-fd-border pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <FileTextIcon className="w-3.5 h-3.5" />
          <span>文档字数</span>
        </div>
        <span className="font-medium text-fd-foreground">
          {data.page.wordCount.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <ClockIcon className="w-3.5 h-3.5" />
          <span>阅读时间</span>
        </div>
        <span className="font-medium text-fd-foreground">
          {data.page.readingTimeText}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <BookOpenIcon className="w-3.5 h-3.5" />
          <span>全站字数</span>
        </div>
        <span className="font-medium text-fd-foreground">
          {data.site.formattedWords}
        </span>
      </div>
    </div>
  );
}

// 访问统计组件
function PVSection({ pageUrl }: { pageUrl: string }) {
  const [data, setData] = useState<PVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPVData()
      .then((result) => {
        if (result) setData(result);
      })
      .catch((error) => console.error("Error fetching PV data:", error))
      .finally(() => setLoading(false));
  }, [pageUrl]);

  if (loading) {
    return (
      <div className="space-y-2 pt-3 border-t border-fd-border animate-pulse">
        <div className="h-4 bg-fd-muted rounded w-2/3"></div>
        <div className="h-4 bg-fd-muted rounded w-1/2"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-2 pt-3 border-t border-fd-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <Eye className="w-3.5 h-3.5" />
          <span>本页浏览</span>
        </div>
        <span className="font-medium text-fd-foreground">
          {data.page_pv > 0 ? data.page_pv : data.page_uv}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <User className="w-3.5 h-3.5" />
          <span>本页访客</span>
        </div>
        <span className="font-medium text-fd-foreground">{data.page_uv}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <ScanEye className="w-3.5 h-3.5" />
          <span>全站访问</span>
        </div>
        <span className="font-medium text-fd-foreground">
          {data.site_pv > 0 ? data.site_pv : data.site_uv}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span>全站访客</span>
        </div>
        <span className="font-medium text-fd-foreground">{data.site_uv}</span>
      </div>
    </div>
  );
}

// Git 提交信息组件
function CommitSection({
  owner,
  repo,
  filePath,
}: {
  owner: string;
  repo: string;
  filePath: string;
}) {
  const [data, setData] = useState<CommitInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLastCommit(owner, repo, filePath)
      .then((result) => {
        if (result) setData(result);
      })
      .catch((error) => console.error("Error fetching commit info:", error))
      .finally(() => setLoading(false));
  }, [owner, repo, filePath]);

  if (loading) {
    return (
      <div className="space-y-2 border-t border-fd-border pt-3 animate-pulse">
        <div className="h-4 bg-fd-muted rounded w-3/4"></div>
        <div className="h-4 bg-fd-muted rounded w-1/2"></div>
        <div className="h-4 bg-fd-muted rounded w-2/3"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-2 border-t border-fd-border pt-3">
      <a
        href={`https://github.com/${owner}/${repo}/commit/${data.sha}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between group"
        title={data.message}
      >
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <GitCommitIcon className="w-3.5 h-3.5" />
          <span>最后提交</span>
        </div>
        <code className="font-mono text-fd-foreground group-hover:text-fd-primary transition-colors">
          {data.sha}
        </code>
      </a>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <UserPen className="w-3.5 h-3.5" />
          <span>作者</span>
        </div>
        <span className="text-fd-foreground">{data.author}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>更新时间</span>
        </div>
        <span className="text-fd-foreground">{data.date}</span>
      </div>
    </div>
  );
}

// 评论统计组件
function DiscussionSection({ pageUrl }: { pageUrl: string }) {
  const [data, setData] = useState<DiscussionData | null>(null);

  useEffect(() => {
    const cleanup = listenGiscusMetadata(pageUrl, (result) => {
      setData(result);
    });

    return cleanup;
  }, [pageUrl]);

  if (!data) return null;

  return (
    <div className="pt-3 border-t border-fd-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <MessageSquareIcon className="w-3.5 h-3.5" />
          <span>评论数</span>
        </div>
        <span className="font-medium text-fd-foreground">
          {data.totalCommentCount}
        </span>
      </div>
    </div>
  );
}

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
  return (
    <div className="rounded-lg border border-fd-border bg-fd-card p-4">
      <h3 className="text-sm font-semibold text-fd-foreground mb-3">
        页面信息
      </h3>

      <div className="space-y-3 text-xs">
        <WordCountSection pageUrl={pageUrl} />
        <PVSection pageUrl={pageUrl} />
        <CommitSection owner={owner} repo={repo} filePath={filePath} />
        <DiscussionSection pageUrl={pageUrl} />
      </div>
    </div>
  );
}
