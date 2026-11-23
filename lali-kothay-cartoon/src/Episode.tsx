import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Provider} from './lib/scene';
import {ls, le, ws, TOTAL_FRAMES} from './lib/time';
import {loadFonts} from './lib/fonts';
import {Subtitles} from './ui/Subtitles';
import {Transition, TransKind} from './ui/Cards';
import {S01Hook, S02Storm, S03Call, S04Flashback, S05Thief, S06Kids} from './scenes/Part1a';
import {S07Sneak, S08Prints, S09Sniff, S10Frog, S11Kukku, S11Night1, S11Ask, S11Night2, S12Mini, S13Clouds} from './scenes/Part1b';
import {S14Suman, S15Found, S16Run, S17Rescue} from './scenes/Part1c';
import {S18Thanks, S19Night, S20Nanu, S21Feast, S22End} from './scenes/Part2';

loadFonts();

type SceneDef = {id: string; from: number; C: React.FC; trans?: TransKind};

// Every cut is tied to a voice line (ls = line start, ws = word start),
// so the picture always stays in sync with the voice track.
export const SCENES: SceneDef[] = [
	{id: 'hook', from: 0, C: S01Hook},
	{id: 'storm', from: ls(1) - 6, C: S02Storm, trans: 'flash'},
	{id: 'call', from: ls(2) - 6, C: S03Call, trans: 'swipe'},
	{id: 'flashback', from: ls(4) - 8, C: S04Flashback, trans: 'flash'},
	{id: 'thief', from: ls(5) - 6, C: S05Thief, trans: 'flash'},
	{id: 'kids', from: ls(6) - 4, C: S06Kids, trans: 'swipe'},
	{id: 'sneak', from: ls(13) - 4, C: S07Sneak, trans: 'swipe'},
	{id: 'prints', from: ls(14) - 4, C: S08Prints, trans: 'iris'},
	{id: 'sniff', from: ls(16) - 2, C: S09Sniff},
	{id: 'frog', from: ls(17) - 3, C: S10Frog, trans: 'swipe'},
	{id: 'kukku', from: ls(20) - 2, C: S11Kukku, trans: 'swipe'},
	{id: 'night1', from: ws(20, 5) - 3, C: S11Night1, trans: 'flash'},
	{id: 'ask', from: ls(21) - 4, C: S11Ask, trans: 'flash'},
	{id: 'night2', from: ls(22) - 4, C: S11Night2, trans: 'flash'},
	{id: 'mini', from: ls(23) - 4, C: S12Mini, trans: 'swipe'},
	{id: 'clouds', from: ls(26) - 4, C: S13Clouds, trans: 'fade'},
	{id: 'suman', from: ls(29) - 6, C: S14Suman, trans: 'swipe'},
	{id: 'found', from: ls(35) - 6, C: S15Found, trans: 'swipe'},
	{id: 'run', from: ls(41) - 6, C: S16Run, trans: 'swipe'},
	{id: 'rescue', from: ls(42) - 8, C: S17Rescue, trans: 'swipe'},
	{id: 'thanks', from: ls(51) - 6, C: S18Thanks, trans: 'flash'},
	{id: 'night', from: ls(58) - 6, C: S19Night, trans: 'fade'},
	{id: 'nanu', from: ls(60) - 6, C: S20Nanu, trans: 'swipe'},
	{id: 'feast', from: ls(62) - 6, C: S21Feast, trans: 'fade'},
	{id: 'end', from: ls(63) - 6, C: S22End, trans: 'iris'},
];

export const sceneRanges = () => SCENES.map((s, i) => ({...s, to: i + 1 < SCENES.length ? SCENES[i + 1].from : TOTAL_FRAMES}));
const start = (id: string) => SCENES.find((s) => s.id === id)!.from;

