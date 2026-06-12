// Fügt die Top-500-Wörter aus tools/top500.json als Sektionen vocab_top1..N in C ein.
// Validiert jede Zeile, entfernt Duplikate (intern und gegen bestehende Sektionen).
// Idempotent: ersetzt bei erneutem Lauf den alten Block (Marker-Kommentare).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Bestehende Wörter sammeln (für Dedupe) — Sandbox-Auswertung von C + THEME_VOCAB
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {};
const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sb = { window: { addEventListener: noop }, document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } }, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, speechSynthesis: undefined, alert: noop, confirm: () => false, console, setTimeout: noop, setInterval: noop, Audio: function () { return { play: noop }; } };
vm.createContext(sb);
vm.runInContext(m[1] + ';globalThis.X={C:C,TV:typeof THEME_VOCAB!=="undefined"?THEME_VOCAB:{}};', sb);
const existing = new Set();
for (const k in sb.X.C) {
  if (k.startsWith('vocab_top')) continue; // eigener Block zählt nicht
  (sb.X.C[k] || []).forEach(it => { if (it.m) existing.add(it.m.toLowerCase().trim()); });
}
for (const k in sb.X.TV) sb.X.TV[k].forEach(it => { if (it.m) existing.add(it.m.toLowerCase().trim()); });

// Wörter laden und validieren
const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'top500.json'), 'utf8'));
const seen = new Set();
const words = [];
const verworfen = [];
raw.forEach(w => {
  if (!Array.isArray(w) || w.length < 3 || !w[0] || !w[1] || !/[а-яёА-ЯЁ]/.test(w[0])) { verworfen.push(JSON.stringify(w)); return; }
  const key = w[0].toLowerCase().trim();
  if (seen.has(key)) { verworfen.push(w[0] + ' (doppelt in Liste)'); return; }
  if (existing.has(key)) { verworfen.push(w[0] + ' (existiert schon)'); return; }
  seen.add(key);
  words.push({ m: w[0].trim(), t: w[1].trim(), e: w[2].trim() });
});

// In 100er-Pakete teilen
const packs = [];
for (let i = 0; i < words.length; i += 100) packs.push(words.slice(i, i + 100));

let block = '// __TOP500_START__ (generiert von tools/inject_top500.js)\n';
packs.forEach((pack, pi) => {
  const von = pi * 100 + 1, bis = pi * 100 + pack.length;
  const lbl = 'Top ' + von + '–' + bis;
  block += 'vocab_top' + (pi + 1) + ':[\n';
  block += pack.map(w => '  ' + JSON.stringify({ m: w.m, t: w.t, s: lbl, e: w.e })).join(',\n');
  block += '\n],\n';
});
block += '// __TOP500_END__\n';

// Alten Block entfernen, falls vorhanden
html = html.replace(/\/\/ __TOP500_START__[\s\S]*?\/\/ __TOP500_END__\n/, '');
// Vor grammar:[ einfügen (innerhalb von const C)
const anchor = html.indexOf('grammar:[');
if (anchor < 0) { console.error('Anker grammar:[ nicht gefunden'); process.exit(1); }
html = html.substring(0, anchor) + block + html.substring(anchor);
fs.writeFileSync(file, html, 'utf8');

console.log(words.length + ' Wörter eingefügt in ' + packs.length + ' Pakete.');
if (verworfen.length) console.log('Verworfen (' + verworfen.length + '): ' + verworfen.join(', '));
