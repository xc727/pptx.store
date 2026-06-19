const { proxy } = require('../_proxy');

module.exports = async function handler(req, res) {
  const parts = Array.isArray(req.query.path) ? req.query.path : [];
  return proxy(req, res, '/api/ppt/' + parts.map(encodeURIComponent).join('/'));
};
