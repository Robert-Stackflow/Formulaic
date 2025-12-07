import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import type { LoaderOutput } from "fumadocs-core/source";
import {
  programmingLanguagesSource,
  algorithmsSource,
  computerSystemBasicsSource,
  llmSource,
  backendDevelopmentSource,
  devopsSource,
  interviewPrepSource,
} from "@/lib/source";

interface DocLayoutWrapperProps {
  source: LoaderOutput<any>;
  children: ReactNode;
}

const allPageTrees = [
  {
    ...programmingLanguagesSource.pageTree,
    name: "编程语言",
  },
  {
    ...algorithmsSource.pageTree,
    name: "算法",
  },
  {
    ...computerSystemBasicsSource.pageTree,
    name: "系统基础",
  },
  {
    ...llmSource.pageTree,
    name: "大语言模型",
  },
  {
    ...backendDevelopmentSource.pageTree,
    name: "后端开发",
  },
  {
    ...devopsSource.pageTree,
    name: "DevOps",
  },
  {
    ...interviewPrepSource.pageTree,
    name: "面试准备",
  },
];

export function DocLayoutWrapper({ source, children }: DocLayoutWrapperProps) {
  return (
    <DocsLayout
      tree={source.pageTree as any}
      {...baseOptions}
      links={[]}
      sidebar={{
        tabs: {},
      }}
    >
      {children}
    </DocsLayout>
  );
}
