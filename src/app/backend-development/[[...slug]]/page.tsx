import { backendDevelopmentSource } from "@/lib/source";
import {
  DocPageRenderer,
  getDocPageMetadata,
} from "@/components/docs/doc-page-renderer";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  return (
    <DocPageRenderer source={backendDevelopmentSource} slug={params.slug} />
  );
}

export async function generateStaticParams() {
  return backendDevelopmentSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  return getDocPageMetadata(backendDevelopmentSource, params.slug);
}
