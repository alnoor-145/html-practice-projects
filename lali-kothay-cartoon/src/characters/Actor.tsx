import React from 'react';
import {kf, noise, step, Step, Track, blinkAt, clamp} from '../lib/anim';
import {useScene} from '../lib/scene';
import {isSpeaking, mouthOf} from '../lib/time';
import {CHARS} from './rigs';
import {RasterFigure, FaceState} from './RasterFigure';
import {ANIMAL_BOX, Cat, Dog, Frog, Hen, AnimalPose} from './Animals';
import {Emote, EmoteType} from '../ui/Emote';

export type Act =
	| 'idle' | 'walk' | 'run' | 'tiptoe' | 'hop' | 'pull' | 'shake' | 'sad' | 'sniff' | 'proud' | 'fall'
	| 'sleep' | 'nod' | 'struggle' | 'scared' | 'laugh' | 'push' | 'happy' | 'flap' | 'jump' | 'angry' | 'think' | 'call' | 'wave';
export type Mood = FaceState['mood'] | 'cry' | 'lazy' | 'excited';

export type ActorProps = {
	who: string;
	x: Track;
	y: Track;
	scale?: Track;
	flip?: boolean | Step<boolean>;
	view?: 'front' | 'side' | Step<'front' | 'side'>;
	act?: Act | Step<Act>;
	mood?: Mood | Step<Mood>;
	emotes?: [number, number, EmoteType, number?][]; // from, to, type, size
	talk?: [number, number][]; // silent talking windows (local frames)
	mute?: boolean; // ignore voice lip-sync
	opacity?: Track;
	rot?: Track;
	shadow?: boolean;
	blush?: boolean;
	sink?: Track; // 0..1 part hidden below ground (mud)
};

const val = <T,>(f: number, v: T | Step<T> | undefined, d: T): T => {
	if (v === undefined) return d;
	if (Array.isArray(v) && v.length && Array.isArray(v[0])) return step(f, v as Step<T>).value;
	return v as T;
};
const since = (f: number, v: unknown) => (Array.isArray(v) && v.length && Array.isArray(v[0]) ? step(f, v as Step<unknown>).since : f);

