import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, LINES, Line} from '../lib/time';
import {CHARS} from '../characters/rigs';
import {FONT} from '../lib/fonts';
import {pop} from '../lib/anim';

type Chunk = {words: [string, number, number][]; start: number; end: number; speaker: string};

const clean = (w: string) => w.replace(/[\[\]]/g, '');

const chunksOf = (line: Line, next?: Line): Chunk[] => {
	const out: Chunk[] = [];
	let cur: [string, number, number][] = [];
	const flush = () => {
		if (cur.length) out.push({words: cur, start: cur[0][1], end: cur[cur.length - 1][2], speaker: line.speaker});
		cur = [];
	};
	for (const w of line.words) {
		cur.push([clean(w[0]), w[1], w[2]]);
		const len = cur.map((c) => c[0]).join(' ').length;
		if (/[।?!,]$/.test(w[0]) && len > 8) flush();
		else if (cur.length >= 5 || len > 26) flush();
	}
	flush();
	// each chunk stays until the next one starts (or a little after the line ends)
	for (let i = 0; i < out.length; i++) {
		const nx = out[i + 1];
		out[i].end = nx ? nx.start : Math.min(line.end + 0.35, next ? next.start - 0.05 : line.end + 0.6);
	}
	return out;
};

const ALL: Chunk[] = LINES.flatMap((l, i) => chunksOf(l, LINES[i + 1]));

export const Subtitles: React.FC = () => {
	const g = useCurrentFrame();
	const t = g / FPS;
	const ch = ALL.find((c) => t >= c.start - 0.08 && t < c.end);
	if (!ch) return null;
	const appear = Math.round((ch.start - 0.08) * FPS);
	const k = pop(g, appear, 8);
	const def = CHARS[ch.speaker];
	const showName = ch.speaker !== 'narrator' && def?.name;
	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 46, pointerEvents: 'none'}}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${0.85 + 0.15 * k})`, opacity: Math.min(1, k * 1.5)}}>
				{showName ? (
					<div style={{fontFamily: FONT, fontWeight: 800, fontSize: 34, color: '#fff', background: def.color, padding: '2px 22px 0', borderRadius: 22,
						border: '4px solid #1d120c', marginBottom: 6, boxShadow: '0 4px 0 rgba(0,0,0,0.35)'}}>{def.name}</div>
				) : null}
				<div style={{fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.25, textAlign: 'center', maxWidth: 1600, padding: '0 20px'}}>
					{ch.words.map(([w, a, b], i) => {
						const active = t >= a - 0.03 && t < b + 0.02;
						const done = t >= b;
						const wp = active ? pop(g, Math.round((a - 0.03) * FPS), 6) : 0;
						return (
							<span key={i} style={{display: 'inline-block', margin: '0 9px', color: active ? '#ffe14d' : done ? '#ffffff' : '#f3f3f3',
								WebkitTextStroke: '11px #1d120c', paintOrder: 'stroke fill',
								transform: `translateY(${-6 * wp}px) scale(${1 + 0.1 * wp})`, textShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>{w}</span>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
