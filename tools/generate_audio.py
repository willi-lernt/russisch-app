# Generiert MP3-Audio für alle Texte aus tools/texts.json → audio/<hash>.mp3
# Stimme: ru-RU-SvetlanaNeural (Microsoft Edge-TTS, neural, kostenlos)
# Aufruf: python tools/generate_audio.py
# Bereits vorhandene Dateien werden übersprungen (inkrementell).
import asyncio
import json
import os
import sys

import edge_tts

VOICE = "ru-RU-SvetlanaNeural"
RATE = "-10%"  # etwas langsamer für Lernende (App nutzte rate 0.8)
CONCURRENCY = 6

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(HERE, "..", "audio")


def fnv1a(text: str) -> str:
    """FNV-1a 32-Bit über UTF-8-Bytes — identisch zu audioKey() in index.html."""
    h = 0x811C9DC5
    for b in text.encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return format(h, "08x")


def speakable(text: str) -> str:
    """Schrägstrich-Varianten ('он / она') als Aufzählung sprechen."""
    return text.replace(" / ", ", ").replace("/", ", ")


async def gen_one(sem, text, fname, results):
    out = os.path.join(AUDIO_DIR, fname)
    if os.path.exists(out) and os.path.getsize(out) > 0:
        results["skipped"] += 1
        return
    async with sem:
        for attempt in range(3):
            try:
                tts = edge_tts.Communicate(speakable(text), VOICE, rate=RATE)
                await tts.save(out)
                results["ok"] += 1
                done = results["ok"] + results["skipped"] + results["failed"]
                if done % 50 == 0:
                    print(f"  {done}/{results['total']} ...", flush=True)
                return
            except Exception as e:
                if attempt == 2:
                    results["failed"] += 1
                    results["errors"].append((text, str(e)))
                else:
                    await asyncio.sleep(2 * (attempt + 1))


async def main():
    with open(os.path.join(HERE, "texts.json"), encoding="utf-8") as f:
        texts = json.load(f)
    os.makedirs(AUDIO_DIR, exist_ok=True)

    mapping = [{"f": fnv1a(t) + ".mp3", "t": t} for t in texts]
    # Hash-Kollisionen prüfen
    seen = {}
    for m in mapping:
        if m["f"] in seen and seen[m["f"]] != m["t"]:
            print(f"KOLLISION: '{m['t']}' und '{seen[m['f']]}' -> {m['f']}")
            sys.exit(1)
        seen[m["f"]] = m["t"]

    results = {"ok": 0, "skipped": 0, "failed": 0, "errors": [], "total": len(mapping)}
    sem = asyncio.Semaphore(CONCURRENCY)
    await asyncio.gather(*(gen_one(sem, m["t"], m["f"], results) for m in mapping))

    # Manifest für den Offline-Download der App
    with open(os.path.join(AUDIO_DIR, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump([m["f"] for m in mapping], f, indent=0)

    print(f"\nFertig: {results['ok']} generiert, {results['skipped']} übersprungen, {results['failed']} fehlgeschlagen")
    for t, e in results["errors"][:10]:
        print(f"  FEHLER bei '{t}': {e}")
    size = sum(os.path.getsize(os.path.join(AUDIO_DIR, x)) for x in os.listdir(AUDIO_DIR))
    print(f"Gesamtgröße audio/: {size/1024/1024:.1f} MB")


if __name__ == "__main__":
    asyncio.run(main())
