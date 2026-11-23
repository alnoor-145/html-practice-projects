"""
Character voice engine for "Lali kothay?".

The two ElevenLabs files read every role with one narrator voice (part 1 a female
voice, part 2 a male voice). This script gives every character ONE fixed voice
for the whole episode, whichever source file the line comes from:

  * each line (timings in lines.json, made by align.py) is cut out,
  * Praat "Change gender" (PSOLA) moves it to that character's fixed pitch
    median and formant size (child / woman / man / animal),
  * the line is level-matched and put back at the exact same time,
    so subtitles and lip-sync stay in sync.

Run:  pip install praat-parselmouth numpy
      python tools/voice/process_voices.py
Writes public/audio/voice.mp3 and src/data/timeline.json.
Edit VOICES below to change how a character sounds.
"""
import json, os, subprocess, tempfile, wave
import numpy as np
import parselmouth
from parselmouth.praat import call

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC = os.path.join(HERE, 'source')
FPS = 30
SR = 44100
PART2_OFFSET = 198.8      # seconds: where part 2 starts in the episode
TAIL = 3.2                # seconds of end card after the last line

# vocal-tract "size" of each source voice (formant scale; adult man = 1.0)
SOURCE_CLASS = {'part1': 1.15, 'part2': 1.00}

# One fixed voice per character.  median = target pitch median (Hz),
# tract = formant scale (man 1.0, woman 1.15, child 1.25+, cow < 1),
# rng = pitch range factor (expressiveness), vib = (rate Hz, depth) shake.
VOICES = {
    'narrator': dict(median=None, tract=1.15, rng=1.0),
    'kalam':    dict(median=118, tract=0.95, rng=0.85, vib=(5.5, 0.025)),
    'suman':    dict(median=130, tract=1.00, rng=1.0),
    'tanim':    dict(median=265, tract=1.25, rng=1.1),
    'ayesha':   dict(median=305, tract=1.30, rng=1.1),
    'bhola':    dict(median=190, tract=1.12, rng=1.35),
    'kukku':    dict(median=400, tract=1.45, rng=1.5, vib=(9.0, 0.05)),
    'mini':     dict(median=360, tract=1.40, rng=1.25),
    'lali':     dict(median=105, tract=0.85, rng=1.3),
    'nanu':     dict(median=210, tract=1.12, rng=0.9, vib=(5.0, 0.04)),
}
# group lines are sung by several characters at once (small offsets = crowd)
GROUPS = {
    'all':  [('tanim', 0.000, 0.55), ('ayesha', 0.018, 0.55), ('kalam', 0.031, 0.6), ('suman', 0.012, 0.6)],
    'kids': [('tanim', 0.000, 0.7), ('ayesha', 0.022, 0.7)],
}
# Text shown in subtitles where the TTS file has a typo
DISPLAY_FIX = {'তানিন,': 'তানিম,', 'কাবাব': 'কালাম'}


def load(path):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(out, np.int16).astype(np.float64) / 32768


def save_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def vibrato(x, rate, depth):
    with tempfile.TemporaryDirectory() as d:
        a, b = os.path.join(d, 'a.wav'), os.path.join(d, 'b.wav')
        save_wav(a, x)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', f'vibrato=f={rate}:d={depth}', b], check=True)
        with wave.open(b) as w:
            return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768


def transform(seg, part, who):
    v = VOICES[who]
    if part == 'part1' and who == 'narrator':
        return seg.copy()                       # part-1 narrator is the reference voice
    snd = parselmouth.Sound(seg, sampling_frequency=SR)
    f0 = snd.to_pitch(time_step=0.01, pitch_floor=70, pitch_ceiling=650).selected_array['frequency']
    f0 = f0[f0 > 0]
    median = v['median'] or 0
    if v['median'] is None and part == 'part2':
        median = 150 if len(f0) else 0
    if len(f0) < 5:
        median = 0
    formant = v['tract'] / SOURCE_CLASS[part]
    out = call(snd, 'Change gender', 70, 650, formant, median, v['rng'], 1.0).values[0]
    out = out[:len(seg)] if len(out) >= len(seg) else np.pad(out, (0, len(seg) - len(out)))
    if 'vib' in v:
        out = vibrato(out, *v['vib'])[:len(seg)]
    # match loudness of the original line
    r0 = np.sqrt(np.mean(seg ** 2) + 1e-12); r1 = np.sqrt(np.mean(out ** 2) + 1e-12)
    return out * (r0 / r1)


