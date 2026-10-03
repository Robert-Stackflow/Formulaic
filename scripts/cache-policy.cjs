'use strict';
function cacheControl(key) {
  if (key.includes('/_next/static/') || key.startsWith('_next/static/')) return 'public, max-age=31536000, immutable';
  if (/\.(?:html?|xml|json|txt|mdx|css|js)$/i.test(key) || key.endsWith('/')) return 'public, max-age=0, s-maxage=60, must-revalidate';
  return 'public, max-age=3600, must-revalidate';
}
module.exports = { cacheControl };
