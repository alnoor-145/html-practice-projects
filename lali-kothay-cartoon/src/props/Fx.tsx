import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {useScene} from '../lib/scene';
import {clamp} from '../lib/anim';

const O = '#2a1810';

/** screen-space rain */
export const Rain: React.FC<{amount?: number; angle?: number; heavy?: boolean}> = ({amount = 1, angle = 14, heavy}) => {
	const {g} = useScene();
	const n = Math.round((heavy ? 170 : 90) * amount);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg width={1920} height={1080}>
				{Array.from({length: n}).map((_, i) => {
					const sp = 38 + random(`r${i}`) * 22;
					const x0 = random(`rx${i}`) * 2300 - 200;
					const y = ((random(`ry${i}`) * 1200 + g * sp) % 1240) - 120;
					const x = x0 + (y * Math.tan((angle * Math.PI) / 180));
					const len = heavy ? 46 : 32;
					return <line key={i} x1={x} y1={y} x2={x + len * Math.sin((angle * Math.PI) / 180)} y2={y + len} stroke="#d6ecff" strokeWidth={heavy ? 3 : 2.4} opacity={0.55} strokeLinecap="round" />;
				})}
			</svg>
		</AbsoluteFill>
	);
};

/** lightning: white flash + bolt at given local frames */
export const Lightning: React.FC<{at: number[]; x?: number}> = ({at, x = 1300}) => {
	const {f} = useScene();
	let k = 0;
	for (const a of at) {
		const d = f - a;
		if (d >= 0 && d < 14) k = Math.max(k, d < 2 ? 1 : d < 4 ? 0.3 : d < 6 ? 0.85 : 1 - (d - 6) / 8);
	}
	if (k <= 0) return null;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: '#eef6ff', opacity: 0.55 * k}} />
			<svg width={1920} height={1080} style={{opacity: k}}>
				<path d={`M${x} 0 L${x - 40} 180 L${x + 20} 190 L${x - 70} 420 L${x - 10} 430 L${x - 120} 700`} stroke="#fffde7" strokeWidth={10} fill="none" strokeLinejoin="round" />
				<path d={`M${x} 0 L${x - 40} 180 L${x + 20} 190 L${x - 70} 420 L${x - 10} 430 L${x - 120} 700`} stroke="#fff" strokeWidth={4} fill="none" strokeLinejoin="round" />
			</svg>
		</AbsoluteFill>
	);
};

/** fluffy cartoon clouds drifting (world or screen) */
export const Clouds: React.FC<{dark?: number; y?: number; speed?: number; count?: number; scale?: number}> = ({dark = 0, y = 60, speed = 0.4, count = 5, scale = 1}) => {
	const {g} = useScene();
	const mix = (a: number, b: number) => Math.round(a + (b - a) * dark);
	const c = `rgb(${mix(255, 110)},${mix(255, 118)},${mix(255, 134)})`;
	const sh = `rgb(${mix(214, 72)},${mix(226, 80)},${mix(242, 98)})`;
	const puffs: [number, number, number][] = [[-110, 10, 60], [-50, -30, 78], [30, -50, 90], [110, -18, 70], [160, 18, 50], [0, 20, 70], [-150, 30, 40]];
	return (
		<svg style={{position: 'absolute', left: -300, top: 0, overflow: 'visible'}} width={2520} height={500}>
			{Array.from({length: count}).map((_, i) => {
				const s = (0.8 + random(`cs${i}`) * 0.7) * scale;
				const x = ((random(`cx${i}`) * 2600 + g * speed * (0.6 + i * 0.15)) % 2800) - 200;
				const yy = y + random(`cy${i}`) * 140;
				return (
					<g key={i} transform={`translate(${x} ${yy}) scale(${s})`}>
						{puffs.map(([px, py, r], k) => <circle key={`s${k}`} cx={px + 6} cy={py + 12} r={r} fill={sh} />)}
						{puffs.map(([px, py, r], k) => <circle key={k} cx={px} cy={py} r={r} fill={c} />)}
						<ellipse cx={-10} cy={-40} rx={60} ry={22} fill="#fff" opacity={0.25 * (1 - dark)} />
					</g>
				);
			})}
		</svg>
	);
};

