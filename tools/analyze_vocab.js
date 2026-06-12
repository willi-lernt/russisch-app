// Analysiert Vollständigkeit der Vokabel-Daten (Hauptliste + Themen-Vokabeln)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {};
const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sb = { window: { addEventListener: noop }, document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } }, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, speechSynthesis: undefined, alert: noop, confirm: () => false, console, setTimeout: noop, setInterval: noop, Audio: function () { return { play: noop }; } };
vm.createContext(sb);
vm.runInContext(m[1] + ';globalThis.X={C:C,TV:typeof THEME_VOCAB!=="undefined"?THEME_VOCAB:{}};', sb);
const v = sb.X.C.vocabulary;
console.log('Vokabeln gesamt:', v.length);
console.log('ohne o:', v.filter(x => !x.o).length, '| ohne r:', v.filter(x => !x.r).length, '| ohne ctx:', v.filter(x => !x.ctx || !x.ctx.length).length, '| ohne mn:', v.filter(x => !x.mn).length, '| ohne e:', v.filter(x => !x.e).length);
// Duplikate?
const seen = {}; const dup = [];
v.forEach(x => { if (seen[x.m]) dup.push(x.m); seen[x.m] = 1; });
console.log('Duplikate:', dup.length ? dup.join(', ') : 'keine');
const tv = sb.X.TV;
console.log('--- Themen-Vokabeln:', Object.keys(tv).join(', '));
for (const k in tv) {
  const a = tv[k];
  console.log(' ' + k + ': ' + a.length + ' Karten | ohne o: ' + a.filter(x => !x.o).length + ' | ohne r: ' + a.filter(x => !x.r).length + ' | ohne ctx: ' + a.filter(x => !x.ctx).length + ' | ohne mn: ' + a.filter(x => !x.mn).length);
}
// Beispiel-Theme-Karte
const k1 = Object.keys(tv)[0];
if (k1) console.log('Beispiel ' + k1 + '[0]:', JSON.stringify(tv[k1][0]).substring(0, 220));
