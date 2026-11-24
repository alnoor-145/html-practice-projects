import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {
  A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Iris, Odometer, Platform,
  SourcePill, Stage, Sticker, Title, W, WORDS, clamp01, ease, pop, ramp, shakeAt, useFonts, useT, FPS,
} from './lib';

// Video 024: Vaibhav Sooryavanshi, 204 off 53 balls. Own stylised 2.5D isometric graphics: no real photos, no team/tournament logos.
// Style notes (Al NUR 3D explainer): quantity = object size, floating labels with leader lines, number HUD, one world with a moving camera.

const GRASS = '#2E9E5B', GRASS2 = '#237A47', GOLD = C.gold, ROSE = C.danger;
const wordAt = (text: string, after = 0) => {
  const w = WORDS.find((x) => x.start >= after - 0.01 && x.text.replace(/^["“]/, '').startsWith(text));
  if (!w) throw new Error('word not found: ' + text);
  return w.start;
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * clamp01(k);
const END = A.end;
const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);

// ---------------- isometric building blocks (SVG) ----------------
const COS = 0.866, SIN = 0.5;
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};
// an isometric box whose bottom-front corner sits at (x, y); s = side, h = height
const IsoBox: React.FC<{x: number; y: number; s: number; h: number; color: string; glow?: number}> = ({x, y, s, h, color, glow = 0}) => {
  if (h < 2) return null;
  const fx = x, fy = y, rx = x + s * COS, ry = y - s * SIN, lx = x - s * COS, ly = y - s * SIN, bx = x, by = y - 2 * s * SIN;
  const P = (...pts: number[][]) => pts.map((p) => p.join(',')).join(' ');
  return (
    <g style={{filter: glow > 0 ? `drop-shadow(0 0 ${14 * glow}px ${color})` : undefined}}>
      <polygon points={P([lx, ly], [fx, fy], [fx, fy - h], [lx, ly - h])} fill={shade(color, 0.72)} />
      <polygon points={P([fx, fy], [rx, ry], [rx, ry - h], [fx, fy - h])} fill={shade(color, 0.5)} />
      <polygon points={P([fx, fy - h], [rx, ry - h], [bx, by - h], [lx, ly - h])} fill={shade(color, 1.1)} />
    </g>
  );
};
// floating label with a leader line down to a point
const Tag: React.FC<{x: number; y: number; text: string; sub?: string; k: number; color?: string; line?: number}> = ({x, y, text, sub, k, color = '#fff', line = 70}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${k})`, opacity: clamp01(k * 2), transformOrigin: 'bottom center', textAlign: 'center'}}>
    <div style={{display: 'inline-block', padding: '8px 22px', borderRadius: 18, background: 'rgba(18,11,36,0.82)', border: `2px solid ${color}`, fontFamily: FONT_BN, fontWeight: 800, fontSize: 42, color, whiteSpace: 'nowrap'}}>{text}{sub && <div style={{fontSize: 26, color: C.muted, fontWeight: 600}}>{sub}</div>}</div>
    <div style={{width: 3, height: line, background: color, margin: '0 auto', opacity: 0.8}} />
  </div>
);
// tilted cricket field (a 3D-looking plane via CSS)
const Field: React.FC<{t: number; size?: number; spin?: number}> = ({t, size = 760, spin = 0}) => (
  <div style={{width: size, height: size, perspective: 1600}}>
    <div style={{width: size, height: size, transform: `rotateX(62deg) rotateZ(${spin + t * 2}deg)`, transformStyle: 'preserve-3d', position: 'relative'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${GRASS} 0%, ${GRASS2} 100%)`, boxShadow: `0 0 0 14px ${shade(GRASS2, 0.7)}, 0 40px 80px rgba(0,0,0,0.5)`}} />
      <div style={{position: 'absolute', inset: size * 0.08, borderRadius: '50%', border: '4px dashed rgba(255,255,255,0.55)'}} />
      <div style={{position: 'absolute', left: size * 0.5 - 40, top: size * 0.3, width: 80, height: size * 0.4, background: '#D9C79A', borderRadius: 6}} />
      <div style={{position: 'absolute', inset: size * 0.3, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.35)'}} />
    </div>
  </div>
);
const Bat: React.FC<{size?: number; rot?: number}> = ({size = 200, rot = 0}) => (
  <svg width={size * 0.4} height={size} viewBox="0 0 40 100" style={{transform: `rotate(${rot}deg)`, transformOrigin: '50% 90%'}}>
    <rect x="16" y="2" width="8" height="30" rx="3" fill="#6B3E26" />
    <path d="M8 32 H32 L30 96 Q20 100 10 96 Z" fill="#E9C58A" /><path d="M20 32 V96" stroke="#C99D5E" strokeWidth="2" />
  </svg>
);
const Ball: React.FC<{size?: number; color?: string}> = ({size = 40, color = ROSE}) => (
  <svg width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={color} /><path d="M6 12 Q20 20 6 28 M34 12 Q20 20 34 28" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" /></svg>
);
const Gauge: React.FC<{p: number; size?: number; label: string; value: string; color?: string}> = ({p, size = 300, label, value, color = GOLD}) => (
  <div style={{position: 'relative', width: size, height: size * 0.62}}>
    <svg width={size} height={size * 0.62} viewBox="0 0 100 62">
      <path d="M8 56 A42 42 0 0 1 92 56" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="9" strokeLinecap="round" />
      <path d="M8 56 A42 42 0 0 1 92 56" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray="132" strokeDashoffset={132 * (1 - clamp01(p))} />
      <line x1="50" y1="56" x2={50 + Math.cos(Math.PI * (1 - clamp01(p))) * 34} y2={56 - Math.sin(Math.PI * (1 - clamp01(p))) * 34} stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: -105, textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: size * 0.2, color: C.text, lineHeight: 1}}>{value}</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: size * 0.095, color: C.muted}}>{label}</div></div>
  </div>
);

