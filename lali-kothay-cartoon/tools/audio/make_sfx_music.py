"""
Synthesises the background music bed and the sound effects (numpy only).
Run:  python tools/audio/make_sfx_music.py      (after tools/voice/process_voices.py)
Writes public/sfx/*.wav and public/audio/music.mp3 (already ducked under the voice).
"""
import json, os, subprocess, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SR = 44100
rng = np.random.default_rng(7)


def save(path, x, sr=SR):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.005, r=0.2, d=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
    return e


def lowpass(x, cutoff):
    # one-pole low pass, cutoff may be an array
    a = np.exp(-2 * np.pi * np.asarray(cutoff) / SR) * np.ones(len(x))
    y = np.zeros_like(x); s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s
        y[i] = s
    return y


def lp_fast(x, cutoff):
    # FFT brick-ish low pass (fast, fixed cutoff)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def bp_fast(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (f / hi) ** 4)) * (1 - 1 / (1 + (f / lo) ** 4))
    return np.fft.irfft(X, len(x))


def norm(x, peak=0.9):
    m = np.abs(x).max() + 1e-9
    return x / m * peak


# ------------------------------------------------------------------ sound effects
def sfx():
    out = os.path.join(ROOT, 'public', 'sfx'); os.makedirs(out, exist_ok=True)
    N = lambda d: rng.standard_normal(int(d * SR))
    # thunder: crack + long low rumble
    d = 4.0; t = t_(d)
    rumble = lp_fast(N(d), 140) * (np.minimum(1, t / 0.05) * np.exp(-t / 1.3)) * (1 + 0.5 * np.sin(2 * np.pi * 3 * t))
    crack = bp_fast(N(d), 800, 5000) * np.exp(-t / 0.08)
    save(f'{out}/thunder.wav', norm(rumble * 1.0 + crack * 0.35, 0.95))
    # rain loop 6s (seamless by crossfade)
    d = 6.5; x = bp_fast(N(d), 900, 9000) * 0.5 + lp_fast(N(d), 400) * 0.25
    drops = np.zeros(len(x))
    for k in rng.integers(0, len(x) - 2000, 500):
        drops[k:k + 600] += np.exp(-np.arange(600) / 60) * rng.uniform(0.2, 0.6) * np.sin(np.arange(600) * rng.uniform(0.3, 0.8))
    x = x + drops * 0.5
    L = int(6 * SR); fade = int(0.5 * SR)
    loop = x[:L].copy(); loop[:fade] = loop[:fade] * np.linspace(0, 1, fade) + x[L:L + fade] * np.linspace(1, 0, fade)
    save(f'{out}/rain.wav', norm(loop, 0.7))
    # wind loop
    d = 6.5; t = t_(d); w = bp_fast(N(d), 200, 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.25 * t) ** 2)
    loop = w[:L].copy(); loop[:fade] = loop[:fade] * np.linspace(0, 1, fade) + w[L:L + fade] * np.linspace(1, 0, fade)
    save(f'{out}/wind.wav', norm(loop, 0.6))
    # crickets loop (night)
    d = 6.0; t = t_(d); c = np.zeros(len(t))
    for start in np.arange(0, d, 0.42):
        for j in range(3):
            s0 = int((start + j * 0.045 + rng.uniform(0, 0.02)) * SR)
            n = int(0.03 * SR)
            if s0 + n < len(c):
                tt = np.arange(n) / SR
                c[s0:s0 + n] += np.sin(2 * np.pi * 4300 * tt) * np.sin(np.pi * tt / 0.03) * np.sin(2 * np.pi * 60 * tt) ** 2
    save(f'{out}/crickets.wav', norm(c, 0.35))
    # whoosh
    d = 0.6; t = t_(d); n = N(d); sweep = 300 + 3000 * np.sin(np.pi * t / d)
    wh = lowpass(n, sweep) * np.sin(np.pi * t / d) ** 2
    save(f'{out}/whoosh.wav', norm(wh, 0.8))
    # pop
    d = 0.18; t = t_(d); f0 = 900 * np.exp(-t * 18) + 250
    save(f'{out}/pop.wav', norm(np.sin(2 * np.pi * np.cumsum(f0) / SR) * np.exp(-t / 0.05), 0.8))
    # boing (spring)
    d = 0.7; t = t_(d); f0 = 180 + 220 * np.exp(-t * 5) * (1 + 0.4 * np.sin(2 * np.pi * 14 * t))
    save(f'{out}/boing.wav', norm(np.sin(2 * np.pi * np.cumsum(f0) / SR) * np.exp(-t / 0.3), 0.8))
    # slide whistle down
    d = 0.8; t = t_(d); f0 = 1500 - 1100 * (t / d) ** 0.8
    save(f'{out}/slide.wav', norm(np.sin(2 * np.pi * np.cumsum(f0) / SR) * np.sin(np.pi * t / d) ** 0.5, 0.6))
    # thud
    d = 0.4; t = t_(d); th = np.sin(2 * np.pi * np.cumsum(90 * np.exp(-t * 6) + 40) / SR) * np.exp(-t / 0.09) + lp_fast(N(d), 300) * np.exp(-t / 0.03) * 0.5
    save(f'{out}/thud.wav', norm(th, 0.9))
    # mud splash / squelch
    d = 0.9; t = t_(d); sq = lowpass(N(d), 600 + 1800 * np.exp(-t * 6)) * np.exp(-t / 0.18)
    blub = np.sin(2 * np.pi * np.cumsum(120 + 260 * (t / d)) / SR) * np.exp(-t / 0.12) * 0.6
    save(f'{out}/splash.wav', norm(sq + blub, 0.9))
    # wood crack
    d = 0.7; t = t_(d); cr = np.zeros(len(t))
    for k in range(9):
        s0 = int(rng.uniform(0, 0.35) * SR); n = int(0.03 * SR)
        cr[s0:s0 + n] += bp_fast(N(0.03), 1500, 6000)[:n] * np.exp(-np.arange(n) / 200) * rng.uniform(0.5, 1)
    cr += lp_fast(N(d), 250) * np.exp(-t / 0.1) * 0.6
    save(f'{out}/crack.wav', norm(cr, 0.9))
    # ding (idea)
    d = 1.4; t = t_(d); dg = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / dec) for f, a, dec in [(1318, 1, 0.6), (2637, 0.4, 0.3), (3951, 0.2, 0.2)])
    save(f'{out}/ding.wav', norm(dg, 0.6))
    # sparkle (gliss of bells)
    d = 1.2; t = t_(d); sp = np.zeros(len(t))
    for k, f in enumerate([1568, 1760, 2093, 2349, 2637, 3136]):
        s0 = int(k * 0.07 * SR); tt = t[:len(t) - s0]
        sp[s0:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.35)
    save(f'{out}/sparkle.wav', norm(sp, 0.5))
    # bird chirps
    d = 2.5; t = t_(d); bc = np.zeros(len(t))
    for s in [0.1, 0.25, 0.4, 1.2, 1.32, 1.9]:
        s0 = int(s * SR); n = int(0.09 * SR); tt = np.arange(n) / SR
        f0 = 3200 + 1800 * np.sin(np.pi * tt / 0.09)
        bc[s0:s0 + n] += np.sin(2 * np.pi * np.cumsum(f0) / SR) * np.sin(np.pi * tt / 0.09)
    save(f'{out}/birds.wav', norm(bc, 0.35))
    # knock (hammer)
    d = 0.25; t = t_(d); kn = np.sin(2 * np.pi * 220 * t) * np.exp(-t / 0.03) + bp_fast(N(d), 1000, 4000) * np.exp(-t / 0.01) * 0.5
    save(f'{out}/knock.wav', norm(kn, 0.8))
    # tiptoe plink
    d = 0.3; t = t_(d); save(f'{out}/plink.wav', norm(np.sin(2 * np.pi * 660 * t) * np.exp(-t / 0.06) + 0.3 * np.sin(2 * np.pi * 1320 * t) * np.exp(-t / 0.03), 0.5))
    # click + subscribe bell
    d = 0.08; t = t_(d); save(f'{out}/click.wav', norm(bp_fast(N(d), 2000, 8000) * np.exp(-t / 0.006), 0.7))
    d = 1.6; t = t_(d); bl = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / dec) * a for f, a, dec in [(880, 1, 0.8), (1760, 0.5, 0.4), (2640, 0.25, 0.3)]) * (1 + 0.3 * np.sin(2 * np.pi * 7 * t))
    save(f'{out}/bell.wav', norm(bl, 0.6))
    # dramatic sting (low hit + descending tones) for the hook
    d = 2.2; t = t_(d); hit = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 1.2) + 30) / SR) * np.exp(-t / 0.6)
    tones = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / 1.2) * 0.25 for f in [220, 261.6, 311.1])
    save(f'{out}/sting.wav', norm(hit + tones, 0.8))
    # cheer/tada chord
    d = 2.0; t = t_(d); td = sum(pluck(f, d, 0.996) * 0.35 for f in [523.3, 659.3, 784, 1046.5])
    save(f'{out}/tada.wav', norm(td, 0.7))
    print('sfx ok')