export const Sun: React.FC<{x: number; y: number; r?: number; rise?: number}> = ({x, y, r = 90, rise = 1}) => {
	const {g} = useScene();
	return (
		<svg style={{position: 'absolute', left: x, top: y + (1 - rise) * 500, overflow: 'visible'}} width={10} height={10}>
			<defs>
				<radialGradient id="sunglow">
					<stop offset="0%" stopColor="#fff59d" stopOpacity={0.9} />
					<stop offset="100%" stopColor="#ffcc80" stopOpacity={0} />
				</radialGradient>
			</defs>
			<circle r={r * 3} fill="url(#sunglow)" />
			<g transform={`rotate(${g * 0.6})`}>
				{Array.from({length: 12}).map((_, i) => (
					<path key={i} transform={`rotate(${i * 30})`} d={`M${r * 1.15} -12 L${r * 1.6} 0 L${r * 1.15} 12 Z`} fill="#ffd54f" />
				))}
			</g>
			<circle r={r} fill="#ffca28" stroke="#f57f17" strokeWidth={5} />
			<circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.28} fill="#fff59d" opacity={0.7} />
		</svg>
	);
};

export const Moon: React.FC<{x: number; y: number; size?: number}> = ({x, y, size = 200}) => (
	<>
		<div style={{position: 'absolute', left: x - size * 1.2, top: y - size * 1.2, width: size * 2.4, height: size * 2.4, borderRadius: '50%',
			background: 'radial-gradient(closest-side, rgba(255,250,220,0.45), rgba(255,250,220,0))'}} />
		<Img src={staticFile('bg/moon.png')} style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size}} />
	</>
);

export const Stars: React.FC<{count?: number}> = ({count = 60}) => {
	const {g} = useScene();
	return (
		<svg style={{position: 'absolute', left: -200, top: -100, overflow: 'visible'}} width={2320} height={700}>
			{Array.from({length: count}).map((_, i) => {
				const tw = 0.4 + 0.6 * Math.abs(Math.sin(g * 0.05 + i));
				return <circle key={i} cx={random(`sx${i}`) * 2320} cy={random(`sy${i}`) * 600} r={1.5 + random(`sr${i}`) * 2.5} fill="#fff" opacity={tw} />;
			})}
		</svg>
	);
};

export const Fireflies: React.FC<{count?: number; area?: [number, number, number, number]}> = ({count = 40, area = [0, 300, 1920, 1000]}) => {
	const {g} = useScene();
	const [x0, y0, x1, y1] = area;
	return (
		<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
			<defs>
				<radialGradient id="ff">
					<stop offset="0%" stopColor="#fbff9e" />
					<stop offset="40%" stopColor="#d4ff5e" stopOpacity={0.8} />
					<stop offset="100%" stopColor="#c6ff3d" stopOpacity={0} />
				</radialGradient>
			</defs>
			{Array.from({length: count}).map((_, i) => {
				const x = x0 + random(`fx${i}`) * (x1 - x0) + Math.sin(g * 0.03 + i) * 40;
				const y = y0 + random(`fy${i}`) * (y1 - y0) + Math.cos(g * 0.025 + i * 2) * 30;
				const k = 0.3 + 0.7 * Math.max(0, Math.sin(g * 0.09 + i * 1.3));
				return <circle key={i} cx={x} cy={y} r={14 * k + 4} fill="url(#ff)" opacity={k} />;
			})}
		</svg>
	);
};

export const Birds: React.FC<{count?: number; y?: number; speed?: number}> = ({count = 5, y = 220, speed = 3}) => {
	const {g} = useScene();
	return (
		<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
			{Array.from({length: count}).map((_, i) => {
				const x = ((g * speed + i * 140 + random(`b${i}`) * 300) % 2400) - 200;
				const yy = y + i * 26 + Math.sin(g * 0.08 + i) * 12;
				const w = Math.sin(g * 0.5 + i) * 12;
				return <path key={i} d={`M${x - 22} ${yy - w} Q${x - 10} ${yy - 10} ${x} ${yy} Q${x + 10} ${yy - 10} ${x + 22} ${yy - w}`} stroke="#263238" strokeWidth={4} fill="none" strokeLinecap="round" />;
			})}
		</svg>
	);
};

export const Rainbow: React.FC<{x: number; y: number; r?: number; reveal?: number; op?: number}> = ({x, y, r = 700, reveal = 1, op = 0.75}) => {
	const cols = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#3949ab', '#8e24aa'];
	const len = Math.PI * r;
	return (
		<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: op}} width={10} height={10}>
			{cols.map((c, i) => {
				const rr = r - i * 26;
				return <path key={i} d={`M${x - rr} ${y} A${rr} ${rr} 0 0 1 ${x + rr} ${y}`} stroke={c} strokeWidth={26} fill="none" strokeDasharray={`${len}`} strokeDashoffset={`${len * (1 - reveal)}`} />;
			})}
		</svg>
	);
};

