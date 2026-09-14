const { catchAllParts, proxy } = require('../_proxy');

module.exports = async function handler(req, res) {
  const parts = catchAllParts(req);
  return proxy(req, res, '/api/billing/' + parts.map(encodeURIComponent).join('/'));
};
