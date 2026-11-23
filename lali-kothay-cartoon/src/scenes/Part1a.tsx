import React from 'react';
import {Actor} from '../characters/Actor';
import {BgImage, Layer, Stage} from '../lib/Stage';
import {Birds, Clouds, Grade, Lightning, Rain, Sun} from '../props/Fx';
import {At, Cowshed, Ground, Haystack, Hut, Thief, Thought, TreeImg} from '../props/Village';
import {Caption, Flashback, PopWord, TitleCard} from '../ui/Cards';
import {useT} from './common';
import {clamp, ramp} from '../lib/anim';

/* S01 — hook: Kalam crying in front of the empty cowshed (line 0) */
export const S01Hook: React.FC = () => {
	const {w} = useT();
	const pull = w(0, 4);
	return (
		<>
			<Stage cam={{x: [[0, 720], [pull, 930]], y: [[0, 470], [pull, 590]], zoom: [[0, 1.95], [pull - 6, 1.8], [pull + 22, 1.12]]}} background="#8fb6cf">
				<BgImage src="bg/village.jpg" w={2400} filter="saturate(0.75) brightness(0.9)" />
				<Layer depth={0.75}>
					<Hut x={170} y={900} s={0.75} />
				</Layer>
				<Layer>
					<Ground kind="yard" y={905} />
					<Cowshed x={1330} y={935} s={0.92} fence="broken" rope="cut" />
					<Actor who="kalam" x={720} y={1000} act="sad" mood="cry" emotes={[[46, 110, 'cloud']]} />
				</Layer>
			</Stage>
			<Grade kind="storm" amount={0.35} />
		</>
	);
};

/* S02 — stormy night turns into a new morning + title (line 1) */
export const S02Storm: React.FC = () => {
	const {f, w} = useT();
	const dayAt = w(1, 5);
	const day = ramp(f, dayAt - 14, dayAt + 16);
	return (
		<>
			<Stage cam={{zoom: [[0, 1.0], [105, 1.08]], y: [[0, 540], [105, 520]]}} background="#122042">
				<BgImage src="bg/village.jpg" w={2400} filter={`brightness(${0.38 + 0.62 * day}) saturate(${0.55 + 0.5 * day}) hue-rotate(${(1 - day) * 15}deg)`} />
				<Layer depth={0.3}>
					<Sun x={1500} y={260} rise={day} />
					<Clouds dark={1 - day} y={20} speed={day > 0.5 ? 0.5 : 3} count={6} />
					{day > 0.4 ? <Birds y={200} speed={4} /> : null}
				</Layer>
				<Layer depth={0.8}>
					<Hut x={300} y={900} s={0.8} night={day < 0.5} glow={(1 - day) * 0.7} />
					<Haystack x={720} y={905} s={0.6} night={day < 0.5} />
				</Layer>
				<Layer>
					<Ground kind="yard" y={905} />
					<Cowshed x={1330} y={940} s={0.9} fence={day > 0.5 ? 'broken' : 'ok'} night={day < 0.5} rope={day > 0.5 ? 'cut' : 'none'} />
				</Layer>
			</Stage>
			<Grade kind="night" amount={1 - day} vignette={0.45 - 0.2 * day} />
			{day < 0.98 ? <Rain amount={1 - day} heavy /> : null}
			<Lightning at={[8, 40, 66]} x={1400} />
			<TitleCard from={4} to={dayAt - 6} />
		</>
	);
};

