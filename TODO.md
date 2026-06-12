# Bukva – Fahrplan

Stand: 11.06.2026

## Erledigt (11.06.2026) — Bug-Fixes
- [x] SRS/Wiederholung: Karten werden jetzt unter ihrem echten Index gespeichert (vorher wurden immer nur die ersten ~5 Karten jeder Sektion wiederholt)
- [x] XP wurde beim Quiz-Abschluss doppelt vergeben — jetzt nur noch pro Frage
- [x] Antwortprüfung: 2-Buchstaben-Raten zählt nicht mehr; stattdessen Tippfehler-Toleranz (Levenshtein ≥ 0.85)
- [x] Mikrofon-Vergleich (Lernen/Quiz/Sprechen): kein lasches `includes` mehr, Ähnlichkeitsprüfung
- [x] Streak: 7-Tage-Deckel entfernt, echter Zähler (bricht bei Pause korrekt auf 1)
- [x] Hören-Quiz: Crash behoben (Karten haben keine `r`/`o`-Felder) — Vorschläge werden generiert, Russisch ODER Deutsch gilt als richtig, Lösung/Hilfe zeigen sinnvolle Inhalte
- [x] Service Worker: relative Pfade + komplette App-Shell precachen (Cache `bukva-v4`) → offline ab erstem Besuch
- [x] manifest.json: Icon-Pfade korrigiert (kein `icons/`-Ordner), `start_url`/`scope` relativ
- [x] 715-KB-Base64-Manifest aus dem `<head>` entfernt → index.html von 1,12 MB auf ~0,4 MB
- [x] Fortschritt: Richtig/Falsch zählt nur korrekte Antworten; Dashboard zeigt Fortschritt gegen den Level-Pool

