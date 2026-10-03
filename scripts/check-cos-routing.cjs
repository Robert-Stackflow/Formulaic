'use strict';
const { S3Client, GetBucketWebsiteCommand, PutBucketWebsiteCommand } = require('@aws-sdk/client-s3');
const { cdn } = require('tencentcloud-sdk-nodejs-cdn');
async function main() {
  const credential = { secretId: process.env.AWS_ACCESS_KEY_ID, secretKey: process.env.AWS_SECRET_ACCESS_KEY };
  if (!credential.secretId || !credential.secretKey) throw new Error('Missing deployment credentials');
  const bucket = 'formulaic-1313406087';
  const storage = new S3Client({ region: 'ap-guangzhou', endpoint: 'https://cos.ap-guangzhou.myqcloud.com', forcePathStyle: false });
  const client = new cdn.v20180606.Client({ credential, profile: { httpProfile: { reqTimeout: 30 } } });
  const checks = await Promise.allSettled([
    storage.send(new GetBucketWebsiteCommand({ Bucket: bucket })),
    client.DescribeDomainsConfig({ Filters: [{ Name: 'domain', Value: ['formulaic.cloudchewie.com'], Fuzzy: false }] }),
  ]);
  const repair = process.argv.includes('--repair-404');
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    if (check.status === 'rejected') { console.log(`${i === 0 ? 'COS' : 'CDN'}: ${check.reason.code || check.reason.name}`); if (i === 0 || !repair) process.exitCode = 1; continue; }
    if (i === 0) { const { IndexDocument, ErrorDocument, RoutingRules, RedirectAllRequestsTo } = check.value; console.log(JSON.stringify({ IndexDocument, ErrorDocument, RoutingRules, RedirectAllRequestsTo })); }
    else for (const domain of check.value.Domains || []) console.log(JSON.stringify({ Domain: domain.Domain, Status: domain.Status, Origin: domain.Origin, FollowRedirect: domain.FollowRedirect, ForceRedirect: domain.ForceRedirect }));
  }
  if (repair && checks[0].status === 'fulfilled') {
    const website = checks[0].value;
    const rules = website.RoutingRules || [];
    const filtered = rules.filter(rule => !(rule.Condition?.HttpErrorCodeReturnedEquals === '404' && rule.Redirect?.ReplaceKeyWith === '/' && !rule.Redirect?.HostName));
    if (filtered.length === rules.length) { console.log('COS: no invalid 404 redirect remains'); return; }
    const config = { IndexDocument: website.IndexDocument, ErrorDocument: website.ErrorDocument, RedirectAllRequestsTo: website.RedirectAllRequestsTo, ...(filtered.length ? { RoutingRules: filtered } : {}) };
    await storage.send(new PutBucketWebsiteCommand({ Bucket: bucket, WebsiteConfiguration: config }));
    const verified = await storage.send(new GetBucketWebsiteCommand({ Bucket: bucket }));
    if (verified.RoutingRules?.some(rule => rule.Condition?.HttpErrorCodeReturnedEquals === '404' && rule.Redirect?.ReplaceKeyWith === '/')) throw new Error('404 redirect still present');
    console.log('COS: removed invalid 404 redirect; index, error page and HTTPS settings preserved');
  }
}
main().catch(error => { console.error(error.code || error.name); process.exitCode = 1; });
