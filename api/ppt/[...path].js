const { proxy } = require('../_proxy');

module.exports = async function handler(req, res) {
  const rawUrl = req.url || '';
  const pathname = rawUrl.split('?')[0] || '';
  const suffix = pathname.replace(/^\/api\/ppt\/?/, '');
  return proxy(req, res, '/api/ppt/' + suffix);
};
