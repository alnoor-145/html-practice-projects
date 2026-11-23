import React from 'react';
import {Img, staticFile} from 'remotion';
import {useScene} from '../lib/scene';

const O = '#2a1810';

/** place an SVG drawn around (0,0) at world position x,y */
export const At: React.FC<{x: number; y: number; s?: number; rot?: number; flip?: boolean; op?: number; children: React.ReactNode; w?: number; h?: number}> = ({x, y, s = 1, rot = 0, flip, op = 1, children, w = 10, h = 10}) => (
	<svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', opacity: op}} width={w} height={h}>
		<g transform={`rotate(${rot}) scale(${flip ? -s : s} ${s})`}>{children}</g>
	</svg>
);

/* ------------------------------------------------------------ ground */
export const Ground: React.FC<{y?: number; color?: string; dark?: string; kind?: 'grass' | 'yard' | 'mud' | 'road'; night?: boolean}> = ({y = 860, color, dark, kind = 'grass'}) => {
	const base = color ?? (kind === 'yard' ? '#c9a46a' : kind === 'road' ? '#c79a62' : '#6fbf4a');
	const edge = dark ?? (kind === 'yard' ? '#a7824c' : kind === 'road' ? '#9c7442' : '#4f9a33');
	return (
		<svg style={{position: 'absolute', left: -400, top: y - 40, overflow: 'visible'}} width={2720} height={400}>
			<path d={`M0 40 Q680 0 1360 30 Q2040 60 2720 24 L2720 400 L0 400 Z`} fill={base} />
			<path d={`M0 40 Q680 0 1360 30 Q2040 60 2720 24`} stroke={edge} strokeWidth={10} fill="none" />
			{kind === 'grass' || kind === 'yard'
				? Array.from({length: 46}).map((_, i) => {
						const x = (i * 59) % 2720;
						const yy = 70 + ((i * 37) % 260);
						return kind === 'grass' ? (
							<path key={i} d={`M${x} ${yy} l6 -18 l4 16 l6 -14 l3 16`} stroke={edge} strokeWidth={4} fill="none" strokeLinecap="round" />
						) : (
							<ellipse key={i} cx={x} cy={yy} rx={14} ry={5} fill={edge} opacity={0.35} />
						);
					})
				: null}
			{kind === 'road'
				? Array.from({length: 30}).map((_, i) => <ellipse key={i} cx={(i * 97) % 2720} cy={80 + ((i * 53) % 280)} rx={9} ry={5} fill="#8d6a3f" opacity={0.6} />)
				: null}
		</svg>
	);
};

