# 发布到 COS 与 Vercel

两个工作流监听 `master`，分别生成各平台的产物。Pull Request 只验证测试与构建，不上传、不修改搜索索引。

## GitHub Actions 配置

Secrets：

| 名称 | 内容 |
| --- | --- |
| `AWS_SECRET_ID` | 腾讯云 SecretId，需有 Formulaic 桶的 HeadObject/GetObject/PutObject 与 CDN PurgeUrlsCache 权限 |
| `AWS_SECRET_ACCESS_KEY` | 对应 SecretKey |
| `ONESEARCH_PUBLISH_KEY` | 仅绑定 `formulaic_docs` 的 Admin API Key |
| `VERCEL_TOKEN` | Vercel 部署凭据 |
| `VERCEL_ORG_ID` | Vercel 团队 ID |
| `VERCEL_PROJECT_ID` | Formulaic 项目 ID |

Variables：

| 名称 | 当前值 |
| --- | --- |
| `AWS_BUCKET` | `formulaic-1313406087` |
| `AWS_REGION` | `ap-guangzhou` |
| `AWS_ENDPOINT` | `https://cos.ap-guangzhou.myqcloud.com` |
| `COS_ACCELERATE` | `true` |
| `ONESEARCH_SERVER_URL` | `https://search.cloudchewie.com` |
| `ONESEARCH_APP_ID` | Formulaic 的独立 App ID |
| `ONESEARCH_SEARCH_KEY` | Formulaic 的 Search API Key |

全球加速开关为 `true` 时，上传地址自动替换为 `https://cos.accelerate.myqcloud.com`，签名区域仍为 `ap-guangzhou`，采用桶名子域名请求。须先在桶控制台开启全球加速。

## COS

```sh
npm run build:cos
npm run deploy:cos -- --dry-run
npm run deploy:cos
ONESEARCH_INDEX_FILE=out/static.json npm run sync:onesearch
```

静态构建在 `.cos-build-*` 临时目录完成，产物保存到 `out/`，保留 HTML、Next.js 导航数据、指纹资源、搜索索引和 Markdown。不会改变 Vercel 的 `.next` 目录。上传借鉴 Blog：比较 SHA-1 与 MIME/缓存元数据，先资源后 HTML，最多 6 个并发，保留旧指纹文件，不删除其他对象。构建失败不会替换旧 `out/`。

COS 静态网站首页为 `index.html`，错误页为 `404.html`，深层目录需支持 `目录/index.html`。Next.js 指纹文件缓存一年；HTML、导航文本和 JSON 使用短缓存并重新验证。

不要将 404 重定向到桶域名或 `/`，否则不存在的路径会跳出 CDN 并触发私有桶的 403。`Check COS website routing` 手动工作流可检查配置；选择 `repair_404` 仅移除这个错误规则，保留首页、错误页和 HTTPS 设置。检查 CDN 配置另需 `cdn:DescribeDomainsConfig` 权限。

上传后刷新 `formulaic.cloudchewie.com` 的 HTML、导航数据和其他非指纹资源，保留指纹资源缓存。CDN 刷新失败时工作流会明确报错，可配置权限后重新运行；不会删除已上传的文件。

COS 不执行 Node.js：每次发布时预生成文档和博客，字数/阅读时间由 `docs-stats.json` 提供；AI 摘要和使用服务端凭据的 GitHub 降级接口仅在 Vercel 可用。评论、公共 GitHub 查询、OneSearch 和无刷新导航继续工作。不要把 `.next` 直接上传为静态网站。

## Vercel

工作流更新公共搜索配置，执行 `vercel pull`、`vercel build --prod` 与 `vercel deploy --prebuilt --archive=tgz --prod`。发布密钥不进入 Vercel 或前端构建；Vercel 保留 API、代理和缓存更新能力。

正式静态入口为 `https://formulaic.cloudchewie.com`（COS），Vercel 入口为 `https://v.formulaic.cloudchewie.com`。两个域名均加入 OneSearch 来源白名单。COS/CDN 需配置 HTTPS、目录首页和 `giscus-*.css` 跨域响应头。
