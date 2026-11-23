import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {FONT} from '../lib/fonts';
import {clamp, pop, ramp} from '../lib/anim';
import {useScene} from '../lib/scene';

const O = '#1d120c';

/** bouncy title "লালি কোথায়?" */
export const TitleCard: React.FC<{from: number; to: number}> = ({from, to}) => {
	const {f} = useScene();
	if (f < from || f > to) return null;
	const out = interpolate(f, [to - 10, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const letters = ['লা', 'লি', ' ', 'কো', 'থা', 'য়', '?'];
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: out}}>
			<div style={{transform: `translateY(-150px) rotate(${Math.sin(f * 0.08) * 1.5}deg)`, textAlign: 'center'}}>
				<div style={{fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1}}>
					{letters.map((l, i) => {
						const k = pop(f, from + i * 3, 12);
						return (
							<span key={i} style={{display: 'inline-block', whiteSpace: 'pre', color: i < 2 ? '#ffcf3f' : '#ffffff', WebkitTextStroke: `16px ${O}`, paintOrder: 'stroke fill',
								transform: `translateY(${(1 - k) * -200 + Math.sin(f * 0.15 + i) * 6}px) scale(${k})`, textShadow: '0 12px 0 rgba(0,0,0,0.45)'}}>{l}</span>
						);
					})}
				</div>
				<div style={{fontFamily: FONT, fontWeight: 800, fontSize: 46, color: '#fff', marginTop: 4, opacity: clamp((f - from - 20) / 10),
					background: '#e5533d', display: 'inline-block', padding: '4px 30px 0', borderRadius: 40, border: `5px solid ${O}`}}>গ্রামের মজার গল্প • পর্ব ১</div>
			</div>
		</AbsoluteFill>
	);
};

/** big pop word in the middle of the screen (counts, heave-ho...) */
export const PopWord: React.FC<{text: string; at: number; len?: number; x?: number; y?: number; color?: string; size?: number; rot?: number}> = ({text, at, len = 24, x = 960, y = 330, color = '#ffe14d', size = 150, rot = -6}) => {
	const {f} = useScene();
	const t = f - at;
	if (t < 0 || t > len) return null;
	const k = pop(f, at, 9);
	const o = clamp((len - t) / 6);
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${k * (1 + t * 0.004)})`, opacity: o,
			fontFamily: FONT, fontWeight: 800, fontSize: size, color, WebkitTextStroke: `14px ${O}`, paintOrder: 'stroke fill', textShadow: '0 10px 0 rgba(0,0,0,0.4)', whiteSpace: 'nowrap'}}>{text}</div>
	);
};

/** moral of the story banner */
export const Moral: React.FC<{from: number; to: number; lines: string[]}> = ({from, to, lines}) => {
	const {f} = useScene();
	if (f < from || f > to) return null;
	const k = pop(f, from, 14);
	const o = clamp((to - f) / 10);
	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: 70, opacity: o}}>
			<div style={{transform: `scale(${k}) rotate(${Math.sin(f * 0.1) * 1.2}deg)`, background: 'linear-gradient(#fff7d6, #ffe39a)', border: `7px solid ${O}`, borderRadius: 36,
				padding: '14px 50px 6px', boxShadow: '0 12px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
				<div style={{fontFamily: FONT, fontWeight: 800, fontSize: 34, color: '#e5533d'}}>⭐ গল্পের শিক্ষা ⭐</div>
				{lines.map((l, i) => (
					<div key={i} style={{fontFamily: FONT, fontWeight: 800, fontSize: 62, color: '#3b2314', lineHeight: 1.2, opacity: clamp((f - from - 10 - i * 12) / 8)}}>{l}</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

/** transition overlays centred on a cut (local frame) */
export type TransKind = 'iris' | 'swipe' | 'flash' | 'fade' | 'none';
export const Transition: React.FC<{kind: TransKind; g: number; cut: number; len?: number}> = ({kind, g, cut, len = 9}) => {
	const d = g - cut;
	if (kind === 'none' || d < -len || d > len) return null;
	const k = 1 - Math.abs(d) / len; // 0..1..0
	if (kind === 'fade') return <AbsoluteFill style={{background: '#000', opacity: k}} />;
	if (kind === 'flash') return <AbsoluteFill style={{background: '#fff', opacity: k}} />;
	if (kind === 'iris') {
		const r = (1 - k) * 1200;
		return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, rgba(0,0,0,0) ${r}px, #000 ${r + 2}px)`}} />;
	}
	// swipe: a coloured band with stars sweeping across
	const x = interpolate(d, [-len, len], [-2600, 2600]);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: x - 200, top: -400, width: 2400, height: 1900, transform: 'rotate(12deg)', background: 'linear-gradient(90deg, #ffb703, #fb8500 50%, #ffb703)', borderLeft: `14px solid ${O}`, borderRight: `14px solid ${O}`}}>
				{Array.from({length: 10}).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: 200 + random(`st${i}`) * 2000, top: 300 + random(`sy${i}`) * 1300, fontSize: 90, color: '#fff3b0'}}>★</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

