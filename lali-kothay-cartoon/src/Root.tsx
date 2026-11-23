import React from 'react';
import {Composition, Sequence} from 'remotion';
import {Episode, EpisodeProps} from './Episode';
import {Thumbnail} from './Thumbnail';
import {FPS, ls, TOTAL_FRAMES} from './lib/time';

const P2 = ls(51) - 6; // part 2 starts with Kalam's apology

const Part1: React.FC<EpisodeProps> = (p) => <Episode {...p} />;
const Part2: React.FC<EpisodeProps> = (p) => (
	<Sequence from={-P2}>
		<Episode {...p} />
	</Sequence>
);

const defaults: EpisodeProps = {showSubtitles: true, characterVoices: true, music: true, sfx: true};

export const RemotionRoot: React.FC = () => (
	<>
		{/* full episode, 1920x1080, ~4.5 min */}
		<Composition id="LaliEpisode" component={Episode} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={defaults} />
		{/* the same episode split in two */}
		<Composition id="LaliPart1" component={Part1} durationInFrames={P2} fps={FPS} width={1920} height={1080} defaultProps={defaults} />
		<Composition id="LaliPart2" component={Part2} durationInFrames={TOTAL_FRAMES - P2} fps={FPS} width={1920} height={1080} defaultProps={defaults} />
		{/* YouTube thumbnail (render with: npx remotion still Thumbnail out/thumbnail.png) */}
		<Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={1920} height={1080} />
	</>
);