# ------------------------------------------------------------------ music
def pluck(freq, dur, decay=0.994, bright=0.5):
    n = int(dur * SR); p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p) * bright + rng.uniform(-1, 1, p) * (1 - bright) * 0.3
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = decay * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out


_pl_cache = {}


def pl(freq, dur, decay=0.994):
    key = (round(freq, 1), round(dur, 2), decay)
    if key not in _pl_cache:
        _pl_cache[key] = pluck(freq, dur, decay)
    return _pl_cache[key]


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


SCALES = {'minor': [0, 2, 3, 5, 7, 8, 10], 'major': [0, 2, 4, 5, 7, 9, 11], 'penta': [0, 2, 4, 7, 9], 'mpenta': [0, 3, 5, 7, 10]}


def section(dur, root, scale, bpm, prog, style):
    n = int(dur * SR); y = np.zeros(n + SR * 3)
    beat = 60 / bpm; sc = SCALES[scale]
    def deg(d, octave=0):
        return root + sc[d % len(sc)] + 12 * (d // len(sc) + octave)
    bar = beat * 4; b = 0; t = 0.0
    while t < dur:
        chord = prog[b % len(prog)]
        # pad (soft sine chord)
        tt = np.arange(int(bar * SR)) / SR
        padenv = np.minimum(1, tt / 0.4) * np.minimum(1, (bar - tt) / 0.3)
        pad = sum(np.sin(2 * np.pi * midi(deg(chord + k)) * tt) for k in (0, 2, 4)) * padenv * (0.05 if style != 'urgent' else 0.035)
        s0 = int(t * SR); y[s0:s0 + len(pad)] += pad
        # bass
        for q in range(4 if style in ('urgent', 'happy', 'jingle') else 2):
            st = t + q * (beat if style in ('urgent', 'happy', 'jingle') else beat * 2)
            if st >= dur: break
            f = midi(deg(chord, -2)); bl = beat * 0.9
            tb = np.arange(int(bl * SR)) / SR
            bass = np.sin(2 * np.pi * f * tb) * np.exp(-tb / 0.35) * 0.32 + np.sin(4 * np.pi * f * tb) * np.exp(-tb / 0.2) * 0.08
            s0 = int(st * SR); y[s0:s0 + len(bass)] += bass
        # melody / arpeggio plucks
        steps = {'sad': 4, 'calm': 8, 'sneak': 8, 'urgent': 8, 'happy': 8, 'night': 4, 'jingle': 8, 'tense': 4}[style]
        for k in range(steps):
            st = t + k * bar / steps
            if st >= dur: break
            if style == 'sneak' and k % 2 == 1: continue
            if style in ('sad', 'night', 'tense') and rng.random() < 0.25: continue
            d = chord + [0, 2, 4, 7, 4, 2, 5, 3][(k + b) % 8] if style != 'sneak' else chord + [0, 1, 2, 1, 3, 2, 4, 1][k % 8]
            octave = 1 if style in ('happy', 'jingle', 'calm') else 0
            f = midi(deg(d, octave))
            note = pl(f, 1.2 if style in ('sad', 'night') else 0.6, 0.996 if style in ('sad', 'night') else 0.99)
            vol = {'sad': 0.22, 'calm': 0.2, 'sneak': 0.26, 'urgent': 0.2, 'happy': 0.22, 'night': 0.2, 'jingle': 0.25, 'tense': 0.2}[style]
            s0 = int(st * SR); y[s0:s0 + len(note)] += note * vol
        # shaker on 16ths for driving parts
        if style in ('urgent', 'happy', 'jingle'):
            for k in range(16):
                st = t + k * bar / 16
                if st >= dur: break
                nlen = int(0.04 * SR); sh = rng.standard_normal(nlen) * np.exp(-np.arange(nlen) / 200) * (0.05 if k % 4 else 0.08)
                s0 = int(st * SR); y[s0:s0 + nlen] += sh
        t += bar; b += 1
    return y[:n]


def music(timeline):
    lines = timeline['lines']; total = timeline['durationInFrames'] / 30
    L = lambda i: lines[i]['start']
    # (start, style, root midi, scale, bpm, progression of scale degrees)
    plan = [
        (0.0, 'sad', 57, 'minor', 70, [0, 5, 3, 4]),
        (L(1) + 2.2, 'calm', 60, 'penta', 92, [0, 3, 1, 4]),
        (L(5), 'tense', 57, 'minor', 84, [0, 5, 0, 4]),
        (L(13) - 0.2, 'sneak', 57, 'minor', 104, [0, 0, 3, 4]),
        (L(23), 'calm', 62, 'major', 96, [0, 3, 4, 0]),
        (L(26), 'urgent', 57, 'minor', 128, [0, 5, 3, 4]),
        (L(35), 'tense', 55, 'minor', 90, [0, 5, 3, 4]),
        (L(42), 'urgent', 55, 'minor', 120, [0, 3, 5, 4]),
        (L(49) + 0.6, 'happy', 60, 'major', 116, [0, 4, 5, 3]),
        (L(58), 'night', 60, 'major', 72, [0, 5, 3, 4]),
        (L(63) - 0.3, 'jingle', 62, 'major', 124, [0, 4, 5, 3]),
    ]
    y = np.zeros(int(total * SR) + SR)
    xf = int(1.0 * SR)
    for i, (st, style, root, scale, bpm, prog) in enumerate(plan):
        en = plan[i + 1][0] if i + 1 < len(plan) else total
        seg = section(en - st + 1.0, root, scale, bpm, prog, style)
        e = np.ones(len(seg)); e[:xf] = np.linspace(0, 1, xf); e[-xf:] = np.linspace(1, 0, xf)
        s0 = int(st * SR); seg = seg * e
        y[s0:s0 + len(seg)] += seg[:len(y) - s0]
        print('  music', style, round(st, 1), '->', round(en, 1))
    y = y[:int(total * SR)]
    # duck under the voice
    vpath = os.path.join(ROOT, 'public', 'audio', 'voice.mp3')
    v = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', vpath, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout, np.int16).astype(float) / 32768
    v = np.pad(v, (0, max(0, len(y) - len(v))))[:len(y)]
    hop = 441; frames = len(v) // hop
    rms = np.sqrt(np.mean(v[:frames * hop].reshape(frames, hop) ** 2, 1))
    g = np.ones(frames); cur = 1.0
    for i in range(frames):
        target = 0.38 if rms[i] > 0.02 else 1.0
        cur += (target - cur) * (0.35 if target < cur else 0.04)
        g[i] = cur
    gain = np.repeat(g, hop); gain = np.pad(gain, (0, len(y) - len(gain)), constant_values=1)
    y = y * gain
    y = y / (np.abs(y).max() + 1e-9) * 0.55
    tmp = os.path.join(HERE, '_music.wav'); save(tmp, y)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-27:TP=-3:LRA=11', '-b:a', '160k', os.path.join(ROOT, 'public', 'audio', 'music.mp3')], check=True)
    os.remove(tmp)
    print('music ok')


if __name__ == '__main__':
    sfx()
    music(json.load(open(os.path.join(ROOT, 'src', 'data', 'timeline.json'), encoding='utf-8')))
