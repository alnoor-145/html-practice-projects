import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Iris, LabelExample, Odometer, Phone, Platform,
  Scribble, SourcePill, Stage, Sticker, Title, Vignette, W, WORDS, clamp01, ease, pop, ramp, shakeAt, useFonts, useT,
} from './lib';

// Video 016: what to do if a moving bus catches fire. Own drawings only. One render for Facebook and YouTube.

const wordAt = (text: string, after = 0) => {
  const w = WORDS.find((x) => x.start >= after - 0.01 && x.text.replace(/^["“]/, '').startsWith(text));
  if (!w) throw new Error('word not found: ' + text);
  return w.start;
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * clamp01(k);
const END = A.end;
const FIRE = '#FF7A2F';
const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);

// ---------------- drawings ----------------
const Flames: React.FC<{t: number; size?: number; k?: number}> = ({t, size = 160, k = 1}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', transform: `scale(${k})`, transformOrigin: 'bottom center'}}>
    {[0, 1, 2].map((i) => {
      const s = 1 + Math.sin(t * 10 + i * 2) * 0.12;
      return <path key={i} transform={`translate(${28 + i * 22} 96) scale(${s}) translate(-20 -96)`} d="M20 96 Q0 66 16 38 Q18 56 26 50 Q20 26 34 8 Q40 38 44 46 Q54 66 20 96 Z" fill={i === 1 ? C.gold : FIRE} />;
    })}
  </svg>
);
const Smoke: React.FC<{t: number; k: number; top?: number; h?: number}> = ({t, k, top = 0, h = 300}) => (
  <div style={{position: 'absolute', left: -60, right: -60, top, height: h * k, overflow: 'visible', opacity: clamp01(k * 1.5)}}>
    {Array.from({length: 9}).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: `${(i * 13 + Math.sin(t * 0.8 + i) * 4) % 110 - 5}%`, top: (i % 3) * 50 * k, width: 320, height: 160, borderRadius: 200, background: 'rgba(120,120,140,0.55)', filter: 'blur(18px)'}} />
    ))}
  </div>
);
// side view of a bus, our own shape
const Bus: React.FC<{t: number; w?: number; fire?: number; smoke?: number; doorGlow?: number; winGlow?: number; passengers?: boolean}> = ({t, w = 900, fire = 0, smoke = 0, doorGlow = 0, winGlow = 0, passengers = true}) => {
  const h = w * 0.42;
  return (
    <div style={{position: 'relative', width: w, height: h + 40}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: 40, background: 'linear-gradient(180deg, #3A6FD8 0%, #2B4FA8 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.45)', overflow: 'hidden'}}>
        {/* windows */}
        <div style={{position: 'absolute', left: w * 0.05, right: w * 0.05, top: h * 0.12, height: h * 0.36, display: 'flex', gap: w * 0.015}}>
          {Array.from({length: 7}).map((_, i) => (
            <div key={i} style={{position: 'relative', flex: 1, borderRadius: 12, background: i === 3 && winGlow > 0 ? `rgba(38,198,218,${0.4 + 0.4 * winGlow})` : '#BFD6FF', overflow: 'hidden', border: i === 3 && winGlow > 0 ? `4px solid ${C.good}` : 'none'}}>
              {passengers && i !== 0 && i % 2 === 1 && <div style={{position: 'absolute', left: '28%', top: '30%', width: '44%', height: '70%', borderRadius: '50% 50% 10px 10px', background: '#4A3F7A'}} />}
            </div>
          ))}
        </div>
        {/* door */}
        <div style={{position: 'absolute', left: w * 0.08, top: h * 0.55, width: w * 0.1, height: h * 0.42, borderRadius: 8, background: doorGlow > 0 ? `rgba(38,198,218,${0.5 + 0.4 * doorGlow})` : '#9FB4E6', border: doorGlow > 0 ? `4px solid ${C.good}` : '3px solid #7A9AE0'}} />
        <div style={{position: 'absolute', left: w * 0.24, right: w * 0.05, top: h * 0.62, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.35)'}} />
        <div style={{position: 'absolute', inset: 0, background: `rgba(255,122,47,${0.35 * fire})`}} />
        <Smoke t={t} k={smoke} top={-40} h={h * 0.8} />
      </div>
      {fire > 0 && <div style={{position: 'absolute', right: w * 0.08, top: -h * 0.3}}><Flames t={t} size={h * 0.8} k={fire} /></div>}
      {[0.22, 0.78].map((x, i) => <div key={i} style={{position: 'absolute', left: w * x - 45, top: h - 40, width: 90, height: 90, borderRadius: 99, background: '#1A1530', border: '12px solid #5A5F7A'}} />)}
    </div>
  );
};
const Bag: React.FC<{size?: number}> = ({size = 140}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M34 30 Q34 14 50 14 Q66 14 66 30" fill="none" stroke="#5B3A2A" strokeWidth="7" />
    <rect x="16" y="30" width="68" height="58" rx="12" fill="#8B5A3C" />
    <rect x="16" y="50" width="68" height="8" fill="#6E4430" />
  </svg>
);
const DialCard: React.FC<{num: string; label: string; color: string; k: number}> = ({num, label, color, k}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '20px 30px', borderRadius: 34, background: 'rgba(255,255,255,0.06)', border: `4px solid ${color}`, transform: `scale(${k})`, opacity: clamp01(k * 2)}}>
    <div style={{width: 90, height: 90, borderRadius: 99, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width="50" height="50" viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="#fff" /></svg>
    </div>
    <div>
      <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 84, color: C.text, lineHeight: 1}}>{num}</div>
      <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.muted}}>{label}</div>
    </div>
  </div>
);
const NumBadge: React.FC<{n: string; t: number; at: number}> = ({n, t, at}) => (
  <div style={{position: 'absolute', left: 60, top: 280, width: 120, height: 120, borderRadius: 99, background: C.good, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.ink, transform: `scale(${pop(t, at)})`, boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>{n}</div>
);
const RuleTitle: React.FC<{t: number; at: number; children: React.ReactNode}> = ({t, at, children}) => (
  <div style={{position: 'absolute', left: 210, right: 60, top: 300, opacity: ramp(t, at, at + 0.3), transform: `translateX(${(1 - ease((t - at) / 0.4)) * 40}px)`}}>
    <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text, lineHeight: 1.2}}>{children}</div>
  </div>
);

