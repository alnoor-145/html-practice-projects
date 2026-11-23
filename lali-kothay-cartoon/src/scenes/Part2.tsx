import React from 'react';
import {Actor} from '../characters/Actor';
import {BgImage, Layer, Stage} from '../lib/Stage';
import {Birds, Clouds, Fireflies, Grade, Moon, Rainbow, Stars, Sun} from '../props/Fx';
import {At, Cowshed, Ground, Haystack, Hut, Pitha, TreeImg} from '../props/Village';
import {Caption, EndCard, Moral, NextEpisode, PopWord} from '../ui/Cards';
import {Burst, useT} from './common';
import {clamp, kf, ramp} from '../lib/anim';

/* S18 — Kalam says sorry, everyone did it together (lines 51-57) */
export const S18Thanks: React.FC = () => {
	const {l, e, w} = useT();
	return (
		<>
			<Stage cam={{x: 980, y: 590, zoom: 1.04, follow: {kalam: [1180, 600], ayesha: [720, 640], tanim: [840, 640], suman: [1040, 600], bhola: [600, 700]}, followZoom: 1.28}}>
				<BgImage src="bg/riverbank.jpg" w={2200} filter="saturate(1.15) brightness(1.05)" />
				<Layer depth={0.3}>
					<Sun x={380} y={160} r={70} />
					<Rainbow x={1000} y={900} r={760} reveal={1} op={0.55} />
					<Clouds y={-30} speed={0.5} count={4} />
					<Birds y={180} count={4} />
				</Layer>
				<Layer>
					<Ground kind="grass" y={930} color="#62ad43" />
					<Actor who="lali" x={1600} y={1004} act="idle" mood="happy" emotes={[[0, 60, 'hearts'], [w(53, 3), w(53, 3) + 80, 'hearts', 0.8]]} />
					<Actor who="bhola" x={470} y={1012} act={[[0, 'idle'], [l(56), 'proud'], [l(57), 'happy'], [e(57) - 10, 'idle']]} mood={[[0, 'smile'], [l(57), 'happy']]} emotes={[[l(57) + 20, e(57), 'hearts']]} />
					<Actor who="ayesha" x={640} y={1004} mood={[[0, 'smile'], [l(53), 'happy']]} blush emotes={[[w(53, 4), w(53, 4) + 70, 'sparkle', 0.8]]} />
					<Actor who="tanim" x={800} y={1008} mood={[[0, 'smile'], [l(53), 'happy']]} act={[[0, 'idle'], [l(54) + 40, 'happy'], [e(54), 'idle']]} emotes={[[w(53, 4), w(53, 4) + 70, 'sparkle', 0.8]]} />
					<Actor who="suman" x={1030} y={1004} mood="happy" />
					<Actor who="kalam" x={1260} y={1004} flip
						act={[[0, 'sad'], [e(51), 'idle'], [l(53), 'happy'], [l(53) + 40, 'idle']]}
						mood={[[0, 'sad'], [l(53), 'happy']]}
						emotes={[[l(51) + 10, l(51) + 80, 'sweat']]} />
				</Layer>
			</Stage>
			<Caption text="মাফ করে দাও 🙏" from={l(51) + 4} to={l(51) + 70} x={1240} y={140} bg="#b8742f" />
			<Moral from={w(55, 2)} to={e(55) + 40} lines={['একা কাজ কঠিন,', 'সবাই মিলে কাজ সহজ!']} />
			<PopWord text="ঘেউ ঘেউ!" at={w(56, -1) - 4} len={30} x={520} y={330} size={110} color="#ffd166" rot={-8} />
		</>
	);
};

