#!/usr/bin/env python3
"""Transcribe audio files (opus/mp3/m4a/wav/…) via Groq's Whisper endpoint.

Usage:
    export GROQ_API_KEY=gsk_...
    python3 tools/transcribe.py path/to/audio.opus [more.opus ...]

Model: whisper-large-v3-turbo (Whisper-quality, ~$0.04/hr, ~200x realtime).
Swap GROQ_BASE_URL + GROQ_API_KEY for OpenAI's api.openai.com/v1 to run
against gpt-4o-mini-transcribe with the same code.
"""
import os
import sys
from pathlib import Path
from urllib.error import HTTPError

from openai import OpenAI

BASE_URL = os.environ.get("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
MODEL = os.environ.get("TRANSCRIBE_MODEL", "whisper-large-v3-turbo")


def main(paths):
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        sys.exit("GROQ_API_KEY is not set")
    client = OpenAI(base_url=BASE_URL, api_key=key)
    for p in paths:
        path = Path(p)
        if not path.is_file():
            print(f"[skip] {p}: not a file", file=sys.stderr)
            continue
        with path.open("rb") as f:
            resp = client.audio.transcriptions.create(
                model=MODEL,
                file=f,
                response_format="verbose_json",
            )
        lang = getattr(resp, "language", "?")
        text = resp.text.strip()
        print(f"===== {path.name}  [language: {lang}] =====")
        print(text)
        print()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    try:
        main(sys.argv[1:])
    except HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode(errors='replace')}")
