import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, BRAND, Background, Bean, BrandPill, C, Captions, CheckRow, Chip, Confetti, FONT, FONT_BN, Iris, Odometer, Phone, Platform,
  SourcePill, Stage, Sticker, Title, Toggle, W, WORDS, clamp01, ease, pop, ramp, useFonts, useT,
} from './lib';

// Video 005: count a child's breaths for one minute (WHO fast-breathing cut-offs). Own drawings only.

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
const TimerRing: React.FC<{size?: number; p: number; color?: string; children?: React.ReactNode}> = ({size = 300, p, color = C.good, children}) => (
  <div style={{position: 'relative', width: size, height: size}}>
    <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}>
      <circle cx="50" cy="50" r="44" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" strokeWidth="7" />
      <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={276.5} strokeDashoffset={276.5 * (1 - clamp01(p))} />
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={50 + Math.cos(a) * 34} y1={50 + Math.sin(a) * 34} x2={50 + Math.cos(a) * 37} y2={50 + Math.sin(a) * 37} stroke="rgba(255,255,255,0.4)" strokeWidth="2" />;
      })}
    </svg>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
  </div>
);
// baby in a blanket, chest rising with each breath (rate = breaths per minute)
const Baby: React.FC<{t: number; size?: number; rate?: number; sleep?: boolean; open?: number}> = ({t, size = 320, rate = 30, sleep = true, open = 0}) => {
  const br = 0.5 + 0.5 * Math.sin((t * rate / 60) * Math.PI * 2);
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 160 100" style={{overflow: 'visible'}}>
      <ellipse cx="80" cy="96" rx="70" ry="5" fill="rgba(0,0,0,0.25)" />
      <ellipse cx="36" cy="54" rx="26" ry="25" fill={C.skin} />
      <path d="M14 44 Q20 22 40 26 Q52 28 56 40 Q44 32 30 36 Q20 38 14 44 Z" fill="#2B2440" />
      {sleep ? <g fill="none" stroke={C.eye} strokeWidth="2.4" strokeLinecap="round"><path d="M26 54 Q30 57 34 54" /><path d="M40 54 Q44 57 48 54" /></g> : <><circle cx="30" cy="54" r="2.8" fill={C.eye} /><circle cx="44" cy="54" r="2.8" fill={C.eye} /></>}
      <ellipse cx="26" cy="62" rx="4" ry="2.4" fill="#FF8FA3" opacity="0.6" />
      {/* body under blanket, rising */}
      <g transform={`translate(0 ${-br * 5})`}>
        <path d={`M58 ${44 - br * 4} Q100 ${30 - br * 6} 150 50 Q156 76 140 90 L62 90 Q52 70 58 ${44 - br * 4} Z`} fill={open > 0.5 ? '#F2C7A5' : '#6E56D9'} />
        {open > 0.5 && <path d="M70 62 Q100 54 132 62" fill="none" stroke="#D99A79" strokeWidth="2.4" />}
      </g>
      <path d={`M${lerp(58, 110, open)} 46 Q120 40 150 52 Q158 78 140 92 L${lerp(62, 112, open)} 92 Z`} fill="#8B6CFF" opacity="0.9" />
      {Array.from({length: 4}).map((_, i) => <circle key={i} cx={lerp(90, 128, open) + i * 9} cy={70 + (i % 2) * 8} r="2.6" fill="rgba(255,255,255,0.5)" />)}
    </svg>
  );
};
const Wave: React.FC<{t: number; rate: number; color: string; w?: number; h?: number}> = ({t, rate, color, w = 620, h = 120}) => {
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 6) {
    const y = h / 2 + Math.sin((x / w) * Math.PI * 2 * (rate / 15) - t * rate / 60 * Math.PI * 2) * (h * 0.38);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return <svg width={w} height={h}><polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
};
const Hospital: React.FC<{size?: number}> = ({size = 220}) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 100 90">
    <rect x="10" y="22" width="80" height="66" rx="6" fill="#E9EEF8" />
    <rect x="34" y="4" width="32" height="26" rx="5" fill="#E9EEF8" />
    <path d="M50 9 v16 M42 17 h16" stroke={C.danger} strokeWidth="6" strokeLinecap="round" />
    {[0, 1, 2].map((i) => <rect key={i} x={20 + i * 24} y="40" width="14" height="12" rx="2" fill="#9FB4E6" />)}
    <rect x="42" y="64" width="16" height="24" rx="2" fill="#7A86B8" />
  </svg>
);
const Globe: React.FC<{t: number; size?: number}> = ({t, size = 160}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="#1E2A6E" stroke={C.info} strokeWidth="3" />
    {[0, 1, 2, 3].map((i) => {
      const ph = ((t * 0.25 + i / 4) % 1) * Math.PI;
      return <ellipse key={i} cx="50" cy="50" rx={Math.abs(Math.cos(ph)) * 46} ry="46" fill="none" stroke="rgba(77,212,255,0.45)" strokeWidth="1.6" />;
    })}
    {[-28, 0, 28].map((y) => <ellipse key={y} cx="50" cy={50 + y} rx={Math.sqrt(46 * 46 - y * y)} ry="5" fill="none" stroke="rgba(77,212,255,0.45)" strokeWidth="1.6" />)}
  </svg>
);

