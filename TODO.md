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

## Aktuell in Arbeit
- [ ] Alle Lernpfade gemeinsam durchgehen und verbessern
  - [ ] Alphabet (33 Karten — stärkster Pfad)
  - [ ] Vokabeln (47 Karten — Inhalt ausbauen)
  - [ ] Grammatik (65 Karten in 5 Themen — Quiz-Form überdenken, Übersetze-die-Regel passt nicht)
  - [ ] Hören (78 — audio-first machen, Lernkarten zeigen das Wort als Text)
  - [ ] Sprechen (73 — braucht Internet für Spracherkennung! Offline-Hinweis nötig)
  - [ ] Sätze (25 — Modus wählbar machen statt Zufall)
  - [ ] Lesen (nur 3 Texte!) & Mini-Geschichten (nur 3) — Inhalt ausbauen
  - [ ] Zahlen (53) / Farben (12) / Wochentage (23)
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
