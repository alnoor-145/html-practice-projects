import React from 'react';
import {C, FONT_BN, clamp01} from './lib';

// Isometric (2.5D) helpers shared by the 3D-explainer style videos. Own drawings only.
const COS = 0.866, SIN = 0.5;
export const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};
// isometric box; (x, y) is the bottom-front corner, s = side, h = height. Draw inside an <svg>.
export const IsoBox: React.FC<{x: number; y: number; s: number; h: number; color: string; glow?: number; op?: number}> = ({x, y, s, h, color, glow = 0, op = 1}) => {
  if (h < 2) return null;
  const fx = x, fy = y, rx = x + s * COS, ry = y - s * SIN, lx = x - s * COS, ly = y - s * SIN, bx = x, by = y - 2 * s * SIN;
  const P = (...pts: number[][]) => pts.map((p) => p.join(',')).join(' ');
  return (
    <g opacity={op} style={{filter: glow > 0 ? `drop-shadow(0 0 ${14 * glow}px ${color})` : undefined}}>
      <polygon points={P([lx, ly], [fx, fy], [fx, fy - h], [lx, ly - h])} fill={shade(color, 0.72)} />
      <polygon points={P([fx, fy], [rx, ry], [rx, ry - h], [fx, fy - h])} fill={shade(color, 0.5)} />
      <polygon points={P([fx, fy - h], [rx, ry - h], [bx, by - h], [lx, ly - h])} fill={shade(color, 1.1)} />
    </g>
  );
};
// floating label with a leader line down to a point (anchor = bottom centre of the line)
export const Tag: React.FC<{x: number; y: number; text: string; sub?: string; k: number; color?: string; line?: number}> = ({x, y, text, sub, k, color = '#fff', line = 70}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${k})`, opacity: clamp01(k * 2), transformOrigin: 'bottom center', textAlign: 'center'}}>
    <div style={{display: 'inline-block', padding: '8px 22px', borderRadius: 18, background: 'rgba(18,11,36,0.82)', border: `2px solid ${color}`, fontFamily: FONT_BN, fontWeight: 800, fontSize: 42, color, whiteSpace: 'nowrap'}}>{text}{sub && <div style={{fontSize: 26, color: C.muted, fontWeight: 600}}>{sub}</div>}</div>
    <div style={{width: 3, height: line, background: color, margin: '0 auto', opacity: 0.8}} />
  </div>
);
const BN = '০১২৩৪৫৬৭৮৯';
export const bnum = (n: number) => String(n).replace(/[0-9]/g, (d) => BN[+d]);
// cyclone swirl (rotates with t)
export const Swirl: React.FC<{t: number; size?: number; color?: string; speed?: number}> = ({t, size = 300, color = '#9FB4E6', speed = 60}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${t * speed}deg)`}}>
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M50 50 Q${50 + 20 * Math.cos(i * 1.57)} ${50 - 36} ${50 + 44 * Math.cos(i * 1.57 + 0.9)} ${50 + 44 * Math.sin(i * 1.57 + 0.9)}`} fill="none" stroke={color} strokeWidth={9 - i} strokeLinecap="round" opacity={0.85 - i * 0.1} transform={`rotate(${i * 90} 50 50)`} />)}
    <circle cx="50" cy="50" r="7" fill="#120B24" />
  </svg>
);
export const SignalFlag: React.FC<{n: number; size?: number; color?: string}> = ({n, size = 150, color = '#FFC24D'}) => (
  <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{width: size, height: size * 0.72, borderRadius: 10, background: color, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: size * 0.6, color: '#1E1533', boxShadow: '0 10px 24px rgba(0,0,0,0.4)'}}>{bnum(n)}</div>
    <div style={{width: 10, height: size * 0.5, background: '#C9CDE0', borderRadius: 5}} />
  </div>
);
