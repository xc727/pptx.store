const { proxy } = require('../../../_proxy');

// Rewritten from /jobs/:jobId/slides/1/source. See the adjacent download
// route: explicit static route segments avoid Vercel's nested catch-all gap.
module.exports = async function handler(req, res) {
  const raw = req.query?.jobId;
  const jobId = Array.isArray(raw) ? raw[0] : raw;
  if (!jobId) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Missing job_id in path' }));
    return;
  }
  return proxy(req, res, `/api/ppt/jobs/${encodeURIComponent(jobId)}/slides/1/source`, []);
};
