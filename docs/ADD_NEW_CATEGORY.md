# 如何添加新的文档分类

现在所有文档都统一在 `/docs` 路由下，使用单一的 source。添加新分类非常简单：

## 1. 在 `content/docs` 目录下创建新的分类文件夹

```bash
mkdir content/docs/new-category
```

在该目录下创建你的 MDX 文档和 `meta.json` 文件。

## 2. 在 `src/app/docs/layout.tsx` 中添加 tab（可选）

如果你想在顶部 tabs 中显示新分类：

```typescript
tabs={[
  // ... 其他 tabs
  {
    title: "新分类",
    description: "新分类的描述",
    url: "/docs/new-category",
  },
]}
```

## 3. 更新导航和首页链接（可选）

- `src/app/layout.config.tsx` - 顶部导航菜单
- `src/app/(home)/page.tsx` - 首页卡片
- `src/components/footer.tsx` - 页脚链接

就这样！由于使用了统一的 source，新的文档会自动被识别和渲染。不需要修改 `source.config.ts` 或 `source.ts`。

## 文档结构示例

```
content/docs/
├── algorithms/
│   ├── meta.json
│   └── sorting.mdx
├── new-category/
│   ├── meta.json
│   └── your-doc.mdx
└── ...
```

所有文档都会自动通过 `/docs/[...slug]` 路由处理。

