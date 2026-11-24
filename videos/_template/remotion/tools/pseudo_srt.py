# When only the voice MP3 arrives (no SRT): build a sentence-level SRT from the script text and the pauses in the audio.
# usage: python pseudo_srt.py voice44.wav out.srt part1.txt [part2.txt ...]
# Sentences end at । ? ! ; each sentence boundary is snapped to a pause, chosen by dynamic programming so that
# sentence durations stay proportional to their length. Prints the fit error (lower = the script matches the audio).
import sys, re, wave, numpy as np
wav, out = sys.argv[1:3]
text = ' '.join(open(p, encoding='utf-8').read() for p in sys.argv[3:])
text = re.sub(r'\[[^\]]*\]', ' ', text)
text = ' '.join(text.split())
sents = [s.strip() for s in re.findall(r'[^।?!]+[।?!]?', text) if s.strip()]
w = wave.open(wav); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
hop = int(0.01 * sr); n = len(x) // hop
db = 20 * np.log10(np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
voiced = db > -42
idx = np.where(voiced)[0]; t0, t1 = idx[0] / 100, (idx[-1] + 1) / 100
# pauses: runs of silence >= 0.15 s inside the speech
pauses = []; i = idx[0]
while i < idx[-1]:
    if not voiced[i]:
        j = i
        while j < n and not voiced[j]: j += 1
        if j - i >= 15: pauses.append(((i + j) / 200, (j - i) / 100))
        i = j
    else: i += 1
P = [p for p, _ in pauses]; L = [l for _, l in pauses]
wts = np.array([len(re.sub(r'\s', '', s)) + 4 for s in sents], float)
N, M = len(sents), len(P)
speech = t1 - t0 - sum(L) * 0.5
rate = speech / wts.sum()
INF = 1e18
# cost[k][j]: first k sentences end at pause j (j = -1 means start)
cost = np.full((N + 1, M + 1), INF); back = np.zeros((N + 1, M + 1), int)
pos = [t0] + P
cost[0][0] = 0
for k in range(1, N):
    for j in range(1, M + 1):
        best, arg = INF, 0
        for i in range(0, j):
            if cost[k - 1][i] >= INF: continue
            d = pos[j] - pos[i]; e = (d - wts[k - 1] * rate) ** 2 - 0.15 * L[j - 1]
            c = cost[k - 1][i] + e
            if c < best: best, arg = c, i
        cost[k][j], back[k][j] = best, arg
# last sentence ends at t1
best, arg = INF, 0
for i in range(0, M + 1):
    if cost[N - 1][i] >= INF: continue
    c = cost[N - 1][i] + (t1 - pos[i] - wts[N - 1] * rate) ** 2
    if c < best: best, arg = c, i
ends = []; j = arg
for k in range(N - 1, 0, -1):
    ends.append(j); j = back[k][j]
ends = ends[::-1]
bounds = [t0] + [pos[e] for e in ends] + [t1]
def fmt(s):
    h = int(s // 3600); m = int(s % 3600 // 60); sec = s % 60
    return f'{h:02d}:{m:02d}:{int(sec):02d},{int(round((sec - int(sec)) * 1000)):03d}'
with open(out, 'w', encoding='utf-8') as f:
    for k, s in enumerate(sents):
        a, b = bounds[k], bounds[k + 1]
        f.write(f'{k + 1}\n{fmt(a)} --> {fmt(b)}\n{s}\n\n')
print(f'sentences {N} pauses {M} speech {t0:.2f}-{t1:.2f}s  fit_error {best / N:.3f}')
