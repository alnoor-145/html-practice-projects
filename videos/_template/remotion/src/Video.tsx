import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Iris, LabelExample, Odometer, Phone, Platform,
  Scribble, SourcePill, Stage, Sticker, Title, W, WORDS, clamp01, ease, pop, ramp, shakeAt, useFonts, useT,
} from './lib';

// TEMPLATE (copied from video 006). Copy this folder for a new video, then replace the scenes below.
// One render serves both Facebook and YouTube: FollowCard / FollowPill / BrandPill show both channels.

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

// ---------------- drawings ----------------
const Monitor: React.FC<{w?: number; glow?: string}> = ({w = 120, glow = C.info}) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 100 80">
    <rect x="6" y="4" width="88" height="56" rx="6" fill="#1B2240" stroke="#9FB4E6" strokeWidth="4" />
    <rect x="14" y="12" width="72" height="40" rx="3" fill={glow} opacity="0.35" />
    <rect x="42" y="60" width="16" height="10" fill="#9FB4E6" /><rect x="28" y="70" width="44" height="6" rx="3" fill="#9FB4E6" />
  </svg>
);
const Snow: React.FC<{size?: number}> = ({size = 70}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><g stroke={C.info} strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" /></g></svg>
);
const Plane: React.FC<{size?: number}> = ({size = 70}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="#fff" /></svg>
);
const Compound: React.FC<{w?: number; t: number}> = ({w = 640, t}) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 200 124">
    <rect x="30" y="20" width="140" height="80" rx="4" fill="#2A2342" />
    {Array.from({length: 4}).map((_, r) => Array.from({length: 6}).map((__, c) => (
      <rect key={r + '-' + c} x={40 + c * 21} y={28 + r * 17} width="14" height="10" rx="1.5" fill={(r * 6 + c + Math.floor(t * 3)) % 7 === 0 ? '#FFE9A8' : '#4A3F7A'} />
    )))}
    <rect x="0" y="96" width="200" height="28" fill="#1A1530" />
    {Array.from({length: 21}).map((_, i) => <rect key={i} x={i * 9.6} y="70" width="3" height="40" fill="#8A93B2" />)}
    <path d="M0 72 H200" stroke="#8A93B2" strokeWidth="2" />
    {Array.from({length: 22}).map((_, i) => <path key={'w' + i} d={`M${i * 9.2} 68 l4 -4 l4 4`} fill="none" stroke="#C9CDE0" strokeWidth="1.4" />)}
    <rect x="86" y="80" width="28" height="30" rx="2" fill="#3A2F5A" />
    <g transform="translate(92 86)"><rect x="0" y="6" width="16" height="12" rx="2" fill={C.gold} /><path d="M3 6 V3 a5 5 0 0 1 10 0 V6" fill="none" stroke={C.gold} strokeWidth="2.4" /></g>
  </svg>
);
const Embassy: React.FC<{size?: number}> = ({size = 180}) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 100 85">
    <path d="M10 30 L50 8 L90 30 Z" fill="#E9EEF8" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={18 + i * 19} y="34" width="8" height="38" fill="#E9EEF8" />)}
    <rect x="8" y="72" width="84" height="8" rx="2" fill="#E9EEF8" />
    <line x1="50" y1="8" x2="50" y2="-14" stroke="#C9CDE0" strokeWidth="2.4" />
    <rect x="50" y="-14" width="22" height="13" fill="#0B7A4B" /><circle cx="59" cy="-7.5" r="3.6" fill="#E2283C" />
  </svg>
);
const IdCard: React.FC<{w?: number; title: string; color: string; sub?: string}> = ({w = 420, title, color, sub}) => (
  <div style={{width: w, height: w * 0.6, borderRadius: 26, background: '#F5F7FF', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden', position: 'relative'}}>
    <div style={{height: w * 0.16, background: color, display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 800, fontSize: w * 0.07, color: '#fff'}}>{title}</div>
    <div style={{position: 'absolute', left: 22, top: w * 0.22, width: w * 0.22, height: w * 0.27, borderRadius: 12, background: '#C9CDE0'}} />
    {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: w * 0.32, top: w * 0.24 + i * w * 0.08, width: w * (0.55 - i * 0.12), height: w * 0.035, borderRadius: 9, background: '#C9CDE0'}} />)}
    {sub && <div style={{position: 'absolute', left: 22, bottom: 14, fontFamily: FONT_BN, fontWeight: 700, fontSize: w * 0.055, color: '#6B6890'}}>{sub}</div>}
  </div>
);
const Flag: React.FC<{color: string}> = ({color}) => (
  <svg width="90" height="100" viewBox="0 0 30 34"><line x1="5" y1="2" x2="5" y2="33" stroke="#E9EEF8" strokeWidth="2.6" strokeLinecap="round" /><path d="M6 3 h20 l-5 6 l5 6 h-20 z" fill={color} /></svg>
);
const NumBadge: React.FC<{n: string; t: number; at: number}> = ({n, t, at}) => (
  <div style={{position: 'absolute', left: 60, top: 280, width: 120, height: 120, borderRadius: 99, background: C.danger, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: '#fff', transform: `scale(${pop(t, at)})`, boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>{n}</div>
);

// ---------------- S1: the job ad ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const b = A.land;
  return (
    <Stage t={t} a={0} b={b} noFadeIn>
      <div style={{position: 'absolute', left: 100, right: 100, top: 300, borderRadius: 36, background: '#F5F7FF', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', padding: '30px 36px', transform: `scale(${pop(t, 0.05)}) rotate(${(1 - pop(t, 0.05)) * -6}deg)`}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 34, color: C.danger}}>জরুরি নিয়োগ · বিদেশে চাকরি</div>
        </div>
        <div style={{marginTop: 8, fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.ink}}>কম্পিউটার অপারেটর</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10, fontFamily: FONT_BN, fontWeight: 800, color: C.good}}>
          <span style={{fontSize: 60}}>$</span>
          <Odometer t={t} at={0.25} dur={1.4} target={800} pattern="000" size={78} color={C.good} />
          <span style={{fontSize: 60}}>–</span>
          <Odometer t={t} at={0.6} dur={1.4} target={1500} pattern="0,000" size={78} color={C.good} />
          <span style={{fontSize: 40, color: '#6B6890'}}>/মাস</span>
        </div>
        <div style={{display: 'flex', gap: 30, marginTop: 20, alignItems: 'center', opacity: ramp(t, A.ac - 0.3, A.ac)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}><Snow size={56} /><span style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.ink}}>এসি অফিস</span></div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}><Monitor w={70} /><span style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.ink}}>কম্পিউটারে কাজ</span></div>
        </div>
      </div>
      <LabelExample style={{left: 120, top: 260}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', gap: 18}}>
        {['ভিসা ✓', 'টিকিট ✓', 'সব এজেন্সি করবে'].map((c, i) => (
          <div key={i} style={{transform: `scale(${pop(t, A.visa - 0.1 + i * 0.35)})`}}><Chip size={40} bg={i === 2 ? C.signature : 'rgba(255,255,255,0.1)'}>{c}</Chip></div>
        ))}
      </div>
    </Stage>
  );
};

