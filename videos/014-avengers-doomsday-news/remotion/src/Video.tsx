import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, BRAND, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FONT, FONT_BN, Iris, Odometer, Platform,
  SourcePill, Stage, Sticker, Title, Toggle, W, WORDS, clamp01, ease, pop, ramp, sceneO, shakeAt, useFonts, useT,
} from './lib';

// Video 014: Avengers: Doomsday news. Own graphics only: no trailer frames, posters, logos, character art or actor photos.

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

// ---------------- small drawings (our own) ----------------
const Seats: React.FC<{t: number; top: number}> = ({t, top}) => (
  <div style={{position: 'absolute', left: -40, right: -40, top}}>
    {[0, 1, 2].map((r) => (
      <div key={r} style={{display: 'flex', justifyContent: 'center', gap: 14 + r * 6, marginTop: r ? -10 : 0, transform: `scale(${1 + r * 0.18})`}}>
        {Array.from({length: 9 - r}).map((_, i) => (
          <div key={i} style={{position: 'relative', width: 104, height: 80, borderRadius: '30px 30px 10px 10px', background: r === 2 ? '#0D0619' : r === 1 ? '#160C2A' : '#1E1236', boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.06)'}}>
            {(i + r) % 3 === 0 && <div style={{position: 'absolute', left: 30, top: -34 + Math.sin(t * 2 + i) * 2, width: 44, height: 44, borderRadius: 99, background: r === 2 ? '#0D0619' : '#1A0F2F'}} />}
          </div>
        ))}
      </div>
    ))}
  </div>
);

const FlagUS: React.FC<{w?: number}> = ({w = 96}) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 96 60" style={{borderRadius: 6, boxShadow: '0 4px 10px rgba(0,0,0,0.35)'}}>
    {Array.from({length: 7}).map((_, i) => <rect key={i} x="0" y={i * 8.6} width="96" height="4.3" fill="#D63C4A" />)}
    <rect x="0" y="0" width="96" height="60" fill="none" />
    {Array.from({length: 7}).map((_, i) => <rect key={'w' + i} x="0" y={i * 8.6 + 4.3} width="96" height="4.3" fill="#F5F7FF" />)}
    <rect x="0" y="0" width="42" height="30" fill="#2F4A9E" />
    {Array.from({length: 12}).map((_, i) => <circle key={'s' + i} cx={6 + (i % 4) * 10} cy={6 + Math.floor(i / 4) * 9} r="2" fill="#fff" />)}
  </svg>
);
const FlagIN: React.FC<{w?: number}> = ({w = 96}) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 96 60" style={{borderRadius: 6, boxShadow: '0 4px 10px rgba(0,0,0,0.35)'}}>
    <rect width="96" height="20" fill="#FF9A3C" /><rect y="20" width="96" height="20" fill="#F5F7FF" /><rect y="40" width="96" height="20" fill="#2EA35A" />
    <circle cx="48" cy="30" r="7" fill="none" stroke="#24308C" strokeWidth="2" />
  </svg>
);
const FlagUK: React.FC<{w?: number}> = ({w = 96}) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 96 60" style={{borderRadius: 6, boxShadow: '0 4px 10px rgba(0,0,0,0.35)'}}>
    <rect width="96" height="60" fill="#24357A" />
    <path d="M0 0 L96 60 M96 0 L0 60" stroke="#fff" strokeWidth="12" /><path d="M0 0 L96 60 M96 0 L0 60" stroke="#D63C4A" strokeWidth="4" />
    <path d="M48 0 V60 M0 30 H96" stroke="#fff" strokeWidth="18" /><path d="M48 0 V60 M0 30 H96" stroke="#D63C4A" strokeWidth="10" />
  </svg>
);
const FlagBD: React.FC<{w?: number; t: number}> = ({w = 260, t}) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 100 60" style={{borderRadius: 10, boxShadow: '0 14px 30px rgba(0,0,0,0.45)', transform: `skewY(${Math.sin(t * 3) * 2}deg)`}}>
    <rect width="100" height="60" fill="#0B7A4B" /><circle cx="45" cy="30" r="12" fill="#E2283C" />
  </svg>
);
const Globe: React.FC<{t: number; size?: number}> = ({t, size = 200}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="#1E2A6E" stroke={C.info} strokeWidth="3" />
    {[0, 1, 2, 3].map((i) => {
      const ph = ((t * 0.25 + i / 4) % 1) * Math.PI;
      const rx = Math.abs(Math.cos(ph)) * 46;
      return <ellipse key={i} cx="50" cy="50" rx={rx} ry="46" fill="none" stroke="rgba(77,212,255,0.45)" strokeWidth="1.6" />;
    })}
    {[-28, 0, 28].map((y) => <ellipse key={y} cx="50" cy={50 + y} rx={Math.sqrt(46 * 46 - y * y)} ry="5" fill="none" stroke="rgba(77,212,255,0.45)" strokeWidth="1.6" />)}
  </svg>
);
const Clapper: React.FC<{size?: number; open?: number}> = ({size = 180, open = 0}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
    <rect x="12" y="38" width="76" height="50" rx="6" fill="#241A3D" stroke="#fff" strokeWidth="3" />
    <line x1="22" y1="56" x2="78" y2="56" stroke="rgba(255,255,255,0.4)" strokeWidth="3" /><line x1="22" y1="70" x2="62" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
    <g transform={`rotate(${-22 * open} 12 36)`}>
      <rect x="12" y="24" width="76" height="13" rx="3" fill="#fff" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${20 + i * 18} 24 l9 0 l-6 13 l-9 0 z`} fill="#241A3D" />)}
    </g>
  </svg>
);
const FilmFrame: React.FC<{title: string; year: string; k: number; color: string}> = ({title, year, k, color}) => (
  <div style={{position: 'relative', width: 380, padding: '40px 26px', borderRadius: 18, background: '#0F0A1E', border: `3px solid ${color}`, transform: `scale(${k}) rotate(${(1 - k) * -8}deg)`, opacity: clamp01(k * 2), textAlign: 'center'}}>
    {[0, 1].map((r) => (
      <div key={r} style={{position: 'absolute', left: 16, right: 16, [r ? 'bottom' : 'top']: 10, display: 'flex', justifyContent: 'space-between'}}>
        {Array.from({length: 8}).map((_, i) => <div key={i} style={{width: 22, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.18)'}} />)}
      </div>
    ))}
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.text, lineHeight: 1.15}}>{title}</div>
    <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color}}>{year}</div>
  </div>
);
const Ticket: React.FC<{w: number; color: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({w, color, children, style}) => (
  <div style={{position: 'relative', width: w, height: w * 0.42, borderRadius: 18, background: color, boxShadow: '0 10px 24px rgba(0,0,0,0.35)', ...style}}>
    <div style={{position: 'absolute', left: -16, top: '50%', marginTop: -16, width: 32, height: 32, borderRadius: 99, background: C.bg}} />
    <div style={{position: 'absolute', right: -16, top: '50%', marginTop: -16, width: 32, height: 32, borderRadius: 99, background: C.bg}} />
    <div style={{position: 'absolute', right: w * 0.24, top: 12, bottom: 12, borderLeft: '4px dashed rgba(255,255,255,0.45)'}} />
    {children}
  </div>
);
const Cradle: React.FC<{size?: number}> = ({size = 220}) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 100 50" style={{overflow: 'visible'}}>
    <path d="M6 8 Q50 60 94 8" fill="#3B2A63" stroke="#8E7BD1" strokeWidth="3" />
    <path d="M10 46 Q50 56 90 46" fill="none" stroke="#8E7BD1" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
const Popcorn: React.FC<{size?: number; t: number}> = ({size = 150, t}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{overflow: 'visible'}}>
    {[[22, 30], [38, 18], [55, 14], [72, 22], [84, 34], [30, 40], [62, 34], [48, 30]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y - Math.abs(Math.sin(t * 3 + i)) * 3} r="11" fill="#FFF3D6" stroke="#F0C870" strokeWidth="2" />
    ))}
    <path d="M14 40 L86 40 L76 118 L24 118 Z" fill="#fff" />
    {[0, 1, 2].map((i) => <path key={i} d={`M${24 + i * 22} 40 L${36 + i * 22} 40 L${34 + i * 18} 118 L${26 + i * 18} 118 Z`} fill={C.danger} />)}
  </svg>
);
const Bell: React.FC<{t: number; at: number; size?: number; color?: string}> = ({t, at, size = 60, color = C.gold}) => {
  const r = t > at ? Math.sin((t - at) * 22) * 18 * Math.max(0, 1 - (t - at) / 1.0) : 0;
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `rotate(${r}deg)`}}><path d="M12 2a6 6 0 0 0-6 6v4l-2 3h16l-2-3V8a6 6 0 0 0-6-6zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z" fill={color} /></svg>;
};
const NameCard: React.FC<{name: string; label: string; color: string; k: number; size?: number}> = ({name, label, color, k, size = 64}) => (
  <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '26px 46px', borderRadius: 34, background: 'rgba(255,255,255,0.06)', border: `3px solid ${color}`, boxShadow: `0 0 50px ${color}55`, transform: `translateY(${(1 - k) * 60}px) scale(${0.9 + 0.1 * k})`, opacity: clamp01(k * 2)}}>
    <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color}}>{label}</div>
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: 'nowrap'}}>{name}</div>
  </div>
);

// ---------------- S1: hook — the hero becomes the villain ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const b = A.q;
  const vil = wordAt('ভিলেন');
  const titleAt = wordAt('Avengers:');
  const flip = ease((t - vil + 0.05) / 0.5);
  const sh = shakeAt(t, vil + 0.2, 0.5, 14);
  const screenIn = ease((t - 0.05) / 0.6);
  const glow = flip > 0.5 ? C.doom : '#E8823A';
  return (
    <Stage t={t} a={0} b={b} noFadeIn>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        {/* the screen */}
        <div style={{position: 'absolute', left: 80, right: 80, top: 300, height: 520, perspective: 1400}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 26, overflow: 'hidden', transform: `rotateX(6deg) scale(${lerp(0.9, 1, screenIn)})`, opacity: screenIn, boxShadow: `0 0 140px ${glow}88`}}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #9C2133 0%, #E59A35 100%)', opacity: 1 - flip}} />
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0C3426 0%, #2DB86C 100%)', opacity: flip}} />
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)'}} />
          </div>
          {/* flipping name card on the screen */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center', perspective: 1200}}>
            <div style={{position: 'relative', width: 700, height: 330, transformStyle: 'preserve-3d', transform: `rotateY(${flip * 180}deg) scale(${pop(t, 0.35)})`}}>
              <div style={{position: 'absolute', inset: 0, borderRadius: 30, background: 'rgba(20,11,38,0.82)', border: '3px solid #FFD39A', backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
                <Chip size={34} bg={C.gold} color={C.ink}>হিরো</Chip>
                <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.text}}>Robert Downey Jr.</div>
                <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: '#FFD39A'}}>পৃথিবী বাঁচিয়েছিলেন</div>
              </div>
              <div style={{position: 'absolute', inset: 0, borderRadius: 30, background: 'rgba(8,24,17,0.88)', border: `3px solid ${C.doom}`, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
                <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 112, color: C.doom, lineHeight: 1.1}}>এবার ভিলেন</div>
                <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C.text}}>Robert Downey Jr.</div>
              </div>
            </div>
          </div>
        </div>
        {/* film title */}
        {t > titleAt - 0.1 && (
          <Center top={870}>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 78, color: C.text, letterSpacing: lerp(18, 2, ease((t - titleAt) / 0.6)), opacity: ramp(t, titleAt, titleAt + 0.3), textShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>Avengers: Doomsday</div>
          </Center>
        )}
        {t > wordAt('ফাইনাল') - 0.1 && (
          <Center top={1000}>
            <Sticker t={t} at={wordAt('ফাইনাল')} text="ফাইনাল ট্রেলার এসেছে!" color={C.danger} rotate={-4} size={60} />
          </Center>
        )}
        <Seats t={t} top={1130} />
      </div>
    </Stage>
  );
};

// ---------------- S2: three questions + one minute ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.q, b = A.follow;
  const rows: {at: number; text: string; color: string; icon: React.ReactNode}[] = [
    {at: wordAt('কবে', a), text: 'কবে আসছে?', color: C.signature, icon: <svg width="52" height="52" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="#fff" strokeWidth="2.2" /><path d="M3 10h18M8 3v4M16 3v4" stroke="#fff" strokeWidth="2.2" /></svg>},
    {at: wordAt('কে', a), text: 'কে কে থাকছে?', color: C.cap, icon: <svg width="56" height="52" viewBox="0 0 26 24"><circle cx="8" cy="8" r="4" fill="#fff" /><circle cx="18" cy="8" r="4" fill="#fff" /><path d="M1 21a7 7 0 0 1 14 0zM11 21a7 7 0 0 1 14 0z" fill="#fff" /></svg>},
    {at: wordAt('বাংলাদেশে', a), text: 'বাংলাদেশে কবে?', color: '#0B7A4B', icon: <svg width="60" height="40" viewBox="0 0 30 20"><rect width="30" height="20" rx="3" fill="#0B7A4B" stroke="#fff" strokeWidth="1.5" /><circle cx="13.5" cy="10" r="4.5" fill="#E2283C" /></svg>},
  ];
  const minAt = wordAt('এক', a + 3);
  const sweep = ease((t - minAt) / 1.3);
  return (
    <Stage t={t} a={a} b={b}>
      {rows.map((r, i) => {
        const k = pop(t, r.at - 0.1);
        return (
          <div key={i} style={{position: 'absolute', left: 130, top: 330 + i * 175, display: 'flex', alignItems: 'center', gap: 28, transform: `translateX(${(1 - k) * -120}px)`, opacity: clamp01(k * 2)}}>
            <div style={{width: 120, height: 120, borderRadius: 34, background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>{r.icon}</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 76, color: C.text}}>{r.text}</div>
          </div>
        );
      })}
      {t > minAt - 0.1 && (
        <Center top={900} style={{transform: `scale(${pop(t, minAt - 0.1)})`}}>
          <div style={{position: 'relative', width: 260, height: 260}}>
            <svg width="260" height="260" viewBox="0 0 100 100" style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}>
              <circle cx="50" cy="50" r="44" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
              <circle cx="50" cy="50" r="44" fill="none" stroke={C.gold} strokeWidth="7" strokeLinecap="round" strokeDasharray={276.5} strokeDashoffset={276.5 * (1 - sweep)} />
            </svg>
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 84, color: C.text, lineHeight: 1}}>১</div>
              <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.gold}}>মিনিটে সব</div>
            </div>
          </div>
        </Center>
      )}
    </Stage>
  );
};

// ---------------- S3: mid-video follow ----------------
const S3: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.dates;
  const on = ease((t - A.follow_word) / 0.3);
  const card = pop(t, a + 0.3);
  const bell = t > A.follow_word ? Math.sin((t - A.follow_word) * 22) * 18 * Math.max(0, 1 - (t - A.follow_word) / 0.9) : 0;
  const br = BRAND[platform];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 400, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}>
        <Title size={78}>সিনেমার নতুন খবর</Title>
        <Title size={78} color={C.gold}>সবার আগে, এখানে</Title>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 720, padding: 36, borderRadius: 44, background: '#1E1236', border: '2px solid rgba(139,108,255,0.5)', boxShadow: '0 30px 70px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', gap: 28, transform: `translateY(${(1 - card) * 400}px)`, opacity: clamp01(card * 1.5)}}>
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

// ---------------- S4: release dates ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.dates, b = A.dir;
  const rows = [
    {at: A.d18, day: '১৮', country: 'আমেরিকা', flag: <FlagUS />, chip: 'মূল মুক্তি', main: true},
    {at: A.d17, day: '১৭', country: 'ভারত', flag: <FlagIN />, chip: 'একদিন আগে', main: false},
    {at: A.d16, day: '১৬', country: 'যুক্তরাজ্য', flag: <FlagUK />, chip: 'দুই দিন আগে', main: false},
  ];
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290} style={{transform: `scale(${pop(t, a + 0.05)})`}}><Globe t={t} size={190} /></Center>
      {rows.map((r, i) => {
        const k = pop(t, r.at - 0.35);
        return (
          <div key={i} style={{position: 'absolute', left: 110, right: 110, top: 520 + i * 200, height: 170, borderRadius: 34, background: r.main ? 'rgba(139,108,255,0.16)' : 'rgba(255,255,255,0.05)', border: `3px solid ${r.main ? C.signature : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', gap: 30, padding: '0 28px', transform: `translateX(${(1 - k) * 160}px)`, opacity: clamp01(k * 2)}}>
            <div style={{width: 124, height: 136, borderRadius: 20, overflow: 'hidden', background: '#F5F7FF', boxShadow: '0 8px 18px rgba(0,0,0,0.35)', flexShrink: 0}}>
              <div style={{height: 38, background: C.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 24, color: '#fff'}}>ডিসেম্বর</div>
              <div style={{height: 98, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 74, color: C.ink}}>{r.day}</div>
            </div>
            <div style={{flex: 1}}>
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.text, lineHeight: 1.1}}>{r.country}</div>
              <Chip size={28} bg={r.main ? C.signature : 'rgba(255,255,255,0.1)'}>{r.chip}</Chip>
            </div>
            {r.flag}
          </div>
        );
      })}
    </Stage>
  );
};

