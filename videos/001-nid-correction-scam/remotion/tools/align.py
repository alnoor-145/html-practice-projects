# SRT cues (ElevenLabs) + audio energy -> per-word timings, caption chunks and scene anchors.
import sys, re, json, numpy as np, wave
srt_path, wav_path, out_path = sys.argv[1:4]
BN = str.maketrans('0123456789', '০১২৩৪৫৬৭৮৯')
FIX = [(r'\[[^\]]*\]\s*', ''), (r'16 November', '১৬ নভেম্বর'), (r'\bECর', 'ইসির'), (r'\bECকে', 'ইসিকে'),
       (r'\bEC\b', 'ইসি'), (r'\bGD\b', 'জিডি'), (r'social mediaয়', 'সোশ্যাল মিডিয়ায়'), (r'online\s+এ', 'online-এ'),
       (r'([A-Za-z0-9]) (এ|তে)(?=[\s,।?"]|$)', r'\1-\2')]
def clean(t):
    t = ' '.join(t.split())
    for a, b in FIX: t = re.sub(a, b, t)
    return t.translate(BN).strip()
def ts(s):
    h, m, r = s.split(':'); sec, ms = r.split(','); return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000
cues = []
for block in re.split(r'\n\s*\n', open(srt_path, encoding='utf-8').read().strip()):
    lines = block.strip().splitlines()
    a, b = [ts(x.strip()) for x in lines[1].split('-->')]
    text = clean(' '.join(lines[2:]))
    if text: cues.append((a, b, text))
w = wave.open(wav_path); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
hop = int(0.01 * sr); n = len(x) // hop
db = 20 * np.log10(np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
voiced = db > -45
def segments(a, b):
    i0, i1 = int(a * 100), min(n, int(b * 100) + 1)
    segs, cur = [], None
    for i in range(i0, i1):
        if voiced[i]:
            if cur is None: cur = [i, i]
            else: cur[1] = i
        elif cur is not None and i - cur[1] > 12:   # gap > 120 ms ends a segment
            segs.append(cur); cur = None
    if cur: segs.append(cur)
    segs = [(s / 100, (e + 1) / 100) for s, e in segs]
    return segs or [(a, b)]
def weight(word):
    core = re.sub(r'[^\wঀ-৿]', '', word)
    return max(1, len(core)) + 1.5
words = []
for a, b, text in cues:
    toks = text.split(' ')
    segs = segments(a, b)
    total = sum(e - s for s, e in segs)
    wts = np.array([weight(t) for t in toks], dtype=float); wts = wts / wts.sum() * total
    # walk along voiced time, skipping silent gaps
    seg_i, pos = 0, segs[0][0]
    for t, d in zip(toks, wts):
        start = pos; remain = d
        while remain > 1e-6:
            s, e = segs[seg_i]
            room = e - pos
            if remain <= room + 1e-6: pos += remain; remain = 0
            else:
                remain -= room
                seg_i = min(seg_i + 1, len(segs) - 1); pos = segs[seg_i][0]
                if seg_i == len(segs) - 1 and remain > segs[-1][1] - pos: pos = segs[-1][1]; remain = 0
        # if the word starts at the very end of a segment, move it to the next one
        if seg_i < len(segs) and abs(start - segs[seg_i][1]) < 0.03 and seg_i + 1 < len(segs): start = segs[seg_i + 1][0]
        words.append({'text': t, 'start': round(start, 3), 'end': round(max(pos, start + 0.08), 3)})
# caption chunks: up to 4 words / ~24 chars, break after sentence punctuation
chunks, cur = [], []
def flush():
    if cur: chunks.append({'start': words[cur[0]]['start'], 'end': words[cur[-1]]['end'], 'words': list(cur)})
for i, wd in enumerate(words):
    if cur and wd['text'].startswith('"'):
        flush(); cur = []
    cur.append(i)
    chars = sum(len(words[j]['text']) for j in cur)
    gap_next = (words[i + 1]['start'] - wd['end']) if i + 1 < len(words) else 9
    soft = re.search(r'[,:;]$', wd['text']) and len(cur) >= 2
    if len(cur) >= 4 or chars >= 24 or re.search(r'[।?!]["”]?$', wd['text']) or soft or gap_next > 0.35:
        flush(); cur = []
flush()
for k in range(len(chunks) - 1):   # hold each chunk until the next starts if the gap is short
    if chunks[k + 1]['start'] - chunks[k]['end'] < 0.5: chunks[k]['end'] = chunks[k + 1]['start']
full = ' '.join(wd['text'] for wd in words)
def anchor(phrase, nth=1):
    toks = phrase.split(' '); hits = 0
    for i in range(len(words) - len(toks) + 1):
        if all(words[i + k]['text'].startswith(toks[k]) for k in range(len(toks))):
            hits += 1
            if hits == nth: return words[i]['start']
    raise SystemExit('anchor not found: ' + phrase)
A = {
 'bank': anchor('ব্যাংক বলছে'), 'thokhon': anchor('ঠিক তখনই'), 'quote': anchor('"আমি নির্বাচন'),
 'kintu': anchor('কিন্তু নির্বাচন'), 'nov16': anchor('১৬ নভেম্বর'), 'dhore': anchor('ধরে নিন'),
 'follow': anchor('এমন নতুন'), 'why': anchor('এই ফাঁদ'), 'opekkha': anchor('অপেক্ষা।'),
 'bochore': anchor('বছরে প্রায়'), 'lakher': anchor('লাখের বেশি'), 'maser': anchor('মাসের পর'),
 'tar_upor': anchor('তার উপর'), 'fb_ad': anchor('Facebook-এ বিজ্ঞাপন'), 'tahole': anchor('তাহলে আসল'),
 'ek': anchor('এক,'), 'dui': anchor('দুই,'), 'fee_online': anchor('ফি দিতে'), 'personal': anchor('কোনো মানুষের'),
 'fee230': anchor('কার্ডের তথ্য'), 'tin': anchor('তিন,'), 'office': anchor('সরাসরি উপজেলা'),
 'dalal': anchor('অনেকে ভাবেন'), 'jodi': anchor('আর যদি'), 'screenshot': anchor('নম্বরের screenshot'),
 'bkash': anchor('বিকাশে পাঠালে'), 'thana': anchor('কাছের থানায়'), 'jader': anchor('যাদের NID'),
 'family': anchor('তাই ভিডিওটা'), 'outro': anchor('আসল ওয়েবসাইটে'), 'comment': anchor('কমেন্টে লিখুন NID'),
 'question': anchor('আর আপনার'), 'end': words[-1]['end'],
}
json.dump({'words': words, 'chunks': chunks, 'anchors': A, 'duration': round(len(x) / sr, 3)}, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('cues', len(cues), 'words', len(words), 'chunks', len(chunks))
print('anchors:', {k: round(v, 2) for k, v in A.items()})
print('chunks:'); [print(' %.2f-%.2f  %s' % (c['start'], c['end'], ' '.join(words[i]['text'] for i in c['words']))) for c in chunks]
