import React from 'react';
import {Img, staticFile} from 'remotion';
import {Rig} from './rigs';

export type FaceState = {
	mouth: number; // 0..1 opening
	blink: number; // 0..1 closed
	lids?: number; // constant droop 0..1 (sleepy / sad)
	mood?: 'smile' | 'flat' | 'sad' | 'angry' | 'happy' | 'scared' | 'o';
	tears?: number; // frame counter when crying, -1 = none
	blush?: number; // 0..1
};

const poly = (pts: [number, number][], w: number, h: number) =>
	pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * w).toFixed(1)} ${(y * h).toFixed(1)}`).join(' ') + ' Z';

/** Face overlay (mouth + eyelids + small expression marks), drawn in image pixels */
const Face: React.FC<{rig: Rig; s: FaceState; id: string}> = ({rig, s, id}) => {
	const fr = rig.face!;
	const {w, h} = rig;
	const mx = fr.mouth[0] * w;
	const my = fr.mouth[1] * h;
	const mw = fr.mw * w;
	const m = s.mouth;
	const open = m > 0.1;
	const lw = Math.max(2, w * 0.011);
	const mood = s.mood ?? 'smile';
	const lidAmt = Math.max(s.blink, s.lids ?? 0);
	// closed mouth curve
	const curve = mood === 'sad' || mood === 'angry' ? -0.16 : mood === 'flat' ? 0.02 : mood === 'happy' ? 0.3 : 0.18;
	const cw = mw * (mood === 'happy' ? 0.62 : 0.5);
	const closed = `M${mx - cw / 2} ${my - curve * cw * 0.2} Q${mx} ${my + curve * cw * 0.55} ${mx + cw / 2} ${my - curve * cw * 0.2}`;
	// open mouth shape
	const ow = mood === 'o' || mood === 'scared' ? mw * (0.28 + 0.12 * m) : mw * (0.46 + 0.22 * m);
	const oh = mood === 'o' || mood === 'scared' ? mw * (0.2 + 0.25 * m) : mw * (0.07 + 0.36 * m);
	const top = my - oh * 0.28;
	const openPath = `M${mx - ow / 2} ${top} Q${mx} ${top - oh * 0.12} ${mx + ow / 2} ${top} Q${mx + ow * 0.46} ${top + oh} ${mx} ${top + oh} Q${mx - ow * 0.46} ${top + oh} ${mx - ow / 2} ${top} Z`;
	return (
		<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			<defs>
				<filter id={`soft-${id}`} x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation={Math.max(0.8, w * 0.004)} />
				</filter>
				<clipPath id={`mclip-${id}`}>
					<path d={openPath} />
				</clipPath>
				{fr.eyes.map(([ex, ey], i) => (
					<clipPath key={i} id={`eye-${id}-${i}`}>
						<ellipse cx={ex * w} cy={ey * h} rx={fr.erx * w * 1.18} ry={fr.ery * h * 1.25} />
					</clipPath>
				))}
			</defs>
			{/* cover the painted mouth */}
			<ellipse cx={mx} cy={my} rx={mw * 0.62} ry={mw * 0.2 + (open ? oh * 0.35 : 0)} fill={fr.skin} filter={`url(#soft-${id})`} />
			{open ? (
				<g>
					<path d={openPath} fill="#5a1414" />
					<g clipPath={`url(#mclip-${id})`}>
						<ellipse cx={mx} cy={top + oh * 1.02} rx={ow * 0.34} ry={oh * 0.42} fill="#e86a6a" />
						{m > 0.45 && mood !== 'o' ? <rect x={mx - ow / 2} y={top - oh * 0.2} width={ow} height={oh * 0.26} fill="#fff" /> : null}
					</g>
					<path d={openPath} fill="none" stroke={fr.line} strokeWidth={lw} strokeLinejoin="round" />
				</g>
			) : (
				<path d={closed} fill="none" stroke={fr.line} strokeWidth={lw * 1.1} strokeLinecap="round" />
			)}
			{/* eyelids */}
			{lidAmt > 0.04
				? fr.eyes.map(([ex, ey], i) => {
						const rx = fr.erx * w * 1.18;
						const ry = fr.ery * h * 1.25;
						const cover = lidAmt > 0.85 ? 1 : lidAmt;
						const y0 = ey * h - ry;
						const hh = 2 * ry * cover;
						return (
							<g key={i}>
								<g clipPath={`url(#eye-${id}-${i})`}>
									<rect x={ex * w - rx} y={y0 - 2} width={rx * 2} height={hh + 2} fill={fr.lid} />
								</g>
								{cover >= 1 ? (
									<path d={`M${ex * w - rx * 0.85} ${ey * h + ry * 0.1} Q${ex * w} ${ey * h + ry * 0.75} ${ex * w + rx * 0.85} ${ey * h + ry * 0.1}`}
										fill="none" stroke={fr.line} strokeWidth={lw * 1.1} strokeLinecap="round" />
								) : (
									<path d={`M${ex * w - rx * 0.98} ${y0 + hh} L${ex * w + rx * 0.98} ${y0 + hh}`} stroke={fr.line} strokeWidth={lw} />
								)}
							</g>
						);
					})
				: null}
			{/* blush */}
			{s.blush ? fr.eyes.map(([ex, ey], i) => (
				<ellipse key={`b${i}`} cx={ex * w + (i ? 1 : -1) * fr.erx * w * 0.35} cy={ey * h + fr.ery * h * 2.3} rx={fr.erx * w * 0.75} ry={fr.ery * h * 0.8}
					fill="#ff6b81" opacity={0.45 * (s.blush ?? 0)} filter={`url(#soft-${id})`} />
			)) : null}
			{/* angry flush */}
			{mood === 'angry' ? <ellipse cx={w * 0.5} cy={fr.eyes[0][1] * h} rx={w * 0.36} ry={h * 0.07} fill="#ff2a2a" opacity={0.18} filter={`url(#soft-${id})`} /> : null}
			{/* tears */}
			{s.tears !== undefined && s.tears >= 0
				? fr.eyes.map(([ex, ey], i) =>
						[0, 1].map((k) => {
							const t = ((s.tears! + k * 17 + i * 9) % 34) / 34;
							const x = ex * w + (i ? 1 : -1) * fr.erx * w * 0.5;
							const y = ey * h + fr.ery * h + t * h * 0.09;
							const r = w * 0.022;
							return (
								<path key={`t${i}${k}`} opacity={1 - t * 0.6}
									d={`M${x} ${y - r * 1.8} Q${x + r} ${y - r * 0.2} ${x} ${y + r} Q${x - r} ${y - r * 0.2} ${x} ${y - r * 1.8} Z`}
									fill="#7fd3ff" stroke="#2a7fb8" strokeWidth={lw * 0.5} />
							);
						})
					)
				: null}
		</svg>
	);
};