// ---------------- S1: hook — three blocks rise: 53, 204, 28 ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const a = 0, b = A.match;
  const hs = [{at: A.b53, h: 120, c: C.info, label: '৫৩', sub: 'বল'}, {at: A.n204, h: 520, c: GOLD, label: '২০৪', sub: 'রান'}, {at: A.s28, h: 260, c: ROSE, label: '২৮', sub: 'ছক্কা'}];
  const xs = [250, 540, 830];
  const sh = shakeAt(t, A.n204 + 0.5, 0.45, 12);
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        <div style={{position: 'absolute', left: 150, top: 760, opacity: 0.9}}><Field t={t} size={780} /></div>
        <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {hs.map((hh, i) => <IsoBox key={i} x={xs[i]} y={1020 + (i === 1 ? 30 : 0)} s={90} h={hh.h * ease((t - hh.at) / 0.7)} color={hh.c} glow={i === 1 ? 1 : 0} />)}
        </svg>
        {hs.map((hh, i) => {
          const k = pop(t, hh.at + 0.3);
          return t > hh.at ? <Tag key={i} x={xs[i]} y={1020 + (i === 1 ? 30 : 0) - hh.h * ease((t - hh.at) / 0.7) - 60} text={hh.label} sub={hh.sub} k={k} color={hh.c} line={50} /> : null;
        })}
      </div>
      {t > A.age15 && <Center top={1190}><Sticker t={t} at={A.age15 + 0.1} text="বয়স ১৫ বছর!" color={ROSE} rotate={-4} size={74} /></Center>}
    </Stage>
  );
};

