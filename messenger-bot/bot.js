// Bot logic: decide a reply for an incoming text. Edit RULES to customise.
const RULES = [
  { match: /^(hi|hello|hey|হ্যালো|হাই|সালাম|assalamu)/i, reply: "আসসালামু আলাইকুম! আমি কীভাবে সাহায্য করতে পারি?\n\nলিখুন: price, hours, contact" },
  { match: /price|দাম|মূল্য/i, reply: "আমাদের দাম জানতে এখানে দেখুন: (আপনার লিংক/দাম লিখুন)" },
  { match: /hours|time|সময়|খোলা/i, reply: "আমরা প্রতিদিন সকাল ১০টা থেকে রাত ৯টা পর্যন্ত খোলা।" },
  { match: /contact|phone|ফোন|যোগাযোগ/i, reply: "যোগাযোগ: (আপনার ফোন নম্বর)" },
];

const FALLBACK = "ধন্যবাদ! আপনার মেসেজ পেয়েছি। শীঘ্রই একজন প্রতিনিধি উত্তর দেবেন।\n(লিখুন: price, hours, contact)";

function getReply(text) {
  const rule = RULES.find((r) => r.match.test(text || ""));
  return rule ? rule.reply : FALLBACK;
}

module.exports = { getReply };
