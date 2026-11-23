import React from 'react';
import {Actor} from '../characters/Actor';
import {BgImage, Layer, Stage} from '../lib/Stage';
import {Clouds, Confetti, Dust, Grade, MudSplash, Rain, Rainbow, Sun, Wind} from '../props/Fx';
import {At, Bush, Gamchha, Ground, Mud, Rope, Signpost, TreeImg} from '../props/Village';
import {Caption, PopWord} from '../ui/Cards';
import {useT} from './common';
import {clamp, kf, ramp} from '../lib/anim';
import {useScene} from '../lib/scene';

/* S14 — running to the road, police Suman (lines 29-34) */
export const S14Suman: React.FC = () => {
	const {f, l, e, w} = useT();
	const meet = w(29, 6);
	const arrive = 70;
	const sGo = e(34) - 10;
	return (
		<>
			<Stage cam={{x: [[0, 620], [arrive, 900]], y: 600, zoom: [[0, 1.2], [arrive, 1.05]], follow: f > l(30) - 10 ? {suman: [1180, 600], tanim: [820, 650], ayesha: [680, 650]} : undefined, followZoom: 1.3}}>
				<BgImage src="bg/river_flat.jpg" w={2200} dy={-60} />
				<Layer depth={0.3}>
					<Clouds dark={0.55} y={30} speed={1.2} count={5} />
				</Layer>
				<Layer>
					<Ground kind="road" y={905} />
					<Signpost x={1760} y={960} text="নদী" />
					<Actor who="ayesha" x={[[0, -260], [arrive, 600]]} y={1004} flip act={[[0, 'run'], [arrive, 'idle'], [sGo + 30, 'run']]} mood={[[0, 'smile'], [l(32), 'o'], [l(33), 'smile']]} emotes={[[l(33), l(33) + 50, 'idea']]} />
					<Actor who="tanim" x={[[0, -100], [arrive - 4, 760]]} y={1008} flip act={[[0, 'run'], [arrive - 4, 'idle'], [sGo + 26, 'run']]} mood={[[0, 'smile'], [l(31), 'flat'], [l(32), 'o'], [l(33), 'smile']]} />
					<Actor who="bhola" x={[[0, 60], [arrive - 8, 900]]} y={1012} act={[[0, 'run'], [arrive - 8, 'idle'], [sGo + 22, 'run']]} />
					<Actor who="suman" x={[[0, 2300], [meet - 10, 2300], [meet + 40, 1260], [sGo, 1260], [sGo + 60, -300]]} y={1004}
						act={[[0, 'idle'], [meet - 10, 'walk'], [meet + 40, 'idle'], [sGo, 'run']]}
						view={[[0, 'side'], [meet + 40, 'front'], [sGo, 'side']]}
						mood={[[0, 'smile'], [l(30), 'flat'], [l(32), 'o'], [l(34), 'happy']]}
						emotes={[[l(32) + 4, l(32) + 50, 'exclaim']]} />
				</Layer>
				{f > sGo + 26 ? (
					<Layer>
						<Dust x={560} y={1000} />
						<Dust x={720} y={1004} />
					</Layer>
				) : null}
			</Stage>
			<Grade kind="storm" amount={0.25} vignette={0.3} />
			<Caption text="পুলিশ সুমন ভাই 👮" from={meet + 10} to={meet + 70} x={1300} y={140} bg="#2d4f9e" />
			<Caption text="সাবধান! কাদা পিছল ⚠️" from={w(32, 3)} to={e(32) + 10} x={960} y={140} bg="#d35400" />
		</>
	);
};

/* banyan aerial roots drawn over the riverbank picture */
const Roots: React.FC = () => {
	const {g} = useScene();
	return (
		<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
			{[1330, 1390, 1460, 1610, 1680, 1760, 1820].map((x, i) => (
				<path key={i} d={`M${x} ${120 + (i % 3) * 30} q${8 + Math.sin(g * 0.03 + i) * 6} 120 0 ${220 + (i % 2) * 120} q-8 60 2 ${80 + (i % 3) * 30}`} stroke="#6d4c2f" strokeWidth={5 - (i % 2)} fill="none" strokeLinecap="round" opacity={0.85} />
			))}
		</svg>
	);
};

