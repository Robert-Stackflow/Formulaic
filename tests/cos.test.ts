import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const { clientConfig, uploadFile } = require("../scripts/upload-cos.cjs");
const { cacheControl } = require("../scripts/cache-policy.cjs");

test("COS acceleration retains the bucket region and virtual-host addressing", () => {
  const config = clientConfig({ AWS_ENDPOINT: "https://cos.ap-guangzhou.myqcloud.com", COS_ACCELERATE: "true" });
  assert.equal(config.endpoint, "https://cos.accelerate.myqcloud.com");
  assert.equal(config.region, "ap-guangzhou");
  assert.equal(config.forcePathStyle, false);
  assert.throws(() => clientConfig({ AWS_ENDPOINT: "http://cos.ap-guangzhou.myqcloud.com" }));
});
test("Next.js fingerprints are immutable; HTML and RSC payloads revalidate", () => {
  assert.match(cacheControl("_next/static/chunks/app-abc123.js"), /immutable/);
  for (const key of ["docs/index.html", "docs/index.txt", "docs/__next.page.txt", "static.json"]) {
    assert.match(cacheControl(key), /max-age=0/);
    assert.doesNotMatch(cacheControl(key), /immutable/);
  }
});
test("unchanged content with stale MIME/cache metadata is republished", async () => {
  const dir = mkdtempSync(join(tmpdir(), "formulaic-upload-"));
  try {
    const file = join(dir, "index.html"); writeFileSync(file, "<h1>Formulaic</h1>");
    let metadata: any;
    const calls: any[] = [];
    const client = { send: async (command: any) => {
      calls.push(command);
      if (command.constructor.name === "HeadObjectCommand") {
        return metadata || { Metadata: { sha1: "old" } };
      }
      metadata = command.input; return {};
    }};
    assert.equal(await uploadFile(client, "formulaic-1313406087", file, dir), "uploaded");
    assert.equal(await uploadFile(client, "formulaic-1313406087", file, dir), "unchanged");
    metadata.ContentType = "application/octet-stream";
    assert.equal(await uploadFile(client, "formulaic-1313406087", file, dir), "uploaded");
    assert.ok(calls.every(c => !c.constructor.name.startsWith("Delete")));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
