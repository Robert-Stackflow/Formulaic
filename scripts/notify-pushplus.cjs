'use strict';

const targets = {
  COS: 'https://formulaic.cloudchewie.com',
  Vercel: 'https://v.formulaic.cloudchewie.com',
};
const statuses = { success: '成功', failure: '失败', cancelled: '已取消' };

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function createNotification(env, now = new Date()) {
  const target = env.FORMULAIC_DEPLOY_TARGET;
  if (!Object.hasOwn(targets, target)) throw new Error('Unknown deployment target');
  const status = statuses[env.FORMULAIC_DEPLOY_STATUS] || '状态未知';
  const repositoryUrl = `${(env.GITHUB_SERVER_URL || 'https://github.com').replace(/\/$/, '')}/${env.GITHUB_REPOSITORY}`;
  const runUrl = `${repositoryUrl}/actions/runs/${env.GITHUB_RUN_ID}`;
  const commitUrl = `${repositoryUrl}/commit/${env.GITHUB_SHA}`;
  const finishedAt = now.toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' });
  const row = (label, value) => `<tr><td>${label}</td><td>${escapeHtml(value)}</td></tr>`;

  return {
    token: env.PUSHPLUS_TOKEN.trim(),
    title: `Formulaic · ${target} 部署${status}`,
    template: 'html',
    content: `<h3>Formulaic · ${target} 部署${status}</h3>` +
      '<table border="1" cellpadding="6" cellspacing="0">' +
      row('仓库', env.GITHUB_REPOSITORY) +
      row('Workflow', env.GITHUB_WORKFLOW) +
      row('Job', env.GITHUB_JOB) +
      row('分支', env.GITHUB_REF_NAME) +
      row('触发者', env.GITHUB_ACTOR) +
      row('运行次数', env.GITHUB_RUN_ATTEMPT || '1') +
      row('完成时间（北京时间）', finishedAt) +
      `<tr><td>提交</td><td><a href="${escapeHtml(commitUrl)}">${escapeHtml((env.GITHUB_SHA || '').slice(0, 7))}</a></td></tr>` +
      `<tr><td>日志</td><td><a href="${escapeHtml(runUrl)}">查看 GitHub Actions 日志</a></td></tr>` +
      `<tr><td>站点</td><td><a href="${targets[target]}">${targets[target]}</a></td></tr>` +
      '</table>',
  };
}

async function sendNotification(env = process.env, options = {}) {
  const fetchRequest = options.fetch || globalThis.fetch;
  const log = options.log || console.log;
  const warn = options.warn || console.warn;
  if (!env.PUSHPLUS_TOKEN?.trim()) {
    log('PUSHPLUS_TOKEN is not configured; skipping deployment notification.');
    return false;
  }

  try {
    const response = await fetchRequest('https://www.pushplus.plus/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createNotification(env)),
      signal: AbortSignal.timeout(15000),
      redirect: 'error',
    });
    if (!response.ok) {
      warn(`::warning::PushPlus request failed (HTTP ${response.status}); deployment result is unchanged.`);
      return false;
    }
    const result = await response.json();
    if (result.code !== 200) {
      const code = Number.isFinite(Number(result.code)) ? Number(result.code) : 'unknown';
      warn(`::warning::PushPlus rejected the notification (code ${code}); deployment result is unchanged.`);
      return false;
    }
    log('PushPlus accepted the deployment notification.');
    return true;
  } catch {
    // Provider responses and network errors may contain credentials; never log them.
    warn('::warning::PushPlus notification could not be confirmed; deployment result is unchanged.');
    return false;
  }
}

module.exports = { createNotification, sendNotification };
if (require.main === module) sendNotification();