/* ------------------------------------------------------------ cowshed (goal ghor) */
export const Cowshed: React.FC<{x: number; y: number; s?: number; fence?: 'broken' | 'new' | 'ok' | 'breaking'; breakT?: number; night?: boolean; empty?: boolean; rope?: 'cut' | 'none' | 'tied'}> = ({x, y, s = 1, fence = 'ok', breakT = 0, night, rope = 'none'}) => {
	const wall = night ? '#5a4630' : '#8a6a3a';
	const post = night ? '#6e5530' : '#a8793f';
	const straw = night ? '#8d7a3e' : '#e2bd57';
	const strawD = night ? '#6c5c2c' : '#b8902e';
	const bamboo = night ? '#8b7a44' : '#cdb26a';
	return (
		<At x={x} y={y} s={s}>
			{/* back wall: woven bamboo */}
			<rect x={-300} y={-330} width={600} height={330} fill={wall} stroke={O} strokeWidth={5} />
			{Array.from({length: 12}).map((_, i) => (
				<path key={i} d={`M-300 ${-310 + i * 27} L300 ${-310 + i * 27}`} stroke={night ? '#4a3a26' : '#6f5530'} strokeWidth={6} />
			))}
			{Array.from({length: 16}).map((_, i) => (
				<path key={`v${i}`} d={`M${-290 + i * 38} -330 L${-290 + i * 38} 0`} stroke={night ? '#66523a' : '#9d7d4a'} strokeWidth={3} opacity={0.7} />
			))}
			{/* hay + trough */}
			<path d="M-250 0 Q-200 -70 -130 -40 Q-90 -80 -40 -20 L-40 0 Z" fill={straw} stroke={O} strokeWidth={4} />
			<rect x={60} y={-60} width={190} height={50} rx={10} fill="#7b5a3a" stroke={O} strokeWidth={5} />
			<rect x={70} y={-58} width={170} height={12} fill="#5c412a" />
			{/* rope on post */}
			{rope !== 'none' ? (
				<g>
					<path d="M-20 -230 Q-10 -200 -30 -170" stroke="#c8a45a" strokeWidth={9} fill="none" strokeLinecap="round" />
					{rope === 'cut' ? <path d="M-30 -170 l-8 6 M-30 -170 l2 10 M-30 -170 l8 4" stroke="#c8a45a" strokeWidth={4} /> : <path d="M-30 -170 Q-60 -80 -10 -40" stroke="#c8a45a" strokeWidth={9} fill="none" />}
				</g>
			) : null}
			{/* posts */}
			{[-310, -10, 290].map((px) => (
				<rect key={px} x={px - 12} y={-380} width={24} height={380} fill={post} stroke={O} strokeWidth={5} />
			))}
			{/* thatched roof */}
			<path d="M-400 -330 L0 -520 L400 -330 Q0 -300 -400 -330 Z" fill={straw} stroke={O} strokeWidth={6} strokeLinejoin="round" />
			{Array.from({length: 22}).map((_, i) => {
				const px = -380 + i * 36;
				return <path key={i} d={`M${px} ${-338 + Math.abs(px) * 0.0} L${px * 0.55} ${-420 - (380 - Math.abs(px)) * 0.18}`} stroke={strawD} strokeWidth={3} opacity={0.8} />;
			})}
			<path d="M-400 -330 Q0 -300 400 -330 L410 -312 Q0 -280 -410 -312 Z" fill={strawD} stroke={O} strokeWidth={5} />
			{/* front fence */}
			<Fence x={0} y={0} state={fence} t={breakT} color={bamboo} />
		</At>
	);
};

export const Fence: React.FC<{x: number; y: number; state: 'broken' | 'new' | 'ok' | 'breaking'; t?: number; color?: string; width?: number}> = ({x, y, state, t = 0, color = '#cdb26a', width = 640}) => {
	const posts = 7;
	const half = width / 2;
	const brokenIdx = [3, 4];
	const fall = state === 'broken' ? 1 : state === 'breaking' ? Math.min(1, t / 10) : 0;
	return (
		<g transform={`translate(${x} ${y})`}>
			{Array.from({length: posts}).map((_, i) => {
				const px = -half + (i * width) / (posts - 1);
				const broken = brokenIdx.includes(i) && fall > 0;
				return (
					<g key={i} transform={broken ? `rotate(${(i === 3 ? -1 : 1) * 70 * fall} ${px} 0)` : undefined}>
						<rect x={px - 10} y={-150} width={20} height={150} rx={5} fill={state === 'new' ? '#dcc27a' : color} stroke={O} strokeWidth={4} />
						<line x1={px - 10} y1={-100} x2={px + 10} y2={-100} stroke={O} strokeWidth={2} opacity={0.5} />
					</g>
				);
			})}
			{[-120, -60].map((ry, k) => (
				<g key={k}>
					{fall > 0 ? (
						<>
							<rect x={-half} y={ry - 8} width={half - 60} height={16} rx={6} fill={color} stroke={O} strokeWidth={4} />
							<rect x={60} y={ry - 8} width={half - 60} height={16} rx={6} fill={color} stroke={O} strokeWidth={4} />
							<g transform={`rotate(${(k ? 25 : -20) * fall} -60 ${ry}) translate(0 ${fall * (80 - ry * 0.6)})`}>
								<rect x={-60} y={ry - 8} width={70} height={16} rx={6} fill={color} stroke={O} strokeWidth={4} />
								<path d={`M10 ${ry - 8} l8 4 l-6 4 l8 6`} stroke={O} strokeWidth={3} fill="none" />
							</g>
						</>
					) : (
						<rect x={-half} y={ry - 8} width={width} height={16} rx={6} fill={state === 'new' ? '#e6cf8c' : color} stroke={O} strokeWidth={4} />
					)}
				</g>
			))}
			{state === 'new' ? [-200, 0, 200].map((px) => <path key={px} d={`M${px - 10} -125 l20 10 M${px - 10} -65 l20 10`} stroke="#a0522d" strokeWidth={5} />) : null}
		</g>
	);
};

