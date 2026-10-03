'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function stageProject(root) {
  // Build in an isolated directory: the Vercel build and running dev server stay intact.
  const stage = fs.mkdtempSync(path.join(root, '.cos-build-'));
  for (const name of ['src', 'content', 'public', 'package.json', 'package-lock.json',
    'tsconfig.json', 'next-env.d.ts', 'next.config.mjs', 'source.config.ts', 'postcss.config.mjs']) {
    const from = path.join(root, name);
    if (!fs.existsSync(from)) continue;
    fs.cpSync(from, path.join(stage, name), { recursive: true, filter: file => {
      const relative = path.relative(path.join(root, 'src'), file).split(path.sep).join('/');
      // Object storage cannot execute Next.js APIs or proxy middleware.
      return relative !== 'proxy.ts' && relative !== 'app/api' && !relative.startsWith('app/api/')
        && relative !== 'app/llms.mdx' && !relative.startsWith('app/llms.mdx/');
    }});
  }
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(stage, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  // Extensionless GET exports can collide with a nested directory (e.g. algorithms).
  // Export one manifest, then materialize each Markdown file with a .mdx suffix.
  const markdownRoute = path.join(stage, 'src/app/markdown.json');
  fs.mkdirSync(markdownRoute, { recursive: true });
  fs.writeFileSync(path.join(markdownRoute, 'route.ts'), `
import { source } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";
export const dynamic = "force-static";
export const revalidate = false;
export async function GET() {
  const pages: Record<string, string> = {};
  for (const page of source.getPages()) pages[page.url] = await getLLMText(page);
  return Response.json(pages);
}
`);
  return stage;
}
function main() {
  const root = path.resolve(__dirname, '..');
  const stage = stageProject(root);
  const localEnv = path.join(root, '.env.local');
  const publicConfig = fs.existsSync(localEnv) ? require('dotenv').parse(fs.readFileSync(localEnv)) : {};
  for (const name of ['NEXT_PUBLIC_ONESEARCH_SERVER_URL', 'NEXT_PUBLIC_ONESEARCH_APP_ID', 'NEXT_PUBLIC_ONESEARCH_SEARCH_KEY']) {
    if (!process.env[name] && publicConfig[name]) process.env[name] = publicConfig[name];
  }
  const env = { ...process.env, FORMULAIC_STATIC_EXPORT: 'true', NEXT_PUBLIC_STATIC_EXPORT: 'true',
    NEXTAUTH_URL: 'https://formulaic.cloudchewie.com', NODE_OPTIONS: '--max-old-space-size=4096' };
  const built = spawnSync(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build', '--webpack'], { cwd: stage, env, stdio: 'inherit' });
  if (built.status !== 0) throw new Error(`Static build failed (${built.status})`);
  const exported = path.join(stage, 'out');
  if (!fs.existsSync(path.join(exported, 'index.html')) || !fs.existsSync(path.join(exported, 'static.json'))) throw new Error('Static export is incomplete');
  // Replace only this repository's generated output, after a successful build.
  const output = path.resolve(root, 'out');
  if (path.dirname(output) !== root || path.basename(output) !== 'out') throw new Error('Unsafe output path');
  fs.rmSync(output, { recursive: true, force: true });
  fs.cpSync(exported, output, { recursive: true });
  // Materialize the .mdx aliases normally served by Next.js rewrites.
  const markdown = JSON.parse(fs.readFileSync(path.join(output, 'markdown.json'), 'utf8'));
  for (const [url, text] of Object.entries(markdown)) {
    if (!/^\/docs(?:\/|$)/.test(url) || url.includes('..') || url.includes('\\')) throw new Error('Invalid Markdown URL');
    const target = path.join(output, url.slice(1) + '.mdx');
    fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, text);
  }
  fs.unlinkSync(path.join(output, 'markdown.json'));
  console.log('COS static site ready in out/');
}
module.exports = { stageProject };
if (require.main === module) { try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; } }