// ---------------- S5: directors ----------------
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.dir, b = A.villain;
  const open = t < a + 0.2 ? 0 : t < a + 0.45 ? 1 : 1 - ease((t - a - 0.45) / 0.15);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290} style={{transform: `scale(${pop(t, a)})`}}><Clapper size={200} open={open} /></Center>
      <Center top={530}><NameCard name="Russo Brothers" label="পরিচালক" color={C.gold} k={pop(t, wordAt('Russo', a) - 0.1)} size={74} /></Center>
      <div style={{position: 'absolute', left: 70, right: 70, top: 820, display: 'flex', justifyContent: 'space-between'}}>
        <FilmFrame title="Infinity War" year="২০১৮" k={pop(t, A.iw - 0.1)} color={C.cap} />
        <FilmFrame title="Endgame" year="২০১৯" k={pop(t, A.eg - 0.1)} color={C.signature} />
      </div>
    </Stage>
  );
};

// ---------------- S6: the villain ----------------
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.villain, b = A.evans;
  const typed = 'ডক্টর ডুম';
  const typeK = ramp(t, A.doom - 0.05, A.doom + 0.55);
  const chars = Array.from(typed);
  const sh = shakeAt(t, A.doom + 0.5, 0.5, 18);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        {[0, 1, 2, 3].map((i) => {
          const ph = ((t - a) * 0.6 + i / 4) % 1;
          const r = 120 + ph * 520;
          return <div key={i} style={{position: 'absolute', left: W / 2 - r, top: 620 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `4px solid ${C.doom}`, opacity: (1 - ph) * 0.45}} />;
        })}
        <Center top={380}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: 16, color: C.doom, opacity: ramp(t, a + 0.1, a + 0.5)}}>DOCTOR DOOM</div></Center>
        <Center top={470}>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 170, color: C.text, textShadow: `0 0 50px ${C.doom}`, lineHeight: 1.2}}>
            {chars.slice(0, Math.ceil(chars.length * typeK)).join('')}
            <span style={{opacity: typeK < 1 && Math.sin(t * 14) > 0 ? 1 : 0, color: C.doom}}>|</span>
          </div>
        </Center>
        {t > A.doom + 0.2 && <Center top={720}><Sticker t={t} at={A.doom + 0.5} text="ভিলেন" color={C.doom} textColor={C.ink} rotate={-6} size={62} /></Center>}
        <Center top={880}><NameCard name="Robert Downey Jr." label="এই চরিত্রে" color={C.doom} k={pop(t, A.rdj - 0.15)} size={66} /></Center>
        {t > A.ironman2 - 0.1 && <Center top={1120}><Sticker t={t} at={A.ironman2} text="আমাদের Iron Man!" color={C.gold} textColor={C.ink} rotate={4} size={56} /></Center>}
      </div>
    </Stage>
  );
};

