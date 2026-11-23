import React from 'react';
import {Actor} from '../characters/Actor';
import {BgImage, Layer, Stage} from '../lib/Stage';
import {Clouds, Grade, Lightning, Rain, Scent, Wind, Birds, Sun} from '../props/Fx';
import {At, Bush, Cowshed, Ground, Haystack, HoofPrints, Hut, TreeImg} from '../props/Village';
import {Caption, PopWord} from '../ui/Cards';
import {useT} from './common';
import {clamp, kf, ramp} from '../lib/anim';

/* S07 — the kids sneak off with Bhola (line 13) */
export const S07Sneak: React.FC = () => {
	const {w} = useT();
	const x0: [number, number][] = [[0, 120], [195, 1250]];
	const off = (d: number) => x0.map(([a, b]) => [a, b + d] as [number, number]);
	return (
		<>
			<Stage cam={{x: [[0, 760], [195, 1160]], y: 600, zoom: 1.12}}>
				<BgImage src="bg/meadow.jpg" w={2200} />
				<Layer depth={0.3}>
					<Birds y={140} count={3} speed={2} />
				</Layer>
				<Layer>
					<Ground kind="grass" y={915} />
					<Actor who="ayesha" x={off(0)} y={1000} act="tiptoe" flip emotes={[[14, 90, 'shh']]} />
					<Actor who="tanim" x={off(150)} y={1004} act="tiptoe" flip />
					<Actor who="bhola" x={off(330)} y={1006} act="walk" emotes={[[w(13, 9), w(13, 9) + 50, 'hearts', 0.8]]} />
				</Layer>
				<Layer depth={1.25}>
					<Bush x={420} y={1130} s={1.2} />
					<Bush x={1500} y={1140} s={1.1} dark />
				</Layer>
			</Stage>
			<Caption text="ভোলা 🐶" from={w(13, 9) - 4} to={w(13, 9) + 46} x={1380} y={160} bg="#d4892f" />
			<Caption text="চুপিচুপি..." from={w(13, 12) - 4} to={w(13, 15) + 20} x={560} y={150} bg="#5e548e" />
		</>
	);
};

const Magnifier: React.FC<{x: number; y: number}> = ({x, y}) => (
	<At x={x} y={y} s={1}>
		<line x1={70} y1={70} x2={150} y2={150} stroke="#5d4037" strokeWidth={22} strokeLinecap="round" />
		<circle r={90} fill="rgba(200,235,255,0.25)" stroke="#263238" strokeWidth={14} />
		<path d="M-50 -40 Q-30 -66 0 -70" stroke="#fff" strokeWidth={8} fill="none" opacity={0.7} strokeLinecap="round" />
	</At>
);

/* S08 — only hoof prints, no human foot prints (lines 14, 15) */
export const S08Prints: React.FC = () => {
	const {f, l, w} = useT();
	const back = l(15) - 8;
	const mx = kf(f, [[0, 380], [60, 640], [110, 900], [back, 1150]]);
	const my = kf(f, [[0, 870], [60, 920], [110, 880], [back, 930]]);
	return (
		<>
			<Stage cam={{x: [[0, 760], [back, 860], [back + 20, 960]], y: [[0, 860], [back, 860], [back + 20, 600]], zoom: [[0, 1.65], [back, 1.5], [back + 20, 1.06]]}}>
				<BgImage src="bg/meadow.jpg" w={2200} filter="blur(2px)" />
				<Layer>
					<Ground kind="yard" y={800} color="#8d6e4a" dark="#6d5033" />
					<HoofPrints x={360} y={900} s={1.1} count={7} reveal={ramp(f, 4, 70)} />
					<Actor who="tanim" x={200} y={1010} flip mood={[[0, 'smile'], [w(14, 8), 'o'], [l(15), 'smile']]} />
					<Actor who="ayesha" x={1620} y={1006} mood={[[0, 'o'], [l(15), 'happy']]} emotes={[[l(15) - 2, l(15) + 50, 'idea']]} />
					<Actor who="bhola" x={1380} y={1012} act={[[0, 'sniff'], [l(15), 'idle']]} />
					{f < back + 10 ? <Magnifier x={mx} y={my} /> : null}
				</Layer>
			</Stage>
			<Caption text="গরুর খুরের দাগ 🐄" from={w(14, 4)} to={w(14, 9)} x={960} y={140} bg="#6d4c41" />
			<Caption text="মানুষের পায়ের ছাপ নেই ✖" from={w(14, 9)} to={l(15) - 4} x={960} y={140} bg="#c0392b" />
		</>
	);
};

