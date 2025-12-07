import { getPageTreePeers } from "fumadocs-core/page-tree";
import { Card, Cards } from "fumadocs-ui/components/card";
import { DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getMDXComponents } from "@/mdx-components";
import { tocConfig } from "@/lib/toc-config";
import type { LoaderOutput } from "fumadocs-core/source";
import { ExportPDFButton, LLMCopyButton, ViewOptions } from "./page-sections";

interface DocPageRendererProps {
  source: LoaderOutput<any>;
  slug?: string[];
}

export function DocPageRenderer({ source, slug }: DocPageRendererProps) {
  const page = source.getPage(slug);
  if (!page) notFound();

  const {
    body: MDXContent,
    full,
    toc,
    lastModified,
    title,
    description,
    index,
  } = page.data;

  return (
    <DocsPage
      toc={toc}
      full={full}
      lastUpdate={lastModified ? new Date(lastModified) : undefined}
      {...tocConfig}
      tableOfContent={{
        style: "clerk",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-[1.75em] font-semibold">{title}</h1>
          <p className="text-lg text-fd-muted-foreground mb-4">{description}</p>
          <div className="flex flex-row flex-wrap gap-2 items-center" id="doc-page-actions">
            <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
            <ExportPDFButton />
            <ViewOptions
              markdownUrl={`${page.url}.mdx`}
              githubUrl={`https://github.com/Robert-Stackflow/Formulaic/blob/main/content/${page.path}`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center border-b mb-3"></div>
      <div className="prose flex-1 text-fd-foreground/90">
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
        {index ? <DocsCategory source={source} url={page.url} /> : null}
      </div>
    </DocsPage>
  );
}

function DocsCategory({
  source,
  url,
}: {
  source: LoaderOutput<any>;
  url: string;
}) {
  return (
    <Cards>
      {getPageTreePeers(source.pageTree, url).map((peer) => {
        return (
          <Card key={peer.url} title={peer.name} href={peer.url}>
            {peer.description}
          </Card>
        );
      })}
    </Cards>
  );
}

export function getDocPageMetadata(source: LoaderOutput<any>, slug?: string[]) {
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