// ---------------- S1: hook ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const b = A.real;
  const fire = ramp(t, A.scream, A.scream + 0.6);
  const smoke = ramp(t, A.smoke, A.smoke + 2.2);
  const sh = shakeAt(t, A.scream + 0.1, 0.5, 14);
  return (
    <Stage t={t} a={0} b={b} noFadeIn>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1A1240 0%, #2A1A52 60%, #3A2A3A 100%)', opacity: 0.8}} />
      {Array.from({length: 6}).map((_, i) => <div key={i} style={{position: 'absolute', left: ((i * 190 - t * 260) % 1300 + 1300) % 1300 - 120, top: 1080, width: 90, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.25)'}} />)}
      <div style={{position: 'absolute', left: 90, top: 640, transform: `translate(${sh.x}px, ${sh.y + Math.sin(t * 12) * 2}px)`}}>
        <Bus t={t} w={900} fire={fire} smoke={smoke} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1920, background: `radial-gradient(ellipse 60% 30% at 80% 45%, rgba(255,122,47,${0.35 * fire}) 0%, rgba(255,122,47,0) 100%)`}} />
      <Center top={320} style={{opacity: 1 - ramp(t, A.scream - 0.2, A.scream)}}><Chip size={40} bg="rgba(255,255,255,0.1)">সন্ধ্যা · অফিস শেষে বাসে</Chip></Center>
      {t > A.scream && <Center top={330}><Sticker t={t} at={A.scream + 0.1} text="আগুন!" color={C.danger} rotate={-5} size={90} /></Center>}
      {t > A.what - 0.1 && <Center top={1200}><Title size={84} style={{transform: `scale(${pop(t, A.what)})`}}>এখন কী করবেন?</Title></Center>}
    </Stage>
  );
};

