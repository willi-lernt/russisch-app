// Ergänzt C.weekdays in index.html um Beispielsätze (ctx) und eine
// Übersetzung der Beispielphrase (et) — z. B. "в понедельник" = "am Montag".
// Aufruf: node tools/add_weekday_data.js   (idempotent)
const fs = require('fs');
const path = require('path');

// m → { et: Übersetzung der e-Phrase, ctx: [{ru,de}] }
const DATA = {
  'понедельник': { et: 'am Montag', ru: 'В понедельник я работаю.', de: 'Am Montag arbeite ich.' },
  'вторник':     { et: 'am Dienstag', ru: 'Во вторник у меня урок.', de: 'Am Dienstag habe ich Unterricht.' },
  'среда':       { et: 'am Mittwoch', ru: 'В среду мы играем в футбол.', de: 'Am Mittwoch spielen wir Fußball.' },
  'четверг':     { et: 'am Donnerstag', ru: 'В четверг я иду в магазин.', de: 'Am Donnerstag gehe ich einkaufen.' },
  'пятница':     { et: 'am Freitag', ru: 'В пятницу вечером я отдыхаю.', de: 'Am Freitagabend ruhe ich mich aus.' },
  'суббота':     { et: 'am Samstag', ru: 'В субботу я сплю долго.', de: 'Am Samstag schlafe ich lange.' },
  'воскресенье': { et: 'am Sonntag', ru: 'В воскресенье я дома.', de: 'Am Sonntag bin ich zu Hause.' },
  'январь':  { et: 'im Januar', ru: 'В январе очень холодно.', de: 'Im Januar ist es sehr kalt.' },
  'февраль': { et: 'im Februar', ru: 'Февраль — короткий месяц.', de: 'Der Februar ist ein kurzer Monat.' },
  'март':    { et: 'im März', ru: 'В марте начинается весна.', de: 'Im März beginnt der Frühling.' },
  'апрель':  { et: 'im April', ru: 'В апреле часто идёт дождь.', de: 'Im April regnet es oft.' },
  'май':     { et: 'im Mai', ru: 'В мае тепло и красиво.', de: 'Im Mai ist es warm und schön.' },
  'июнь':    { et: 'im Juni', ru: 'В июне начинается лето.', de: 'Im Juni beginnt der Sommer.' },
  'июль':    { et: 'im Juli', ru: 'Июль — жаркий месяц.', de: 'Der Juli ist ein heißer Monat.' },
  'август':  { et: 'im August', ru: 'В августе у меня отпуск.', de: 'Im August habe ich Urlaub.' },
  'сентябрь':{ et: 'im September', ru: 'В сентябре дети идут в школу.', de: 'Im September gehen die Kinder zur Schule.' },
  'октябрь': { et: 'im Oktober', ru: 'В октябре падают листья.', de: 'Im Oktober fallen die Blätter.' },
  'ноябрь':  { et: 'im November', ru: 'В ноябре часто туман.', de: 'Im November ist es oft neblig.' },
  'декабрь': { et: 'im Dezember', ru: 'В декабре мы празднуем Новый год.', de: 'Im Dezember feiern wir Neujahr.' },
  'зима':  { et: 'kalter Winter', ru: 'Зимой я катаюсь на лыжах.', de: 'Im Winter fahre ich Ski.' },
  'весна': { et: 'warmer Frühling', ru: 'Весной всё цветёт.', de: 'Im Frühling blüht alles.' },
  'лето':  { et: 'heißer Sommer', ru: 'Летом мы ездим на море.', de: 'Im Sommer fahren wir ans Meer.' },
  'осень': { et: 'gelber Herbst', ru: 'Осенью часто идёт дождь.', de: 'Im Herbst regnet es oft.' }
};

const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');

const start = html.indexOf('weekdays:[');
if (start < 0) { console.error('weekdays:[ nicht gefunden'); process.exit(1); }
const end = html.indexOf('\n],', start);
const block = html.substring(start, end);

let out = block, count = 0;
for (const m in DATA) {
  const d = DATA[m];
  // Karte finden: {m:"<wort>", ... bis vor schließende }
  const re = new RegExp('(\\{m:"' + m + '"[^}]*?)(\\}(?=,?\\s*(?:\\{m:|$)))');
  if (!re.test(out)) { console.error('Karte nicht gefunden: ' + m); process.exit(1); }
  out = out.replace(re, function (full, body, brace) {
    // vorhandene et/ctx entfernen (Idempotenz)
    body = body.replace(/,et:"[^"]*"/g, '').replace(/,ctx:\[[^\]]*\]/g, '');
    const esc = s => s.replace(/"/g, '\\"');
    return body + ',et:"' + esc(d.et) + '",ctx:[{ru:"' + esc(d.ru) + '",de:"' + esc(d.de) + '"}]' + brace;
  });
  count++;
}

fs.writeFileSync(file, html.substring(0, start) + out + html.substring(end), 'utf8');
console.log(count + ' Wochentag-/Monatskarten um Beispielsatz + Phrasen-Übersetzung ergänzt.');
