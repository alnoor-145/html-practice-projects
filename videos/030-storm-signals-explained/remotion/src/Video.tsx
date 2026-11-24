import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {
  A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Iris, Platform,
  SourcePill, Stage, Sticker, Title, W, WORDS, clamp01, ease, pop, ramp, useFonts, useT, FPS,
} from './lib';
import {IsoBox, Swirl, SignalFlag, Tag, bnum} from './iso';

// Video 030: storm signals 1 to 10, what they mean. Own stylised 2.5D graphics, no logos or real photos.
const YEL = '#FFC24D', ORG = '#FF7A2F', RED = '#FF4D6D', SEA = '#1E4E8C';
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
const Sea: React.FC<{t: number; top: number; h?: number}> = ({t, top, h = 420}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, height: h, background: `linear-gradient(180deg, ${SEA} 0%, #10294D 100%)`, overflow: 'hidden', opacity: 0.9}}>
    {Array.from({length: 6}).map((_, i) => <div key={i} style={{position: 'absolute', left: ((i * 240 + t * 40) % 1300) - 200, top: 40 + i * 62, width: 220, height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.22)'}} />)}
  </div>
);
const NumDot: React.FC<{n: string; t: number; at: number}> = ({n, t, at}) => (
  <div style={{position: 'absolute', left: 60, top: 270, width: 100, height: 100, borderRadius: 99, background: YEL, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.ink, transform: `scale(${pop(t, at)})`}}>{n}</div>
);
const RuleTitle: React.FC<{t: number; at: number; children: React.ReactNode}> = ({t, at, children}) => (
  <div style={{position: 'absolute', left: 190, right: 60, top: 270, opacity: ramp(t, at, at + 0.3), fontFamily: FONT_BN, fontWeight: 800, fontSize: 54, color: C.text, lineHeight: 1.2}}>{children}</div>
);
const groupColor = (n: number) => (n <= 4 ? YEL : n <= 7 ? ORG : RED);

// the 1..10 staircase; `lit` = function telling which steps are bright
const Stairs: React.FC<{t: number; at: number; lit: (n: number) => number; top?: number}> = ({t, at, lit, top = 1160}) => (
  <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    {Array.from({length: 10}).map((_, i) => {
      const n = i + 1; const k = ease((t - at - i * 0.12) / 0.5); const l = lit(n);
      return <IsoBox key={n} x={150 + i * 80} y={top - i * 26} s={46} h={(70 + i * 36) * k} color={groupColor(n)} glow={l > 0.9 ? 1 : 0} op={0.35 + 0.65 * l} />;
    })}
  </svg>
);

// ---------------- S1: hook ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const a = 0, b = A.follow;
  const pole = 1100;
  const flag = t < A.s17 ? 1 : t < A.later ? 2 : 3;
  const show = ramp(t, A.hook + 0.2, A.hook + 0.8);
  const days = [{at: A.ports - 0.4, d: '১৫–১৬ নভে', n: 1, c: YEL}, {at: A.s17, d: '১৭ নভে', n: 2, c: ORG}, {at: A.later, d: 'পরে', n: 3, c: RED}];
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <Sea t={t} top={1000} h={520} />
      <div style={{position: 'absolute', left: 520, top: 280, opacity: 0.8}}><Swirl t={t} size={360} speed={50 + 40 * ramp(t, A.s17, A.later)} /></div>
      <div style={{position: 'absolute', left: 120, top: 330, transform: `scale(${show})`}}><SignalFlag n={t < A.ask ? 3 : flag} size={190} color={t < A.ask ? RED : groupColor(flag)} /></div>
      {t > A.ask - 0.1 && t < A.month && <Center top={800}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.warn, transform: `scale(${pop(t, A.ask)}) rotate(${Math.sin(t * 5) * 8}deg)`}}>?</div></Center>}
      {t > A.ports - 0.4 && (
        <div style={{position: 'absolute', left: 70, right: 70, top: 780, display: 'flex', justifyContent: 'space-between'}}>
          {days.map((x, i) => <div key={i} style={{width: 300, padding: '18px 10px', borderRadius: 26, background: 'rgba(255,255,255,0.07)', border: `3px solid ${x.c}`, textAlign: 'center', transform: `scale(${pop(t, x.at)})`, opacity: clamp01(pop(t, x.at) * 2)}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 32, color: C.muted}}>{x.d}</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 80, color: x.c, lineHeight: 1.1}}>{bnum(x.n)}</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.text}}>নম্বর</div></div>)}
        </div>
      )}
      {t > A.month && <Center top={1170}><Chip size={36} bg="rgba(255,255,255,0.1)">ঘূর্ণিঝড় আকভান · ৪ সমুদ্রবন্দর</Chip></Center>}
    </Stage>
  );
};

