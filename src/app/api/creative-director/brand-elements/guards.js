const TTL_MS = 60 * 60 * 1000;
function store() {
  if (!globalThis.__brandBoxBrandElements) globalThis.__brandBoxBrandElements = { ready: new Map(), pending: new Map(), completedJourneys: new Set() };
  return globalThis.__brandBoxBrandElements;
}
function clean() {
  const state = store();
  const now = Date.now();
  for (const [key, entry] of state.ready) if (entry.expiresAt <= now) state.ready.delete(key);
  return state;
}
export function pilotEnabled() { return process.env.BRAND_ELEMENTS_PILOT_ENABLED === 'true'; }
export async function cachedBrandElementRequest(key, create) {
  const state = clean();
  if (state.ready.has(key)) return { value: state.ready.get(key).value, cache: 'hit' };
  if (state.pending.has(key)) return { value: await state.pending.get(key), cache: 'shared' };
  const promise = Promise.resolve().then(create);
  state.pending.set(key, promise);
  try {
    const value = await promise;
    state.ready.set(key, { value, expiresAt: Date.now() + TTL_MS });
    return { value, cache: 'miss' };
  } finally { state.pending.delete(key); }
}
export function hasCompletedGeneration(journeyId) { return clean().completedJourneys.has(journeyId); }
export function markCompletedGeneration(journeyId) { clean().completedJourneys.add(journeyId); }