/* ------------------------------------------------------------ hut */
export const Hut: React.FC<{x: number; y: number; s?: number; night?: boolean; glow?: number}> = ({x, y, s = 1, night, glow = 0}) => (
	<At x={x} y={y} s={s}>
		<rect x={-220} y={-260} width={440} height={260} fill={night ? '#7a5a3e' : '#c8925c'} stroke={O} strokeWidth={6} />
		<path d="M-220 -60 L220 -60" stroke={night ? '#5e4430' : '#a8763f'} strokeWidth={8} />
		<rect x={-60} y={-180} width={120} height={180} rx={6} fill={glow ? '#ffcf6b' : '#5b3a22'} stroke={O} strokeWidth={6} />
		{glow ? <rect x={-60} y={-180} width={120} height={180} fill="#ffb300" opacity={0.25 * glow} /> : null}
		<rect x={110} y={-190} width={70} height={60} fill={glow ? '#ffd27a' : '#3b2614'} stroke={O} strokeWidth={5} />
		<path d="M145 -190 L145 -130 M110 -160 L180 -160" stroke={O} strokeWidth={4} />
		<path d="M-300 -250 L0 -430 L300 -250 Q0 -225 -300 -250 Z" fill={night ? '#8d7a3e' : '#e2bd57'} stroke={O} strokeWidth={6} strokeLinejoin="round" />
		{Array.from({length: 16}).map((_, i) => {
			const px = -280 + i * 37;
			return <path key={i} d={`M${px} -256 L${px * 0.5} -340`} stroke={night ? '#6c5c2c' : '#b8902e'} strokeWidth={3} />;
		})}
		<path d="M-300 -250 Q0 -225 300 -250 L306 -236 Q0 -208 -306 -236 Z" fill={night ? '#6c5c2c' : '#b8902e'} stroke={O} strokeWidth={5} />
	</At>
);

/* ------------------------------------------------------------ haystack */
export const Haystack: React.FC<{x: number; y: number; s?: number; night?: boolean}> = ({x, y, s = 1, night}) => (
	<At x={x} y={y} s={s}>
		<rect x={-6} y={-330} width={12} height={90} fill="#7b5a3a" stroke={O} strokeWidth={4} />
		<path d="M-160 0 Q-170 -150 -60 -240 Q0 -290 60 -240 Q170 -150 160 0 Z" fill={night ? '#8d7a3e' : '#e8c35e'} stroke={O} strokeWidth={6} />
		{Array.from({length: 14}).map((_, i) => (
			<path key={i} d={`M${-140 + i * 21} -10 Q${-120 + i * 18} ${-90 - (i % 3) * 20} ${-60 + i * 9} ${-200 + Math.abs(i - 7) * 6}`} stroke={night ? '#6c5c2c' : '#c19a36'} strokeWidth={3} fill="none" />
		))}
	</At>
);

