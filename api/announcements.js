const { proxy } = require('./_proxy');

// Public read-only announcements endpoint. Publishing remains available only
// through the local FastAPI administrator route at /api/admin/announcements.
module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('allow', 'GET, HEAD');
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ detail: 'Method Not Allowed' }));
    return;
  }
  return proxy(req, res, '/api/announcements');
};
