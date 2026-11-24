import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, BRAND, Background, Bean, BrandPill, C, Captions, CheckRow, Chip, Confetti, FONT, FONT_BN, Iris, Odometer, Phone, Platform,
  SourcePill, Stage, Sticker, Title, Toggle, W, WORDS, clamp01, ease, pop, ramp, useFonts, useT,
} from './lib';

// Video 015: measles, first death-free day in eight months (23 Nov 2026) — vaccines, symptoms, danger signs. Own drawings only.

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
const CalCard: React.FC<{day: string; month: string; w?: number}> = ({day, month, w = 260}) => (
  <div style={{width: w, borderRadius: 26, overflow: 'hidden', background: '#F5F7FF', boxShadow: '0 16px 34px rgba(0,0,0,0.4)'}}>
    <div style={{height: w * 0.22, background: C.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: w * 0.13, color: '#fff'}}>{month}</div>
    <div style={{height: w * 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: w * 0.42, color: C.ink}}>{day}</div>
  </div>
);
const Syringe: React.FC<{size?: number; push?: number}> = ({size = 260, push = 0}) => (
  <svg width={size} height={size * 0.4} viewBox="0 0 200 80" style={{overflow: 'visible'}}>
    <rect x="40" y="22" width="110" height="36" rx="8" fill="rgba(255,255,255,0.9)" />
    <rect x={44 + push * 60} y="26" width={102 - push * 60} height="28" rx="6" fill={C.good} />
    {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={60 + i * 18} y1="22" x2={60 + i * 18} y2="34" stroke="#7A86B8" strokeWidth="3" />)}
    <rect x={8 + push * 60} y="34" width="36" height="12" rx="4" fill="#C9CDE0" />
    <rect x={2 + push * 60} y="20" width="10" height="40" rx="4" fill="#C9CDE0" />
    <rect x="150" y="32" width="18" height="16" rx="3" fill="#C9CDE0" />
    <line x1="168" y1="40" x2="198" y2="40" stroke="#E9EEF8" strokeWidth="4" strokeLinecap="round" />
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
const Clinic: React.FC<{size?: number}> = ({size = 160}) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80">
    <path d="M8 34 L50 6 L92 34" fill="none" stroke={C.good} strokeWidth="6" strokeLinejoin="round" />
    <rect x="18" y="32" width="64" height="44" rx="4" fill="#E9EEF8" />
    <path d="M50 42 v20 M40 52 h20" stroke={C.good} strokeWidth="6" strokeLinecap="round" />
  </svg>
);
// vaccine card with two dose slots
const VaxCard: React.FC<{t: number; tick1: number; tick2: number; w?: number; empty2?: number}> = ({t, tick1, tick2, w = 760, empty2 = 0}) => (
  <div style={{width: w, borderRadius: 34, background: '#F5F7FF', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', overflow: 'hidden'}}>
    <div style={{height: 90, background: C.signature, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 18}}>
      <svg width="46" height="46" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="#fff" strokeWidth="2.2" /><path d="M7 9h10M7 13h6" stroke="#fff" strokeWidth="2.2" /></svg>
      <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 42, color: '#fff'}}>শিশুর টিকার কার্ড</div>
    </div>
    <div style={{padding: '26px 34px', display: 'flex', flexDirection: 'column', gap: 18}}>
      {[{label: 'হাম-রুবেলা · ১ম ডোজ', age: '৯ মাস', k: tick1}, {label: 'হাম-রুবেলা · ২য় ডোজ', age: '১৫ মাস', k: tick2}].map((r, i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '14px 18px', borderRadius: 20, background: i === 1 && empty2 > 0 ? `rgba(255,77,109,${0.15 * empty2 * (0.6 + 0.4 * Math.sin(t * 8))})` : '#E9ECF8'}}>
          <div style={{flex: 1}}>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 38, color: C.ink}}>{r.label}</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: '#6B6890'}}>বয়স {r.age}</div>
          </div>
          <div style={{width: 74, height: 74, borderRadius: 18, border: `5px solid ${r.k > 0 ? C.good : '#B8BCD6'}`, background: `rgba(38,198,218,${0.9 * clamp01(r.k)})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg viewBox="0 0 40 40" width="52" height="52"><path d="M8 21 L17 30 L33 11" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - clamp01(r.k))} /></svg>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ---------------- S1: 23 Nov — the first day with no deaths in eight months ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const b = A.but;
  return (
    <Stage t={t} a={0} b={b} noFadeIn>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(90,74,156,0.6) 0%, rgba(196,139,192,0.35) 45%, rgba(255,192,160,0.25) 70%, rgba(0,0,0,0) 75%)', opacity: ramp(t, 0, 1.2)}} />
      <Center top={290} style={{transform: `scale(${pop(t, 0.05)}) rotate(${(1 - pop(t, 0.05)) * -10}deg)`}}><CalCard day="২৩" month="নভেম্বর" w={250} /></Center>
      {t > A.eight - 0.1 && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 560, opacity: ramp(t, A.eight - 0.1, A.eight + 0.3)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.muted}}><span>১৫ মার্চ</span><span>২৩ নভেম্বর</span></div>
          <div style={{marginTop: 10, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
            <div style={{width: `${100 * ease((t - A.eight) / 1.6)}%`, height: '100%', background: `linear-gradient(90deg, ${C.danger}, ${C.warn})`}} />
          </div>
          <div style={{marginTop: 8, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: C.text}}>প্রায় আট মাস, প্রতিদিন মৃত্যু</div>
        </div>
      )}
      {t > A.nodeath - 0.3 && (
        <Center top={790} style={{transform: `scale(${pop(t, A.nodeath - 0.2)})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30, padding: '24px 40px', borderRadius: 40, background: 'rgba(38,198,218,0.14)', border: `4px solid ${C.good}`, boxShadow: `0 0 60px ${C.good}55`}}>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 170, color: C.good, lineHeight: 1}}>০</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 52, color: C.text, lineHeight: 1.2}}>হামে মৃত্যু<br /><span style={{fontSize: 36, color: C.muted}}>সেই দিন</span></div>
          </div>
        </Center>
      )}
      {t > A.nodeath + 0.4 && <Center top={1100}><Sticker t={t} at={A.nodeath + 0.5} text="আট মাস পর প্রথম!" color={C.good} textColor={C.ink} rotate={-4} size={56} /></Center>}
    </Stage>
  );
};

