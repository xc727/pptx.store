const { proxy } = require('../../_proxy');

// Vercel's nested catch-all route is not consistently selected for this
// multi-segment endpoint.  Keep an explicit bridge for the workbench
// preflight so public clients receive the backend's recovery instruction
// rather than Vercel's generic 404 page.
module.exports = async function handler(req, res) {
  return proxy(req, res, '/api/ppt/readiness/editable');
};
