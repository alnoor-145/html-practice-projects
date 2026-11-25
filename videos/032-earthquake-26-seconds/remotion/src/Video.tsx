import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Platform, SourcePill, Stage, Sticker, Title, W, clamp01, ease, pop, ramp, useFonts, useT, FPS} from './lib';
import {bnum} from './iso';

// Video 032 (part 1 only): the 21 Nov 2025 Narsingdi earthquake. Own drawn graphics, no real photos.
const YEL = '#FFC24D', ORG = '#FF7A2F', RED = '#FF4D6D', CY = '#26C6DA', WALL = '#2B2250';
const END = A.end;
const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const shakeAt = (t: number, a: number, b: number, amp: number) => (t > a && t < b ? Math.sin(t * 47) * amp * Math.min(1, (t - a) / 0.3) * Math.min(1, (b - t) / 0.5) : 0);

const Room: React.FC<{t: number; shake: number}> = ({t, shake}) => {
  const fan = Math.sin(t * 2.1) * 0 + (shake !== 0 ? Math.sin(t * 6) * 9 : 0);
  return (
    <svg width={W} height={1200} style={{position: 'absolute', left: 0, top: 0}}>
      <g transform={`translate(${shake} ${shake * 0.4})`}>
        <rect x="70" y="360" width="940" height="690" fill={WALL} stroke="#4A3E7A" strokeWidth="6" />
        <rect x="70" y="1050" width="940" height="40" fill="#14102E" />
        {/* window */}
        <rect x="720" y="430" width="220" height="260" fill="#7FC8FF" stroke="#E9EEF8" strokeWidth="10" /><line x1="830" y1="430" x2="830" y2="690" stroke="#E9EEF8" strokeWidth="8" /><line x1="720" y1="560" x2="940" y2="560" stroke="#E9EEF8" strokeWidth="8" />
        {/* wardrobe */}
        <g transform={`rotate(${shake * 0.35} 200 1050)`}><rect x="110" y="540" width="190" height="510" rx="10" fill="#8A5A3A" /><line x1="205" y1="545" x2="205" y2="1045" stroke="#5E3A22" strokeWidth="6" /><circle cx="190" cy="800" r="9" fill="#E9C58A" /><circle cx="220" cy="800" r="9" fill="#E9C58A" /></g>
        {/* fan */}
        <g transform={`translate(540 ${360 + 60}) rotate(${fan})`}><line x1="0" y1="-60" x2="0" y2="0" stroke="#8A93B2" strokeWidth="8" />{[0, 1, 2].map((i) => <ellipse key={i} cx="0" cy="0" rx="110" ry="12" fill="#C7CDE6" transform={`rotate(${t * 520 + i * 120})`} />)}<circle r="18" fill="#E9EEF8" /></g>
        {/* picture */}
        <g transform={`rotate(${shake * 0.6} 520 560)`}><rect x="440" y="500" width="160" height="110" fill="#14102E" stroke="#E9C58A" strokeWidth="8" /><circle cx="520" cy="555" r="26" fill={YEL} /></g>
        {/* table */}
        <rect x="380" y="880" width="320" height="26" rx="6" fill="#B07A4A" /><rect x="395" y="906" width="20" height="144" fill="#8A5A3A" /><rect x="665" y="906" width="20" height="144" fill="#8A5A3A" />
        <g transform={`translate(0 ${-Math.abs(shake) * 0.3})`}><rect x="500" y="850" width="80" height="30" rx="6" fill={RED} /></g>
      </g>
    </svg>
  );
};
const S1: React.FC<{t: number}> = ({t}) => {
  const a = 0, b = A.follow;
  const sh = shakeAt(t, A.shake, A.real - 0.3, 9);
  const clockOn = t > A.clock - 0.3;
  const show26 = t > A.sec - 0.2;
  const secs = 26 - Math.min(26, Math.floor(Math.max(0, t - A.sec) * 2.6));
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <Room t={t} shake={sh} />
      <div style={{position: 'absolute', left: 430, top: 960, transform: `translate(${sh}px, 0)`}}><Bean kind="bhai" size={190} t={t} mood={t > A.shake ? 'worried' : 'neutral'} /></div>
      {clockOn && t < A.real && <div style={{position: 'absolute', left: 90, top: 1215, display: 'flex', gap: 24, alignItems: 'center', transform: `scale(${pop(t, A.clock - 0.3)})`}}><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#F5F7FF" stroke="#8A93B2" strokeWidth="6" /><line x1="60" y1="60" x2="60" y2="22" stroke="#14102E" strokeWidth="6" strokeLinecap="round" /><line x1="60" y1="60" x2="88" y2="60" stroke="#14102E" strokeWidth="7" strokeLinecap="round" transform="rotate(-60 60 60)" /></svg><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 52, color: C.text}}>সকাল সাড়ে দশটা</div></div>}
      {show26 && t < A.real && <div style={{position: 'absolute', right: 80, top: 1190, padding: '10px 28px', borderRadius: 26, background: '#0E0A1F', border: `4px solid ${RED}`, textAlign: 'center', transform: `scale(${pop(t, A.sec)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 92, color: RED, lineHeight: 1}}>{bnum(secs)}</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.text}}>সেকেন্ড</div></div>}
      {t > A.ask - 0.1 && t < A.real && <Center top={290}><Sticker t={t} at={A.ask} text="এখন কী করবেন?" color={YEL} textColor={C.ink} rotate={-3} size={70} /></Center>}
      {t >= A.real - 0.1 && <>
        <Center top={290}><Sticker t={t} at={A.real} text="এটা কল্পনা না" color={RED} rotate={-3} size={64} /></Center>
        <Center top={440}><div style={{transform: `scale(${pop(t, A.date)})`, padding: '22px 40px', borderRadius: 30, background: '#0E0A1F', border: `4px solid ${YEL}`, textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.muted}}>শুক্রবার · সকাল ১০টা ৩৮</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 84, color: YEL, lineHeight: 1.1}}>২১ নভেম্বর ২০২৫</div></div></Center>
        {t > A.mag - 0.2 && <div style={{position: 'absolute', left: 110, top: 760, width: 860, opacity: ramp(t, A.mag - 0.2, A.mag + 0.3)}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 38, color: C.muted, marginBottom: 12}}>মাত্রা (আবহাওয়া অধিদপ্তর)</div><div style={{height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative'}}><div style={{width: `${(5.7 / 10) * 100 * ease((t - A.mag - 0.3) / 1.2)}%`, height: '100%', background: `linear-gradient(90deg, ${YEL}, ${RED})`}} /></div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 90, color: RED, lineHeight: 1.1}}>{((57 * ease((t - A.mag - 0.3) / 1.2)) / 10).toFixed(1).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]).replace('.', '.')}</div></div>}
        {t > A.epi - 0.2 && <div style={{position: 'absolute', left: 110, top: 1060, opacity: ramp(t, A.epi - 0.2, A.epi + 0.3)}}><svg width="860" height="260" viewBox="0 0 860 260">{[0, 1, 2].map((i) => { const k = ((t - A.epi + i * 0.6) % 1.8) / 1.8; return <circle key={i} cx="430" cy="130" r={20 + k * 110} fill="none" stroke={RED} strokeWidth="6" opacity={1 - k} />; })}<circle cx="430" cy="130" r="16" fill={RED} /><path d="M20 230 Q 200 200 330 215 T 640 200 T 840 235" fill="none" stroke="#4A3E7A" strokeWidth="6" /></svg><Center top={150}><Chip size={40} bg="rgba(255,255,255,0.1)">কেন্দ্র: নরসিংদীর মাধবদী</Chip></Center></div>}
        {t > A.dur - 0.2 && <div style={{position: 'absolute', right: 70, top: 1320, opacity: ramp(t, A.dur, A.dur + 0.3)}}><Chip size={38} bg={ORG} color={C.ink}>কাঁপুনি প্রায় ২৬ সেকেন্ড</Chip></div>}
      </>}
    </Stage>
  );
};
const S2: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.dead;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}><Title size={74}>পরিবারকে নিরাপদ রাখার</Title><Title size={74} color={YEL}>কথা, আরও জানতে</Title></div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};
const S3: React.FC<{t: number}> = ({t}) => {
  const a = A.dead, b = A.lesson;
  const toll = ease((t - A.first - 1.6) / 0.6);
  const hurt = ease((t - A.hurt) / 1.2);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={60}>সেদিন যেখানে প্রাণ গেছে</Title></Center>
      <div style={{position: 'absolute', left: 90, top: 440, display: 'flex', gap: 22, flexWrap: 'wrap', width: 900, justifyContent: 'center'}}>{['ঢাকা', 'নারায়ণগঞ্জ', 'নরসিংদী'].map((x, i) => { const at = [A.dead + 0.3, A.dead + 1.0, A.dead + 2.2][i]; return <div key={i} style={{transform: `scale(${pop(t, at)})`, padding: '16px 30px', borderRadius: 24, background: 'rgba(255,77,109,0.14)', border: `4px solid ${RED}`, fontFamily: FONT_BN, fontWeight: 800, fontSize: 54, color: C.text}}>{x}</div>; })}</div>
      {t > A.first - 0.2 && <Center top={680}><div style={{display: 'flex', alignItems: 'center', gap: 24, transform: `scale(${pop(t, A.first)})`}}><div style={{textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 32, color: C.muted}}>প্রথম খবরে</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 140, color: YEL, lineHeight: 1}}>৫</div></div><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.muted, opacity: toll}}>→</div><div style={{textAlign: 'center', opacity: toll, transform: `scale(${0.8 + 0.2 * toll})`}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 32, color: C.muted}}>পরে কিছু প্রতিবেদনে</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 140, color: RED, lineHeight: 1}}>১০</div></div></div></Center>}
      {t > A.hurt - 0.2 && <Center top={1010}><div style={{transform: `scale(${pop(t, A.hurt)})`, textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.muted}}>আহত</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 110, color: ORG, lineHeight: 1}}>{bnum(Math.round(100 * hurt))}+</div></div></Center>}
      {t > A.src - 0.2 && <Center top={1230}><Sticker t={t} at={A.src} text="সংখ্যা সূত্রভেদে আলাদা" color="#7A86B8" rotate={-3} size={46} /></Center>}
    </Stage>
  );
};
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.lesson, b = A.ask2;
  const fall = ease((t - A.kosai - 1.8) / 0.9);
  const run = t > A.panic - 0.2;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><div style={{textAlign: 'center', transform: `scale(${pop(t, a + 0.1)})`}}><Title size={58}>সবচেয়ে বড় শিক্ষা</Title><Title size={84} color={RED}>আতঙ্কই বিপদ বাড়ায়</Title></div></Center>
      {t > A.kosai - 0.2 && <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x="150" y="620" width="360" height="520" fill="#4A3E7A" stroke="#6D5CB0" strokeWidth="6" />
        {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={r + '' + c} x={190 + c * 150} y={660 + r * 150} width="90" height="90" fill="#7FC8FF" opacity="0.8" />))}
        <rect x="510" y="900" width="150" height="14" fill="#8A93B2" />
        <g transform={`translate(${fall * 30} ${fall * 190}) rotate(${fall * 38} 585 907)`}><rect x="510" y="890" width="150" height="14" fill="#E9EEF8" />{[0, 1, 2, 3].map((i) => <rect key={i} x={518 + i * 38} y="850" width="6" height="42" fill="#E9EEF8" />)}</g>
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${570 + i * 46} 1100)`} opacity={fall > 0.9 ? 1 : 1}><circle cy="-34" r="14" fill="#F2B38A" /><rect x="-10" y="-20" width="20" height="40" rx="8" fill={[CY, YEL, ORG][i]} /></g>)}
        <rect x="100" y="1140" width="880" height="16" fill="#14102E" />
      </svg>}
      {t > A.kosai + 1.5 && t < A.panic && <Center top={1190}><Chip size={42} bg={RED}>কসাইটুলি: রেলিং ভেঙে ৩ পথচারীর মৃত্যু</Chip></Center>}
      {run && <div style={{position: 'absolute', left: 560, top: 800, opacity: ramp(t, A.panic, A.panic + 0.4)}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: i * 90 - ((t - A.panic) * 160) % 120, top: (i % 2) * 70, transform: `rotate(${Math.sin(t * 9 + i) * 12}deg)`}}><Bean kind={(['abbu', 'ammu', 'bon', 'bhai'] as const)[i]} size={110} t={t} mood="worried" phase={i} /></div>)}</div>}
      {run && t < A.ask2 && <Center top={1190}><Chip size={42} bg={ORG} color={C.ink}>ভয়ে ছোটাছুটিতেও অনেকে আহত</Chip></Center>}
    </Stage>
  );
};

