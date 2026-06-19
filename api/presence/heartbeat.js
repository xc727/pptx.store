const { proxy } = require('../_proxy');

module.exports = async function handler(req, res) {
  return proxy(req, res, '/api/presence/heartbeat');
};