/** like / share / subscribe call to action */
export const EndCard: React.FC<{from: number; subAt: number}> = ({from, subAt}) => {
	const {f} = useScene();
	if (f < from) return null;
	const btn = (label: string, icon: string, bg: string, i: number, active: boolean) => {
		const k = pop(f, from + i * 10, 12);
		const press = active ? 1 - 0.12 * Math.max(0, Math.sin(clamp((f - subAt) / 8) * Math.PI)) : 1;
		return (
			<div key={label} style={{transform: `scale(${k * press}) rotate(${Math.sin(f * 0.1 + i) * 2}deg)`, background: active && f > subAt + 4 ? '#7a7a7a' : bg, border: `6px solid ${O}`,
				borderRadius: 26, padding: '10px 34px 2px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>
				<span style={{fontSize: 56}}>{icon}</span>
				<span style={{fontFamily: FONT, fontWeight: 800, fontSize: 58, color: '#fff'}}>{active && f > subAt + 4 ? 'Subscribed' : label}</span>
			</div>
		);
	};
	const cx = interpolate(f, [subAt - 30, subAt], [1500, 1270], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const cy = interpolate(f, [subAt - 30, subAt], [1000, 620], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bell = f > subAt + 10 ? Math.sin((f - subAt) * 0.9) * 18 * clamp(1 - (f - subAt - 10) / 40) : 0;
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<div style={{display: 'flex', gap: 34, transform: 'translateY(40px)'}}>
				{btn('লাইক', '👍', '#2e86de', 0, false)}
				{btn('শেয়ার', '↗️', '#10ac84', 1, false)}
				{btn('Subscribe', '▶', '#e52d27', 2, true)}
				<div style={{fontSize: 80, transform: `rotate(${bell}deg) scale(${pop(f, from + 36, 12)})`, transformOrigin: '50% 10%'}}>🔔</div>
			</div>
			{f > subAt - 32 ? (
				<svg style={{position: 'absolute', left: cx, top: cy, overflow: 'visible'}} width={10} height={10}>
					<path d="M0 0 L0 70 L18 54 L30 82 L42 76 L30 50 L54 50 Z" fill="#fff" stroke={O} strokeWidth={5} strokeLinejoin="round" />
				</svg>
			) : null}
		</AbsoluteFill>
	);
};

export const NextEpisode: React.FC<{from: number}> = ({from}) => {
	const {f} = useScene();
	if (f < from) return null;
	const k = pop(f, from, 14);
	return (
		<div style={{position: 'absolute', left: 960, top: 150, transform: `translate(-50%,-50%) scale(${k})`, textAlign: 'center'}}>
			<div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: '#fff', background: '#8e44ad', border: `6px solid ${O}`, borderRadius: 30, padding: '4px 30px 0', display: 'inline-block'}}>পরের পর্বে</div>
			<div style={{fontFamily: FONT, fontWeight: 800, fontSize: 96, color: '#ffe14d', WebkitTextStroke: `13px ${O}`, paintOrder: 'stroke fill', textShadow: '0 10px 0 rgba(0,0,0,0.4)', marginTop: 4}}>মিনির মাছ কোথায় গেল?</div>
		</div>
	);
};

export const Caption: React.FC<{text: string; from: number; to: number; x?: number; y?: number; bg?: string; size?: number}> = ({text, from, to, x = 960, y = 120, bg = '#e5533d', size = 54}) => {
	const {f} = useScene();
	if (f < from || f > to) return null;
	const k = pop(f, from, 10) * clamp((to - f) / 8);
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${k}) rotate(-3deg)`, fontFamily: FONT, fontWeight: 800, fontSize: size, color: '#fff',
			background: bg, border: `6px solid ${O}`, borderRadius: 28, padding: '6px 34px 0', whiteSpace: 'nowrap', boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>{text}</div>
	);
};

export const Flashback: React.FC<{label?: string}> = ({label = 'আগের দিনগুলো...'}) => {
	const {f} = useScene();
	return (
		<>
			<AbsoluteFill style={{boxShadow: 'inset 0 0 160px 60px rgba(255,236,190,0.95)'}} />
			<div style={{position: 'absolute', left: 60, top: 40, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: '#6d4c22', background: '#fff3d6', border: `5px solid ${O}`,
				borderRadius: 24, padding: '2px 24px 0', transform: `scale(${pop(f, 4, 12)})`}}>{label}</div>
		</>
	);
};

export const ramped = ramp;
