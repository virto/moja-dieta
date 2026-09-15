import { readFileSync } from 'node:fs';

for (const file of ['package.json', 'manifest.webmanifest']) {
  const raw = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
  const normalized = raw.replace(/^\uFEFF/, '').trimStart();
  if (!normalized.startsWith('{')) {
    throw new Error(`${file} nie zaczyna się od { — plik może być HTML-em lub mieć błędny format.`);
  }
  if (/<!doctype|<html/i.test(normalized)) {
    throw new Error(`${file} zawiera HTML zamiast JSON.`);
  }
  JSON.parse(normalized);
}
console.log('JSON validation OK');