// ---------------- S2: but 1,417 new cases the same day ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.but, b = A.follow;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="স্বস্তির সময় আসেনি" color={C.danger} rotate={-3} size={60} /></Center>
      <Center top={480} style={{opacity: ramp(t, A.sameday - 0.2, A.sameday + 0.2)}}><Chip size={40} bg="rgba(255,255,255,0.1)">সেই দিনেই, নতুন রোগী</Chip></Center>
      {t > A.newcases - 1.6 && (
        <Center top={600}>
          <div style={{display: 'flex', alignItems: 'baseline', fontFamily: FONT_BN, fontWeight: 800, color: C.danger}}>
            <span style={{fontSize: 150}}>+</span>
            <Odometer t={t} at={A.newcases - 1.5} dur={1.6} target={1417} pattern="0,000" size={170} color={C.danger} />
          </div>
        </Center>
      )}
      {t > A.newcases && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', gap: 20, opacity: ramp(t, A.newcases, A.newcases + 0.4)}}>
          <Chip size={36} bg="rgba(255,77,109,0.18)">নিশ্চিত ৯৬</Chip>
          <Chip size={36} bg="rgba(255,255,255,0.08)">সন্দেহজনক ১,৩২১</Chip>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S3: follow ----------------
const S3: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.since;
  const on = ease((t - A.follow_word) / 0.3);
  const card = pop(t, a + 0.3);
  const bell = t > A.follow_word ? Math.sin((t - A.follow_word) * 22) * 18 * Math.max(0, 1 - (t - A.follow_word) / 0.9) : 0;
  const br = BRAND[platform];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 400, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}>
        <Title size={80}>পরিবারের জন্য</Title>
        <Title size={80} color={C.good}>জরুরি খবর, এখানে</Title>
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

