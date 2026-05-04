# Algolia 搜索集成配置

本项目已集成 Algolia 搜索功能，用于提供快速、准确的文档搜索体验。

## 配置步骤

### 1. 获取 Algolia 凭证

1. 访问 [Algolia](https://www.algolia.com/) 并注册账号
2. 创建一个新的应用（Application）
3. 在应用的 **API Keys** 页面获取以下信息：
   - Application ID
   - Search-Only API Key（用于前端搜索）
   - Admin API Key（用于上传索引数据）

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件（如果还没有），添加以下配置：

```env
# Algolia Search Configuration
NEXT_PUBLIC_ALGOLIA_APP_ID=your-algolia-app-id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your-algolia-search-api-key
ALGOLIA_ADMIN_API_KEY=your-algolia-admin-api-key
ALGOLIA_INDEX_NAME=document
```

**注意：**
- `NEXT_PUBLIC_` 前缀的变量会暴露到浏览器端
- `ALGOLIA_ADMIN_API_KEY` 仅用于服务端脚本，不会暴露到浏览器
- 可以参考 `.env.example` 文件

### 3. 同步搜索索引到 Algolia

每次更新文档内容后，需要运行以下命令将搜索索引同步到 Algolia：

```bash
npm run sync:algolia
```

该命令会：
1. 读取所有文档页面
2. 提取标题、描述和结构化数据
3. 上传到 Algolia 索引

### 4. 配置 Algolia 索引设置（可选）

在 Algolia Dashboard 中，可以配置索引的搜索行为：

1. **Searchable Attributes**（可搜索属性）：
   - `title`（优先级最高）
   - `description`
   - `structured.headings`
   - `structured.contents`

2. **Custom Ranking**（自定义排序）：
   - 可以根据页面重要性添加自定义排序规则

3. **Facets**（分面搜索）：
   - 如果需要按分类筛选，可以配置 facets

## 使用说明

### 前端搜索

搜索功能已集成到文档布局中：
- 点击导航栏的搜索图标
- 或使用快捷键 `Ctrl/Cmd + K`

搜索组件位于 `src/components/search.tsx`，使用 Fumadocs 提供的 Algolia 搜索集成。

### 索引数据结构

每个文档页面的索引数据包含：

```typescript
{
  _id: string;           // 页面 URL
  url: string;           // 页面 URL
  title: string;         // 页面标题
  description?: string;  // 页面描述
  structured: {          // 结构化数据（由 Fumadocs 生成）
    headings: Array<{
      id: string;
      content: string;
    }>;
    contents: string[];
  };
}
```

## 自动化同步

### GitHub Actions（推荐）

可以在 GitHub Actions 中配置自动同步：

```yaml
name: Sync Algolia

on:
  push:
    branches: [main]
    paths:
      - 'content/**'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run sync:algolia
        env:
          NEXT_PUBLIC_ALGOLIA_APP_ID: ${{ secrets.ALGOLIA_APP_ID }}
          ALGOLIA_ADMIN_API_KEY: ${{ secrets.ALGOLIA_ADMIN_API_KEY }}
          ALGOLIA_INDEX_NAME: document
```

### Vercel 部署钩子

也可以在 Vercel 部署时自动同步：

1. 在 Vercel 项目设置中添加环境变量
2. 修改 `package.json` 的 `build` 脚本：

```json
{
  "scripts": {
    "build": "npm run sync:algolia && next build"
  }
}
```

## 故障排查

### 搜索无结果

1. 确认已运行 `npm run sync:algolia`
2. 检查 Algolia Dashboard 中索引是否有数据
3. 确认环境变量配置正确

### 同步失败

1. 检查 `ALGOLIA_ADMIN_API_KEY` 是否正确
2. 确认 API Key 有写入权限
3. 查看控制台错误信息

### 搜索结果不准确

1. 在 Algolia Dashboard 中调整 Searchable Attributes 的优先级
2. 配置同义词（Synonyms）
3. 调整 Custom Ranking 规则

## 相关文件

- `src/components/search.tsx` - 搜索组件
- `src/lib/export-search-indexes.ts` - 导出索引数据
- `scripts/sync-algolia.ts` - 同步脚本
- `.env.example` - 环境变量示例

## 参考文档

- [Fumadocs Algolia 集成](https://www.fumadocs.dev/docs/search/algolia)
- [Algolia 官方文档](https://www.algolia.com/doc/)