// ---------------- S7: Steve Rogers returns; the baby has grown ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.evans, b = A.team;
  const n1 = pop(t, A.teaser - 0.1), n2 = pop(t, A.grown - 0.1);
  const rail = ease((t - A.teaser) / (A.grown - A.teaser));
  const grow = ease((t - A.grown - 0.2) / 0.9);
  const bigAt = wordAt('বড়', A.grown);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><NameCard name="Chris Evans" label="ফিরছেন" color={C.cap} k={pop(t, a)} size={76} /></Center>
      {t > wordAt('Steve', a) - 0.1 && <Center top={500}><Sticker t={t} at={wordAt('Steve', a)} text="Steve Rogers হয়ে" color={C.cap} rotate={-3} size={50} /></Center>}
      {/* timeline rail */}
      <div style={{position: 'absolute', left: 168, top: 690, width: 8, height: 500, borderRadius: 4, background: 'rgba(255,255,255,0.12)'}} />
      <div style={{position: 'absolute', left: 168, top: 690, width: 8, height: 500 * rail, borderRadius: 4, background: C.cap}} />
      {[{k: n1, y: 690, label: 'প্রথম টিজার', when: 'ডিসেম্বর ২০২৫', note: 'কোলে নবজাতক'}, {k: n2, y: 1000, label: 'ফাইনাল ট্রেলার', when: 'নভেম্বর ২০২৬', note: 'ছেলে এখন বড়'}].map((n, i) => (
        <div key={i} style={{position: 'absolute', left: 140, top: n.y - 32, display: 'flex', alignItems: 'flex-start', gap: 30, opacity: clamp01(n.k * 2), transform: `translateX(${(1 - n.k) * -60}px)`}}>
          <div style={{width: 64, height: 64, borderRadius: 99, background: C.cap, border: '6px solid #fff', flexShrink: 0}} />
          <div>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 50, color: C.text, lineHeight: 1.1}}>{n.label}</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 32, color: C.muted}}>{n.when}</div>
            <div style={{marginTop: 8}}><Chip size={30} bg="rgba(77,139,255,0.22)">{n.note}</Chip></div>
          </div>
        </div>
      ))}
      {/* the baby in a cradle */}
      <div style={{position: 'absolute', left: 690, top: 640, opacity: clamp01(n1 * 2) * (1 - grow), transform: `scale(${n1})`, textAlign: 'center'}}>
        <div style={{position: 'relative', height: 150}}>
          <div style={{position: 'absolute', left: 48, top: -6}}><Bean kind="bhai" size={104} t={t} mood="sleep" bounce={0.2} /></div>
          <div style={{position: 'absolute', left: 0, top: 70}}><Cradle size={220} /></div>
        </div>
      </div>
      {/* grown up, with a height ruler */}
      <div style={{position: 'absolute', left: 700, top: 880, opacity: clamp01(n2 * 2)}}>
        <div style={{position: 'absolute', left: -40, top: 330 - 300 * grow, width: 14, height: 300 * grow, borderRadius: 7, background: C.gold}} />
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: -52, top: 330 - i * 75, width: 38, height: 4, background: 'rgba(255,255,255,0.3)'}} />)}
        <div style={{position: 'absolute', left: 10, top: 330 - (110 + 120 * grow) * 1.4, transformOrigin: 'bottom center'}}>
          <Bean kind="bhai" size={110 + 120 * grow} t={t} mood="happy" />
        </div>
      </div>
      {t > bigAt - 0.1 && <Center top={1215}><Sticker t={t} at={bigAt} text="এখন অনেক বড়!" color={C.gold} textColor={C.ink} rotate={-4} size={46} /></Center>}
    </Stage>
  );
};