/* S19 — that night: new fence, Lali sleeps, Kalam's promise (lines 58-59) */
export const S19Night: React.FC = () => {
	const {f, l, w} = useT();
	const built = w(58, 8);
	return (
		<>
			<Stage cam={{x: [[0, 1000], [l(59) - 8, 1000], [l(59) + 14, 760]], y: [[0, 560], [l(59) + 14, 560]], zoom: [[0, 1.06], [l(59) - 8, 1.12], [l(59) + 14, 1.5]]}} background="#0c1a40">
				<BgImage src="bg/village.jpg" w={2400} filter="brightness(0.45) saturate(0.6) hue-rotate(15deg)" />
				<Layer depth={0.2}>
					<Stars />
					<Moon x={1550} y={190} size={190} />
				</Layer>
				<Layer>
					<Ground kind="yard" y={905} color="#7d6a4e" dark="#5e4e38" />
					<Cowshed x={1250} y={940} s={0.95} night fence={f >= built ? 'new' : 'broken'} rope="tied" />
					<Actor who="lali" x={1180} y={1010} scale={0.9} act={[[0, 'idle'], [w(58, 9), 'sleep']]} emotes={[[w(58, 11), 999, 'zzz']]} />
					<Actor who="kalam" x={[[0, 640], [built - 30, 640], [built - 10, 760], [l(59) - 10, 760]]} y={1004}
						act={[[0, 'nod'], [built - 30, 'walk'], [built - 10, 'idle']]} view={[[0, 'side'], [built - 10, 'front']]} flip={[[0, true], [built - 10, false]]}
						mood={[[0, 'flat'], [built, 'happy']]} emotes={[[l(59) + 20, l(59) + 90, 'sparkle']]} />
				</Layer>
			</Stage>
			<Grade kind="night" amount={0.55} vignette={0.45} />
			<PopWord text="ঠক! ঠক!" at={14} len={30} x={900} y={330} size={110} color="#ffe0a3" rot={-6} />
			<PopWord text="ঠক!" at={60} len={24} x={1100} y={300} size={110} color="#ffe0a3" rot={6} />
			<Caption text="নতুন বেড়া ✔" from={built} to={built + 50} x={1250} y={140} bg="#27ae60" />
		</>
	);
};

/* S20 — Nanu calls everyone for hot pitha (lines 60-61) */
export const S20Nanu: React.FC = () => {
	const {f, l} = useT();
	const kidsRun = l(61) + 30;
	return (
		<>
			<Stage cam={{x: [[0, 1180], [l(61) - 6, 1150], [l(61) + 10, 900]], y: [[0, 600], [l(61) + 10, 590]], zoom: [[0, 1.45], [l(61) - 6, 1.5], [l(61) + 10, 1.05]]}} background="#0c1a40">
				<BgImage src="bg/village.jpg" w={2400} dx={-200} filter="brightness(0.45) saturate(0.6) hue-rotate(15deg)" />
				<Layer depth={0.2}>
					<Stars />
					<Moon x={400} y={170} size={150} />
				</Layer>
				<Layer>
					<Ground kind="yard" y={905} color="#7d6a4e" dark="#5e4e38" />
					<Hut x={1240} y={940} s={1} night glow={1} />
					<div style={{position: 'absolute', left: 1040, top: 560, width: 400, height: 500, background: 'radial-gradient(closest-side, rgba(255,190,90,0.35), rgba(255,190,90,0))'}} />
					<Actor who="nanu" x={1180} y={1006} mood="happy" />
					<Pitha x={1190} y={792} s={0.62} />
					<Actor who="ayesha" x={[[0, 300], [kidsRun, 300], [kidsRun + 40, 900]]} y={1004} flip act={[[0, 'idle'], [kidsRun, 'run'], [kidsRun + 40, 'happy']]} mood="happy" />
					<Actor who="tanim" x={[[0, 470], [kidsRun, 470], [kidsRun + 36, 1000]]} y={1008} flip act={[[0, 'idle'], [kidsRun, 'run'], [kidsRun + 36, 'happy']]} mood="happy" />
				</Layer>
			</Stage>
			<Grade kind="night" amount={0.4} vignette={0.4} />
			<Caption text="নানু 👵" from={4} to={50} x={1180} y={130} bg="#2a9d8f" />
			<PopWord text="গরম গরম পিঠা! 😋" at={l(60) + 60} len={60} x={1200} y={220} size={90} color="#ffd166" rot={-4} />
		</>
	);
};

