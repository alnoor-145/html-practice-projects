import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../lib/scene';
import {le, ls, ws} from '../lib/time';

/** local-frame helpers for the current scene */
export const useT = () => {
	const {start, f, dur} = useScene();
	return {
		f,
		dur,
		l: (i: number) => ls(i) - start, // line start
		e: (i: number) => le(i) - start, // line end
		w: (i: number, k: number) => ws(i, k) - start, // word start
	};
};

export const Sky: React.FC<{top?: string; bottom?: string}> = ({top = '#5fb6ef', bottom = '#cdeeff'}) => (
	<AbsoluteFill style={{background: `linear-gradient(${top}, ${bottom})`}} />
);

/** radial "sun-burst" background for title/end cards */
export const Burst: React.FC<{c1?: string; c2?: string}> = ({c1 = '#ffd166', c2 = '#ffb703'}) => {
	const {g} = useScene();
	return (
		<AbsoluteFill style={{background: c2, overflow: 'hidden'}}>
			<svg width={1920} height={1080}>
				<g transform={`translate(960 540) rotate(${g * 0.3})`}>
					{Array.from({length: 18}).map((_, i) => (
						<path key={i} d="M0 0 L1400 -130 L1400 130 Z" transform={`rotate(${i * 20})`} fill={c1} />
					))}
				</g>
			</svg>
		</AbsoluteFill>
	);
};
