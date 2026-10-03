'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { cdn } = require('tencentcloud-sdk-nodejs-cdn');
const { filesIn } = require('./upload-cos.cjs');
const { cacheControl } = require('./cache-policy.cjs');
function publishedUrls(root) {
  const keys = filesIn(root).map(file => path.relative(root, file).split(path.sep).join('/'))
    .filter(key => !cacheControl(key).includes('immutable'));
  const routes = keys.flatMap(key => key === 'index.html' || key.endsWith('/index.html')
    ? [key, key.slice(0, -'index.html'.length), key.slice(0, -'/index.html'.length)] : [key]);
  return [...new Set(routes.map(value => new URL(value, 'https://formulaic.cloudchewie.com/').href))];
}
async function main() {
  const root = path.resolve('out');
  if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Build the site before refreshing CDN');
  const urls = publishedUrls(root);
  if (process.argv.includes('--dry-run')) { console.log(`CDN: ${urls.length} mutable URLs ready`); return; }
  for (const key of ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY']) if (!process.env[key]) throw new Error(`Missing ${key}`);
  const client = new cdn.v20180606.Client({ credential: { secretId: process.env.AWS_ACCESS_KEY_ID, secretKey: process.env.AWS_SECRET_ACCESS_KEY }, profile: { httpProfile: { reqTimeout: 30 } } });
  for (let offset = 0; offset < urls.length; offset += 1000) {
    const result = await client.PurgeUrlsCache({ Urls: urls.slice(offset, offset + 1000) });
    if (!result.TaskId) throw new Error('CDN refresh did not return a task ID');
  }
  console.log(`CDN: refreshing ${urls.length} mutable URLs`);
}
module.exports = { publishedUrls };
if (require.main === module) main().catch(error => { console.error(error.code || 'CDN refresh failed'); process.exitCode = 1; });
