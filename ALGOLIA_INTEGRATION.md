# Algolia 搜索集成完成

## 已完成的更改

### 1. 组件配置
- ✅ 更新 `src/app/layout.tsx`：在 RootProvider 中配置自定义搜索组件
- ✅ 更新 `src/components/search.tsx`：使用环境变量配置 Algolia 客户端

### 2. 环境变量
- ✅ 更新 `.env.example`：添加 Algolia 配置示例
- ⚠️ 需要创建 `.env.local` 并填入实际的 Algolia 凭证

### 3. 同步脚本
- ✅ 创建 `scripts/sync-algolia.ts`：用于将搜索索引上传到 Algolia
- ✅ 更新 `package.json`：添加 `sync:algolia` 命令

### 4. 文档
- ✅ 创建 `docs/ALGOLIA_SETUP.md`：详细的配置和使用说明

## 下一步操作

### 1. 获取 Algolia 凭证

访问 https://www.algolia.com/ 并：
1. 注册/登录账号
2. 创建新应用
3. 获取 API Keys：
   - Application ID
   - Search-Only API Key
   - Admin API Key

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_ALGOLIA_APP_ID=你的应用ID
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=你的搜索API密钥
ALGOLIA_ADMIN_API_KEY=你的管理API密钥
ALGOLIA_INDEX_NAME=document
```

### 3. 同步搜索索引

```bash
npm run sync:algolia
```

### 4. 测试搜索功能

启动开发服务器并测试搜索：

```bash
npm run dev
```

点击搜索图标或按 `Ctrl/Cmd + K` 打开搜索对话框。

## 文件结构

```
.
├── src/
│   ├── app/
│   │   └── layout.tsx              # 配置 RootProvider
│   ├── components/
│   │   └── search.tsx              # Algolia 搜索组件
│   └── lib/
│       └── export-search-indexes.ts # 导出索引数据
├── scripts/
│   └── sync-algolia.ts             # 同步脚本
├── docs/
│   └── ALGOLIA_SETUP.md            # 详细配置文档
├── .env.example                     # 环境变量示例
└── package.json                     # 添加了 sync:algolia 命令
```

## 注意事项

1. **环境变量前缀**：
   - `NEXT_PUBLIC_` 前缀的变量会暴露到浏览器
   - `ALGOLIA_ADMIN_API_KEY` 仅用于服务端，不会暴露

2. **索引同步**：
   - 每次更新文档内容后需要运行 `npm run sync:algolia`
   - 可以配置 GitHub Actions 或 Vercel 钩子自动同步

3. **搜索优化**：
   - 在 Algolia Dashboard 中可以配置搜索属性优先级
   - 可以添加同义词、自定义排序等高级功能

详细说明请查看 `docs/ALGOLIA_SETUP.md`。