export const Confetti: React.FC<{start: number; count?: number}> = ({start, count = 80}) => {
	const {f} = useScene();
	const t = f - start;
	if (t < 0 || t > 120) return null;
	const cols = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#e040fb', '#ff6e40'];
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg width={1920} height={1080}>
				{Array.from({length: count}).map((_, i) => {
					const vx = (random(`cvx${i}`) - 0.5) * 34;
					const vy = -18 - random(`cvy${i}`) * 22;
					const x = 960 + vx * t;
					const y = 760 + vy * t + 0.45 * t * t;
					return <rect key={i} x={x} y={y} width={16} height={10} fill={cols[i % cols.length]} transform={`rotate(${t * 12 + i * 40} ${x} ${y})`} opacity={clamp(1 - (t - 80) / 40)} />;
				})}
			</svg>
		</AbsoluteFill>
	);
};

/** little dust puffs behind running feet */
export const Dust: React.FC<{x: number; y: number; dir?: number; active?: boolean}> = ({x, y, dir = -1, active = true}) => {
	const {g} = useScene();
	if (!active) return null;
	return (
		<svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={10} height={10}>
			{[0, 1, 2, 3].map((i) => {
				const t = (g + i * 6) % 24;
				return <circle key={i} cx={dir * t * 4} cy={-t * 1.2} r={8 + t * 1.2} fill="#e0cba8" opacity={(1 - t / 24) * 0.8} />;
			})}
		</svg>
	);
};

/** mud splash burst */
export const MudSplash: React.FC<{x: number; y: number; start: number}> = ({x, y, start}) => {
	const {f} = useScene();
	const t = f - start;
	if (t < 0 || t > 40) return null;
	return (
		<svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={10} height={10}>
			{Array.from({length: 18}).map((_, i) => {
				const a = -Math.PI * (0.1 + 0.8 * random(`ma${i}`));
				const v = 14 + random(`mv${i}`) * 14;
				const px = Math.cos(a) * v * t;
				const py = Math.sin(a) * v * t + 0.7 * t * t;
				return <circle key={i} cx={px} cy={py} r={8 + random(`mr${i}`) * 14} fill="#6b4423" stroke={O} strokeWidth={2} opacity={clamp(1 - t / 40)} />;
			})}
		</svg>
	);
};

/** wind streaks */
export const Wind: React.FC<{amount?: number}> = ({amount = 1}) => {
	const {g} = useScene();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg width={1920} height={1080}>
				{Array.from({length: Math.round(8 * amount)}).map((_, i) => {
					const x = ((g * 40 + random(`w${i}`) * 2400) % 2600) - 300;
					const y = 150 + random(`wy${i}`) * 700;
					return <path key={i} d={`M${x} ${y} q120 -20 240 0 q40 8 60 -10`} stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.5} strokeLinecap="round" />;
				})}
			</svg>
		</AbsoluteFill>
	);
};

/** scent trail swirls for the dog */
export const Scent: React.FC<{x: number; y: number; dir?: number}> = ({x, y, dir = 1}) => {
	const {g} = useScene();
	return (
		<svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={10} height={10}>
			{[0, 1, 2].map((i) => {
				const t = ((g + i * 14) % 42) / 42;
				return <path key={i} d={`M${dir * t * 300} ${-i * 30} q${dir * 30} -30 ${dir * 60} 0 t${dir * 60} 0 t${dir * 60} 0`} stroke="#ffe082" strokeWidth={6} fill="none" opacity={(1 - t) * 0.9} strokeLinecap="round" />;
			})}
		</svg>
	);
};

/** colour grading overlay (screen space) */
export const Grade: React.FC<{kind: 'night' | 'storm' | 'sepia' | 'warm' | 'dusk' | 'none'; amount?: number; vignette?: number}> = ({kind, amount = 1, vignette = 0.35}) => {
	const map: Record<string, React.CSSProperties> = {
		night: {background: '#0a1640', mixBlendMode: 'multiply', opacity: 0.72 * amount},
		storm: {background: '#2c3a55', mixBlendMode: 'multiply', opacity: 0.55 * amount},
		sepia: {background: '#c9a66b', mixBlendMode: 'multiply', opacity: 0.45 * amount},
		warm: {background: '#ffb74d', mixBlendMode: 'soft-light', opacity: 0.5 * amount},
		dusk: {background: '#ff8a65', mixBlendMode: 'multiply', opacity: 0.25 * amount},
		none: {},
	};
	return (
		<>
			{kind !== 'none' ? <AbsoluteFill style={map[kind]} /> : null}
			{vignette ? <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`}} /> : null}
		</>
	);
};