/* S09 — Bhola picks up the smell (line 16) */
export const S09Sniff: React.FC = () => {
	const {w} = useT();
	return (
		<>
			<Stage cam={{x: [[0, 900], [96, 1000]], y: 640, zoom: [[0, 1.5], [96, 1.62]]}}>
				<BgImage src="bg/meadow.jpg" w={2200} filter="blur(1px)" />
				<Layer>
					<Ground kind="grass" y={915} />
					<Scent x={1010} y={830} />
					<Actor who="bhola" x={860} y={1010} scale={1.35} act="sniff" />
				</Layer>
			</Stage>
			<PopWord text="এদিকে! এদিকে!" at={w(16, 4) - 2} len={40} x={1300} y={300} size={120} color="#ffd166" rot={-5} />
			<PopWord text="শুঁক শুঁক" at={4} len={36} x={560} y={260} size={90} color="#ffffff" rot={6} />
		</>
	);
};

/* S10 — a frog jumps out, Bhola hides behind Ayesha (lines 17-19) */
export const S10Frog: React.FC = () => {
	const {f, l, w} = useT();
	const jump = w(17, 4);
	const hide = w(17, 8);
	const frogX = kf(f, [[0, 1330], [jump, 1330], [jump + 18, 1140, 'out']]);
	const frogY = kf(f, [[0, 1010], [jump, 1010], [jump + 8, 760, 'out'], [jump + 18, 1012, 'in']]);
	const bx = kf(f, [[0, 1000], [hide, 1000], [hide + 18, 470, 'inOut'], [l(18), 470], [l(18) + 20, 430]]);
	const by = kf(f, [[0, 1010], [hide, 1010], [hide + 9, 800, 'out'], [hide + 18, 1010, 'in']]);
	return (
		<>
			<Stage cam={{x: [[0, 960], [jump - 6, 1080], [hide - 2, 1060], [hide + 22, 700], [l(19), 640]], y: [[0, 600], [jump - 6, 720], [hide + 22, 700], [l(19), 640]],
				zoom: [[0, 1.05], [jump - 6, 1.3], [hide - 2, 1.22], [hide + 22, 1.5], [l(19), 1.35]], shake: [[jump, 0], [jump + 2, 10], [jump + 14, 0]]}}>
				<BgImage src="bg/meadow.jpg" w={2200} />
				<Layer>
					<Ground kind="grass" y={915} />
					<Actor who="bhola" x={bx} y={by} act={[[0, 'sniff'], [hide, 'scared']]} emotes={[[hide + 18, hide + 70, 'sweat']]} />
					<Actor who="ayesha" x={560} y={1004} flip act={[[0, 'idle'], [l(19), 'laugh'], [l(19) + 30, 'idle']]} mood={[[0, 'smile'], [jump, 'o'], [hide + 20, 'smile'], [l(19), 'happy']]} />
					<Actor who="tanim" x={740} y={1008} flip mood={[[0, 'smile'], [jump, 'o'], [l(19), 'happy']]} emotes={[[jump + 2, jump + 40, 'exclaim']]} />
					{f >= jump ? <Actor who="frog" x={frogX} y={frogY} act={f < jump + 18 ? 'jump' : 'idle'} emotes={[[l(19) + 20, l(19) + 100, 'music', 0.6]]} /> : null}
				</Layer>
				<Layer>
					<Bush x={1330} y={1030} s={1} shake={f > w(17, 1) && f < jump + 10 ? 1 : 0} />
				</Layer>
			</Stage>
			<PopWord text="ব্যাঙ!" at={jump + 2} len={30} x={1320} y={300} size={140} color="#7bd389" rot={-8} />
			<PopWord text="ঘ্যাঙর ঘ্যাং!" at={l(19) + 60} len={40} x={1300} y={330} size={90} color="#c5f277" rot={6} />
		</>
	);
};

/* setting shared by Kukku's scenes */
const KukkuYard: React.FC<{cam: object; children?: React.ReactNode}> = ({cam, children}) => (
	<Stage cam={cam}>
		<BgImage src="bg/village.jpg" w={2400} dx={-180} />
		<Layer depth={0.8}>
			<Hut x={1700} y={900} s={0.7} />
		</Layer>
		<Layer>
			<Ground kind="yard" y={905} />
			<Haystack x={1220} y={1000} s={0.85} />
			{children}
		</Layer>
	</Stage>
);