/* ------------------------------------------------------------ bush (can rustle) */
export const Bush: React.FC<{x: number; y: number; s?: number; shake?: number; dark?: boolean}> = ({x, y, s = 1, shake = 0, dark}) => {
	const {f} = useScene();
	const r = shake ? Math.sin(f * 1.6) * 4 * shake : 0;
	const c1 = dark ? '#2f6b2a' : '#3f8f35';
	const c2 = dark ? '#3f7f35' : '#5cb24a';
	return (
		<At x={x} y={y} s={s} rot={r}>
			{[[-90, -50, 70], [0, -90, 90], [90, -50, 70], [-40, -30, 70], [50, -30, 70]].map(([cx, cy, rr], i) => (
				<circle key={i} cx={cx} cy={cy} r={rr} fill={i < 3 ? c1 : c2} stroke={O} strokeWidth={5} />
			))}
			<rect x={-160} y={-10} width={320} height={14} fill={c1} />
			{[[-60, -80], [30, -120], [80, -60]].map(([cx, cy], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={9} fill={i === 1 ? '#ff7043' : '#ffeb3b'} stroke={O} strokeWidth={3} />)}
		</At>
	);
};

/* ------------------------------------------------------------ tree from picture pack */
export const TreeImg: React.FC<{src?: string; x: number; y: number; h: number; sway?: number; filter?: string}> = ({src = 'chars/tree_round.png', x, y, h, sway = 1, filter}) => {
	const {g} = useScene();
	const ratio = src.includes('banyan') ? 905 / 926 : 803 / 879;
	const w = h * ratio;
	return (
		<Img src={staticFile(src)} style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, transformOrigin: '50% 100%', transform: `rotate(${Math.sin(g * 0.04) * 0.6 * sway}deg)`, filter}} />
	);
};

/* ------------------------------------------------------------ mud */
export const Mud: React.FC<{x: number; y: number; s?: number; front?: boolean; bubble?: boolean}> = ({x, y, s = 1, front, bubble = true}) => {
	const {f} = useScene();
	return (
		<At x={x} y={y} s={s}>
			{front ? (
				<g transform="scale(1 0.68)">
					<path d="M-400 30 Q-410 -60 -300 -90 Q-250 -150 -170 -128 Q-120 -175 -50 -146 Q10 -182 80 -148 Q150 -176 210 -132 Q300 -140 340 -86 Q420 -50 400 30 Z" fill="#5d3b1d" stroke={O} strokeWidth={6} />
					<path d="M-330 -60 Q-260 -110 -170 -100 Q-100 -130 -20 -112 Q70 -136 150 -110 Q250 -112 320 -64" stroke="#7d5230" strokeWidth={14} fill="none" strokeLinecap="round" />
					<path d="M-240 -40 Q-200 -56 -150 -48 M40 -70 Q90 -84 140 -72 M-60 -20 Q-20 -30 20 -22" stroke="#a9794a" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />
					{[[-280, -84], [-60, -140], [120, -140], [260, -100]].map(([px, py], i) => (
						<path key={i} d={`M${px} ${py} q8 22 0 34 q-8 -12 0 -34 Z`} fill="#5d3b1d" stroke={O} strokeWidth={3} />
					))}
				</g>
			) : (
				<g>
					<ellipse cx={0} cy={0} rx={420} ry={90} fill="#4e3118" stroke={O} strokeWidth={6} />
					<ellipse cx={0} cy={-8} rx={380} ry={66} fill="#6b4423" />
					<ellipse cx={-140} cy={-26} rx={90} ry={12} fill="#a77a4c" opacity={0.55} />
					<ellipse cx={170} cy={-18} rx={60} ry={8} fill="#a77a4c" opacity={0.45} />
				</g>
			)}
			{bubble
				? [0, 1, 2].map((i) => {
						const t = (f + i * 23) % 69;
						const r = 6 + (t / 69) * 10;
						return t < 60 ? <circle key={i} cx={-220 + i * 190} cy={front ? -70 : -20} r={r} fill="none" stroke="#b8865a" strokeWidth={3} opacity={1 - t / 60} /> : null;
					})
				: null}
		</At>
	);
};

