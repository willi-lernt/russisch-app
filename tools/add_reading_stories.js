// Erweitert den Lese-Pfad (reading) und die Mini-Geschichten (STORIES).
// Idempotent über Marker-Kommentare. Aufruf: node tools/add_reading_stories.js
const fs = require('fs'); const path = require('path');

// Neue Lese-Karten: Russisch lesen → richtige Bedeutung wählen
const READING = [
  { m: 'Меня зовут Анна.', t: 'Ich heiße Anna.', x: 'меня зовут = ich heiße', o: ['Ich heiße Anna.', 'Ich wohne in Anna.', 'Das ist Anna.', 'Ich sehe Anna.'], r: ['Меня зовут Анна.', 'Я живу в Анне.', 'Это Анна.', 'Я вижу Анну.'] },
  { m: 'Я живу в Берлине.', t: 'Ich wohne in Berlin.', x: 'жить = wohnen', o: ['Ich wohne in Berlin.', 'Ich fahre nach Berlin.', 'Ich komme aus Berlin.', 'Ich liebe Berlin.'], r: ['Я живу в Берлине.', 'Я еду в Берлин.', 'Я из Берлина.', 'Я люблю Берлин.'] },
  { m: 'Сегодня хорошая погода.', t: 'Heute ist schönes Wetter.', x: 'погода = Wetter', o: ['Heute ist schönes Wetter.', 'Gestern war schlechtes Wetter.', 'Morgen regnet es.', 'Heute ist es kalt.'], r: ['Сегодня хорошая погода.', 'Вчера была плохая погода.', 'Завтра дождь.', 'Сегодня холодно.'] },
  { m: 'Я люблю читать книги.', t: 'Ich lese gern Bücher.', x: 'читать = lesen', o: ['Ich lese gern Bücher.', 'Ich schreibe ein Buch.', 'Ich kaufe Bücher.', 'Ich habe viele Bücher.'], r: ['Я люблю читать книги.', 'Я пишу книгу.', 'Я покупаю книги.', 'У меня много книг.'] },
  { m: 'Моя сестра работает врачом.', t: 'Meine Schwester arbeitet als Ärztin.', x: 'врач = Arzt/Ärztin', o: ['Meine Schwester arbeitet als Ärztin.', 'Meine Mutter ist Lehrerin.', 'Mein Bruder ist Arzt.', 'Meine Schwester studiert Medizin.'], r: ['Моя сестра работает врачом.', 'Моя мама — учительница.', 'Мой брат — врач.', 'Моя сестра изучает медицину.'] },
  { m: 'В субботу мы идём в кино.', t: 'Am Samstag gehen wir ins Kino.', x: 'кино = Kino', o: ['Am Samstag gehen wir ins Kino.', 'Am Sonntag bleiben wir zu Hause.', 'Am Freitag arbeiten wir.', 'Am Samstag gehen wir ins Theater.'], r: ['В субботу мы идём в кино.', 'В воскресенье мы дома.', 'В пятницу мы работаем.', 'В субботу мы идём в театр.'] },
  { m: 'Этот магазин открыт до восьми.', t: 'Dieser Laden ist bis acht geöffnet.', x: 'открыт = geöffnet', o: ['Dieser Laden ist bis acht geöffnet.', 'Dieser Laden öffnet um acht.', 'Der Laden ist geschlossen.', 'Der Laden ist bis sieben offen.'], r: ['Этот магазин открыт до восьми.', 'Этот магазин открывается в восемь.', 'Магазин закрыт.', 'Магазин открыт до семи.'] },
  { m: 'Зимой в России очень холодно.', t: 'Im Winter ist es in Russland sehr kalt.', x: 'зимой = im Winter', o: ['Im Winter ist es in Russland sehr kalt.', 'Im Sommer ist es in Russland heiß.', 'In Russland regnet es oft.', 'Im Winter schneit es in Russland.'], r: ['Зимой в России очень холодно.', 'Летом в России жарко.', 'В России часто идёт дождь.', 'Зимой в России идёт снег.'] },
  { m: 'Извините, я не понимаю.', t: 'Entschuldigung, ich verstehe nicht.', x: 'понимать = verstehen', o: ['Entschuldigung, ich verstehe nicht.', 'Entschuldigung, ich weiß nicht.', 'Bitte sprechen Sie langsamer.', 'Ich verstehe Sie gut.'], r: ['Извините, я не понимаю.', 'Извините, я не знаю.', 'Говорите медленнее, пожалуйста.', 'Я вас хорошо понимаю.'] },
  { m: 'Вчера я купил новый телефон.', t: 'Gestern habe ich ein neues Telefon gekauft.', x: 'купил = (ich) kaufte', o: ['Gestern habe ich ein neues Telefon gekauft.', 'Heute kaufe ich ein Telefon.', 'Ich habe mein Telefon verloren.', 'Mein Telefon ist alt.'], r: ['Вчера я купил новый телефон.', 'Сегодня я покупаю телефон.', 'Я потерял телефон.', 'Мой телефон старый.'] },
  { m: 'Она изучает русский язык три года.', t: 'Sie lernt seit drei Jahren Russisch.', x: 'изучать = studieren/lernen', o: ['Sie lernt seit drei Jahren Russisch.', 'Sie spricht gut Russisch.', 'Sie wohnt drei Jahre in Russland.', 'Sie will Russisch lernen.'], r: ['Она изучает русский язык три года.', 'Она хорошо говорит по-русски.', 'Она живёт в России три года.', 'Она хочет учить русский.'] },
  { m: 'Мы хотим заказать столик на двоих.', t: 'Wir möchten einen Tisch für zwei reservieren.', x: 'заказать = bestellen/reservieren', o: ['Wir möchten einen Tisch für zwei reservieren.', 'Wir möchten die Rechnung, bitte.', 'Der Tisch ist für vier Personen.', 'Wir warten auf einen Tisch.'], r: ['Мы хотим заказать столик на двоих.', 'Принесите счёт, пожалуйста.', 'Столик на четверых.', 'Мы ждём столик.'] },
  { m: 'Летом мы поедем на море отдыхать.', t: 'Im Sommer fahren wir ans Meer, um uns zu erholen.', x: 'отдыхать = sich erholen', o: ['Im Sommer fahren wir ans Meer, um uns zu erholen.', 'Im Winter fahren wir in die Berge.', 'Wir waren letztes Jahr am Meer.', 'Wir möchten ans Meer fahren.'], r: ['Летом мы поедем на море отдыхать.', 'Зимой мы едем в горы.', 'Мы были на море в прошлом году.', 'Мы хотим поехать на море.'] }
];
READING.forEach(c => { c.s = 'Lesen & Verstehen'; c.e = c.m; });