const RiverSet: React.FC<{children: React.ReactNode; cam: object; weather?: number}> = ({children, cam, weather = 1}) => (
	<Stage cam={cam}>
		<BgImage src="bg/riverbank.jpg" w={2200} filter={`brightness(${1 - 0.3 * weather}) saturate(${1 - 0.25 * weather})`} />
		<Layer depth={0.3}>
			{weather < 0.6 ? <Sun x={400} y={180} r={70} rise={clamp(1 - weather * 1.5)} /> : null}
			<Clouds dark={0.75 * weather} y={20} speed={1} count={6} scale={1.1} />
		</Layer>
		<Layer depth={0.55}>
			<Roots />
		</Layer>
		{children}
	</Stage>
);

/* S15 — Lali found stuck in the mud under the banyan tree (lines 35-40) */
export const S15Found: React.FC = () => {
	const {f, l, e, w} = useT();
	const kidsIn = l(36) - 18;
	const push = w(39, 2);
	const stop = w(39, 7);
	const bGo = e(40) - 14;
	return (
		<>
			<RiverSet cam={{x: [[0, 1450], [w(35, 5), 1300], [kidsIn, 1300], [kidsIn + 30, 1000]], y: [[0, 300], [w(35, 5), 690], [kidsIn + 30, 620]], zoom: [[0, 1.35], [w(35, 5), 1.4], [kidsIn, 1.4], [kidsIn + 30, 1.05]],
				follow: f > l(36) + 10 ? {tanim: [900, 640], ayesha: [800, 640], lali: [1340, 660], bhola: [700, 700]} : undefined, followZoom: 1.3}}>
				<Layer>
					<Ground kind="grass" y={930} color="#5b9c3c" />
					<Mud x={1340} y={1004} s={0.95} />
					<Actor who="lali" x={1340} y={1010} sink={0.2} act={[[0, 'struggle'], [l(37), 'idle'], [push, 'struggle']]} mood="sad" emotes={[[l(37), e(37) + 10, 'sweat']]} />
					<Mud x={1340} y={1022} s={0.95} front />
					<Actor who="ayesha" x={[[0, -300], [kidsIn, -300], [kidsIn + 34, 760], [push - 10, 760], [push + 12, 935], [stop + 20, 935], [stop + 40, 760]]} y={1004} flip
						act={[[0, 'run'], [kidsIn + 34, 'idle'], [push - 10, 'walk'], [push + 12, 'push'], [stop + 40, 'idle']]}
						view={[[0, 'side'], [kidsIn + 34, 'front'], [push - 10, 'side'], [stop + 40, 'front']]}
						mood={[[0, 'o'], [l(38), 'sad']]} emotes={[[push + 14, stop + 20, 'sweat']]} />
					<Actor who="tanim" x={[[0, -150], [kidsIn, -150], [kidsIn + 30, 900], [push - 10, 900], [push + 12, 1050], [stop + 20, 1050], [stop + 40, 900]]} y={1008} flip
						act={[[0, 'run'], [kidsIn + 30, 'idle'], [push - 10, 'walk'], [push + 12, 'push'], [stop + 40, 'idle']]}
						view={[[0, 'side'], [kidsIn + 30, 'front'], [push - 10, 'side'], [stop + 40, 'front']]}
						mood={[[0, 'happy'], [l(38), 'flat']]} emotes={[[push + 14, stop + 20, 'sweat']]} />
					<Actor who="bhola" x={[[0, -40], [kidsIn, -40], [kidsIn + 26, 640], [bGo, 640], [bGo + 40, -400]]} y={1012}
						flip={[[0, false], [bGo, true]]}
						act={[[0, 'run'], [kidsIn + 26, 'idle'], [push, 'scared'], [l(40), 'idle'], [bGo, 'run']]} />
				</Layer>
			</RiverSet>
			<Grade kind="storm" amount={0.3} vignette={0.35} />
			<Rain amount={0.35} />
			<Caption text="বিশাল বটগাছ 🌳" from={4} to={w(35, 4)} x={960} y={140} bg="#2e7d32" />
			<PopWord text="হাম্বা! হাম্বা!" at={l(37)} len={50} x={1350} y={260} size={110} color="#ffb4a2" rot={-6} />
			<PopWord text="উফফ!" at={push + 30} len={40} x={700} y={300} size={120} color="#ffd166" rot={8} />
		</>
	);
};

/* moving scenery for the chase shots */
const Scroll: React.FC<{speed: number; y: number; children: (x: number) => React.ReactNode}> = ({speed, children}) => {
	const {f} = useT();
	return <>{children(f * speed)}</>;
};

