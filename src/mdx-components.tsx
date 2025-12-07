import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Mermaid } from "@/components/mermaid";
import * as CodeComponents from "fumadocs-ui/components/codeblock";
import * as FilesComponents from "fumadocs-ui/components/files";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import * as AccordionComponents from "fumadocs-ui/components/accordion";
import * as StepsComponents from "fumadocs-ui/components/steps";
import * as icons from "lucide-react";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

// Custom MDX components for Formulaic documentation
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    Mermaid,
    ...TabsComponents,
    ...FilesComponents,
    ...AccordionComponents,
    ...StepsComponents,
    ...CodeComponents,
    img: (props) => <ImageZoom {...(props as any)} />,
    ...components,
  };
}
