const { proxy } = require('../_proxy');

module.exports = async function handler(req, res) {
  const expected = process.env.PPT_ADMIN_KEY;
  const provided = req.headers['x-admin-key'] || '';

  if (!expected) {
    res.statusCode = 503;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'PPT_ADMIN_KEY is not configured on Vercel.' }));
    return;
  }

  if (provided !== expected) {
    res.statusCode = 401;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Invalid admin key.' }));
    return;
  }

  return proxy(req, res, '/api/admin/usage');
};