// ---------------- S2: the real incidents ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.real, b = A.follow;
  const part2 = ramp(t, A.police - 0.2, A.police + 0.2);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Sticker t={t} at={a + 0.1} text="আসল ঘটনা" color={C.signature} rotate={-3} size={54} /></Center>
      <div style={{opacity: 1 - part2}}>
        <Center top={460}><Chip size={44} bg="rgba(255,255,255,0.1)">১৭ নভেম্বর রাত · শুধু ঢাকায়</Chip></Center>
        <div style={{position: 'absolute', left: 60, right: 60, top: 600, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 26}}>
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} style={{position: 'relative', transform: `scale(${pop(t, A.n5 - 0.6 + i * 0.15)})`}}>
              <Bus t={t} w={280} fire={ramp(t, A.n5 - 0.4 + i * 0.15, A.n5 + i * 0.15)} passengers={false} />
            </div>
          ))}
        </div>
        {t > A.n5 && <Center top={1080}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: FIRE}}>এক রাতে ৫টা বাসে আগুন</div></Center>}
      </div>
      {part2 > 0 && (
        <div style={{opacity: part2}}>
          <Center top={460}><Chip size={40} bg="rgba(255,255,255,0.1)">পুলিশ সদর দপ্তর · ৭–১৬ নভেম্বর</Chip></Center>
          <Center top={600}><Odometer t={t} at={A.n49 - 1.2} dur={1.3} target={49} pattern="00" size={260} color={FIRE} /></Center>
          {t > A.n49 - 0.1 && <Center top={920}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.text, opacity: ramp(t, A.n49, A.n49 + 0.3)}}>যানবাহনে আগুন, মাত্র ১০ দিনে</div></Center>}
        </div>
      )}
    </Stage>
  );
};

// ---------------- S3: follow ----------------
const S3: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.disguise;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}>
        <Title size={80}>পরিবারকে নিরাপদ</Title>
        <Title size={80} color={C.good}>রাখার কথা, এখানে</Title>
      </div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};