// ---------------- S4: 1,352 children since 15 March ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.since, b = A.contagious;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30}}>
        <div style={{transform: `scale(${pop(t, a)})`}}><CalCard day="১৫" month="মার্চ" w={170} /></div>
        <svg width="140" height="40" viewBox="0 0 140 40" style={{opacity: ramp(t, a + 0.3, a + 0.6)}}><path d="M4 20 H122 M108 6 L126 20 L108 34" fill="none" stroke={C.muted} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{transform: `scale(${pop(t, a + 0.5)})`}}><CalCard day="২৩" month="নভেম্বর" w={170} /></div>
      </div>
      {t > A.n1352 - 1.8 && <Center top={580}><Odometer t={t} at={A.n1352 - 1.7} dur={1.8} target={1352} pattern="0,000" size={190} color={C.text} /></Center>}
      {t > A.n1352 - 0.2 && <Center top={820}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.danger, opacity: ramp(t, A.n1352 - 0.2, A.n1352 + 0.3)}}>শিশুর মৃত্যু</div></Center>}
      {t > A.suspect - 0.1 && <Center top={980}><div style={{transform: `scale(${pop(t, A.suspect)})`}}><Chip size={44} bg="rgba(255,138,61,0.2)">সন্দেহজনক রোগী ২.৫ লাখ+</Chip></div></Center>}
    </Stage>
  );
};

// ---------------- S5: 9 out of 10 ----------------
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.contagious, b = A.how;
  const order = [4, 3, 5, 8, 0, 9, 2, 6, 1];
  const infected = Math.floor(clamp01((t - A.nine + 0.3) / 1.4) * 9);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><Sticker t={t} at={a + 0.2} text="হাম খুব ছোঁয়াচে" color={C.danger} rotate={-3} size={62} /></Center>
      <Center top={460} style={{opacity: ramp(t, A.ten - 0.4, A.ten)}}><Chip size={38} bg="rgba(255,255,255,0.1)">টিকা নেই এমন ১০ জন কাছের মানুষ</Chip></Center>
      <div style={{position: 'absolute', left: 90, right: 90, top: 580, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', rowGap: 10}}>
        {Array.from({length: 10}).map((_, i) => {
          const sick = order.slice(0, infected).includes(i);
          return (
            <div key={i} style={{position: 'relative', display: 'flex', justifyContent: 'center', transform: `scale(${pop(t, A.ten - 0.3 + i * 0.05)})`}}>
              <Bean kind={(['you', 'bon', 'bhai', 'abbu', 'ammu'] as const)[i % 5]} size={130} t={t} mood={sick ? 'worried' : 'neutral'} phase={i} bounce={0.4} />
              {sick && <div style={{position: 'absolute', left: '50%', top: 10, marginLeft: -48, width: 96, height: 96, borderRadius: 99, background: 'radial-gradient(circle, rgba(255,77,109,0.55) 0%, rgba(255,77,109,0) 70%)'}} />}
            </div>
          );
        })}
      </div>
      {t > A.nine + 1.1 && <Center top={1030}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 66, color: C.text, opacity: ramp(t, A.nine + 1.1, A.nine + 1.4)}}>প্রায় <span style={{color: C.danger}}>৯ জন</span> আক্রান্ত</div></Center>}
    </Stage>
  );
};

// ---------------- S6: the answer is the vaccine ----------------
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.how, b = A.card;
  const push = ramp(t, A.vaccine, A.vaccine + 0.8);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={84}>বাঁচার উপায়?</Title></Center>
      <Center top={410} style={{transform: `scale(${pop(t, A.vaccine - 0.2)}) rotate(-8deg)`}}><Syringe size={360} push={push} /></Center>
      {t > A.vaccine && <div style={{position: 'absolute', left: 640, top: 420}}><Sticker t={t} at={A.vaccine + 0.1} text="টিকা" color={C.good} textColor={C.ink} rotate={6} size={70} /></div>}
      {t > A.free - 0.2 && (
        <Center top={620} style={{transform: `translateY(${(1 - pop(t, A.free)) * 200}px)`, opacity: clamp01(pop(t, A.free) * 2)}}>
          <VaxCard t={t} tick1={ease((t - A.dose1 - 0.3) / 0.4)} tick2={ease((t - A.dose2 - 0.3) / 0.4)} />
        </Center>
      )}
      {t > A.freeword - 0.1 && <Center top={1100}><div style={{transform: `scale(${pop(t, A.freeword)})`}}><Chip size={44} bg={C.good} color={C.ink}>বিনা পয়সায় · সরকারি টিকাকেন্দ্র</Chip></div></Center>}
    </Stage>
  );
};