// ---------------- S1: hook — a watch and one minute ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const b = A.unicef;
  const p = ramp(t, A.minute, A.minute + 3.6);
  const naki = wordAt('নাকি');
  return (
    <Stage t={t} a={0} b={b} noFadeIn>
      <Center top={300} style={{transform: `scale(${pop(t, 0.1)})`}}>
        <TimerRing size={330} p={p}>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 110, color: C.text, lineHeight: 1}}>{['০০', '১৫', '৩০', '৪৫', '৬০'][Math.min(4, Math.floor(p * 4.999))]}</div>
          <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.good}}>সেকেন্ড</div>
        </TimerRing>
      </Center>
      <Center top={700} style={{transform: `scale(${pop(t, 0.5)})`}}><Baby t={t} size={420} rate={36} /></Center>
      {t > A.cough - 0.1 && t < A.cough + 1.4 && [0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 280 - i * 30, top: 760 + i * 26, width: 60 - i * 10, height: 8, borderRadius: 4, background: '#fff', opacity: Math.sin(Math.PI * ramp(t, A.cough, A.cough + 1.4)), transform: `rotate(${-20 + i * 20}deg)`}} />
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', justifyContent: 'center', gap: 24}}>
        <div style={{transform: `scale(${pop(t, A.cold1 - 0.1)})`}}><Chip size={46} bg="rgba(38,198,218,0.22)">সাধারণ ঠান্ডা?</Chip></div>
        <div style={{transform: `scale(${pop(t, naki)})`}}><Chip size={46} bg="rgba(255,77,109,0.3)">নিউমোনিয়া?</Chip></div>
      </div>
    </Stage>
  );
};

// ---------------- S2: UNICEF numbers ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.unicef, b = A.follow;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><div style={{transform: `scale(${pop(t, a + 0.05)})`}}><Chip size={42} bg="rgba(255,255,255,0.1)">ইউনিসেফ বলছে</Chip></div></Center>
      <div style={{position: 'absolute', left: 90, right: 90, top: 430, textAlign: 'center', opacity: ramp(t, A.killer - 0.6, A.killer)}}>
        <Title size={60}>৫ বছরের কম বয়সী শিশুদের</Title>
        <Title size={74} color={C.danger}>সবচেয়ে বড় সংক্রামক ঘাতক</Title>
        <Title size={92}>নিউমোনিয়া</Title>
      </div>
      {t > A.world - 0.2 && <Center top={790} style={{transform: `scale(${pop(t, A.world - 0.1)})`}}><Globe t={t} size={150} /></Center>}
      {t > A.n725 - 0.3 && <Center top={960}><Odometer t={t} at={A.n725 - 0.2} dur={1.5} target={725000} pattern="0,00,000" size={120} color={C.text} /></Center>}
      {t > A.n725 + 0.6 && <Center top={1110}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: C.muted, opacity: ramp(t, A.n725 + 0.6, A.n725 + 1)}}>শিশু · প্রতি বছর · সারা পৃথিবীতে</div></Center>}
    </Stage>
  );
};

