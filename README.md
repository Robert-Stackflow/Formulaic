# Formulaic

技术面试知识库，使用 Next.js 16、React 19、Fumadocs MDX 和 OneSearch。

## 开发

需要 Node.js 22。复制 `.env.example` 为 `.env.local`，填写所需配置后运行：

```sh
npm ci
npm run dev
```

文档位于 `content/docs`，博客位于 `content/blog`。正文使用 Fumadocs 动态编译；目录和元数据先加载，访问页面时再编译正文。生产构建仍生成静态文档页面，保留目录、数学公式、代码高亮和章节链接。

```sh
npm test
npm run build
npm run typecheck
npm run sync:onesearch -- --dry-run
```

## 构建与部署

生产构建使用 Webpack、4 GB Node 堆上限、一个页面生成 worker、每 worker 同时生成一个页面。MDX 正文不再经过 Webpack 的整站编译和打包，避免大量公式与代码高亮生成的 JavaScript 占满构建内存。详见 [构建说明](docs/BUILD.md)。

`master` 推送和手动触发会执行测试、构建、类型检查、OneSearch 索引同步和 Vercel 发布。Pull Request 只验证构建，不修改索引、不部署。工作流记录内存使用数据。

GitHub Secrets：`VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`、`ONESEARCH_PUBLISH_KEY`。

GitHub Variables：`ONESEARCH_SERVER_URL`、`ONESEARCH_APP_ID`、`ONESEARCH_SEARCH_KEY`。

## 搜索

OneSearch 使用独立的 `formulaic_docs` 索引和 App ID。前端只使用 Search API Key；Admin API Key 只用于 CI 发布，不写入客户端或 Vercel 项目环境。搜索覆盖文档和博客，按章节组织，支持摘要高亮、分页和直接跳转到命中章节。

配置和同步协议见 [OneSearch 接入](docs/ONESEARCH.md)。
