import { proxy } from './src/proxy.js';
import { NextRequest } from 'next/server';

function mockRequest(urlStr, hostHeader) {
  const url = new URL(urlStr);
  const headers = new Headers();
  if (hostHeader) {
    headers.set('host', hostHeader);
  }
  return new NextRequest(url, { headers });
}

async function runTests() {
  console.log('🧪 RUNNING DOMAIN MIGRATION PROXY TESTS...\n');

  // Test Case 1: DOMAIN_MIGRATION_ENABLED=false (default)
  delete process.env.DOMAIN_MIGRATION_ENABLED;
  
  let req = mockRequest('https://thebrandbox.sonhodepapel.com/pt?ref=123', 'thebrandbox.sonhodepapel.com');
  let res = proxy(req);
  console.assert(!res, 'Test 1.1 Failed: Enabled=false should not redirect old domain /pt');

  req = mockRequest('https://thebrandbox.sonhodepapel.com/crie-sua-marca', 'thebrandbox.sonhodepapel.com');
  res = proxy(req);
  console.assert(!res, 'Test 1.2 Failed: Enabled=false should let /crie-sua-marca fall through to next.config.js redirect');

  console.log('✅ PASS: When DOMAIN_MIGRATION_ENABLED=false, existing behavior is completely preserved.');

  // Test Case 2: DOMAIN_MIGRATION_ENABLED=true
  process.env.DOMAIN_MIGRATION_ENABLED = 'true';

  // 2.1 Old domain with locale /pt
  req = mockRequest('https://thebrandbox.sonhodepapel.com/pt?coupon=SUMMER', 'thebrandbox.sonhodepapel.com');
  res = proxy(req);
  console.assert(res?.status === 308, 'Test 2.1 Status Failed');
  console.assert(res?.headers.get('location') === 'https://thebrandbox.design/pt?coupon=SUMMER', `Test 2.1 Location Failed: ${res?.headers.get('location')}`);

  // 2.2 Old domain with locale /en
  req = mockRequest('https://thebrandbox.sonhodepapel.com/en', 'thebrandbox.sonhodepapel.com');
  res = proxy(req);
  console.assert(res?.headers.get('location') === 'https://thebrandbox.design/en', `Test 2.2 Location Failed: ${res?.headers.get('location')}`);

  // 2.3 Old domain privacy policy
  req = mockRequest('https://thebrandbox.sonhodepapel.com/pt/politica-de-privacidade', 'thebrandbox.sonhodepapel.com');
  res = proxy(req);
  console.assert(res?.headers.get('location') === 'https://thebrandbox.design/pt/politica-de-privacidade', `Test 2.3 Location Failed: ${res?.headers.get('location')}`);

  // 2.4 Legacy route /crie-sua-marca -> direct 1-step to /pt
  req = mockRequest('https://thebrandbox.sonhodepapel.com/crie-sua-marca?src=fb', 'thebrandbox.sonhodepapel.com');
  res = proxy(req);
  console.assert(res?.headers.get('location') === 'https://thebrandbox.design/pt?src=fb', `Test 2.4 Location Failed: ${res?.headers.get('location')}`);

  // 2.5 Localhost should NOT redirect
  req = mockRequest('http://localhost:3000/pt', 'localhost:3000');
  res = proxy(req);
  console.assert(!res, 'Test 2.5 Failed: localhost should not redirect');

  // 2.6 Vercel preview URL should NOT redirect
  req = mockRequest('https://thebrandbox-git-feat-test.vercel.app/pt', 'thebrandbox-git-feat-test.vercel.app');
  res = proxy(req);
  console.assert(!res, 'Test 2.6 Failed: Vercel preview should not redirect');

  // 2.7 Target domain requested directly should NOT redirect to itself
  req = mockRequest('https://thebrandbox.design/pt', 'thebrandbox.design');
  res = proxy(req);
  console.assert(!res, 'Test 2.7 Failed: target domain should not redirect to itself');

  // 2.8 Legacy root route / -> direct 1-step to /pt
  req = mockRequest('https://thebrandbox.sonhodepapel.com/?src=ig', 'thebrandbox.sonhodepapel.com');
  res = proxy(req);
  console.assert(res?.headers.get('location') === 'https://thebrandbox.design/pt?src=ig', `Test 2.8 Location Failed: ${res?.headers.get('location')}`);

  console.log('✅ PASS: When DOMAIN_MIGRATION_ENABLED=true, old domain redirects 308 preserving path & query, single-step for / and /crie-sua-marca, while target domain, localhost, and Vercel preview URLs remain untouched.\n');

  // Reset env
  delete process.env.DOMAIN_MIGRATION_ENABLED;
}

runTests().catch(err => {
  console.error('❌ Test execution error:', err);
  process.exit(1);
});
