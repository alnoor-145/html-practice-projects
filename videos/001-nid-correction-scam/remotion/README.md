# ভিডিও ০০১: NID সংশোধনের প্রতারণা (Remotion প্রজেক্ট)

tazim-style স্কিলের নিজস্ব পরিচয়ে বানানো। এতে আছে:
- সাইরেন থিম, ভায়োলেট সিগনেচার রং
- কাচের-বার ক্যাপশন, গোল-মাথা ক্যারেক্টার, ডাই-কাট স্টিকার
- আইরিস ট্রানজিশন, Follow টগল, আউট্রো কমেন্ট-ফানেল

## দরকারি ফাইল
| ফাইল | কী |
|---|---|
| `public/voice.mp3` | ভয়েসওভার (git-এ রাখা হয় না)। ElevenLabs-এর MP3 থেকে বানানো, ভলিউম -16 LUFS-এ ঠিক করা। |
| `src/timing.json` | প্রতিটা শব্দের সময়, ক্যাপশনের ভাগ আর দৃশ্য বদলের মুহূর্ত। `tools/align.py` দিয়ে SRT আর অডিও থেকে বানানো। |
| `src/lib.tsx` | থিম, ফন্ট, ক্যাপশন, স্টিকার, ক্যারেক্টার, ফোন, ওডোমিটার, টগল, আইরিস |
| `src/Video.tsx` | ১৫টা দৃশ্য (S1–S15) আর পুরো টাইমলাইন |

## নতুন ভয়েস বা SRT দিলে
```bash
ffmpeg -i voice.mp3 -ac 1 -ar 44100 -c:a pcm_s16le /tmp/voice44.wav
```
```bash
python3 tools/align.py voice.srt /tmp/voice44.wav src/timing.json
```
```bash
ffmpeg -y -i /tmp/voice44.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -ac 1 -b:a 192k public/voice.mp3
```
`align.py`-এর শেষে `anchor(...)` তালিকাটা নতুন স্ক্রিপ্টের শব্দের সাথে মিলিয়ে নিতে হবে।

## রেন্ডার
```bash
npm install
```
```bash
npx remotion render src/index.ts Video out/v001-nid-correction-scam.mp4 --crf=20
```
কয়েকটা মুহূর্তের ছবি দেখতে চাইলে (সেকেন্ডে):
```bash
node stills.mjs out 3.8 27.2 85.6
```

## ফন্ট
Baloo Da 2 আর Poppins। দুটোই SIL Open Font License, `public/fonts/`-এ রাখা।
