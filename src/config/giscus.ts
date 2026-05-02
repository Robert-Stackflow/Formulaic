// Giscus 配置
// 请在 https://giscus.app/zh-CN 获取你的配置信息

export const giscusConfig = {
  // 你的 GitHub 仓库，格式：owner/repo
  repo: "Robert-Stackflow/Formulaic",

  // 仓库 ID，在 giscus.app 配置页面获取
  repoId: "R_kgDOQkQb3Q",

  // Discussion 分类名称
  category: "General",

  // 分类 ID，在 giscus.app 配置页面获取
  categoryId: "DIC_kwDOQkQb3c4C8MEk",

  // 映射方式
  mapping: "pathname" as const,

  // 是否启用反应
  reactionsEnabled: true,

  // 输入框位置
  inputPosition: "bottom" as const,

  // 语言
  lang: "zh-CN",

  // 加载方式
  loading: "lazy" as const,
};

// GitHub 配置
export const githubConfig = {
  // 仓库所有者
  owner: "Robert-Stackflow",

  // 仓库名称
  repo: "Formulaic",

  // 默认分支
  branch: "master",

  // 内容目录
  contentDir: "content",
};
