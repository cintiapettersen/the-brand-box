const TTL_MS = 10 * 60 * 1000;

function store() {
  if (!globalThis.__brandBoxCreativeDirectorCache) globalThis.__brandBoxCreativeDirectorCache = { ready: new Map(), pending: new Map() };
  return globalThis.__brandBoxCreativeDirectorCache;
}
function clean(now = Date.now()) {
  const s = store();
  for (const [key, entry] of s.ready) if (entry.expiresAt <= now) s.ready.delete(key);
  return s;
}

// One stable journey key owns one successful diagnosis. Failures are deliberately never cached.
export async function getOrCreateCreativeDirector(requestKey, create) {
  if (!requestKey || typeof requestKey !== 'string') return { value: await create(), cache: 'miss' };
  const key = requestKey.slice(0, 180);
  const s = clean();
  const cached = s.ready.get(key);
  if (cached) return { value: cached.value, cache: 'hit' };
  if (s.pending.has(key)) return { value: await s.pending.get(key), cache: 'shared' };
  const promise = Promise.resolve().then(create);
  s.pending.set(key, promise);
  try {
    const value = await promise;
    s.ready.set(key, { value, expiresAt: Date.now() + TTL_MS });
    return { value, cache: 'miss' };
  } finally {
    s.pending.delete(key);
  }
}

// Compatibility guard for the independent refinement, palette-feedback and tagline routes.
export function acquireCreativeDirectorRequest(requestKey) {
  if (!requestKey || typeof requestKey !== 'string') return { ok: true, release: () => {} };
  const key = `legacy:${requestKey.slice(0, 170)}`;
  const s = clean();
  if (s.pending.has(key)) return { ok: false, reason: 'duplicate_in_progress' };
  let released = false;
  s.pending.set(key, new Promise(() => {}));
  return { ok: true, release: () => { if (!released) { released = true; s.pending.delete(key); } } };
}