// ---------------- S2: the match ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.match, b = A.follow;
  const pin = pop(t, a + 0.3);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><div style={{transform: `scale(${pop(t, a)})`}}><Chip size={44} bg="rgba(255,255,255,0.1)">রাইজিং স্টারস এশিয়া কাপ</Chip></div></Center>
      <Center top={420} style={{opacity: ramp(t, a + 0.2, a + 0.6)}}><Field t={t} size={760} spin={20} /></Center>
      <div style={{position: 'absolute', left: 520, top: 680}}>
        <Tag x={0} y={0} text="দোহা" sub="কাতার" k={pin} color={C.info} line={120} />
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1090, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{transform: `translateX(${(1 - ease((t - a - 0.8) / 0.5)) * -160}px)`, opacity: ramp(t, a + 0.8, a + 1.2)}}><Chip size={50} bg={'#4D8BFF'}>ভারত এ</Chip></div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.muted}}>বনাম</div>
        <div style={{transform: `translateX(${(1 - ease((t - a - 1.2) / 0.5)) * 160}px)`, opacity: ramp(t, a + 1.2, a + 1.6)}}><Chip size={50} bg={C.warn} color={C.ink}>আমিরাত</Chip></div>
      </div>
    </Stage>
  );
};

// ---------------- S3: follow ----------------
const S3: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.prev;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}><Title size={78}>ক্রিকেটের তাজা খবর</Title><Title size={78} color={GOLD}>সবার আগে, এখানে</Title></div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};

