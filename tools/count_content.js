// Zählt Wörter/Karten und Beispielsätze pro Lernpfad
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {}; const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sb = { window: { addEventListener: noop }, document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } }, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, speechSynthesis: undefined, alert: noop, confirm: () => false, console, setTimeout: noop, setInterval: noop, Audio: function () { return { play: noop }; } };
vm.createContext(sb);
vm.runInContext(m[1] + ';if(typeof registerVocabThemes==="function"){try{registerVocabThemes();}catch(e){}};globalThis.X={C:C,GAP:typeof GAP_DATA!=="undefined"?GAP_DATA:{},ST:typeof STORIES!=="undefined"?STORIES:[],DLG:typeof DLG!=="undefined"?DLG:[]};', sb);
const C = sb.X.C;
let words = 0, ctxTotal = 0;
const order = ['alphabet', 'vocabulary', 'vocab_top1', 'vocab_top2', 'vocab_top3', 'vocab_top4', 'vocab_top5', 'vocab_top6', 'vocab_urlaub', 'vocab_beruf', 'vocab_familie', 'vocab_kultur', 'vocab_studium', 'vocab_allgemein', 'numbers', 'colors', 'weekdays', 'grammar', 'grammar_faelle', 'grammar_verben', 'grammar_pronomen', 'grammar_praepositionen', 'listening', 'speaking', 'sentences', 'reading'];
order.forEach(k => { const a = C[k] || []; const ctx = a.reduce((s, x) => s + ((x.ctx || []).length), 0); words += a.length; ctxTotal += ctx; console.log(k.padEnd(24), String(a.length).padStart(4), 'Karten |', String(ctx).padStart(3), 'Beispielsaetze'); });
console.log('--- Alphabet-Lueckensaetze:', Object.keys(sb.X.GAP).length * 4);
console.log('--- STORIES:', sb.X.ST.length, '| DLG:', sb.X.DLG.length);
console.log('=== Karten gesamt:', words, '| ctx-Saetze gesamt:', ctxTotal);
