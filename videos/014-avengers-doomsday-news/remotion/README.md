# ভিডিও ০১৪: Avengers: Doomsday কবে আসছে? (Remotion, ৯:১৬)

শুধু YouTube Shorts (Mr N Boy)। চাইলে `Facebook` কম্পোজিশনও আছে (Al NUR ব্র্যান্ড)।

## রেন্ডার (Windows cmd, এই ফোল্ডারে)
```bash
npm install
```
```bash
npx remotion render src/index.ts YouTube out/v014-youtube.mp4 --crf=20
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
| `src/lib.tsx` | থিম (সিনেমা হল), ফন্ট, ক্যাপশন, স্টিকার, চরিত্র, ওডোমিটার, টগল, আইরিস |
| `src/Video.tsx` | ১৪টা দৃশ্য: হিরো থেকে ভিলেন (হুক), ৩ প্রশ্ন, Follow, মুক্তির তারিখ, পরিচালক, ডক্টর ডুম, স্টিভ রজার্স, দল, ৫০ কোটি ভিউ, অগ্রিম টিকিট, বাংলাদেশ, শেয়ার, পোল, শেষ কার্ড |

## কপিরাইট
ট্রেলারের দৃশ্য, পোস্টার, লোগো, চরিত্রের আঁকা ছবি বা অভিনেতাদের ছবি ব্যবহার করা হয়নি। সব গ্রাফিক্স কোডে আঁকা।

## নতুন SRT দিলে
```bash
ffmpeg -i voice.mp3 -ac 1 -ar 44100 voice44.wav
```
```bash
python tools/align.py voice.srt voice44.wav src/timing.json tools/anchors.json
```
