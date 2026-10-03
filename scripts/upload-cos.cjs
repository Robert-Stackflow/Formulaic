'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const mime = require('mime-types');
const { S3Client, HeadObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { cacheControl } = require('./cache-policy.cjs');

function filesIn(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(file) : entry.isFile() ? [file] : [];
  });
}

async function metadata(file, root) {
  const hash = crypto.createHash('sha1');
  for await (const chunk of fs.createReadStream(file)) hash.update(chunk);
  const Key = path.relative(root, file).split(path.sep).join('/');
  return {
    Key, ContentType: mime.contentType(path.extname(file)) || 'application/octet-stream',
    CacheControl: cacheControl(Key), ContentLength: fs.statSync(file).size,
    Metadata: { sha1: hash.digest('hex') },
  };
}

async function uploadFile(client, bucket, file, root) {
  const params = { Bucket: bucket, ...await metadata(file, root) };
  try {
    const previous = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: params.Key }));
    if (previous.Metadata?.sha1 === params.Metadata.sha1 && previous.CacheControl === params.CacheControl && previous.ContentType === params.ContentType) return 'unchanged';
  } catch (error) {
    if (error.$metadata?.httpStatusCode !== 404) throw error;
  }
  // A stream cannot be replayed by SDK retries after COS times out an upload.
  const body = await fs.promises.readFile(file);
  await client.send(new PutObjectCommand({ ...params, Body: body }));
  return 'uploaded';
}

function clientConfig(env = process.env) {
  const regional = new URL(env.AWS_ENDPOINT);
  if (regional.protocol !== 'https:') throw new Error('COS endpoint must use HTTPS');
  const region = env.AWS_REGION || regional.hostname.match(/cos\.([a-z]+-[a-z]+(?:-\d+)?)\./)?.[1];
  if (!region) throw new Error('Set AWS_REGION when the COS endpoint does not include a region');
  return {
    endpoint: env.COS_ACCELERATE === 'true' ? 'https://cos.accelerate.myqcloud.com' : regional.href,
    region, maxAttempts: 3, forcePathStyle: false,
    requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED',
  };
}

async function main() {
  const root = path.resolve('out');
  if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Build the site before uploading to COS');
  const files = filesIn(root);
  if (process.argv.includes('--dry-run')) {
    const policies = {};
    for (const file of files) {
      const policy = cacheControl(file);
      policies[policy] = (policies[policy] || 0) + 1;
    }
    console.log(JSON.stringify({ files: files.length, policies }, null, 2));
    return;
  }
  for (const key of ['AWS_ENDPOINT', 'AWS_BUCKET', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY']) {
    if (!process.env[key]) throw new Error(`Missing ${key}`);
  }
  const client = new S3Client(clientConfig());
  let uploaded = 0;
  // Publish assets first. Keep older fingerprints for cached HTML.
  for (const batch of [files.filter(f => !f.endsWith('.html')), files.filter(f => f.endsWith('.html'))]) {
    for (let i = 0; i < batch.length; i += 6) {
      const results = await Promise.all(batch.slice(i, i + 6).map(file => uploadFile(client, process.env.AWS_BUCKET, file, root)));
      uploaded += results.filter(result => result === 'uploaded').length;
    }
  }
  console.log(`COS: ${uploaded} uploaded, ${files.length - uploaded} unchanged.`);
  client.destroy();
}

module.exports = { filesIn, metadata, uploadFile, clientConfig };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
