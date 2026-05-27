// ── IndexedDB: Pokémon cache ──────────────────────────────────────────────

const DB_NAME = 'pokedraft';
const DB_VERSION = 1;
let db;

async function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains('pokemon')) {
        database.createObjectStore('pokemon', { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => { db = e.target.result; resolve(db); };
    req.onerror = () => reject(req.error);
  });
}

async function getCachedPokemon(id) {
  return new Promise((resolve) => {
    const req = db.transaction('pokemon', 'readonly')
                  .objectStore('pokemon').get(id);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => resolve(null);
  });
}

async function putCachedPokemon(pokemon) {
  return new Promise((resolve) => {
    const tx = db.transaction('pokemon', 'readwrite');
    tx.objectStore('pokemon').put(pokemon);
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });
}

async function countCachedPokemon() {
  return new Promise((resolve) => {
    const req = db.transaction('pokemon', 'readonly')
                  .objectStore('pokemon').count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
}

// ── localStorage: season state ────────────────────────────────────────────

const SEASON_KEY = 'pokedraft_season';

function saveSeason(state) {
  try {
    localStorage.setItem(SEASON_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Season save failed:', e);
  }
}

function loadSeason() {
  try {
    const raw = localStorage.getItem(SEASON_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearSeason() {
  localStorage.removeItem(SEASON_KEY);
}