// ---------------- S8: the team ----------------
const VIEWS = A.views + 0.8;
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.team, b = VIEWS;
  const xAt = wordAt('এবার', A.xmen - 1.5);
  const cx = W / 2, cy = 760;
  const sats = [
    {at: A.thor, text: 'Thor', bg: C.gold, color: C.ink, x: 270, y: 470},
    {at: A.ff, text: 'Fantastic Four', bg: C.cap, color: '#fff', x: 700, y: 470},
    {at: xAt, text: 'X-Men', bg: C.warn, color: C.ink, x: 540, y: 1060},
  ];
  return (
    <Stage t={t} a={a} b={b}>
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        {sats.map((s, i) => {
          const d = ease((t - s.at) / 0.4);
          return <line key={i} x1={cx} y1={cy} x2={lerp(cx, s.x, d)} y2={lerp(cy, s.y, d)} stroke="rgba(255,255,255,0.35)" strokeWidth="6" strokeDasharray="14 12" />;
        })}
      </svg>
      <div style={{position: 'absolute', left: cx - 230, top: cy - 85, width: 460, height: 170, borderRadius: 999, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${C.signature}`, transform: `scale(${pop(t, a + 0.05)})`, fontFamily: FONT, fontWeight: 800, fontSize: 70, color: '#fff'}}>Avengers</div>
      {sats.map((s, i) => {
        const k = pop(t, s.at);
        return (
          <div key={i} style={{position: 'absolute', left: s.x, top: s.y, transform: `translate(-50%, -50%) scale(${k})`, opacity: clamp01(k * 2)}}>
            <Chip size={58} bg={s.bg} color={s.color} style={{border: '5px solid #fff', boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>{s.text}</Chip>
          </div>
        );
      })}
      {t > xAt + 0.3 && <Center top={1180}><Sticker t={t} at={xAt + 0.4} text="এবার X-Men-ও!" color={C.danger} rotate={-4} size={52} /></Center>}
    </Stage>
  );
};

// ---------------- S9: 50 crore views in 24 hours ----------------
const S9: React.FC<{t: number}> = ({t}) => {
  const a = VIEWS - 0.1, b = A.tickets;
  const at24 = wordAt('২৪', a);
  const odoAt = at24 - 0.1;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300} style={{transform: `scale(${pop(t, a + 0.1)})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{width: 130, height: 130, borderRadius: 999, background: C.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 50px ${C.danger}88`}}><svg width="60" height="60" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg></div>
          <div>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 62, color: C.text, lineHeight: 1.1}}>প্রথম ট্রেলার</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.muted}}>জুলাই ২০২৬</div>
          </div>
        </div>
      </Center>
      {t > at24 - 0.2 && <Center top={520}><div style={{transform: `scale(${pop(t, at24 - 0.1)})`}}><Chip size={46} bg="rgba(255,194,77,0.18)" color={C.gold}>২৪ ঘণ্টায়</Chip></div></Center>}
      {t > odoAt - 0.05 && (
        <Center top={660}>
          <Odometer t={t} at={odoAt} dur={Math.max(0.8, A.v50 - odoAt + 0.2)} target={503000000} pattern="00,00,00,000" size={112} color={C.text} />
        </Center>
      )}
      {t > A.v50 && <Center top={830}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.gold, opacity: ramp(t, A.v50, A.v50 + 0.3)}}>৫০ কোটির বেশি বার দেখা</div></Center>}
      {t > A.disney - 0.1 && <Center top={1000}><Sticker t={t} at={A.disney} text="Disney-র ইতিহাসে সর্বোচ্চ" color={C.gold} textColor={C.ink} rotate={-3} size={54} /></Center>}
    </Stage>
  );
};

// ---------------- S10: advance tickets ----------------
const S10: React.FC<{t: number}> = ({t}) => {
  const a = A.tickets, b = A.bd;
  const n = Math.floor(clamp01((t - a - 0.3) / 3.5) * 7);
  const colors = [C.signature, C.danger, C.cap, C.gold, C.doom, C.warn, C.signature];
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={80}>অগ্রিম টিকিট</Title></Center>
      <Center top={400}>
        <div style={{display: 'flex', gap: 16}}>
          <div style={{transform: `scale(${pop(t, a + 0.3)})`}}><Chip size={34} bg="rgba(255,255,255,0.1)">মুক্তির ৩ মাস আগে</Chip></div>
          {t > wordAt('আমেরিকায়', a) - 0.1 && <div style={{transform: `scale(${pop(t, wordAt('আমেরিকায়', a))})`}}><Chip size={34} bg={C.cap}>শুধু আমেরিকায়</Chip></div>}
        </div>
      </Center>
      <div style={{position: 'absolute', left: W / 2 - 230, top: 560, width: 460, height: 380}}>
        {Array.from({length: 7}).map((_, i) => {
          const k = i <= n ? pop(t, a + 0.3 + (i / 7) * 3.5) : 0;
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: 280 - i * 42, transform: `rotate(${(i % 2 ? 3 : -3) + (1 - k) * 20}deg) translateY(${(1 - k) * -200}px)`, opacity: clamp01(k * 2)}}>
              <Ticket w={460} color={colors[i]}>
                <div style={{position: 'absolute', left: 30, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 40, color: '#fff'}}>ADMIT ONE</div>
              </Ticket>
            </div>
          );
        })}
      </div>
      {t > A.usd - 0.1 && (
        <Center top={980}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: FONT_BN, fontWeight: 800, color: C.text}}>
            <span style={{fontSize: 110}}>$</span>
            <Odometer t={t} at={A.usd - 0.1} dur={0.9} target={50} pattern="00" size={110} />
            <span style={{fontSize: 64}}>মিলিয়ন+</span>
          </div>
        </Center>
      )}
      {t > A.tk600 - 0.1 && <Center top={1160}><Sticker t={t} at={A.tk600} text="≈ ৬০০ কোটি টাকা" color={C.doom} textColor={C.ink} rotate={-3} size={52} /></Center>}
    </Stage>
  );
};

// ---------------- S11: Bangladesh ----------------
const S11: React.FC<{t: number}> = ({t}) => {
  const a = A.bd, b = A.share;
  const card = pop(t, A.star - 0.15);
  const swing = Math.sin((t - A.star) * 4) * 14;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290} style={{transform: `scale(${pop(t, a + 0.05)})`}}><FlagBD t={t} w={250} /></Center>
      <Center top={460}><Title size={84}>বাংলাদেশে কবে?</Title></Center>
      <div style={{position: 'absolute', left: 110, right: 110, top: 610, transform: `translateY(${(1 - card) * 300}px)`, opacity: clamp01(card * 2)}}>
        <div style={{position: 'relative', borderRadius: 34, background: '#F5F7FF', padding: '34px 40px', boxShadow: '0 30px 60px rgba(0,0,0,0.45)'}}>
          <div style={{position: 'absolute', left: -22, top: 150, width: 44, height: 44, borderRadius: 99, background: C.bg}} />
          <div style={{position: 'absolute', right: -22, top: 150, width: 44, height: 44, borderRadius: 99, background: C.bg}} />
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.ink}}>Star Cineplex</div>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#6B6890'}}>Avengers: Doomsday</div>
          <div style={{margin: '22px 0', borderTop: '4px dashed #C9CDE0'}} />
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: '#6B6890'}}>অবস্থা</div>
            <Chip size={36} bg="#0B7A4B" color="#fff">শিগগিরই আসছে</Chip>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20}}>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: '#6B6890'}}>তারিখ</div>
            <div style={{width: 104, height: 104, borderRadius: 99, background: C.warn, border: '6px solid #fff', boxShadow: '0 6px 14px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.ink, transformOrigin: 'top center', transform: `rotate(${swing}deg) scale(${1 + 0.12 * Math.max(0, Math.sin((t - A.nodate) * 6)) * (t > A.nodate && t < A.nodate + 1.2 ? 1 : 0)})`}}>?</div>
          </div>
        </div>
        {t > A.nodate - 0.1 && <div style={{position: 'absolute', right: -10, top: -40}}><Sticker t={t} at={A.nodate + 0.2} text="এখনো ঘোষণা হয়নি" color={C.danger} rotate={6} size={42} /></div>}
      </div>
      {t > A.will_tell - 0.1 && (
        <Center top={1150} style={{transform: `scale(${pop(t, A.will_tell)})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 34px', borderRadius: 999, background: '#1E1236', border: `3px solid ${C.gold}`}}>
            <Bell t={t} at={A.will_tell + 0.1} size={58} />
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: C.text}}>ঘোষণা হলেই জানাব</div>
          </div>
        </Center>
      )}
    </Stage>
  );
};

