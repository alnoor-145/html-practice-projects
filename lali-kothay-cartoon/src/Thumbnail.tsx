import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Provider} from './lib/scene';
import {BgImage, Layer, Stage} from './lib/Stage';
import {Actor} from './characters/Actor';
import {Ground, Mud} from './props/Village';
import {Grade} from './props/Fx';
import {FONT} from './lib/fonts';
import {loadFonts} from './lib/fonts';

loadFonts();
const O = '#1d120c';

export const Thumbnail: React.FC = () => (
	<Provider info={{f: 40, g: 9000, start: 9000, dur: 100}}>
		<AbsoluteFill>
			<Stage cam={{zoom: 1}}>
				<BgImage src="bg/riverbank.jpg" w={2200} filter="saturate(1.25) brightness(0.95)" />
				<Layer>
					<Ground kind="grass" y={930} color="#5b9c3c" />
					<Mud x={1420} y={1004} s={1.05} bubble={false} />
					<Actor who="lali" x={1420} y={1010} scale={1.25} sink={0.2} mood="sad" act="idle" mute emotes={[[0, 99, 'sweat', 1.3]]} />
					<Mud x={1420} y={1022} s={1.05} front bubble={false} />
					<Actor who="kalam" x={300} y={1100} scale={1.45} mood="cry" act="idle" mute />
					<Actor who="bhola" x={720} y={1060} scale={1.2} act="idle" mute emotes={[[0, 99, 'exclaim', 1.2]]} />
					<Actor who="ayesha" x={930} y={1070} scale={1.15} mood="o" mute />
				</Layer>
			</Stage>
			<Grade kind="warm" amount={0.4} vignette={0.45} />
			<div style={{position: 'absolute', left: 560, top: 40, transform: 'rotate(-5deg)', fontFamily: FONT, fontWeight: 800, fontSize: 200, color: '#ffe14d',
				WebkitTextStroke: `20px ${O}`, paintOrder: 'stroke fill', textShadow: '0 14px 0 rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>লালি কোথায়?</div>
			<div style={{position: 'absolute', left: 700, top: 300, transform: 'rotate(-3deg)', fontFamily: FONT, fontWeight: 800, fontSize: 64, color: '#fff', background: '#e5533d',
				border: `7px solid ${O}`, borderRadius: 30, padding: '4px 30px 0'}}>কাদায় আটকে গেল! 😱</div>
		</AbsoluteFill>
	</Provider>
);