// ---------------- S4: two quiet games, then the storm ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.prev, b = A.chase;
  const storm = ease((t - A.third) / 1.1);
  const grey = '#6B7194';
  const bars = [{at: A.t20 + 0.3, h: 108 * 2.6, label: '১০৮', sub: '১৪ বছরে', x: 240, c: GOLD}, {at: A.nepal - 0.2, h: 26 * 2.6, label: '২৬', sub: 'নেপাল', x: 470, c: grey}, {at: A.pak - 0.2, h: 11 * 2.6, label: '১১', sub: 'পাকিস্তান এ', x: 660, c: grey}];
  const baseY = 1130;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290} style={{opacity: 1 - ramp(t, A.story - 0.2, A.story)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, transform: `scale(${pop(t, a + 0.1)})`}}><div style={{padding: '14px 34px', borderRadius: 26, background: '#F5F7FF', fontFamily: FONT_BN, fontWeight: 800, fontSize: 58, color: C.ink}}>বয়স ১৪: ৬১ বলে ১০৮</div></div>
      </Center>
      <Center top={460} style={{opacity: ramp(t, A.t20 + 1, A.t20 + 1.5) * (1 - ramp(t, A.story - 0.2, A.story))}}><Chip size={36} bg="rgba(255,255,255,0.1)">দেশের সেরা ঘরোয়া টি-টোয়েন্টি</Chip></Center>
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <polygon points={`100,${baseY + 20} 1000,${baseY + 20} 1040,${baseY - 30} 140,${baseY - 30}`} fill="rgba(255,255,255,0.06)" />
        {bars.map((br, i) => <IsoBox key={i} x={br.x} y={baseY} s={80} h={br.h * ease((t - br.at) / 0.5)} color={br.c} />)}
        <IsoBox x={880} y={baseY} s={80} h={530 * storm} color={ROSE} glow={storm} />
      </svg>
      {bars.map((br, i) => t > br.at + 0.3 && <Tag key={i} x={br.x} y={baseY - br.h * ease((t - br.at) / 0.5) - 40} text={br.label} sub={br.sub} k={pop(t, br.at + 0.3)} color={i === 0 ? GOLD : '#B8BCD6'} line={30} />)}
      {t > A.form - 0.1 && t < A.third && <Center top={560}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.warn, transform: `scale(${pop(t, A.form)}) rotate(${Math.sin(t * 5) * 8}deg)`}}>?</div></Center>}
      {storm > 0.05 && <Tag x={880} y={baseY - 530 * storm - 40} text="তৃতীয় ম্যাচ" sub="২০৪*" k={pop(t, A.third + 0.5)} color={ROSE} line={40} />}
      {storm > 0 && <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 50% 30% at 82% 70%, rgba(255,77,109,${0.35 * storm}) 0%, rgba(255,77,109,0) 100%)`}} />}
    </Stage>
  );
};

// ---------------- S5: the chase ----------------
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.chase, b = A.innings;
  const fill = ease((t - A.overs + 1.2) / 2.2);
  const baseY = 1130;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={260}><div style={{transform: `scale(${pop(t, a + 0.1)})`}}><Chip size={46} bg="rgba(255,255,255,0.1)">লক্ষ্য: ২৫০ রান</Chip></div></Center>
      <svg width={W} height={1400} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <IsoBox x={380} y={baseY} s={110} h={440} color="#6B7194" />
        <IsoBox x={700} y={baseY} s={110} h={440 * fill} color={'#4D8BFF'} glow={fill} />
      </svg>
      <Tag x={380} y={baseY - 500} text="২৫০" sub="আমিরাতের লক্ষ্য" k={pop(t, a + 0.5)} color="#B8BCD6" line={40} />
      {fill > 0.05 && <Tag x={700} y={baseY - 440 * fill - 60} text="ভারত এ" sub={fill > 0.98 ? 'পার!' : ''} k={pop(t, a + 1)} color={'#4D8BFF'} line={30} />}
      {t > A.overs - 0.3 && (
        <div style={{position: 'absolute', left: 90, top: 1190, display: 'flex', alignItems: 'center', gap: 22, transform: `scale(${pop(t, A.overs - 0.2)})`, transformOrigin: 'left center'}}>
          <svg width="90" height="90" viewBox="0 0 24 24"><circle cx="12" cy="13" r="9" fill="none" stroke={GOLD} strokeWidth="2.2" /><path d="M12 13V8M10 2h4" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" /></svg>
          <div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.text, lineHeight: 1}}>১৪.২ ওভার</div></div>
          <div style={{display: 'flex', gap: 8, marginLeft: 26}}>{Array.from({length: 10}).map((_, i) => <div key={i} style={{width: 18, height: 56, borderRadius: 6, background: i < 7 ? C.good : '#4A3F7A', transform: `scaleY(${pop(t, A.wkts + i * 0.04)})`, transformOrigin: 'bottom'}} />)}</div>
        </div>
      )}
      {t > A.wkts && <div style={{position: 'absolute', left: 520, top: 1275, opacity: ramp(t, A.wkts, A.wkts + 0.3)}}><Chip size={32} bg="rgba(38,198,218,0.2)">৭ উইকেট হাতে</Chip></div>}
    </Stage>
  );
};

// ---------------- S6: the maths of the innings ----------------
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.innings, b = A.out;
  const sixes = Math.floor(ramp(t, a + 0.3, a + 3.2) * 28);
  const six168 = ease((t - A.n168) / 0.9);
  const pctP = ease((t - A.pct) / 1.1) * 0.82;
  const balls = Math.floor(ramp(t, A.n35 - 0.6, A.n35 + 2.2) * 35);
  const sr = ease((t - A.sr) / 1.6);
  const part2 = ramp(t, A.also - 0.2, A.also + 0.3);
  return (
    <Stage t={t} a={a} b={b}>
      {/* a) sixes tower + 168 */}
      <div style={{opacity: 1 - part2}}>
        <Center top={290}><Chip size={44} bg="rgba(255,255,255,0.1)">৭ চার · ২৮ ছক্কা</Chip></Center>
        <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {Array.from({length: 28}).map((_, i) => i < sixes ? <IsoBox key={i} x={330 + (i % 2) * 6} y={1180 - i * 22} s={60} h={18} color={ROSE} glow={i === sixes - 1 ? 1 : 0} /> : null)}
        </svg>
        <div style={{position: 'absolute', left: 560, top: 640}}>
          {t > A.n168 - 0.2 && <div style={{transform: `scale(${pop(t, A.n168)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, color: ROSE, lineHeight: 1}}>১৬৮</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.text}}>রান শুধু ছক্কা থেকে</div><div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 30, color: C.muted}}>২৮ × ৬ = ১৬৮</div></div>}
        </div>
        <div style={{position: 'absolute', left: 560, top: 960, opacity: six168}}>
          <svg width="260" height="260" viewBox="0 0 100 100" style={{transform: 'rotate(-90deg)'}}><circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14" /><circle cx="50" cy="50" r="38" fill="none" stroke={ROSE} strokeWidth="14" strokeDasharray="238.8" strokeDashoffset={238.8 * (1 - pctP)} /></svg>
          <div style={{position: 'absolute', left: 0, top: 96, width: 260, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text}}>~৮২%</div>
        </div>
      </div>
      {/* b) 53-ball grid and strike rate */}
      {part2 > 0 && (
        <div style={{opacity: part2}}>
          <Center top={290}><Chip size={44} bg="rgba(255,255,255,0.1)">৫৩ বলের মধ্যে</Chip></Center>
          <div style={{position: 'absolute', left: 140, top: 440, width: 800, height: 520, perspective: 1500}}>
            <div style={{width: 800, height: 520, transform: 'rotateX(48deg) rotateZ(-8deg)', display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 14, alignContent: 'center'}}>
              {Array.from({length: 53}).map((_, i) => { const hit = i < balls; return <div key={i} style={{display: 'flex', justifyContent: 'center', transform: `scale(${hit ? 1.15 : 0.8})`, opacity: hit ? 1 : 0.35}}><Ball size={58} color={hit ? (i % 4 === 0 ? ROSE : GOLD) : '#4A3F7A'} /></div>; })}
            </div>
          </div>
          {t > A.n35 - 0.4 && <Center top={1010}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.text, transform: `scale(${pop(t, A.n35 - 0.3)})`}}><span style={{color: GOLD}}>৩৫</span> বল সীমানায়</div></Center>}
          {t > A.sr - 0.2 && <Center top={1110}><Gauge p={sr * 0.96} size={320} label="স্ট্রাইক রেট" value="৩৮৫" color={ROSE} /></Center>}
        </div>
      )}
    </Stage>
  );
};