/* S11a — Kukku saw everything (line 20, first half) */
export const S11Kukku: React.FC = () => {
	const {l} = useT();
	return (
		<KukkuYard cam={{x: [[0, 1150], [40, 1180]], y: [[0, 620], [40, 640]], zoom: [[0, 1.2], [40, 1.6]]}}>
			<Actor who="ayesha" x={430} y={1006} flip />
			<Actor who="tanim" x={610} y={1010} flip />
			<Actor who="bhola" x={820} y={1012} />
			<Actor who="kukku" x={1222} y={782} scale={1.1} mood="excited" act={[[0, 'flap'], [l(20) + 30, 'idle']]} emotes={[[l(20) + 30, l(20) + 90, 'exclaim', 0.7]]} />
		</KukkuYard>
	);
};

/* S11c — "then what happened, Kukku?" (line 21) */
export const S11Ask: React.FC = () => (
	<KukkuYard cam={{x: [[0, 640], [40, 620]], y: 640, zoom: [[0, 1.45], [40, 1.55]]}}>
		<Actor who="ayesha" x={430} y={1006} flip mood="o" />
		<Actor who="tanim" x={610} y={1010} flip emotes={[[0, 46, 'question']]} />
		<Actor who="bhola" x={820} y={1012} />
		<Actor who="kukku" x={1222} y={782} scale={1.1} />
	</KukkuYard>
);

/* S11b/d — Kukku's story: the stormy night (line 20 second half, line 22) */
export const NightShed: React.FC<{breakAt?: number; runAt?: number; scareAt?: number; crackAt?: number}> = ({breakAt, runAt, scareAt, crackAt}) => {
	const {f} = useT();
	const run = runAt ?? 99999;
	const lx = kf(f, [[0, 1120], [run, 1120], [run + 45, 2500, 'in']]);
	return (
		<>
			<Stage cam={{x: [[0, 1000], [run, 1060], [run + 40, 1300]], y: 600, zoom: [[0, 1.12], [run, 1.2], [run + 40, 1.05]], shake: crackAt ? [[crackAt, 0], [crackAt + 2, 8], [crackAt + 20, 0]] : 0}} background="#0d1530">
				<BgImage src="bg/village.jpg" w={2400} filter="brightness(0.4) saturate(0.6)" />
				<Layer>
					<Ground kind="yard" y={905} />
					<Cowshed x={900} y={940} s={0.95} night fence={breakAt !== undefined ? (f >= breakAt ? 'breaking' : 'ok') : 'ok'} breakT={breakAt !== undefined ? f - breakAt : 0} rope="none" />
					<Actor who="lali" x={lx} y={1000}
						act={[[0, 'idle'], [scareAt ?? 99999, 'shake'], [run, 'run']]}
						emotes={[[scareAt ?? 99999, run + 30, 'exclaim']]} />
				</Layer>
			</Stage>
			<Grade kind="night" amount={0.9} vignette={0.5} />
			<Rain heavy />
			<Lightning at={[2, crackAt ?? 40, (crackAt ?? 40) + 50]} x={1500} />
			<Caption text="সেই রাতে..." from={2} to={60} x={300} y={110} bg="#34495e" />
		</>
	);
};

export const S11Night1: React.FC = () => {
	const {w} = useT();
	return (
		<>
			<NightShed crackAt={w(20, 7)} />
			<PopWord text="মড়মড়!" at={w(20, 7)} len={40} x={900} y={320} size={140} color="#ffb4a2" rot={-6} />
		</>
	);
};

export const S11Night2: React.FC = () => {
	const {w} = useT();
	return (
		<>
			<NightShed breakAt={w(22, 0) + 4} crackAt={w(22, 0)} scareAt={w(22, 3)} runAt={w(22, 6)} />
			<PopWord text="ধপাস!" at={w(22, 1)} len={30} x={700} y={330} size={130} color="#ffd166" rot={-8} />
		</>
	);
};

