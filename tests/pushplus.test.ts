import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createNotification, sendNotification } = require("../scripts/notify-pushplus.cjs");
const env = {
  PUSHPLUS_TOKEN: "test-token",
  FORMULAIC_DEPLOY_TARGET: "COS",
  FORMULAIC_DEPLOY_STATUS: "success",
  GITHUB_SERVER_URL: "https://github.com",
  GITHUB_REPOSITORY: "Robert-Stackflow/Formulaic",
  GITHUB_RUN_ID: "12345",
  GITHUB_SHA: "abcdef1234567890",
  GITHUB_REF_NAME: 'feature/<test>&"',
  GITHUB_WORKFLOW: "Build and deploy Formulaic",
  GITHUB_JOB: "build-deploy",
  GITHUB_ACTOR: "Robert-Stackflow",
};

test("deployment notifications distinguish platforms and outcomes with safe links", () => {
  const now = new Date("2026-10-06T00:00:00Z");
  for (const target of ["COS", "Vercel"]) {
    for (const [status, label] of [["success", "成功"], ["failure", "失败"], ["cancelled", "已取消"]]) {
      const payload = createNotification({ ...env, FORMULAIC_DEPLOY_TARGET: target, FORMULAIC_DEPLOY_STATUS: status }, now);
      assert.equal(payload.title, `Formulaic · ${target} 部署${label}`);
      assert.ok(payload.content.includes("https://github.com/Robert-Stackflow/Formulaic/actions/runs/12345"));
      assert.ok(payload.content.includes("https://github.com/Robert-Stackflow/Formulaic/commit/abcdef1234567890"));
      assert.ok(payload.content.includes("feature/&lt;test&gt;&amp;&quot;"));
      assert.ok(payload.content.includes("08:00:00"));
      assert.ok(!payload.content.includes(env.PUSHPLUS_TOKEN));
    }
  }
});

test("missing PushPlus secret skips the network request", async () => {
  const sent = await sendNotification({ ...env, PUSHPLUS_TOKEN: " " }, {
    fetch: async () => { assert.fail("Missing token must not send a message"); },
    log: () => {},
  });
  assert.equal(sent, false);
});

test("PushPlus messages use JSON and require provider acceptance", async () => {
  let calls = 0;
  const accepted = await sendNotification(env, {
    fetch: async (url: string, options: RequestInit) => {
      calls++;
      assert.equal(url, "https://www.pushplus.plus/send");
      assert.equal(options.method, "POST");
      assert.equal(options.redirect, "error");
      const payload = JSON.parse(String(options.body));
      assert.equal(payload.token, env.PUSHPLUS_TOKEN);
      assert.equal(payload.template, "html");
      return { ok: true, json: async () => ({ code: 200 }) };
    },
    log: () => {},
  });
  assert.equal(accepted, true);
  assert.equal(calls, 1);
});

test("notification errors never leak tokens, retry, or throw", async () => {
  const warnings: string[] = [];
  for (const failure of ["http", "provider", "network", "json"]) {
    let calls = 0;
    const sent = await sendNotification(env, {
      fetch: async () => {
        calls++;
        if (failure === "network") throw new Error(env.PUSHPLUS_TOKEN);
        return {
          ok: failure !== "http",
          status: 503,
          json: async () => {
            if (failure === "json") throw new Error(env.PUSHPLUS_TOKEN);
            return { code: 600, msg: env.PUSHPLUS_TOKEN };
          },
        };
      },
      warn: (message: string) => warnings.push(message),
    });
    assert.equal(sent, false);
    assert.equal(calls, 1);
  }
  assert.equal(warnings.length, 4);
  assert.ok(warnings.every(message => !message.includes(env.PUSHPLUS_TOKEN)));
});
