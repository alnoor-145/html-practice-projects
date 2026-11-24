# ভিডিও ০০৬: কম্বোডিয়ায় "কম্পিউটারের চাকরি"র ফাঁদ (Remotion, ৯:১৬)

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
npx remotion render src/index.ts Facebook out/v006-facebook.mp4 --crf=20
```
```bash
npx remotion render src/index.ts YouTube out/v006-youtube.mp4 --crf=20
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
| `src/Video.tsx` | ১৩টা দৃশ্য: চাকরির বিজ্ঞাপন (হুক), কম্বোডিয়ায় নেমে স্ক্যাম কম্পাউন্ড, Follow, ৪ দিনে ২২১ জন, ১৬ হাজার ছাড়পত্র আর ১,০০০+ আটকা, দালালের ফি, ৩টা লাল সংকেত, যাচাইয়ের ঠিকানা, শেয়ার, কমেন্ট আর শেষ কার্ড |

## নতুন SRT দিলে
```bash
ffmpeg -i voice.mp3 -ac 1 -ar 44100 voice44.wav
```
```bash
python tools/align.py voice.srt voice44.wav src/timing.json tools/anchors.json
```
