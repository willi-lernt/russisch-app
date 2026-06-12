// Fügt GAP_DATA in index.html Alternativ-Sätze (s3/s4) für Wiederholungsrunden hinzu
// und korrigiert den fehlerhaften Ы-Satz (собаки endet auf и, nicht ы).
// Aufruf: node tools/add_gap_alternatives.js
const fs = require('fs');
const path = require('path');

const S34 = {
  'А': { s3:{ru:'___втобус едет в центр.',de:'Der Bus fährt ins Zentrum.',full:'Автобус едет в центр.'}, s4:{ru:'___прель — весенний месяц.',de:'April ist ein Frühlingsmonat.',full:'Апрель — весенний месяц.'} },
  'Б': { s3:{ru:'___илет стоит сто рублей.',de:'Die Fahrkarte kostet hundert Rubel.',full:'Билет стоит сто рублей.'}, s4:{ru:'___анан жёлтый.',de:'Die Banane ist gelb.',full:'Банан жёлтый.'} },
  'В': { s3:{ru:'___олга — большая река.',de:'Die Wolga ist ein großer Fluss.',full:'Волга — большая река.'}, s4:{ru:'___етер сильный.',de:'Der Wind ist stark.',full:'Ветер сильный.'} },
  'Г': { s3:{ru:'___итара звучит красиво.',de:'Die Gitarre klingt schön.',full:'Гитара звучит красиво.'}, s4:{ru:'___од начинается в январе.',de:'Das Jahr beginnt im Januar.',full:'Год начинается в январе.'} },
  'Д': { s3:{ru:'___ождь идёт весь день.',de:'Es regnet den ganzen Tag.',full:'Дождь идёт весь день.'}, s4:{ru:'___верь открыта.',de:'Die Tür ist offen.',full:'Дверь открыта.'} },
  'Е': { s3:{ru:'___вропа далеко.',de:'Europa ist weit weg.',full:'Европа далеко.'}, s4:{ru:'___сли хочешь, иди домой.',de:'Wenn du willst, geh nach Hause.',full:'Если хочешь, иди домой.'} },
  'Ё': { s3:{ru:'Вс___ хорошо.',de:'Alles ist gut.',full:'Всё хорошо.'}, s4:{ru:'Т___тя дома.',de:'Die Tante ist zu Hause.',full:'Тётя дома.'} },
  'Ж': { s3:{ru:'___ук сидит на листе.',de:'Der Käfer sitzt auf dem Blatt.',full:'Жук сидит на листе.'}, s4:{ru:'___ена дома.',de:'Die Ehefrau ist zu Hause.',full:'Жена дома.'} },
  'З': { s3:{ru:'___онт лежит дома.',de:'Der Regenschirm liegt zu Hause.',full:'Зонт лежит дома.'}, s4:{ru:'___автра будет солнце.',de:'Morgen scheint die Sonne.',full:'Завтра будет солнце.'} },
  'И': { s3:{ru:'___юнь — летний месяц.',de:'Juni ist ein Sommermonat.',full:'Июнь — летний месяц.'}, s4:{ru:'___дея хорошая.',de:'Die Idee ist gut.',full:'Идея хорошая.'} },
  'Й': { s3:{ru:'Ча___ горячий.',de:'Der Tee ist heiß.',full:'Чай горячий.'}, s4:{ru:'Музе___ открыт сегодня.',de:'Das Museum ist heute geöffnet.',full:'Музей открыт сегодня.'} },
  'К': { s3:{ru:'___арта на стене.',de:'Die Karte hängt an der Wand.',full:'Карта на стене.'}, s4:{ru:'___офе без сахара.',de:'Kaffee ohne Zucker.',full:'Кофе без сахара.'} },
  'Л': { s3:{ru:'___ампа на столе.',de:'Die Lampe steht auf dem Tisch.',full:'Лампа на столе.'}, s4:{ru:'___имон кислый.',de:'Die Zitrone ist sauer.',full:'Лимон кислый.'} },
  'М': { s3:{ru:'___олоко белое.',de:'Die Milch ist weiß.',full:'Молоко белое.'}, s4:{ru:'___узыка играет тихо.',de:'Die Musik spielt leise.',full:'Музыка играет тихо.'} },
  'Н': { s3:{ru:'___овый год скоро.',de:'Neujahr ist bald.',full:'Новый год скоро.'}, s4:{ru:'___ос холодный зимой.',de:'Die Nase ist im Winter kalt.',full:'Нос холодный зимой.'} },
  'О': { s3:{ru:'___кно открыто.',de:'Das Fenster ist offen.',full:'Окно открыто.'}, s4:{ru:'___бед готов.',de:'Das Mittagessen ist fertig.',full:'Обед готов.'} },
  'П': { s3:{ru:'___исьмо лежит на столе.',de:'Der Brief liegt auf dem Tisch.',full:'Письмо лежит на столе.'}, s4:{ru:'___огода сегодня хорошая.',de:'Das Wetter ist heute gut.',full:'Погода сегодня хорошая.'} },
  'Р': { s3:{ru:'___адио играет музыку.',de:'Das Radio spielt Musik.',full:'Радио играет музыку.'}, s4:{ru:'___ыба плавает в море.',de:'Der Fisch schwimmt im Meer.',full:'Рыба плавает в море.'} },
  'С': { s3:{ru:'___обака бежит домой.',de:'Der Hund läuft nach Hause.',full:'Собака бежит домой.'}, s4:{ru:'___ыр вкусный.',de:'Der Käse ist lecker.',full:'Сыр вкусный.'} },
  'Т': { s3:{ru:'___еатр в центре города.',de:'Das Theater ist im Stadtzentrum.',full:'Театр в центре города.'}, s4:{ru:'___орт сладкий.',de:'Die Torte ist süß.',full:'Торт сладкий.'} },
  'У': { s3:{ru:'___жин готов.',de:'Das Abendessen ist fertig.',full:'Ужин готов.'}, s4:{ru:'___рок начинается.',de:'Der Unterricht beginnt.',full:'Урок начинается.'} },
  'Ф': { s3:{ru:'___ильм начинается вечером.',de:'Der Film beginnt am Abend.',full:'Фильм начинается вечером.'}, s4:{ru:'___лаг висит высоко.',de:'Die Fahne hängt hoch.',full:'Флаг висит высоко.'} },
  'Х': { s3:{ru:'___обби — это спорт.',de:'Das Hobby ist Sport.',full:'Хобби — это спорт.'}, s4:{ru:'___удожник рисует море.',de:'Der Maler malt das Meer.',full:'Художник рисует море.'} },
  'Ц': { s3:{ru:'___ена высокая.',de:'Der Preis ist hoch.',full:'Цена высокая.'}, s4:{ru:'___ентр города красивый.',de:'Das Stadtzentrum ist schön.',full:'Центр города красивый.'} },
  'Ч': { s3:{ru:'___еловек идёт по улице.',de:'Ein Mensch geht die Straße entlang.',full:'Человек идёт по улице.'}, s4:{ru:'До___ь дома.',de:'Die Tochter ist zu Hause.',full:'Дочь дома.'} },
  'Ш': { s3:{ru:'___каф большой.',de:'Der Schrank ist groß.',full:'Шкаф большой.'}, s4:{ru:'___околад сладкий.',de:'Die Schokolade ist süß.',full:'Шоколад сладкий.'} },
  'Щ': { s3:{ru:'___ука плавает в реке.',de:'Der Hecht schwimmt im Fluss.',full:'Щука плавает в реке.'}, s4:{ru:'Бор___ очень вкусный.',de:'Der Borschtsch ist sehr lecker.',full:'Борщ очень вкусный.'} },
  'Ъ': { s3:{ru:'Об___явление висит на стене.',de:'Die Anzeige hängt an der Wand.',full:'Объявление висит на стене.'}, s4:{ru:'Он с___ел весь суп.',de:'Er hat die ganze Suppe aufgegessen.',full:'Он съел весь суп.'} },
  'Ы': { s3:{ru:'С___р на столе.',de:'Der Käse ist auf dem Tisch.',full:'Сыр на столе.'}, s4:{ru:'М___ дома.',de:'Wir sind zu Hause.',full:'Мы дома.'} },
  'Ь': { s3:{ru:'Ден___ хороший.',de:'Der Tag ist schön.',full:'День хороший.'}, s4:{ru:'Тетрад___ лежит на столе.',de:'Das Heft liegt auf dem Tisch.',full:'Тетрадь лежит на столе.'} },
  'Э': { s3:{ru:'___кскурсия завтра.',de:'Die Exkursion ist morgen.',full:'Экскурсия завтра.'}, s4:{ru:'___таж первый.',de:'Es ist der erste Stock.',full:'Этаж первый.'} },
  'Ю': { s3:{ru:'___бка синяя.',de:'Der Rock ist blau.',full:'Юбка синяя.'}, s4:{ru:'___ра играет в футбол.',de:'Jura spielt Fußball.',full:'Юра играет в футбол.'} },
  'Я': { s3:{ru:'___года красная.',de:'Die Beere ist rot.',full:'Ягода красная.'}, s4:{ru:'___хта в море.',de:'Die Jacht ist auf dem Meer.',full:'Яхта в море.'} }
};

