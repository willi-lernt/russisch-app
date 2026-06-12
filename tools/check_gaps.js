// Prüft: Lücke + Buchstabe (groß ODER klein) muss exakt den vollen Satz ergeben
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const d = JSON.parse(html.match(/const GAP_DATA=(\{.*?\});/s)[1]);
let fehler = [], gesamt = 0;
for (const L in d) {
  ['s1', 's2', 's3', 's4'].forEach(k => {
    const s = d[L][k]; if (!s) return;
    gesamt++;
    const esc = s.ru.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pat = '^' + esc.split('___').join('(' + s.answer + '|' + s.answer.toLowerCase() + ')') + '$';
    if (!new RegExp(pat).test(s.full)) fehler.push(L + '.' + k + ': "' + s.ru + '" passt nicht zu "' + s.full + '"');
  });
}
console.log(fehler.length ? 'FEHLER (' + fehler.length + '):\n' + fehler.join('\n') : 'Alle ' + gesamt + ' Saetze konsistent.');
