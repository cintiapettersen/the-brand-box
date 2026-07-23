const LOCK_TTL_MS = 60 * 1000;
const COMPLETED_TTL_MS = 10 * 60 * 1000;

function getStores() {
  if (!globalThis.__brandBoxCreativeDirectorGuards) {
    globalThis.__brandBoxCreativeDirectorGuards = {
      locks: new Map(),
      completed: new Map(),
      results: new Map()
    };
  }
  return globalThis.__brandBoxCreativeDirectorGuards;
}

function cleanup(store, now) {
  for (const [key, expiresAt] of store.locks.entries()) {
    if (expiresAt <= now) store.locks.delete(key);
  }
  for (const [key, expiresAt] of store.completed.entries()) {
    if (expiresAt <= now) {
      store.completed.delete(key);
      store.results.delete(key);
    }
  }
}

export function acquireCreativeDirectorRequest(requestKey) {
  if (!requestKey || typeof requestKey !== 'string') {
    return { ok: true, release: () => {} };
  }

  const normalizedKey = requestKey.slice(0, 180);
  const store = getStores();
  const now = Date.now();
  cleanup(store, now);

  if (store.locks.has(normalizedKey)) {
    return { ok: false, reason: 'duplicate_in_progress' };
  }

  if (store.completed.has(normalizedKey)) {
    return { ok: false, reason: 'request_already_completed' };
  }

  store.locks.set(normalizedKey, now + LOCK_TTL_MS);

  return {
    ok: true,
    release: ({ completed = false } = {}) => {
      store.locks.delete(normalizedKey);
      if (completed) {
        store.completed.set(normalizedKey, Date.now() + COMPLETED_TTL_MS);
      }
    }
  };
}

export function getCreativeDirectorResult(requestKey) {
  if (!requestKey || typeof requestKey !== 'string') return null;
  const store = getStores();
  cleanup(store, Date.now());
  return store.results.get(requestKey.slice(0, 180)) || null;
}

export function storeCreativeDirectorResult(requestKey, result) {
  if (!requestKey || typeof requestKey !== 'string' || !result) return;
  const normalizedKey = requestKey.slice(0, 180);
  const store = getStores();
  store.results.set(normalizedKey, result);
  store.completed.set(normalizedKey, Date.now() + COMPLETED_TTL_MS);
}