// ---------------- S4: disguised as passengers; smoke is the bigger danger ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.disguise, b = A.rules;
  const two = ramp(t, A.smokebig - 0.2, A.smokebig + 0.2);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{opacity: 1 - two}}>
        <div style={{position: 'absolute', left: 140, top: 420, transform: `scale(${pop(t, a + 0.1)})`}}><Bean kind="you" size={200} t={t} /></div>
        <div style={{position: 'absolute', left: 420, top: 420, transform: `scale(${pop(t, a + 0.3)})`}}><Bean kind="scammer" size={200} t={t} phase={1} /></div>
        <div style={{position: 'absolute', left: 520, top: 640, transform: `scale(${pop(t, a + 0.6)})`}}><Bag size={120} /></div>
        <div style={{position: 'absolute', left: 700, top: 420, transform: `scale(${pop(t, a + 0.2)})`}}><Bean kind="ammu" size={200} t={t} phase={2} /></div>
        {t > wordAt('যাত্রী', a) && <Center top={830}><Sticker t={t} at={wordAt('যাত্রী', a) + 0.1} text="যাত্রী সেজেই উঠেছিল" color={C.danger} rotate={-3} size={56} /></Center>}
        <LabelExample style={{left: 140, top: 380}} />
      </div>
      {two > 0 && (
        <div style={{opacity: two}}>
          <div style={{position: 'absolute', left: 80, right: 80, top: 360, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{width: 380, height: 380, borderRadius: 40, background: 'rgba(255,122,47,0.14)', border: `4px solid ${FIRE}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
              <Flames t={t} size={150} />
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.text}}>আগুন</div>
            </div>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 110, color: C.muted, transform: `scale(${pop(t, wordAt('ধোঁয়া', A.smokebig) - 0.2)})`}}>{'<'}</div>
            <div style={{position: 'relative', width: 380, height: 380, borderRadius: 40, background: 'rgba(150,150,170,0.18)', border: '4px solid #B8BCD6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 40, overflow: 'hidden', transform: `scale(${lerp(1, 1.08, pop(t, wordAt('ধোঁয়া', A.smokebig)))})`}}>
              <Smoke t={t} k={1} top={0} h={200} />
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.text}}>ধোঁয়া</div>
            </div>
          </div>
          <Center top={820}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text, opacity: ramp(t, A.smokebig + 0.6, A.smokebig + 1)}}>অনেক সময় ধোঁয়াই বড় বিপদ</div></Center>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S5: four rules ----------------
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.rules, b = A.k1;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={440}><Title size={100}>৪টা কথা</Title></Center>
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', gap: 34}}>
        {['১', '২', '৩', '৪'].map((n, i) => (
          <div key={i} style={{width: 160, height: 160, borderRadius: 99, background: C.good, border: '8px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 90, color: C.ink, transform: `scale(${pop(t, a + 0.3 + i * 0.15)})`}}>{n}</div>
        ))}
      </div>
    </Stage>
  );
};

// ---------------- R1: know the exits; report unattended bags ----------------
const R1: React.FC<{t: number}> = ({t}) => {
  const a = A.k1, b = A.k2;
  const doorAt = wordAt('দরজা', a), winAt = wordAt('জরুরি', a);
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="১" t={t} at={a} />
      <RuleTitle t={t} at={a + 0.1}>বাসে উঠেই দেখে নিন<br /><span style={{color: C.good}}>দরজা আর জরুরি জানালা</span></RuleTitle>
      <div style={{position: 'absolute', left: 90, top: 560}}>
        <Bus t={t} w={900} doorGlow={ramp(t, doorAt, doorAt + 0.3)} winGlow={ramp(t, winAt, winAt + 0.3)} />
        {t > doorAt && <div style={{position: 'absolute', left: 40, top: 400, opacity: ramp(t, doorAt, doorAt + 0.3)}}><Chip size={32} bg={C.good} color={C.ink}>দরজা</Chip></div>}
        {t > winAt && <div style={{position: 'absolute', left: 380, top: -70, opacity: ramp(t, winAt, winAt + 0.3)}}><Chip size={32} bg={C.good} color={C.ink}>জরুরি জানালা</Chip></div>}
      </div>
      {t > A.bag - 0.2 && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 1070, display: 'flex', alignItems: 'center', gap: 28, transform: `scale(${pop(t, A.bag - 0.1)})`}}>
          <div style={{position: 'relative'}}>
            <Bag size={150} />
            <div style={{position: 'absolute', right: -24, top: -24, width: 70, height: 70, borderRadius: 99, background: C.warn, border: '5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink, transform: `rotate(${Math.sin(t * 5) * 12}deg)`}}>?</div>
          </div>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: C.text, lineHeight: 1.3}}>মালিকহীন ব্যাগ দেখলে<br /><span style={{color: C.warn}}>চালক বা হেল্পারকে বলুন</span></div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- R2: get out now; no pushing ----------------
const R2: React.FC<{t: number}> = ({t}) => {
  const a = A.k2, b = A.k3;
  const go = ease((t - wordAt('বের', a)) / 1.2);
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="২" t={t} at={a} />
      <RuleTitle t={t} at={a + 0.1}>জিনিসপত্রের মায়া না করে<br /><span style={{color: C.good}}>সাথে সাথে বের হন</span></RuleTitle>
      <div style={{position: 'absolute', left: 120, top: 560, transform: `scale(${pop(t, a + 0.4)})`}}>
        <div style={{position: 'relative'}}>
          <Bag size={160} />
          <div style={{position: 'absolute', left: -10, top: 60, width: 190}}><Scribble t={t} at={wordAt('মায়া', a)} w={190} h={60} /></div>
        </div>
      </div>
      <div style={{position: 'absolute', left: lerp(420, 700, go), top: 560}}><Bean kind="you" size={170} t={t} /></div>
      <svg width="260" height="80" viewBox="0 0 260 80" style={{position: 'absolute', left: 560, top: 820, opacity: ramp(t, wordAt('বের', a), wordAt('বের', a) + 0.3)}}><path d="M10 40 H220 M190 12 L230 40 L190 68" fill="none" stroke={C.good} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {t > A.nopush - 0.2 && (
        <div style={{position: 'absolute', left: 90, right: 90, top: 940, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 20, transform: `scale(${pop(t, A.nopush)})`}}>
          <Bean kind="abbu" size={150} t={t} />
          <Bean kind="you" size={170} t={t} phase={1} />
          <Bean kind="bhai" size={110} t={t} phase={2} />
          <div style={{alignSelf: 'center', marginLeft: 20}}><Chip size={36} bg="rgba(38,198,218,0.2)">ধাক্কাধাক্কি নয়, হাত ধরে নামান</Chip></div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- R3: stay low under the smoke ----------------
const R3: React.FC<{t: number}> = ({t}) => {
  const a = A.k3, b = A.k4;
  const crouch = ease((t - A.low) / 0.6);
  const cloth = ramp(t, wordAt('রুমাল', A.low), wordAt('রুমাল', A.low) + 0.4);
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="৩" t={t} at={a} />
      <RuleTitle t={t} at={a + 0.1}>ধোঁয়া ওপরের দিকে জমে</RuleTitle>
      <div style={{position: 'absolute', left: 80, right: 80, top: 440, height: 640, borderRadius: 40, background: 'rgba(255,255,255,0.04)', border: '3px solid rgba(255,255,255,0.12)', overflow: 'hidden'}}>
        <Smoke t={t} k={ramp(t, a + 0.3, a + 1.6)} top={-40} h={330} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 300, borderTop: '4px dashed rgba(255,255,255,0.4)', opacity: ramp(t, a + 1.2, a + 1.6)}} />
        <div style={{position: 'absolute', left: 40, top: 300 - 34, opacity: ramp(t, a + 1.2, a + 1.6)}}><Chip size={28} bg="rgba(150,150,170,0.4)">ধোঁয়া</Chip></div>
        <div style={{position: 'absolute', left: 340, top: lerp(200, 330, crouch), transform: `rotate(${crouch * 18}deg)`, transformOrigin: 'bottom center'}}>
          <div style={{position: 'relative'}}>
            <Bean kind="you" size={lerp(220, 180, crouch)} t={t} bounce={0.2} />
            <div style={{position: 'absolute', left: '26%', top: '33%', width: '48%', height: '14%', borderRadius: 10, background: '#F5F7FF', opacity: cloth}} />
          </div>
        </div>
        <svg width="200" height="80" viewBox="0 0 200 80" style={{position: 'absolute', right: 40, top: 520, opacity: crouch}}><path d="M10 40 H160 M130 12 L170 40 L130 68" fill="none" stroke={C.good} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {t > A.low && <div style={{position: 'absolute', left: 0, right: 0, top: 1120, display: 'flex', justifyContent: 'center', gap: 20}}>
        <div style={{transform: `scale(${pop(t, A.low + 0.1)})`}}><Chip size={38} bg={C.good} color={C.ink}>মাথা নিচু</Chip></div>
        <div style={{transform: `scale(${pop(t, wordAt('রুমাল', A.low))})`}}><Chip size={38} bg={C.good} color={C.ink}>নাক-মুখ ঢাকা</Chip></div>
      </div>}
    </Stage>
  );
};

// ---------------- R4: clothes on fire — don't run, drop and roll ----------------
const R4: React.FC<{t: number}> = ({t}) => {
  const a = A.k4, b = A.out;
  const steps = [
    {at: wordAt('দৌড়াবেন', a), text: 'দৌড়াবেন না', bad: true},
    {at: A.roll, text: 'মাটিতে শুয়ে পড়ুন', bad: false},
    {at: wordAt('গড়াগড়ি', A.roll), text: 'গড়াগড়ি দিন', bad: false},
  ];
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="৪" t={t} at={a} />
      <RuleTitle t={t} at={a + 0.1}>গায়ের কাপড়ে আগুন ধরলে</RuleTitle>
      <div style={{position: 'absolute', left: 60, right: 60, top: 480, display: 'flex', justifyContent: 'space-between'}}>
        {steps.map((s, i) => {
          const k = pop(t, s.at - 0.1);
          const rot = i === 2 ? (t - s.at) * 360 : i === 1 ? 90 : 0;
          return (
            <div key={i} style={{width: 300, height: 480, borderRadius: 36, background: 'rgba(255,255,255,0.05)', border: `4px solid ${s.bad ? C.danger : C.good}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px', transform: `scale(${k})`, opacity: clamp01(k * 2)}}>
              <div style={{position: 'relative', height: 250, display: 'flex', alignItems: 'center'}}>
                <div style={{transform: `rotate(${t > s.at ? rot : 0}deg)`}}><Bean kind="you" size={150} t={t} bounce={0} /></div>
                {s.bad && <div style={{position: 'absolute', left: -20, top: 60, width: 190}}><Scribble t={t} at={s.at + 0.2} w={190} h={80} /></div>}
              </div>
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 42, color: s.bad ? C.danger : C.good, textAlign: 'center', lineHeight: 1.2}}>{s.text}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// ---------------- S6: move away, no filming, call 102 / 999 ----------------
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.out, b = A.share;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 300, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{transform: `scale(${pop(t, a + 0.1)})`}}><Chip size={44} bg={C.good} color={C.ink}>দূরে সরে যান</Chip></div>
        {t > A.novideo - 0.2 && (
          <div style={{position: 'relative', transform: `scale(${pop(t, A.novideo)})`}}>
            <Phone w={150} h={250} tilt={8}><div style={{position: 'absolute', left: '50%', top: '50%', width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 99, background: C.danger}} /></Phone>
            <div style={{position: 'absolute', left: -20, top: 90, width: 200}}><Scribble t={t} at={A.novideo + 0.3} w={200} h={80} /></div>
          </div>
        )}
      </div>
      {t > A.novideo && <div style={{position: 'absolute', right: 80, top: 600, opacity: ramp(t, A.novideo + 0.3, A.novideo + 0.6)}}><Chip size={32} bg="rgba(255,77,109,0.2)">ভিডিও করতে দাঁড়াবেন না</Chip></div>}
      <div style={{position: 'absolute', left: 120, right: 120, top: 720, display: 'flex', flexDirection: 'column', gap: 30}}>
        <DialCard num="১০২" label="ফায়ার সার্ভিস" color={FIRE} k={pop(t, A.n102 - 0.2)} />
        <DialCard num="৯৯৯" label="জাতীয় জরুরি সেবা" color={C.signature} k={pop(t, A.n999 - 0.2)} />
      </div>
    </Stage>
  );
};