def render_part(part, lines):
    x = load(os.path.join(SRC, f'{part}.mp3'))
    y = x.copy()
    fade = int(0.012 * SR)
    for ln in lines:
        a = max(0, int((ln['start'] - 0.015) * SR)); b = min(len(x), int((ln['end'] + 0.015) * SR))
        seg = x[a:b]
        who = ln['speaker']
        if who in GROUPS:
            mix = np.zeros_like(seg)
            for name, delay, gain in GROUPS[who]:
                t = transform(seg, part, name)
                d = int(delay * SR)
                mix[d:] += gain * t[:len(seg) - d]
            r0 = np.sqrt(np.mean(seg ** 2)); r1 = np.sqrt(np.mean(mix ** 2) + 1e-12)
            new = mix * (r0 / r1) * 1.1
        else:
            new = transform(seg, part, who)
        ramp = np.ones(len(seg)); ramp[:fade] = np.linspace(0, 1, fade); ramp[-fade:] = np.linspace(1, 0, fade)
        y[a:b] = y[a:b] * (1 - ramp) + new * ramp
        print(f'  {part} {ln["start"]:7.2f} {who:9s} {ln["text"][:38]}')
    return x, y


def envelope(y, n_frames, offset):
    hop = SR / FPS
    env = np.zeros(n_frames)
    for f in range(n_frames):
        a = int((f / FPS - offset) * SR); b = int(a + hop)
        if b <= 0 or a >= len(y):
            continue
        s = y[max(a, 0):min(b, len(y))]
        env[f] = np.sqrt(np.mean(s ** 2)) if len(s) else 0
    return env


def main():
    L = json.load(open(os.path.join(HERE, 'lines.json'), encoding='utf-8'))
    parts = {}
    for part in ('part1', 'part2'):
        print('processing', part)
        parts[part] = render_part(part, L[part]['lines'])
    p1, p2 = parts['part1'][1], parts['part2'][1]
    total = PART2_OFFSET + L['part2']['duration'] + TAIL
    full = np.zeros(int(total * SR))
    full[:len(p1)] += p1
    o = int(PART2_OFFSET * SR); full[o:o + len(p2)] += p2
    orig = np.zeros_like(full)
    orig[:len(parts['part1'][0])] += parts['part1'][0]; orig[o:o + len(parts['part2'][0])] += parts['part2'][0]

    os.makedirs(os.path.join(ROOT, 'public', 'audio'), exist_ok=True)
    with tempfile.TemporaryDirectory() as d:
        for name, sig in (('voice', full), ('voice_original', orig)):
            wpath = os.path.join(d, name + '.wav'); save_wav(wpath, sig)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wpath, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
                            '-ar', str(SR), '-b:a', '192k', os.path.join(ROOT, 'public', 'audio', name + '.mp3')], check=True)

    n_frames = int(round(total * FPS))
    env = envelope(full, n_frames, 0)
    lines = []
    for part, off in (('part1', 0.0), ('part2', PART2_OFFSET)):
        for ln in L[part]['lines']:
            text = ln['text']
            for k, v in DISPLAY_FIX.items():
                text = text.replace(k, v)
            words = []
            for w, ws, we in ln.get('words', []):
                w = DISPLAY_FIX.get(w, w)
                words.append([w, round(ws + off, 3), round(we + off, 3)])
            lines.append(dict(speaker=ln['speaker'], text=text, words=words,
                              start=round(ln['start'] + off, 3), end=round(ln['end'] + off, 3)))
    # per-line normalised mouth openness, quantised to 0-9 per frame
    mouth = np.zeros(n_frames)
    for ln in lines:
        a, b = int(ln['start'] * FPS), min(n_frames, int(ln['end'] * FPS) + 1)
        seg = env[a:b]
        if len(seg) == 0:
            continue
        ref = np.percentile(seg, 90) + 1e-9
        mouth[a:b] = np.clip(seg / ref, 0, 1)
    q = ''.join(str(int(round(v * 9))) for v in mouth)
    data = dict(fps=FPS, durationInFrames=n_frames, part2Offset=PART2_OFFSET, lines=lines, mouth=q)
    os.makedirs(os.path.join(ROOT, 'src', 'data'), exist_ok=True)
    json.dump(data, open(os.path.join(ROOT, 'src', 'data', 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print('frames', n_frames, 'seconds', round(total, 2))


if __name__ == '__main__':
    main()
