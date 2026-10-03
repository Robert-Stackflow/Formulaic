'use strict';
const fs = require('node:fs');
const path = require('node:path');
function validateIndex(payload) {
  if (payload.version !== 1 || !Array.isArray(payload.documents) || payload.count !== payload.documents.length || !payload.count) throw new Error('Refusing incomplete or empty Formulaic index');
  const ids = new Set();
  for (const doc of payload.documents) {
    if (!/^[a-f0-9]{64}$/.test(doc.id) || ids.has(doc.id) || typeof doc.title !== 'string' || typeof doc.content !== 'string' || !/^\/(docs|blog)(\/|#|$)/.test(doc.url) || /[\\\u0000-\u001f]/.test(doc.url)) throw new Error('Invalid document in search index');
    const normalized = new URL(doc.url, 'https://formulaic.invalid');
    if (!/^\/(docs|blog)(\/|$)/.test(normalized.pathname)) throw new Error('Invalid normalized document URL');
    ids.add(doc.id);
  }
  return payload.documents;
}
function errorSummary(error, env = process.env) {
  let message = String(error.message || 'Index upload failed');
  for (const [name, value] of Object.entries(env)) if (/KEY|SECRET|TOKEN|PASSWORD/i.test(name) && value) message = message.split(value).join('[redacted]');
  return `OneSearch: ${message}`;
}
async function syncIndex(documents, request, sleep = ms => new Promise(resolve => setTimeout(resolve, ms))) {
  const existing = [];
  for (let offset = 0;; offset += 1000) {
    const page = await request(`documents?fields=id&limit=1000&offset=${offset}`);
    if (!Array.isArray(page.results) || !Number.isInteger(page.total)) throw new Error('Invalid document inventory');
    existing.push(...page.results.map(x => x.id));
    if (offset + page.results.length >= page.total) break;
    if (!page.results.length || offset > 1000000) throw new Error('Document inventory did not complete');
  }
  async function wait(task) {
    if (!Number.isInteger(task.taskUid)) throw new Error('No indexing task returned');
    const deadline = Date.now() + 600000;
    while (Date.now() < deadline) {
      const result = await request(`tasks/${task.taskUid}`);
      if (result.status === 'succeeded') return;
      if (['failed','canceled'].includes(result.status)) throw new Error(`Indexing task ${task.taskUid} failed`);
      await sleep(750);
    }
    throw new Error(`Indexing task ${task.taskUid} timed out`);
  }
  // Replace documents with stable ids, then remove stale ids only after every
  // upsert succeeds. A failed upload never triggers the cleanup phase.
  for (let offset = 0; offset < documents.length; offset += 100) await wait(await request('documents', 'POST', documents.slice(offset, offset + 100)));
  const current = new Set(documents.map(x => x.id));
  const stale = existing.filter(id => !current.has(id));
  for (let offset = 0; offset < stale.length; offset += 1000) await wait(await request('documents/delete-batch','POST',stale.slice(offset,offset+1000)));
  return { uploaded: documents.length, removed: stale.length };
}
async function main() {
  const documents = validateIndex(JSON.parse(fs.readFileSync(path.resolve('.next/server/app/static.json.body'),'utf8')));
  if (process.argv.includes('--dry-run')) { console.log(`OneSearch: ${documents.length} sections ready`); return; }
  const endpoint = process.env.ONESEARCH_PUBLISH_URL || (process.env.ONESEARCH_SERVER_URL && process.env.ONESEARCH_APP_ID ? process.env.ONESEARCH_SERVER_URL.replace(/\/$/,'')+'/api/apps/'+process.env.ONESEARCH_APP_ID : '');
  const key = process.env.ONESEARCH_PUBLISH_KEY;
  if (!endpoint || !key) throw new Error('Missing ONESEARCH_PUBLISH_URL or ONESEARCH_PUBLISH_KEY');
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !/\/api\/apps\/app_[a-f0-9]{32}\/?$/.test(url.pathname)) throw new Error('Invalid HTTPS publishing endpoint');
  const request = async (suffix, method = 'GET', body) => {
    const response = await fetch(endpoint.replace(/\/$/,'')+'/'+suffix, { method, redirect:'error', signal:AbortSignal.timeout(45000), headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'}, body:body ? JSON.stringify(body) : undefined });
    if (!response.ok) throw new Error(`Publish API returned HTTP ${response.status}`);
    return response.json();
  };
  const result = await syncIndex(documents, request);
  console.log(`OneSearch: uploaded ${result.uploaded} sections, removed ${result.removed} outdated sections`);
}
module.exports = { validateIndex, syncIndex, errorSummary };
if (require.main === module) main().catch(error => { console.error(errorSummary(error)); process.exitCode = 1; });
