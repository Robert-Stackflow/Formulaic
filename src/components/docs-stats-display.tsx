"use client";

import { useEffect, useState } from "react";
import { fetchDocsStats, type DocsStatsResult } from "@/lib/api/docs-stats";

/**
 * 文档统计组件示例
 * 可以用在首页或其他需要展示文档统计的地方
 */
export function DocsStatsDisplay() {
  const [stats, setStats] = useState<DocsStatsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchDocsStats();
      setStats(data);
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-fd-primary animate-pulse">
          ...
        </div>
        <div className="mt-1 text-sm text-fd-muted-foreground">
          加载中
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-fd-primary">
          {stats.formattedWords}
        </div>
        <div className="mt-1 text-sm text-fd-muted-foreground">
          文档字数
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-fd-primary">
          {stats.pageCount}
        </div>
        <div className="mt-1 text-sm text-fd-muted-foreground">
          文档数量
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-fd-primary">
          {stats.formattedReadingTime}
        </div>
        <div className="mt-1 text-sm text-fd-muted-foreground">
          阅读时长
        </div>
      </div>
    </div>
  );
}
