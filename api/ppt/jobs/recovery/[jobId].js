const { proxy } = require('../../../_proxy');

module.exports = async function handler(req, res) {
  const raw = req.query?.jobId;
  const jobId = Array.isArray(raw) ? raw[0] : raw;
  if (!jobId) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Missing job_id in path' }));
    return;
  }
  return proxy(
    req,
    res,
    `/api/ppt/jobs/${encodeURIComponent(jobId)}/download/recovery-pptx`,
    [],
  );
};