/* S16 — Bhola runs for help, Kalam & Suman come running (line 41) */
export const S16Run: React.FC = () => {
	const {f, w} = useT();
	const swap = w(41, 4);
	const dog = f < swap;
	const sp = dog ? -34 : 26;
	const wrap = (x: number) => ((x % 2600) + 2600) % 2600 - 340;
	return (
		<>
			<Stage cam={{x: 960, y: 600, zoom: 1.08}}>
				<BgImage src="bg/village.jpg" w={2400} dx={dog ? -f * 2.5 : -swap * 2.5 + (f - swap) * 2} />
				<Layer>
					<Ground kind="road" y={905} />
					<Scroll speed={sp} y={0}>
						{(o) => (
							<>
								<TreeImg x={wrap(300 + o)} y={930} h={420} sway={0} />
								<TreeImg x={wrap(1600 + o)} y={930} h={380} sway={0} />
							</>
						)}
					</Scroll>
					{dog ? (
						<>
							<Dust x={760} y={1006} />
							<Actor who="bhola" x={[[0, -200], [18, 900]]} y={1012} scale={1.25} act="run" mood="excited" />
						</>
					) : (
						<>
							<Dust x={1120} y={1004} dir={1} />
							<Actor who="suman" x={[[swap, 2300], [swap + 22, 1100]]} y={1004} act="run" />
							<Actor who="kalam" x={[[swap, 2200], [swap + 26, 820]]} y={1004} act="run" mood="flat" />
						</>
					)}
					<Scroll speed={sp * 1.6} y={0}>
						{(o) => (
							<>
								<Bush x={wrap(600 + o * 1)} y={1120} s={1.2} />
								<Bush x={wrap(1900 + o)} y={1130} s={1.1} dark />
							</>
						)}
					</Scroll>
				</Layer>
			</Stage>
			<Wind amount={1.4} />
			<Grade kind="storm" amount={0.25} vignette={0.3} />
			<Caption text="প্রাণপণে দৌড়! 💨" from={6} to={swap - 4} x={960} y={140} bg="#d4892f" />
		</>
	);
};

