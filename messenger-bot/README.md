# Messenger Auto-Reply Bot

কোনো dependency লাগে না (Node.js 18+)।

## ফাইল
- `bot.js` — রিপ্লাইয়ের নিয়ম (`RULES`)। এখানে আপনার দাম/সময়/ফোন নম্বর বসান।
- `server.js` — Meta webhook সার্ভার (সিগনেচার যাচাই সহ)।
- `.env.example` — প্রয়োজনীয় সিক্রেটের তালিকা।

## Setup ধাপ
1. https://developers.facebook.com → **Create App** → type: **Business**।
2. App-এ **Messenger** প্রোডাক্ট যোগ করুন → **Messenger API Settings**।
3. আপনার Facebook Page connect করে **Page Access Token** generate করুন।
4. **App settings → Basic** থেকে **App Secret** নিন।
5. `.env.example` কপি করে `.env` বানান, তিনটা মান বসান (`VERIFY_TOKEN` আপনি নিজে বানাবেন)।
6. সার্ভার চালান: `npm start`।
7. পাবলিক HTTPS URL লাগবে। টেস্টের জন্য `ngrok http 3000`, স্থায়ীভাবে Render/Railway/Fly.io-র ফ্রি টায়ার।
8. Meta-র **Webhooks** সেকশনে Callback URL দিন: `https://আপনার-ডোমেইন/webhook`, Verify Token: `.env`-এর `VERIFY_TOKEN`।
9. Webhook field **messages** subscribe করুন এবং Page-টা app-এর সাথে subscribe করুন।
10. Page-এ message পাঠিয়ে টেস্ট করুন।

## সতর্কতা
- `.env` বা token কখনো GitHub-এ commit/chat-এ পাঠাবেন না।
- App **Development mode**-এ শুধু admin/tester রা রিপ্লাই পাবে। সবার জন্য চালাতে Meta **App Review** (pages_messaging) ও **Live mode** লাগবে।
- Messenger নিয়ম: ইউজার মেসেজ করার ২৪ ঘণ্টার মধ্যেই বট রিপ্লাই দিতে পারে।
