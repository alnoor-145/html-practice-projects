import React from 'react';

/** Hand-drawn SVG animals (not in the picture pack): Bhola the dog, Kukku the hen, Mini the cat, the frog. */
const OUT = '#2a1810';
const SW = 4;

export type AnimalPose = {
	f: number; // frame counter for cycles
	mouth: number; // 0..1
	blink: number; // 0..1
	act: string;
	t: number; // frames since action started
	headRot?: number;
	mood?: string;
};

const legSwing = (p: AnimalPose, speed: number, amp: number, phase: number) => {
	if (p.act === 'walk' || p.act === 'run' || p.act === 'tiptoe') return amp * Math.sin((p.t / speed) * Math.PI * 2 + phase);
	return 0;
};

/* ------------------------------------------------------------------ dog */
export const Dog: React.FC<{p: AnimalPose}> = ({p}) => {
	const run = p.act === 'run';
	const sp = run ? 9 : 16;
	const amp = run ? 34 : 18;
	const wag = (p.act === 'scared' ? 4 : 22) * Math.sin(p.f * (p.act === 'proud' || p.act === 'happy' ? 0.9 : 0.5));
	const sniff = p.act === 'sniff';
	const scared = p.act === 'scared';
	const head = (p.headRot ?? 0) + (sniff ? 16 + 3 * Math.sin(p.f * 0.9) : 0) + (p.act === 'proud' ? -10 : 0) + (scared ? 4 * Math.sin(p.f * 2.1) : 0);
	const m = p.mouth;
	const eyeH = 13 * (1 - Math.max(p.blink, p.act === 'proud' && m < 0.1 ? 0 : 0));
	const happyEyes = p.act === 'proud' || p.mood === 'happy';
	const ear = scared ? -25 : Math.sin(p.f * 0.3) * 4 + (run ? -18 : 0);
	const Leg: React.FC<{x: number; ang: number; dark?: boolean}> = ({x, ang, dark}) => (
		<g transform={`rotate(${ang} ${x} 195)`}>
			<rect x={x - 13} y={185} width={26} height={78} rx={12} fill={dark ? '#b06e2c' : '#d98c3f'} stroke={OUT} strokeWidth={SW} />
			<ellipse cx={x + 6} cy={266} rx={19} ry={10} fill={dark ? '#e0b98a' : '#f6d9b0'} stroke={OUT} strokeWidth={SW} />
		</g>
	);
	return (
		<svg viewBox="0 0 300 280" width={300} height={280} style={{overflow: 'visible'}}>
			{/* tail */}
			<g transform={`rotate(${wag} 76 168)`}>
				<path d="M80 170 Q40 150 46 100 Q60 120 70 140 Q78 152 92 160 Z" fill="#d98c3f" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
				<path d="M48 104 Q50 118 58 128" stroke="#f6d9b0" strokeWidth={7} fill="none" strokeLinecap="round" />
			</g>
			<Leg x={98} ang={-legSwing(p, sp, amp, 0)} dark />
			<Leg x={198} ang={legSwing(p, sp, amp, 0.6)} dark />
			{/* body */}
			<ellipse cx={150} cy={178} rx={90} ry={52} fill="#d98c3f" stroke={OUT} strokeWidth={SW} />
			<ellipse cx={162} cy={204} rx={56} ry={20} fill="#f6d9b0" />
			<ellipse cx={120} cy={160} rx={26} ry={16} fill="#b8702e" opacity={0.55} />
			<Leg x={118} ang={legSwing(p, sp, amp, 0)} />
			<Leg x={218} ang={-legSwing(p, sp, amp, 0.6)} />
			{/* collar */}
			<path d="M186 138 Q214 160 248 142" stroke="#d63031" strokeWidth={12} fill="none" strokeLinecap="round" />
			<circle cx={218} cy={158} r={8} fill="#f1c40f" stroke={OUT} strokeWidth={3} />
			{/* head */}
			<g transform={`rotate(${head} 212 140)`}>
				<g transform={`rotate(${-ear} 182 70)`}>
					<path d="M182 64 Q150 70 158 128 Q174 132 188 100 Z" fill="#8a4b1e" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
				</g>
				<circle cx={222} cy={96} r={54} fill="#d98c3f" stroke={OUT} strokeWidth={SW} />
				<ellipse cx={208} cy={68} rx={22} ry={14} fill="#e9a964" opacity={0.7} />
				<ellipse cx={240} cy={124} rx={36} ry={26} fill="#f6d9b0" stroke={OUT} strokeWidth={3} />
				{/* eyes */}
				{happyEyes ? (
					<g fill="none" stroke={OUT} strokeWidth={5} strokeLinecap="round">
						<path d="M193 90 Q203 78 213 90" />
						<path d="M236 90 Q246 78 256 90" />
					</g>
				) : (
					<g>
						{[203, 246].map((cx, i) => (
							<g key={i}>
								<ellipse cx={cx} cy={88} rx={12} ry={scared ? 15 : 14} fill="#fff" stroke={OUT} strokeWidth={3} />
								<circle cx={cx + 3} cy={91} r={scared ? 4.5 : 7.5} fill="#1b1b1b" />
								<circle cx={cx + 5} cy={87} r={2.6} fill="#fff" />
								{p.blink > 0.05 ? (
									<rect x={cx - 13} y={73} width={26} height={30 * Math.min(1, p.blink)} fill="#d98c3f" />
								) : null}
								{p.blink > 0.85 ? <path d={`M${cx - 11} ${eyeH > 0 ? 92 : 92} Q${cx} 99 ${cx + 11} 92`} stroke={OUT} strokeWidth={3.5} fill="none" /> : null}
							</g>
						))}
					</g>
				)}
				<path d={scared ? 'M190 66 Q202 58 214 66 M234 66 Q246 58 258 66' : 'M192 68 Q203 62 214 68 M234 68 Q245 62 256 68'} stroke={OUT} strokeWidth={4} fill="none" strokeLinecap="round" />
				{/* nose */}
				<g transform={sniff ? `translate(${Math.sin(p.f * 1.3) * 1.5} 0) scale(1)` : undefined}>
					<ellipse cx={244} cy={110} rx={12} ry={8.5} fill="#1b1b1b" />
					<ellipse cx={240} cy={107} rx={4} ry={2.4} fill="#777" />
				</g>
				{/* mouth */}
				{m > 0.1 ? (
					<g>
						<path d={`M226 124 Q244 ${126} 262 124 Q258 ${130 + 22 * m} 244 ${132 + 22 * m} Q230 ${130 + 22 * m} 226 124 Z`} fill="#5a1414" stroke={OUT} strokeWidth={3} />
						<ellipse cx={244} cy={128 + 20 * m} rx={10} ry={5 + 4 * m} fill="#ff7b8a" />
					</g>
				) : (
					<path d="M228 123 Q236 132 244 122 Q252 132 260 123" stroke={OUT} strokeWidth={3.5} fill="none" strokeLinecap="round" />
				)}
				{p.act === 'happy' || p.act === 'proud' ? <path d="M240 134 Q244 150 250 134" fill="#ff7b8a" stroke={OUT} strokeWidth={2.5} /> : null}
				<g transform={`rotate(${ear} 262 72)`}>
					<path d="M258 64 Q292 70 284 128 Q268 132 256 100 Z" fill="#8a4b1e" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
				</g>
			</g>
		</svg>
	);
};

