'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import TurndownService from 'turndown';

interface AISummaryCardProps {
  contentSelector?: string;
}

export function AISummaryCard({ contentSelector = '#doc-content' }: AISummaryCardProps) {
  const [summary, setSummary] = useState('');
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentReady, setContentReady] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // 等待内容加载完成
  useEffect(() => {
    const checkContent = () => {
      const contentElement = document.querySelector(contentSelector);
      if (contentElement && contentElement.textContent && contentElement.textContent.trim().length > 100) {
        setContentReady(true);
      }
    };

    checkContent();
    const timer = setTimeout(checkContent, 500);
    return () => clearTimeout(timer);
  }, [contentSelector]);

  // 打字机效果
  useEffect(() => {
    if (!summary || isTyping) return;

    setIsTyping(true);
    setDisplayedSummary('');
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < summary.length) {
        setDisplayedSummary(summary.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 20); // 每 20ms 显示一个字符

    return () => clearInterval(typingInterval);
  }, [summary]);

  // 从 DOM 提取内容并转换为 Markdown
  const extractContent = (): string => {
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) {
      throw new Error('找不到文档内容');
    }

    const cloned = contentElement.cloneNode(true) as HTMLElement;
    cloned.querySelectorAll('script, style, .ai-summary-card').forEach(el => el.remove());

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });

    const markdown = turndownService.turndown(cloned.innerHTML);
    return markdown;
  };

  // 生成缓存键
  const getCacheKey = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `ai-summary-${hash}`;
  };

  const generateSummary = async (useCache = true) => {
    setIsLoading(true);
    setError('');
    setSummary('');
    setDisplayedSummary('');

    try {
      const content = extractContent();

      if (!content.trim()) {
        setError('文档内容为空');
        setIsLoading(false);
        return;
      }

      const cacheKey = getCacheKey(content);

      // 检查缓存
      if (useCache) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { summary: cachedSummary, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
            setSummary(cachedSummary);
            setIsLoading(false);
            return;
          }
        }
      }

      const response = await fetch('https://api.cloudchewie.com/blog/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('生成摘要失败');
      }

      const summaryText = await response.text();
      setSummary(summaryText);

      // 保存到缓存
      localStorage.setItem(cacheKey, JSON.stringify({
        summary: summaryText,
        timestamp: Date.now(),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成摘要时出错');
    } finally {
      setIsLoading(false);
    }
  };

  // 自动生成摘要
  useEffect(() => {
    if (contentReady) {
      generateSummary(true);
    }
  }, [contentReady]);

  if (!summary && !isLoading && !error) {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg border border-fd-border bg-fd-muted/30 p-5 ai-summary-card" id="ai-summary-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-fd-primary" />
          <h3 className="text-sm font-semibold text-fd-foreground">AI 摘要</h3>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-fd-primary/10 text-fd-primary text-xs font-medium">
          CloudGPT
        </span>
      </div>

      {isLoading && (
        <div className="text-sm text-fd-muted-foreground leading-relaxed">
          正在生成摘要<span className="inline-block w-0.5 h-3.5 ml-0.5 bg-fd-muted-foreground animate-pulse align-middle" />
        </div>
      )}

      {error && (
        <div className="p-3 rounded-md bg-fd-destructive/10 border border-fd-destructive/20">
          <p className="text-sm text-fd-destructive">{error}</p>
          <button
            onClick={() => generateSummary(false)}
            className="mt-2 text-sm text-fd-primary hover:underline"
          >
            重试
          </button>
        </div>
      )}

      {displayedSummary && (
        <div className="text-sm text-fd-foreground/90 leading-relaxed">
          {displayedSummary}
          {isTyping && <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-fd-primary animate-pulse align-middle" />}
        </div>
      )}
    </div>
  );
}