export const Actor: React.FC<ActorProps> = (props) => {
	const {f, g} = useScene();
	const def = CHARS[props.who];
	const act = val<Act>(f, props.act, 'idle');
	const t = since(f, props.act);
	const moodRaw = val<Mood>(f, props.mood, 'smile');
	const flip = val<boolean>(f, props.flip, false);
	const moving = act === 'walk' || act === 'run' || act === 'tiptoe';
	const view = val<'front' | 'side'>(f, props.view, moving && def.side ? 'side' : 'front');
	const x = kf(f, props.x);
	const y = kf(f, props.y);
	const sc = kf(f, props.scale ?? 1);
	const op = kf(f, props.opacity ?? 1);
	const extraRot = kf(f, props.rot ?? 0);
	const sink = clamp(kf(f, props.sink ?? 0));

	// voice
	let speaking = !props.mute && isSpeaking(props.who, g);
	let mouth = props.mute ? 0 : mouthOf(props.who, g);
	if (props.talk) {
		for (const [a, b] of props.talk) {
			if (f >= a && f <= b) {
				speaking = true;
				mouth = clamp(0.25 + 0.6 * Math.abs(Math.sin(f * 0.55)) * (0.6 + 0.4 * noise(props.who + 'tk', f, 0.4)));
			}
		}
	}
	const blink = act === 'sleep' ? 1 : blinkAt(props.who, g);

	// body motion
	let bob = 0;
	let lean = 0;
	let sy = 1;
	let jx = 0;
	let headRot = 1.6 * noise(props.who + 'h', g, 0.025);
	let headBob = 0;
	const faceDir = view === 'side' ? (flip ? 1 : -1) : flip ? -1 : 1;
	const P = Math.PI;
	switch (act) {
		case 'idle':
		case 'think':
			sy = 1 + 0.007 * Math.sin((g / 48) * 2 * P);
			if (act === 'think') headRot += 6;
			break;
		case 'walk':
			bob = -Math.abs(Math.sin((P * t) / 11)) * 10;
			lean = faceDir * 1.5 + 1.5 * Math.sin((P * t) / 11);
			break;
		case 'run':
			bob = -Math.abs(Math.sin((P * t) / 6.5)) * 22;
			lean = faceDir * 9;
			sy = 1 - 0.03 * Math.abs(Math.cos((P * t) / 6.5));
			break;
		case 'tiptoe':
			bob = -Math.abs(Math.sin((P * t) / 16)) * 18;
			lean = -faceDir * 2 + 2 * Math.sin((P * t) / 16);
			break;
		case 'hop':
		case 'happy':
			bob = -Math.abs(Math.sin((P * t) / 9)) * (act === 'hop' ? 42 : 16);
			sy = 1 + 0.03 * Math.cos((2 * P * t) / 9);
			break;
		case 'laugh':
			bob = -Math.abs(Math.sin((P * t) / 5)) * 7;
			headRot += 5 * Math.sin((P * t) / 5);
			break;
		case 'pull':
			lean = -faceDir * (13 + 4 * Math.abs(Math.sin((P * t) / 14)));
			bob = -Math.abs(Math.sin((P * t) / 14)) * 6;
			break;
		case 'push':
			lean = faceDir * (10 + 3 * Math.sin((P * t) / 10));
			break;
		case 'struggle':
			lean = 3.5 * Math.sin((P * t) / 8);
			headRot += 6 * Math.sin((P * t) / 11);
			break;
		case 'shake':
		case 'scared':
			jx = 3.5 * Math.sin(t * 2.3);
			headRot += 2 * Math.sin(t * 1.7);
			break;
		case 'angry':
			jx = 2 * Math.sin(t * 2.8);
			sy = 1.02;
			break;
		case 'sad':
			headRot += 7;
			headBob += 4;
			sy = 0.985;
			break;
		case 'nod':
			headRot += 7 * Math.sin((P * t) / 13);
			headBob += 3 * Math.sin((P * t) / 13);
			break;
		case 'call':
			headRot -= 5;
			bob = -Math.abs(Math.sin((P * t) / 20)) * 6;
			break;
		case 'proud':
			sy = 1.03;
			headRot -= 4;
			break;
		case 'fall': {
			const k = clamp(t / 9);
			lean = -faceDir * 55 * k;
			bob = 20 * k;
			break;
		}
		case 'sleep':
			sy = 1 + 0.015 * Math.sin((g / 50) * 2 * P);
			headRot = 3;
			break;
	}
	if (speaking) {
		headRot += 3.2 * mouth * Math.sin(g * 0.42) + 1.2 * Math.sin(g * 0.11);
		headBob -= mouth * 5;
		sy *= 1 + 0.008 * mouth;
	}
	if (props.who === 'lali' && speaking) headRot -= 7 * mouth; // moo: lift head

	const mood: FaceState['mood'] = moodRaw === 'cry' ? 'sad' : moodRaw === 'lazy' || moodRaw === 'excited' ? 'smile' : moodRaw;
	const face: FaceState = {
		mouth,
		blink,
		lids: moodRaw === 'sad' || moodRaw === 'cry' ? 0.3 : moodRaw === 'lazy' ? 0.45 : act === 'sleep' ? 1 : 0,
		mood: act === 'laugh' ? 'happy' : mood,
		tears: moodRaw === 'cry' ? f : undefined,
		blush: props.blush ? 1 : 0,
	};

	let figure: React.ReactNode;
	let nat = {w: 100, h: 100, ax: 50};
	if (def.svg) {
		const box = ANIMAL_BOX[def.svg];
		nat = box;
		const p: AnimalPose = {f: g, mouth, blink, act, t, headRot: headRot * 0.6, mood: moodRaw as string};
		figure = def.svg === 'dog' ? <Dog p={p} /> : def.svg === 'hen' ? <Hen p={p} /> : def.svg === 'cat' ? <Cat p={p} /> : <Frog p={p} />;
	} else {
		const rig = view === 'side' && def.side ? def.side : def.front!;
		nat = {w: rig.w, h: rig.h, ax: rig.w / 2};
		figure = (
			<RasterFigure rig={rig} id={`${props.who}-${view}`}
				pose={{headRot: props.who === 'lali' ? headRot * 1.2 : headRot, headBob: headBob * (rig.h / 600), face: view === 'front' ? face : undefined}} />
		);
	}
	const s = (def.height / nat.h) * sc;
	const dispW = nat.w * s;
	const fx = flip ? -1 : 1;
	const emotes = (props.emotes ?? []).filter(([a, b]) => f >= a && f < b);
	return (
		<>
			{props.shadow !== false && sink < 0.05 ? (
				<div style={{position: 'absolute', left: x - dispW * 0.38, top: y - 14, width: dispW * 0.76, height: 28, borderRadius: '50%',
					background: 'radial-gradient(closest-side, rgba(0,0,0,0.32), rgba(0,0,0,0))', opacity: op * (1 + bob / 120)}} />
			) : null}
			<div style={{position: 'absolute', left: x + jx - nat.ax, top: y - nat.h, width: nat.w, height: nat.h, opacity: op,
				transformOrigin: `${nat.ax}px ${nat.h}px`,
				transform: `translateY(${bob}px) rotate(${lean + extraRot}deg) scale(${s * fx}, ${s * sy})`,
				clipPath: sink > 0 ? `inset(0 -50% ${sink * 100}% -50%)` : undefined}}>
				{figure}
			</div>
			{emotes.length ? (
				<svg style={{position: 'absolute', left: x - 150, top: y - def.height * sc - 170 + bob, overflow: 'visible'}} width={300} height={170}>
					{emotes.map(([a, b, type, size], i) => (
						<g key={i} transform={`translate(${150 + i * 70} 150)`}>
							<Emote type={type} t={f - a} len={b - a} size={size ?? 1} />
						</g>
					))}
				</svg>
			) : null}
		</>
	);
};