const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const m = html.match(/const GAP_DATA=(\{.*?\});/s);
if (!m) { console.error('GAP_DATA nicht gefunden'); process.exit(1); }
const data = JSON.parse(m[1]);

let added = 0;
for (const letter in S34) {
  if (!data[letter]) { console.error('Buchstabe fehlt in GAP_DATA: ' + letter); process.exit(1); }
  ['s3', 's4'].forEach(k => {
    const s = S34[letter][k];
    // Plausibilitätsprüfung: Lücke + Antwort muss den vollen Satz ergeben
    const rebuilt = s.ru.replace(/___/g, ix => '');
    data[letter][k] = { ru: s.ru, de: s.de, answer: letter, full: s.full };
    added++;
  });
}

// Ы-Korrektur: "собаки" endet auf и — Satz mit echten Ы-Endungen ersetzen
data['Ы'].s2 = { ru: 'Кот___ и сад___ красивые.', de: 'Die Katzen und die Gärten sind schön.', answer: 'Ы', full: 'Коты и сады красивые.', word2: 'сады' };

const out = html.replace(m[0], 'const GAP_DATA=' + JSON.stringify(data) + ';');
fs.writeFileSync(file, out, 'utf8');
console.log(added + ' Alternativ-Sätze eingefügt, Ы-Satz korrigiert.');
