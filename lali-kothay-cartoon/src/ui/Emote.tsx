import React from 'react';
import {interpolate} from 'remotion';
import {pop} from '../lib/anim';

export type EmoteType = 'exclaim' | 'question' | 'idea' | 'hearts' | 'zzz' | 'sweat' | 'anger' | 'shh' | 'music' | 'sparkle' | 'cloud' | 'steam' | 'dizzy';

/** Little cartoon reaction above a character's head. t = frames since it appeared */
export const Emote: React.FC<{type: EmoteType; t: number; len: number; size?: number}> = ({type, t, len, size = 1}) => {
	const s = pop(t, 0, 10) * interpolate(t, [len - 8, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bob = Math.sin(t * 0.25) * 4;
	const O = '#2a1810';
	let body: React.ReactNode = null;
	switch (type) {
		case 'exclaim':
			body = (
				<g>
					<path d="M-14 -70 L14 -70 L8 -14 L-8 -14 Z" fill="#ff4d4d" stroke={O} strokeWidth={5} strokeLinejoin="round" />
					<circle cx={0} cy={4} r={10} fill="#ff4d4d" stroke={O} strokeWidth={5} />
				</g>
			);
			break;
		case 'question':
			body = (
				<text x={0} y={0} textAnchor="middle" fontSize={96} fontWeight={800} fill="#ffd54f" stroke={O} strokeWidth={6} paintOrder="stroke" fontFamily="Baloo Da 2, sans-serif">?</text>
			);
			break;
		case 'idea': {
			const glow = 0.6 + 0.4 * Math.sin(t * 0.5);
			body = (
				<g>
					{Array.from({length: 8}).map((_, i) => {
						const a = (i / 8) * Math.PI * 2;
						return <line key={i} x1={Math.cos(a) * 46} y1={-40 + Math.sin(a) * 46} x2={Math.cos(a) * 62} y2={-40 + Math.sin(a) * 62} stroke="#ffd400" strokeWidth={6} strokeLinecap="round" opacity={glow} />;
					})}
					<circle cx={0} cy={-40} r={32} fill="#fff176" stroke={O} strokeWidth={5} />
					<rect x={-14} y={-12} width={28} height={20} rx={4} fill="#9e9e9e" stroke={O} strokeWidth={4} />
					<path d="M-8 -40 Q0 -28 8 -40" stroke="#f57f17" strokeWidth={4} fill="none" />
				</g>
			);
			break;
		}
		case 'hearts':
			body = (
				<g>
					{[0, 1, 2].map((i) => {
						const tt = (t + i * 14) % 42;
						const y = -tt * 2.2;
						const x = (i - 1) * 34 + Math.sin(tt * 0.2 + i) * 8;
						const sc = 0.6 + 0.5 * Math.min(1, tt / 10);
						return (
							<path key={i} transform={`translate(${x} ${y}) scale(${sc})`} opacity={1 - tt / 42}
								d="M0 10 C-26 -8 -14 -32 0 -18 C14 -32 26 -8 0 10 Z" fill="#ff4f7b" stroke={O} strokeWidth={4} />
						);
					})}
				</g>
			);
			break;
		case 'zzz':
			body = (
				<g fontFamily="Baloo Da 2, sans-serif" fontWeight={800} fill="#fff" stroke={O} strokeWidth={5} paintOrder="stroke">
					{[0, 1, 2].map((i) => {
						const tt = (t + i * 16) % 48;
						return (
							<text key={i} x={10 + tt * 1.2 + i * 6} y={-tt * 1.6} fontSize={30 + i * 10} opacity={1 - tt / 48}>Z</text>
						);
					})}
				</g>
			);
			break;
		case 'sweat':
			body = (
				<g>
					{[0, 1].map((i) => {
						const tt = (t + i * 12) % 24;
						return (
							<path key={i} transform={`translate(${(i ? 60 : -60)} ${-30 + tt * 2})`} opacity={1 - tt / 24}
								d="M0 -18 Q12 0 0 10 Q-12 0 0 -18 Z" fill="#8fd8ff" stroke={O} strokeWidth={3} />
						);
					})}
				</g>
			);
			break;
		case 'anger':
			body = (
				<g transform={`scale(${1 + 0.12 * Math.sin(t * 0.8)})`}>
					<path d="M-30 -30 Q-8 -24 -6 -4 M30 -30 Q8 -24 6 -4 M-30 30 Q-8 24 -6 4 M30 30 Q8 24 6 4" stroke="#e53935" strokeWidth={9} fill="none" strokeLinecap="round" transform="translate(0 -40)" />
				</g>
			);
			break;
		case 'steam':
			body = (
				<g>
					{[0, 1, 2].map((i) => {
						const tt = (t + i * 9) % 27;
						return <circle key={i} cx={(i - 1) * 40 + Math.sin(tt * 0.3) * 6} cy={-tt * 3} r={10 + tt * 0.9} fill="#f5f5f5" stroke="#bbb" strokeWidth={3} opacity={1 - tt / 27} />;
					})}
				</g>
			);
			break;
		case 'shh':
			body = (
				<g>
					<rect x={-58} y={-74} width={116} height={64} rx={30} fill="#fff" stroke={O} strokeWidth={5} />
					<path d="M-10 -12 L0 6 L10 -12 Z" fill="#fff" stroke={O} strokeWidth={5} strokeLinejoin="round" />
					<rect x={-12} y={-15} width={24} height={8} fill="#fff" />
					<text x={0} y={-30} textAnchor="middle" fontSize={34} fontWeight={800} fill="#333" fontFamily="Baloo Da 2, sans-serif">শশশ!</text>
				</g>
			);
			break;
		case 'music':
			body = (
				<g>
					{[0, 1].map((i) => {
						const tt = (t + i * 15) % 30;
						return (
							<text key={i} x={(i ? 30 : -30) + Math.sin(tt * 0.3) * 8} y={-tt * 2.4} fontSize={46} fill="#7e57c2" stroke={O} strokeWidth={3} paintOrder="stroke" opacity={1 - tt / 30}>♪</text>
						);
					})}
				</g>
			);
			break;
		case 'sparkle':
			body = (
				<g>
					{[[-60, -20], [50, -50], [10, -80], [70, 10]].map(([x, y], i) => {
						const k = 0.5 + 0.5 * Math.sin(t * 0.4 + i * 1.7);
						return <path key={i} transform={`translate(${x} ${y}) scale(${0.5 + k * 0.7})`} d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5 Z" fill="#fff59d" stroke="#f9a825" strokeWidth={3} />;
					})}
				</g>
			);
			break;
		case 'cloud':
			body = (
				<g>
					<g fill="#8e99a8" stroke={O} strokeWidth={4}>
						<path d="M-60 -40 Q-62 -72 -30 -70 Q-20 -96 10 -86 Q36 -100 50 -72 Q76 -70 66 -44 Z" />
					</g>
					{[0, 1, 2].map((i) => {
						const tt = (t + i * 7) % 21;
						return <line key={i} x1={-34 + i * 30} y1={-36 + tt * 3} x2={-38 + i * 30} y2={-24 + tt * 3} stroke="#4fc3f7" strokeWidth={5} strokeLinecap="round" opacity={1 - tt / 21} />;
					})}
				</g>
			);
			break;
		case 'dizzy':
			body = (
				<g transform={`rotate(${t * 9})`}>
					{[0, 1, 2].map((i) => {
						const a = (i / 3) * Math.PI * 2;
						return <path key={i} transform={`translate(${Math.cos(a) * 44} ${Math.sin(a) * 16 - 20})`} d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#ffeb3b" stroke={O} strokeWidth={2.5} />;
					})}
				</g>
			);
			break;
	}
	return <g transform={`translate(0 ${bob}) scale(${s * size})`}>{body}</g>;
};