/* ------------------------------------------------------------------ hen */
export const Hen: React.FC<{p: AnimalPose}> = ({p}) => {
	const m = p.mouth;
	const talk = m > 0.05;
	const peck = talk ? Math.sin(p.f * 0.8) * 5 : Math.sin(p.f * 0.12) * 3;
	const flap = p.act === 'flap' || (talk && p.mood === 'excited') ? Math.sin(p.f * 1.4) * 25 - 10 : Math.sin(p.f * 0.2) * 2;
	const step = p.act === 'walk' ? Math.sin(p.t * 0.5) * 8 : 0;
	return (
		<svg viewBox="0 0 200 200" width={200} height={200} style={{overflow: 'visible'}}>
			{/* legs */}
			<g stroke="#e8920f" strokeWidth={6} strokeLinecap="round" fill="none">
				<path d={`M86 160 L${84 + step} 192 M${84 + step} 192 L${72 + step} 196 M${84 + step} 192 L${94 + step} 197`} />
				<path d={`M110 160 L${112 - step} 192 M${112 - step} 192 L${100 - step} 197 M${112 - step} 192 L${124 - step} 196`} />
			</g>
			{/* tail */}
			<g stroke={OUT} strokeWidth={SW} strokeLinejoin="round">
				<path d="M52 118 Q20 70 44 46 Q50 80 66 100 Z" fill="#3d2a1e" />
				<path d="M48 122 Q8 100 18 70 Q36 100 62 108 Z" fill="#2f5d3a" />
				<path d="M56 112 Q36 60 66 40 Q66 78 76 98 Z" fill="#5b3420" />
			</g>
			{/* body */}
			<ellipse cx={98} cy={124} rx={60} ry={48} fill="#c8642d" stroke={OUT} strokeWidth={SW} />
			<ellipse cx={128} cy={132} rx={30} ry={34} fill="#eaa462" />
			{/* wing */}
			<g transform={`rotate(${flap} 100 112)`}>
				<path d="M64 120 Q86 92 124 112 Q118 146 80 148 Q62 140 64 120 Z" fill="#9c4520" stroke={OUT} strokeWidth={SW} />
				<path d="M80 128 Q96 122 112 126 M78 138 Q94 132 108 136" stroke="#6e2d12" strokeWidth={3} fill="none" />
			</g>
			{/* head */}
			<g transform={`rotate(${peck + (p.headRot ?? 0)} 132 100)`}>
				<path d="M124 50 Q126 32 138 40 Q142 24 152 36 Q160 26 164 44 Q166 54 150 54 Z" fill="#e53935" stroke={OUT} strokeWidth={3.5} />
				<circle cx={142} cy={70} r={28} fill="#c8642d" stroke={OUT} strokeWidth={SW} />
				<circle cx={150} cy={64} r={8} fill="#fff" stroke={OUT} strokeWidth={2.5} />
				<circle cx={152} cy={65} r={4.5} fill="#111" />
				<circle cx={153.5} cy={63} r={1.6} fill="#fff" />
				{p.blink > 0.4 ? <rect x={141} y={55} width={18} height={18 * Math.min(1, p.blink)} fill="#c8642d" /> : null}
				{/* beak */}
				<path d="M166 66 L190 72 L166 77 Z" fill="#f4b400" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
				<g transform={`rotate(${m * 28} 166 77)`}>
					<path d="M166 77 L186 76 L166 84 Z" fill="#e09a00" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
				</g>
				<path d="M164 84 Q170 102 158 98 Q154 90 160 84 Z" fill="#e53935" stroke={OUT} strokeWidth={3} />
			</g>
		</svg>
	);
};