// ---------------- S7: out ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.out, b = A.records;
  const fall = ease((t - a - 0.5) / 0.5);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={320} style={{opacity: 1 - ramp(t, A.history + 1.2, A.history + 1.6)}}><div style={{transform: `scale(${pop(t, a + 0.1)})`}}><Chip size={46} bg={ROSE}>আউট: বাসিল হামিদ</Chip></div></Center>
      <div style={{position: 'absolute', left: 420, top: 560, display: 'flex', gap: 28}}>
        {[0, 1, 2].map((i) => <div key={i} style={{width: 20, height: 280, borderRadius: 8, background: '#E9C58A', transformOrigin: 'bottom center', transform: `rotate(${fall * (i - 1) * 55 + (i === 1 ? 0 : 0)}deg) translateY(${fall * 20}px)`}} />)}
        <div style={{position: 'absolute', left: -20, top: -14, width: 190, height: 14, borderRadius: 7, background: '#C99D5E', transform: `translateY(${-fall * 260}px) rotate(${fall * 40}deg)`, opacity: 1 - fall * 0.8}} />
      </div>
      {t > A.history - 0.1 && (
        <Center top={960}><div style={{transform: `scale(${pop(t, A.history)})`, textAlign: 'center'}}>
          <svg width="380" height="260" viewBox="0 0 120 80"><rect x="10" y="20" width="100" height="56" rx="6" fill="#241A3D" stroke={GOLD} strokeWidth="3" /><path d="M20 20 V12 H100 V20" fill="none" stroke={GOLD} strokeWidth="3" /><text x="60" y="55" textAnchor="middle" fontFamily="Baloo X, sans-serif" fontWeight="800" fontSize="22" fill={GOLD}>ইতিহাস</text></svg>
        </div></Center>
      )}
    </Stage>
  );
};