/* S17 — the rescue: rope slips, gamchha, heave-ho, Lali is free (lines 42-50) */
export const S17Rescue: React.FC = () => {
	const {f, l, e, w} = useT();
	const ropeIn = w(43, 2);
	const pull1 = w(43, 8) + 4;
	const slip = w(44, 5);
	const getUp = slip + 46;
	const gam = w(46, 3);
	const pull2 = l(47);
	const free = w(49, 1);
	const clear = ramp(f, free, free + 60);
	const tug = (k: number) => (f > pull2 && f < free ? Math.max(0, Math.sin(((f - l(48)) / ((e(48) - l(48)) / 3)) * Math.PI)) * k : 0);
	const pulling = (f >= pull1 && f < slip) || (f >= pull2 && f < free);
	const fallen = (f >= slip && f < getUp) || (f >= free && f < free + 40);
	const neck: [number, number] = [1460, 792];
	const ropeEnd: [number, number] = f < slip ? neck : f < gam ? [1290 - clamp((f - slip) / 10) * 120, 880] : neck;
	const ropeVis = f >= ropeIn && f < free + 4;
	const actFor = (): [number, 'idle' | 'pull' | 'fall' | 'hop'][] => [[0, 'idle'], [pull1, 'pull'], [slip, 'fall'], [getUp, 'idle'], [pull2, 'pull'], [free, 'fall'], [free + 40, 'hop'], [free + 110, 'idle']];
	const viewFor = (): [number, 'front' | 'side'][] => [[0, 'front'], [pull1, 'side'], [getUp, 'front'], [pull2, 'side'], [free + 40, 'front']];
	const lx = kf(f, [[0, 1340], [free, 1340], [free + 16, 1520, 'out']]);
	const ly = kf(f, [[0, 1010], [free, 1010], [free + 8, 860, 'out'], [free + 16, 1000, 'in']]);
	return (
		<>
			<RiverSet weather={1 - clear}
				cam={{x: 960, y: 590, zoom: 1.05, follow: {kalam: [1060, 600], suman: [860, 600], tanim: [760, 640], lali: [1400, 640]}, followZoom: 1.25,
					shake: [[free - 1, 0], [free + 1, 14], [free + 24, 0], [l(48), 0], [l(48) + 2, 3], [e(48), 3], [e(48) + 4, 0]]}}>
				<Layer depth={0.3}>
					<Rainbow x={1000} y={900} r={760} reveal={ramp(f, free + 20, free + 80)} op={0.7 * clear} />
				</Layer>
				<Layer>
					<Ground kind="grass" y={930} color="#5b9c3c" />
					<Mud x={1340} y={1004} s={0.95} bubble={f < free} />
					<Actor who="lali" x={lx} y={ly} sink={f < free ? 0.2 : kf(f, [[free, 0.2], [free + 6, 0]])}
						act={[[0, 'struggle'], [l(42), 'idle'], [pull1, 'struggle'], [slip, 'idle'], [pull2, 'struggle'], [free, 'idle'], [free + 30, 'happy'], [free + 90, 'idle']]}
						mood={[[0, 'sad'], [free, 'happy']]}
						emotes={[[l(42) + 20, l(42) + 90, 'hearts', 0.8], [free + 20, 999, 'hearts']]} />
					<Mud x={1340} y={1022} s={0.95} front bubble={false} />
					<Actor who="bhola" x={[[0, 330], [pull1, 330]]} y={1012} act={actFor().map(([a, b]) => [a, b === 'pull' ? 'pull' : b === 'hop' ? 'happy' : b]) as never} rot={fallen ? -20 : 0} />
					<Actor who="ayesha" x={470} y={1004} flip act={actFor()} view={viewFor()} mood={[[0, 'o'], [free, 'happy']]} emotes={[[slip + 10, getUp, 'dizzy']]} />
					<Actor who="tanim" x={610} y={1008} flip act={actFor()} view={viewFor()} mood={[[0, 'o'], [l(45), 'smile'], [free, 'happy']]} emotes={[[l(45) - 2, l(45) + 50, 'idea'], [slip + 10, getUp, 'dizzy']]} />
					<Actor who="suman" x={[[0, -300], [34, 760]]} y={1004} flip={[[0, true], [40, false]]} act={[[0, 'run'], [34, 'idle'], ...actFor().slice(1)]} view={[[0, 'side'], [34, 'front'], ...viewFor().slice(1)]}
						mood={[[0, 'flat'], [free, 'happy']]} />
					<Actor who="kalam" x={[[0, -200], [40, 920]]} y={1004} flip={[[0, true], [46, false]]} act={[[0, 'run'], [40, 'idle'], ...actFor().slice(1)]} view={[[0, 'side'], [40, 'front'], ...viewFor().slice(1)]}
						mood={[[0, 'cry'], [e(42) + 6, 'sad'], [l(46), 'smile'], [free, 'happy']]} emotes={[[slip + 10, getUp, 'dizzy'], [free + 40, free + 140, 'sparkle']]} />
					{ropeVis ? (
						<Rope pts={[ropeEnd, [1000, 802 + tug(10)], [640, 814 + tug(10)], [300, 830 + tug(8)]]} sag={pulling ? 6 : 24} />
					) : null}
					{f >= gam && f < free + 4 ? (
						<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
							<g transform={`translate(1395 ${800 + tug(8)}) scale(${clamp((f - gam) / 8) * 1.1})`}>
								<Gamchha x={0} y={0} />
							</g>
						</svg>
					) : null}
					<MudSplash x={1360} y={940} start={free} />
					{f >= l(46) - 4 && f < gam ? (
						<At x={1010} y={690} s={0.9}>
							<Gamchha x={0} y={0} flat />
						</At>
					) : null}
				</Layer>
			</RiverSet>
			<Grade kind="storm" amount={0.3 * (1 - clear)} vignette={0.3} />
			{clear < 0.95 ? <Rain amount={0.3 * (1 - clear)} /> : null}
			<PopWord text="১" at={w(43, 6)} len={18} x={760} y={300} size={200} color="#ffd166" />
			<PopWord text="২" at={w(43, 7)} len={18} x={960} y={300} size={200} color="#ffd166" />
			<PopWord text="৩!" at={w(43, 8)} len={26} x={1160} y={300} size={200} color="#ff8c69" />
			<PopWord text="সড়াৎ!" at={slip} len={34} x={900} y={320} size={130} color="#ffffff" rot={10} />
			<Caption text="গামছা + দড়ি = শক্ত! 💪" from={gam + 6} to={l(47)} x={960} y={140} bg="#c0392b" />
			{LINES48.map((k) => (
				<PopWord key={k} text="হেইয়ো!" at={w(48, k)} len={22} x={700 + k * 260} y={300 - k * 20} size={140} color="#ffe14d" rot={-8 + k * 8} />
			))}
			<PopWord text="ঘ্যাঁচ!" at={free} len={40} x={1300} y={330} size={170} color="#ffb703" rot={-6} />
			<Confetti start={free + 6} />
		</>
	);
};
const LINES48 = [0, 1, 2];

export const __k2 = [Wind, Sun];
