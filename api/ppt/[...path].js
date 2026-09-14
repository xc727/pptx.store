const { proxy, requestPathParts } = require('../_proxy');

// Keep a top-level catch-all for Vercel deployments.  Some deployments do
// not route requests reliably to the nested jobs/[...all] function, while
// the public API still uses /api/ppt/jobs/:jobId/... URLs.
module.exports = async function handler(req, res) {
  const parts = requestPathParts(req, ['path', '...path'], '/api/ppt');
  if (!parts.length) {
    res.statusCode = 404;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Missing API path' }));
    return;
  }
  return proxy(req, res, '/api/ppt/' + parts.map((part) => encodeURIComponent(part)).join('/'));
};