/* ------------------------------------------------------------------ sound effects */
type Cue = {s: string; at: number; vol?: number; dur?: number; loop?: boolean};
const cues = (): Cue[] => {
	const c: Cue[] = [];
	const add = (s: string, at: number, vol = 0.6, dur?: number, loop?: boolean) => c.push({s, at: Math.max(0, Math.round(at)), vol, dur, loop});
	add('sting', 0, 0.55);
	// storm night -> morning
	const st = start('storm');
	add('rain', st, 0.5, ws(1, 5) + 18 - st, true);
	add('thunder', st + 8, 0.75); add('thunder', st + 40, 0.5); add('thunder', st + 66, 0.65);
	add('pop', st + 6, 0.4); add('pop', st + 16, 0.4);
	add('birds', ws(1, 5) + 12, 0.35); add('birds', ls(2) + 40, 0.25); add('birds', ls(3) + 60, 0.25);
	// swipes
	for (const s of SCENES) if (s.trans === 'swipe') add('whoosh', s.from - 9, 0.45);
	add('sparkle', start('flashback'), 0.35);
	add('crack', ws(5, 2), 0.35); add('pop', ws(5, 8), 0.5); add('ding', ws(5, 9), 0.25);
	// kids
	add('ding', ls(10) - 4, 0.4); add('pop', ws(10, 8), 0.4); add('pop', ws(11, 7), 0.5);
	// tip-toe
	for (let f = start('sneak') + 6; f < start('prints') - 4; f += 16) add('plink', f, 0.35);
	add('pop', ws(14, 4), 0.4); add('pop', ws(14, 9), 0.4); add('ding', ls(15) - 2, 0.4);
	add('pop', ws(16, 4) - 2, 0.4);
	// frog
	add('boing', ws(17, 4), 0.6); add('boing', ws(17, 8), 0.55); add('pop', ws(17, 4) + 2, 0.4); add('pop', ls(19) + 60, 0.35);
	// kukku's flashbacks
	add('rain', start('night1'), 0.4, start('ask') - start('night1'), true);
	add('crack', ws(20, 7), 0.6); add('thunder', ws(20, 7) + 2, 0.5);
	add('rain', start('night2'), 0.4, start('mini') - start('night2'), true);
	add('crack', ws(22, 0) + 4, 0.7); add('thud', ws(22, 1), 0.5); add('thunder', start('night2') + 4, 0.45);
	add('pop', ws(25, 0), 0.4);
	// storm coming
	add('wind', start('clouds'), 0.35, start('suman') - start('clouds'), true); add('thunder', start('clouds') + 118, 0.5);
	add('pop', ws(29, 6) + 10, 0.35); add('pop', ws(32, 3), 0.35); add('ding', ls(33), 0.35);
	// riverbank
	add('rain', start('found'), 0.22, start('run') - start('found'), true);
	add('splash', ls(37), 0.3); add('pop', ws(39, 2) + 30, 0.35);
	add('wind', start('run'), 0.4, start('rescue') - start('run'), true);
	// rescue
	add('rain', start('rescue'), 0.18, ws(49, 1) - start('rescue'), true);
	add('pop', ws(43, 6), 0.5); add('pop', ws(43, 7), 0.5); add('pop', ws(43, 8), 0.6);
	add('slide', ws(44, 5), 0.5); add('thud', ws(44, 5) + 8, 0.6); add('splash', ws(44, 5), 0.35);
	add('ding', ls(45) - 2, 0.4); add('pop', ws(46, 3), 0.45);
	for (let k = 0; k < 3; k++) add('knock', ws(48, k), 0.45);
	add('splash', ws(49, 1), 0.8); add('thud', ws(49, 1) + 6, 0.5); add('tada', ws(49, 1) + 4, 0.5);
	// part 2
	add('sparkle', ws(53, 4), 0.35); add('sparkle', ws(55, 2), 0.45);
	add('crickets', start('night'), 0.3, start('end') - start('night'), true);
	add('knock', start('night') + 14, 0.5); add('knock', start('night') + 22, 0.45); add('knock', start('night') + 60, 0.5);
	add('sparkle', ws(58, 8), 0.4);
	add('pop', ls(60) + 60, 0.4);
	// end card
	add('pop', start('end') + 6, 0.4); add('pop', start('end') + 16, 0.4); add('pop', start('end') + 26, 0.4);
	add('click', ws(63, 11) + 4, 0.7); add('bell', ws(63, 11) + 12, 0.5);
	add('whoosh', ws(63, 13) - 12, 0.4); add('pop', ws(63, 13) - 2, 0.45);
	return c;
};

export type EpisodeProps = {showSubtitles?: boolean; characterVoices?: boolean; music?: boolean; sfx?: boolean};

export const Episode: React.FC<EpisodeProps> = ({showSubtitles = true, characterVoices = true, music = true, sfx = true}) => {
	const g = useCurrentFrame();
	const ranges = sceneRanges();
	const cur = ranges.find((s) => g >= s.from && g < s.to) ?? ranges[ranges.length - 1];
	const Comp = cur.C;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Provider info={{f: g - cur.from, g, start: cur.from, dur: cur.to - cur.from}}>
				<Comp />
			</Provider>
			{ranges.map((s) => (s.trans ? <Transition key={s.id} kind={s.trans} g={g} cut={s.from} /> : null))}
			{showSubtitles ? <Subtitles /> : null}
			<Html5Audio src={staticFile(characterVoices ? 'audio/voice.mp3' : 'audio/voice_original.mp3')} />
			{music ? <Html5Audio src={staticFile('audio/music.mp3')} volume={0.9} /> : null}
			{sfx
				? cues().map((q, i) => (
						<Sequence key={i} from={q.at} durationInFrames={q.dur ?? 150} layout="none">
							<Html5Audio src={staticFile(`sfx/${q.s}.wav`)} loop={q.loop}
								volume={(f) => (q.vol ?? 0.6) * (q.dur ? interpolate(f, [0, 10, q.dur - 15, q.dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1)} />
						</Sequence>
					))
				: null}
		</AbsoluteFill>
	);
};

export const __u = le;
