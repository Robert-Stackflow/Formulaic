import { exportSearchIndexes } from "@/lib/export-search-indexes";

export const revalidate = false;
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await exportSearchIndexes());
}
