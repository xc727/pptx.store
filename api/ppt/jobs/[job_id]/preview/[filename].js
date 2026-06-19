const { proxy } = require('../../../../_proxy');

module.exports = async function handler(req, res) {
  const jobId = encodeURIComponent(req.query.job_id || '');
  const filename = encodeURIComponent(req.query.filename || '');
  return proxy(req, res, '/api/ppt/jobs/' + jobId + '/preview/' + filename);
};