/* ------------------------------------------------------------ hoof prints & footprints */
export const HoofPrints: React.FC<{x: number; y: number; s?: number; count?: number; reveal?: number}> = ({x, y, s = 1, count = 6, reveal = 1}) => (
	<At x={x} y={y} s={s}>
		{Array.from({length: count}).map((_, i) => {
			const px = i * 150;
			const py = (i % 2) * 70;
			const vis = Math.max(0, Math.min(1, reveal * count - i));
			return (
				<g key={i} transform={`translate(${px} ${py}) rotate(-10)`} opacity={vis}>
					<path d="M-26 0 Q-30 -40 -6 -44 L-4 0 Z M26 0 Q30 -40 6 -44 L4 0 Z" fill="#4a2f17" stroke="#2a1a0c" strokeWidth={3} />
				</g>
			);
		})}
	</At>
);

/* ------------------------------------------------------------ rope */
export const Rope: React.FC<{pts: [number, number][]; sag?: number; color?: string; gamchha?: [number, number] | null; taut?: number}> = ({pts, sag = 20, gamchha}) => {
	let d = `M${pts[0][0]} ${pts[0][1]}`;
	for (let i = 1; i < pts.length; i++) {
		const [x0, y0] = pts[i - 1];
		const [x1, y1] = pts[i];
		d += ` Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag} ${x1} ${y1}`;
	}
	return (
		<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
			<path d={d} stroke="#5b4320" strokeWidth={16} fill="none" strokeLinecap="round" />
			<path d={d} stroke="#d4b066" strokeWidth={10} fill="none" strokeLinecap="round" />
			<path d={d} stroke="#a8843e" strokeWidth={10} fill="none" strokeDasharray="6 10" />
			{gamchha ? <Gamchha x={gamchha[0]} y={gamchha[1]} /> : null}
		</svg>
	);
};

/** red-green checked towel, knotted on the rope */
export const Gamchha: React.FC<{x: number; y: number; s?: number; flat?: boolean}> = ({x, y, s = 1, flat}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<defs>
			<pattern id="check" width="20" height="20" patternUnits="userSpaceOnUse">
				<rect width="20" height="20" fill="#d32f2f" />
				<rect width="10" height="20" fill="#2e7d32" opacity="0.75" />
				<rect width="20" height="6" y="7" fill="#fdd835" opacity="0.5" />
			</pattern>
		</defs>
		{flat ? (
			<path d="M-70 -30 L70 -30 L64 40 L-64 40 Z" fill="url(#check)" stroke={O} strokeWidth={4} />
		) : (
			<g>
				<path d="M-50 -18 L50 -18 L46 18 L-46 18 Z" fill="url(#check)" stroke={O} strokeWidth={4} />
				<path d="M-10 14 L-30 60 L-4 56 Z M10 14 L32 58 L6 58 Z" fill="url(#check)" stroke={O} strokeWidth={4} strokeLinejoin="round" />
				<circle cx={0} cy={4} r={14} fill="#b71c1c" stroke={O} strokeWidth={4} />
			</g>
		)}
	</g>
);