/* S12 — lazy Mini the cat knows where Lali went (lines 23-25) */
const Platform: React.FC<{x: number; y: number}> = ({x, y}) => (
	<At x={x} y={y}>
		<rect x={-170} y={-10} width={340} height={26} rx={6} fill="#b58450" stroke="#2a1810" strokeWidth={5} />
		{[-150, 150].map((px) => <rect key={px} x={px - 10} y={10} width={20} height={150} fill="#8d6239" stroke="#2a1810" strokeWidth={4} />)}
		{[-120, -60, 0, 60, 120].map((px) => <line key={px} x1={px} y1={-8} x2={px} y2={14} stroke="#7a5230" strokeWidth={3} />)}
	</At>
);

export const S12Mini: React.FC = () => {
	const {f, l, e, w} = useT();
	const sleep = w(25, 7);
	return (
		<>
			<Stage cam={{x: 960, y: 600, zoom: 1.05, follow: {mini: [1230, 640], ayesha: [620, 650], tanim: [700, 650]}, followZoom: 1.38}}>
				<BgImage src="bg/village.jpg" w={2400} dx={160} />
				<Layer depth={0.8}>
					<Hut x={1500} y={900} s={0.75} />
					<TreeImg x={260} y={930} h={560} />
				</Layer>
				<Layer>
					<Ground kind="yard" y={905} />
					<Platform x={1240} y={850} />
					<Actor who="mini" x={1240} y={845} scale={1.15} mood="lazy" act={[[0, 'idle'], [sleep, 'sleep']]} emotes={[[sleep + 4, 400, 'zzz']]} shadow={false} />
					<Actor who="ayesha" x={560} y={1004} flip act={[[0, 'idle'], [l(24), 'hop'], [e(24), 'idle']]} mood={[[0, 'o'], [l(24), 'smile']]} />
					<Actor who="tanim" x={730} y={1008} flip mood={[[0, 'smile'], [l(23) + 40, 'o'], [l(25), 'happy']]} />
					<Actor who="bhola" x={900} y={1012} />
				</Layer>
			</Stage>
			<Caption text="মিনি 🐱" from={4} to={50} x={1240} y={130} bg="#7e6bb3" />
			{f > w(25, 0) ? (
				<PopWord text="নদীর ধারে বটগাছ ➜" at={w(25, 0)} len={e(25) - w(25, 0) + 10} x={960} y={160} size={84} color="#9be564" rot={-3} />
			) : null}
		</>
	);
};

/* S13 — dark clouds, rain is coming, hurry! (lines 26-28) */
export const S13Clouds: React.FC = () => {
	const {f, l, e} = useT();
	const dark = ramp(f, 0, 90);
	const go = e(28) - 6;
	return (
		<>
			<Stage cam={{x: [[0, 960], [l(27), 900]], y: [[0, 300], [70, 300], [l(27) - 6, 620]], zoom: [[0, 1.15], [l(27) - 6, 1.25], [l(28), 1.3]]}}>
				<BgImage src="bg/meadow.jpg" w={2200} filter={`brightness(${1 - 0.35 * dark}) saturate(${1 - 0.35 * dark})`} />
				<Layer depth={0.3}>
					<Clouds dark={0.4 + 0.6 * dark} y={10} speed={3} count={8} scale={1.3} />
				</Layer>
				<Layer>
					<Ground kind="grass" y={915} color="#5a9e3d" />
					<Actor who="ayesha" x={[[0, 700], [go, 700], [go + 40, 2300]]} y={1004} flip act={[[0, 'idle'], [go, 'run']]} mood={[[0, 'o'], [l(28), 'sad']]} emotes={[[l(28), e(28), 'sweat']]} />
					<Actor who="tanim" x={[[0, 880], [go, 880], [go + 36, 2400]]} y={1008} flip act={[[0, 'idle'], [go - 4, 'run']]} mood={[[0, 'o'], [l(27), 'flat']]} emotes={[[l(26) + 10, l(26) + 60, 'exclaim']]} />
					<Actor who="bhola" x={[[0, 1050], [go, 1050], [go + 30, 2500]]} y={1012} act={[[0, 'scared'], [go + 2, 'run']]} />
				</Layer>
			</Stage>
			<Grade kind="storm" amount={0.6 * dark} vignette={0.35} />
			<Wind amount={dark} />
			<Lightning at={[118]} x={600} />
			<Caption text="জলদি! 🏃" from={l(27)} to={l(27) + 50} x={1300} y={150} bg="#e67e22" />
		</>
	);
};

export const __k = [Sun, Cowshed, clamp];
