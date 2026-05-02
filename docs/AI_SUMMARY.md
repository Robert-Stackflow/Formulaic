# AI 摘要功能

## 功能说明

AI 摘要功能可以自动为文档生成简洁的摘要，支持自动生成和智能缓存。

## 特性

- ✅ **自动生成**：页面加载完成后自动生成摘要
- ✅ **智能提取**：从渲染后的 DOM 提取内容并转换为 Markdown
- ✅ **智能缓存**：摘要缓存 7 天，避免重复请求
- ✅ **一键刷新**：点击刷新按钮重新生成摘要
- ✅ **主题适配**：完美支持深色模式

## 使用方法

1. 打开任意文档页面
2. 等待页面内容加载完成（约 0.5 秒）
3. AI 摘要会自动生成并显示在文档顶部
4. 如需重新生成，点击右上角的刷新按钮

## 技术实现

### 内容提取流程

1. **等待内容加载**：使用 `useEffect` 检测 DOM 内容是否准备就绪
2. **提取 HTML**：从 `#doc-content` 元素提取渲染后的 HTML
3. **清理内容**：移除 `<script>`、`<style>` 等不需要的元素
4. **转换为 Markdown**：使用 `turndown` 库将 HTML 转换为 Markdown
5. **调用 API**：发送 Markdown 内容到摘要服务
6. **缓存结果**：将摘要保存到 localStorage

### API 端点

使用自部署的摘要服务：`https://api.cloudchewie.com/blog/summary`

**请求格式：**
```json
POST https://api.cloudchewie.com/blog/summary
Content-Type: application/json

{
  "content": "# 文档标题\n\n文档内容..."
}
```

**响应格式：**
```
Content-Type: text/html; charset=utf-8

文章摘要内容...
```

## 缓存机制

- **缓存键**：基于提取内容的哈希值
- **存储位置**：浏览器 localStorage
- **有效期**：7 天
- **刷新策略**：点击刷新按钮跳过缓存重新生成

## 依赖库

- **turndown**：将 HTML 转换为 Markdown
- **lucide-react**：图标库

## 注意事项

- 首次生成可能需要几秒钟，请耐心等待
- 缓存基于文档内容，内容变化后会自动重新生成
- 如遇到网络错误，可点击重试按钮
- 组件会自动检测内容是否加载完成（至少 100 字符）