## Erledigt (12.06.2026) — Roter-Faden-Update
- [x] „▶ Hier weitermachen"-Karte oben im Lernpfad: empfiehlt genau einen nächsten Schritt (fällige Wiederholungen ab 5 → Alphabet bis fertig → erster unfertiger Pfad in Reihenfolge)
- [x] Sanfte Voraussetzungen statt Level-Sperren: Pfade immer anklickbar, bei fehlender Empfehlung gedimmt mit „💡 Tipp: erst X lernen" (SEC_REQS)
- [x] Dashboard in 4 Gruppen: Grundlagen / Wortschatz / Fertigkeiten / Deine Welt
- [x] Level umgedeutet zum „Hilfe-Level" (steuert nur noch Hilfen/Versuche/Rundengröße/XP — keine Freischaltung mehr); Hören & Sprechen damit ab Tag 1 zugänglich
- [ ] Später: Tages-Session als Standardeinstieg („Heute für dich: 5 neue + 3 Wiederholungen + 1 Hörübung") — der eigentliche Duolingo-Faden

## Aktuell in Arbeit
- [ ] Alle Lernpfade gemeinsam durchgehen und verbessern
  - [x] Alphabet: didaktische Lern-Reihenfolge (Wie im Deutschen → Falsche Freunde → Neue Formen → Besonderheiten), Kleinbuchstaben auf Karten, Buchstaben-Auswahlmenü zum Wiederholen einzelner gelernter Buchstaben (ohne Fortschritts-Verfälschung)
  - [x] Alphabet: Lese-Belohnung (49 Wörter, schalten sich mit gelernten Buchstaben frei, mit Audio) + Verwechsler-Training (6 Paare, 10 Schnellfragen, 3 Fragetypen, +2 XP pro Treffer)
  - [x] Alphabet: 66 Alternativ-Lückensätze (s3/s4) — Wiederholungen rotieren jetzt die Satz-Paare; Ы-Satzfehler korrigiert ("собаки" endete auf и)
  - [x] Alphabet: aktives Lese-Quiz (hören→Wort / Wort→Bedeutung, 10 Fragen), Handschrift-Vorschau auf Lernkarte (kursiv), Meisterschafts-Sterne pro Buchstabe (1=gelernt, 2=wiederholt, 3=≥85% Trefferquote)
  - [x] Tracing/Nachzeichnen bewusst gestrichen (Entscheidung 12.06.2026)
  - [x] Vokabeln Bugfixes (12.06.2026): Themen-Wörter verdrängten die Grundlagen aus dem Anfänger-Pool (jetzt nach den 10 Kern-Basics eingefügt, richtige Reihenfolge); Themen-Karten ohne Antwortoptionen (werden jetzt generiert); Lernkarte zeigte Kategorie als „Aussprache" (jetzt echte Transliteration); Hilfe zeigt Aussprache wenn keine Eselsbrücke da
  - [x] Vokabeln: Themen-Menü gebaut (12.06.2026) — alle 7 Bereiche wählbar (Grundwortschatz 47 + Urlaub 25, Beruf 20, Familie 19, Kultur 16, Studium 12, Alltag 14 = 153 Karten), eigener Fortschritt pro Thema, Onboarding-Ziel als „⭐ Dein Ziel" markiert, alte 10-Wörter-Einmischung entfernt
  - [x] Vokabeln Groß-Ausbau (12.06.2026): 520 Top-Frequenz-Wörter in 6 Paketen (Pipeline: tools/top500.json + inject_top500.js); Wort-Paare-Spiel (3 Runden à 5 Paare); Beispielsätze antippbar mit Audio (alle ctx vertont); Richtungs-SRS (RU→DE/DE→RU getrennt); 4 fehlende Themen-Erfolge + 2 Top-100-Erfolge; Lern-Timer mit Tagesbilanz (Onboarding-Zeit läuft beim Lernen, Chip unten rechts, Bilanz-Popup bei Ablauf). Audio gesamt: 1.345 Clips / 19 MB
  - [ ] Vokabeln später: Themen-Karten ctx/mn ergänzen; Betonungszeichen; SRS-fällige Karten in neue Runden mischen; Distraktoren nach Wortart filtern
  - [ ] Grammatik (65 Karten in 5 Themen — Quiz-Form überdenken, Übersetze-die-Regel passt nicht)
  - [ ] Hören (78 — audio-first machen, Lernkarten zeigen das Wort als Text)
  - [ ] Sprechen (73 — braucht Internet für Spracherkennung! Offline-Hinweis nötig)
  - [ ] Sätze (25 — Modus wählbar machen statt Zufall)
  - [ ] Lesen (nur 3 Texte!) & Mini-Geschichten (nur 3) — Inhalt ausbauen
  - [x] Zahlen komplett überarbeitet (12.06.2026): Zahlen-Menü mit Zahlen-Trainer (🔊 hören→Ziffernfeld + Ziffer→Wort, Level-abhängig bis 20/100/1000, Audio für alle Zahlen 1–100 + Hunderter, zusammengesetzte >100 aus Teil-Clips), Hör-Verwechsler (12/20…19/90), Level-Bereiche neu (Uhrzeit/Geld nicht mehr Profi-exklusiv), Eselsbrücken fürs -надцать-Muster, Doppelkarte четвёртый/пятый getrennt
  - [x] Farben komplett überarbeitet (12.06.2026): Farben-Trainer mit echten Farbfeldern (Feld→Wort + Hören→Feld), голубой ergänzt (zwei Blaus!), светло-/тёмно--Präfixe, alle 3 Genus-Formen auf Lernkarten, 15 Beispielsätze mit Audio, Level-Bereiche angepasst
  - [ ] Wochentage (23)
  - [ ] Eigene Listen (`???`-Platzhalter in Quiz-Vorschlägen ersetzen)

## Erledigt (11.06.2026) — Offline-Audio
- [x] Vorlese-Stimme: 556 MP3-Clips (8 MB) mit Edge-TTS vorproduziert (ru-RU-SvetlanaNeural, −10 % Tempo) → `audio/`
  - Pipeline: `node tools/extract_texts.js` → `python tools/generate_audio.py` (inkrementell, bei neuen Inhalten einfach erneut laufen lassen)
  - `spk()` spielt Audio-Datei (Hash-Lookup FNV-1a), System-Stimme nur noch Fallback (z. B. eigene Vokabeln)
  - Alle Audios werden im Hintergrund in den SW-Cache geladen → Vorlesen komplett offline
  - Service Worker: Cache-first für Audio/Icons, Network-first für App-Shell
- [x] Spracherkennung: Hinweis wenn offline (alle 3 Mikrofon-Stellen)

## Demnächst (Offline)
- [ ] Spracherkennung nativ/offline → kommt mit Capacitor in der Play-Store-Phase (Android SpeechRecognizer + Offline-Sprachpaket)

## Später (Play Store, kostenpflichtig)
- [ ] Backup/Export des Fortschritts (localStorage geht beim Cache-Leeren verloren — 1-Sterne-Risiko!)
- [ ] Passwörter nicht im Klartext speichern (oder Login-Konzept vereinfachen)
- [ ] Weg wählen: TWA (Bubblewrap) oder Capacitor
- [ ] Google-Play-Developer-Konto, Datenschutzerklärung, Store-Eintrag, Screenshots
