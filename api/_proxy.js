const BACKEND_URL = process.env.PPT_BACKEND_URL;
const SERVICE_KEY = process.env.PPT_SERVICE_API_KEY;

function targetUrl(path, query = '') {
  if (!BACKEND_URL) {
    throw new Error('PPT_BACKEND_URL is not configured');
  }
  return BACKEND_URL.replace(/\/$/, '') + path + (query || '');
}

function catchAllParts(req) {
  const query = req.query || {};
  const raw = query.path ?? query['...path'];
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return values
    .flatMap((value) => String(value).split('/'))
    .filter(Boolean)
    .map((value) => {
      try {
        return decodeURIComponent(value);
      } catch (_error) {
        return value;
      }
    });
}

function requestPathParts(req, queryKeys, prefix) {
  const query = req.query || {};
  for (const key of queryKeys) {
    const raw = query[key];
    const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const parts = values
      .flatMap((value) => String(value).split('/'))
      .filter(Boolean)
      .map((value) => {
        try { return decodeURIComponent(value); } catch (_error) { return value; }
      });
    if (parts.length) return parts;
  }

  // Vercel occasionally invokes a catch-all function without populating its
  // wildcard query parameter.  req.url still contains the requested path, so
  // recover it instead of returning the misleading "Missing API path" error.
  const pathname = new URL(req.url || '/', 'http://proxy.local').pathname;
  const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
  if (!pathname.startsWith(normalizedPrefix)) return [];
  return pathname
    .slice(normalizedPrefix.length)
    .split('/')
    .filter(Boolean)
    .map((value) => {
      try { return decodeURIComponent(value); } catch (_error) { return value; }
    });
}

function routeValue(req, name) {
  const raw = (req.query || {})[name];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value == null ? '' : String(value);
}

function upstreamQuery(req, ignoredKeys = []) {
  const url = new URL(req.url || '/', 'http://proxy.local');
  url.searchParams.delete('path');
  url.searchParams.delete('...path');
  for (const key of ignoredKeys) url.searchParams.delete(key);
  const query = url.searchParams.toString();
  return query ? `?${query}` : '';
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

async function proxy(req, res, path, ignoredQueryKeys = []) {
  let upstream;
  try {
    const hasBody = !['GET', 'HEAD'].includes(req.method || 'GET');
    upstream = await fetch(targetUrl(path, upstreamQuery(req, ignoredQueryKeys)), {
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
    if (['content-encoding', 'set-cookie'].includes(key.toLowerCase())) return;
    res.setHeader(key, value);
  });
  // Login responses set an HTTP-only session cookie. Node's fetch exposes it
  // as an array on modern runtimes; keep a backward-compatible fallback.
  const setCookies = typeof upstream.headers.getSetCookie === 'function'
    ? upstream.headers.getSetCookie()
    : upstream.headers.get('set-cookie') ? [upstream.headers.get('set-cookie')] : [];
  if (setCookies.length) res.setHeader('set-cookie', setCookies);
  const buffer = Buffer.from(await upstream.arrayBuffer());
  res.end(buffer);
}

module.exports = { catchAllParts, proxy, requestPathParts, routeValue, upstreamQuery };
