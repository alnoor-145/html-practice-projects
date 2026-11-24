const assert = require("assert");
const { getReply } = require("./bot");
assert(getReply("Hello").includes("সাহায্য"));
assert(getReply("what is the price?").includes("দাম"));
assert(getReply("asdf").includes("ধন্যবাদ"));
console.log("ok");
