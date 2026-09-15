import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

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

const appUrl = new URL('./app.js', import.meta.url);
const app = readFileSync(appUrl, 'utf8');
if (/<!doctype|<html/i.test(app.slice(0, 500))) {
  throw new Error('app.js zawiera HTML zamiast JavaScriptu.');
}
for (const required of ['renderDashboard','renderProducts','renderRecipes','renderPlan','renderShopping','renderMeasurements','renderSettings','openModal','closeModal','load']) {
  if (!new RegExp(`\\bfunction\\s+${required}\\s*\\(`).test(app)) {
    throw new Error(`Brakuje wymaganej funkcji ${required}() w app.js.`);
  }
}
execFileSync(process.execPath, ['--check', appUrl.pathname], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', new URL('./api/data.js', import.meta.url).pathname], { stdio: 'inherit' });

console.log('Release validation OK');
