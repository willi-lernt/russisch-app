const fs = require('fs'); const path = require('path'); const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {}; const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sb = { window: { addEventListener: noop }, document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } }, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, speechSynthesis: undefined, alert: noop, confirm: () => false, console, setTimeout: noop, setInterval: noop, Audio: function () { return { play: noop }; } };
vm.createContext(sb);
vm.runInContext(m[1] + ';globalThis.X=C;', sb);
['grammar', 'grammar_faelle', 'grammar_verben', 'grammar_pronomen', 'grammar_praepositionen'].forEach(function (k) {
  console.log('\n===== ' + k + ' (' + (sb.X[k] || []).length + ') =====');
  (sb.X[k] || []).forEach(function (x, i) {
    console.log(i + ' | m="' + x.m + '" | t="' + x.t + '" | s="' + (x.s || '') + '" | e="' + (x.e || '') + '" | x="' + (x.x || '') + '" | mn=' + (x.mn ? 'ja' : '-') + ' | ctx=' + ((x.ctx || []).length) + ' | o=' + (x.o ? x.o.length : 0));
  });
});
