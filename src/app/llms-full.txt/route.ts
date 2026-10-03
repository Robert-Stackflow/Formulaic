import { source } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';

// cached forever
export const revalidate = false;

export async function GET() {
  const scanned: string[] = [];
  for (const page of source.getPages()) scanned.push(await getLLMText(page));

  return new Response(scanned.join('\n\n'));
}
