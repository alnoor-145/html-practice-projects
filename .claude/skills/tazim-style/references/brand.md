# চ্যানেলের ব্র্যান্ড (Al NUR / Mr N Boy)

**আসল উৎস:** `alnoor-145/content-engine` রিপোর এই তিনটা জায়গা:
- `src/brand/theme.ts` (`BRANDS` আর `theme`)
- `README.md`
- `JOURNEY.md`

সেখানে কিছু বদলালে সেটাই মানবে, আর এই ফাইলটা মিলিয়ে নেবে। এখানের মানগুলো তোলা হয়েছে ২০২৬-১১-২৩ তারিখে।

## প্ল্যাটফর্ম অনুযায়ী পরিচয়
| | Facebook | YouTube |
|---|---|---|
| নাম | **Al NUR** | **Mr N Boy** |
| হ্যান্ডেল | Al NUR | @SubscribeYt_1 |
| লিংক | https://www.facebook.com/share/1HYnZ8SaYY/ | https://www.youtube.com/@SubscribeYt_1 |
| বাটন (আগে → পরে) | Follow → Following | Subscribe → Subscribed |
| শেষ CTA-র লেখা | FOLLOW | SUBSCRIBE |
| বাটনের প্ল্যাটফর্ম-রং | `#1877F2` | `#FF0000` |
| content-engine-এর ফরম্যাট | `fbReel` (৯:১৬), `fbSquare` (১:১), `fbFeed` (৪:৫) | `youtube` (১৬:৯), `short` (৯:১৬) |

## লোগো
- **লোগোর কোনো ছবি এখনো কোথাও সেভ নেই।** দুইটা রিপো আর সব ব্রাঞ্চ খুঁজে দেখা হয়েছে।
- content-engine-এর `SubscribeCTA` নামের প্রথম অক্ষর দিয়ে অবতার বানায়। তাই এখন লোগো মানে বৃত্তের ভেতর আদ্যক্ষর:
  - Facebook: "A"
  - YouTube: "M"
- ব্যবহারকারী লোগোর ছবি দিলে content-engine-এর `public/brand/`-এ রাখবে, এই ফাইলে পথ লিখবে, আর লোগো-পিলে আদ্যক্ষরের বদলে সেটা বসাবে।

## brand theme-এর রং (content-engine)
| নাম | রং | tazim-style সিরিজে ব্যবহার |
|---|---|---|
| background | `#0B0F1A` | গাঢ় থিমের সাধারণ ভিত্তি (টপিকের থিম না মিললে) |
| surface | `#151B2E` | কার্ড, কাচের ক্যাপশন-বার |
| primary | `#FF4D6D` | `danger` (বিপদ, টাকা হারানো) |
| secondary | `#4DD4FF` | `info` (তথ্য, সূত্র, সংযোগের রেখা) |
| accent | `#FFD84D` | **এই সিরিজে প্রধান রং হিসেবে ব্যবহার নিষেধ** (Tazim-এর হলুদের কাছাকাছি) |
| text / muted | `#F5F7FF` / `#8A93B2` | লেখা |

সিরিজের নিজস্ব প্রধান রং ভায়োলেট `#8B6CFF` (SKILL.md অংশ ৬.১)।

## ফন্ট
- **content-engine-এ আছে:** Poppins (ইংরেজি), Inter (বডি), Hind Siliguri (বাংলা)।
- **এই সিরিজের ফন্ট:**
  - বাংলা: **Baloo Da 2**। content-engine-এ যোগ করতে হবে `@remotion/google-fonts/BalooDa2` দিয়ে। আগের `lali-kothay-cartoon` প্রজেক্টে এই ফন্ট ব্যবহার হয়েছিল।
  - ইংরেজি আর সংখ্যা: **Poppins**।

## রিসোর্স-লিংক
নিজস্ব শর্ট-লিংকের ডোমেইন নেই। তাই আউট্রোতে লিংক-পিল দেখাবে না, যতক্ষণ না ব্যবহারকারী একটা দেয়।
- Facebook: রিসোর্স যায় comment-to-DM দিয়ে।
- YouTube: রিসোর্স থাকে description বা pinned comment-এ।