// ---------------- S3: follow ----------------
const S3: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.cold;
  const on = ease((t - A.follow_word) / 0.3);
  const card = pop(t, a + 0.3);
  const bell = t > A.follow_word ? Math.sin((t - A.follow_word) * 22) * 18 * Math.max(0, 1 - (t - A.follow_word) / 0.9) : 0;
  const br = BRAND[platform];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 400, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}>
        <Title size={80}>শিশুর জন্য জরুরি কথা</Title>
        <Title size={80} color={C.good}>সহজ করে, এখানে</Title>
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

// ---------------- S4: normal vs fast breathing ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.cold, b = A.how;
  const lanes = [
    {at: a + 0.2, label: 'সর্দি-কাশি', sub: 'শ্বাস স্বাভাবিক', rate: 28, color: C.good},
    {at: A.fast - 0.1, label: 'নিউমোনিয়া', sub: 'শ্বাস দ্রুত', rate: 70, color: C.danger},
  ];
  return (
    <Stage t={t} a={a} b={b}>
      {lanes.map((l, i) => {
        const k = pop(t, l.at);
        return (
          <div key={i} style={{position: 'absolute', left: 80, right: 80, top: 320 + i * 330, height: 290, borderRadius: 36, background: 'rgba(255,255,255,0.05)', border: `3px solid ${l.color}`, padding: '26px 34px', transform: `translateX(${(1 - k) * (i ? 200 : -200)}px)`, opacity: clamp01(k * 2)}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.text}}>{l.label}</div>
              <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 38, color: l.color}}>{l.sub}</div>
            </div>
            <div style={{marginTop: 22}}><Wave t={t} rate={l.rate} color={l.color} w={780} h={130} /></div>
          </div>
        );
      })}
      {t > A.clock - 0.1 && (
        <Center top={1000} style={{transform: `scale(${pop(t, A.clock)})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '16px 34px', borderRadius: 999, background: '#1E1538', border: `3px solid ${C.gold}`}}>
            <svg width="62" height="62" viewBox="0 0 24 24"><circle cx="12" cy="13" r="9" fill="none" stroke={C.gold} strokeWidth="2.4" /><path d="M12 13V8M10 2h4" stroke={C.gold} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 50, color: C.text}}>ঘড়ি দিয়েই ধরা যায়</div>
          </div>
        </Center>
      )}
    </Stage>
  );
};

// ---------------- S5: how to count ----------------
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.how, b = A.compare;
  const open = ramp(t, A.shirt + 0.2, A.shirt + 0.5);
  const countP = ramp(t, A.count - 0.2, b);
  const tallies = Math.floor(ramp(t, A.chest, b) * 14);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 80, top: 300, display: 'flex', gap: 16, flexWrap: 'wrap', width: 920}}>
        {[{at: a + 0.2, text: 'শান্ত বা ঘুমন্ত'}, {at: A.shirt, text: 'জামা একটু সরিয়ে'}, {at: A.chest, text: 'বুক-পেটের ওঠানামা'}].map((c, i) => (
          <div key={i} style={{transform: `scale(${pop(t, c.at)})`}}><Chip size={38} bg={i === 2 ? C.good : 'rgba(255,255,255,0.1)'} color={i === 2 ? C.ink : C.text}>{c.text}</Chip></div>
        ))}
      </div>
      <Center top={520} style={{transform: `scale(${pop(t, a + 0.1)})`}}><Baby t={t} size={560} rate={32} open={open} /></Center>
      {/* tally marks */}
      <div style={{position: 'absolute', left: 120, top: 920, display: 'flex', gap: 30}}>
        {Array.from({length: Math.ceil(tallies / 5)}).map((_, g) => (
          <svg key={g} width="110" height="90" viewBox="0 0 110 90">
            {Array.from({length: Math.min(5, tallies - g * 5)}).map((__, i) => i < 4
              ? <line key={i} x1={14 + i * 22} y1="10" x2={14 + i * 22} y2="80" stroke={C.text} strokeWidth="7" strokeLinecap="round" />
              : <line key={i} x1="4" y1="70" x2="100" y2="20" stroke={C.gold} strokeWidth="7" strokeLinecap="round" />)}
          </svg>
        ))}
      </div>
      {t > A.count - 0.3 && (
        <div style={{position: 'absolute', left: 760, top: 900, transform: `scale(${pop(t, A.count - 0.2)})`}}>
          <TimerRing size={200} p={countP} color={C.gold}>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: C.text, lineHeight: 1.1, textAlign: 'center'}}>পুরো<br />১ মিনিট</div>
          </TimerRing>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S6: compare by age ----------------
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.compare, b = A.verdict;
  const rows = [
    {at: A.age1, rateAt: A.r60, age: '২ মাসের কম', n: 60},
    {at: A.age2, rateAt: A.r50, age: '২ মাস – ১ বছর', n: 50},
    {at: A.age3 - 0.3, rateAt: A.r40, age: '১ – ৫ বছর', n: 40},
  ];
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><div style={{transform: `scale(${pop(t, a + 0.05)})`}}><Chip size={40} bg={C.signature}>মিনিটে শ্বাস এর বেশি হলে = দ্রুত</Chip></div></Center>
      {rows.map((r, i) => {
        const k = pop(t, r.at - 0.1);
        return (
          <div key={i} style={{position: 'absolute', left: 90, right: 90, top: 430 + i * 240, height: 210, borderRadius: 36, background: 'rgba(255,255,255,0.05)', border: `3px solid ${t > r.rateAt ? C.danger : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', transform: `translateX(${(1 - k) * 200}px)`, opacity: clamp01(k * 2)}}>
            <div>
              <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.muted}}>বয়স</div>
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: 'nowrap'}}>{r.age}</div>
            </div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 6, opacity: ramp(t, r.rateAt - 0.3, r.rateAt)}}>
              {t > r.rateAt - 0.3 && <Odometer t={t} at={r.rateAt - 0.3} dur={0.7} target={r.n} pattern="00" size={110} color={C.danger} />}
              <span style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.danger}}>+</span>
            </div>
          </div>
        );
      })}
    </Stage>
  );
};

