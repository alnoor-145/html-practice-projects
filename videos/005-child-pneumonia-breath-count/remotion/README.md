# ভিডিও ০০৫: শিশুর নিউমোনিয়া: এক মিনিট শ্বাস গুনুন (Remotion, ৯:১৬)

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
npx remotion render src/index.ts Facebook out/v005-facebook.mp4 --crf=20
```
```bash
npx remotion render src/index.ts YouTube out/v005-youtube.mp4 --crf=20
```
আগে দেখে নিতে চাইলে:
```bash
npx remotion studio src/index.ts
```

## দরকারি ফাইল
| ফাইল | কী |
|---|---|
| `public/voice.mp3` | ভয়েসওভার, ভলিউম ঠিক করা |
| `src/timing.json` | প্রতিটা শব্দের সময় আর দৃশ্য বদলের মুহূর্ত |
| `tools/align.py` | SRT আর অডিও থেকে `timing.json` বানায় (`tools/anchors.json`-এর বাক্যাংশ ধরে) |
| `src/lib.tsx` | থিম, ফন্ট, ক্যাপশন, স্টিকার, চরিত্র, ফোন, ওডোমিটার, টগল, আইরিস |
| `src/Video.tsx` | ১১টা দৃশ্য: ঘড়ি আর ঘুমন্ত শিশু (হুক), ইউনিসেফের হিসাব, Follow, স্বাভাবিক বনাম দ্রুত শ্বাস, কীভাবে গুনবেন, বয়স অনুযায়ী সীমা, ডাক্তার, বিপদের লক্ষণ, সতর্কতা বনাম চিকিৎসা, শেয়ার, কমেন্ট আর শেষ কার্ড |

## নতুন SRT দিলে
```bash
ffmpeg -i voice.mp3 -ac 1 -ar 44100 voice44.wav
```
```bash
python tools/align.py voice.srt voice44.wav src/timing.json tools/anchors.json
```