// Neue Mini-Geschichten
function story(title, segs, vocab) { return { title: title, text: segs.map(s => ({ ru: s[0], de: s[1], tip: s[2] })), vocab: vocab }; }
const STORIES = [
  story('Der Morgen', [['Я встаю', 'Ich stehe auf', 'вставать = aufstehen'], [' в семь часов.', ' um sieben Uhr.', 'семь часов = sieben Uhr'], [' Я пью кофе', ' Ich trinke Kaffee', 'пить = trinken'], [' и читаю новости.', ' und lese die Nachrichten.', 'новости = Nachrichten'], [' Потом я иду на работу.', ' Dann gehe ich zur Arbeit.', 'работа = Arbeit']], ['встаю = ich stehe auf', 'пью = ich trinke', 'читаю = ich lese', 'потом = dann', 'работа = Arbeit']),
  story('Meine Familie', [['У меня', 'Ich habe', 'у меня = ich habe'], [' большая семья:', ' eine große Familie:', 'семья = Familie'], [' мама, папа,', ' Mama, Papa,', 'мама = Mama'], [' брат и сестра.', ' Bruder und Schwester.', 'брат = Bruder'], [' Мы живём вместе', ' Wir leben zusammen', 'вместе = zusammen'], [' в Москве.', ' in Moskau.', 'в Москве = in Moskau']], ['семья = Familie', 'брат = Bruder', 'сестра = Schwester', 'вместе = zusammen', 'живём = wir leben']),
  story('Im Laden', [['Девушка покупает', 'Ein Mädchen kauft', 'покупать = kaufen'], [' молоко, хлеб', ' Milch, Brot', 'молоко = Milch'], [' и сыр.', ' und Käse.', 'сыр = Käse'], [' Она платит картой.', ' Sie zahlt mit Karte.', 'платить = zahlen'], [' «Спасибо!»', ' „Danke!“', 'спасибо = danke']], ['покупает = kauft', 'молоко = Milch', 'хлеб = Brot', 'сыр = Käse', 'платит = zahlt']),
  story('Das Wetter', [['Сегодня идёт дождь.', 'Heute regnet es.', 'дождь = Regen'], [' На улице холодно.', ' Draußen ist es kalt.', 'холодно = kalt'], [' Я беру зонт', ' Ich nehme einen Regenschirm', 'зонт = Regenschirm'], [' и иду домой.', ' und gehe nach Hause.', 'домой = nach Hause']], ['дождь = Regen', 'холодно = kalt', 'зонт = Regenschirm', 'домой = nach Hause', 'беру = ich nehme']),
  story('Das Wochenende', [['В субботу я отдыхаю.', 'Am Samstag ruhe ich mich aus.', 'отдыхать = sich ausruhen'], [' Я гуляю в парке', ' Ich spaziere im Park', 'гулять = spazieren'], [' и встречаюсь с другом.', ' und treffe einen Freund.', 'друг = Freund'], [' Это здорово!', ' Das ist toll!', 'здорово = toll']], ['отдыхаю = ich ruhe', 'гуляю = ich spaziere', 'парк = Park', 'друг = Freund', 'здорово = toll']),
  story('Meine Katze', [['У меня есть кот.', 'Ich habe einen Kater.', 'кот = Kater'], [' Его зовут Барсик.', ' Er heißt Barsik.', 'его зовут = er heißt'], [' Он любит спать', ' Er schläft gern', 'спать = schlafen'], [' и есть рыбу.', ' und frisst Fisch.', 'рыба = Fisch']], ['кот = Kater', 'спать = schlafen', 'рыба = Fisch', 'любит = mag', 'есть = essen']),
  story('Im Restaurant', [['Мы идём в ресторан.', 'Wir gehen ins Restaurant.', 'ресторан = Restaurant'], [' Я заказываю суп', ' Ich bestelle Suppe', 'заказывать = bestellen'], [' и салат.', ' und Salat.', 'салат = Salat'], [' Официант приносит счёт.', ' Der Kellner bringt die Rechnung.', 'счёт = Rechnung']], ['ресторан = Restaurant', 'заказываю = ich bestelle', 'суп = Suppe', 'счёт = Rechnung', 'официант = Kellner']),
  story('Die Reise', [['Летом я еду', 'Im Sommer fahre ich', 'лето = Sommer'], [' в Санкт-Петербург.', ' nach Sankt Petersburg.', 'ехать = fahren'], [' Это красивый город.', ' Das ist eine schöne Stadt.', 'город = Stadt'], [' Там много музеев.', ' Dort gibt es viele Museen.', 'музей = Museum']], ['лето = Sommer', 'еду = ich fahre', 'город = Stadt', 'музей = Museum', 'красивый = schön']),
  story('Das Lernen', [['Я учу русский язык.', 'Ich lerne Russisch.', 'учить = lernen'], [' Это трудно,', ' Das ist schwer,', 'трудно = schwer'], [' но интересно.', ' aber interessant.', 'интересно = interessant'], [' Каждый день я читаю', ' Jeden Tag lese ich', 'каждый день = jeden Tag'], [' и пишу.', ' und schreibe.', 'писать = schreiben']], ['учу = ich lerne', 'трудно = schwer', 'интересно = interessant', 'читаю = ich lese', 'пишу = ich schreibe']),
  story('Der Anruf', [['Мама звонит мне', 'Mama ruft mich an', 'звонить = anrufen'], [' вечером.', ' am Abend.', 'вечер = Abend'], [' Мы говорим', ' Wir sprechen', 'говорить = sprechen'], [' о работе и семье.', ' über Arbeit und Familie.', 'работа = Arbeit'], [' Я скучаю по дому.', ' Ich vermisse mein Zuhause.', 'скучать = vermissen']], ['звонит = ruft an', 'вечером = abends', 'говорим = wir sprechen', 'скучаю = ich vermisse', 'дом = Zuhause']),
  story('Der Geburtstag', [['Сегодня', 'Heute ist', 'сегодня = heute'], [' день рождения брата.', ' der Geburtstag meines Bruders.', 'день рождения = Geburtstag'], [' Мы дарим ему книгу.', ' Wir schenken ihm ein Buch.', 'дарить = schenken'], [' «Поздравляем!»', ' „Herzlichen Glückwunsch!“', 'поздравляем = wir gratulieren']], ['день рождения = Geburtstag', 'брат = Bruder', 'дарим = wir schenken', 'книга = Buch', 'поздравляем = Glückwunsch']),
  story('Der Winter', [['Зимой я люблю гулять.', 'Im Winter spaziere ich gern.', 'зима = Winter'], [' Идёт снег,', ' Es schneit,', 'снег = Schnee'], [' всё белое.', ' alles ist weiß.', 'белый = weiß'], [' Дети играют на улице.', ' Die Kinder spielen draußen.', 'играть = spielen']], ['зима = Winter', 'снег = Schnee', 'белое = weiß', 'дети = Kinder', 'играют = spielen'])
];

