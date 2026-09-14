const { proxy, routeValue } = require('../../../_proxy');

module.exports = async function handler(req, res) {
  const jobId = routeValue(req, 'jobId');
  if (!jobId) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Missing job id' }));
    return;
  }
  return proxy(req, res, `/api/ppt/jobs/${encodeURIComponent(jobId)}/outline`, ['jobId']);
};
