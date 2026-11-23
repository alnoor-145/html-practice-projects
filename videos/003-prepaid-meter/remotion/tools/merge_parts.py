# Joins several ElevenLabs parts (mp3 + srt) into one voice file and one SRT, with a short gap between parts.
# usage: python merge_parts.py out.wav out.srt GAP_SEC part1.mp3 part1.srt [part2.mp3 part2.srt ...]
import re, subprocess, sys
out_wav, out_srt, gap = sys.argv[1], sys.argv[2], float(sys.argv[3])
pairs = list(zip(sys.argv[4::2], sys.argv[5::2]))
def dur(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).decode().strip())
def ts(s):
    h, m, r = s.split(':'); sec, ms = r.split(','); return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000
def fmt(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
cues, offset, n = [], 0.0, 1
inputs, filt = [], []
for i, (mp3, srt) in enumerate(pairs):
    for block in re.split(r'\n\s*\n', open(srt, encoding='utf-8').read().strip()):
        lines = block.strip().splitlines()
        a, b = [ts(x.strip()) for x in lines[1].split('-->')]
        cues.append(f'{n}\n{fmt(a + offset)} --> {fmt(b + offset)}\n' + '\n'.join(lines[2:]))
        n += 1
    inputs += ['-i', mp3]
    filt.append(f'[{i}:a]aresample=44100,aformat=channel_layouts=mono[a{i}]')
    offset += dur(mp3) + gap
parts = ''.join(f'[a{i}]' + (f'[g{i}]' if i < len(pairs) - 1 else '') for i in range(len(pairs)))
gaps = [f'anullsrc=r=44100:cl=mono,atrim=0:{gap}[g{i}]' for i in range(len(pairs) - 1)]
graph = ';'.join(filt + gaps + [f'{parts}concat=n={2 * len(pairs) - 1}:v=0:a=1[out]'])
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '[out]', '-c:a', 'pcm_s16le', out_wav])
open(out_srt, 'w', encoding='utf-8').write('\n\n'.join(cues) + '\n')
print('parts', len(pairs), 'cues', n - 1, 'total %.2fs' % (offset - gap))