// ---------------- S7: fast breathing -> see a doctor ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.verdict, b = A.danger;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><Sticker t={t} at={a + 0.2} text="শ্বাস দ্রুত" color={C.danger} rotate={-4} size={80} /></Center>
      <Center top={480} style={{transform: `scale(${pop(t, a + 0.3)})`}}><Baby t={t} size={380} rate={72} sleep={false} /></Center>
      <Center top={720} style={{opacity: ramp(t, a + 0.4, a + 0.8)}}><Wave t={t} rate={72} color={C.danger} w={700} h={100} /></Center>
      <div style={{position: 'absolute', left: 120, top: 860, transform: `scale(${pop(t, A.doctor - 0.4)})`}}><Bean kind="doctor" size={200} t={t} mood="neutral" /></div>
      {t > A.doctor - 0.6 && (
        <div style={{position: 'absolute', left: 400, top: 880, width: 560, padding: '26px 30px', borderRadius: 34, borderBottomLeftRadius: 8, background: '#F5F7FF', transform: `scale(${pop(t, A.doctor - 0.5)})`, transformOrigin: 'bottom left'}}>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 52, lineHeight: 1.3, color: C.ink}}>দেরি না করে<br /><span style={{color: C.good}}>ডাক্তার দেখান</span></div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S8: danger signs -> hospital ----------------
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.danger, b = A.remember;
  const items = [
    {at: A.d1, text: 'বুকের নিচটা ভেতরে ঢুকে যায়'},
    {at: A.d2, text: 'দুধ বা পানি খেতে পারছে না'},
    {at: A.d3, text: 'খিঁচুনি হচ্ছে'},
    {at: A.d4, text: 'খুব নিস্তেজ'},
  ];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 80, top: 300, display: 'flex', alignItems: 'center', gap: 26, transform: `scale(${pop(t, A.straight - 0.2)})`, transformOrigin: 'left center'}}>
        <Hospital size={180} />
        <div>
          <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 38, color: C.muted}}>যেকোনো একটা দেখলে</div>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 76, color: C.danger, lineHeight: 1.1}}>সোজা হাসপাতালে</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 100, top: 580, display: 'flex', flexDirection: 'column', gap: 34}}>
        {items.map((it, i) => <CheckRow key={i} t={t} at={it.at} text={it.text} bad size={50} />)}
      </div>
    </Stage>
  );
};

