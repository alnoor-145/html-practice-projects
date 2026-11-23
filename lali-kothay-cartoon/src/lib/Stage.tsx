import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {kf, noise, Track} from './anim';
import {CamCtx, useScene} from './scene';
import {currentSpeaker, FPS} from './time';

export type CamSpec = {
	x?: Track;
	y?: Track;
	zoom?: Track;
	/** auto-follow the current speaker: map of who -> [x, y] focus point (stage px) */
	follow?: Record<string, [number, number]>;
	followZoom?: number;
	shake?: Track; // px
};

const followTarget = (spec: CamSpec, f: number, start: number) => {
	const bx = kf(f, spec.x ?? 960);
	const by = kf(f, spec.y ?? 540);
	const bz = kf(f, spec.zoom ?? 1);
	if (!spec.follow) return [bx, by, bz];
	const sp = currentSpeaker(start + f);
	const tgt = sp ? spec.follow[sp] : undefined;
	if (!tgt) return [bx, by, bz];
	return [tgt[0], tgt[1], spec.followZoom ?? 1.3];
};

export const useCamera = (spec: CamSpec) => {
	const {f, start} = useScene();
	if (!spec.follow) {
		return {x: kf(f, spec.x ?? 960), y: kf(f, spec.y ?? 540), zoom: kf(f, spec.zoom ?? 1)};
	}
	// critically damped smoothing, simulated from the scene start (deterministic)
	let [x, y, z] = followTarget(spec, 0, start);
	let vx = 0, vy = 0, vz = 0;
	const k = 0.032, d = 0.3;
	for (let i = 1; i <= f; i++) {
		const [tx, ty, tz] = followTarget(spec, i, start);
		vx = vx * (1 - d) + (tx - x) * k; x += vx;
		vy = vy * (1 - d) + (ty - y) * k; y += vy;
		vz = vz * (1 - d) + (tz - z) * k; z += vz;
	}
	return {x, y, zoom: z};
};

/** World with a camera. Layers inside can use <Layer depth> for parallax. */
export const Stage: React.FC<{cam?: CamSpec; children: React.ReactNode; background?: string}> = ({cam = {}, children, background = '#7ec8f0'}) => {
	const {f} = useScene();
	const c = useCamera(cam);
	const sh = kf(f, cam.shake ?? 0);
	const shx = sh ? noise('shx', f, 0.9) * sh : 0;
	const shy = sh ? noise('shy', f, 0.9) * sh : 0;
	// keep the view inside the 1920x1080 stage (plus margin used by backgrounds)
	const z = Math.max(1, c.zoom);
	const halfW = 960 / z, halfH = 540 / z;
	const cx = Math.max(halfW - 60, Math.min(1920 + 60 - halfW, c.x)) + shx;
	const cy = Math.max(halfH - 40, Math.min(1080 + 40 - halfH, c.y)) + shy;
	return (
		<AbsoluteFill style={{background, overflow: 'hidden'}}>
			<CamCtx.Provider value={{x: cx, y: cy, zoom: z}}>{children}</CamCtx.Provider>
		</AbsoluteFill>
	);
};

/** A parallax layer. depth 1 = moves with the characters, 0 = fixed to the screen */
export const Layer: React.FC<{depth?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({depth = 1, children, style}) => {
	const cam = React.useContext(CamCtx);
	const z = 1 + (cam.zoom - 1) * depth;
	const cx = 960 + (cam.x - 960) * depth;
	const cy = 540 + (cam.y - 540) * depth;
	return (
		<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(960px, 540px) scale(${z}) translate(${-cx}px, ${-cy}px)`, ...style}}>
			{children}
		</AbsoluteFill>
	);
};

/** Background picture covering the stage (+margins for camera moves) */
export const BgImage: React.FC<{src: string; depth?: number; w?: number; dx?: Track; dy?: Track; filter?: string; scale?: Track}> = ({src, depth = 0.55, w = 2200, dx = 0, dy = 0, filter, scale = 1}) => {
	const {f} = useScene();
	const h = (w * 9) / 16;
	const s = kf(f, scale);
	return (
		<Layer depth={depth}>
			<Img src={staticFile(src)} style={{position: 'absolute', left: 960 - w / 2 + kf(f, dx), top: 540 - h / 2 + kf(f, dy), width: w, height: h, filter,
				transform: `scale(${s})`, transformOrigin: '50% 60%'}} />
		</Layer>
	);
};

export const secs = (s: number) => Math.round(s * FPS);
