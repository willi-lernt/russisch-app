// Extrahiert alle gesprochenen russischen Texte aus index.html → tools/texts.json
// Aufruf: node tools/extract_texts.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('Kein Script-Block gefunden!'); process.exit(1); }

// Minimale Browser-Stubs, damit der App-Code im Sandbox-Kontext lädt
const noop = () => {};
const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sandbox = {
  window: { addEventListener: noop },
  document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } },
  navigator: { onLine: true },
  localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  speechSynthesis: undefined,
  alert: noop, confirm: () => false, console,
  setTimeout: noop, setInterval: noop, Audio: function(){ return { play: noop }; },
};
sandbox.window.speechSynthesis = undefined;
vm.createContext(sandbox);
// const/let im Script werden nicht global — Daten am Ende explizit exportieren
const exportCode = ';globalThis.__EXPORT={C:typeof C!=="undefined"?C:{},GAP_DATA:typeof GAP_DATA!=="undefined"?GAP_DATA:{},STORIES:typeof STORIES!=="undefined"?STORIES:[],DLG:typeof DLG!=="undefined"?DLG:[],THEME_VOCAB:typeof THEME_VOCAB!=="undefined"?THEME_VOCAB:{},READ_WORDS:typeof READ_WORDS!=="undefined"?READ_WORDS:[]};';
vm.runInContext(m[1] + exportCode, sandbox);
const X = sandbox.__EXPORT || {};

const texts = new Set();
const C = X.C || {};
for (const sec in C) (C[sec] || []).forEach(it => { if (it.m) texts.add(it.m.trim()); });
const GAP = X.GAP_DATA || {};
for (const l in GAP) ['s1', 's2', 's3', 's4'].forEach(k => { if (GAP[l][k] && GAP[l][k].full) texts.add(GAP[l][k].full.trim()); });
(X.STORIES || []).forEach(st => texts.add(st.text.map(p => p.ru).join('').trim()));
(X.DLG || []).forEach(d => { if (d.ai) texts.add(d.ai.trim()); });
const TV = X.THEME_VOCAB || {};
for (const t in TV) TV[t].forEach(it => { if (it.m) texts.add(it.m.trim()); });
(X.READ_WORDS || []).forEach(w => { if (w.w) texts.add(w.w.trim()); });

const arr = [...texts].filter(t => t.length > 0);
fs.writeFileSync(path.join(__dirname, 'texts.json'), JSON.stringify(arr, null, 1), 'utf8');
console.log(arr.length + ' Texte extrahiert → tools/texts.json');