// ---------------- S12: send it to your Endgame friend ----------------
const S12: React.FC<{t: number}> = ({t}) => {
  const a = A.share, b = A.poll;
  const sendAt = wordAt('পাঠান', a);
  const fly = ease((t - sendAt) / 0.7);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 300, textAlign: 'center'}}>
        <Title size={70}>যে বন্ধুর সাথে</Title>
        <Title size={70} color={C.gold}>Endgame দেখেছিলেন</Title>
      </div>
      <div style={{position: 'absolute', left: 150, top: 640, transform: `scale(${pop(t, a + 0.2)})`, textAlign: 'center'}}>
        <Bean kind="you" size={190} t={t} mood="happy" />
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 36, color: C.text}}>আপনি</div>
      </div>
      <div style={{position: 'absolute', left: 450, top: 820, transform: `scale(${pop(t, a + 0.4)})`}}><Popcorn t={t} size={170} /></div>
      <div style={{position: 'absolute', left: 700, top: 640, transform: `scale(${pop(t, a + 0.6)})`, textAlign: 'center'}}>
        <Bean kind="bhai" size={190} t={t} mood={t > sendAt + 0.7 ? 'happy' : 'neutral'} phase={1} />
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 36, color: C.text}}>বন্ধু</div>
      </div>
      {t > sendAt && fly < 1 && (
        <svg width="80" height="80" viewBox="0 0 24 24" style={{position: 'absolute', left: lerp(300, 720, fly), top: 600 - Math.sin(Math.PI * fly) * 160, transform: 'rotate(-10deg)'}}>
          <path d="M2 21l21-9L2 3v7l15 2-15 2z" fill={C.gold} />
        </svg>
      )}
      {t > sendAt + 0.7 && <Confetti t={t} at={sendAt + 0.7} x={790} y={700} />}
    </Stage>
  );
};

