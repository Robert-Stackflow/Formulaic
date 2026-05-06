# 文档统计 API

提供文档字数统计和阅读时间计算的 API。

## API 端点

### 获取文档字数统计

**端点**: `GET /api/docs/word-count`

**参数**:
- `slug` (可选): 文档路径，例如 `/docs/algorithms/sorting`
  - 传入 slug：返回该页面统计 + 全站统计
  - 不传入 slug：只返回全站统计

**响应示例（带 slug）**:
```json
{
  "site": {
    "totalWords": 700000,
    "totalReadingTime": 2333,
    "pageCount": 150,
    "formattedWords": "70.0w",
    "formattedReadingTime": "38小时53分钟"
  },
  "page": {
    "slug": "/docs/algorithms/sorting",
    "title": "排序算法",
    "wordCount": 3500,
    "readingTime": 12,
    "readingTimeText": "12 分钟"
  }
}
```

**响应示例（不带 slug）**:
```json
{
  "site": {
    "totalWords": 700000,
    "totalReadingTime": 2333,
    "pageCount": 150,
    "formattedWords": "70.0w",
    "formattedReadingTime": "38小时53分钟"
  }
}
```

**缓存**: 此 API 有 1 小时的服务端缓存

**使用示例**:
```typescript
// 获取单个页面 + 全站统计
const response = await fetch('/api/docs/word-count?slug=/docs/algorithms/sorting');
const data = await response.json();
console.log(`页面字数: ${data.page.wordCount}`);
console.log(`全站字数: ${data.site.formattedWords}`);

// 只获取全站统计
const siteResponse = await fetch('/api/docs/word-count');
const siteData = await siteResponse.json();
console.log(`全站字数: ${siteData.site.formattedWords}`);
```

## 客户端工具函数

使用封装好的工具函数更方便：

```typescript
import { fetchWordCount } from '@/lib/api/docs-stats';

// 获取单个文档 + 全站统计
const data = await fetchWordCount('/docs/algorithms/sorting');
if (data) {
  console.log(`页面: ${data.page?.title} - ${data.page?.wordCount}字`);
  console.log(`全站: ${data.site.formattedWords}`);
}

// 只获取全站统计
const siteData = await fetchWordCount();
if (siteData) {
  console.log(`全站字数: ${siteData.site.formattedWords}`);
}
```

## React 组件示例

```tsx
import { useEffect, useState } from 'react';
import { fetchWordCount, type WordCountResponse } from '@/lib/api/docs-stats';

export function PageStats({ pageUrl }: { pageUrl: string }) {
  const [data, setData] = useState<WordCountResponse | null>(null);

  useEffect(() => {
    fetchWordCount(pageUrl).then(setData);
  }, [pageUrl]);

  if (!data) return <div>加载中...</div>;

  return (
    <div>
      {data.page && (
        <div>
          <p>文档字数: {data.page.wordCount.toLocaleString()}</p>
          <p>阅读时间: {data.page.readingTimeText}</p>
        </div>
      )}
      <p>全站字数: {data.site.formattedWords}</p>
    </div>
  );
}
```

## 字数统计规则

- **中文字符**: 每个汉字计为 1 字
- **英文单词**: 每个单词计为 1 字
- **代码块**: 不计入字数
- **Markdown 语法**: 自动过滤（链接、图片、标题标记等）

## 阅读时间计算

- **中文**: 300 字/分钟
- **英文**: 200 词/分钟
- **最小值**: 1 分钟

## 性能优化

- API 有 1 小时的服务端缓存（`revalidate = 3600`）
- 建议在客户端也添加缓存，避免频繁请求
- 单次请求同时返回页面和全站统计，减少 API 调用次数
