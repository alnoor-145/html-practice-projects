import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Platform, SourcePill, Stage, Sticker, Title, W, ease, pop, ramp, useFonts, useT, FPS} from './lib';
import {IsoBox, bnum} from './iso';

// Video 025: Padma Bridge piles. Own drawn cross-sections, no real photos.
const YEL = '#FFC24D', CY = '#26C6DA', SAND = '#D9B77E', SILT = '#9C8660', ROCK = '#6B6F85', WATER = '#1E4E8C', STEEL = '#B9C3E0';
const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
// cross-section: water top, soft layers, hard layer at bottom
const Section: React.FC<{t: number; top?: number; hard?: boolean; wave?: number}> = ({t, top = 700, hard = true, wave = 1}) => (
  <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
    <rect x="0" y={top} width={W} height="170" fill={WATER} opacity="0.85" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={((i * 260 + t * 40 * wave) % 1300) - 200} y={top + 30 + (i % 3) * 40} width="180" height="8" rx="4" fill="#fff" opacity="0.2" />)}
    <rect x="0" y={top + 170} width={W} height="260" fill={SAND} /><rect x="0" y={top + 300} width={W} height="130" fill={SILT} opacity="0.6" />
    {hard && <rect x="0" y={top + 430} width={W} height="220" fill={ROCK} />}
    <rect x="0" y={top - 120} width={W} height="120" fill="rgba(0,0,0,0)" />
  </svg>
);
const Pillar: React.FC<{x: number; y: number; w?: number; h?: number; sink?: number}> = ({x, y, w = 150, h = 230, sink = 0}) => (
  <g transform={`translate(0 ${sink})`}><rect x={x - w / 2} y={y - h} width={w} height={h} fill="#E9EEF8" /><rect x={x - w / 2} y={y - h} width={w / 3} height={h} fill="#C7CDE6" /><rect x={x - w / 2 - 30} y={y - h - 26} width={w + 60} height="26" fill="#F5F7FF" /></g>
);
const Pile: React.FC<{x: number; y: number; len: number; tilt?: number; w?: number}> = ({x, y, len, tilt = 0, w = 26}) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`}><rect x={-w / 2} y="0" width={w} height={len} fill={STEEL} /><rect x={-w / 2} y="0" width={w / 3} height={len} fill="#8A93B2" /></g>
);

const S1: React.FC<{t: number}> = ({t}) => {
  const a = 0, b = A.follow;
  const depth = ease((t - A.depth) / 1.5);
  const showSec = t > A.ans - 0.2;
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      {!showSec && (
        <>
          <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
            <rect x="0" y="900" width={W} height="500" fill={WATER} opacity="0.9" />
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={((i * 230 + t * 60) % 1300) - 200} y={930 + i * 60} width="200" height="9" rx="4" fill="#fff" opacity="0.22" />)}
            <rect x="0" y="640" width={W} height="60" fill="#E9EEF8" /><rect x="0" y="700" width={W} height="20" fill="#8A93B2" />
            {Array.from({length: 8}).map((_, i) => { const k = ease((t - A.pillars - i * 0.12) / 0.4); return <rect key={i} x={70 + i * 130} y={720} width="40" height={190 * k} fill="#C7CDE6" />; })}
          </svg>
          <Center top={300}><Title size={96}>পদ্মা নদী</Title></Center>
          {t > A.rain && t < A.pillars && <Center top={1100}><Chip size={42} bg="rgba(255,255,255,0.1)">বর্ষায় পানি আর মাটি প্রতিদিন নড়ে</Chip></Center>}
          {t > A.pillars - 0.2 && <Center top={470}><div style={{transform: `scale(${pop(t, A.pillars)})`, padding: '12px 40px', borderRadius: 26, background: YEL, fontFamily: FONT_BN, fontWeight: 800, fontSize: 80, color: C.ink}}>{bnum(Math.round(40 * ease((t - A.pillars) / 1)))}টা পিলার</div></Center>}
          {t > A.how - 0.1 && <Center top={1000}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.warn, transform: `scale(${pop(t, A.how)})`}}>?</div></Center>}
        </>
      )}
      {showSec && (
        <>
          <Section t={t} top={700} />
          <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Pillar x={540} y={740} h={240} /><Pile x={540} y={870} len={Math.max(1, 480 * depth)} w={40} /></svg>
          <Center top={290}><Chip size={44} bg="rgba(255,255,255,0.1)">উত্তর: পানির নিচে, মাটির ভেতরে</Chip></Center>
          {t > A.depth - 0.2 && <div style={{position: 'absolute', left: 640, top: 1130, opacity: ramp(t, A.depth, A.depth + 0.4)}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 80, color: '#fff', lineHeight: 1}}>~{bnum(Math.round(120 * depth))}</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.text}}>মিটার গভীরে</div></div>}
        </>
      )}
    </Stage>
  );
};
const S2: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.problem;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}><Title size={74}>ইঞ্জিনিয়ারিংয়ের গল্প</Title><Title size={74} color={YEL}>আরও জানতে</Title></div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};
// S3 problem: soft ground, sinking, book analogy
const S3: React.FC<{t: number}> = ({t}) => {
  const a = A.problem, b = A.solution;
  const sink = ease((t - A.problem - 4) / 4) * 60;
  const book = t >= A.book - 0.2 && t < A.strong;
  const bsink = ease((t - A.book - 2) / 3) * 40;
  return (
    <Stage t={t} a={a} b={b}>
      {t < A.book && <><Section t={t} top={620} hard={false} /><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Pillar x={540} y={700} h={240} sink={sink} /></svg><Center top={300}><Title size={56}>নদীর তলার নরম মাটি</Title></Center>
        {t > A.soft - 0.2 && <><Center top={1170}><div style={{display: 'flex', gap: 24}}><Chip size={40} bg={SAND} color={C.ink}>নরম বালি</Chip><Chip size={40} bg={SILT} color={C.ink}>পলি</Chip></div></Center></>}
        {t > A.problem + 4 && t < A.book && <Center top={1270}><Sticker t={t} at={A.problem + 4} text="ধীরে ধীরে ডেবে যেতে পারত" color="#FF4D6D" rotate={-3} size={46} /></Center>}</>}
      {book && <><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="140" y="900" width="800" height="180" rx="24" fill={SAND} />{[0, 1, 2].map((i) => <rect key={i} x={380 + i * 8} y={800 - i * 50 + bsink} width="320" height="46" rx="6" fill={['#FF4D6D', '#4D8BFF', YEL][i]} />)}</svg><Center top={300}><Title size={56}>বালির ওপর ভারী বই?</Title></Center>{t > A.book + 5 && <Center top={1170}><Sticker t={t} at={A.book + 5} text="ধীরে ধীরে ডেবে যায়" color="#FF4D6D" rotate={-3} size={52} /></Center>}</>}
      {t >= A.strong && <>
        <Section t={t} top={620} hard={false} wave={3} /><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Pillar x={540} y={700} h={240} /></svg>
        <Center top={1170}><div style={{display: 'flex', gap: 24}}>{t > A.strong - 0.2 && <Chip size={40} bg={CY} color={C.ink}>প্রবল স্রোত</Chip>}{t > A.strong + 3 && <Chip size={40} bg={YEL} color={C.ink}>বর্ষায় মাটি সরে</Chip>}</div></Center>
        <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>{[0, 1, 2].map((i) => <path key={i} d={`M100 ${760 + i * 50} L900 ${760 + i * 50}`} stroke={CY} strokeWidth="8" strokeDasharray="30 22" strokeDashoffset={-t * 120} opacity="0.8" />)}</svg>
      </>}
    </Stage>
  );
};
// S4 solution: hard layer; piles; pipe diameter; hammer; german
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.solution, b = A.tilt;
  const down = ease((t - A.layer - 1) / 3);
  const hammer = Math.abs(Math.sin((t - A.hammer) * 5));
  const pile = t >= A.pipe - 0.2;
  const dia = t >= A.dia - 0.2 && t < A.hammer;
  const ham = t >= A.hammer - 0.2;
  return (
    <Stage t={t} a={a} b={b}>
      {!pile && <><Section t={t} top={560} hard /><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Pillar x={540} y={600} h={240} /><Pile x={540} y={730} len={Math.max(1, 520 * down)} w={46} /></svg><Center top={290}><Title size={54}>নরম মাটির ওপর নয়</Title></Center>{t > A.layer && <Center top={1260}><Sticker t={t} at={A.layer} text="শক্ত স্তরে ভর" color={CY} textColor={C.ink} rotate={-3} size={52} /></Center>}</>}
      {pile && !ham && <><Center top={300}><Title size={60}>ইস্পাতের পাইপ = পাইল</Title></Center><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="240" y="560" width="600" height="360" rx="60" fill="none" stroke={STEEL} strokeWidth="44" /><ellipse cx="540" cy="740" rx="256" ry="160" fill="#14102E" opacity="0.8" /></svg>
        {dia && <><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><line x1="240" y1="1000" x2="840" y2="1000" stroke="#fff" strokeWidth="5" /><line x1="240" y1="980" x2="240" y2="1020" stroke="#fff" strokeWidth="5" /><line x1="840" y1="980" x2="840" y2="1020" stroke="#fff" strokeWidth="5" /></svg><Center top={1040}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.text}}>ব্যাস প্রায় ৩ মিটার</div></Center></>}</>}
      {ham && <><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="0" y="900" width={W} height="500" fill={SAND} /><rect x="0" y="1100" width={W} height="300" fill={ROCK} /><Pile x={540} y={520 + hammer * 20 + 200 * ease((t - A.hammer) / 6)} len={500} w={56} /><g transform={`translate(540 ${400 + hammer * 120 - 90})`}><rect x="-80" y="-40" width="160" height="80" rx="14" fill={YEL} /><rect x="-20" y="-120" width="40" height="80" fill="#8A93B2" /></g></svg>
        <Center top={300}><Title size={54}>বিশাল হাতুড়ি দিয়ে পেটানো</Title></Center>{t > A.german - 0.2 && <Center top={1300}><Chip size={42} bg="rgba(255,255,255,0.1)">জার্মানি থেকে বিশেষ ক্রেন আর হাতুড়ি</Chip></Center>}</>}
    </Stage>
  );
};
// S5 tilt, wide human, platform
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.tilt, b = A.per;
  const tilt = ease((t - A.tilt - 1.5) / 1.5) * 12;
  const hum = t >= A.human - 0.5 && t < A.platform;
  return (
    <Stage t={t} a={a} b={b}>
      {t < A.wide && <><Section t={t} top={560} hard /><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Pillar x={540} y={600} h={220} />{[-1, 0, 1].map((i) => <Pile key={i} x={540 + i * 70} y={730} len={520} tilt={i * tilt} w={30} />)}</svg><Center top={290}><Title size={54}>পাইল একটু হেলানো</Title></Center>
        {t > A.tilt + 4 && <Center top={1300}><Chip size={40} bg={CY} color={C.ink}>স্রোত আর ভূমিকম্পের ধাক্কা সামলাতে</Chip></Center>}</>}
      {t >= A.wide && <>
        <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="240" y="520" width="600" height="500" rx="60" fill="none" stroke={STEEL} strokeWidth="40" /><ellipse cx="540" cy="770" rx="260" ry="230" fill="#14102E" opacity="0.8" /></svg>
        <div style={{position: 'absolute', left: 440, top: 640, opacity: ramp(t, A.human - 0.3, A.human + 0.3)}}><Bean kind="bhai" size={200} t={t} mood="happy" /></div>
        <Center top={290}><Title size={56}>প্রায় ৩ মিটার চওড়া</Title></Center>
        {t >= A.human && t < A.platform && <Center top={1110}><Chip size={42} bg={YEL} color={C.ink}>একজন মানুষ সোজা দাঁড়াতে পারবে</Chip></Center>}
        {t >= A.platform && <Center top={1110}><Chip size={42} bg="rgba(255,255,255,0.1)">অস্থায়ী প্ল্যাটফর্ম থেকে কাজ, নিচে স্রোত</Chip></Center>}
      </>}
    </Stage>
  );
};
// S6 count + spans
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.per, b = A.life;
  const g = ease((t - A.per - 0.5) / 1.5);
  const tot = ease((t - A.total) / 1.5);
  return (
    <Stage t={t} a={a} b={b}>
      {t < A.spans - 0.2 && <>
        <Center top={290}><Title size={54}>একেকটা পিলারের নিচে ৬–৭টা পাইল</Title></Center>
        <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="340" y="560" width="400" height="60" fill="#E9EEF8" opacity={g} />{[0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={i} cx={380 + i * 53} cy={760 + (i % 2) * 50} r={22 * g} fill={STEEL} />)}</svg>
        {t > A.total - 0.2 && <Center top={1050}><div style={{textAlign: 'center', transform: `scale(${pop(t, A.total)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, color: YEL, lineHeight: 1}}>{bnum(Math.round(200 * tot))}+</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.text}}>মূল সেতুর নিচে সব মিলিয়ে পাইল</div></div></Center>}</>}
      {t >= A.spans - 0.2 && <>
        <Center top={290}><Title size={54}>৪০ পিলারে ৪১ স্প্যান</Title></Center>
        <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>{Array.from({length: 9}).map((_, i) => { const k = ease((t - A.spans - i * 0.15) / 0.4); return <g key={i} opacity={k}><rect x={40 + i * 110} y={780} width="100" height="26" fill="#E9EEF8" /><rect x={40 + i * 110 + 40} y={806} width="20" height={160 * k} fill="#C7CDE6" /></g>; })}<rect x="0" y="1000" width={W} height="300" fill={WATER} opacity="0.8" /></svg>
        {t > A.spans + 4.5 && <div style={{position: 'absolute', left: 90, top: 640, display: 'flex', gap: 26}}><Chip size={40} bg={YEL} color={C.ink}>ওপরে সড়ক</Chip><Chip size={40} bg={CY} color={C.ink}>নিচে রেল</Chip></div>}</>}
    </Stage>
  );
};
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.life, b = A.q;
  const yrs = ease((t - A.life - 1.5) / 3);
  return (
    <Stage t={t} a={a} b={b}>
      {t < A.note - 0.2 && <><Center top={300}><Title size={60}>রক্ষণাবেক্ষণ ঠিক থাকলে</Title></Center><div style={{position: 'absolute', left: 110, top: 600, width: 860}}><div style={{height: 70, borderRadius: 35, background: 'rgba(255,255,255,0.1)'}}><div style={{width: `${yrs * 100}%`, height: '100%', borderRadius: 35, background: `linear-gradient(90deg, ${CY}, #26C6DA)`}} /></div><div style={{marginTop: 20, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, color: C.text}}>{bnum(Math.round(100 * yrs))} <span style={{fontSize: 56, color: C.muted}}>বছর</span></div><div style={{textAlign: 'center', fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.muted}}>বিশেষজ্ঞদের মতে</div></div></>}
      {t >= A.note - 0.2 && <><Center top={500}><div style={{textAlign: 'center', transform: `scale(${pop(t, A.note)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.text}}>পাইলের মোট সংখ্যা</div><div style={{marginTop: 20, fontFamily: FONT_BN, fontWeight: 700, fontSize: 48, color: C.muted}}>সূত্রে একটু আলাদা</div></div></Center><div style={{position: 'absolute', left: 90, top: 880, display: 'flex', flexDirection: 'column', gap: 24, opacity: ramp(t, A.note + 4, A.note + 4.6)}}><Chip size={42} bg="rgba(255,255,255,0.1)">কেউ শুধু মূল সেতুর পাইল গোনে</Chip><Chip size={42} bg="rgba(255,255,255,0.1)">কেউ ভায়াডাক্টের পাইলও ধরে</Chip></div></>}
    </Stage>
  );
};
const S8: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.q;
  const msg = 'ভাবিনি, আজ থেকে ভাবব';
  const typeP = ramp(t, a + 3, a + 4.6);
  const keyAt = A.end + 0.25;
  return (
    <Stage t={t} a={a} b={A.end + 10} noFadeOut>
      {t < A.big && <><Center top={300}><Sticker t={t} at={a + 0.1} text="নিচের অদেখা পাইপের কথা ভেবেছেন?" color={YEL} textColor={C.ink} rotate={-3} size={46} /></Center>
        <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}><div style={{display: 'flex', alignItems: 'center', gap: 14}}><div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} /><div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.text}}>{t > a + 3 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div></div><div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div></div></>}
      {t >= A.big && <><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="0" y="700" width={W} height="80" fill="#E9EEF8" /><rect x="0" y="780" width={W} height="20" fill="#8A93B2" />{t > A.big + 4.5 && <rect x="0" y="800" width={W} height="400" fill={SAND} opacity={ramp(t, A.big + 4.5, A.big + 6)} />}</svg><Center top={300}><Title size={56}>ওপরে সুন্দর সেতু</Title></Center>{t > A.big + 4.8 && <Center top={1230}><Sticker t={t} at={A.big + 4.8} text="আসল শক্তি মাটির নিচে" color={CY} textColor={C.ink} rotate={-3} size={54} /></Center>}</>}
      {t > A.send - 0.1 && <div style={{position: 'absolute', left: 120, top: 740, display: 'flex', gap: 40, opacity: ramp(t, A.send, A.send + 0.4)}}><Bean kind="abbu" size={150} t={t} mood="happy" /><div style={{alignSelf: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.signature}}>→</div><Bean kind="ammu" size={150} t={t} mood="happy" phase={1} /></div>}
      <FollowPill t={t} at={A.cta_word} platform={platform} top={980} opacity={ramp(t, A.cta, A.cta + 0.4)} />
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={1030} />
      {t > keyAt - 0.1 && <div style={{position: 'absolute', left: 60, right: 60, top: 1180, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}><Title size={72}>চোখের আড়ালের</Title><Title size={72} color={YEL}>ইঞ্জিনিয়ারিং</Title></div>}
    </Stage>
  );
};
export const Cover: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Background t={0} blueprint={0} />
      <Section t={2} top={1000} />
      <svg width={W} height={1920} style={{position: 'absolute', left: 0, top: 0}}><rect x="0" y="900" width={W} height="60" fill="#E9EEF8" /><Pillar x={300} y={1000} h={100} w={110} /><Pillar x={780} y={1000} h={100} w={110} /><Pile x={300} y={1020} len={520} w={44} /><Pile x={780} y={1020} len={520} w={44} /><Pile x={540} y={1020} len={520} tilt={6} w={44} /></svg>
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 290, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 112, lineHeight: 1.12, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>পদ্মা সেতুর ভর<br /><span style={{color: YEL}}>১২০ মিটার</span> নিচে</div>
    </AbsoluteFill>
  );
};
const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.1, file: 'whoosh', vol: 0.4}, {at: A.pillars, file: 'counter_roll', vol: 0.45}, {at: A.how, file: 'rise_stinger', vol: 0.35}, {at: A.depth, file: 'counter_roll', vol: 0.4}, {at: A.follow - 0.3, file: 'whoosh', vol: 0.3},
  {at: A.problem, file: 'whoosh', vol: 0.3}, {at: A.book, file: 'tick', vol: 0.8}, {at: A.solution, file: 'whoosh', vol: 0.3}, {at: A.layer, file: 'tick', vol: 0.8}, {at: A.hammer, file: 'impact_boom', vol: 0.45}, {at: A.hammer + 1, file: 'impact_boom', vol: 0.35}, {at: A.hammer + 2, file: 'impact_boom', vol: 0.35},
  {at: A.tilt, file: 'whoosh', vol: 0.3}, {at: A.wide, file: 'whoosh', vol: 0.3}, {at: A.per, file: 'tick', vol: 0.8}, {at: A.total, file: 'counter_roll', vol: 0.45}, {at: A.spans, file: 'counter_roll', vol: 0.4}, {at: A.life, file: 'counter_roll', vol: 0.4}, {at: A.big, file: 'whoosh', vol: 0.3}, {at: A.cta - 0.8, file: 'whoosh', vol: 0.25},
];
export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [{from: A.depth, to: A.follow, text: 'সূত্র: TBS, Financial Express'}, {from: A.total, to: A.life, text: 'সূত্র: worldsteel, TBS'}];
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