const S2: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.lowered;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}><Title size={78}>আবহাওয়ার দরকারি কথা</Title><Title size={78} color={YEL}>সবার আগে, এখানে</Title></div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};

// ---------------- S3: signals lowered on 21 Nov; 1 to 10 ----------------
const S3: React.FC<{t: number}> = ({t}) => {
  const a = A.lowered, b = A.groups;
  const down = ease((t - a - 0.8) / 1.2);
  const stairs = t > A.oneten - 0.3;
  return (
    <Stage t={t} a={a} b={b}>
      {!stairs && (
        <>
          <Center top={290}><div style={{transform: `scale(${pop(t, a + 0.1)})`}}><div style={{padding: '14px 34px', borderRadius: 26, background: '#F5F7FF', fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.ink}}>২১ নভেম্বর</div></div></Center>
          <Center top={430}><div style={{position: 'relative', height: 520}}><div style={{position: 'absolute', left: 0, top: lerp(0, 220, down)}}><SignalFlag n={3} size={200} color={RED} /></div><div style={{position: 'absolute', left: -60, top: 120, width: 320, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.2)'}} /></div></Center>
          {t > a + 1.5 && <Center top={1020}><Sticker t={t} at={a + 1.6} text="সংকেত নামানো হলো" color={C.good} textColor={C.ink} rotate={-3} size={54} /></Center>}
        </>
      )}
      {stairs && (
        <>
          <Center top={290}><Title size={74}>এক থেকে দশ</Title></Center>
          <Stairs t={t} at={A.oneten} lit={() => 1} />
          {Array.from({length: 10}).map((_, i) => <div key={i} style={{position: 'absolute', left: 150 + i * 80 - 24, top: 1160 - i * 26 - (70 + i * 36) - 84, fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: C.text, opacity: ramp(t, A.oneten + i * 0.12 + 0.4, A.oneten + i * 0.12 + 0.7)}}>{bnum(i + 1)}</div>)}
        </>
      )}
    </Stage>
  );
};

// ---------------- S4: the three groups ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.groups, b = A.note;
  const g = t < A.g2 ? 1 : t < A.g3 ? 2 : 3;
  const sub = t < A.local ? (t < A.far ? 0 : 1) : 2;
  const lit = (n: number) => (g === 1 ? (n <= 4 ? (t < A.local ? (n <= 2 ? 1 : 0.4) : 1) : 0.25) : g === 2 ? (n >= 5 && n <= 7 ? 1 : 0.25) : (n >= 8 ? 1 : 0.25));
  const label = g === 1 ? {t: 'সতর্ক সংকেত', s: sub === 0 ? 'দূরবর্তী (১–২): ঝড় সাগরের দূরে' : 'স্থানীয় (৩–৪): বন্দরের দিকে আসার ঝুঁকি', c: YEL} : g === 2 ? {t: 'বিপদ সংকেত', s: '৫–৭: বন্দর ঝড়ের কবলে পড়তে যাচ্ছে', c: ORG} : {t: 'মহাবিপদ সংকেত', s: '৮–১০: প্রচণ্ড ঘূর্ণিঝড়', c: RED};
  const wind = ease((t - A.wind) / 1.4);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={280}><div style={{textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 80, color: label.c}}>{label.t}</div><div style={{marginTop: 6, fontFamily: FONT_BN, fontWeight: 700, fontSize: 38, color: C.text}}>{label.s}</div></div></Center>
      <Stairs t={0} at={-5} lit={lit} />
      {g === 1 && <div style={{position: 'absolute', left: 520, top: 520, opacity: 0.9, transform: `translateX(${sub === 0 ? 0 : -120}px)`}}><Swirl t={t} size={sub === 0 ? 160 : 260} speed={50} /></div>}
      {g === 1 && <div style={{position: 'absolute', left: 140, top: 560}}><div style={{width: 150, height: 90, borderRadius: 14, background: '#D5DAEE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 36, color: C.ink}}>বন্দর</div></div>}
      {t > A.s10 - 0.2 && (
        <Center top={540} style={{opacity: ramp(t, A.s10 - 0.2, A.s10 + 0.4)}}>
          <div style={{padding: '20px 34px', borderRadius: 30, background: 'rgba(18,11,36,0.85)', border: `4px solid ${RED}`, textAlign: 'center', transform: `scale(${pop(t, A.s10)})`}}>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.muted}}>১০ নম্বর · বাতাস একটানা</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 120, color: RED, lineHeight: 1}}>{wind > 0.02 ? bnum(Math.round(89 * wind)) + '+' : '?'}</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.text}}>কিমি/ঘণ্টা</div>
          </div>
        </Center>
      )}
    </Stage>
  );
};