/** Police cap drawn over Suman's knit cap */
const PoliceCap: React.FC<{rig: Rig}> = ({rig}) => {
	const {w: W, h: H} = rig;
	const X = (v: number) => (v * W).toFixed(1);
	const Y = (v: number) => (v * H).toFixed(1);
	const o = '#0d1220';
	const lw = W * 0.014;
	if (rig.hat === 'policeSide') {
		return (
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<path d={`M${X(0.08)} ${Y(0.112)} L${X(0.03)} ${Y(0.035)} Q${X(0.5)} ${Y(-0.035)} ${X(1.04)} ${Y(0.02)} L${X(1.0)} ${Y(0.15)} Q${X(0.5)} ${Y(0.12)} ${X(0.08)} ${Y(0.112)} Z`} fill="#24386e" stroke={o} strokeWidth={lw} strokeLinejoin="round" />
				<path d={`M${X(0.08)} ${Y(0.08)} Q${X(0.5)} ${Y(0.09)} ${X(1.01)} ${Y(0.11)} L${X(1.0)} ${Y(0.15)} Q${X(0.5)} ${Y(0.124)} ${X(0.08)} ${Y(0.114)} Z`} fill="#121a33" stroke={o} strokeWidth={lw} />
				<path d={`M${X(0.08)} ${Y(0.081)} Q${X(0.5)} ${Y(0.091)} ${X(1.01)} ${Y(0.111)}`} stroke="#e0b43c" strokeWidth={lw * 0.8} fill="none" />
				<path d={`M${X(0.18)} ${Y(0.108)} Q${X(-0.02)} ${Y(0.112)} ${X(-0.12)} ${Y(0.132)} Q${X(0.02)} ${Y(0.136)} ${X(0.2)} ${Y(0.124)} Z`} fill="#111" stroke={o} strokeWidth={lw * 0.8} />
				<ellipse cx={X(0.2)} cy={Y(0.055)} rx={W * 0.07} ry={H * 0.022} fill="#f2c335" stroke="#8a6300" strokeWidth={lw * 0.6} />
			</svg>
		);
	}
	return (
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			<path d={`M${X(0.09)} ${Y(0.09)} Q${X(-0.04)} ${Y(0.035)} ${X(0.1)} ${Y(0.004)} Q${X(0.5)} ${Y(-0.03)} ${X(0.9)} ${Y(0.004)} Q${X(1.04)} ${Y(0.035)} ${X(0.91)} ${Y(0.09)} Z`} fill="#24386e" stroke={o} strokeWidth={lw} strokeLinejoin="round" />
			<path d={`M${X(0.1)} ${Y(0.03)} Q${X(0.5)} ${Y(-0.005)} ${X(0.9)} ${Y(0.03)}`} stroke="#3c5596" strokeWidth={lw * 1.4} fill="none" strokeLinecap="round" />
			<rect x={X(0.1)} y={Y(0.074)} width={W * 0.8} height={H * 0.05} rx={W * 0.03} fill="#121a33" stroke={o} strokeWidth={lw} />
			<path d={`M${X(0.11)} ${Y(0.076)} L${X(0.89)} ${Y(0.076)}`} stroke="#e0b43c" strokeWidth={lw * 0.9} />
			<path d={`M${X(0.13)} ${Y(0.116)} Q${X(0.5)} ${Y(0.152)} ${X(0.87)} ${Y(0.116)} Q${X(0.5)} ${Y(0.128)} ${X(0.13)} ${Y(0.116)} Z`} fill="#111" stroke={o} strokeWidth={lw * 0.8} />
			<path d={`M${X(0.3)} ${Y(0.128)} Q${X(0.5)} ${Y(0.14)} ${X(0.66)} ${Y(0.13)}`} stroke="#555" strokeWidth={lw * 0.7} fill="none" />
			<circle cx={X(0.5)} cy={Y(0.052)} r={W * 0.075} fill="#f2c335" stroke="#8a6300" strokeWidth={lw * 0.7} />
			<path d={`M${X(0.5)} ${Y(0.034)} L${X(0.515)} ${Y(0.048)} L${X(0.545)} ${Y(0.049)} L${X(0.522)} ${Y(0.058)} L${X(0.53)} ${Y(0.072)} L${X(0.5)} ${Y(0.063)} L${X(0.47)} ${Y(0.072)} L${X(0.478)} ${Y(0.058)} L${X(0.455)} ${Y(0.049)} L${X(0.485)} ${Y(0.048)} Z`} fill="#c62828" />
		</svg>
	);
};

