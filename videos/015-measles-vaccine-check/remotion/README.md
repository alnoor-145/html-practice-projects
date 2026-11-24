# ভিডিও ০১৫: আট মাস পর হামে মৃত্যুশূন্য দিন (Remotion, ৯:১৬)

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
npx remotion render src/index.ts Facebook out/v015-facebook.mp4 --crf=20
```
```bash
npx remotion render src/index.ts YouTube out/v015-youtube.mp4 --crf=20
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
| `src/Video.tsx` | ১১টা দৃশ্য: ২৩ নভেম্বর, মৃত্যু শূন্য (হুক), একই দিনে ১,৪১৭ রোগী, Follow, ১,৩৫২ শিশুর মৃত্যু, ১০ জনে ৯ জন, টিকা আর কার্ড, কার্ড দেখুন, লক্ষণ, বিপদের চিহ্ন, শেয়ার, কমেন্ট আর শেষ কার্ড |

## নতুন SRT দিলে
```bash
ffmpeg -i voice.mp3 -ac 1 -ar 44100 voice44.wav
```
```bash
python tools/align.py voice.srt voice44.wav src/timing.json tools/anchors.json
```
