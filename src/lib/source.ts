import {
  computerSystemBasics,
  programmingLanguages,
  algorithms,
  backendDevelopment,
  devops,
  llm,
  interviewPrep,
  blog,
} from "@/.source";
import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";

// 创建 loader 的辅助函数
const createDocsLoader = (source: any, baseUrl: string) =>
  loader({
    baseUrl,
    source: source.toFumadocsSource(),
    icon(iconName) {
      if (!iconName) return;
      const IconComponent = icons[iconName as keyof typeof icons];
      if (IconComponent) return createElement(IconComponent);
    },
  });

export const computerSystemBasicsSource = createDocsLoader(
  computerSystemBasics,
  "/computer-system-basics"
);
export const programmingLanguagesSource = createDocsLoader(
  programmingLanguages,
  "/programming-languages"
);
export const algorithmsSource = createDocsLoader(algorithms, "/algorithms");
export const backendDevelopmentSource = createDocsLoader(
  backendDevelopment,
  "/backend-development"
);
export const devopsSource = createDocsLoader(devops, "/devops");
export const llmSource = createDocsLoader(llm, "/large-language-models");
export const interviewPrepSource = createDocsLoader(
  interviewPrep,
  "/interview-preparation"
);

// docs 文件夹保留原有的合并逻辑
const allSources = [
  computerSystemBasics.toFumadocsSource(),
  programmingLanguages.toFumadocsSource(),
  algorithms.toFumadocsSource(),
  backendDevelopment.toFumadocsSource(),
  devops.toFumadocsSource(),
  llm.toFumadocsSource(),
  interviewPrep.toFumadocsSource(),
];

export const source = loader({
  baseUrl: "/docs",
  source: {
    files: allSources.flatMap((s) => s.files),
  },
  icon(iconName) {
    if (!iconName) return;
    const IconComponent = icons[iconName as keyof typeof icons];
    if (IconComponent) return createElement(IconComponent);
  },
});

export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
});
