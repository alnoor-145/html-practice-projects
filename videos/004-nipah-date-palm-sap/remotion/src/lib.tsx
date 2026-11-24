import React from 'react';
import {continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import timing from './timing.json';

// ---------- timing ----------
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const A = timing.anchors as Record<string, number>;
export const WORDS = timing.words as {text: string; start: number; end: number}[];
export const CHUNKS = timing.chunks as {start: number; end: number; words: number[]}[];
export const VOICE_END = A.end;
export const OUTRO_SEC = 3.6;
export const TOTAL_SEC = Math.ceil((timing.duration + OUTRO_SEC) * 10) / 10;

export const useT = () => useCurrentFrame() / FPS;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ramp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const pop = (t: number, at: number, cfg: {damping?: number; stiffness?: number; mass?: number} = {}) =>
  spring({frame: Math.round((t - at) * FPS), fps: FPS, config: {damping: 13, stiffness: 170, mass: 0.8, ...cfg}});
export const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

// ---------- theme (tazim-style own identity, "Midnight Plum" theme: night palm grove, dawn lavender for the morning) ----------
export const C = {
  bg: '#120B24',
  bg2: '#2A1A52',
  sap: '#E9A548',
  sapDeep: '#B8722A',
  dawn: '#FFB38A',
  rose: '#FF5C8A',
  gold: '#FFC24D',
  blue: '#164A9E',
  blueDeep: '#0E3474',
  surface: '#151B2E',
  surfaceHi: '#1E2648',
  signature: '#8B6CFF',
  danger: '#FF4D6D',
  good: '#26C6DA',
  warn: '#FF8A3D',
  info: '#4DD4FF',
  text: '#F5F7FF',
  muted: '#8A93B2',
  paper: '#FFFFFF',
  ink: '#1E1533',
  skin: '#E9B48E',
  eye: '#2A2340',
};
export const FONT = "'PoppinsX', 'BalooX', sans-serif"; // Latin -> Poppins, Bangla -> Baloo Da 2
export const FONT_BN = "'BalooX', 'PoppinsX', sans-serif";

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
export const bn = (s: string | number) => String(s).replace(/[0-9]/g, (d) => BN_DIGITS[+d]);

// ---------- fonts ----------
let fontsRequested = false;
export const useFonts = () => {
  if (fontsRequested) return;
  fontsRequested = true;
  const handle = delayRender('fonts');
  const faces: [string, string, string][] = [
    ['BalooX', 'baloo-da-2-bengali-800-normal.woff2', '800'],
    ['BalooX', 'baloo-da-2-bengali-600-normal.woff2', '600'],
    ['BalooX', 'baloo-da-2-latin-800-normal.woff2', '800'],
    ['BalooX', 'baloo-da-2-latin-600-normal.woff2', '600'],
    ['PoppinsX', 'poppins-latin-800-normal.woff2', '800'],
    ['PoppinsX', 'poppins-latin-700-normal.woff2', '700'],
    ['PoppinsX', 'poppins-latin-600-normal.woff2', '600'],
  ];
  Promise.all(
    faces.map(([fam, file, weight]) => {
      const ff = new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight});
      return ff.load().then((f) => (document as any).fonts.add(f));
    })
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};

