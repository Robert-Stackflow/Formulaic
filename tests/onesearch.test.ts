import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { indexPage } from "../src/lib/onesearch-index";
import { highlightParts, safeSearchUrl, searchDocuments } from "../src/lib/onesearch-client";
const require = createRequire(import.meta.url);
const { validateIndex, syncIndex, errorSummary } = require("../scripts/sync-onesearch.cjs");

test("section records preserve headings and stable IDs as paragraphs change", () => {
  const page = { url: "/docs/算法", title: "算法", description: "说明", type: "docs" as const,
    structured: { headings: [{ id: "动态规划", content: "动态规划" }], contents: [{ heading: "动态规划", content: "第一段" }, { heading: "动态规划", content: "第二段" }] } };
  const first = indexPage(page);
  const updated = indexPage({ ...page, structured: { ...page.structured, contents: [{ heading: "动态规划", content: "修改内容" }] } });
  assert.equal(first.length, 2);
  assert.equal(first[1].content, "第一段\n第二段");
  assert.equal(first[1].id, updated[1].id);
  assert.equal(decodeURIComponent(first[1].url), "/docs/算法#动态规划");
});

test("result URLs reject scripts, external sites and traversal", () => {
  for (const url of ["javascript:alert(1)", "//evil.test/docs", "/docs/../../auth", "/blog/..\\evil", "/docs/%2e%2e/auth"]) assert.equal(safeSearchUrl(url), null);
  assert.equal(safeSearchUrl("/docs/search#section"), "/docs/search#section");
});

test("highlight output retains HTML as inert text and tolerates broken markers", () => {
  assert.deepEqual(highlightParts("<img src=x> [onesearch-hit]中文[/onesearch-hit]"), [{ text: "<img src=x> ", highlighted: false }, { text: "中文", highlighted: true }]);
  assert.deepEqual(highlightParts("[onesearch-hit]open"), [{ text: "[onesearch-hit]open", highlighted: false }]);
});

test("publisher rejects empty, duplicate and invalid indexes", () => {
  const doc = indexPage({ url: "/docs/test", title: "test", type: "docs", structured: { headings: [], contents: [] } })[0];
  assert.equal(validateIndex({ version: 1, count: 1, documents: [doc] }).length, 1);
  for (const payload of [{ version: 1, count: 0, documents: [] }, { version: 1, count: 2, documents: [doc, doc] }, { version: 1, count: 1, documents: [{ ...doc, url: "/docs/../../secret" }] }]) assert.throws(() => validateIndex(payload));
});

test("failed upsert never removes old documents", async () => {
  const calls: string[] = [];
  await assert.rejects(syncIndex([{ id: "new" }], async (suffix: string) => {
    calls.push(suffix);
    if (suffix.startsWith("documents?")) return { results: [{ id: "old" }], total: 1 };
    if (suffix === "documents") return { taskUid: 12 };
    return { status: "failed" };
  }, async () => {}));
  assert.ok(!calls.includes("documents/delete-batch"));
});

test("publisher completes inventory and successful upserts before pruning", async () => {
  const calls: string[] = [];
  const result = await syncIndex([{ id: "new" }], async (suffix: string) => {
    calls.push(suffix);
    if (suffix.startsWith("documents?")) return { results: suffix.includes("offset=0") ? [{ id: "old" }] : [{ id: "new" }], total: 2 };
    if (suffix === "documents") return { taskUid: 1 };
    if (suffix === "documents/delete-batch") return { taskUid: 2 };
    return { status: "succeeded" };
  }, async () => {});
  assert.deepEqual(result, { uploaded: 1, removed: 1 });
  assert.ok(calls.indexOf("tasks/1") < calls.indexOf("documents/delete-batch"));
  assert.ok(calls.includes("documents?fields=id&limit=1000&offset=1000"));
});

test("publish errors redact credentials", () => {
  assert.equal(errorSummary(new Error("secret-value"), { ONESEARCH_PUBLISH_KEY: "secret-value" }), "OneSearch: [redacted]");
});

test("client uses paged search and safe highlight markers", async () => {
  const original = global.fetch;
  const oldEnv = { ...process.env };
  process.env.NEXT_PUBLIC_ONESEARCH_SERVER_URL = "https://search.example.test";
  process.env.NEXT_PUBLIC_ONESEARCH_APP_ID = "app_test";
  process.env.NEXT_PUBLIC_ONESEARCH_SEARCH_KEY = "search-only";
  try {
    global.fetch = async (url, init) => {
      assert.equal(url, "https://search.example.test/api/apps/app_test/search");
      const request = JSON.parse(String(init?.body));
      assert.equal(request.page, 2); assert.equal(request.hitsPerPage, 8);
      assert.equal(request.highlightPreTag, "[onesearch-hit]");
      return Response.json({ hits: [{ id: "ok", url: "/docs/test" }, { id: "bad", url: "https://evil.test" }], totalPages: 3 });
    };
    assert.equal((await searchDocuments("算法", 2, new AbortController().signal)).hits.length, 1);
  } finally { global.fetch = original; process.env = oldEnv; }
});