// ---------------- S7: check the card today ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.card, b = A.symptoms;
  const sweep = ramp(t, a + 0.2, a + 1.6);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Sticker t={t} at={a + 0.1} text="আজই কার্ডটা দেখুন" color={C.signature} rotate={-3} size={60} /></Center>
      <Center top={460}>
        <div style={{position: 'relative'}}>
          <VaxCard t={t} tick1={1} tick2={0} empty2={ramp(t, A.missed - 0.2, A.missed + 0.2)} />
          <div style={{position: 'absolute', top: 0, bottom: 0, left: `${lerp(-20, 110, sweep)}%`, width: 120, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-15deg)', opacity: sweep < 1 ? 1 : 0}} />
          {t > A.missed && <div style={{position: 'absolute', right: -20, bottom: 30}}><Sticker t={t} at={A.missed + 0.1} text="বাদ পড়েছে?" color={C.danger} rotate={6} size={44} /></div>}
        </div>
      </Center>
      {t > A.clinic - 0.3 && (
        <div style={{position: 'absolute', left: 110, right: 110, top: 900, display: 'flex', alignItems: 'center', gap: 30, padding: '22px 30px', borderRadius: 34, background: 'rgba(38,198,218,0.12)', border: `3px solid ${C.good}`, transform: `scale(${pop(t, A.clinic - 0.2)})`}}>
          <Clinic size={150} />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: C.text, lineHeight: 1.3}}>কাছের টিকাকেন্দ্র<br /><span style={{color: C.good}}>বা কমিউনিটি ক্লিনিক</span></div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S8: symptoms ----------------
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.symptoms, b = A.danger;
  const rashP = ramp(t, A.face, A.rash + 0.4);
  const eyes = ramp(t, A.eyes, A.eyes + 0.3);
  const items = [
    {at: A.fever, text: 'জ্বর'}, {at: A.cough, text: 'কাশি'}, {at: A.cold, text: 'সর্দি'}, {at: A.eyes, text: 'চোখ লাল'}, {at: A.face, text: 'লাল দানা'},
  ];
  const size = 300;
  const dots = Array.from({length: 30}).map((_, i) => {
    const f = (Math.sin(i * 12.9898) * 43758.5453) % 1, g = (Math.sin(i * 78.233) * 12345.678) % 1;
    const face = i < 12;
    return {x: face ? 30 + Math.abs(f) * 40 : 28 + Math.abs(f) * 44, y: face ? 32 + (i / 12) * 30 + Math.abs(g) * 4 : 76 + ((i - 12) / 18) * 54 + Math.abs(g) * 4, r: 1.8 + Math.abs(g) * 1.2};
  });
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, top: 300, opacity: ramp(t, a, a + 0.4)}}><Title size={70}>লক্ষণ চিনে রাখুন</Title></div>
      <div style={{position: 'absolute', left: 110, top: 460, transform: `scale(${pop(t, a + 0.2)})`}}>
        <div style={{position: 'relative', width: size, height: size * 1.4}}>
          <Bean kind="bhai" size={size} t={t} mood={t > A.fever ? 'worried' : 'neutral'} bounce={0.3} />
          <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <circle cx="41" cy="47" r="5.5" fill="none" stroke={C.danger} strokeWidth="2" opacity={eyes} />
            <circle cx="59" cy="47" r="5.5" fill="none" stroke={C.danger} strokeWidth="2" opacity={eyes} />
            {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#E5304F" opacity={clamp01(rashP * 30 - i) * 0.85} />)}
            {t > A.cough && t < A.cough + 1.2 && [0, 1, 2].map((i) => <line key={i} x1={20 - i * 4} y1={58 + i * 5} x2={10 - i * 4} y2={56 + i * 7} stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity={Math.sin(Math.PI * ramp(t, A.cough, A.cough + 1.2))} />)}
          </svg>
          {t > A.fever && (
            <svg width="60" height="200" viewBox="0 0 30 100" style={{position: 'absolute', left: size - 10, top: 20}}>
              <rect x="10" y="4" width="10" height="78" rx="5" fill="#F5F7FF" />
              <rect x="12.5" y={80 - 70 * ramp(t, A.fever, A.fever + 1)} width="5" height={70 * ramp(t, A.fever, A.fever + 1) + 4} fill={C.danger} />
              <circle cx="15" cy="86" r="10" fill={C.danger} stroke="#F5F7FF" strokeWidth="3" />
            </svg>
          )}
        </div>
      </div>
      <div style={{position: 'absolute', left: 580, top: 480, display: 'flex', flexDirection: 'column', gap: 22}}>
        {items.map((it, i) => {
          const k = pop(t, it.at - 0.1);
          return <div key={i} style={{transform: `translateX(${(1 - k) * 80}px)`, opacity: clamp01(k * 2)}}><Chip size={48} bg={i === 4 ? C.danger : 'rgba(255,255,255,0.1)'}>{it.text}</Chip></div>;
        })}
      </div>
      {t > A.face && <Center top={1170} style={{opacity: ramp(t, A.face, A.face + 0.4)}}><Chip size={36} bg="rgba(255,77,109,0.18)">লাল দানা: মুখ থেকে শুরু, তারপর সারা শরীরে</Chip></Center>}
    </Stage>
  );
};