// ---------------- S13: poll ----------------
const S13: React.FC<{t: number}> = ({t}) => {
  const a = A.poll, b = A.cta;
  const capOn = ramp(t, A.cap - 0.1, A.cap + 0.2), doomOn = ramp(t, A.doom2 - 0.1, A.doom2 + 0.2);
  const votes = ease((t - A.doom2 - 0.3) / 1.0);
  const msg = 'আমি ডুমের দলে!';
  const typeP = ramp(t, A.comment - 0.1, A.comment + 0.8);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Sticker t={t} at={a + 0.1} text="আপনি কার জন্য দেখবেন?" color={C.signature} rotate={-3} size={58} /></Center>
      <div style={{position: 'absolute', left: 80, right: 80, top: 470, height: 460, display: 'flex', gap: 24}}>
        {[{on: capOn, name: 'Captain America', color: C.cap, pct: 48}, {on: doomOn, name: 'ডক্টর ডুম', color: C.doom, pct: 52}].map((s, i) => (
          <div key={i} style={{flex: 1, borderRadius: 36, background: `rgba(255,255,255,${0.04 + 0.06 * s.on})`, border: `4px solid ${s.on > 0.5 ? s.color : 'rgba(255,255,255,0.12)'}`, boxShadow: s.on > 0.5 ? `0 0 50px ${s.color}66` : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: 20, transform: `scale(${1 + 0.04 * Math.sin(Math.PI * clamp01(s.on))})`}}>
            <div style={{width: 120, height: 120, borderRadius: 99, background: s.color, opacity: 0.35 + 0.65 * s.on}} />
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.text, textAlign: 'center', lineHeight: 1.15}}>{s.name}</div>
            <div style={{width: '82%', height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
              <div style={{width: `${s.pct * votes}%`, height: '100%', background: s.color}} />
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: W / 2 - 60, top: 640, width: 120, height: 120, borderRadius: 99, background: C.danger, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 46, color: '#fff', transform: `scale(${pop(t, A.cap + 0.3)})`}}>VS</div>
      <div style={{position: 'absolute', left: 150, right: 150, top: 990, padding: '22px 26px', borderRadius: 30, background: '#1E1236', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, A.comment - 0.4, A.comment)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} />
          <div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1C4A', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.text}}>
            {msg.slice(0, Math.ceil(msg.length * typeP))}
            <span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span>
          </div>
        </div>
        <div style={{marginTop: 8, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div>
      </div>
    </Stage>
  );
};

// ---------------- S14: follow + key line ----------------
const S14: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.cta, br = BRAND[platform];
  const on = ease((t - A.cta_word) / 0.3);
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <div style={{position: 'absolute', left: 150, right: 150, top: 420, padding: '18px 26px', borderRadius: 999, background: '#1E1236', border: '2px solid rgba(139,108,255,0.5)', display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${pop(t, a + 0.05)})`}}>
        <div style={{width: 64, height: 64, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 34, color: '#fff'}}>{br.initial}</div>
        <div style={{flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.text}}>{br.name}</div>
        <Toggle on={on} w={104} />
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 28, color: on > 0.5 ? C.signature : C.muted, minWidth: 150}}>{on > 0.5 ? br.done : br.btn}</div>
      </div>
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={460} />
      {t > keyAt - 0.1 && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 640, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}>
          <div style={{display: 'inline-block', width: 230, borderRadius: 28, overflow: 'hidden', background: '#F5F7FF', boxShadow: '0 20px 40px rgba(0,0,0,0.45)'}}>
            <div style={{height: 64, background: C.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 38, color: '#fff'}}>ডিসেম্বর</div>
            <div style={{height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, color: C.ink}}>১৮</div>
          </div>
          <Title size={90} style={{marginTop: 30}}>হলে দেখা হবে</Title>
        </div>
      )}
    </Stage>
  );
};

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const doomGlow = Math.max(sceneO(t, wordAt('ভিলেন') + 0.2, A.q, 0.4) * 0.6, sceneO(t, A.villain, A.evans, 0.3));
  const capGlow = sceneO(t, A.evans, A.team, 0.3);
  const srcs = [
    {from: 0.6, to: A.q, text: 'ফাইনাল ট্রেলার: ২৩ নভেম্বর ২০২৬'},
    {from: A.dates, to: A.dir, text: 'সূত্র: Disney, AnimationXpress, MovieWeb'},
    {from: A.dir, to: A.evans, text: 'সূত্র: Khaleej Times, Rotten Tomatoes'},
    {from: A.evans, to: VIEWS, text: 'সূত্র: Rolling Stone, Variety'},
    {from: VIEWS, to: A.tickets, text: 'সূত্র: Variety, GamesRadar'},
    {from: A.tickets, to: A.bd, text: 'সূত্র: Disney (Business Today)'},
    {from: A.bd, to: A.share, text: 'সূত্র: starcineplex.com'},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      <Background t={t} blueprint={0} />
      <div style={{position: 'absolute', inset: 0, opacity: doomGlow, background: 'radial-gradient(ellipse 80% 55% at 50% 35%, rgba(63,224,138,0.32) 0%, rgba(63,224,138,0) 100%)'}} />
      <div style={{position: 'absolute', inset: 0, opacity: capGlow, background: 'radial-gradient(ellipse 80% 55% at 50% 35%, rgba(77,139,255,0.32) 0%, rgba(77,139,255,0) 100%)'}} />
      <S1 t={t} />
      <S2 t={t} />
      <S3 t={t} platform={platform} />
      <S4 t={t} />
      <S5 t={t} />
      <S6 t={t} />
      <S7 t={t} />
      <S8 t={t} />
      <S9 t={t} />
      <S10 t={t} />
      <S11 t={t} />
      <S12 t={t} />
      <S13 t={t} />
      <S14 t={t} platform={platform} />
      <Iris t={t} at={A.villain} x={W / 2} y={700} />
      <Iris t={t} at={VIEWS} x={W / 2} y={700} />
      <Iris t={t} at={A.bd} x={W / 2} y={700} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, top: 214, fontFamily: FONT_BN, fontWeight: 600, fontSize: 23, color: C.muted, opacity: 0.85}}>ট্রেলারের কোনো দৃশ্য ব্যবহার করা হয়নি · তথ্য: সংবাদমাধ্যম</div>
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