/* S21 — fireflies night, everyone eats pitha together (line 62) */
export const S21Feast: React.FC = () => {
	const {f, w} = useT();
	const moo = w(62, 11);
	const chat = (o: number): [number, number][] => [[10 + o, 40 + o], [70 + o, 100 + o]];
	return (
		<>
			<Stage cam={{x: [[0, 1060], [moo - 20, 1000], [moo, 520], [moo + 60, 600]], y: [[0, 620], [moo, 600]], zoom: [[0, 1.0], [moo - 20, 1.08], [moo, 1.35], [moo + 60, 1.2]]}} background="#0c1a40">
				<BgImage src="bg/village.jpg" w={2400} filter="brightness(0.42) saturate(0.6) hue-rotate(15deg)" />
				<Layer depth={0.2}>
					<Stars />
					<Moon x={1620} y={160} size={160} />
				</Layer>
				<Layer depth={0.85}>
					<Cowshed x={420} y={900} s={0.7} night fence="new" />
					<Haystack x={1750} y={905} s={0.55} night />
				</Layer>
				<Layer>
					<Ground kind="yard" y={905} color="#7d6a4e" dark="#5e4e38" />
					<Actor who="lali" x={430} y={960} scale={0.75} mood={[[0, 'smile'], [w(62, 13), 'happy']]} talk={[[moo, w(62, 12) + 4]]} mute emotes={[[w(62, 13), 999, 'hearts']]} />
					<Actor who="kalam" x={820} y={1004} mood="happy" act="laugh" talk={chat(0)} mute />
					<Actor who="suman" x={1660} y={1004} mood="happy" talk={chat(30)} mute />
					<Actor who="nanu" x={1210} y={1006} mood="happy" talk={chat(60)} mute />
					<Pitha x={1220} y={790} s={0.6} />
					<Actor who="tanim" x={1000} y={1008} mood="happy" act="happy" />
					<Actor who="ayesha" x={1420} y={1004} mood="happy" act="happy" blush />
					<Actor who="bhola" x={1050} y={1060} scale={0.85} act="happy" mood="happy" />
					<Actor who="mini" x={1500} y={1070} scale={0.8} mood="lazy" />
					<Actor who="kukku" x={1820} y={1060} scale={0.9} />
				</Layer>
				<Layer depth={1}>
					<Fireflies count={46} area={[0, 250, 1920, 950]} />
				</Layer>
			</Stage>
			<Grade kind="night" amount={0.35} vignette={0.4} />
			<PopWord text="হাম্বা! 😊" at={moo} len={50} x={560} y={300} size={110} color="#ffb4a2" rot={-6} />
		</>
	);
};

/* fish bone + empty plate for the teaser */
const EmptyPlate: React.FC<{x: number; y: number}> = ({x, y}) => (
	<At x={x} y={y}>
		<ellipse cx={0} cy={0} rx={130} ry={34} fill="#fafafa" stroke="#2a1810" strokeWidth={5} />
		<ellipse cx={0} cy={-4} rx={108} ry={24} fill="#e3f2fd" stroke="#1565c0" strokeWidth={3} />
		<g transform="translate(0 -12)" stroke="#5d4037" strokeWidth={5} fill="none" strokeLinecap="round">
			<path d="M-60 0 L50 0" />
			{[-40, -20, 0, 20].map((x) => <path key={x} d={`M${x} 0 l10 -14 M${x} 0 l10 14`} />)}
			<path d="M50 0 l20 -16 l0 32 Z" fill="#f5f5f5" />
			<circle cx={-66} cy={0} r={10} fill="#f5f5f5" />
		</g>
	</At>
);

/* S22 — like / share / subscribe + next episode teaser (line 63) */
export const S22End: React.FC = () => {
	const {f, w, e} = useT();
	const teaser = w(63, 13) - 6;
	if (f < teaser) {
		return (
			<>
				<Burst />
				<Stage cam={{zoom: 1}} background="transparent">
					<Layer>
						<Actor who="lali" x={1560} y={1060} scale={0.9} mood="happy" act="happy" emotes={[[0, 999, 'hearts']]} mute />
						<Actor who="tanim" x={260} y={1070} mood="happy" act="hop" mute />
						<Actor who="ayesha" x={440} y={1066} mood="happy" act="hop" mute blush />
						<Actor who="bhola" x={640} y={1074} act="happy" mood="happy" mute />
					</Layer>
				</Stage>
				<EndCard from={6} subAt={w(63, 11) + 4} />
				<Caption text="গল্পটা ভালো লাগলে..." from={0} to={w(63, 4)} x={960} y={190} bg="#e5533d" size={60} />
			</>
		);
	}
	const t = f - teaser;
	return (
		<>
			<Burst c1="#b388ff" c2="#7e57c2" />
			<Stage cam={{zoom: kf(t, [[0, 1.0], [80, 1.12]]), y: 640}} background="transparent">
				<Layer>
					<Actor who="mini" x={860} y={1030} scale={2.3} mood="o" emotes={[[10, 999, 'question'], [30, 999, 'question']]} mute />
					<div style={{position: 'absolute', left: 0, top: 0, transform: 'translate(1300px, 1010px) scale(1.5) translate(-1300px, -1010px)'}}><EmptyPlate x={1300} y={1010} /></div>
				</Layer>
			</Stage>
			<NextEpisode from={teaser + 4} />
			<div style={{position: 'absolute', inset: 0, background: '#000', opacity: clamp((f - (e(63) + 60)) / 30)}} />
		</>
	);
};

export const __k3 = [TreeImg, ramp];
