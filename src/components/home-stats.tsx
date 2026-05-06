"use client";

import { useEffect, useState } from "react";
import { fetchPVData, type PVData } from "@/lib/api/pv";
import { fetchWordCount, type SiteStats } from "@/lib/api/docs-stats";

interface StatItem {
  label: string;
  value: string;
  tip: string;
  loading?: boolean;
}

export function HomeStats() {
  const [pvData, setPvData] = useState<PVData | null>(null);
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [pv, wordCountData] = await Promise.all([
        fetchPVData(),
        fetchWordCount(), // 不传 slug，只获取全站统计
      ]);
      setPvData(pv);
      setSiteStats(wordCountData?.site || null);
      setLoading(false);
    };

    loadData();
  }, []);

  const formatNumber = (num: number): string => {
    if (num === 0) {
      return "0";
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return `${num}`;
  };

  const stats: StatItem[] = [
    {
      label: "总访问量",
      value: loading
        ? "..."
        : pvData?.site_pv != null
          ? formatNumber(pvData.site_pv)
          : "--",
      tip: loading
        ? "加载中..."
        : pvData?.site_pv != null
          ? "根据 busuanzi 统计的站点总访问量"
          : "根据 busuanzi 统计（加载失败，请检查配置）",
      loading,
    },
    {
      label: "文档字数",
      value: loading
        ? "..."
        : siteStats?.formattedWords || "--",
      tip: loading
        ? "加载中..."
        : siteStats
          ? `统计中文字符数和英文单词数，共 ${siteStats.pageCount} 篇文档`
          : "统计中文字符数和英文单词数",
      loading,
    },
    {
      label: "持续更新",
      value: "∞",
      tip: "内容定期更新维护",
    },
  ];

  return (
    <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center group relative">
          <div
            className={`text-2xl sm:text-3xl font-bold text-fd-primary ${
              stat.loading ? "animate-pulse" : ""
            }`}
          >
            {stat.value}
          </div>
          <div className="mt-1 text-xs sm:text-sm text-fd-muted-foreground">
            {stat.label}
          </div>
          {/* Tooltip */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-fd-popover text-fd-popover-foreground text-xs rounded-lg shadow-lg border border-fd-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none z-10">
            {stat.tip}
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-fd-popover"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