export type FigurePose = {
	headRot: number; // degrees
	headBob: number; // px in image space
	face?: FaceState;
};

/** A cut-out picture split into body + head so the head can turn, nod and talk. */
export const RasterFigure: React.FC<{rig: Rig; pose: FigurePose; id: string}> = ({rig, pose, id}) => {
	const {w, h} = rig;
	const src = staticFile(rig.src);
	const nx = (rig.pivot?.[0] ?? rig.neckX ?? 0.5) * 100;
	const ny = (rig.pivot?.[1] ?? rig.neck) * 100;
	const custom = rig.head && rig.hole;
	const bodyClip = custom
		? `path(evenodd, '${`M0 0 L${w} 0 L${w} ${h} L0 ${h} Z `}${poly(rig.hole!, w, h)}')`
		: `inset(${rig.neck * 100}% 0 0 0)`;
	const headClip = custom ? `path('${poly(rig.head!, w, h)}')` : `inset(0 0 ${(1 - rig.neck - 0.018) * 100}% 0)`;
	const imgStyle: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: w, height: h};
	return (
		<div style={{position: 'relative', width: w, height: h}}>
			<Img src={src} style={{...imgStyle, clipPath: bodyClip}} />
			<div style={{...imgStyle, transformOrigin: `${nx}% ${ny}%`, transform: `translateY(${pose.headBob}px) rotate(${pose.headRot}deg)`}}>
				<Img src={src} style={{...imgStyle, clipPath: headClip}} />
				{rig.face && pose.face ? <Face rig={rig} s={pose.face} id={id} /> : null}
				{rig.hat ? <PoliceCap rig={rig} /> : null}
			</div>
		</div>
	);
};