/* ------------------------------------------------------------------ cat */
export const Cat: React.FC<{p: AnimalPose}> = ({p}) => {
	const m = p.mouth;
	const lazy = p.mood === 'lazy' ? 0.45 : 0;
	const lid = Math.max(p.blink, lazy);
	const tail = Math.sin(p.f * 0.12) * 12;
	if (p.act === 'sleep') {
		const br = 1 + Math.sin(p.f * 0.12) * 0.025;
		return (
			<svg viewBox="0 0 220 230" width={220} height={230} style={{overflow: 'visible'}}>
				<g transform={`translate(110 228) scale(1 ${br}) translate(-110 -228)`}>
					<path d="M28 224 Q20 160 110 160 Q200 160 196 224 Z" fill="#f5f1ea" stroke={OUT} strokeWidth={SW} />
					<path d="M120 164 Q170 162 186 196 Q150 190 120 180 Z" fill="#9aa3ad" />
					<path d="M196 214 Q214 196 196 178 M196 214 Q150 236 80 224" stroke={OUT} strokeWidth={SW} fill="none" />
					<path d="M196 214 Q150 232 84 222" stroke="#9aa3ad" strokeWidth={14} fill="none" strokeLinecap="round" />
					<ellipse cx={70} cy={186} rx={44} ry={36} fill="#f5f1ea" stroke={OUT} strokeWidth={SW} />
					<path d="M36 166 L40 136 L58 156 Z M82 154 L100 132 L104 164 Z" fill="#f5f1ea" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
					<path d="M44 160 L45 146 L54 156 Z M88 156 L98 142 L99 160 Z" fill="#f7a8b8" />
					<path d="M48 186 Q56 192 64 186 M78 186 Q86 192 94 186" stroke={OUT} strokeWidth={3.5} fill="none" strokeLinecap="round" />
					<path d="M68 198 L72 202 L76 198 Z" fill="#f48fb1" />
				</g>
			</svg>
		);
	}
	return (
		<svg viewBox="0 0 220 230" width={220} height={230} style={{overflow: 'visible'}}>
			<g transform={`rotate(${tail} 160 214)`}>
				<path d="M156 214 Q206 206 198 150 Q192 120 172 128" stroke={OUT} strokeWidth={22} fill="none" strokeLinecap="round" />
				<path d="M156 214 Q206 206 198 150 Q192 120 172 128" stroke="#9aa3ad" strokeWidth={14} fill="none" strokeLinecap="round" />
			</g>
			<path d="M58 226 Q46 150 110 122 Q174 150 162 226 Z" fill="#f5f1ea" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
			<path d="M136 140 Q160 160 158 200 Q142 176 128 150 Z" fill="#9aa3ad" />
			<ellipse cx={92} cy={222} rx={18} ry={9} fill="#fff" stroke={OUT} strokeWidth={3} />
			<ellipse cx={128} cy={222} rx={18} ry={9} fill="#fff" stroke={OUT} strokeWidth={3} />
			<g transform={`rotate(${(p.headRot ?? 0) + Math.sin(p.f * 0.08) * 3} 110 130)`}>
				<path d="M58 66 L62 14 L100 44 Z" fill="#9aa3ad" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
				<path d="M120 44 L158 14 L162 66 Z" fill="#f5f1ea" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
				<path d="M68 52 L68 28 L88 44 Z M132 44 L152 28 L152 52 Z" fill="#f7a8b8" />
				<ellipse cx={110} cy={86} rx={60} ry={48} fill="#f5f1ea" stroke={OUT} strokeWidth={SW} />
				<path d="M58 70 Q66 46 98 42 Q92 66 96 84 Q74 90 58 70 Z" fill="#9aa3ad" />
				{[88, 132].map((cx, i) => (
					<g key={i}>
						<ellipse cx={cx} cy={84} rx={13} ry={14} fill="#9ccc65" stroke={OUT} strokeWidth={3} />
						<ellipse cx={cx} cy={85} rx={4} ry={10} fill="#111" />
						<circle cx={cx + 4} cy={79} r={2.8} fill="#fff" />
						{lid > 0.04 ? (
							<g>
								<rect x={cx - 14} y={69} width={28} height={30 * Math.min(1, lid)} fill={i === 0 ? '#9aa3ad' : '#f5f1ea'} />
								<path d={`M${cx - 13} ${69 + 30 * Math.min(1, lid)} L${cx + 13} ${69 + 30 * Math.min(1, lid)}`} stroke={OUT} strokeWidth={3} />
							</g>
						) : null}
					</g>
				))}
				<path d="M104 100 L116 100 L110 107 Z" fill="#f48fb1" stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
				{m > 0.1 ? (
					<g>
						<ellipse cx={110} cy={115 + 4 * m} rx={9 + 3 * m} ry={4 + 9 * m} fill="#5a1414" stroke={OUT} strokeWidth={2.5} />
						<ellipse cx={110} cy={119 + 8 * m} rx={6} ry={3 + 3 * m} fill="#ff8a9a" />
					</g>
				) : (
					<path d="M98 108 Q104 116 110 108 Q116 116 122 108" stroke={OUT} strokeWidth={3} fill="none" strokeLinecap="round" />
				)}
				<g stroke={OUT} strokeWidth={2} strokeLinecap="round">
					<path d="M84 104 L52 98 M84 110 L52 114 M136 104 L168 98 M136 110 L168 114" />
				</g>
			</g>
		</svg>
	);
};

