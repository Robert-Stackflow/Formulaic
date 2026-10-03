'use strict';
const { S3Client, GetBucketWebsiteCommand } = require('@aws-sdk/client-s3');
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
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    if (check.status === 'rejected') { console.log(`${i === 0 ? 'COS' : 'CDN'}: ${check.reason.code || check.reason.name}`); process.exitCode = 1; continue; }
    if (i === 0) { const { IndexDocument, ErrorDocument, RoutingRules, RedirectAllRequestsTo } = check.value; console.log(JSON.stringify({ IndexDocument, ErrorDocument, RoutingRules, RedirectAllRequestsTo })); }
    else for (const domain of check.value.Domains || []) console.log(JSON.stringify({ Domain: domain.Domain, Status: domain.Status, Origin: domain.Origin, FollowRedirect: domain.FollowRedirect, ForceRedirect: domain.ForceRedirect }));
  }
}
main().catch(error => { console.error(error.code || error.name); process.exitCode = 1; });
