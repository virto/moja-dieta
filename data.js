import { list, put, del } from '@vercel/blob';

const LEGACY_DATA_PATH = 'diet-app/diet-data.json';
const DATA_PREFIX = 'diet-app/data-';
const MAX_STORED_VERSIONS = 50;

const EMPTY_DATA = {
  version: 6,
  updatedAt: null,
  products: [],
  recipes: [],
  dietPlan: [],
  measurements: [],
  shoppingList: [],
  settings: {},
  dayTemplates: [],
  backups: []
};

function validData(value) {
  return value && typeof value === 'object' &&
    Array.isArray(value.products) &&
    Array.isArray(value.recipes) &&
    Array.isArray(value.dietPlan) &&
    Array.isArray(value.measurements) &&
    (value.shoppingList === undefined || Array.isArray(value.shoppingList));
}

function normalizeData(data) {
  if (!validData(data)) return { ...EMPTY_DATA };
  return {
    ...data,
    shoppingList: Array.isArray(data.shoppingList) ? data.shoppingList : [],
    settings: data.settings || {},
    dayTemplates: Array.isArray(data.dayTemplates) ? data.dayTemplates : [],
    backups: Array.isArray(data.backups) ? data.backups : []
  };
}

function newestFirst(a, b) {
  return new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime();
}

async function findLatestDataBlob() {
  const versioned = await list({ prefix: DATA_PREFIX, limit: 1000 });
  const latest = [...versioned.blobs].sort(newestFirst)[0];
  if (latest) return latest;

  // Zgodność z wcześniejszymi wersjami aplikacji.
  const legacy = await list({ prefix: LEGACY_DATA_PATH, limit: 10 });
  return legacy.blobs.find((blob) => blob.pathname === LEGACY_DATA_PATH) || null;
}

async function readData() {
  const blob = await findLatestDataBlob();
  if (!blob) return { ...EMPTY_DATA };

  // Każda nowa wersja ma unikalny URL, dlatego nie otrzymujemy starej
  // zawartości z cache po zapisie.
  const response = await fetch(blob.downloadUrl || blob.url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Nie udało się odczytać pliku JSON.');
  return normalizeData(await response.json());
}

async function removeOldVersions() {
  try {
    const result = await list({ prefix: DATA_PREFIX, limit: 1000 });
    const old = [...result.blobs].sort(newestFirst).slice(MAX_STORED_VERSIONS);
    if (old.length) await del(old.map((blob) => blob.url));
  } catch (error) {
    // Czyszczenie archiwalnych wersji nie może blokować właściwego zapisu.
    console.warn('Nie udało się usunąć starych wersji danych:', error);
  }
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    if (request.method === 'GET') {
      return response.status(200).json(await readData());
    }

    if (request.method === 'PUT' || request.method === 'POST') {
      const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
      if (!validData(body)) {
        return response.status(400).json({ error: 'Nieprawidłowa struktura danych.' });
      }

      const current = await readData();
      if (
        body.expectedUpdatedAt &&
        current.updatedAt &&
        body.expectedUpdatedAt !== current.updatedAt
      ) {
        return response.status(409).json({
          error: 'Dane zostały zmienione na innym urządzeniu.',
          currentUpdatedAt: current.updatedAt
        });
      }

      const updatedAt = new Date().toISOString();
      const saved = {
        version: Number(body.version) || 6,
        updatedAt,
        products: body.products,
        recipes: body.recipes,
        dietPlan: body.dietPlan,
        measurements: body.measurements,
        shoppingList: Array.isArray(body.shoppingList) ? body.shoppingList : [],
        settings: body.settings || {},
        dayTemplates: Array.isArray(body.dayTemplates) ? body.dayTemplates : [],
        backups: Array.isArray(body.backups) ? body.backups.slice(0, 5) : []
      };

      const safeTimestamp = updatedAt.replace(/[:.]/g, '-');
      const pathname = `${DATA_PREFIX}${safeTimestamp}-${crypto.randomUUID()}.json`;

      await put(pathname, JSON.stringify(saved, null, 2), {
        access: 'public',
        contentType: 'application/json; charset=utf-8',
        addRandomSuffix: false,
        cacheControlMaxAge: 60
      });

      // Nie czekamy na czyszczenie starych plików, aby zapis był szybki.
      void removeOldVersions();

      return response.status(200).json(saved);
    }

    response.setHeader('Allow', 'GET, PUT, POST');
    return response.status(405).json({ error: 'Niedozwolona metoda.' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message || 'Błąd zapisu danych.' });
  }
}