// ---------------- S7: share ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.share, b = A.question;
  const people: {kind: 'abbu' | 'ammu' | 'bhai'; label: string; x: number; y: number}[] = [
    {kind: 'abbu', label: 'আব্বু', x: 700, y: 400},
    {kind: 'ammu', label: 'আম্মু', x: 760, y: 700},
    {kind: 'bhai', label: 'ছোট ভাই', x: 640, y: 1000},
  ];
  const src = {x: 330, y: 820};
  const sendAt = wordAt('দিয়ে', a);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, top: 300, width: 600}}>
        <Title size={56}>প্রতিদিন বাসে</Title>
        <Title size={56} color={C.good}>যাতায়াত করেন যারা</Title>
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

// ---------------- S8: question, follow, key line ----------------
const S8: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.question;
  const msg = 'হ্যাঁ, প্রতিদিন অফিসে যাই';
  const typeP = ramp(t, A.comment - 0.2, A.comment + 0.8);
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="প্রতিদিন বাসে যাতায়াত করেন?" color={C.good} textColor={C.ink} rotate={-3} size={52} /></Center>
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
          <Title size={80}>দরজা চিনুন,</Title>
          <Title size={80} color={C.good}>ধোঁয়ায় মাথা নিচু</Title>
        </div>
      )}
    </Stage>
  );
};