// ---------------- S5: the signal is for ports, but a message for the whole coast ----------------
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.note, b = A.todo;
  const ship = Math.sin(t * 1.6) * 20;
  return (
    <Stage t={t} a={a} b={b}>
      <Sea t={t} top={900} h={520} />
      <div style={{position: 'absolute', left: 190, top: 700 + ship * 0.2, transform: `rotate(${ship * 0.2}deg) scale(${pop(t, a + 0.2)})`}}>
        <svg width="320" height="200" viewBox="0 0 160 100"><path d="M10 60 H150 L130 90 H30 Z" fill="#D5DAEE" /><rect x="60" y="30" width="40" height="30" fill="#9FB4E6" /><rect x="76" y="14" width="8" height="16" fill="#9FB4E6" /></svg>
      </div>
      <div style={{position: 'absolute', left: 640, top: 460, transform: `scale(${pop(t, A.coast - 0.3)})`}}><SignalFlag n={3} size={170} color={YEL} /></div>
      <Center top={300}><Chip size={44} bg="rgba(255,255,255,0.1)">বন্দর আর জাহাজের জন্য</Chip></Center>
      {t > A.coast - 0.2 && <Center top={1200}><Sticker t={t} at={A.coast} text="উপকূলের সবার জন্য সতর্কবার্তা" color={YEL} textColor={C.ink} rotate={-3} size={46} /></Center>}
    </Stage>
  );
};

const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.todo, b = A.k1;
  return <Stage t={t} a={a} b={b}><Center top={430}><Title size={90}>আপনি কী করবেন?</Title></Center><div style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', gap: 34}}>{['১', '২', '৩', '৪'].map((n, i) => <div key={i} style={{width: 150, height: 150, borderRadius: 99, background: YEL, border: '8px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 90, color: C.ink, transform: `scale(${pop(t, a + 1.2 + i * 0.15)})`}}>{n}</div>)}</div></Stage>;
};