// ---------------- S9: a warning, not a diagnosis ----------------
const S9: React.FC<{t: number}> = ({t}) => {
  const a = A.remember, b = A.share;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, right: 90, top: 340, padding: '40px 44px', borderRadius: 40, background: 'rgba(38,198,218,0.12)', border: `3px solid ${C.good}`, transform: `scale(${pop(t, a + 0.1)})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <svg width="80" height="80" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v10H3z" fill="none" stroke={C.good} strokeWidth="2.2" strokeLinejoin="round" /><circle cx="12" cy="14" r="3" fill={C.good} /></svg>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text, lineHeight: 1.2}}>ঘরে বসে<br />সতর্ক হওয়ার উপায়</div>
        </div>
      </div>
      {t > A.treat - 0.2 && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 720, padding: '36px 44px', borderRadius: 40, background: 'rgba(255,255,255,0.06)', border: '3px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 30, transform: `scale(${pop(t, A.treat - 0.1)})`}}>
          <Bean kind="doctor" size={150} t={t} mood="happy" />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.text, lineHeight: 1.2}}>চিকিৎসা<br /><span style={{color: C.good}}>দেবেন ডাক্তার</span></div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S10: share ----------------
const S10: React.FC<{t: number}> = ({t}) => {
  const a = A.share, b = A.question;
  const people: {kind: 'ammu' | 'bon' | 'abbu'; label: string; x: number; y: number}[] = [
    {kind: 'ammu', label: 'বড় আপা', x: 700, y: 400},
    {kind: 'bon', label: 'ভাবি', x: 760, y: 700},
    {kind: 'abbu', label: 'প্রতিবেশী', x: 640, y: 1000},
  ];
  const src = {x: 330, y: 820};
  const sendAt = wordAt('পাঠান', a);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, top: 300, width: 560}}>
        <Title size={56}>বাসায় ছোট বাচ্চা</Title>
        <Title size={56} color={C.good}>আছে যাদের</Title>
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
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 30, color: C.text}}>{p.label}</div>
        </div>
      ))}
    </Stage>
  );
};

// ---------------- S11: count today + follow + key line ----------------
const S11: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.question, br = BRAND[platform];
  const on = ease((t - A.cta_word) / 0.3);
  const msg = 'গুনেছি';
  const typeP = ramp(t, A.counted - 0.2, A.counted + 0.5);
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="আজ একবার গুনে দেখুন" color={C.good} textColor={C.ink} rotate={-3} size={58} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} />
          <div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.text}}>
            {t > A.counted - 0.2 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}
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
        <div style={{position: 'absolute', left: 60, right: 60, top: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pop(t, keyAt)})`}}>
          <TimerRing size={220} p={ramp(t, keyAt, keyAt + 2.5)} color={C.good}>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.text}}>১</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.good}}>মিনিট</div>
          </TimerRing>
          <Title size={90} style={{marginTop: 20}}>এক মিনিট গুনুন</Title>
        </div>
      )}
    </Stage>
  );
};

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [
    {from: A.unicef, to: A.follow, text: 'সূত্র: UNICEF'},
    {from: A.compare, to: A.remember, text: 'নিয়ম: WHO (শ্বাস গোনা ও বিপদের লক্ষণ)'},
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
      <S9 t={t} />
      <S10 t={t} />
      <S11 t={t} platform={platform} />
      <Iris t={t} at={A.how} x={W / 2} y={800} />
      <Iris t={t} at={A.danger} x={W / 2} y={800} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, top: 214, fontFamily: FONT_BN, fontWeight: 600, fontSize: 23, color: C.muted, opacity: 0.85}}>সতর্ক হওয়ার উপায়, রোগনির্ণয় নয় · চিকিৎসা দেবেন ডাক্তার</div>
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