// ---------------- cover / thumbnail (1080 x 1920 still) ----------------
export const Cover: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = 6;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Background t={0} blueprint={0} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 40% at 75% 55%, rgba(255,122,47,0.45) 0%, rgba(255,122,47,0) 100%)'}} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 300, textAlign: 'center'}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, lineHeight: 1.15, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>বাসে <span style={{color: FIRE}}>আগুন</span> লাগলে</div>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, lineHeight: 1.15, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>কী করবেন?</div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 820}}><Bus t={t} w={900} fire={1} smoke={0.7} /></div>
      <Center top={1300}><Sticker t={10} at={0} text="বাঁচার ৪টা নিয়ম" color={C.good} textColor={C.ink} rotate={-4} size={84} /></Center>
      <Center top={1520}><Chip size={40} bg="rgba(255,255,255,0.1)">এক রাতে ঢাকায় ৫টা বাসে আগুন</Chip></Center>
    </AbsoluteFill>
  );
};

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [
    {from: A.real, to: A.police, text: 'সূত্র: রূপালী বাংলাদেশ, কালের কণ্ঠ'},
    {from: A.police, to: A.follow, text: 'সূত্র: পুলিশ সদর দপ্তর (প্রথম আলো)'},
    {from: A.disguise, to: A.smokebig, text: 'সূত্র: বাংলাদেশ প্রতিদিন'},
    {from: A.k1, to: A.share, text: 'পরামর্শ: ফায়ার সার্ভিস ও সিভিল ডিফেন্স'},
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
      <R1 t={t} />
      <R2 t={t} />
      <R3 t={t} />
      <R4 t={t} />
      <S6 t={t} />
      <S7 t={t} />
      <S8 t={t} platform={platform} />
      <Vignette t={t} at={A.scream + 0.1} />
      <Iris t={t} at={A.real} x={W / 2} y={800} />
      <Iris t={t} at={A.rules} x={W / 2} y={800} />
      <BrandPill platform={platform} />
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
