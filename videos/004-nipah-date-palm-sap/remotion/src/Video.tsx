import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, BRAND, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FONT, FONT_BN, Iris, Odometer, Phone, Platform,
  Scribble, SourcePill, Stage, Sticker, Title, Toggle, Vignette, W, WORDS, clamp01, ease, pop, ramp, shakeAt, useFonts, useT,
} from './lib';

// Video 004: raw date-palm sap and Nipah. Own drawings only (round bat, clay pot, palm tree, bean characters).

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

// ---------------- drawings (our own) ----------------
const Glass: React.FC<{w?: number; fill: number; dots?: number; t?: number}> = ({w = 220, fill, dots = 0, t = 0}) => {
  const h = w * 1.35;
  const top = 12 + (1 - clamp01(fill)) * 140;
  return (
    <svg width={w} height={h} viewBox="0 0 100 135" style={{overflow: 'visible'}}>
      <defs><clipPath id="gl"><path d="M10 6 L90 6 L80 128 L20 128 Z" /></clipPath></defs>
      <g clipPath="url(#gl)">
        <rect x="0" y={top} width="100" height="140" fill={C.sap} opacity="0.92" />
        <rect x="0" y={top} width="100" height="6" fill="#F6C77C" />
        {dots > 0 && Array.from({length: 14}).map((_, i) => (
          <circle key={i} cx={22 + ((i * 37) % 58)} cy={top + 14 + ((i * 23) % 100) + Math.sin(t * 2 + i) * 2} r="3.4" fill={C.rose} opacity={clamp01(dots * 1.2 - i * 0.05)} />
        ))}
      </g>
      <path d="M10 6 L90 6 L80 128 L20 128 Z" fill="rgba(255,255,255,0.12)" stroke="#E8ECFF" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M22 16 L28 116" stroke="rgba(255,255,255,0.45)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};
const Pot: React.FC<{w?: number; glow?: number; dots?: number; t?: number}> = ({w = 170, glow = 0, dots = 0, t = 0}) => (
  <svg width={w} height={w * 1.05} viewBox="0 0 100 105" style={{overflow: 'visible'}}>
    <ellipse cx="50" cy="62" rx="44" ry="40" fill="#B85C38" />
    <ellipse cx="38" cy="50" rx="14" ry="20" fill="rgba(255,255,255,0.12)" />
    <rect x="30" y="10" width="40" height="18" rx="6" fill="#A24E2E" />
    <ellipse cx="50" cy="11" rx="22" ry="6" fill="#5A2614" />
    <path d="M14 46 Q50 60 86 46" fill="none" stroke="#E7C48A" strokeWidth="3" />
    {dots > 0 && Array.from({length: 8}).map((_, i) => <circle key={i} cx={30 + ((i * 29) % 42)} cy={52 + ((i * 17) % 34) + Math.sin(t * 3 + i) * 1.5} r="3.2" fill={C.rose} opacity={clamp01(dots * 1.5 - i * 0.1)} />)}
    {glow > 0 && <ellipse cx="50" cy="62" rx="48" ry="44" fill="none" stroke={C.rose} strokeWidth="4" opacity={glow} />}
  </svg>
);
const Bat: React.FC<{size?: number; t: number; flap?: number}> = ({size = 160, t, flap = 1}) => {
  const f = 0.55 + 0.45 * Math.abs(Math.sin(t * 14)) * flap + (1 - flap) * 0.45;
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 160 112" style={{overflow: 'visible'}}>
      <g transform={`translate(80 56) scale(1 ${f}) translate(-80 -56)`}>
        <path d="M70 50 Q40 20 6 34 Q20 46 16 60 Q32 54 40 68 Q52 56 70 64 Z" fill="#3A2466" />
        <path d="M90 50 Q120 20 154 34 Q140 46 144 60 Q128 54 120 68 Q108 56 90 64 Z" fill="#3A2466" />
      </g>
      <path d="M66 30 L70 14 L78 28 Z M94 30 L90 14 L82 28 Z" fill="#4E3388" />
      <circle cx="80" cy="54" r="24" fill="#4E3388" />
      <circle cx="72" cy="50" r="4.2" fill="#fff" /><circle cx="88" cy="50" r="4.2" fill="#fff" />
      <circle cx="72" cy="51" r="2" fill={C.ink} /><circle cx="88" cy="51" r="2" fill={C.ink} />
      <path d="M76 62 l2 4 l2 -4 M82 62 l2 4 l2 -4" fill="#fff" />
    </svg>
  );
};
const Virus: React.FC<{size?: number; t: number; color?: string}> = ({size = 120, t, color = C.rose}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${t * 30}deg)`}}>
    {Array.from({length: 10}).map((_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return <g key={i}><line x1={50 + Math.cos(a) * 28} y1={50 + Math.sin(a) * 28} x2={50 + Math.cos(a) * 44} y2={50 + Math.sin(a) * 44} stroke={color} strokeWidth="5" /><circle cx={50 + Math.cos(a) * 45} cy={50 + Math.sin(a) * 45} r="5" fill={color} /></g>;
    })}
    <circle cx="50" cy="50" r="30" fill={color} />
    <circle cx="42" cy="44" r="6" fill="rgba(255,255,255,0.35)" /><circle cx="58" cy="58" r="4" fill="rgba(255,255,255,0.35)" />
  </svg>
);
const PalmTree: React.FC<{t: number; h?: number}> = ({t, h = 900}) => (
  <svg width={520} height={h} viewBox={`0 0 520 ${h}`} style={{overflow: 'visible'}}>
    <path d={`M235 ${h} Q228 ${h * 0.5} 250 130 L292 130 Q300 ${h * 0.5} 300 ${h} Z`} fill="#5B3A2A" />
    {Array.from({length: 14}).map((_, i) => <path key={i} d={`M240 ${180 + i * 52} l52 -14`} stroke="#3F271C" strokeWidth="6" strokeLinecap="round" />)}
    {[[-150, -40], [-120, 20], [-60, -90], [150, -40], [120, 20], [60, -90], [0, -110]].map(([dx, dy], i) => {
      const sway = Math.sin(t * 1.2 + i) * 4;
      return <path key={i} d={`M271 130 Q${271 + dx * 0.5} ${130 + dy - 30} ${271 + dx + sway} ${130 + dy + 70}`} fill="none" stroke="#2F6B45" strokeWidth="20" strokeLinecap="round" />;
    })}
    <path d="M292 168 l26 6" stroke="#E7C48A" strokeWidth="4" />
  </svg>
);
const Thermo: React.FC<{level: number}> = ({level}) => (
  <svg width="90" height="300" viewBox="0 0 30 100">
    <rect x="10" y="4" width="10" height="78" rx="5" fill="#F5F7FF" />
    <rect x="12.5" y={80 - 70 * clamp01(level)} width="5" height={70 * clamp01(level) + 4} fill={C.danger} />
    <circle cx="15" cy="86" r="10" fill={C.danger} stroke="#F5F7FF" strokeWidth="3" />
  </svg>
);
const Hospital: React.FC<{size?: number}> = ({size = 220}) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 100 90">
    <rect x="10" y="22" width="80" height="66" rx="6" fill="#E9EEF8" />
    <rect x="34" y="4" width="32" height="26" rx="5" fill="#E9EEF8" />
    <path d="M50 9 v16 M42 17 h16" stroke={C.danger} strokeWidth="6" strokeLinecap="round" />
    {[0, 1, 2].map((i) => <rect key={i} x={20 + i * 24} y="40" width="14" height="12" rx="2" fill="#9FB4E6" />)}
    <rect x="42" y="64" width="16" height="24" rx="2" fill="#7A86B8" />
  </svg>
);
const Fruit: React.FC<{size?: number; bite?: boolean}> = ({size = 200, bite = true}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 18 Q86 22 84 58 Q82 90 50 90 Q18 90 16 58 Q14 22 50 18 Z" fill="#8BC34A" />
    <path d="M50 18 Q54 6 62 4" stroke="#5B3A2A" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M56 12 Q72 4 76 16 Q64 18 56 12 Z" fill="#2F6B45" />
    <ellipse cx="36" cy="44" rx="8" ry="12" fill="rgba(255,255,255,0.25)" />
    {bite && <path d="M84 40 Q72 46 76 56 Q66 60 72 72 Q80 70 86 62 Z" fill={C.bg} />}
  </svg>
);
const Steam: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => (
  <>
    {[0, 1, 2].map((i) => {
      const p = ((t * 0.7 + i / 3) % 1);
      return <div key={i} style={{position: 'absolute', left: x + (i - 1) * 46 + Math.sin(p * 6 + i) * 10, top: y - p * 160, width: 30, height: 70, borderRadius: 30, border: '6px solid rgba(255,255,255,0.7)', borderLeftColor: 'transparent', borderBottomColor: 'transparent', opacity: Math.sin(Math.PI * p)}} />;
    })}
  </>
);
const Fire: React.FC<{t: number; size?: number}> = ({t, size = 150}) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 100 70">
    {[0, 1, 2].map((i) => {
      const s = 1 + Math.sin(t * 9 + i * 2) * 0.12;
      return <path key={i} transform={`translate(${30 + i * 20} 60) scale(${s}) translate(-15 -60)`} d="M15 60 Q0 40 12 22 Q14 34 20 30 Q16 14 26 4 Q30 24 32 30 Q40 44 15 60 Z" fill={i === 1 ? C.gold : C.warn} />;
    })}
    <rect x="10" y="60" width="80" height="8" rx="4" fill="#5B3A2A" />
  </svg>
);
const NumBadge: React.FC<{n: string; t: number; at: number}> = ({n, t, at}) => (
  <div style={{position: 'absolute', left: 60, top: 280, width: 120, height: 120, borderRadius: 99, background: C.signature, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: '#fff', transform: `scale(${pop(t, at)})`, boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>{n}</div>
);
const Panel: React.FC<{top: number; h: number; k: number; children: React.ReactNode; border?: string}> = ({top, h, k, children, border = 'rgba(255,255,255,0.12)'}) => (
  <div style={{position: 'absolute', left: 80, right: 80, top, height: h, borderRadius: 40, background: 'rgba(255,255,255,0.05)', border: `3px solid ${border}`, transform: `translateY(${(1 - k) * 80}px)`, opacity: clamp01(k * 2), overflow: 'hidden'}}>{children}</div>
);

// ---------------- S1: hook ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const b = A.news;
  const pour = ramp(t, 0.5, 2.6);
  const away = ease((t - A.days + 0.1) / 0.5);
  const fallK = ease((t - A.faint) / 0.45);
  const sh = shakeAt(t, A.faint + 0.3, 0.5, 14);
  const headAt = wordAt('মাথাব্যথা');
  return (
    <Stage t={t} a={0} b={b} noFadeIn>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #4A3C8C 0%, #B98AC8 45%, #FFC7A8 70%, rgba(0,0,0,0) 72%)', opacity: 0.55 * (1 - away * 0.6)}} />
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: -200 + ((t * 30 + i * 400) % 1400), top: 640 + i * 70, width: 600, height: 44, borderRadius: 40, background: 'rgba(255,255,255,0.10)', filter: 'blur(6px)'}} />)}
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        {/* pour */}
        <div style={{opacity: 1 - away, transform: `translateX(${-away * 300}px) scale(${1 - away * 0.3})`}}>
          <div style={{position: 'absolute', left: 560, top: 300, transform: `rotate(${lerp(0, -62, ease(t / 0.6)) * (1 - ramp(t, 2.6, 3.2))}deg)`, transformOrigin: '50% 60%'}}><Pot w={210} /></div>
          {pour > 0 && pour < 1 && <div style={{position: 'absolute', left: 538, top: 420, width: 14, height: 330, borderRadius: 7, background: C.sap}} />}
          <div style={{position: 'absolute', left: 430, top: 680}}><Glass w={230} fill={pour} /></div>
          <Center top={1060}><Chip size={40} bg="rgba(255,199,168,0.2)" color="#FFD7BE">শীতের সকাল · কাঁচা রস</Chip></Center>
        </div>
        {/* a few days later */}
        {t > A.days - 0.2 && (
          <>
            <div style={{position: 'absolute', left: 90, top: 300, transform: `scale(${pop(t, A.days)})`}}>
              <div style={{width: 380, borderRadius: 26, overflow: 'hidden', background: '#F5F7FF', boxShadow: '0 16px 34px rgba(0,0,0,0.4)'}}>
                <div style={{height: 56, background: C.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 30, color: '#fff'}}>ক্যালেন্ডার</div>
                <div style={{height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 50, color: C.ink, whiteSpace: 'nowrap'}}>কয়েক দিন পর</div>
              </div>
            </div>
            <div style={{position: 'absolute', left: 760, top: 430, transform: `scale(${pop(t, A.fever - 0.1)})`}}><Thermo level={ramp(t, A.fever, A.fever + 1.4) * 0.9} /></div>
            {t > headAt - 0.1 && <div style={{position: 'absolute', left: 620, top: 340}}><Sticker t={t} at={headAt} text="মাথাব্যথা" color={C.warn} textColor={C.ink} rotate={6} size={40} /></div>}
            {/* bed */}
            <div style={{position: 'absolute', left: 180, top: 1060, width: 720, height: 70, borderRadius: 20, background: '#E9EEF8', opacity: ramp(t, A.faint - 0.2, A.faint + 0.2)}}>
              <div style={{position: 'absolute', left: 0, top: -70, width: 26, height: 150, borderRadius: 10, background: '#9FB4E6'}} />
              <div style={{position: 'absolute', left: 40, top: -26, width: 160, height: 40, borderRadius: 20, background: '#fff'}} />
            </div>
            <div style={{position: 'absolute', left: 400, top: lerp(560, 760, fallK), transformOrigin: '50% 90%', transform: `rotate(${-82 * fallK}deg) scale(${pop(t, A.days + 0.2)})`}}>
              <Bean kind="abbu" size={230} t={t} mood={t > A.faint ? 'sleep' : 'worried'} bounce={t > A.faint ? 0 : 0.6} />
            </div>
            {t > A.faint && <Center top={1180}><Sticker t={t} at={A.faint + 0.25} text="অজ্ঞান!" color={C.danger} rotate={-5} size={58} /></Center>}
          </>
        )}
      </div>
    </Stage>
  );
};

// ---------------- S2: the January case ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.news, b = A.follow;
  const card = pop(t, a + 0.2);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><Sticker t={t} at={a + 0.05} text="আসল ঘটনা, এ বছরের" color={C.signature} rotate={-3} size={52} /></Center>
      <div style={{position: 'absolute', left: 100, right: 100, top: 470, padding: '40px 44px', borderRadius: 34, background: '#F5F7FF', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', transform: `translateY(${(1 - card) * 300}px) rotate(${(1 - card) * -6}deg)`, opacity: clamp01(card * 2)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <svg width="46" height="56" viewBox="0 0 24 30"><path d="M12 0a10 10 0 0 0-10 10c0 8 10 20 10 20s10-12 10-20A10 10 0 0 0 12 0z" fill={C.danger} /><circle cx="12" cy="10" r="4" fill="#fff" /></svg>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: '#6B6890'}}>রাজশাহী · জানুয়ারি ২০২৬</div>
        </div>
        <div style={{marginTop: 22, fontFamily: FONT_BN, fontWeight: 800, fontSize: 62, lineHeight: 1.3, color: C.ink}}>কাঁচা রস খাওয়ার পর নিপাহে আক্রান্ত</div>
        <div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, opacity: ramp(t, A.died - 0.1, A.died + 0.3)}}>
          <div style={{width: 16, height: 16, borderRadius: 99, background: C.danger}} />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 50, color: C.danger}}>একজনের মৃত্যু</div>
        </div>
      </div>
      {t > A.who - 0.1 && (
        <div style={{position: 'absolute', left: 520, top: 920, transform: `rotate(-8deg) scale(${lerp(1.6, 1, pop(t, A.who, {damping: 11, stiffness: 260}))})`, opacity: ramp(t, A.who, A.who + 0.12)}}>
          <div style={{width: 400, padding: '22px 20px', borderRadius: 26, border: `7px solid ${C.rose}`, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, color: C.rose, background: 'rgba(18,11,36,0.75)'}}>
            <div style={{fontSize: 34}}>নিশ্চিত করেছে</div>
            <div style={{fontSize: 44, lineHeight: 1.2}}>বিশ্ব স্বাস্থ্য সংস্থা</div>
          </div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S3: follow ----------------
const S3: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.puzzle;
  const on = ease((t - A.follow_word) / 0.3);
  const card = pop(t, a + 0.3);
  const bell = t > A.follow_word ? Math.sin((t - A.follow_word) * 22) * 18 * Math.max(0, 1 - (t - A.follow_word) / 0.9) : 0;
  const br = BRAND[platform];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 400, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}>
        <Title size={80}>শীতের দরকারি</Title>
        <Title size={80} color={C.sap}>সতর্কতা, এখানে</Title>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 720, padding: 36, borderRadius: 44, background: '#1E1538', border: '2px solid rgba(139,108,255,0.5)', boxShadow: '0 30px 70px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', gap: 28, transform: `translateY(${(1 - card) * 400}px)`, opacity: clamp01(card * 1.5)}}>
        <div style={{width: 120, height: 120, borderRadius: 999, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 60, color: '#fff'}}>{br.initial}</div>
        <div style={{flex: 1}}>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.text}}>{br.name}</div>
          <div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 30, color: C.muted}}>{br.sub}</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
          <svg width="52" height="52" viewBox="0 0 24 24" style={{transform: `rotate(${bell}deg)`}}><path d="M12 2a6 6 0 0 0-6 6v4l-2 3h16l-2-3V8a6 6 0 0 0-6-6zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z" fill={on > 0.5 ? C.signature : C.muted} /></svg>
          <Toggle on={on} w={124} />
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 26, color: on > 0.5 ? C.signature : C.muted}}>{on > 0.5 ? br.done : br.btn}</div>
        </div>
      </div>
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={820} />
    </Stage>
  );
};

// ---------------- S4: it looked clean ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.puzzle, b = A.night;
  const scan = ramp(t, A.where - 0.3, A.where + 1.2);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={330}><div style={{transform: `scale(${pop(t, a + 0.1)})`}}><Glass w={300} fill={1} /></div></Center>
      {[0, 1, 2].map((i) => {
        const p = (t * 1.3 + i * 0.33) % 1;
        return <div key={i} style={{position: 'absolute', left: [400, 640, 520][i], top: [380, 460, 640][i], width: 36, height: 36, transform: `scale(${Math.sin(Math.PI * p)}) rotate(45deg)`, background: '#fff', borderRadius: 4}} />;
      })}
      {t > wordAt('পরিষ্কারই', a) - 0.1 && <Center top={790}><Sticker t={t} at={wordAt('পরিষ্কারই', a)} text="দেখতে পরিষ্কার" color={C.good} textColor={C.ink} rotate={-3} size={54} /></Center>}
      {t > A.where - 0.3 && (
        <div style={{position: 'absolute', left: lerp(300, 620, scan), top: 420 + Math.sin(scan * 6) * 40, opacity: ramp(t, A.where - 0.3, A.where)}}>
          <svg width="180" height="180" viewBox="0 0 100 100"><circle cx="42" cy="42" r="30" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="8" /><line x1="64" y1="64" x2="92" y2="92" stroke="#fff" strokeWidth="12" strokeLinecap="round" /></svg>
        </div>
      )}
      {t > A.where && <Center top={960}><Sticker t={t} at={A.where + 0.4} text="ভাইরাস এল কোথা থেকে?" color={C.rose} rotate={3} size={54} /></Center>}
    </Stage>
  );
};

// ---------------- S5: night at the palm tree, then morning ----------------
const STATS = A.stats + 0.6;
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.night, b = STATS;
  const dawn = ease((t - A.morning) / 1.2);
  const fly = ease((t - A.dark - 0.1) / (A.bat - A.dark + 0.5));
  const away = ease((t - A.morning - 0.1) / 1.0);
  const batX = lerp(lerp(1000, 460, fly), 1150, away), batY = lerp(lerp(260, 570, fly), 200, away);
  const sal = ramp(t, A.saliva, A.saliva + 1.4);
  const lower = ease((t - A.morning - 0.4) / 0.8);
  const glassIn = pop(t, A.glass - 0.6);
  const glassFill = ramp(t, A.glass - 0.5, A.glass + 0.4);
  return (
    <Stage t={t} a={a} b={b}>
      {/* sky */}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0B0820 0%, #1B1240 60%, #2A1A52 100%)'}} />
      <div style={{position: 'absolute', inset: 0, opacity: dawn, background: 'linear-gradient(180deg, #5A4A9C 0%, #C48BC0 45%, #FFC0A0 75%, #2A1A52 100%)'}} />
      {Array.from({length: 26}).map((_, i) => <div key={i} style={{position: 'absolute', left: (i * 211) % 1040 + 20, top: 260 + ((i * 97) % 520), width: 6, height: 6, borderRadius: 9, background: '#fff', opacity: (0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i))) * (1 - dawn)}} />)}
      <div style={{position: 'absolute', left: 800, top: 300, width: 130, height: 130, borderRadius: 99, background: '#F5F0D6', boxShadow: '0 0 60px rgba(245,240,214,0.6)', opacity: 1 - dawn}}>
        <div style={{position: 'absolute', left: 34, top: -6, width: 130, height: 130, borderRadius: 99, background: '#151033', opacity: 0.0}} />
      </div>
      <div style={{position: 'absolute', left: 760, top: lerp(820, 380, dawn), width: 150, height: 150, borderRadius: 99, background: C.gold, boxShadow: '0 0 80px rgba(255,194,77,0.8)', opacity: dawn}} />
      {/* tree and pot */}
      <div style={{position: 'absolute', left: 60, top: 460}}><PalmTree t={t} h={1000} /></div>
      <div style={{position: 'absolute', left: 360, top: lerp(600, 980, lower), transform: `scale(${pop(t, a + 0.3)})`}}>
        <Pot w={190} glow={sal * (1 - lower)} dots={sal} t={t} />
        {t < A.morning && <div style={{position: 'absolute', left: 92, top: -30 + ((t * 80) % 40), width: 12, height: 18, borderRadius: 9, background: C.sap}} />}
      </div>
      {t < A.morning + 0.2 && <div style={{position: 'absolute', left: 470, top: 610, width: 6, height: lerp(0, 0, 0), background: '#E7C48A'}} />}
      {/* bat */}
      {t > A.dark - 0.1 && (
        <div style={{position: 'absolute', left: batX - 90, top: batY - 60, transform: `rotate(${t < A.bat ? -10 : 0}deg)`}}>
          <Bat size={180} t={t} flap={t > A.bat + 0.2 && t < A.morning ? 0.15 : 1} />
        </div>
      )}
      {/* saliva drops */}
      {t > A.saliva && t < A.morning && [0, 1, 2].map((i) => {
        const p = ((t - A.saliva) * 1.4 + i / 3) % 1;
        return <div key={i} style={{position: 'absolute', left: 440 + i * 22, top: 600 + p * 60, width: 14, height: 14, borderRadius: 9, background: C.rose, opacity: 1 - p}} />;
      })}
      {t > A.saliva + 0.2 && t < A.morning && <div style={{position: 'absolute', left: 620, top: 720}}><Sticker t={t} at={A.saliva + 0.3} text="লালা মিশে যায়" color={C.rose} rotate={-4} size={44} /></div>}
      {/* virus callout */}
      {t > A.virus - 0.1 && t < A.morning + 0.3 && (
        <div style={{position: 'absolute', left: 560, top: 860, display: 'flex', alignItems: 'center', gap: 18, padding: '16px 30px 16px 16px', borderRadius: 999, background: 'rgba(18,11,36,0.85)', border: `3px solid ${C.rose}`, transform: `scale(${pop(t, A.virus)})`, opacity: 1 - ramp(t, A.morning, A.morning + 0.3)}}>
          <Virus size={90} t={t} />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 48, color: C.text}}>নিপাহ ভাইরাস</div>
        </div>
      )}
      {/* morning glass */}
      {t > A.glass - 0.7 && (
        <div style={{position: 'absolute', left: 660, top: 860, transform: `scale(${glassIn})`}}><Glass w={210} fill={glassFill} dots={glassFill} t={t} /></div>
      )}
      {t > A.glass - 0.2 && <Center top={1180}><Sticker t={t} at={A.glass - 0.1} text="সেই রসই আমাদের গ্লাসে!" color={C.rose} rotate={-3} size={50} /></Center>}
      <div style={{position: 'absolute', left: 80, top: 290, opacity: ramp(t, a + 0.2, a + 0.5)}}>
        <Chip size={36} bg="rgba(255,255,255,0.1)">{t < A.morning ? 'রাত · খেজুর গাছ' : 'সকাল'}</Chip>
      </div>
    </Stage>
  );
};

// ---------------- S6: 348 cases, half with raw sap ----------------
const S6: React.FC<{t: number}> = ({t}) => {
  const a = STATS - 0.1, b = A.iedcr;
  const ring = ease((t - A.half) / 0.9) * 0.5;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><div style={{transform: `scale(${pop(t, a + 0.1)})`}}><Chip size={44} bg={C.signature}>২০০১ থেকে এখন পর্যন্ত</Chip></div></Center>
      {t > A.n348 - 0.4 && (
        <Center top={430}><Odometer t={t} at={A.n348 - 0.3} dur={1.4} target={348} pattern="000" size={200} color={C.text} /></Center>
      )}
      {t > A.n348 && <Center top={680}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.sap, opacity: ramp(t, A.n348 + 0.6, A.n348 + 1)}}>জন নিপাহে আক্রান্ত</div></Center>}
      {t > A.half - 0.2 && (
        <div style={{position: 'absolute', left: 120, right: 120, top: 830, display: 'flex', alignItems: 'center', gap: 40, opacity: ramp(t, A.half - 0.2, A.half + 0.2)}}>
          <svg width="230" height="230" viewBox="0 0 100 100" style={{transform: 'rotate(-90deg)', flexShrink: 0}}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="16" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={C.sap} strokeWidth="16" strokeDasharray={251.3} strokeDashoffset={251.3 * (1 - ring)} />
          </svg>
          <div>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.text, lineHeight: 1.1}}>প্রায় অর্ধেক</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.muted, lineHeight: 1.3}}>কাঁচা রস খাওয়ার ইতিহাস</div>
          </div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S7: 71 of 100 die; no medicine, no vaccine ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.iedcr, b = A.todo;
  const filled = Math.round(71 * ease((t - A.n71) / 1.4));
  const vacAt = A.vaccine;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><div style={{transform: `scale(${pop(t, a + 0.05)})`}}><Chip size={40} bg="rgba(255,255,255,0.1)">আইইডিসিআর বলছে</Chip></div></Center>
      <div style={{position: 'absolute', left: 260, top: 400, width: 560, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 12}}>
        {Array.from({length: 100}).map((_, i) => <div key={i} style={{width: 44, height: 44, borderRadius: 99, background: i < filled ? C.rose : 'rgba(255,255,255,0.14)', transform: `scale(${i < filled ? 1 : 0.85})`}} />)}
      </div>
      {t > A.n71 && <Center top={980}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 62, color: C.text, opacity: ramp(t, A.n71, A.n71 + 0.4)}}>১০০ জনে প্রায় <span style={{color: C.rose}}>৭১ জন</span> মারা যান</div></Center>}
      {t > A.nocure - 0.1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1110, display: 'flex', justifyContent: 'center', gap: 30}}>
          {[{text: 'অনুমোদিত ওষুধ', at: wordAt('ওষুধ', A.nocure)}, {text: 'টিকা', at: vacAt}].map((c, i) => (
            <div key={i} style={{position: 'relative', transform: `scale(${pop(t, c.at - 0.15)})`}}>
              <Chip size={46} bg="rgba(255,92,138,0.18)" color={C.text}>{c.text} নেই</Chip>
              <svg width="70" height="70" viewBox="0 0 24 24" style={{position: 'absolute', right: -24, top: -30, opacity: ramp(t, c.at + 0.2, c.at + 0.4)}}><circle cx="12" cy="12" r="11" fill={C.danger} /><path d="M7 7l10 10M17 7L7 17" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
            </div>
          ))}
        </div>
      )}
    </Stage>
  );
};

// ---------------- S8: what to do ----------------
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.todo, b = A.k1;
  const threeAt = wordAt('তিনটা', a);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={420}><Title size={96}>তাহলে কী করবেন?</Title></Center>
      <div style={{position: 'absolute', left: 0, right: 0, top: 660, display: 'flex', justifyContent: 'center', gap: 40}}>
        {['১', '২', '৩'].map((n, i) => (
          <div key={i} style={{width: 170, height: 170, borderRadius: 99, background: [C.sap, C.good, C.rose][i], border: '8px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 100, color: C.ink, transform: `scale(${pop(t, threeAt + i * 0.15)})`}}>{n}</div>
        ))}
      </div>
    </Stage>
  );
};

// ---------------- R1: no raw sap; boil it ----------------
const R1: React.FC<{t: number}> = ({t}) => {
  const a = A.k1, b = A.k2;
  const noAt = wordAt('খাবেন', a);
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="১" t={t} at={a} />
      <Panel top={430} h={400} k={pop(t, a + 0.1)} border={C.danger}>
        <div style={{position: 'absolute', left: 60, top: 50}}><Glass w={200} fill={1} /></div>
        <div style={{position: 'absolute', left: 340, top: 110, fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.text, lineHeight: 1.2}}>কাঁচা রস<br /><span style={{color: C.danger}}>খাবেন না</span></div>
        <div style={{position: 'absolute', left: 30, top: 160, width: 260}}><Scribble t={t} at={noAt} w={260} h={90} /></div>
      </Panel>
      <Panel top={880} h={400} k={pop(t, wordAt('খেতে', a) - 0.1)} border={C.good}>
        <div style={{position: 'absolute', left: 70, top: 120}}><Pot w={170} /></div>
        <div style={{position: 'absolute', left: 80, top: 290}}><Fire t={t} size={150} /></div>
        {t > A.boil - 0.3 && <Steam t={t} x={140} y={110} />}
        <div style={{position: 'absolute', left: 340, top: 110, fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.text, lineHeight: 1.2}}>খেতে চাইলে<br /><span style={{color: C.good}}>ফুটিয়ে নিন</span></div>
      </Panel>
    </Stage>
  );
};

// ---------------- R2: no bat-bitten fruit; wash fruit ----------------
const R2: React.FC<{t: number}> = ({t}) => {
  const a = A.k2, b = A.k3;
  const noAt = wordAt('খাবেন', a);
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="২" t={t} at={a} />
      <Panel top={430} h={400} k={pop(t, a + 0.1)} border={C.danger}>
        <div style={{position: 'absolute', left: 60, top: 90}}><Fruit size={220} /></div>
        <div style={{position: 'absolute', left: 190, top: 40, transform: 'scale(0.6)'}}><Bat size={160} t={t} flap={0.3} /></div>
        <div style={{position: 'absolute', left: 340, top: 80, fontFamily: FONT_BN, fontWeight: 800, fontSize: 58, color: C.text, lineHeight: 1.25}}>বাদুড়ে খাওয়া বা<br />আধা খাওয়া ফল<br /><span style={{color: C.danger}}>খাবেন না</span></div>
        <div style={{position: 'absolute', left: 40, top: 170, width: 260}}><Scribble t={t} at={noAt} w={260} h={90} /></div>
      </Panel>
      <Panel top={880} h={400} k={pop(t, A.wash - 1.0)} border={C.good}>
        <div style={{position: 'absolute', left: 60, top: 110}}><Fruit size={210} bite={false} /></div>
        {Array.from({length: 6}).map((_, i) => {
          const p = ((t * 1.6 + i / 6) % 1);
          return <div key={i} style={{position: 'absolute', left: 90 + (i % 3) * 60, top: 40 + p * 200, width: 18, height: 26, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: C.info, opacity: (1 - p) * ramp(t, A.wash - 0.8, A.wash - 0.4)}} />;
        })}
        <div style={{position: 'absolute', left: 340, top: 110, fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.text, lineHeight: 1.2}}>ফল ভালো করে<br /><span style={{color: C.good}}>ধুয়ে খান</span></div>
      </Panel>
    </Stage>
  );
};

// ---------------- R3: symptoms -> hospital, tell the doctor ----------------
const R3: React.FC<{t: number}> = ({t}) => {
  const a = A.k3, b = A.share;
  const sy = [
    {text: 'জ্বর', at: A.symptoms},
    {text: 'মাথাব্যথা', at: wordAt('মাথাব্যথা', A.symptoms)},
    {text: 'বমি', at: wordAt('বমি', A.symptoms)},
    {text: 'খিঁচুনি', at: wordAt('খিঁচুনি', A.symptoms)},
  ];
  const docK = pop(t, A.doctor - 0.1);
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="৩" t={t} at={a} />
      <div style={{position: 'absolute', left: 210, top: 300, opacity: ramp(t, a + 0.2, a + 0.6)}}>
        <Chip size={40} bg="rgba(255,255,255,0.1)">রস খাওয়ার কয়েক দিনের মধ্যে</Chip>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 440, display: 'flex', flexWrap: 'wrap', gap: 22, justifyContent: 'center'}}>
        {sy.map((s, i) => {
          const k = pop(t, s.at - 0.1);
          return <div key={i} style={{transform: `scale(${0.6 + 0.4 * k})`, opacity: 0.25 + 0.75 * clamp01(k)}}><Chip size={56} bg={k > 0.5 ? C.warn : 'rgba(255,255,255,0.08)'} color={k > 0.5 ? C.ink : C.text}>{s.text}</Chip></div>;
        })}
      </div>
      {t > A.hospital - 0.6 && (
        <div style={{position: 'absolute', left: 100, top: 690, display: 'flex', alignItems: 'center', gap: 30, transform: `scale(${pop(t, A.hospital - 0.4)})`}}>
          <Hospital size={230} />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.text, lineHeight: 1.2}}>দেরি না করে<br /><span style={{color: C.good}}>হাসপাতালে</span></div>
        </div>
      )}
      {t > A.doctor - 0.2 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 960, opacity: clamp01(docK * 2)}}>
          <div style={{position: 'absolute', left: 130, top: 20}}><Bean kind="abbu" size={150} t={t} mood="worried" /></div>
          <div style={{position: 'absolute', left: 760, top: 20}}><Bean kind="doctor" size={150} t={t} mood="neutral" phase={1} /></div>
          <div style={{position: 'absolute', left: 300, top: 10, width: 440, padding: '18px 24px', borderRadius: 26, borderBottomLeftRadius: 6, background: '#F5F7FF', fontFamily: FONT_BN, fontWeight: 800, fontSize: 38, lineHeight: 1.3, color: C.ink, transform: `scale(${docK})`, transformOrigin: 'bottom left'}}>
            "আমি কাঁচা রস খেয়েছিলাম"
          </div>
          <div style={{position: 'absolute', left: 340, top: 170}}><Chip size={30} bg="rgba(38,198,218,0.2)">ডাক্তারকে বলুন</Chip></div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S10: send it to the village ----------------
const S10: React.FC<{t: number}> = ({t}) => {
  const a = A.share, b = A.question;
  const people: {kind: 'ammu' | 'abbu' | 'bon'; label: string; x: number; y: number}[] = [
    {kind: 'ammu', label: 'দাদি', x: 700, y: 400},
    {kind: 'abbu', label: 'আব্বু', x: 760, y: 700},
    {kind: 'bon', label: 'ছোট বোন', x: 640, y: 1000},
  ];
  const src = {x: 330, y: 820};
  const sendAt = wordAt('পাঠান', a);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, top: 300, width: 560}}>
        <Title size={56}>গ্রামের বাড়িতে</Title>
        <Title size={56} color={C.sap}>রসের অপেক্ষায়</Title>
      </div>
      <div style={{position: 'absolute', left: 200, top: 620, transform: `scale(${pop(t, a + 0.2)})`}}>
        <Phone w={250} h={440} tilt={-6}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: 96, height: 96, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="42" height="42" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg></div>
          </div>
        </Phone>
      </div>
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        {people.map((p, i) => {
          const tx = p.x + 40, ty = p.y + 110;
          const cx = (src.x + tx) / 2, cy = Math.min(src.y, ty) - 140;
          const draw = ease((t - sendAt - i * 0.15) / 0.6);
          const len = 900;
          const u = ((t - sendAt) * 0.9 + i * 0.3) % 1;
          const bx = (1 - u) * (1 - u) * src.x + 2 * (1 - u) * u * cx + u * u * tx;
          const by = (1 - u) * (1 - u) * src.y + 2 * (1 - u) * u * cy + u * u * ty;
          return (
            <g key={i}>
              <path d={`M ${src.x} ${src.y} Q ${cx} ${cy} ${tx} ${ty}`} fill="none" stroke={C.signature} strokeWidth="6" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} strokeLinecap="round" opacity="0.8" />
              {draw >= 1 && <circle cx={bx} cy={by} r="12" fill={C.sap} />}
            </g>
          );
        })}
      </svg>
      {people.map((p, i) => (
        <div key={i} style={{position: 'absolute', left: p.x, top: p.y, transform: `scale(${pop(t, a + 0.6 + i * 0.3)})`, textAlign: 'center'}}>
          <Bean kind={p.kind} size={130} t={t} mood="happy" phase={i} />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 30, color: C.text}}>{p.label}</div>
        </div>
      ))}
    </Stage>
  );
};

// ---------------- S11: comment question, follow, key line ----------------
const S11: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.question, br = BRAND[platform];
  const on = ease((t - A.cta_word) / 0.3);
  const msg = 'গত শীতে, গ্রামে গিয়ে';
  const typeP = ramp(t, A.comment - 0.2, A.comment + 0.9);
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="শেষ কবে কাঁচা রস খেয়েছিলেন?" color={C.sap} textColor={C.ink} rotate={-3} size={52} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} />
          <div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.text}}>
            {t > A.comment - 0.2 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}
            <span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span>
          </div>
        </div>
        <div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div>
      </div>
      <div style={{position: 'absolute', left: 150, right: 150, top: 720, padding: '18px 26px', borderRadius: 999, background: '#1E1538', border: '2px solid rgba(139,108,255,0.5)', display: 'flex', alignItems: 'center', gap: 20, opacity: ramp(t, A.cta, A.cta + 0.4)}}>
        <div style={{width: 64, height: 64, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 34, color: '#fff'}}>{br.initial}</div>
        <div style={{flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.text}}>{br.name}</div>
        <Toggle on={on} w={104} />
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 28, color: on > 0.5 ? C.signature : C.muted, minWidth: 150}}>{on > 0.5 ? br.done : br.btn}</div>
      </div>
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={760} />
      {t > keyAt - 0.1 && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 900, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}>
          <div style={{position: 'relative', display: 'inline-block', width: 220, height: 310}}>
            <div style={{position: 'absolute', left: 25, top: 30}}><Pot w={170} /></div>
            <div style={{position: 'absolute', left: 35, top: 190}}><Fire t={t} size={150} /></div>
            <Steam t={t} x={95} y={20} />
          </div>
          <Title size={96}>রস খান ফুটিয়ে</Title>
        </div>
      )}
    </Stage>
  );
};

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [
    {from: A.news, to: A.follow, text: 'সূত্র: WHO, ৬ ফেব্রুয়ারি ২০২৬'},
    {from: A.night, to: STATS, text: 'সূত্র: আইইডিসিআর, WHO'},
    {from: STATS, to: A.iedcr, text: 'সূত্র: WHO, Al Jazeera/Reuters'},
    {from: A.iedcr, to: A.todo, text: 'সূত্র: আইইডিসিআর (জাগো নিউজ)'},
    {from: A.k1, to: A.share, text: 'পরামর্শ: WHO, আইইডিসিআর'},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      <Background t={t} blueprint={0} />
      <S1 t={t} />
      <S2 t={t} />
      <S3 t={t} platform={platform} />
      <S4 t={t} />
      <S5 t={t} />
      <S6 t={t} />
      <S7 t={t} />
      <S8 t={t} />
      <R1 t={t} />
      <R2 t={t} />
      <R3 t={t} />
      <S10 t={t} />
      <S11 t={t} platform={platform} />
      <Vignette t={t} at={A.faint + 0.2} />
      <Iris t={t} at={A.night} x={W / 2} y={800} />
      <Iris t={t} at={A.todo} x={W / 2} y={800} />
      <BrandPill platform={platform} />
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
