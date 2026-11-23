# ভিডিও ০০২: শীতে জমে থাকা গ্যাস (Remotion, ৯:১৬)

একটা ভয়েস, দুইটা সংস্করণ:
| কম্পোজিশন | কোথায় দেবেন | ব্র্যান্ড |
|---|---|---|
| `Facebook` | Facebook Reels | Al NUR · Follow |
| `YouTube` | YouTube Shorts | Mr N Boy · Subscribe |

## রেন্ডার (Windows cmd, এই ফোল্ডারে)
```bash
npm install
```
```bash
npx remotion render src/index.ts Facebook out/v002-facebook.mp4 --crf=20
```
```bash
npx remotion render src/index.ts YouTube out/v002-youtube.mp4 --crf=20
```
আগে দেখে নিতে চাইলে:
```bash
npx remotion studio src/index.ts
```

## দরকারি ফাইল
| ফাইল | কী |
|---|---|
| `public/voice.mp3` | ভয়েসওভার, ভলিউম -16 LUFS-এ ঠিক করা (git-এ রাখা হয় না) |
| `src/timing.json` | প্রতিটা শব্দের সময় আর দৃশ্য বদলের মুহূর্ত |
| `tools/align.py` | SRT আর অডিও থেকে `timing.json` বানায়, `tools/anchors.json`-এর বাক্যাংশ ধরে |
| `src/lib.tsx` | থিম, ফন্ট, ক্যাপশন (৯:১৬), স্টিকার, চরিত্র, ফোন, ওডোমিটার, টগল, আইরিস |
| `src/Video.tsx` | ১০টা দৃশ্য: রান্নাঘরের কাটা-দৃশ্য (রাত থেকে ভোর), আসল ঘটনা, Follow, গল্প, ফায়ার সার্ভিসের ধারণা, পোড়া রোগীর বার, ৩ নিয়ম (ব্লুপ্রিন্ট), কথা ছাড়া শেষ দৃশ্য |

## নতুন ভয়েস বা SRT দিলে
```bash
ffmpeg -i voice.mp3 -ac 1 -ar 44100 -c:a pcm_s16le voice44.wav
```
```bash
python tools/align.py voice.srt voice44.wav src/timing.json tools/anchors.json
```
```bash
ffmpeg -y -i voice44.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -ac 1 -b:a 192k public/voice.mp3
```
স্ক্রিপ্ট বদলালে `tools/anchors.json`-এর বাক্যাংশগুলোও বদলাতে হবে। এগুলো দিয়েই ঠিক হয় কোন দৃশ্য কখন আসবে।

## ফন্ট
Baloo Da 2 আর Poppins (SIL Open Font License), `public/fonts/`-এ।
