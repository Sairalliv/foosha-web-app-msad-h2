// ── Local mock store ──────────────────────────────────────────────
// A tiny localStorage-backed "table" abstraction. Each collection
// (donations, requests, tickets...) is persisted under its own key,
// seeded once from seed.ts on first load.
//
// This exists ONLY so the app has somewhere to read/write data before
// a real database is connected. Nothing outside data/api.ts should
// import this file directly — pages talk to api.ts, which talks to
// this. That's what makes the future DB swap a one-file change.

const STORAGE_PREFIX = "foosha:";

function readCollection<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  if (raw) {
    try {
      return JSON.parse(raw) as T[];
    } catch {
      // fall through to reseed if corrupted
    }
  }
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(seed));
  return seed;
}

function writeCollection<T>(key: string, data: T[]): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

// Simulates real network/DB latency so loading states in the UI are
// exercised even against the mock store — remove once a real backend
// (with its own real latency) is in place.
function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const localStore = {
  get: <T>(key: string, seed: T[]): Promise<T[]> => delay(readCollection(key, seed)),
  set: <T>(key: string, data: T[]): Promise<T[]> => {
    writeCollection(key, data);
    return delay(data);
  },
  reset: (key: string): void => localStorage.removeItem(STORAGE_PREFIX + key),
};
