export const HIT_START = "[onesearch-hit]";
export const HIT_END = "[/onesearch-hit]";
export interface SearchHit {
  id: string; title: string; url: string; section: string; content: string;
  type: "docs" | "blog";
  _formatted?: Partial<Record<"title" | "section" | "content", string>>;
}
export interface SearchResponse {
  hits: SearchHit[]; totalHits: number; totalPages: number; page: number;
  hitsPerPage: number; processingTimeMs: number;
}
export function safeSearchUrl(value: string): string | null {
  if (!/^\/(docs|blog)(\/|#|$)/.test(value) || /[\\\u0000-\u001f]/.test(value)) return null;
  try {
    const url = new URL(value, "https://formulaic.invalid");
    return url.origin === "https://formulaic.invalid" && /^\/(docs|blog)(\/|$)/.test(url.pathname) ? url.pathname + url.search + url.hash : null;
  } catch { return null; }
}
export function highlightParts(value: string) {
  const parts: { text: string; highlighted: boolean }[] = [];
  let rest = value;
  while (rest) {
    const start = rest.indexOf(HIT_START);
    if (start < 0) { parts.push({ text: rest, highlighted: false }); break; }
    if (start) parts.push({ text: rest.slice(0, start), highlighted: false });
    rest = rest.slice(start + HIT_START.length);
    const end = rest.indexOf(HIT_END);
    if (end < 0) { parts.push({ text: HIT_START + rest, highlighted: false }); break; }
    parts.push({ text: rest.slice(0, end), highlighted: true });
    rest = rest.slice(end + HIT_END.length);
  }
  return parts;
}
export async function searchDocuments(query: string, page: number, signal: AbortSignal): Promise<SearchResponse> {
  const server = process.env.NEXT_PUBLIC_ONESEARCH_SERVER_URL;
  const appId = process.env.NEXT_PUBLIC_ONESEARCH_APP_ID;
  const key = process.env.NEXT_PUBLIC_ONESEARCH_SEARCH_KEY;
  if (!server || !appId || !key) throw new Error("搜索服务尚未配置");
  const endpoint = new URL(server);
  if (endpoint.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(endpoint.hostname)) throw new Error("搜索服务地址无效");
  const response = await fetch(`${server.replace(/\/$/, "")}/api/apps/${appId}/search`, {
    method: "POST", signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]), credentials: "omit",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ q: query, page, hitsPerPage: 8,
      attributesToRetrieve: ["id", "title", "url", "section", "content", "type"],
      attributesToHighlight: ["title", "section", "content"], attributesToCrop: ["content"],
      cropLength: 40, highlightPreTag: HIT_START, highlightPostTag: HIT_END, showMatchesPosition: true }),
  });
  if (!response.ok) throw new Error(response.status === 429 ? "搜索过于频繁，请稍后重试" : "搜索暂时不可用，请重试");
  const data = await response.json() as SearchResponse;
  if (!Array.isArray(data.hits) || !Number.isInteger(data.totalPages)) throw new Error("搜索服务返回了无效结果");
  return { ...data, hits: data.hits.filter(hit => typeof hit.url === "string" && safeSearchUrl(hit.url)) };
}