const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// --- reading: vor das schließende "\n]," des reading-Blocks einfügen ---
html = html.replace(/\/\*__RD_EXTRA__\*\/[\s\S]*?\/\*__RD_EXTRA_END__\*\//, '');
const rdStart = html.indexOf('reading:[');
const rdEnd = html.indexOf('\n],', rdStart);
const rdInsert = ',\n/*__RD_EXTRA__*/\n' + READING.map(c => '  ' + JSON.stringify(c)).join(',\n') + '\n/*__RD_EXTRA_END__*/';
html = html.substring(0, rdEnd) + rdInsert + html.substring(rdEnd);

// --- STORIES: vor das schließende "\n];" einfügen ---
html = html.replace(/\/\*__ST_EXTRA__\*\/[\s\S]*?\/\*__ST_EXTRA_END__\*\//, '');
const stStart = html.indexOf('const STORIES=[');
const stEnd = html.indexOf('\n];', stStart);
const stInsert = ',\n/*__ST_EXTRA__*/\n' + STORIES.map(s => '  ' + JSON.stringify(s)).join(',\n') + '\n/*__ST_EXTRA_END__*/';
html = html.substring(0, stEnd) + stInsert + html.substring(stEnd);

fs.writeFileSync(file, html, 'utf8');
console.log(READING.length + ' Lese-Karten und ' + STORIES.length + ' Geschichten ergänzt.');
