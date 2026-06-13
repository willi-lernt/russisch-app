// Fügt jedem der 100 Wörter in vocab_top1 einen Beispielsatz (ctx) hinzu.
// Idempotent (entfernt vorhandenes ctx vor dem Einfügen). Aufruf: node tools/add_top100_sentences.js
const fs = require('fs'); const path = require('path');
const S = {
  'не':['Я не понимаю.','Ich verstehe nicht.'],
  'на':['Книга на столе.','Das Buch liegt auf dem Tisch.'],
  'что':['Что это?','Was ist das?'],
  'быть':['Я хочу быть врачом.','Ich möchte Arzt sein.'],
  'это':['Это мой дом.','Das ist mein Haus.'],
  'они':['Они живут в Москве.','Sie wohnen in Moskau.'],
  'оно':['Оно очень большое.','Es ist sehr groß.'],
  'от':['Письмо от мамы.','Ein Brief von Mama.'],
  'за':['Кот за дверью.','Die Katze ist hinter der Tür.'],
  'из':['Я из Германии.','Ich komme aus Deutschland.'],
  'но':['Я хочу, но не могу.','Ich will, aber ich kann nicht.'],
  'по':['Мы идём по улице.','Wir gehen die Straße entlang.'],
  'только':['Только один час.','Nur eine Stunde.'],
  'если':['Если хочешь, приходи.','Wenn du willst, komm.'],
  'когда':['Когда ты придёшь?','Wann kommst du?'],
  'уже':['Уже поздно.','Es ist schon spät.'],
  'для':['Это для тебя.','Das ist für dich.'],
  'вот':['Вот мой дом.','Hier ist mein Haus.'],
  'ещё':['Дай мне ещё чаю.','Gib mir noch Tee.'],
  'так':['Не говори так.','Sag nicht so.'],
  'весь':['Весь день дома.','Den ganzen Tag zu Hause.'],
  'тоже':['Я тоже иду.','Ich gehe auch.'],
  'здесь':['Я живу здесь.','Ich wohne hier.'],
  'там':['Магазин там.','Der Laden ist dort.'],
  'потом':['Сначала еда, потом кофе.','Zuerst Essen, dann Kaffee.'],
  'сейчас':['Я занят сейчас.','Ich bin jetzt beschäftigt.'],
  'сегодня':['Сегодня воскресенье.','Heute ist Sonntag.'],
  'завтра':['Завтра я работаю.','Morgen arbeite ich.'],
  'вчера':['Вчера был дождь.','Gestern hat es geregnet.'],
  'всегда':['Я всегда дома вечером.','Ich bin abends immer zu Hause.'],
  'никогда':['Я никогда не курю.','Ich rauche nie.'],
  'иногда':['Иногда я гуляю.','Manchmal gehe ich spazieren.'],
  'часто':['Я часто пью чай.','Ich trinke oft Tee.'],
  'редко':['Он редко звонит.','Er ruft selten an.'],
  'человек':['Этот человек — мой друг.','Dieser Mensch ist mein Freund.'],
  'люди':['Здесь много людей.','Hier sind viele Leute.'],
  'год':['Новый год скоро.','Neujahr ist bald.'],
  'день':['Хорошего дня!','Einen schönen Tag!'],
  'ночь':['Спокойной ночи!','Gute Nacht!'],
  'утро':['Доброе утро!','Guten Morgen!'],
  'вечер':['Добрый вечер!','Guten Abend!'],
  'неделя':['В неделе семь дней.','Eine Woche hat sieben Tage.'],
  'месяц':['Январь — первый месяц.','Januar ist der erste Monat.'],
  'час':['Урок длится час.','Die Stunde dauert eine Stunde.'],
  'минута':['Подожди минуту.','Warte eine Minute.'],
  'рука':['У меня болит рука.','Mein Arm tut weh.'],
  'нога':['Моя нога устала.','Mein Bein ist müde.'],
  'голова':['У меня болит голова.','Ich habe Kopfschmerzen.'],
  'глаз':['У меня болит глаз.','Mein Auge tut weh.'],
  'сердце':['Сердце бьётся быстро.','Das Herz schlägt schnell.'],
  'дело':['Как дела?','Wie geht es?'],
  'раз':['Ещё раз, пожалуйста.','Noch einmal, bitte.'],
  'мир':['Мир во всём мире.','Frieden auf der ganzen Welt.'],
  'страна':['Россия — большая страна.','Russland ist ein großes Land.'],
  'земля':['Земля круглая.','Die Erde ist rund.'],
  'вопрос':['У меня есть вопрос.','Ich habe eine Frage.'],
  'ответ':['Это правильный ответ.','Das ist die richtige Antwort.'],
  'имя':['Как твоё имя?','Wie ist dein Name?'],
  'отец':['Мой отец — врач.','Mein Vater ist Arzt.'],
  'мать':['Моя мать дома.','Meine Mutter ist zu Hause.'],
  'ребёнок':['Ребёнок спит.','Das Kind schläft.'],
  'дети':['Дети играют в парке.','Die Kinder spielen im Park.'],
  'машина':['Моя машина новая.','Mein Auto ist neu.'],
  'улица':['Улица очень длинная.','Die Straße ist sehr lang.'],
  'дорога':['Это дорога домой.','Das ist der Weg nach Hause.'],
  'окно':['Открой окно.','Mach das Fenster auf.'],
  'дверь':['Закрой дверь.','Mach die Tür zu.'],
  'стол':['Большой деревянный стол.','Ein großer Holztisch.'],
  'стул':['Это мой стул.','Das ist mein Stuhl.'],
  'комната':['Моя комната маленькая.','Mein Zimmer ist klein.'],
  'квартира':['У нас большая квартира.','Wir haben eine große Wohnung.'],
  'телефон':['Где мой телефон?','Wo ist mein Telefon?'],
  'новый':['У меня новый телефон.','Ich habe ein neues Telefon.'],
  'старый':['Это старый дом.','Das ist ein altes Haus.'],
  'молодой':['Он ещё молодой.','Er ist noch jung.'],
  'первый':['Это первый урок.','Das ist die erste Lektion.'],
  'последний':['Последний день недели.','Der letzte Tag der Woche.'],
  'другой':['Дай мне другой.','Gib mir einen anderen.'],
  'каждый':['Каждый день я учусь.','Jeden Tag lerne ich.'],
  'самый':['Самый лучший день.','Der beste Tag.'],
  'мой':['Это мой друг.','Das ist mein Freund.'],
  'твой':['Где твой дом?','Wo ist dein Haus?'],
  'наш':['Это наш город.','Das ist unsere Stadt.'],
  'ваш':['Как ваше имя?','Wie ist Ihr Name?'],
  'свой':['Я люблю свой город.','Ich liebe meine Stadt.'],
  'этот':['Этот дом большой.','Dieses Haus ist groß.'],
  'тот':['Тот человек — мой брат.','Jener Mann ist mein Bruder.'],
  'такой':['Я хочу такой же.','Ich will so einen.'],
  'который':['Дом, который я люблю.','Das Haus, das ich liebe.'],
  'почему':['Почему ты грустный?','Warum bist du traurig?'],
  'потому что':['Я дома, потому что болею.','Ich bin zu Hause, weil ich krank bin.'],
  'поэтому':['Идёт дождь, поэтому я дома.','Es regnet, deshalb bin ich zu Hause.'],
  'конечно':['Конечно, я помогу.','Natürlich helfe ich.'],
  'жить':['Я хочу жить в Москве.','Ich möchte in Moskau leben.'],
  'делать':['Что ты делаешь?','Was machst du?'],
  'сказать':['Я хочу сказать спасибо.','Ich möchte Danke sagen.'],
  'думать':['Я думаю о тебе.','Ich denke an dich.'],
  'видеть':['Рад тебя видеть.','Schön, dich zu sehen.'],
  'смотреть':['Я люблю смотреть фильмы.','Ich sehe gern Filme.'],
  'слышать':['Я тебя не слышу.','Ich höre dich nicht.']
};

const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('// __TOP500_START__'); const e = html.indexOf('// __TOP500_END__');
if (s < 0 || e < 0) { console.error('TOP500-Block nicht gefunden'); process.exit(1); }
let block = html.substring(s, e);
let count = 0, missing = [];
for (const w in S) {
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(\\{"m":"' + esc + '","t":[^}]*?)(,"ctx":\\[[^\\]]*\\])?(\\})');
  if (!re.test(block)) { missing.push(w); continue; }
  block = block.replace(re, function (full, body, oldctx, brace) {
    const j = s2 => s2.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return body + ',"ctx":[{"ru":"' + j(S[w][0]) + '","de":"' + j(S[w][1]) + '"}]' + brace;
  });
  count++;
}
fs.writeFileSync(file, html.substring(0, s) + block + html.substring(e), 'utf8');
console.log(count + ' Top-100-Wörter mit Beispielsatz versehen.');
if (missing.length) console.log('NICHT gefunden (' + missing.length + '): ' + missing.join(', '));
