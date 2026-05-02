# GitHub 集成和评论系统配置指南

本文档说明如何配置 Giscus 评论系统和 GitHub 集成功能。

## 功能概览

已实现的功能：
1. ✅ **Giscus 评论系统** - 基于 GitHub Discussions 的评论功能
2. ✅ **文档反馈机制** - "有帮助吗"、报告问题、在 GitHub 上编辑
3. ✅ **GitHub 信息展示** - 显示最后提交的 commit ID、作者和日期
4. ✅ **增强的 ViewOptions** - 在多个 AI 工具中打开文档

## 配置步骤

### 1. 配置 Giscus 评论系统

#### 1.1 启用 GitHub Discussions

1. 进入你的 GitHub 仓库
2. 点击 **Settings** > **General**
3. 在 **Features** 部分，勾选 **Discussions**

#### 1.2 安装 Giscus App

1. 访问 [giscus.app](https://giscus.app/zh-CN)
2. 按照页面指引安装 Giscus GitHub App
3. 授权 Giscus 访问你的仓库

#### 1.3 获取配置信息

在 [giscus.app](https://giscus.app/zh-CN) 页面：

1. **仓库**：输入 `Robert-Stackflow/Formulaic`
2. **页面 ↔️ discussion 映射关系**：选择 `pathname`
3. **Discussion 分类**：选择一个分类（推荐创建 "Comments" 分类）
4. 页面会生成配置代码，复制以下信息：
   - `data-repo-id`
   - `data-category-id`

#### 1.4 更新配置文件

编辑 `src/config/giscus.ts`：

```typescript
export const giscusConfig = {
  repo: "Robert-Stackflow/Formulaic",
  repoId: "YOUR_REPO_ID", // 替换为你的 repo ID
  category: "General", // 替换为你的分类名称
  categoryId: "YOUR_CATEGORY_ID", // 替换为你的 category ID
  mapping: "pathname" as const,
  reactionsEnabled: true,
  inputPosition: "bottom" as const,
  lang: "zh-CN",
  loading: "lazy" as const,
};
```

### 2. GitHub 配置

`src/config/giscus.ts` 中的 GitHub 配置已经设置好：

```typescript
export const githubConfig = {
  owner: "Robert-Stackflow",
  repo: "Formulaic",
  branch: "master",
  contentDir: "content",
};
```

如果你的配置不同，请相应修改。

## 功能说明

### 1. 文档反馈机制

每篇文档底部会显示：
- **有帮助吗？** - 用户可以点击 👍 或 👎 反馈
- **报告问题** - 跳转到 GitHub Issues 创建问题
- **在 GitHub 上编辑** - 直接编辑文档源文件

### 2. GitHub 信息展示

在文档操作按钮下方显示：
- **Commit ID** - 最后一次提交的短 SHA（可点击查看完整提交）
- **作者** - 最后修改者
- **日期** - 最后修改日期

### 3. Giscus 评论

在文档底部显示评论区：
- 支持 Markdown 语法
- 支持表情反应
- 自动适配深色/浅色主题
- 用户需要 GitHub 账号登录

### 4. ViewOptions 增强

"打开" 按钮支持在以下工具中打开文档：
- GitHub - 查看源文件
- Scira AI - AI 问答
- ChatGPT - OpenAI 问答
- Claude - Anthropic 问答
- T3 Chat - 多模型问答

## 测试

配置完成后：

1. 启动开发服务器：`npm run dev`
2. 访问任意文档页面
3. 检查以下功能：
   - [ ] 页面底部显示反馈按钮
   - [ ] 点击反馈按钮有响应
   - [ ] 显示 GitHub commit 信息
   - [ ] 显示 Giscus 评论框
   - [ ] 评论框主题跟随网站主题

## 故障排除

### Giscus 评论不显示

1. 检查 `repoId` 和 `categoryId` 是否正确
2. 确认 GitHub Discussions 已启用
3. 确认 Giscus App 已安装并授权
4. 打开浏览器控制台查看错误信息

### GitHub 信息不显示

1. 检查 GitHub API 是否可访问
2. 确认文件路径配置正确
3. 检查浏览器控制台是否有 CORS 错误

### 反馈按钮不工作

1. 检查 GitHub 仓库 URL 是否正确
2. 确认文件路径映射正确

## 自定义

### 修改评论框样式

编辑 `src/components/giscus-comments.tsx` 中的 `className`。

### 修改反馈按钮文案

编辑 `src/components/doc-feedback.tsx` 中的文本内容。

### 禁用某个功能

在 `src/components/docs/doc-page-renderer.tsx` 中注释掉相应的组件即可。

## 下一步

考虑添加的功能：
- [ ] 词云卡片展示文章关键词
- [ ] 阅读进度追踪
- [ ] 文档评分系统
- [ ] 相关文档推荐
