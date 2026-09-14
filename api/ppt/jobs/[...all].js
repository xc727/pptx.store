const { proxy, requestPathParts } = require('../../_proxy');

function getAllParts(req) {
  return requestPathParts(req, ['all', '...all'], '/api/ppt/jobs');
}

module.exports = async function handler(req, res) {
  const all = getAllParts(req);
  if (!all.length) {
    res.statusCode = 404;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Missing job_id in path' }));
    return;
  }
  const jobId = all[0];
  const rest = all.slice(1);
  const segments = ['/api/ppt/jobs', encodeURIComponent(jobId)];
  rest.forEach((part) => segments.push(encodeURIComponent(part)));
  const path = segments.join('/');
  return proxy(req, res, path, []);
};
