const BACKEND_URL = 'https://api.pptx.store';
const SERVICE_KEY = process.env.PPT_SERVICE_API_KEY;

function targetUrl(path, query = '') {
  if (!BACKEND_URL) {
    throw new Error('PPT_BACKEND_URL is not configured');
  }
  return BACKEND_URL.replace(/\/$/, '') + path + (query || '');
}

function copyHeaders(req) {
  const headers = {};
  for (const [key, value] of Object.entries(req.headers || {})) {
    const lower = key.toLowerCase();
    if (['host', 'connection', 'content-length'].includes(lower)) continue;
    headers[key] = value;
  }
  if (SERVICE_KEY) headers['x-ppt-service-key'] = SERVICE_KEY;
  return headers;
}

async function proxy(req, res, path) {
  let upstream;
  try {
    const hasBody = !['GET', 'HEAD'].includes(req.method || 'GET');
    upstream = await fetch(targetUrl(path, req.url.includes('?') ? '?' + req.url.split('?')[1] : ''), {
      method: req.method,
      headers: copyHeaders(req),
      body: hasBody ? req : undefined,
      duplex: hasBody ? 'half' : undefined,
    });
  } catch (error) {
    res.statusCode = 502;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: String(error.message || error) }));
    return;
  }

  res.statusCode = upstream.status;
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'content-encoding') return;
    res.setHeader(key, value);
  });
  const buffer = Buffer.from(await upstream.arrayBuffer());
  res.end(buffer);
}

module.exports = { proxy };
