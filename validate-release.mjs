import { readFileSync } from 'node:fs';

for (const file of ['package.json', 'manifest.webmanifest']) {
  const raw = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
  if (raw.trimStart().startsWith('<')) {
    throw new Error(`${file} zawiera HTML zamiast JSON.`);
  }
  JSON.parse(raw);
}
console.log('JSON validation OK');