// ---------------- S2: landing in Cambodia; sold to a scam compound ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.land, b = A.follow;
  const fly = ease((t - a) / 1.4);
  const reveal = ease((t - A.cheat + 0.6) / 0.6);
  const sh = shakeAt(t, A.cheat, 0.45, 12);
  const p0 = {x: 200, y: 520}, p1 = {x: 860, y: 420};
  const cx = 530, cy = 260;
  const bx = (1 - fly) * (1 - fly) * p0.x + 2 * (1 - fly) * fly * cx + fly * fly * p1.x;
  const by = (1 - fly) * (1 - fly) * p0.y + 2 * (1 - fly) * fly * cy + fly * fly * p1.y;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        <div style={{opacity: 1 - reveal}}>
          <svg width={W} height={800} style={{position: 'absolute', left: 0, top: 0}}>
            <path d={`M ${p0.x} ${p0.y} Q ${cx} ${cy} ${p1.x} ${p1.y}`} fill="none" stroke={C.signature} strokeWidth="6" strokeDasharray="14 14" />
            <circle cx={p0.x} cy={p0.y} r="18" fill={C.good} /><circle cx={p1.x} cy={p1.y} r="18" fill={C.danger} />
          </svg>
          <div style={{position: 'absolute', left: p0.x - 70, top: p0.y + 30, fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: C.text}}>ঢাকা</div>
          <div style={{position: 'absolute', left: p1.x - 130, top: p1.y + 30, fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: C.text}}>কম্বোডিয়া</div>
          <div style={{position: 'absolute', left: bx - 35, top: by - 35, transform: 'rotate(60deg)'}}><Plane size={70} /></div>
        </div>
        {reveal > 0 && (
          <Center top={360} style={{opacity: reveal, transform: `scale(${lerp(0.8, 1, reveal)})`}}><Compound w={760} t={t} /></Center>
        )}
        {t > A.cheat - 0.2 && <Center top={860}><Sticker t={t} at={A.cheat - 0.1} text="কাজটা মানুষ ঠকানোর!" color={C.danger} rotate={-4} size={56} /></Center>}
        {t > A.sold - 0.2 && (
          <Center top={1010} style={{transform: `scale(${pop(t, A.sold - 0.1)})`}}>
            <Chip size={40} bg="rgba(255,77,109,0.2)">বিক্রি করে দেওয়া হয় সাইবার স্ক্যাম কম্পাউন্ডে</Chip>
          </Center>
        )}
      </div>
    </Stage>
  );
};