// ---------------- S8: three records ----------------
const REC = [
  {key: 'r1', title: 'দ্রুততম ডাবল সেঞ্চুরি', unit: 'বল', old: 103, nu: 53, oldLabel: 'চ্যাড বোউস · ২০২৪', fmt: (v: number) => String(v), up: false},
  {key: 'r2', title: 'এক ইনিংসে সবচেয়ে বেশি ছক্কা', unit: 'ছক্কা', old: 23, nu: 28, oldLabel: 'ডার্সি শর্ট · ২০১৮', fmt: (v: number) => String(v), up: true},
];
const BN = '০১২৩৪৫৬৭৮৯';
const bnum = (n: number) => String(n).replace(/[0-9]/g, (d) => BN[+d]);
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.records, b = A.caution;
  const phase = t < A.r2 ? 0 : t < A.r3 ? 1 : 2;
  const r = REC[Math.min(phase, 1)];
  const start = phase === 0 ? A.r1 : A.r2;
  const nu = ease((t - (phase === 0 ? A.half - 1.5 : A.r2 + 2)) / 0.9);
  const scale = 4.2;
  const baseY = 1060;
  return (
    <Stage t={t} a={a} b={b}>
      {phase < 2 ? (
        <>
          <NumDot n={phase + 1} t={t} at={start} />
          <div style={{position: 'absolute', left: 180, right: 60, top: 280, fontFamily: FONT_BN, fontWeight: 800, fontSize: 54, color: C.text, lineHeight: 1.2, opacity: ramp(t, start, start + 0.3)}}>{r.title}</div>
          <svg width={W} height={1400} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <IsoBox x={360} y={baseY} s={100} h={r.old * (phase === 0 ? 4.2 : 12) * ease((t - start - 0.4) / 0.6)} color="#6B7194" />
            <IsoBox x={700} y={baseY} s={100} h={r.nu * (phase === 0 ? 4.2 : 12) * nu} color={r.up ? ROSE : GOLD} glow={nu} />
          </svg>
          <Tag x={360} y={baseY - r.old * (phase === 0 ? 4.2 : 12) * ease((t - start - 0.4) / 0.6) - 50} text={`${bnum(r.old)} ${r.unit}`} sub={r.oldLabel} k={pop(t, start + 1)} color="#B8BCD6" line={30} />
          {nu > 0.05 && <Tag x={700} y={baseY - r.nu * (phase === 0 ? 4.2 : 12) * nu - 50} text={`${bnum(r.nu)} ${r.unit}`} sub="বৈভব" k={pop(t, start + 2)} color={r.up ? ROSE : GOLD} line={30} />}
          {phase === 0 && nu > 0.9 && <Center top={1130}><Sticker t={t} at={A.half + 0.2} text="প্রায় অর্ধেক বলে!" color={GOLD} textColor={C.ink} rotate={-3} size={52} /></Center>}
        </>
      ) : (
        <>
          <NumDot n={3} t={t} at={A.r3} />
          <div style={{position: 'absolute', left: 180, right: 60, top: 280, fontFamily: FONT_BN, fontWeight: 800, fontSize: 54, color: C.text, opacity: ramp(t, A.r3, A.r3 + 0.3)}}>সবচেয়ে কম বয়সী ডাবল সেঞ্চুরিয়ান</div>
          <Center top={560} style={{transform: `scale(${pop(t, A.age)})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 20}}><Bean kind="bhai" size={260} t={t} mood="happy" /><div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 140, color: GOLD, lineHeight: 1}}>১৫</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text}}>বছর</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.muted}}>২৪২ দিন</div></div></div>
          </Center>
          <Center top={1060}><Chip size={38} bg="rgba(255,255,255,0.1)">লিস্ট এ ডাবল সেঞ্চুরিয়ানদের মধ্যে</Chip></Center>
        </>
      )}
    </Stage>
  );
};
const NumDot: React.FC<{n: number; t: number; at: number}> = ({n, t, at}) => (
  <div style={{position: 'absolute', left: 60, top: 270, width: 100, height: 100, borderRadius: 99, background: GOLD, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.ink, transform: `scale(${pop(t, at)})`}}>{bnum(n)}</div>
);

// ---------------- S9: caution + semifinal ----------------
const S9: React.FC<{t: number}> = ({t}) => {
  const a = A.caution, b = A.question;
  const semi = ramp(t, A.semi - 0.2, A.semi + 0.3);
  return (
    <Stage t={t} a={a} b={b}>
      {semi < 1 && (
        <div style={{opacity: 1 - semi}}>
          <div style={{position: 'absolute', left: 100, right: 100, top: 400, padding: '36px 40px', borderRadius: 36, background: 'rgba(255,194,77,0.12)', border: `4px solid ${GOLD}`, transform: `scale(${pop(t, a + 0.1)})`}}>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: GOLD}}>মনে রাখবেন</div>
            <div style={{marginTop: 14, fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text, lineHeight: 1.3}}>এটা আন্তর্জাতিক ম্যাচ না।<br />রেকর্ডগুলো <span style={{color: GOLD}}>লিস্ট এ</span> ক্রিকেটের।</div>
          </div>
        </div>
      )}
      {semi > 0 && (
        <div style={{opacity: semi}}>
          <Center top={340}><Title size={70}>সেমিফাইনালে ভারত এ</Title></Center>
          <Center top={560}><Field t={t} size={720} spin={50} /></Center>
          <Center top={1150}><Sticker t={t} at={A.semi + 0.3} text="এখন সবার চোখ পরের ম্যাচে" color={C.signature} rotate={-3} size={46} /></Center>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S10: guess + share ----------------
const S10: React.FC<{t: number}> = ({t}) => {
  const a = A.question, b = A.send;
  const msg = '২৫০+, আমার আন্দাজ!';
  const typeP = ramp(t, A.comment - 0.2, A.comment + 1.4);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="আপনার আন্দাজ কত রান?" color={GOLD} textColor={C.ink} rotate={-3} size={58} /></Center>
      <Center top={520}><div style={{display: 'flex', gap: 24}}>{[100, 150, 204, 250].map((n, i) => <div key={i} style={{padding: '18px 30px', borderRadius: 22, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.18)', fontFamily: FONT_BN, fontWeight: 800, fontSize: 54, color: C.text, transform: `scale(${pop(t, a + 0.6 + i * 0.15)})`}}>{bnum(n)}</div>)}</div></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 760, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, A.guess, A.guess + 0.4)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}><div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} /><div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 32, color: C.text}}>{t > A.comment - 0.2 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div></div>
        <div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div>
      </div>
    </Stage>
  );
};
const S11: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.send;
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <div style={{position: 'absolute', left: 90, top: 300, width: 800}}><Title size={56}>ক্রিকেট পাগল</Title><Title size={56} color={GOLD}>বন্ধুকে পাঠান</Title></div>
      <div style={{position: 'absolute', left: 120, top: 560, display: 'flex', gap: 40, transform: `scale(${pop(t, a + 0.3)})`}}><Bean kind="bhai" size={170} t={t} mood="happy" /><Bean kind="you" size={170} t={t} mood="happy" phase={1} /></div>
      <FollowPill t={t} at={A.cta_word} platform={platform} top={900} opacity={ramp(t, A.cta, A.cta + 0.4)} />
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={940} />
      {t > keyAt - 0.1 && <div style={{position: 'absolute', left: 60, right: 60, top: 1180, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 130, color: GOLD, lineHeight: 1}}>২০৪</div><Title size={64}>৫৩ বলে</Title></div>}
    </Stage>
  );
};

export const Cover: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Background t={0} blueprint={0} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 40% at 50% 62%, rgba(255,194,77,0.35) 0%, rgba(255,194,77,0) 100%)'}} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, right: 40, top: 280, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 300, lineHeight: 1, color: GOLD, textShadow: '0 10px 0 rgba(0,0,0,0.4)'}}>২০৪</div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 610, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 120, lineHeight: 1.1, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>৫৩ বলে!</div>
      <div style={{position: 'absolute', left: 150, top: 1000}}><Field t={4} size={780} /></div>
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}><IsoBox x={300} y={1250} s={90} h={130} color={C.info} /><IsoBox x={540} y={1280} s={90} h={380} color={GOLD} glow={1} /><IsoBox x={790} y={1250} s={90} h={230} color={ROSE} /></svg>
      <Center top={1560}><Sticker t={10} at={0} text="১৫ বছরের বৈভব, ২৮ ছক্কা" color={ROSE} rotate={-3} size={60} /></Center>
      <Center top={1730}><Chip size={36} bg="rgba(255,255,255,0.1)">লিস্ট এ রেকর্ড</Chip></Center>
    </AbsoluteFill>
  );
};

const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.1, file: 'tick', vol: 0.8}, {at: A.n204, file: 'impact_boom', vol: 0.55}, {at: A.s28, file: 'bat_hit', vol: 0.7},
  {at: A.age15 - 0.1, file: 'whoosh', vol: 0.4}, {at: A.match - 0.3, file: 'whoosh', vol: 0.4}, {at: A.follow - 0.3, file: 'whoosh', vol: 0.3},
  {at: A.prev - 0.2, file: 'whoosh', vol: 0.35}, {at: A.third - 1.4, file: 'rise_stinger', vol: 0.45}, {at: A.third + 0.5, file: 'impact_boom', vol: 0.5},
  {at: A.chase - 0.2, file: 'whoosh', vol: 0.35}, {at: A.overs - 0.3, file: 'tick', vol: 0.8}, {at: A.innings + 0.3, file: 'counter_roll', vol: 0.4},
  {at: A.n168, file: 'impact_boom', vol: 0.5}, {at: A.also, file: 'whoosh', vol: 0.35}, {at: A.n35 - 0.6, file: 'counter_roll', vol: 0.35},
  {at: A.sr, file: 'rise_stinger', vol: 0.3}, {at: A.out, file: 'bat_hit', vol: 0.6}, {at: A.records - 0.4, file: 'whoosh', vol: 0.35},
  {at: A.half, file: 'impact_boom', vol: 0.55}, {at: A.r2 + 2, file: 'impact_boom', vol: 0.5}, {at: A.age, file: 'impact_boom', vol: 0.5},
  {at: A.caution - 0.3, file: 'whoosh', vol: 0.3}, {at: A.semi - 0.2, file: 'whoosh', vol: 0.3}, {at: A.cta - 1.0, file: 'crowd_roar', vol: 0.32},
];

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [
    {from: A.match, to: A.follow, text: 'সূত্র: Cricinfo, Yahoo Sports'},
    {from: A.prev, to: A.chase, text: 'সূত্র: Yahoo Sports, Gulf News'},
    {from: A.chase, to: A.records, text: 'সূত্র: HumEnglish, Sportskeeda'},
    {from: A.records, to: A.caution, text: 'সূত্র: Cricinfo, CricToday'},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      {SFX.map((s, i) => <Sequence key={i} from={Math.round(s.at * FPS)}><Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.vol * 0.5} /></Sequence>)}
      <Background t={t} blueprint={0} />
      <S1 t={t} /><S2 t={t} /><S3 t={t} platform={platform} /><S4 t={t} /><S5 t={t} /><S6 t={t} /><S7 t={t} /><S8 t={t} /><S9 t={t} /><S10 t={t} /><S11 t={t} platform={platform} />
      <Iris t={t} at={A.prev} x={W / 2} y={800} /><Iris t={t} at={A.records} x={W / 2} y={800} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, top: 214, fontFamily: FONT_BN, fontWeight: 600, fontSize: 23, color: C.muted, opacity: 0.85}}>আঁকা গ্রাফিক্স · আসল ছবি বা ফুটেজ নেই</div>
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
