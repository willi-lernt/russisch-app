// Sortiert C.alphabet in index.html in didaktische Lern-Reihenfolge um:
// 1. Wie im Deutschen (Form+Klang) → 2. Falsche Freunde → 3. Neue Formen → 4. Besonderheiten
// Aufruf: node tools/reorder_alphabet.js
const fs = require('fs');
const path = require('path');

const ORDER = [
  // Gruppe 1: sehen aus und klingen wie im Deutschen
  'А','К','М','О','Т','Е',
  // Gruppe 2: falsche Freunde — vertraute Form, anderer Klang
  'В','Н','Р','С','У','Х',
  // Gruppe 3: neue Formen, vertraute Laute
  'И','Л','П','Д','З','Б','Г','Ж','Й','Ф','Э','Ю','Я','Ц','Ч','Ш','Ё',
  // Gruppe 4: Besonderheiten
  'Щ','Ы','Ь','Ъ'
];

const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');

const start = html.indexOf('alphabet:[');
const end = html.indexOf('\n],', start);
if (start < 0 || end < 0) { console.error('alphabet-Block nicht gefunden'); process.exit(1); }

const block = html.substring(start + 'alphabet:['.length, end);
const lines = block.split('\n').map(l => l.trim()).filter(l => l.startsWith('{m:'));
if (lines.length !== 33) { console.error('Erwartet 33 Buchstaben-Zeilen, gefunden: ' + lines.length); process.exit(1); }

// Zeile → Buchstabe (m:"А" oder m:"А")
function letterOf(line) {
  const m = line.match(/^\{m:"(\\u[0-9a-fA-F]{4}|.)"/);
  if (!m) return null;
  return m[1].startsWith('\\u') ? String.fromCharCode(parseInt(m[1].slice(2), 16)) : m[1];
}

const byLetter = {};
lines.forEach(l => { const c = letterOf(l); if (c) byLetter[c] = l.replace(/,$/, ''); });

const missing = ORDER.filter(c => !byLetter[c]);
if (missing.length) { console.error('Fehlende Buchstaben: ' + missing.join(' ')); process.exit(1); }

const newBlock = '\n' + ORDER.map(c => '  ' + byLetter[c]).join(',\n') + '\n';
const out = html.substring(0, start + 'alphabet:['.length) + newBlock + html.substring(end);
fs.writeFileSync(file, out, 'utf8');
console.log('Alphabet umsortiert: ' + ORDER.join(' '));