// ---------------- S9: danger signs ----------------
const S9: React.FC<{t: number}> = ({t}) => {
  const a = A.danger, b = A.share;
  const items = [{at: A.danger, text: 'শ্বাসকষ্ট'}, {at: A.diarrhea, text: 'পাতলা পায়খানা'}, {at: A.fits, text: 'খিঁচুনি'}, {at: A.weak, text: 'খুব নিস্তেজ'}];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 100, top: 320, display: 'flex', flexDirection: 'column', gap: 34}}>
        {items.map((it, i) => <CheckRow key={i} t={t} at={it.at} text={it.text} bad size={58} />)}
      </div>
      {t > A.hospital - 0.6 && (
        <div style={{position: 'absolute', left: 100, top: 880, display: 'flex', alignItems: 'center', gap: 26, transform: `scale(${pop(t, A.hospital - 0.5)})`, transformOrigin: 'left center'}}>
          <Hospital size={200} />
          <div>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.muted}}>দেরি না করে</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 80, color: C.danger, lineHeight: 1.1}}>হাসপাতালে</div>
          </div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S10: share ----------------
const S10: React.FC<{t: number}> = ({t}) => {
  const a = A.share, b = A.question;
  const people: {kind: 'ammu' | 'bon' | 'abbu'; label: string; x: number; y: number}[] = [
    {kind: 'ammu', label: 'আম্মু', x: 700, y: 400},
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

// ---------------- S11: question + follow + key line ----------------
const S11: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.question, br = BRAND[platform];
  const on = ease((t - A.cta_word) / 0.3);
  const msg = 'দুইটাই দিয়েছি';
  const typeP = ramp(t, A.comment - 0.2, A.comment + 0.7);
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="দুইটা ডোজই দেওয়া হয়েছে?" color={C.good} textColor={C.ink} rotate={-3} size={54} /></Center>
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
        <div style={{position: 'absolute', left: 60, right: 60, top: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pop(t, keyAt)})`}}>
          <Syringe size={260} push={ramp(t, keyAt + 0.3, keyAt + 1.2)} />
          <Title size={88} style={{marginTop: 30, textAlign: 'center'}}>আজই টিকার কার্ড দেখুন</Title>
        </div>
      )}
    </Stage>
  );
};

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [
    {from: 0.6, to: A.follow, text: 'সূত্র: স্বাস্থ্য অধিদপ্তর, ২৩ নভেম্বর ২০২৬'},
    {from: A.since, to: A.contagious, text: 'সূত্র: স্বাস্থ্য অধিদপ্তর (কালের কণ্ঠ, সারাবাংলা)'},
    {from: A.contagious, to: A.how, text: 'সূত্র: CDC'},
    {from: A.how, to: A.symptoms, text: 'সূত্র: EPI, icddr,b'},
    {from: A.symptoms, to: A.share, text: 'লক্ষণ: CDC, MedlinePlus'},
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
      <Iris t={t} at={A.symptoms} x={W / 2} y={800} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, top: 214, fontFamily: FONT_BN, fontWeight: 600, fontSize: 23, color: C.muted, opacity: 0.85}}>সতর্কতার জন্য · চিকিৎসা দেবেন ডাক্তার</div>
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
