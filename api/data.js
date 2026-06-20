import { list, put } from '@vercel/blob';

const DATA_PATH = 'diet-app/diet-data.json';

const EMPTY_DATA = {
  version: 2,
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

async function findDataBlob() {
  const result = await list({ prefix: DATA_PATH, limit: 10 });
  return result.blobs.find((blob) => blob.pathname === DATA_PATH) || null;
}

async function readData() {
  const blob = await findDataBlob();
  if (!blob) return EMPTY_DATA;

  const response = await fetch(blob.downloadUrl || blob.url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Nie udało się odczytać pliku JSON.');
  const data = await response.json();
  if (!validData(data)) return EMPTY_DATA;
  return { ...data, shoppingList: Array.isArray(data.shoppingList) ? data.shoppingList : [], settings: data.settings || {}, dayTemplates: Array.isArray(data.dayTemplates)?data.dayTemplates:[], backups:Array.isArray(data.backups)?data.backups:[] };
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

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
      if (body.expectedUpdatedAt && current.updatedAt && body.expectedUpdatedAt !== current.updatedAt) return response.status(409).json({ error: 'Dane zostały zmienione na innym urządzeniu.' });
      const saved = {
        version: Number(body.version) || 1,
        updatedAt: new Date().toISOString(),
        products: body.products,
        recipes: body.recipes,
        dietPlan: body.dietPlan,
        measurements: body.measurements,
        shoppingList: Array.isArray(body.shoppingList) ? body.shoppingList : [],
        settings: body.settings || {},
        dayTemplates: Array.isArray(body.dayTemplates)?body.dayTemplates:[],
        backups: Array.isArray(body.backups)?body.backups.slice(0,5):[]
      };

      await put(DATA_PATH, JSON.stringify(saved, null, 2), {
        access: 'public',
        contentType: 'application/json; charset=utf-8',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 60
      });

      return response.status(200).json(saved);
    }

    response.setHeader('Allow', 'GET, PUT, POST');
    return response.status(405).json({ error: 'Niedozwolona metoda.' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message || 'Błąd zapisu danych.' });
  }
}
