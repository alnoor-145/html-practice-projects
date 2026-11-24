import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Platform, SourcePill, Stage, Sticker, Title, W, ease, pop, ramp, useFonts, useT, FPS} from './lib';
import {bnum} from './iso';

// Video 026: Karnaphuli tunnel. Own drawn cross-sections; no photos, no logos.
const YEL = '#FFC24D', CY = '#26C6DA', MUD = '#8A7352', WATER = '#1E4E8C', RING = '#B9C3E0', RED = '#FF4D6D';
const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Ship: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-110 0 H110 L88 36 H-88 Z" fill="#D5DAEE" /><rect x="-40" y="-36" width="70" height="36" fill="#9FB4E6" /><rect x="-4" y="-60" width="12" height="24" fill="#9FB4E6" /></g>
);
const Car: React.FC<{x: number; y: number; c?: string}> = ({x, y, c = '#FF7A2F'}) => (
  <g transform={`translate(${x} ${y})`}><rect x="-34" y="-20" width="68" height="22" rx="8" fill={c} /><rect x="-18" y="-34" width="36" height="16" rx="6" fill={c} /><circle cx="-18" cy="4" r="8" fill="#14102E" /><circle cx="18" cy="4" r="8" fill="#14102E" /></g>
);
// river + riverbed + tunnel tube (cross-section along the river)
const Scene: React.FC<{t: number; top: number; tunnel?: boolean; carsOn?: boolean}> = ({t, top, tunnel = true, carsOn = true}) => (
  <svg width={W} height={1700} style={{position: 'absolute', left: 0, top: 0}}>
    <rect x="0" y={top} width={W} height="150" fill={WATER} opacity="0.9" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={((i * 250 + t * 40) % 1300) - 200} y={top + 24 + (i % 3) * 36} width="180" height="8" rx="4" fill="#fff" opacity="0.22" />)}
    <rect x="0" y={top + 150} width={W} height="330" fill={MUD} />
    {tunnel && <><rect x="40" y={top + 250} width="1000" height="120" rx="60" fill="#2B2250" stroke={RING} strokeWidth="14" /><line x1="80" y1={top + 310} x2="1000" y2={top + 310} stroke="#fff" strokeWidth="4" strokeDasharray="26 22" strokeDashoffset={-t * 90} opacity="0.7" />{carsOn && [0, 1, 2].map((i) => <Car key={i} x={((t * 140 + i * 380) % 1200) - 100} y={top + 300} c={['#FF7A2F', '#4D8BFF', YEL][i]} />)}</>}
  </svg>
);
const S1: React.FC<{t: number}> = ({t}) => {
  const a = 0, b = A.follow;
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <Scene t={t} top={640} />
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Ship x={((t - A.ships) * 150 + 100) % 1400 - 200 + 200} y={625} s={1.2} /></svg>
      <Center top={300}><Title size={64}>নদীর তলা দিয়ে গাড়ি,</Title></Center>
      {t > A.ships && <Center top={400}><Title size={64} color={YEL}>ওপর দিয়ে জাহাজ</Title></Center>}
      {t > A.name - 0.2 && <Center top={1180}><div style={{transform: `scale(${pop(t, A.name)})`, padding: '18px 34px', borderRadius: 28, background: '#0E0A1F', border: `4px solid ${YEL}`, textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.muted}}>দেশের প্রথম নদীর তলার সুড়ঙ্গ</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: C.text}}>বঙ্গবন্ধু শেখ মুজিবুর রহমান টানেল</div></div></Center>}
      {t > A.len - 0.2 && <Center top={1050}><Chip size={46} bg={CY} color={C.ink}>লম্বা প্রায় ৩.৩ কিলোমিটার</Chip></Center>}
    </Stage>
  );
};
const S2: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.port;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}><Title size={74}>বিশাল প্রকল্পের</Title><Title size={74} color={YEL}>ভেতরের গল্প</Title></div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};
const S3: React.FC<{t: number}> = ({t}) => {
  const a = A.port, b = A.soft;
  const q = t > A.ask - 0.1;
  const flood = q ? ease((t - A.ask - 2.5) / 2.5) : 0;
  return (
    <Stage t={t} a={a} b={b}>
      <Scene t={t} top={640} />
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Ship x={((t - a) * 120 + 100) % 1400 - 100} y={625} s={1.2} /></svg>
      <Center top={300}><Title size={60}>কর্ণফুলী: চট্টগ্রাম বন্দরের নদী</Title></Center>
      {t > A.port + 3.5 && !q && <Center top={1180}><Sticker t={t} at={A.port + 3.5} text="এখন তলা দিয়ে চলে গাড়ি" color={CY} textColor={C.ink} rotate={-3} size={50} /></Center>}
      {q && <Center top={1180}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.warn, transform: `scale(${pop(t, A.ask)})`}}>?</div></Center>}
      {q && <Center top={1100}><div style={{opacity: 0}} /></Center>}
    </Stage>
  );
};
// soft mud + weight; why; slurry
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.soft, b = A.slurry;
  const press = ease((t - A.heavy) / 1.5);
  return (
    <Stage t={t} a={a} b={b}>
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x="0" y="560" width={W} height="180" fill={WATER} opacity="0.9" />
        <rect x="0" y="740" width={W} height="440" fill={MUD} />
        {Array.from({length: 18}).map((_, i) => <circle key={i} cx={60 + (i * 137) % 960} cy={780 + (i * 71) % 380 + Math.sin(t * 2 + i) * 4} r={10 + (i % 3) * 4} fill="#6E593C" opacity="0.7" />)}
        {t > A.heavy - 0.2 && [0, 1, 2, 3, 4].map((i) => <g key={i} opacity={press}><line x1={140 + i * 200} y1="590" x2={140 + i * 200} y2={720 + 20 * Math.sin(t * 6 + i)} stroke="#fff" strokeWidth="6" /><path d={`M${120 + i * 200} 700 L${140 + i * 200} 735 L${160 + i * 200} 700`} fill="none" stroke="#fff" strokeWidth="6" /></g>)}
      </svg>
      <Center top={290}><Title size={54}>নরম মাটি, ওপরে নদীর ওজন</Title></Center>
      {t > A.soft - 0.2 && t < A.heavy && <Center top={1230}><Chip size={44} bg="rgba(255,255,255,0.1)">মাটি যত নরম, খোঁড়া তত কঠিন</Chip></Center>}
      {t >= A.heavy && t < A.why && <Center top={1230}><Chip size={44} bg={YEL} color={C.ink}>কাদাটে মাটি নিজেকে ধরে রাখতে পারে না</Chip></Center>}
      {t >= A.why && <Center top={1230}><Sticker t={t} at={A.why} text="সাধারণ পদ্ধতিতে খোঁড়া ঝুঁকির" color={RED} rotate={-3} size={46} /></Center>}
    </Stage>
  );
};
// TBM
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.slurry, b = A.two;
  const adv = (t - a) * 7;
  const x0 = 380 + adv * 0.8;
  const nRings = Math.max(0, Math.min(14, Math.floor((t - A.rings) / 1.1)));
  const slurryOn = t > A.tbm + 1.5;
  return (
    <Stage t={t} a={a} b={b}>
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x="0" y="560" width={W} height="120" fill={WATER} opacity="0.9" />
        <rect x="0" y="680" width={W} height="520" fill={MUD} />
        <g transform={`translate(0 ${t > A.adv ? 0 : 0})`}>
          {Array.from({length: nRings}).map((_, i) => <rect key={i} x={x0 - 20 - 56 * (i + 1) - 140 + 120} y="840" width="46" height="170" rx="8" fill={RING} stroke="#8A93B2" strokeWidth="3" />)}
          <rect x={x0 - 200} y="860" width="260" height="130" rx="20" fill="#E9C58A" stroke="#fff" strokeWidth="4" />
          <g transform={`translate(${x0 + 70} 925) rotate(${t * 120})`}><circle r="80" fill="none" stroke={YEL} strokeWidth="10" />{[0, 60, 120].map((r) => <line key={r} x1="-80" y1="0" x2="80" y2="0" stroke={YEL} strokeWidth="8" transform={`rotate(${r})`} />)}</g>
          {slurryOn && <rect x={x0 + 150} y="850" width="120" height="150" rx="30" fill={CY} opacity={0.35 + 0.15 * Math.sin(t * 6)} />}
        </g>
      </svg>
      <Center top={290}><Title size={54}>স্লারি প্রেশার পদ্ধতি</Title></Center>
      {t > A.tbm - 0.2 && t < A.mix && <Center top={1230}><Chip size={42} bg="rgba(255,255,255,0.1)">টানেল বোরিং মেশিন মাটি কাটে</Chip></Center>}
      {t >= A.mix - 0.2 && t < A.rings && <Center top={1230}><Chip size={42} bg={CY} color={C.ink}>চাপ দেওয়া ঘন কাদা মাটি-পানিকে ঠেকায়</Chip></Center>}
      {t >= A.rings - 0.2 && t < A.imagine && <Center top={1230}><Chip size={42} bg={YEL} color={C.ink}>পেছনে কংক্রিটের রিং, একটার পর একটা</Chip></Center>}
      {t >= A.imagine - 0.2 && t < A.adv && <Center top={1230}><Chip size={42} bg="rgba(255,255,255,0.1)">কাটা মাটি কাদার সাথে বাইরে আসে</Chip></Center>}
      {t >= A.adv - 0.2 && <Center top={1230}><Sticker t={t} at={A.adv} text="ধীরে ধীরে, মিটারের পর মিটার" color={C.good} textColor={C.ink} rotate={-3} size={46} /></Center>}
    </Stage>
  );
};
// two tubes + dates + cost
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.two, b = A.hard;
  const cost = ease((t - A.cost - 0.4) / 1.6);
  return (
    <Stage t={t} a={a} b={b}>
      {t < A.dates - 0.2 && <><Center top={290}><Title size={56}>সুড়ঙ্গ একটা নয়, দুটো</Title></Center><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>{[0, 1].map((i) => { const k = ease((t - A.two - 0.8 - i * 0.7) / 0.6); return <g key={i} transform={`translate(${340 + i * 400} 800) scale(${k})`}><circle r="170" fill="#2B2250" stroke={RING} strokeWidth="26" /><text x="0" y="20" textAnchor="middle" fontSize="80" fill={i ? CY : YEL} fontFamily={FONT} fontWeight="800">{i ? '←' : '→'}</text></g>; })}</svg>{t > A.two + 5 && <Center top={1100}><Chip size={42} bg="rgba(255,255,255,0.1)">যাওয়ার আর আসার গাড়ির জন্য আলাদা পথ</Chip></Center>}</>}
      {t >= A.dates - 0.2 && t < A.cost - 0.2 && <><Center top={300}><Title size={56}>খোঁড়া থেকে খোলা</Title></Center><div style={{position: 'absolute', left: 100, top: 560, width: 880, display: 'flex', flexDirection: 'column', gap: 40}}>
        <div style={{opacity: ramp(t, A.dates, A.dates + 0.4), transform: `scale(${pop(t, A.dates)})`, padding: '24px 30px', borderRadius: 28, background: 'rgba(255,255,255,0.08)', border: `4px solid ${YEL}`}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.muted}}>আনুষ্ঠানিক খোঁড়া শুরু</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: YEL}}>২৪ ফেব্রুয়ারি ২০১৯</div></div>
        <div style={{opacity: ramp(t, A.open, A.open + 0.4), transform: `scale(${pop(t, A.open)})`, padding: '24px 30px', borderRadius: 28, background: 'rgba(255,255,255,0.08)', border: `4px solid ${CY}`}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.muted}}>যান চলাচলের জন্য খোলা</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: CY}}>২৮ অক্টোবর ২০২৩</div></div></div></>}
      {t >= A.cost - 0.2 && <><Center top={400}><div style={{textAlign: 'center', transform: `scale(${pop(t, A.cost)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.muted}}>খরচ প্রায়</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, color: YEL, lineHeight: 1.05}}>{(() => { const v = bnum(Math.round(10374 * cost)); return v.length > 3 ? v.slice(0, -3) + ',' + v.slice(-3) : v; })()}</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text}}>কোটি টাকা</div></div></Center>{t >= A.builder - 0.2 && <Center top={1000}><Chip size={46} bg="rgba(255,255,255,0.1)">নির্মাণ: চীনের একটি প্রতিষ্ঠান</Chip></Center>}</>}
    </Stage>
  );
};
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.hard, b = A.q;
  const items = ['ভেতরে পানি ঢোকা ঠেকানো', 'পরীক্ষা', 'নজরদারি'];
  return (
    <Stage t={t} a={a} b={b}>
      {t < A.tests - 0.2 && <><Center top={300}><Title size={56}>ইঞ্জিনিয়ারিংয়ের ভাষায়</Title></Center><Center top={520}><div style={{textAlign: 'center', transform: `scale(${pop(t, A.hard + 0.8)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 90, color: RED, lineHeight: 1.1}}>খুব কঠিন কাজ</div><div style={{marginTop: 20, fontFamily: FONT_BN, fontWeight: 700, fontSize: 50, color: C.text}}>ভুলের সুযোগ প্রায় নেই</div></div></Center>{t > A.hard + 6 && <Center top={1000}><Sticker t={t} at={A.hard + 6} text="নদী পেরোনোর নতুন পথ" color={C.good} textColor={C.ink} rotate={-3} size={52} /></Center>}</>}
      {t >= A.tests - 0.2 && <><Center top={300}><Title size={56}>সবচেয়ে জরুরি</Title></Center><div style={{position: 'absolute', left: 110, top: 560, display: 'flex', flexDirection: 'column', gap: 36}}>{items.map((x, i) => { const k = ease((t - A.tests - i * 1.1) / 0.4); return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: 0.25 + 0.75 * k}}><div style={{width: 76, height: 76, borderRadius: 18, border: `5px solid ${C.good}`, background: `rgba(38,198,218,${0.9 * k})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 40 40" width="50" height="50"><path d="M8 21 L17 30 L33 11" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - k)} /></svg></div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 50, color: C.text}}>{x}</div></div>; })}</div></>}
    </Stage>
  );
};
const S8: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.q;
  const msg = 'গিয়েছি, দারুণ লেগেছিল';
  const typeP = ramp(t, a + 3.2, a + 4.8);
  const keyAt = A.end + 0.25;
  return (
    <Stage t={t} a={a} b={A.end + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="কর্ণফুলীর তলা দিয়ে গিয়েছেন?" color={YEL} textColor={C.ink} rotate={-3} size={52} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}><div style={{display: 'flex', alignItems: 'center', gap: 14}}><div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} /><div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.text}}>{t > a + 3.2 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div></div><div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div></div>
      {t > A.send - 0.1 && <div style={{position: 'absolute', left: 120, top: 740, display: 'flex', gap: 40, opacity: ramp(t, A.send, A.send + 0.4)}}><Bean kind="bhai" size={150} t={t} mood="happy" /><div style={{alignSelf: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.signature}}>→</div><Bean kind="bon" size={150} t={t} mood="happy" phase={1} /></div>}
      <FollowPill t={t} at={A.cta_word} platform={platform} top={980} opacity={ramp(t, A.cta, A.cta + 0.4)} />
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={1030} />
      {t > keyAt - 0.1 && <div style={{position: 'absolute', left: 60, right: 60, top: 1180, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}><Title size={72}>নদীর তলার</Title><Title size={72} color={YEL}>ইঞ্জিনিয়ারিং</Title></div>}
    </Stage>
  );
};
export const Cover: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Background t={0} blueprint={0} />
      <Scene t={3} top={900} />
      <svg width={W} height={1920} style={{position: 'absolute', left: 0, top: 0}}><Ship x={300} y={885} s={1.4} /></svg>
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 290, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 118, lineHeight: 1.12, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>নদীর <span style={{color: YEL}}>তলা</span> দিয়ে<br />গাড়ি চলে!</div>
      <Center top={760}><Sticker t={10} at={0} text="কর্ণফুলী টানেলের গল্প" color={RED} rotate={-3} size={56} /></Center>
    </AbsoluteFill>
  );
};
const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.1, file: 'whoosh', vol: 0.4}, {at: A.name, file: 'tick', vol: 0.8}, {at: A.len, file: 'counter_roll', vol: 0.4}, {at: A.follow - 0.3, file: 'whoosh', vol: 0.3}, {at: A.port, file: 'whoosh', vol: 0.3}, {at: A.ask, file: 'rise_stinger', vol: 0.4},
  {at: A.soft, file: 'whoosh', vol: 0.3}, {at: A.heavy, file: 'impact_boom', vol: 0.4}, {at: A.slurry, file: 'whoosh', vol: 0.35}, {at: A.mix, file: 'tick', vol: 0.8}, {at: A.rings, file: 'tick', vol: 0.8}, {at: A.two, file: 'whoosh', vol: 0.3}, {at: A.dates, file: 'tick', vol: 0.8}, {at: A.open, file: 'tick', vol: 0.8},
  {at: A.cost, file: 'counter_roll', vol: 0.5}, {at: A.hard, file: 'whoosh', vol: 0.3}, {at: A.tests, file: 'tick', vol: 0.8}, {at: A.cta - 0.8, file: 'whoosh', vol: 0.25},
];
export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [{from: A.name, to: A.follow, text: 'সূত্র: UNB, TBS'}, {from: A.dates, to: A.hard, text: 'সূত্র: Prothom Alo, Daily Star'}];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      {SFX.map((s, i) => <Sequence key={i} from={Math.round(s.at * FPS)}><Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.vol * 0.5} /></Sequence>)}
      <Background t={t} blueprint={0} />
      <S1 t={t} /><S2 t={t} platform={platform} /><S3 t={t} /><S4 t={t} /><S5 t={t} /><S6 t={t} /><S7 t={t} /><S8 t={t} platform={platform} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, top: 214, fontFamily: FONT_BN, fontWeight: 600, fontSize: 23, color: C.muted, opacity: 0.85}}>আঁকা গ্রাফিক্স · আসল ছবি নয়</div>
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
