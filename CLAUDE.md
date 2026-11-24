# Notes for Claude — this user's video requests

Two kinds of video work. Pick the matching rules:
- **Motion-graphics / explainer video from an SRT** → follow
  `EXPLAINER_VIDEO_INSTRUCTIONS.md` exactly (Bangla, short replies; asset loop →
  analysis → the three questions → build → verify stills → preview mode by default).
  @EXPLAINER_VIDEO_INSTRUCTIONS.md
- **Story cartoon with characters (2D animation)** → the rules below.

# 2D cartoon requests

The user makes Bangla kids' cartoons (YouTube). They supply: ElevenLabs voice MP3s,
SRT files, and a ZIP of character/background pictures. They render the Remotion
project themselves (give them a ZIP of the project, not a rendered video, unless asked).

## Rule for every 2D animation request (the user's own words, summarised)
- Whatever the user gives (pictures, files, a ZIP), **every character in the video must be
  animated**: legs, hands/arms, mouth, eyes, head — and wings/tails/ears for animals.
- If an asset is only a **still picture**, Claude must create the animation from it
  itself (split it into parts and rig it, or redraw it as a rigged vector character in
  the same look). Placing the still picture on screen and moving it as one piece is
  NOT animation.
- If an asset is **already animated** (sprite sheet, GIF/video, Lottie, a rigged file
  with separate parts), use that animation as it is.
- Mouth movement must be clearly visible from a normal viewing distance (big, readable
  mouth shapes in sync with the voice), not a small overlay patch.

## Feedback on the first project (`lali-kothay-cartoon/`) — must fix next time
- The picture ZIP is a **style/design reference only** ("characters should look like this").
  Do NOT just cut the pictures out and slide them around as one stiff piece.
- In "Lali kothay?" the humans' arms and legs never moved: walking/running was only
  a bounce + slide. The dog's legs barely moved, the hen's wings barely moved.
  The user found this not acceptable.
- Every character must be properly **rigged and animated**:
  - Rebuild each character as separate parts (head, neck, torso, upper arm, forearm,
    hand, thigh, shin, foot; hair/clothes pieces) — redraw in vector/SVG in the style
    of the reference pictures if the pictures cannot be split cleanly.
  - Animals: 4 jointed legs with a real quadruped gait (dog, cow, cat), tail, ears;
    birds: wings that flap, legs that step, head bob.
  - Real walk and run cycles: arms swing opposite to legs, feet planted (no sliding),
    body rises/falls with steps, anticipation and overshoot.
  - Acting with hands while talking: pointing, waving, hands on head when crying,
    hands on hips when angry, gripping the rope when pulling, giving/taking objects.
  - Secondary motion: hair, clothes, ears, tails follow through.
- Keep what worked: one fixed voice per character for the whole story, lip-sync from
  the voice, blinks, karaoke Bangla subtitles, camera punch-in on the speaker,
  sound effects + music, scene cuts tied to the SRT timing.

(বাংলায়: ছবি বা ফাইল যেমনই হোক, ভিডিওর সব চরিত্রের হাত, পা, মুখ, চোখ নড়বে। শুধু স্থির ছবি হলে Claude নিজেই সেটা থেকে অ্যানিমেশন বানাবে; আগে থেকে অ্যানিমেশন থাকলে সেটাই ব্যবহার করবে।
 জিপের ছবি শুধু চরিত্র দেখতে কেমন হবে বোঝার জন্য। আসল কাজ — চরিত্রের হাত, পা,
ডানা, লেজ সব আলাদা করে নড়বে; হাঁটা-দৌড়ে হাত-পা ঠিকমতো চলবে।)
