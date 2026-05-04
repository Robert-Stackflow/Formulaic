# PV 统计配置指南

## 功能概览

已为文档页面和博客页面添加 PV（页面访问量）统计功能，使用 CloudChewie PV API。

## 显示内容

每个页面会显示：
- 📊 **页面浏览次数**（page_pv 或 page_uv）
- 👥 **独立访客数**（page_uv）

## 配置文件

配置文件位于 `src/config/pv.ts`：

```typescript
export const pvConfig = {
  apiUrl: "https://pv.cloudchewie.com/api",
  token: "YOUR_TOKEN_HERE",
  enabled: true,
};
```

### 配置项说明

- `apiUrl`: PV API 端点地址
- `token`: Bearer Token 认证令牌
- `enabled`: 是否启用 PV 统计（设为 `false` 可全局禁用）

## API 请求格式

### 请求

```http
POST https://pv.cloudchewie.com/api
Authorization: Bearer {token}
```

### 响应

```json
{
  "data": {
    "page_pv": 0,
    "page_uv": 25,
    "site_pv": 0,
    "site_uv": 1087
  },
  "message": "ok",
  "success": true
}
```

## 集成位置

### 1. 文档页面

位置：`src/components/docs/doc-page-renderer.tsx`

显示在 GitHubInfo 组件下方，页面顶部区域。

### 2. 博客页面

位置：`src/app/blog/[slug]/page.tsx`

显示在博客元信息（作者、日期、标签）下方。

## 组件说明

### PageViews 组件

文件：`src/components/page-views.tsx`

特性：
- 客户端组件（使用 `useEffect` 获取数据）
- 自动发送 POST 请求到 PV API
- 显示眼睛图标 + 浏览次数
- 显示用户图标 + 访客数
- 加载失败时静默处理（不显示错误）
- 可通过配置全局禁用

## 样式

使用主题变量：
- 文本颜色：`text-fd-muted-foreground`
- 边框：`border-fd-border`
- 图标大小：`w-4 h-4`
- 间距：`gap-4`（项目间）、`gap-1.5`（图标与文字间）

## 禁用 PV 统计

### 全局禁用

编辑 `src/config/pv.ts`：

```typescript
export const pvConfig = {
  // ...
  enabled: false, // 设为 false
};
```

### 移除组件

如果要完全移除 PV 功能：

1. 从 `src/components/docs/doc-page-renderer.tsx` 中删除：
   ```typescript
   import { PageViews } from "@/components/page-views";
   // ...
   <PageViews />
   ```

2. 从 `src/app/blog/[slug]/page.tsx` 中删除：
   ```typescript
   import { PageViews } from "@/components/page-views";
   // ...
   <PageViews />
   ```

## 故障排除

### PV 数据不显示

1. 检查浏览器控制台是否有错误
2. 确认 `pvConfig.enabled` 为 `true`
3. 验证 API token 是否正确
4. 检查网络请求是否成功（开发者工具 > Network）

### CORS 错误

确保 PV API 服务端配置了正确的 CORS 头：
```
Access-Control-Allow-Origin: https://your-domain.com
```

### Token 过期

如果 API 返回 401 错误，需要更新 `pvConfig.token`。

## 未来改进

可考虑的功能：
- [ ] 缓存 PV 数据（减少 API 调用）
- [ ] 显示站点总 PV/UV（site_pv、site_uv）
- [ ] 添加加载动画
- [ ] 支持多个 PV 统计服务
- [ ] 在博客列表页显示每篇文章的 PV
