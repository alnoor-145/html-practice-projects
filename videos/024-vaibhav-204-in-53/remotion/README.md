# ভিডিও ০২৪: বৈভব সূর্যবংশী ৫৩ বলে ২০৪ (Remotion, ৯:১৬)

**নিয়ম:** প্রতিটা টপিকে **একটাই ভিডিও**। একই ফাইল Facebook (Al NUR) আর YouTube (Mr N Boy) দুই জায়গায় আপলোড হবে।
তাই ভিডিওতে দুই চ্যানেলই দেখায়:
- ওপরে বামে পিল: "Al NUR · Mr N Boy"।
- মাঝপথের Follow কার্ডে দুই সারি: Al NUR (Follow → Following) আর Mr N Boy (Subscribe → Subscribed)।
- শেষ দৃশ্যেও দুইটা ছোট পিল।
- ভয়েসে বলা থাকে "ফলো বা সাবস্ক্রাইব"।

## নতুন ভিডিও বানাতে
1. এই ফোল্ডারটা `videos/<নম্বর>-<নাম>/remotion/`-এ কপি করো (`node_modules`, `out`, `public/voice.mp3` বাদে)।
2. `package.json`-এ নাম আর `vXXX` বদলাও।
3. `tools/align.py`-এর `FIX`, `GLUE`, `MERGE` টপিক অনুযায়ী ঠিক করো, `tools/anchors.json`-এ দৃশ্যের বাক্যাংশ লেখো।
4. `src/Video.tsx`-এর দৃশ্যগুলো বদলাও। Follow-এর জন্য `FollowCard` আর `FollowPill` (lib.tsx) ব্যবহার করবে, নিজে কার্ড বানাবে না।

## রেন্ডার (Windows cmd, এই ফোল্ডারে)
```bash
npm install
```
```bash
npx remotion render src/index.ts Video out/video.mp4 --crf=20
```
আগে দেখে নিতে চাইলে:
```bash
npx remotion studio src/index.ts
```

## নতুন ভয়েস আর SRT দিলে
```bash
ffmpeg -i voice.mp3 -ac 1 -ar 44100 voice44.wav
```
```bash
python tools/align.py voice.srt voice44.wav src/timing.json tools/anchors.json
```
