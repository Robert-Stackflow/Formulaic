# OneSearch

## 权限与配置

Formulaic 在 OneSearch 使用独立应用，绑定 `formulaic_docs` 索引，主键 `id`。网站前端只配置：

```dotenv
NEXT_PUBLIC_ONESEARCH_SERVER_URL=https://search.cloudchewie.com
NEXT_PUBLIC_ONESEARCH_APP_ID=app_your_application_id
NEXT_PUBLIC_ONESEARCH_SEARCH_KEY=your_search_only_key
```

站点访问规则允许 COS 的 `https://formulaic.cloudchewie.com` 与 Vercel 的 `https://v.formulaic.cloudchewie.com`。本地验证还允许 `http://localhost:4310` 与 `http://127.0.0.1:4310`。其他预览域名需要单独加入来源白名单；不开放任意 Origin。

GitHub 发布流程使用相同 App ID，以及只有该索引权限的 `ONESEARCH_PUBLISH_KEY` Admin API Key。该密钥通过 GitHub Secret 保存，仅传给索引发布步骤。不要加 `NEXT_PUBLIC_` 前缀。

## 索引结构

构建会生成 `.next/server/app/static.json.body`，内容格式：

```json
{"version":1,"count":1,"documents":[{"id":"URL_SHA256","page_id":"/docs/example","title":"示例","section":"安装","url":"/docs/example#安装","content":"章节正文","tags":[],"type":"docs"}]}
```

每篇文档和博客按章节聚合为记录，URL 和章节锚点生成稳定 SHA-256 id，正文修改保持 id 稳定。章节使用 Fumadocs 的结构化输出，不另外推导标题锚点。标题、章节、正文和标签参与搜索。

索引设置 `distinctAttribute: "page_id"`，每篇文章只展示最相关的章节，避免同一文章占满搜索结果；点击结果仍直接定位到命中的章节。

## 同步

```sh
npm run sync:onesearch -- --dry-run
# 设置 ONESEARCH_SERVER_URL、ONESEARCH_APP_ID、ONESEARCH_PUBLISH_KEY 后：
npm run sync:onesearch
```

同步脚本校验索引非空、记录计数、唯一 id 和本地 URL；分页读取全部旧 id；每批更新后等待引擎任务成功。只有所有更新成功，才删除不再存在的旧 id。失败或取消不会进入删除阶段。

## 前端

请求 `POST /api/apps/{appId}/search`，使用页码与 `hitsPerPage`，请求标题、章节与正文高亮/正文裁剪/命中位置。自定义高亮标记解析为 React 文本节点和 `<mark>`，不插入服务返回的 HTML。结果链接仅接受站内文档和博客路径，使用 Next.js Link 无刷新跳转。

搜索有 250 ms 防抖、输入法组合输入处理、请求取消和旧请求结果隔离。支持方向键/Enter、Esc、关闭后恢复焦点、移动端高度与安全区，以及减少动画的系统偏好。

完整接口见 [OneSearch API](https://github.com/Robert-Stackflow/OneSearch/blob/main/docs/api.md)。
