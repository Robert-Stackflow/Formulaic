import { docs, blog } from "@/.source";
import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon(iconName) {
    if (!iconName) return;
    const IconComponent = icons[iconName as keyof typeof icons];
    if (IconComponent) return createElement(IconComponent);
  },
});

export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
  icon(iconName) {
    if (!iconName) return;
    const IconComponent = icons[iconName as keyof typeof icons];
    if (IconComponent) return createElement(IconComponent);
  },
});