// ---------------- S3: follow ----------------
const S3: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.june;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}>
        <Title size={80}>বিদেশে যাওয়ার আগে</Title>
        <Title size={80} color={C.good}>জানা দরকার, এখানে</Title>
      </div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};

// ---------------- S4: 221 in four days ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.june, b = A.months18;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="খবরে এসেছে" color={C.signature} rotate={-3} size={54} /></Center>
      <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', gap: 20, opacity: ramp(t, a + 0.3, a + 0.6)}}>
        <Chip size={44} bg="rgba(255,255,255,0.1)">জুন ২০২৬</Chip>
        <Chip size={44} bg={C.warn} color={C.ink}>মাত্র ৪ দিনে</Chip>
      </div>
      {t > A.n221 - 1.3 && <Center top={600}><Odometer t={t} at={A.n221 - 1.2} dur={1.4} target={221} pattern="000" size={220} color={C.text} /></Center>}
      {t > A.n221 - 0.1 && <Center top={880}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 62, color: C.good, opacity: ramp(t, A.n221, A.n221 + 0.3)}}>জন বাংলাদেশি ফিরেছেন</div></Center>}
    </Stage>
  );
};

// ---------------- S5: ~16,000 cleared, 1,000+ trapped ----------------
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.months18, b = A.fee;
  const N = 96, trapped = 6;
  const shown = Math.floor(ramp(t, A.n16k - 0.6, A.n16k + 1.2) * N);
  const flip = ramp(t, A.n1000 - 0.1, A.n1000 + 0.8);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, right: 90, top: 300, display: 'flex', alignItems: 'baseline', gap: 16, opacity: ramp(t, a, a + 0.4)}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.text}}>১৮ মাসে</div>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.info}}>~১৬,০০০</div>
        <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.muted}}>ছাড়পত্র</div>
      </div>
      <div style={{position: 'absolute', left: 150, top: 430, width: 780, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12}}>
        {Array.from({length: N}).map((_, i) => {
          const isTrap = [5, 17, 30, 44, 58, 71].includes(i);
          const red = isTrap && flip > (trapped ? [5, 17, 30, 44, 58, 71].indexOf(i) / trapped : 0);
          return <div key={i} style={{width: 50, height: 50, borderRadius: 12, background: red ? C.danger : 'rgba(77,212,255,0.35)', opacity: i < shown ? 1 : 0.06, transform: `scale(${red ? 1.12 : 1}) rotateY(${red ? 180 : 0}deg)`}} />;
        })}
      </div>
      {t > A.brac - 0.2 && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 990, display: 'flex', alignItems: 'center', gap: 18, opacity: ramp(t, A.brac - 0.2, A.brac + 0.2)}}>
          <div style={{width: 46, height: 46, borderRadius: 12, background: C.danger}} />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 52, color: C.text}}>১,০০০+ আটকা স্ক্যাম সেন্টারে</div>
        </div>
      )}
      {t > A.brac && <div style={{position: 'absolute', left: 156, top: 1068, opacity: ramp(t, A.brac, A.brac + 0.3)}}><Chip size={30} bg="rgba(255,255,255,0.08)" color={C.muted}>ব্র্যাকের হিসাব · প্রতীকী ছবি</Chip></div>}
    </Stage>
  );
};

