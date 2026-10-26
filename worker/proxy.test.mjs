import test from 'node:test';
import assert from 'node:assert/strict';
import { handle, isDocsPath } from './index.mjs';
test('scopes routing to docs and required Mintlify assets', () => {
  for (const path of ['/docs', '/docs/quickstart', '/_mintlify/search', '/mintlify-assets/a.css']) assert(isDocsPath(path));
  for (const path of ['/', '/dashboard', '/api/checkout', '/docs-other', '/.well-known/acme-challenge/a']) assert(!isDocsPath(path));
});
test('strips website credentials and rewrites upstream redirects', async () => {
  const result = await handle(new Request('https://www.usagentleads.com/docs?q=a', { headers: { Cookie: 'session=private', Authorization: 'Bearer private', 'X-Api-Key': 'private' } }), async request => {
    assert.equal(request.url, 'https://usagentleads.mintlify.site/docs?q=a');
    for (const header of ['cookie', 'authorization', 'x-api-key']) assert.equal(request.headers.get(header), null);
    assert.equal(request.headers.get('x-forwarded-host'), 'www.usagentleads.com');
    return new Response(null, { status: 307, headers: { location: 'https://usagentleads.mintlify.site/docs/quickstart', 'set-cookie': 'foreign=1' } });
  });
  assert.equal(result.status, 307);
  assert.equal(result.headers.get('location'), 'https://www.usagentleads.com/docs/quickstart');
  assert.equal(result.headers.get('set-cookie'), null);
});
test('passes main site untouched and fails closed on docs outage', async () => {
  const req = new Request('https://www.usagentleads.com/dashboard');
  await handle(req, async r => { assert.equal(r, req); return new Response('main'); });
  const response = await handle(new Request('https://www.usagentleads.com/docs'), async () => { throw Error('offline'); });
  assert.equal(response.status, 502);
});
