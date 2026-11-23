import {Easing, interpolate, random} from 'remotion';

export type Ease = 'linear' | 'in' | 'out' | 'inOut' | 'back' | 'bounce' | 'elastic' | 'hold';
const EASE: Record<Ease, (t: number) => number> = {
	linear: (t) => t,
	in: Easing.in(Easing.cubic),
	out: Easing.out(Easing.cubic),
	inOut: Easing.inOut(Easing.cubic),
	back: Easing.out(Easing.back(1.7)),
	bounce: Easing.out(Easing.bounce),
	elastic: Easing.out(Easing.elastic(1.2)),
	hold: (t) => (t < 1 ? 0 : 1),
};

/** keyframe: [frame, value, easing-into-this-key] */
export type Key = [number, number, Ease?];
export type Track = number | Key[];

export const kf = (f: number, track: Track): number => {
	if (typeof track === 'number') return track;
	if (track.length === 0) return 0;
	if (f <= track[0][0]) return track[0][1];
	for (let i = 1; i < track.length; i++) {
		const [f1, v1, e] = track[i];
		const [f0, v0] = track[i - 1];
		if (f <= f1) {
			if (f1 === f0) return v1;
			const t = (f - f0) / (f1 - f0);
			return v0 + (v1 - v0) * EASE[e ?? 'inOut'](t);
		}
	}
	return track[track.length - 1][1];
};

/** step track: returns the active state and the frames since it started */
export type Step<T> = [number, T][];
export const step = <T>(f: number, track: Step<T>): {value: T; since: number; index: number} => {
	let idx = 0;
	for (let i = 0; i < track.length; i++) if (f >= track[i][0]) idx = i;
	return {value: track[idx][1], since: f - track[idx][0], index: idx};
};

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const fade = (f: number, a: number, b: number, len = 8) =>
	interpolate(f, [a, a + len, b - len, b], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export const ramp = (f: number, a: number, b: number, ease: Ease = 'inOut') => EASE[ease](clamp((f - a) / Math.max(1, b - a)));
export const pop = (f: number, at: number, len = 12) => {
	if (f < at) return 0;
	return EASE.back(clamp((f - at) / len));
};
export const wave = (f: number, period: number, phase = 0) => Math.sin(((f / period) * 2 + phase) * Math.PI);
export const noise = (seed: string, f: number, speed = 0.15) => {
	const x = f * speed;
	const i = Math.floor(x);
	const t = x - i;
	const a = random(`${seed}-${i}`) * 2 - 1;
	const b = random(`${seed}-${i + 1}`) * 2 - 1;
	const s = t * t * (3 - 2 * t);
	return a + (b - a) * s;
};

/** deterministic blink: returns 0 (open) .. 1 (closed) */
export const blinkAt = (seed: string, g: number) => {
	// blink roughly every 2.6 - 4.4 s, 5 frames long
	let t = Math.floor(random(seed) * 60);
	let k = 0;
	while (t <= g) {
		const len = 5;
		if (g < t + len) {
			const p = (g - t) / len;
			return p < 0.5 ? p * 2 : (1 - p) * 2;
		}
		t += 78 + Math.floor(random(`${seed}-${k++}`) * 54);
	}
	return 0;
};