// ---------------- S6: broker fee ----------------
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.fee, b = A.how;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 120, top: 330, transform: `scale(${pop(t, a + 0.1)})`}}><Bean kind="scammer" size={220} t={t} /></div>
      <div style={{position: 'absolute', left: 420, top: 380}}><Sticker t={t} at={a + 0.4} text="দালালের ফি" color={C.danger} rotate={-4} size={60} /></div>
      {t > A.n5lakh - 1.0 && (
        <Center top={720}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 6, fontFamily: FONT_BN, fontWeight: 800, color: C.gold}}>
            <span style={{fontSize: 120}}>৳</span>
            <Odometer t={t} at={A.n5lakh - 0.9} dur={1.2} target={500000} pattern="0,00,000" size={140} color={C.gold} />
            <span style={{fontSize: 100}}>+</span>
          </div>
        </Center>
      )}
    </Stage>
  );
};

// ---------------- S7: three red flags ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.how, b = A.k1;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={400}><Title size={96}>কীভাবে বাঁচবেন?</Title></Center>
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, display: 'flex', justifyContent: 'center', gap: 60}}>
        {['১', '২', '৩'].map((n, i) => (
          <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pop(t, A.red + i * 0.18)})`}}>
            <Flag color={C.danger} />
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.text}}>{n}</div>
          </div>
        ))}
      </div>
      {t > A.red + 0.3 && <Center top={940}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.danger, opacity: ramp(t, A.red + 0.3, A.red + 0.7)}}>তিনটা লাল সংকেত</div></Center>}
    </Stage>
  );
};

// ---------------- R1: the job titles + unusual pay ----------------
const R1: React.FC<{t: number}> = ({t}) => {
  const a = A.k1, b = A.k2;
  const jobs = [{at: a + 0.3, text: 'কম্পিউটার অপারেটর'}, {at: A.typist, text: 'টাইপিস্ট'}, {at: A.callc, text: 'কল সেন্টার'}];
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="১" t={t} at={a} />
      <div style={{position: 'absolute', left: 220, top: 300, display: 'flex', flexDirection: 'column', gap: 20}}>
        {jobs.map((j, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, transform: `translateX(${(1 - pop(t, j.at)) * 120}px)`, opacity: clamp01(pop(t, j.at) * 2)}}>
            <Monitor w={90} glow={C.danger} />
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text}}>{j.text}</div>
          </div>
        ))}
      </div>
      {t > A.highpay - 0.2 && <Center top={730}><Sticker t={t} at={A.highpay} text="+ অস্বাভাবিক বেশি বেতন" color={C.warn} textColor={C.ink} rotate={-3} size={52} /></Center>}
      {t > A.embassy - 0.3 && (
        <div style={{position: 'absolute', left: 110, right: 110, top: 900, display: 'flex', alignItems: 'center', gap: 26, padding: '22px 30px', borderRadius: 34, background: 'rgba(255,255,255,0.06)', border: `3px solid ${C.danger}`, transform: `scale(${pop(t, A.embassy - 0.2)})`}}>
          <Embassy size={150} />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: C.text, lineHeight: 1.3}}>দূতাবাস ঠিক এই চাকরি<br />নিয়েই সতর্ক করেছে</div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- R2: tourist visa promise ----------------
const R2: React.FC<{t: number}> = ({t}) => {
  const a = A.k2, b = A.k3;
  const noAt = A.nopermit;
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="২" t={t} at={a} />
      <Center top={320} style={{transform: `scale(${pop(t, a + 0.3)}) rotate(-4deg)`}}>
        <div style={{position: 'relative'}}>
          <IdCard w={560} title="ট্যুরিস্ট ভিসা" color={C.info} sub="শুধু ভ্রমণের জন্য" />
          <div style={{position: 'absolute', left: 30, top: 130, width: 500}}><Scribble t={t} at={noAt + 0.2} w={500} h={120} /></div>
        </div>
      </Center>
      {t > A.workvisa - 0.6 && (
        <div style={{position: 'absolute', left: 140, top: 720, width: 760, padding: '22px 28px', borderRadius: 30, borderTopLeftRadius: 8, background: '#2B1F4E', transform: `scale(${pop(t, A.workvisa - 0.5)})`, transformOrigin: 'top left'}}>
          <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.muted}}>দালাল বলছে</div>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: C.text}}>"ওখানে গিয়ে কাজের ভিসা হবে"</div>
        </div>
      )}
      {t > noAt && <Center top={960}><Sticker t={t} at={noAt + 0.3} text="ট্যুরিস্ট ভিসায় কাজের অনুমতি থাকে না" color={C.danger} rotate={-2} size={42} /></Center>}
    </Stage>
  );
};

// ---------------- R3: BMET clearance + embassy check ----------------
const R3: React.FC<{t: number}> = ({t}) => {
  const a = A.k3, b = A.verify;
  const countries = [{name: 'কম্বোডিয়া', at: wordAt('কম্বোডিয়া,', A.govt)}, {name: 'লাওস', at: wordAt('লাওস', A.govt)}, {name: 'ব্রাজিল', at: wordAt('ব্রাজিলে', A.govt)}];
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="৩" t={t} at={a} />
      <Center top={320} style={{transform: `scale(${pop(t, a + 0.3)})`}}>
        <div style={{position: 'relative'}}>
          <IdCard w={520} title="বিএমইটি ছাড়পত্র" color={C.good} sub="বিদেশে কাজের অনুমতি" />
          <div style={{position: 'absolute', right: -30, top: -30, width: 100, height: 100, borderRadius: 99, background: C.good, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(t, a + 1.2)})`}}>
            <svg viewBox="0 0 40 40" width="60" height="60"><path d="M8 21 L17 30 L33 11" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </Center>
      {t > wordAt('ছাড়া', a) && <Center top={660}><Sticker t={t} at={wordAt('ছাড়া', a)} text="ছাড়পত্র ছাড়া বিদেশে কাজে নয়" color={C.danger} rotate={-3} size={44} /></Center>}
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', gap: 18}}>
        {countries.map((c, i) => <div key={i} style={{transform: `scale(${pop(t, c.at - 0.1)})`}}><Chip size={44} bg="rgba(255,138,61,0.22)">{c.name}</Chip></div>)}
      </div>
      {t > A.check - 0.3 && (
        <Center top={960} style={{transform: `scale(${pop(t, A.check - 0.2)})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '16px 30px', borderRadius: 999, background: '#1E1538', border: `3px solid ${C.gold}`}}>
            <Embassy size={90} />
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: C.text}}>আগে দূতাবাসের যাচাই লাগবে</div>
          </div>
        </Center>
      )}
    </Stage>
  );
};

// ---------------- S8: verify, not the broker ----------------
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.verify, b = A.share;
  const places = [
    {text: 'প্রবাসী কল্যাণ মন্ত্রণালয়', at: wordAt('প্রবাসী', a)},
    {text: 'বিএমইটি', at: wordAt('বিএমইটি', a)},
    {text: 'দূতাবাস', at: wordAt('দূতাবাসে', a)},
  ];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, top: 300, opacity: ramp(t, a, a + 0.4)}}><Title size={72}>অফার পেলে যাচাই করুন</Title></div>
      <div style={{position: 'absolute', left: 110, top: 450, display: 'flex', flexDirection: 'column', gap: 26}}>
        {places.map((p, i) => {
          const k = pop(t, p.at - 0.1);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, transform: `translateX(${(1 - k) * -120}px)`, opacity: clamp01(k * 2)}}>
              <div style={{width: 76, height: 76, borderRadius: 20, background: C.good, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 40 40" width="50" height="50"><path d="M8 21 L17 30 L33 11" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text}}>{p.text}</div>
            </div>
          );
        })}
      </div>
      {t > A.dalal - 0.2 && (
        <div style={{position: 'absolute', left: 110, top: 880, display: 'flex', alignItems: 'center', gap: 22, transform: `scale(${pop(t, A.dalal - 0.1)})`, transformOrigin: 'left center'}}>
          <div style={{width: 76, height: 76, borderRadius: 20, background: C.danger, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 40 40" width="46" height="46"><path d="M10 10 L30 30 M30 10 L10 30" stroke="#fff" strokeWidth="6" strokeLinecap="round" /></svg></div>
          <div style={{position: 'relative', fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text}}>দালালের কথায়<div style={{position: 'absolute', left: 0, top: '50%', width: 360}}><Scribble t={t} at={A.dalal + 0.3} w={360} h={60} /></div></div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S9: share ----------------
const S9: React.FC<{t: number}> = ({t}) => {
  const a = A.share, b = A.question;
  const people: {kind: 'abbu' | 'bhai' | 'you'; label: string; x: number; y: number}[] = [
    {kind: 'abbu', label: 'মামা', x: 700, y: 400},
    {kind: 'bhai', label: 'চাচাতো ভাই', x: 760, y: 700},
    {kind: 'you', label: 'এলাকার বড় ভাই', x: 640, y: 1000},
  ];
  const src = {x: 330, y: 820};
  const sendAt = wordAt('পাঠান', a);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, top: 300, width: 600}}>
        <Title size={56}>বিদেশে কাজের অফার</Title>
        <Title size={56} color={C.good}>পেয়েছে যারা</Title>
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
              {draw >= 1 && <circle cx={bx} cy={by} r="12" fill={C.good} />}
            </g>
          );
        })}
      </svg>
      {people.map((p, i) => (
        <div key={i} style={{position: 'absolute', left: p.x, top: p.y, transform: `scale(${pop(t, a + 0.5 + i * 0.3)})`, textAlign: 'center'}}>
          <Bean kind={p.kind} size={130} t={t} mood="happy" phase={i} />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: 'nowrap'}}>{p.label}</div>
        </div>
      ))}
    </Stage>
  );
};

// ---------------- S10: question + follow + key line ----------------
const S10: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.question;
  const on = ease((t - A.cta_word) / 0.3);
  const msg = 'হ্যাঁ, আমাদের এলাকার একজন';
  const typeP = ramp(t, A.comment - 0.2, A.comment + 0.9);
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="পরিচিত কেউ ফাঁদে পড়েছেন?" color={C.warn} textColor={C.ink} rotate={-3} size={54} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} />
          <div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 32, color: C.text}}>
            {t > A.comment - 0.2 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}
            <span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span>
          </div>
        </div>
        <div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div>
      </div>
      <FollowPill t={t} at={A.cta_word} platform={platform} top={700} opacity={ramp(t, A.cta, A.cta + 0.4)} />
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={760} />
      {t > keyAt - 0.1 && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 1000, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}>
          <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 46, color: C.muted}}>বিদেশে চাকরির আগে</div>
          <Title size={100}>দালাল না, <span style={{color: C.good}}>যাচাই</span></Title>
        </div>
      )}
    </Stage>
  );
};

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [
    {from: A.land, to: A.follow, text: 'সূত্র: Prothom Alo, The Star'},
    {from: A.june, to: A.months18, text: 'সূত্র: ঢাকা ট্রিবিউন'},
    {from: A.months18, to: A.how, text: 'সূত্র: TBS, ব্র্যাক'},
    {from: A.k1, to: A.k2, text: 'সূত্র: দূতাবাসের সতর্কতা (The Star)'},
    {from: A.k3, to: A.verify, text: 'সূত্র: TBS'},
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
      <R1 t={t} />
      <R2 t={t} />
      <R3 t={t} />
      <S8 t={t} />
      <S9 t={t} />
      <S10 t={t} platform={platform} />
      <Iris t={t} at={A.june} x={W / 2} y={800} />
      <Iris t={t} at={A.how} x={W / 2} y={800} />
      <BrandPill platform={platform} />
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