const Mark: React.FC<{ok: boolean; size?: number}> = ({ok, size = 64}) => (
  <svg width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill={ok ? C.good : RED} />{ok ? <path d="M10 21 L17 28 L30 12" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M12 12 L28 28 M28 12 L12 28" stroke="#fff" strokeWidth="5" strokeLinecap="round" />}</svg>
);
// S5: drop, cover, hold
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.ask2, b = A.indoor;
  const steps = [['নিচু হোন', A.low, 'ড্রপ'], ['মাথা ঢাকুন', A.cover, 'কাভার'], ['শক্ত কিছু ধরুন', A.holdw, 'হোল্ড']] as const;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={58}>কাঁপুনি শুরু হলে তিন ধাপ</Title></Center>
      <div style={{position: 'absolute', left: 90, right: 90, top: 440, display: 'flex', flexDirection: 'column', gap: 34}}>
        {steps.map(([x, at, en], i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 30px', borderRadius: 30, background: 'rgba(255,255,255,0.07)', border: `4px solid ${[YEL, CY, ORG][i]}`, transform: `scale(${pop(t, at)})`, opacity: clamp01(pop(t, at) * 2)}}><div style={{width: 96, height: 96, borderRadius: 99, background: [YEL, CY, ORG][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.ink}}>{bnum(i + 1)}</div><div style={{flex: 1}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 58, color: C.text}}>{x}</div>{t > A.eng + 1.2 + i * 0.6 && <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.muted}}>{en}</div>}</div></div>)}
      </div>
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
        <g transform="translate(540 1180)"><rect x="-260" y="40" width="520" height="14" fill="#14102E" /><g transform={`translate(0 ${t > A.low ? 30 : 0})`}><circle cy="-70" r="46" fill="#F2B38A" /><rect x="-40" y="-26" width="80" height={t > A.low ? 60 : 90} rx="24" fill={CY} />{t > A.cover && <path d="M-70 -90 Q0 -170 70 -90 L56 -60 Q0 -110 -56 -60 Z" fill="#F2B38A" opacity="0.95" />}{t > A.holdw && <rect x="70" y="-10" width="20" height="60" rx="6" fill="#B07A4A" />}</g></g>
      </svg>
    </Stage>
  );
};
// S6: indoors
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.indoor, b = A.stairs;
  const sh = shakeAt(t, a, b - 0.3, 5);
  const win = t > A.window - 0.2;
  return (
    <Stage t={t} a={a} b={b}>
      <Room t={t} shake={sh} />
      {t > a && t < A.table2 && <Center top={290}><Sticker t={t} at={a} text="মজবুত টেবিলের নিচে ঢুকে যান" color={C.good} textColor={C.ink} rotate={-3} size={46} /></Center>}
      {t >= A.table2 - 0.1 && !win && <Center top={290}><Sticker t={t} at={A.table2} text="টেবিল না থাকলে: বসে মাথা-ঘাড় ঢাকুন" color={CY} textColor={C.ink} rotate={-3} size={42} /></Center>}
      {win && <Center top={290}><Title size={54}>এগুলো থেকে দূরে থাকুন</Title></Center>}
      <svg width={W} height={1300} style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${sh} 0)`}><rect x="380" y="900" width="320" height="26" rx="6" fill="#B07A4A" /><g transform="translate(540 1010)"><circle cy="-30" r="30" fill="#F2B38A" /><rect x="-28" y="-5" width="56" height="45" rx="16" fill={CY} /><path d="M-44 -50 Q0 -100 44 -50 L36 -32 Q0 -66 -36 -32 Z" fill="#F2B38A" /></g></g>
      </svg>
      {win && [[830, 560, A.window], [520, 560, A.window + 0.7], [205, 800, A.window + 1.6]].map(([x, y, at], i) => <div key={i} style={{position: 'absolute', left: (x as number) - 32, top: (y as number) - 32, transform: `scale(${pop(t, at as number)})`}}><Mark ok={false} /></div>)}
      {win && <Center top={1230}><div style={{display: 'flex', gap: 18}}>{['জানালা', 'আয়না', 'ঝোলানো জিনিস', 'ভারী আলমারি'].map((x, i) => <Chip key={i} size={34} bg="rgba(255,77,109,0.18)" color={C.text}>{x}</Chip>)}</div></Center>}
    </Stage>
  );
};
// S7: stairs and lift
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.stairs, b = A.outdoor;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={56}>কাঁপুনির মাঝখানে</Title></Center>
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M120 1000 L280 1000 L280 900 L440 900 L440 800 L600 800 L600 700 L760 700" fill="none" stroke="#8A93B2" strokeWidth="18" strokeLinejoin="round" />
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${200 + ((t * 120 + i * 140) % 520)} ${960 - ((t * 120 + i * 140) % 520) * 0.6})`}><circle cy="-34" r="14" fill="#F2B38A" /><rect x="-10" y="-20" width="20" height="40" rx="8" fill={[CY, YEL, ORG][i]} /></g>)}
        <rect x="760" y="620" width="170" height="320" rx="12" fill="#3D3470" stroke="#8A93B2" strokeWidth="8" /><line x1="845" y1="625" x2="845" y2="935" stroke="#8A93B2" strokeWidth="6" />
      </svg>
      <div style={{position: 'absolute', left: 150, top: 560, transform: `scale(${pop(t, A.stairs + 0.4)})`}}><Mark ok={false} size={90} /></div>
      {t > A.lift - 0.2 && <div style={{position: 'absolute', left: 800, top: 520, transform: `scale(${pop(t, A.lift)})`}}><Mark ok={false} size={90} /></div>}
      <Center top={1130}><div style={{display: 'flex', gap: 24}}><Chip size={44} bg="rgba(255,77,109,0.18)">সিঁড়িতে দৌড় না</Chip>{t > A.lift - 0.2 && <Chip size={44} bg="rgba(255,77,109,0.18)">লিফট একদম না</Chip>}</div></Center>
      {t > A.most - 0.2 && <Center top={1250}><Sticker t={t} at={A.most} text="আঘাত বেশি ভিড়ের ধাক্কায়, ওপর থেকে পড়া জিনিসে" color="#7A86B8" rotate={-3} size={34} /></Center>}
    </Stage>
  );
};
// S8: outdoors and car
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.outdoor, b = A.after;
  const car = t > A.car - 0.2;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={56}>{car ? 'গাড়িতে থাকলে' : 'বাইরে থাকলে'}</Title></Center>
      {!car && <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x="60" y="540" width="230" height="560" fill="#4A3E7A" /><rect x="790" y="620" width="40" height="480" fill="#4A3E7A" /><path d="M60 560 L1020 520" stroke="#8A93B2" strokeWidth="5" /><path d="M60 600 L1020 570" stroke="#8A93B2" strokeWidth="5" />
        <rect x="320" y="1040" width="440" height="60" rx="20" fill="#2E9E6A" opacity="0.8" />
        <g transform={`translate(540 ${1010})`}><circle cy="-34" r="16" fill="#F2B38A" /><rect x="-12" y="-18" width="24" height="46" rx="9" fill={YEL} /></g>
        <path d="M400 960 L300 960 M330 930 L300 960 L330 990" fill="none" stroke="none" />
      </svg>}
      {!car && t > A.outdoor + 0.8 && <><div style={{position: 'absolute', left: 130, top: 480, transform: `scale(${pop(t, A.outdoor + 1.6)})`}}><Mark ok={false} size={70} /></div><div style={{position: 'absolute', left: 680, top: 470, transform: `scale(${pop(t, A.outdoor + 2.6)})`}}><Mark ok={false} size={70} /></div><div style={{position: 'absolute', left: 520, top: 1110, transform: `scale(${pop(t, A.outdoor + 0.8)})`}}><Mark ok size={80} /></div></>}
      {!car && <Center top={1230}><Chip size={42} bg={C.good} color={C.ink}>খোলা জায়গায় যান</Chip></Center>}
      {!car && <Center top={420}><Chip size={34} bg="rgba(255,77,109,0.18)">ভবন, দেয়াল, বিদ্যুতের তার থেকে দূরে</Chip></Center>}
      {car && <><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="100" y="1000" width="880" height="14" fill="#14102E" /><g transform="translate(540 960)"><rect x="-160" y="-60" width="320" height="70" rx="24" fill={ORG} /><rect x="-100" y="-120" width="200" height="66" rx="22" fill={ORG} /><rect x="-84" y="-108" width="78" height="46" fill="#7FC8FF" /><rect x="6" y="-108" width="78" height="46" fill="#7FC8FF" /><circle cx="-100" cy="14" r="30" fill="#14102E" /><circle cx="100" cy="14" r="30" fill="#14102E" /></g></svg><Center top={1130}><Sticker t={t} at={A.car} text="নিরাপদ জায়গায় থামিয়ে ভেতরেই থাকুন" color={CY} textColor={C.ink} rotate={-3} size={44} /></Center></>}
    </Stage>
  );
};
// S9: after shaking
const S9: React.FC<{t: number}> = ({t}) => {
  const a = A.after, b = A.prep;
  const items: [string, number][] = [['নিজেকে আর পরিবারকে দেখুন', A.check], ['গ্যাসের চুলা বন্ধ', A.gas], ['মেইন সুইচ নামান', A.mains], ['শান্তভাবে সিঁড়ি দিয়ে নামুন', A.exit], ['খোলা জায়গায় যান', A.exit + 2.2]];
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={54}>কাঁপুনি থামলে, ছুটবেন না</Title></Center>
      <div style={{position: 'absolute', left: 90, top: 440, display: 'flex', flexDirection: 'column', gap: 30}}>
        {items.map(([x, at], i) => { const k = ease((t - at) / 0.4); return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: 0.25 + 0.75 * k}}><div style={{opacity: k}}><Mark ok size={72} /></div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 48, color: C.text}}>{x}</div></div>; })}
      </div>
      {t > A.again - 0.2 && <Center top={1140}><Sticker t={t} at={A.again} text="পরে আবার ছোট কাঁপুনি আসতে পারে" color={ORG} textColor={C.ink} rotate={-3} size={46} /></Center>}
    </Stage>
  );
};
// S10: prepare
const S10: React.FC<{t: number}> = ({t}) => {
  const a = A.prep, b = A.comment;
  const bagItems: [string, number][] = [['টর্চ', A.bag + 0.5], ['পানি', A.bag + 1.0], ['শুকনো খাবার', A.bag + 1.4], ['দরকারি কাগজ', A.bag + 2.4]];
  return (
    <Stage t={t} a={a} b={b}>
      {t < A.bag - 0.2 && <><Center top={290}><Title size={54}>আগে থেকে প্রস্তুতি</Title></Center><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="140" y="520" width="200" height="540" rx="10" fill="#8A5A3A" /><rect x="100" y="520" width="40" height="540" fill="#4A3E7A" />{t > A.shelf + 0.8 && <><rect x="120" y="640" width="240" height="14" rx="7" fill={C.good} /><rect x="120" y="860" width="240" height="14" rx="7" fill={C.good} /></>}{[0, 1, 2].map((i) => <rect key={i} x={560 + i * 90} y={1060 - 70 - i * 0} width="80" height="70" rx="8" fill={[RED, CY, YEL][i]} />)}<path d="M860 760 L860 1040" stroke="none" /></svg>
        <Center top={1130}><div style={{display: 'flex', gap: 16}}><Chip size={36} bg="rgba(255,255,255,0.1)">আলমারি, বুকশেলফ দেয়ালে আটকান</Chip></div></Center>
        {t > A.shelf + 2.4 && <Center top={1230}><Chip size={36} bg={YEL} color={C.ink}>ভারী জিনিস নিচের তাকে</Chip></Center>}</>}
      {t >= A.bag - 0.2 && t < A.meet - 0.2 && <><Center top={290}><Title size={54}>একটা জরুরি ব্যাগ</Title></Center><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0, opacity: 0.9}}><rect x="350" y="520" width="380" height="440" rx="60" fill="#3D3470" stroke="#8A93B2" strokeWidth="8" /><rect x="430" y="470" width="220" height="60" rx="30" fill="none" stroke="#8A93B2" strokeWidth="14" /></svg><div style={{position: 'absolute', left: 140, top: 1000, display: 'flex', gap: 20, flexWrap: 'wrap', width: 800, justifyContent: 'center'}}>{bagItems.map(([x, at], i) => <div key={i} style={{transform: `scale(${pop(t, at)})`}}><Chip size={42} bg={[YEL, CY, ORG, '#8FB4FF'][i]} color={C.ink}>{x}</Chip></div>)}</div></>}
      {t >= A.meet - 0.2 && t < A.key - 0.2 && <>
        <Center top={290}><Title size={54}>{t < A.crack ? 'জড়ো হওয়ার জায়গা ঠিক করুন' : 'ফাটল ধরা ভবনে ঢুকবেন না'}</Title></Center>
        {t < A.crack && <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="380" y="640" width="320" height="300" fill="#4A3E7A" /><path d="M370 650 L540 560 L710 650 Z" fill={C.good} />{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${200 + i * 220} 1100)`}><circle cy="-34" r="14" fill="#F2B38A" /><rect x="-10" y="-20" width="20" height="40" rx="8" fill={[CY, YEL, ORG, RED][i]} /></g>)}<path d="M540 1000 L540 960" stroke="none" /><text x="540" y="1010" textAnchor="middle" fontFamily={FONT} fontSize="70" fill={YEL}>★</text></svg>}
        {t >= A.crack - 0.2 && <><svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><rect x="340" y="560" width="400" height="500" fill="#4A3E7A" stroke="#6D5CB0" strokeWidth="6" /><path d="M560 560 L520 700 L580 760 L510 900 L560 1060" fill="none" stroke={RED} strokeWidth="10" strokeLinejoin="round" /></svg><div style={{position: 'absolute', left: 740, top: 540, transform: `scale(${pop(t, A.crack + 0.4)})`}}><Mark ok={false} size={90} /></div>{t > A.crack + 1.8 && <Center top={1130}><Chip size={42} bg={C.good} color={C.ink}>প্রশাসন নিরাপদ বললে তবেই ফিরুন</Chip></Center>}</>}
        {t < A.crack && <Center top={1230}><Chip size={40} bg="rgba(255,255,255,0.1)">পরিবারের সবাই জানুক, কোথায় জড়ো হবেন</Chip></Center>}
      </>}
      {t >= A.key - 0.2 && <><Center top={420}><div style={{textAlign: 'center', transform: `scale(${pop(t, A.key)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 200, color: RED, lineHeight: 1}}>২৬</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.text}}>সেকেন্ডে ভাবার সময় নেই</div></div></Center>{t > A.key + 2.4 && <Center top={900}><Sticker t={t} at={A.key + 2.4} text="আজই ঠিক করে রাখুন" color={YEL} textColor={C.ink} rotate={-3} size={66} /></Center>}</>}
    </Stage>
  );
};
const S11: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.comment;
  const msg = 'অফিসে ছিলাম, খুব ভয় পেয়েছিলাম';
  const typeP = ramp(t, a + 2.6, a + 4.4);
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="সেদিন আপনি কোথায় ছিলেন?" color={YEL} textColor={C.ink} rotate={-3} size={56} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}><div style={{display: 'flex', alignItems: 'center', gap: 14}}><div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} /><div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.text}}>{t > a + 2.6 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div></div><div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div></div>
      {t > A.send - 0.1 && <div style={{position: 'absolute', left: 120, top: 740, display: 'flex', gap: 40, opacity: ramp(t, A.send, A.send + 0.4)}}><Bean kind="bhai" size={150} t={t} mood="happy" /><div style={{alignSelf: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.signature}}>→</div><Bean kind="abbu" size={150} t={t} mood="happy" phase={1} /></div>}
      <FollowPill t={t} at={A.cta_word} platform={platform} top={980} opacity={ramp(t, A.cta, A.cta + 0.4)} />
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={1030} />
      {t > keyAt - 0.1 && <div style={{position: 'absolute', left: 60, right: 60, top: 1180, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}><Title size={72}>আতঙ্ক নয়,</Title><Title size={72} color={YEL}>প্রস্তুতি</Title></div>}
    </Stage>
  );
};
export const Cover: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Background t={0} blueprint={0} />
      <div style={{transform: 'translateY(300px)'}}><Room t={2} shake={10} /></div>
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 290, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, lineHeight: 1.12, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>ভূমিকম্প শুরু হলে<br /><span style={{color: YEL}}>এখন কী</span> করবেন?</div>
      <Center top={1560}><Sticker t={10} at={0} text="২৬ সেকেন্ডের কাঁপুনি" color={RED} rotate={-3} size={64} /></Center>
    </AbsoluteFill>
  );
};
const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.1, file: 'whoosh', vol: 0.4}, {at: A.shake, file: 'impact_boom', vol: 0.6}, {at: A.sec, file: 'counter_roll', vol: 0.45}, {at: A.ask, file: 'rise_stinger', vol: 0.4}, {at: A.real, file: 'impact_boom', vol: 0.4},
  {at: A.date, file: 'tick', vol: 0.8}, {at: A.mag, file: 'counter_roll', vol: 0.4}, {at: A.epi, file: 'tick', vol: 0.8}, {at: A.follow - 0.3, file: 'whoosh', vol: 0.3}, {at: A.dead, file: 'whoosh', vol: 0.3}, {at: A.first + 1.6, file: 'tick', vol: 0.8},
  {at: A.hurt, file: 'counter_roll', vol: 0.4}, {at: A.lesson, file: 'whoosh', vol: 0.35}, {at: A.kosai + 1.8, file: 'impact_boom', vol: 0.55}, {at: A.ask2, file: 'whoosh', vol: 0.35}, {at: A.low, file: 'tick', vol: 0.8}, {at: A.cover, file: 'tick', vol: 0.8}, {at: A.holdw, file: 'tick', vol: 0.8}, {at: A.indoor, file: 'whoosh', vol: 0.3}, {at: A.stairs, file: 'whoosh', vol: 0.3}, {at: A.outdoor, file: 'whoosh', vol: 0.3}, {at: A.after, file: 'whoosh', vol: 0.3}, {at: A.prep, file: 'whoosh', vol: 0.3}, {at: A.key, file: 'impact_boom', vol: 0.5}, {at: A.comment, file: 'whoosh', vol: 0.3}, {at: A.cta - 0.8, file: 'whoosh', vol: 0.25},
];
export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [{from: A.date, to: A.follow, text: 'সূত্র: Dawn, Al Jazeera, ঢাকা ট্রিবিউন'}, {from: A.dead, to: A.lesson, text: 'সূত্র: বাংলা ট্রিবিউন, ইত্তেফাক'}];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      {SFX.map((s, i) => <Sequence key={i} from={Math.round(s.at * FPS)}><Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.vol * 0.5} /></Sequence>)}
      <Background t={t} blueprint={0} />
      <S1 t={t} /><S2 t={t} platform={platform} /><S3 t={t} /><S4 t={t} /><S5 t={t} /><S6 t={t} /><S7 t={t} /><S8 t={t} /><S9 t={t} /><S10 t={t} /><S11 t={t} platform={platform} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, top: 214, fontFamily: FONT_BN, fontWeight: 600, fontSize: 23, color: C.muted, opacity: 0.85}}>আঁকা গ্রাফিক্স · আসল ছবি নয়</div>
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