/* S03 — Kalam is sad, calls for Lali (lines 2, 3) */
export const S03Call: React.FC = () => {
	const {f, l, w} = useT();
	const c = l(1 + 2);
	return (
		<>
			<Stage cam={{x: [[0, 980], [c - 5, 900], [c + 12, 960]], y: [[0, 560], [c - 5, 520], [c + 12, 560]], zoom: [[0, 1.05], [c - 5, 1.45], [c + 12, 1.08]]}}>
				<BgImage src="bg/village.jpg" w={2400} />
				<Layer depth={0.3}>
					<Sun x={1650} y={200} r={70} />
					<Birds y={160} speed={3} count={4} />
				</Layer>
				<Layer depth={0.8}>
					<Hut x={200} y={900} s={0.8} />
					<Haystack x={560} y={905} s={0.55} />
				</Layer>
				<Layer>
					<Ground kind="yard" y={905} />
					<Cowshed x={1420} y={940} s={0.9} fence="broken" rope="cut" />
					<Actor who="kalam" x={900} y={1000}
						act={[[0, 'sad'], [c, 'call']]}
						mood={[[0, 'sad'], [c, 'smile']]}
						flip={[[0, false], [c + 30, true], [c + 58, false]]}
						emotes={[[12, c - 4, 'cloud']]} />
				</Layer>
			</Stage>
			<PopWord text="লালি...!" at={w(3, 0) - 2} len={34} x={500} y={330} size={110} color="#ffffff" rot={-8} />
			<PopWord text="ও লালি...!" at={w(3, 2) - 2} len={34} x={1420} y={300} size={100} color="#ffffff" rot={6} />
			<Caption text="কালাম চাচা" from={4} to={60} x={360} y={110} bg="#b8742f" />
		</>
	);
};

/* S04 — flashback: Kalam and his best friend Lali (line 4) */
export const S04Flashback: React.FC = () => {
	const {w} = useT();
	const wide = w(4, 10);
	const nod = w(4, 19);
	return (
		<>
			<Stage cam={{x: [[0, 1230], [wide - 10, 1180], [wide + 30, 960]], y: [[0, 600], [wide + 30, 560]], zoom: [[0, 1.45], [wide - 10, 1.38], [wide + 30, 1.1], [nod + 60, 1.22]]}}>
				<BgImage src="bg/meadow.jpg" w={2200} />
				<Layer depth={0.3}>
					<Sun x={1500} y={170} r={60} />
				</Layer>
				<Layer>
					<Ground kind="grass" y={915} />
					<Actor who="lali" x={1230} y={985} act={[[0, 'idle'], [nod, 'nod']]} emotes={[[w(4, 7), w(4, 7) + 70, 'hearts'], [nod + 30, nod + 140, 'music']]} />
					<Actor who="kalam" x={760} y={1000} flip mood="happy" talk={[[w(4, 13), w(4, 18)], [nod + 40, nod + 80]]} emotes={[[w(4, 13), w(4, 13) + 60, 'music']]} />
				</Layer>
			</Stage>
			<Grade kind="sepia" amount={0.8} vignette={0.2} />
			<Flashback />
		</>
	);
};

/* S05 — broken fence, missing rope, "a thief!" (line 5) */
export const S05Thief: React.FC = () => {
	const {f, w} = useT();
	const rope = w(5, 4);
	const out = w(5, 6);
	const think = w(5, 8);
	return (
		<>
			<Stage cam={{x: [[0, 1150], [rope, 1110], [out, 900]], y: [[0, 860], [rope, 760], [out, 560]], zoom: [[0, 1.8], [rope, 1.9], [out, 1.1]]}}>
				<BgImage src="bg/village.jpg" w={2400} />
				<Layer>
					<Ground kind="yard" y={905} />
					<Cowshed x={1150} y={960} s={1} fence="broken" rope="cut" />
					<Actor who="kalam" x={[[0, 380], [out, 380], [out + 25, 560]]} y={1000}
						act={[[0, 'idle'], [out, 'walk'], [out + 25, 'think'], [w(5, 9), 'angry']]}
						view={[[0, 'front'], [out, 'side'], [out + 25, 'front']]}
						mood={[[0, 'flat'], [w(5, 9), 'angry']]}
						flip={[[0, true], [out + 25, false]]}
						emotes={[[w(5, 9), w(5, 9) + 60, 'exclaim']]} />
				</Layer>
				{f > think ? (
					<Layer>
						<Thought x={760} y={300} s={0.95 * clamp((f - think) / 8)} from={[620, 500]}>
							<svg style={{overflow: 'visible', position: 'absolute'}} width={10} height={10}>
								<Thief x={-10} y={110} s={0.9} t={f} />
							</svg>
						</Thought>
					</Layer>
				) : null}
			</Stage>
			<Caption text="বেড়া ভাঙা!" from={8} to={rope - 4} x={960} y={150} />
			<Caption text="দড়িও নেই!" from={rope + 2} to={out} x={960} y={150} bg="#8e44ad" />
		</>
	);
};