// ---------------- rules ----------------
const R1: React.FC<{t: number}> = ({t}) => {
  const a = A.k1, b = A.k2;
  return (
    <Stage t={t} a={a} b={b}>
      <NumDot n="১" t={t} at={a} /><RuleTitle t={t} at={a + 0.1}>গুজব না,<br /><span style={{color: YEL}}>আবহাওয়া অধিদপ্তরের ঘোষণা</span></RuleTitle>
      <div style={{position: 'absolute', left: 100, top: 560, width: 880, padding: '30px 36px', borderRadius: 34, background: '#F5F7FF', boxShadow: '0 24px 50px rgba(0,0,0,0.45)', transform: `scale(${pop(t, a + 0.4)})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}><svg width="60" height="60" viewBox="0 0 24 24"><path d="M12 2L3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6z" fill={C.good} /><path d="M8 12l3 3 5-6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 42, color: C.ink}}>সরকারি আবহাওয়া ঘোষণা</div></div>
        <div style={{marginTop: 16, fontFamily: FONT_BN, fontWeight: 700, fontSize: 38, color: '#6B6890'}}>সমুদ্রবন্দর: সংকেত নম্বর ও সময়</div>
      </div>
      {t > a + 2 && <div style={{position: 'absolute', left: 100, top: 900, width: 880, padding: '30px 36px', borderRadius: 34, background: 'rgba(255,255,255,0.06)', border: `3px dashed ${C.danger}`, opacity: 0.9, transform: `scale(${pop(t, a + 2)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: C.muted}}>অচেনা পেজ: "১০ নম্বর সংকেত! শেয়ার করুন!"</div><div style={{position: 'absolute', left: 30, top: 40, width: 800, height: 60}}><svg width="800" height="60"><path d="M0 30 Q100 5 200 30 T400 30 T600 30 T800 30" fill="none" stroke={C.danger} strokeWidth="8" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={1000 * (1 - ease((t - a - 2.4) / 0.5))} /></svg></div><div style={{position: 'absolute', right: 20, top: -22}}><Chip size={26} bg={C.danger}>ভুয়া হতে পারে</Chip></div></div>}
    </Stage>
  );
};
const R2: React.FC<{t: number}> = ({t}) => {
  const a = A.k2, b = A.k3;
  const items = ['ফোন চার্জ', 'টর্চ', 'শুকনো খাবার', 'খাবার পানি', 'দরকারি কাগজ (প্লাস্টিকে মোড়া)'];
  const times = [wordAt('ফোন', a), wordAt('টর্চ', a), wordAt('শুকনো', a), wordAt('খাবার', a + 1), wordAt('দরকারি', a + 1)];
  return (
    <Stage t={t} a={a} b={b}>
      <NumDot n="২" t={t} at={a} /><RuleTitle t={t} at={a + 0.1}>৩ নম্বর থেকেই<br /><span style={{color: YEL}}>প্রস্তুতি শুরু</span></RuleTitle>
      <div style={{position: 'absolute', left: 110, top: 540, display: 'flex', flexDirection: 'column', gap: 28}}>
        {items.map((x, i) => { const k = ease((t - times[i]) / 0.35); return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: 0.3 + 0.7 * k}}><div style={{width: 80, height: 80, borderRadius: 18, border: `5px solid ${C.good}`, background: `rgba(38,198,218,${0.9 * k})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 40 40" width="54" height="54"><path d="M8 21 L17 30 L33 11" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - k)} /></svg></div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 50, color: C.text}}>{x}</div></div>; })}
      </div>
    </Stage>
  );
};
const R3: React.FC<{t: number}> = ({t}) => {
  const a = A.k3, b = A.k4;
  const back = ease((t - a - 1.5) / 2);
  return (
    <Stage t={t} a={a} b={b}>
      <NumDot n="৩" t={t} at={a} /><RuleTitle t={t} at={a + 0.1}>সংকেত থাকলে<br /><span style={{color: YEL}}>সাগরে নয়</span></RuleTitle>
      <Sea t={t} top={640} h={640} />
      <div style={{position: 'absolute', left: 880 - 520 * back, top: 700 + 60 * Math.sin(t * 2)}}><svg width="200" height="120" viewBox="0 0 100 60"><path d="M6 30 Q50 48 94 30 L84 46 Q50 56 16 46 Z" fill="#E9C58A" /><rect x="48" y="8" width="3" height="24" fill="#E9C58A" /><path d="M51 10 L74 28 H51 Z" fill="#F5F7FF" /></svg></div>
      <div style={{position: 'absolute', left: 80, top: 1060}}><div style={{width: 220, height: 90, borderRadius: 14, background: '#D5DAEE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: C.ink}}>উপকূল</div></div>
      {t > a + 3.6 && <Center top={1190}><Chip size={36} bg={C.good} color={C.ink}>উপকূলের কাছাকাছি থাকুন</Chip></Center>}
    </Stage>
  );
};
const R4: React.FC<{t: number}> = ({t}) => {
  const a = A.k4, b = A.forecast;
  return (
    <Stage t={t} a={a} b={b}>
      <NumDot n="৪" t={t} at={a} /><RuleTitle t={t} at={a + 0.1}>প্রশাসন বললে<br /><span style={{color: YEL}}>আশ্রয়কেন্দ্রে, দেরি নয়</span></RuleTitle>
      <div style={{position: 'absolute', left: 150, top: 620, transform: `scale(${pop(t, a + 0.5)})`}}>
        <svg width="780" height="420" viewBox="0 0 200 110"><path d="M10 100 H190" stroke="#8A93B2" strokeWidth="3" /><rect x="50" y="40" width="100" height="60" fill="#E9EEF8" /><path d="M40 42 L100 8 L160 42 Z" fill={C.good} /><rect x="88" y="66" width="24" height="34" fill="#7A86B8" /><path d="M96 20 v14 M89 27 h14" stroke="#fff" strokeWidth="4" strokeLinecap="round" transform="translate(4 4)" /></svg>
      </div>
      <div style={{position: 'absolute', left: 90, top: 1090, display: 'flex', gap: 20, opacity: ramp(t, a + 1.5, a + 2)}}>{(['abbu', 'ammu', 'bon', 'bhai'] as const).map((k, i) => <div key={i} style={{transform: `translateX(${(1 - ease((t - a - 1.5 - i * 0.2) / 0.8)) * -300}px)`}}><Bean kind={k} size={120} t={t} mood="neutral" phase={i} /></div>)}</div>
    </Stage>
  );
};

// ---------------- forecast: more lows may come ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.forecast, b = A.send;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Chip size={44} bg="rgba(255,255,255,0.1)">আবহাওয়া অধিদপ্তরের পূর্বাভাস · নভেম্বর</Chip></Center>
      <div style={{position: 'absolute', left: 130, top: 440, display: 'flex', gap: 40}}>
        {[0, 1, 2].map((i) => <div key={i} style={{textAlign: 'center', transform: `scale(${pop(t, a + 0.4 + i * 0.5)})`}}><Swirl t={t + i} size={220} speed={40 + i * 20} color={i === 2 ? '#C9CDE0' : '#9FB4E6'} /><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.muted}}>লঘুচাপ</div></div>)}
      </div>
      {t > a + 3 && <Center top={900}><div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${pop(t, a + 3)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 90, color: RED}}>২–৩</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 48, color: C.text, lineHeight: 1.2}}>লঘুচাপ, তার<br /><span style={{color: ORG}}>১–২টা ঘূর্ণিঝড়</span></div></div></Center>}
      {t > A.keep - 0.2 && <Center top={1160}><Sticker t={t} at={A.keep} text="সংকেত নামলেও নজর রাখুন" color={C.signature} rotate={-3} size={48} /></Center>}
    </Stage>
  );
};
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.send, b = A.question;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, top: 300, width: 800}}><Title size={56}>উপকূলে আত্মীয় আছে</Title><Title size={56} color={YEL}>এমন কাউকে পাঠান</Title></div>
      <div style={{position: 'absolute', left: 120, top: 620, display: 'flex', gap: 50, transform: `scale(${pop(t, a + 0.3)})`}}><Bean kind="ammu" size={180} t={t} mood="happy" /><Bean kind="abbu" size={180} t={t} mood="happy" phase={1} /></div>
      <svg width="360" height="100" viewBox="0 0 360 100" style={{position: 'absolute', left: 340, top: 900, opacity: ramp(t, a + 1, a + 1.4)}}><path d="M10 50 H300 M270 20 L320 50 L270 80" fill="none" stroke={C.signature} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Stage>
  );
};
const S9: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.question;
  const msg = 'আমাদের এলাকায় ৩ নম্বর উঠেছিল';
  const typeP = ramp(t, A.comment - 0.2, A.comment + 1.4);
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="কত নম্বর পর্যন্ত দেখেছেন?" color={YEL} textColor={C.ink} rotate={-3} size={56} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}><div style={{display: 'flex', alignItems: 'center', gap: 14}}><div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} /><div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.text}}>{t > A.comment - 0.2 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div></div><div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div></div>
      <FollowPill t={t} at={A.cta_word} platform={platform} top={730} opacity={ramp(t, A.cta, A.cta + 0.4)} />
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={780} />
      {t > keyAt - 0.1 && <div style={{position: 'absolute', left: 60, right: 60, top: 1010, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}><Title size={80}>সংকেত জানুন,</Title><Title size={80} color={YEL}>প্রস্তুত থাকুন</Title></div>}
    </Stage>
  );
};

export const Cover: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Background t={0} blueprint={0} />
      <Sea t={2} top={1150} h={770} />
      <div style={{position: 'absolute', left: 540, top: 560, opacity: 0.8}}><Swirl t={1.2} size={460} /></div>
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 290, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, lineHeight: 1.12, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>ঝড়ের সংকেত<br /><span style={{color: YEL}}>৩ নম্বর</span> মানে কী?</div>
      <div style={{position: 'absolute', left: 90, top: 780}}><SignalFlag n={3} size={230} color={YEL} /></div>
      <Center top={1500}><Sticker t={10} at={0} text="১ থেকে ১০ নম্বরের মানে" color={RED} rotate={-3} size={62} /></Center>
    </AbsoluteFill>
  );
};

const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.1, file: 'whoosh', vol: 0.4}, {at: A.ask, file: 'rise_stinger', vol: 0.4}, {at: A.ports - 0.4, file: 'tick', vol: 0.8}, {at: A.s17, file: 'tick', vol: 0.8}, {at: A.later, file: 'impact_boom', vol: 0.5},
  {at: A.follow - 0.3, file: 'whoosh', vol: 0.3}, {at: A.lowered - 0.2, file: 'whoosh', vol: 0.35}, {at: A.oneten, file: 'counter_roll', vol: 0.45}, {at: A.groups - 0.2, file: 'whoosh', vol: 0.3},
  {at: A.g1, file: 'tick', vol: 0.8}, {at: A.g2, file: 'tick', vol: 0.8}, {at: A.g3, file: 'impact_boom', vol: 0.5}, {at: A.s10, file: 'counter_roll', vol: 0.4},
  {at: A.note - 0.2, file: 'whoosh', vol: 0.3}, {at: A.k1, file: 'tick', vol: 0.8}, {at: A.k2, file: 'tick', vol: 0.8}, {at: A.k3, file: 'tick', vol: 0.8}, {at: A.k4, file: 'tick', vol: 0.8},
  {at: A.forecast - 0.2, file: 'whoosh', vol: 0.3}, {at: A.cta - 0.8, file: 'whoosh', vol: 0.25},
];
export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [
    {from: A.month, to: A.follow, text: 'সূত্র: যুগান্তর, Radio Today'},
    {from: A.lowered, to: A.todo, text: 'সূত্র: বাংলা ট্রিবিউন, BMD'},
    {from: A.forecast, to: A.send, text: 'সূত্র: বাংলা ট্রিবিউন (BMD পূর্বাভাস)'},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      {SFX.map((s, i) => <Sequence key={i} from={Math.round(s.at * FPS)}><Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.vol * 0.5} /></Sequence>)}
      <Background t={t} blueprint={0} />
      <S1 t={t} /><S2 t={t} platform={platform} /><S3 t={t} /><S4 t={t} /><S5 t={t} /><S6 t={t} /><R1 t={t} /><R2 t={t} /><R3 t={t} /><R4 t={t} /><S7 t={t} /><S8 t={t} /><S9 t={t} platform={platform} />
      <Iris t={t} at={A.groups} x={W / 2} y={800} /><Iris t={t} at={A.todo} x={W / 2} y={800} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, top: 214, fontFamily: FONT_BN, fontWeight: 600, fontSize: 23, color: C.muted, opacity: 0.85}}>আঁকা গ্রাফিক্স · সংকেতের নম্বর BMD-র নিয়ম অনুযায়ী</div>
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
