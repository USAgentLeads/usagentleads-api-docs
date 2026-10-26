const ORIGIN = 'usagentleads.mintlify.site';
const DOMAIN = 'www.usagentleads.com';
export function isDocsPath(path) {
  return path === '/docs' || path.startsWith('/docs/') || path.startsWith('/mintlify-assets/') || path.startsWith('/_mintlify/');
}
export async function handle(request, upstream = fetch) {
  const url = new URL(request.url);
  if (!isDocsPath(url.pathname)) return upstream(request);
  url.hostname = ORIGIN;
  url.protocol = 'https:';
  url.port = '';
  const headers = new Headers(request.headers);
  // Documentation is public. Never forward application sessions or API credentials.
  headers.delete('cookie');
  headers.delete('authorization');
  headers.delete('x-api-key');
  headers.set('Host', ORIGIN);
  headers.set('X-Forwarded-Host', DOMAIN);
  headers.set('X-Forwarded-Proto', 'https');
  const proxy = new Request(url, { method: request.method, headers, body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body, redirect: 'manual', duplex: 'half' });
  try {
    const result = await upstream(proxy);
    const response = new Response(result.body, result);
    response.headers.delete('set-cookie');
    const location = response.headers.get('location');
    if (location) {
      const target = new URL(location, url);
      if (target.hostname === ORIGIN) {
        target.hostname = DOMAIN;
        response.headers.set('location', target.href);
      }
    }
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  } catch {
    return new Response('Documentation is temporarily unavailable. Please retry.', { status: 502, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}
export default { fetch(request) { return handle(request); } };