/* ------------------------------------------------------------------ frog */
export const Frog: React.FC<{p: AnimalPose}> = ({p}) => {
	const jump = p.act === 'jump';
	const throat = 1 + Math.max(0, Math.sin(p.f * 0.4)) * 0.15;
	return (
		<svg viewBox="0 0 120 100" width={120} height={100} style={{overflow: 'visible'}}>
			{jump ? (
				<g stroke={OUT} strokeWidth={3} fill="#4caf50">
					<path d="M30 70 Q6 86 -6 98 L10 98 Q20 86 38 78 Z" />
					<path d="M90 70 Q114 86 126 98 L110 98 Q100 86 82 78 Z" />
				</g>
			) : (
				<g stroke={OUT} strokeWidth={3} fill="#4caf50">
					<ellipse cx={24} cy={84} rx={18} ry={12} />
					<ellipse cx={96} cy={84} rx={18} ry={12} />
				</g>
			)}
			<ellipse cx={60} cy={70} rx={40} ry={26} fill="#5cb85c" stroke={OUT} strokeWidth={3} />
			<ellipse cx={60} cy={80} rx={26 * throat} ry={13 * throat} fill="#c5e1a5" />
			{[42, 78].map((cx, i) => (
				<g key={i}>
					<circle cx={cx} cy={42} r={14} fill="#5cb85c" stroke={OUT} strokeWidth={3} />
					<circle cx={cx} cy={42} r={9} fill="#fff" />
					<circle cx={cx + 1} cy={43} r={5} fill="#111" />
					<circle cx={cx + 3} cy={40} r={1.6} fill="#fff" />
				</g>
			))}
			<path d="M38 64 Q60 80 82 64" stroke={OUT} strokeWidth={3} fill="none" strokeLinecap="round" />
			<circle cx={34} cy={62} r={5} fill="#ff8a80" opacity={0.6} />
			<circle cx={86} cy={62} r={5} fill="#ff8a80" opacity={0.6} />
		</svg>
	);
};

export const ANIMAL_BOX: Record<string, {w: number; h: number; ax: number}> = {
	dog: {w: 300, h: 280, ax: 160},
	hen: {w: 200, h: 200, ax: 100},
	cat: {w: 220, h: 230, ax: 110},
	frog: {w: 120, h: 100, ax: 60},
};