/* S06 — Tanim & Ayesha meet Kalam, he refuses help (lines 6-12) */
export const S06Kids: React.FC = () => {
	const {f, l, e, w} = useT();
	const leave = w(12, 2);
	const kidAct = (arrive: number) => [[0, 'run'], [arrive, 'idle'], [leave, 'walk']] as [number, 'run' | 'idle' | 'walk'][];
	return (
		<>
			<Stage cam={{x: 960, y: 560, zoom: 1.05, follow: {kalam: [1060, 560], ayesha: [700, 640], tanim: [820, 640]}, followZoom: 1.32}}>
				<BgImage src="bg/village.jpg" w={2400} />
				<Layer depth={0.3}>
					<Birds y={150} speed={2} count={3} />
				</Layer>
				<Layer depth={0.8}>
					<Hut x={140} y={900} s={0.75} />
				</Layer>
				<Layer>
					<Ground kind="yard" y={905} />
					<Cowshed x={1560} y={940} s={0.85} fence="broken" rope="cut" />
					<Actor who="kalam" x={1180} y={1000}
						act={[[0, 'sad'], [l(7), 'idle'], [l(11), 'angry'], [e(11) + 4, 'idle']]}
						mood={[[0, 'sad'], [l(7), 'cry'], [e(7) + 6, 'sad'], [l(9), 'flat'], [l(11), 'angry'], [e(11) + 4, 'flat']]}
						emotes={[[l(9) + 20, e(9), 'anger'], [l(11), e(11) + 10, 'steam']]} />
					<Actor who="ayesha" x={[[0, -120], [26, 560], [leave, 560], [leave + 70, -160]]} y={1000}
						act={kidAct(26)} flip={[[0, true], [leave, false]]}
						mood={[[0, 'smile'], [l(6), 'flat'], [l(12), 'smile']]}
						emotes={[[l(6) - 6, l(6) + 30, 'question']]} />
					<Actor who="tanim" x={[[0, -300], [32, 770], [leave + 6, 770], [leave + 80, -120]]} y={1004}
						act={[[0, 'run'], [32, 'idle'], [leave + 6, 'walk']]} flip={[[0, true], [leave + 6, false]]}
						mood={[[0, 'smile'], [l(9), 'sad'], [l(10), 'smile'], [l(11), 'o'], [e(11), 'sad']]}
						emotes={[[l(10) - 4, l(10) + 46, 'idea'], [l(11) + 10, e(11), 'sweat']]} />
				</Layer>
				{f > w(10, 8) && f < e(10) + 12 ? (
					<Layer>
						<Thought x={560} y={180} s={0.75 * clamp((f - w(10, 8)) / 8)} from={[760, 520]}>
							<svg style={{overflow: 'visible', position: 'absolute'}} width={10} height={10}>
								<rect x={-200} y={30} width={400} height={110} rx={50} fill="#8d6e4a" />
								{[0, 1, 2, 3].map((i) => (
									<g key={i} transform={`translate(${-150 + i * 95} ${(i % 2) * 40 + 60}) rotate(-80)`} opacity={clamp((f - w(10, 8) - 6 - i * 6) / 6)}>
										<ellipse cx={0} cy={0} rx={22} ry={11} fill="#4a2f17" />
										<ellipse cx={-28} cy={0} rx={10} ry={9} fill="#4a2f17" />
									</g>
								))}
							</svg>
						</Thought>
					</Layer>
				) : null}
			</Stage>
			<PopWord text="পুলিশ!" at={w(11, 7)} len={30} x={1250} y={250} size={120} color="#ff6b6b" rot={8} />
		</>
	);
};

export const __keepAt = At;
export const __keepTree = TreeImg;