// ---------- background ----------
export const Background: React.FC<{t: number; blueprint: number}> = ({t, blueprint}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 35%, ${C.bg2} 0%, ${C.bg} 75%)`}} />
    <div style={{position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(#ffffff 1.3px, transparent 1.3px)', backgroundSize: '40px 40px', transform: `translateY(${(t * 6) % 40}px)`}} />
    {blueprint > 0 && (
      <div style={{position: 'absolute', inset: 0, opacity: blueprint, background: `linear-gradient(180deg, ${C.blue} 0%, ${C.blueDeep} 100%)`}}>
        <div style={{position: 'absolute', inset: 0, opacity: 0.09, backgroundImage: 'linear-gradient(#fff 1.5px, transparent 1.5px), linear-gradient(90deg, #fff 1.5px, transparent 1.5px)', backgroundSize: '72px 72px'}} />
        <div style={{position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '18px 18px'}} />
      </div>
    )}
  </div>
);

// ---------- brand + source ----------
export type Platform = 'facebook' | 'youtube';
export const BRAND = {
  facebook: {name: 'Al NUR', initial: 'A', sub: 'Facebook পেজ', btn: 'Follow', done: 'Following'},
  youtube: {name: 'Mr N Boy', initial: 'M', sub: 'YouTube চ্যানেল', btn: 'Subscribe', done: 'Subscribed'},
};
export const BrandPill: React.FC<{platform: Platform}> = ({platform}) => (
  <div style={{position: 'absolute', left: 40, top: 130, display: 'flex', alignItems: 'center', gap: 14, padding: '8px 22px 8px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.14)'}}>
    <div style={{width: 50, height: 50, borderRadius: 999, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 27, color: '#fff'}}>{BRAND[platform].initial}</div>
    <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 29, color: C.text, letterSpacing: 0.3}}>{BRAND[platform].name}</div>
  </div>
);

export const SourcePill: React.FC<{t: number; from: number; to: number; text: string}> = ({t, from, to, text}) => {
  const o = ramp(t, from, from + 0.35) * (1 - ramp(t, to - 0.3, to));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', right: 40, top: 136, maxWidth: 640, opacity: o, transform: `translateY(${(1 - o) * -12}px)`, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, background: 'rgba(21,27,46,0.75)', border: '1.5px solid rgba(77,212,255,0.35)'}}>
      <svg width="28" height="24" viewBox="0 0 28 24"><rect x="1" y="2" width="22" height="20" rx="3" fill="none" stroke={C.info} strokeWidth="2.4" /><rect x="5" y="6" width="8" height="6" fill={C.info} /><line x1="15" y1="7" x2="20" y2="7" stroke={C.info} strokeWidth="2" /><line x1="15" y1="11" x2="20" y2="11" stroke={C.info} strokeWidth="2" /><line x1="5" y1="16" x2="20" y2="16" stroke={C.info} strokeWidth="2" /><path d="M23 7 h3 v12 a3 3 0 0 1 -3 3" fill="none" stroke={C.info} strokeWidth="2.4" /></svg>
      <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 25, color: C.text}}>{text}</div>
    </div>
  );
};

// ---------- captions: glass bar, violet box behind the active word ----------
export const Captions: React.FC<{t: number}> = ({t}) => {
  let idx = -1;
  for (let i = CHUNKS.length - 1; i >= 0; i--) if (t >= CHUNKS[i].start - 0.05) { idx = i; break; }
  if (idx < 0 || t >= CHUNKS[idx].end + 0.25) return null;
  const c = CHUNKS[idx];
  const enter = pop(t, c.start - 0.05, {damping: 16, stiffness: 220});
  const leave = t > c.end ? 1 - ramp(t, c.end, c.end + 0.2) : 1;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, bottom: 440, display: 'flex', justifyContent: 'center', opacity: leave}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, alignItems: 'center', padding: '16px 26px 18px', borderRadius: 30, background: 'rgba(20,11,38,0.74)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(255,255,255,0.10)', boxShadow: '0 12px 40px rgba(0,0,0,0.35)', transform: `translateY(${(1 - enter) * 18}px) scale(${0.96 + 0.04 * enter})`, maxWidth: 1000}}>
        {c.words.map((wi) => {
          const w = WORDS[wi];
          const active = t >= w.start && t < w.end + 0.06;
          const said = t >= w.start;
          const k = pop(t, w.start, {damping: 18, stiffness: 260});
          return (
            <span key={wi} style={{position: 'relative', fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.18, color: C.text, opacity: said ? 1 : 0.5, padding: '0 10px'}}>
              {active ? <span style={{position: 'absolute', inset: '4px 0 0 0', borderRadius: 14, background: C.signature, transform: `scale(${0.85 + 0.15 * k})`, zIndex: -1}} /> : null}
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- sticker (die-cut look, slaps in) ----------
export const Sticker: React.FC<{t: number; at: number; text: string; color?: string; rotate?: number; size?: number; textColor?: string; style?: React.CSSProperties}> = ({t, at, text, color = C.danger, rotate = -5, size = 44, textColor = '#fff', style}) => {
  if (t < at - 0.02) return null;
  const k = pop(t, at, {damping: 11, stiffness: 260, mass: 0.7});
  const scale = 1.45 - 0.45 * k;
  const shake = t - at < 0.35 ? Math.sin((t - at) * 70) * 3 * (1 - (t - at) / 0.35) : 0;
  return (
    <div style={{display: 'inline-block', transform: `rotate(${rotate + shake}deg) scale(${scale})`, opacity: clamp01(k * 2), ...style}}>
      <div style={{position: 'relative', padding: `${size * 0.22}px ${size * 0.55}px ${size * 0.3}px`, borderRadius: size * 0.45, background: color, border: '6px solid #fff', boxShadow: '0 10px 26px rgba(0,0,0,0.35)', fontFamily: FONT_BN, fontWeight: 800, fontSize: size, color: textColor, whiteSpace: 'nowrap', lineHeight: 1.1}}>
        {text}
        {/* peeled corner */}
        <div style={{position: 'absolute', right: -6, top: -6, width: size * 0.5, height: size * 0.5, background: 'linear-gradient(225deg, rgba(255,255,255,0) 50%, #e8e8f2 50%)', borderTopRightRadius: size * 0.45}} />
      </div>
    </div>
  );
};

// ---------- hand-drawn scribble cross-out ----------
export const Scribble: React.FC<{t: number; at: number; w: number; h?: number; color?: string; dur?: number}> = ({t, at, w, h = 40, color = C.danger, dur = 0.4}) => {
  const p = ease((t - at) / dur);
  if (p <= 0) return null;
  const n = 7;
  let d = `M 0 ${h * 0.55}`;
  for (let i = 1; i <= n; i++) {
    const x = (w / n) * i;
    const y = i % 2 ? h * 0.2 : h * 0.85;
    d += ` Q ${x - w / n / 2} ${y + (i % 2 ? -6 : 6)} ${x} ${y}`;
  }
  const len = w * 2.2;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: '50%', marginTop: -h / 2, overflow: 'visible'}}>
      <path d={d} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    </svg>
  );
};

// ---------- round-head characters ----------
export type BeanKind = 'ammu' | 'abbu' | 'bon' | 'bhai' | 'you' | 'scammer' | 'doctor';
export const Bean: React.FC<{kind: BeanKind; size?: number; t?: number; mood?: 'happy' | 'worried' | 'neutral' | 'sleep'; bounce?: number; phase?: number}> = ({kind, size = 220, t = 0, mood = 'neutral', bounce = 1, phase = 0}) => {
  const body = {ammu: '#6E56D9', abbu: C.good, bon: C.warn, bhai: C.info, you: '#7A86B8', scammer: '#C93356', doctor: '#E9EEF8'}[kind];
  const y = -Math.abs(Math.sin(t * 2.6 + phase)) * 8 * bounce;
  const tilt = Math.sin(t * 1.3 + phase) * 2.5 * bounce;
  const mouth = mood === 'happy' ? 'M 42 60 Q 50 67 58 60' : mood === 'worried' ? 'M 42 63 Q 50 57 58 63' : 'M 43 61 L 57 61';
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{transform: `translateY(${y}px) rotate(${tilt}deg)`, overflow: 'visible'}}>
      <ellipse cx="50" cy="137" rx="26" ry="4" fill="rgba(0,0,0,0.25)" />
      {kind === 'ammu' && <circle cx="50" cy="44" r="35" fill={C.signature} />}
      {kind === 'bhai' && <circle cx="50" cy="44" r="34" fill="#3BB8E0" />}
      {kind === 'scammer' && <circle cx="50" cy="44" r="35" fill={C.danger} />}
      {kind === 'bon' && <circle cx="80" cy="26" r="11" fill={C.warn} />}
      <rect x="22" y="72" width="56" height="64" rx="28" fill={body} />
      {kind === 'ammu' && <path d="M 18 70 Q 50 92 82 70 L 80 98 Q 50 112 20 98 Z" fill={C.signature} />}
      {kind === 'doctor' && <rect x="46" y="76" width="8" height="40" rx="3" fill={C.good} />}
      <circle cx="50" cy="46" r={kind === 'ammu' || kind === 'scammer' || kind === 'bhai' ? 26 : 29} fill={C.skin} />
      {(kind === 'abbu' || kind === 'you' || kind === 'doctor') && <path d="M 22 40 Q 26 14 50 15 Q 74 14 78 40 Q 66 28 50 29 Q 34 28 22 40 Z" fill="#2B2440" />}
      {kind === 'bon' && <path d="M 21 44 Q 22 14 50 15 Q 78 14 79 44 Q 70 26 50 27 Q 30 26 21 44 Z" fill={C.warn} />}
      {mood === 'sleep' ? (
        <g fill="none" stroke={C.eye} strokeWidth="2.6" strokeLinecap="round"><path d="M 36 48 Q 41 52 46 48" /><path d="M 54 48 Q 59 52 64 48" /></g>
      ) : (
        <>
          <circle cx="41" cy="47" r="3.4" fill={C.eye} />
          <circle cx="59" cy="47" r="3.4" fill={C.eye} />
        </>
      )}
      {kind === 'abbu' && (
        <g fill="none" stroke={C.eye} strokeWidth="2.2"><circle cx="41" cy="47" r="7.5" /><circle cx="59" cy="47" r="7.5" /><line x1="48.5" y1="47" x2="51.5" y2="47" /></g>
      )}
      {kind === 'scammer' ? (
        <rect x="27" y="53" width="46" height="16" rx="8" fill="#2A2340" />
      ) : (
        <>
          <ellipse cx="35" cy="56" rx="5" ry="3" fill="#FF8FA3" opacity="0.55" />
          <ellipse cx="65" cy="56" rx="5" ry="3" fill="#FF8FA3" opacity="0.55" />
          <path d={mood === 'sleep' ? 'M 46 61 Q 50 64 54 61' : mouth} fill="none" stroke={C.eye} strokeWidth="2.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

// ---------- phone (violet bezel, tilted) ----------
export const Phone: React.FC<{w?: number; h?: number; tilt?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({w = 400, h = 760, tilt = -6, children, style}) => (
  <div style={{width: w, height: h, borderRadius: 58, background: C.signature, padding: 14, transform: `rotate(${tilt}deg)`, boxShadow: '0 30px 60px rgba(0,0,0,0.45)', ...style}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 46, background: '#0B0E22', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: 14, width: 110, height: 30, marginLeft: -55, borderRadius: 999, background: '#000', zIndex: 5}} />
      {children}
    </div>
  </div>
);

export const Chip: React.FC<{children: React.ReactNode; color?: string; bg?: string; size?: number; style?: React.CSSProperties}> = ({children, color = C.text, bg = 'rgba(255,255,255,0.08)', size = 34, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: 999, background: bg, border: '1.5px solid rgba(255,255,255,0.14)', fontFamily: FONT, fontWeight: 700, fontSize: size, color, whiteSpace: 'nowrap', ...style}}>{children}</div>
);

export const LabelExample: React.FC<{style?: React.CSSProperties}> = ({style}) => (
  <div style={{position: 'absolute', padding: '4px 16px', borderRadius: 999, border: `2px dashed ${C.muted}`, fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted, background: 'rgba(13,16,48,0.7)', ...style}}>উদাহরণ</div>
);

// ---------- odometer number ----------
export const Odometer: React.FC<{t: number; at: number; dur?: number; target: number; pattern: string; size?: number; color?: string; prefix?: string}> = ({t, at, dur = 1.6, target, pattern, size = 150, color = C.text, prefix = ''}) => {
  const v = target * ease((t - at) / dur);
  const digitsCount = pattern.replace(/[^0-9]/g, '').length;
  const settle = pop(t, at + dur, {damping: 9, stiffness: 200});
  let place = digitsCount - 1;
  const cols: React.ReactNode[] = [];
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (!/[0-9]/.test(ch)) {
      cols.push(<span key={i} style={{opacity: v >= Math.pow(10, place + 1) * 0.999 || t > at + dur ? 1 : 0.15}}>{ch}</span>);
      continue;
    }
    const p = Math.pow(10, place);
    // classic odometer: a column only turns while the column below rolls over from 9 to 0
    const carry = p === 1 ? (v % 1) : clamp01(((v % p) - 0.9 * p) / (0.1 * p));
    const roll = (Math.floor(v / p) % 10) + carry;
    const visible = place === 0 || v >= p * 0.999 || t > at + dur;
    cols.push(
      <span key={i} style={{display: 'inline-block', height: size * 1.15, overflow: 'hidden', verticalAlign: 'top', opacity: visible ? 1 : 0.15}}>
        <span style={{display: 'block', transform: `translateY(${-roll * size * 1.15}px)`}}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => (
            <span key={k} style={{display: 'block', height: size * 1.15, lineHeight: `${size * 1.15}px`}}>{bn(d)}</span>
          ))}
        </span>
      </span>
    );
    place--;
  }
  return (
    <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: size, color, lineHeight: `${size * 1.15}px`, display: 'inline-flex', transform: `scale(${1 + 0.06 * Math.sin(Math.PI * clamp01(settle)) })`}}>
      {prefix ? <span>{prefix}</span> : null}
      {cols}
    </div>
  );
};

// ---------- toggle switch ----------
export const Toggle: React.FC<{on: number; w?: number}> = ({on, w = 110}) => {
  const h = w * 0.56;
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: 999, background: on > 0.5 ? C.signature : 'rgba(255,255,255,0.18)', transition: 'none'}}>
      <div style={{position: 'absolute', top: h * 0.1, left: h * 0.1 + (w - h) * on, width: h * 0.8, height: h * 0.8, borderRadius: 999, background: '#fff', boxShadow: '0 3px 8px rgba(0,0,0,0.3)'}} />
    </div>
  );
};

export const Confetti: React.FC<{t: number; at: number; x: number; y: number}> = ({t, at, x, y}) => {
  const d = t - at;
  if (d < 0 || d > 1.2) return null;
  const colors = [C.signature, C.good, C.warn, C.info, C.danger, '#fff'];
  return (
    <>
      {Array.from({length: 18}).map((_, i) => {
        const ang = (i / 18) * Math.PI * 2 + i;
        const sp = 260 + (i % 5) * 60;
        const px = x + Math.cos(ang) * sp * d;
        const py = y + Math.sin(ang) * sp * d + 420 * d * d;
        return <div key={i} style={{position: 'absolute', left: px, top: py, width: 12, height: 18, borderRadius: 3, background: colors[i % colors.length], transform: `rotate(${i * 40 + d * 600}deg)`, opacity: 1 - d / 1.2}} />;
      })}
    </>
  );
};

// ---------- checkbox row ----------
export const CheckRow: React.FC<{t: number; at: number; text: string; color?: string; size?: number; bad?: boolean}> = ({t, at, text, color = C.good, size = 46, bad = false}) => {
  const k = pop(t, at - 0.15);
  const fill = ease((t - at) / 0.25);
  const tick = ease((t - at - 0.2) / 0.3);
  if (k <= 0.001) return null;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 26, opacity: clamp01(k * 1.5), transform: `translateX(${(1 - k) * -40}px)`}}>
      <div style={{position: 'relative', width: size * 1.25, height: size * 1.25, borderRadius: 14, border: `4px solid ${bad ? C.danger : color}`, background: bad ? `rgba(255,77,109,${0.9 * fill})` : `rgba(38,198,218,${0.9 * fill})`}}>
        <svg viewBox="0 0 40 40" style={{position: 'absolute', inset: 6}}>
          {bad ? (
            <path d="M 10 10 L 30 30 M 30 10 L 10 30" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={60 * (1 - tick)} />
          ) : (
            <path d="M 8 21 L 17 30 L 33 11" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - tick)} />
          )}
        </svg>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.text}}>{text}</div>
    </div>
  );
};

// ---------- iris transition (violet circle covers, then reveals) ----------
export const Iris: React.FC<{t: number; at: number; x?: number; y?: number}> = ({t, at, x = W / 2, y = H / 2}) => {
  const d = t - at;
  if (d < -0.4 || d > 0.45) return null;
  const R = Math.hypot(W, H);
  const r = d < 0 ? R * ease((d + 0.4) / 0.4) : R * (1 - ease(d / 0.45));
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: C.signature}} />
    </div>
  );
};

// ---------- shock: camera shake + rose vignette pulse ----------
export const shakeAt = (t: number, at: number, dur = 0.45, amp = 16) => {
  const d = t - at;
  if (d < 0 || d > dur) return {x: 0, y: 0};
  const k = 1 - d / dur;
  return {x: Math.sin(d * 95) * amp * k, y: Math.cos(d * 77) * amp * 0.7 * k};
};
export const Vignette: React.FC<{t: number; at: number}> = ({t, at}) => {
  const d = t - at;
  if (d < 0 || d > 1.1) return null;
  const o = Math.sin(Math.PI * clamp01(d / 1.1)) * 0.75;
  return <div style={{position: 'absolute', inset: 0, opacity: o, background: 'radial-gradient(ellipse at center, rgba(255,77,109,0) 45%, rgba(255,77,109,0.75) 100%)'}} />;
};

// ---------- scene visibility ----------
export const sceneO = (t: number, a: number, b: number, fade = 0.22) => clamp01((t - a + 0.02) / fade) * clamp01((b - t) / fade);
export const Stage: React.FC<{t: number; a: number; b: number; children: React.ReactNode; noFadeIn?: boolean; noFadeOut?: boolean}> = ({t, a, b, children, noFadeIn, noFadeOut}) => {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const oi = noFadeIn ? 1 : clamp01((t - a + 0.02) / 0.22);
  const oo = noFadeOut ? 1 : clamp01((b - t) / 0.22);
  const k = noFadeIn ? 1 : ease((t - a) / 0.35);
  return <div style={{position: 'absolute', inset: 0, opacity: Math.min(oi, oo), transform: `translateY(${(1 - k) * 24}px)`}}>{children}</div>;
};

export const Title: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 76, color = C.text, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.2, ...style}}>{children}</div>
);
