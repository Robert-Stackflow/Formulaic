const keys = ["NEXT_PUBLIC_ONESEARCH_SERVER_URL", "NEXT_PUBLIC_ONESEARCH_APP_ID", "NEXT_PUBLIC_ONESEARCH_SEARCH_KEY"];
// A legacy empty NextAuth URL makes even public pages fail during prerendering.
process.env.NEXTAUTH_URL = "https://v.formulaic.cloudchewie.com";
keys.push("NEXTAUTH_URL");
for (const key of [...keys, "VERCEL_TOKEN", "VERCEL_PROJECT_ID", "VERCEL_ORG_ID"]) {
  if (!process.env[key]) throw new Error(`Missing ${key}`);
}
// Persist only the public search configuration. Publishing credentials stay in CI.
const response = await fetch(`https://api.vercel.com/v10/projects/${encodeURIComponent(process.env.VERCEL_PROJECT_ID)}/env?upsert=true&teamId=${encodeURIComponent(process.env.VERCEL_ORG_ID)}`, {
  method: "POST", signal: AbortSignal.timeout(30000),
  headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify(keys.map(key => ({ key, value: process.env[key], type: "plain", target: ["production", "preview", "development"] }))),
});
if (!response.ok) throw new Error(`Vercel configuration failed: HTTP ${response.status}`);
const result = await response.json();
if (result.failed?.length) throw new Error("Vercel rejected search configuration");
console.log("Vercel public search configuration updated");