/* ------------------------------------------------------------ pitha plate */
export const Pitha: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
	const {f} = useScene();
	return (
		<At x={x} y={y} s={s}>
			{[0, 1, 2].map((i) => {
				const t = (f + i * 20) % 60;
				return <path key={i} d={`M${-40 + i * 40} ${-50 - t} q12 -14 0 -28 q-12 -14 0 -28`} stroke="#fff" strokeWidth={5} fill="none" opacity={(1 - t / 60) * 0.8} strokeLinecap="round" />;
			})}
			<ellipse cx={0} cy={0} rx={110} ry={30} fill="#fafafa" stroke={O} strokeWidth={5} />
			<ellipse cx={0} cy={-4} rx={92} ry={22} fill="#e3f2fd" stroke="#1565c0" strokeWidth={3} />
			{[[-50, -20], [0, -26], [50, -20], [-25, -40], [25, -40]].map(([px, py], i) => (
				<g key={i}>
					<ellipse cx={px} cy={py} rx={30} ry={16} fill={i % 2 ? '#f5e6c8' : '#fff8e7'} stroke={O} strokeWidth={4} />
					<ellipse cx={px} cy={py - 5} rx={16} ry={6} fill="#a0522d" opacity={i % 2 ? 0.8 : 0.5} />
				</g>
			))}
		</At>
	);
};

/* ------------------------------------------------------------ thief (for thought bubble) */
export const Thief: React.FC<{x: number; y: number; s?: number; t?: number}> = ({x, y, s = 1, t = 0}) => (
	<At x={x} y={y + Math.abs(Math.sin(t * 0.4)) * -6} s={s}>
		<ellipse cx={60} cy={-80} rx={46} ry={52} fill="#c9a26b" stroke={O} strokeWidth={5} />
		<text x={60} y={-66} fontSize={34} textAnchor="middle" fontWeight={800} fill="#6d4c22">৳</text>
		<rect x={-34} y={-120} width={68} height={120} rx={24} fill="#212121" stroke={O} strokeWidth={5} />
		<circle cx={0} cy={-150} r={36} fill="#c68642" stroke={O} strokeWidth={5} />
		<path d="M-36 -160 L36 -160 L36 -140 L-36 -140 Z" fill="#111" />
		<circle cx={-13} cy={-150} r={6} fill="#fff" />
		<circle cx={13} cy={-150} r={6} fill="#fff" />
		<path d="M-38 -176 Q0 -200 38 -176 L38 -168 L-38 -168 Z" fill="#111" />
	</At>
);

/* ------------------------------------------------------------ thought bubble with content */
export const Thought: React.FC<{x: number; y: number; s?: number; children?: React.ReactNode; from?: [number, number]}> = ({x, y, s = 1, children, from}) => (
	<>
		<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
			{from
				? [0.25, 0.5, 0.75].map((k, i) => (
						<circle key={i} cx={from[0] + (x - from[0]) * k} cy={from[1] + (y + 130 * s - from[1]) * k} r={(8 + i * 8) * s} fill="#fff" stroke={O} strokeWidth={4} />
					))
				: null}
			<g transform={`translate(${x} ${y}) scale(${s})`}>
				<path d="M-200 60 Q-250 0 -190 -60 Q-180 -140 -80 -130 Q-20 -190 60 -140 Q160 -170 190 -80 Q260 -20 200 60 Q190 140 90 130 Q20 180 -60 130 Q-180 150 -200 60 Z" fill="#fff" stroke={O} strokeWidth={6} />
			</g>
		</svg>
		<div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, transformOrigin: '0 0'}}>{children}</div>
	</>
);

/* ------------------------------------------------------------ road + signpost */
export const Signpost: React.FC<{x: number; y: number; s?: number; text: string; dir?: 1 | -1}> = ({x, y, s = 1, text, dir = 1}) => (
	<At x={x} y={y} s={s}>
		<rect x={-8} y={-220} width={16} height={220} fill="#8d6e63" stroke={O} strokeWidth={4} />
		<path d={dir > 0 ? 'M-90 -210 L110 -210 L140 -180 L110 -150 L-90 -150 Z' : 'M90 -210 L-110 -210 L-140 -180 L-110 -150 L90 -150 Z'} fill="#ffcc80" stroke={O} strokeWidth={5} />
		<text x={dir > 0 ? 10 : -10} y={-170} textAnchor="middle" fontSize={32} fontWeight={800} fill="#4e342e" fontFamily="Baloo Da 2, sans-serif">{text}</text>
	</At>
);
