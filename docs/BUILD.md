# 构建内存

原有工作流给 Node 设置 16 GB 堆上限，但堆上限不是物理内存额度。MDX 文档还会被展开为包含 KaTeX 和代码高亮的 JavaScript，全部进入打包器。本地在 4 GB 堆上限下复现了 Webpack 编译 OOM；页面生成尚未开始。

采用 Fumadocs MDX 14 的 `dynamic: true`，从 `.source/dynamic.ts` 加载文档。Webpack 只打包目录、元数据和编译器；正文在页面生成阶段按需编译。现有文档页面仍预生成静态 HTML，部署后由 Vercel 缓存提供。MDX 编译结果在进程内缓存。

配套措施：

- 单个静态页面 worker，每次生成一页，降低同时保留正文渲染树的数量。
- 完整文本导出和搜索索引导出逐篇处理，避免整站 `Promise.all`。
- Lucide 图标改成显式注册，仅包含页面及选择器使用的图标。
- Webpack build worker 和 memory optimizations 开启，关闭生产 source maps。
- 生产脚本的 Node 堆上限为 4096 MiB，保留类型检查；GitHub 记录 `/usr/bin/time -v` 数据。

`outputFileTracingIncludes` 会把 `content` 打入 Vercel 函数；Docker 也复制 `content`，保证缓存更新和运行时编译可读取源文件。新增 MDX 内容可以使用现有组件映射；动态编译不支持依赖打包器解析的客户端组件 import，新增这种文档前应检查 Fumadocs 限制。

如需调查新的内存异常，先确认是编译、类型检查还是页面生成阶段。不要直接恢复 16 GB 堆上限或跳过类型检查。若调整文档配置，完整构建后检查数学公式、代码块、Markdown 导出和章节搜索。

参考：[Fumadocs 性能说明](https://www.fumadocs.dev/docs/mdx/performance)、[动态加载](https://www.fumadocs.dev/docs/mdx/async)、[Next.js 内存优化](https://nextjs.org/docs/app/guides/memory-usage)。
