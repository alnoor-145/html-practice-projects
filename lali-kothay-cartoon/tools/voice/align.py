"""
Finds who speaks when: matches the speaker lines in script_lines.py to the SRT
word timings and snaps every speaker change to a real pause in the audio.
Usage: python tools/voice/align.py tools/voice tools/voice/source tools/voice/lines.json
"""
import os, re, json, subprocess, sys, wave
import numpy as np
sys.path.insert(0, sys.argv[1])
from script_lines import PART1, PART2
AUD = sys.argv[2]

def read_wav(p):
    if not os.path.exists(p):  # decode the mp3 next to it
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p[:-4] + '.mp3', '-ac', '1', '-ar', '44100', '-f', 's16le', '-'],
                             capture_output=True, check=True).stdout
        return np.frombuffer(raw, np.int16).astype(np.float32) / 32768, 44100
    with wave.open(p) as w:
        sr = w.getframerate(); n = w.getnframes()
        x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768
    return x, sr

def parse_srt(p):
    txt = open(p, encoding='utf-8').read().strip().split('\n\n')
    cues = []
    for b in txt:
        lines = b.strip().split('\n')
        m = re.match(r'(\d+):(\d+):(\d+),(\d+) --> (\d+):(\d+):(\d+),(\d+)', lines[1])
        g = list(map(int, m.groups()))
        s = g[0]*3600+g[1]*60+g[2]+g[3]/1000; e = g[4]*3600+g[5]*60+g[6]+g[7]/1000
        cues.append((s, e, ' '.join(lines[2:])))
    return cues

def norm(t):
    t = re.sub(r'\[[^\]]*\]', '', t)
    return re.sub(r'[\s\-–—,।?!.;:\'"]', '', t)

def pauses(x, sr, thr_db=-38, min_len=0.07):
    hop = int(sr*0.005); win = int(sr*0.02)
    n = (len(x)-win)//hop
    rms = np.array([np.sqrt(np.mean(x[i*hop:i*hop+win]**2)+1e-12) for i in range(n)])
    db = 20*np.log10(rms)
    quiet = db < thr_db
    out = []; i = 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            s, e = i*hop/sr + 0.01, j*hop/sr + 0.01
            if e - s >= min_len: out.append((s, e))
            i = j
        else: i += 1
    return out, db

def align(part, lines):
    x, sr = read_wav(f'{AUD}/{part}.wav')
    cues = parse_srt(f'{AUD}/{part}.srt')
    stream = []  # (char, time)
    pz, db = pauses(x, sr)
    for s, e, t in cues:
        c = norm(t)
        # active (non-pause) sub-intervals of the cue
        segs = []; cur = s
        for a, b in pz:
            if b <= s or a >= e: continue
            if a > cur: segs.append((cur, min(a, e)))
            cur = max(cur, b)
        if cur < e: segs.append((cur, e))
        if not segs: segs = [(s, e)]
        tot = sum(b - a for a, b in segs)
        def at(frac):
            r = frac * tot
            for a, b in segs:
                if r <= b - a: return a + r
                r -= b - a
            return segs[-1][1]
        for k, ch in enumerate(c):
            stream.append((ch, at((k + 0.5) / len(c))))
    full = ''.join(ch for ch, _ in stream)
    pos = 0; spans = []
    for spk, text in lines:
        n = norm(text)
        idx = full.find(n, pos)
        if idx != pos:
            raise SystemExit(f'mismatch at {pos}: expected {n[:20]} got {full[pos:pos+20]} (found {idx})')
        spans.append([spk, text, idx, idx + len(n) - 1])
        pos = idx + len(n)
    assert pos == len(full), (pos, len(full))
    dur = len(x)/sr
    # speech onset/offset
    loud = np.where(db > -38)[0]
    t0 = loud[0]*0.005; t1 = min(dur, loud[-1]*0.005 + 0.03)
    res = []
    bounds = []
    for i in range(len(spans)-1):
        a = stream[spans[i][3]][1]; b = stream[spans[i+1][2]][1]
        est = (a + b) / 2
        cand = [p for p in pz if abs((p[0]+p[1])/2 - est) < 0.9]
        if len([p for p in cand if abs((p[0]+p[1])/2 - est) < 0.6]) > 1:
            print('  AMBIG', part, round(est,2), [(round(p[0],2), round(p[1],2)) for p in cand], spans[i][1][-12:], '|', spans[i+1][1][:12])
        if cand:
            p = min(cand, key=lambda p: abs((p[0]+p[1])/2 - est) - 0.4*min(p[1]-p[0], 0.5))
            bounds.append((p[0] + 0.02, p[1] - 0.02, True))
        else:
            bounds.append((est, est, False))
    for i, (spk, text, ci, cj) in enumerate(spans):
        s = t0 if i == 0 else bounds[i-1][1]
        e = t1 if i == len(spans)-1 else bounds[i][0]
        words = []; k = ci
        for wtxt in text.split():
            n = len(norm(wtxt))
            if n == 0:
                continue
            ws = stream[k][1]; we = stream[k + n - 1][1]
            words.append([wtxt, round(max(s, ws - 0.06), 3), round(min(e, we + 0.08), 3)])
            k += n
        res.append(dict(speaker=spk, text=text, start=round(s, 3), end=round(e, 3), words=words,
                        snapped=(bounds[i][2] if i < len(bounds) else True)))
    return res, dur

out = {}
for part, lines in (('part1', PART1), ('part2', PART2)):
    res, dur = align(part, lines)
    out[part] = dict(duration=round(dur, 3), lines=res)
    for r in res:
        continue
        print(part, f"{r['start']:7.2f}-{r['end']:7.2f}", r['speaker'][:8].ljust(8), '' if r['snapped'] else 'NOSNAP', r['text'][:40])
json.dump(out, open(f'{sys.argv[3]}', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# manual fixes for THIS recording, checked on pitch/intensity traces (remove for new audio)
OVR = {('part2', 6): {'end': 28.97}, ('part2', 7): {'start': 29.22}}
for (p, i), d in OVR.items():
    out[p]['lines'][i].update(d)
json.dump(out, open(f'{sys.argv[3]}', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
