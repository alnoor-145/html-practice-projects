import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Platform, SourcePill, Stage, Sticker, Title, W, ease, pop, ramp, useFonts, useT, FPS} from './lib';
import {IsoBox, bnum} from './iso';

// Video 028: Kaptai dam, power vs displacement. Calm colours, no blame; own drawn graphics.
const YEL = '#FFC24D', CY = '#26C6DA', BLUE = '#4D8BFF', EARTH = '#B8895B', WATER = '#1E4E8C';
const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Wave: React.FC<{t: number; y: number; h: number; op?: number}> = ({t, y, h, op = 0.9}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, height: h, background: `linear-gradient(180deg, ${WATER}, #10294D)`, opacity: op, overflow: 'hidden'}}>
    {Array.from({length: 6}).map((_, i) => <div key={i} style={{position: 'absolute', left: ((i * 240 + t * 36) % 1300) - 200, top: 24 + i * 48, width: 220, height: 9, borderRadius: 6, background: 'rgba(255,255,255,0.2)'}} />)}
  </div>
);
const House: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#E9C58A'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-30" y="-24" width="60" height="40" fill={c} /><path d="M-38 -22 L0 -58 L38 -22 Z" fill="#B5543A" /><rect x="-8" y="-6" width="16" height="22" fill="#7A5A3A" /></g>
);
const Dam: React.FC<{x?: number; y?: number; k?: number}> = ({x = 540, y = 760, k = 1}) => (
  <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
    <path d={`M${x - 330} ${y + 200} L${x - 250} ${y - 90 * k} L${x + 250} ${y - 90 * k} L${x + 330} ${y + 200} Z`} fill={EARTH} />
    <path d={`M${x - 250} ${y - 90 * k} L${x + 250} ${y - 90 * k} L${x + 250} ${y - 70 * k} L${x - 250} ${y - 70 * k} Z`} fill="#D4A878" />
    <path d={`M${x - 330} ${y + 200} L${x - 250} ${y - 90 * k} L${x - 250} ${y + 200} Z`} fill="#9A6F46" />
  </svg>
);

const S1: React.FC<{t: number}> = ({t}) => {
  const a = 0, b = A.follow;
  const lake = ease((t - A.story) / 3);
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <Wave t={t} y={1060} h={460} op={0.5 + 0.4 * lake} />
      <Dam x={540} y={860} k={ease((t - 0.2) / 1)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 36}}>
        <div style={{transform: `scale(${pop(t, A.mw - 0.3)})`, padding: '18px 30px', borderRadius: 28, background: 'rgba(255,194,77,0.15)', border: `4px solid ${YEL}`, textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 96, color: YEL, lineHeight: 1}}>{bnum(Math.round(230 * ease((t - A.mw) / 1.2)))}</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.text}}>মেগাওয়াট</div></div>
        <div style={{transform: `scale(${pop(t, A.people - 0.3)})`, padding: '18px 30px', borderRadius: 28, background: 'rgba(77,139,255,0.15)', border: `4px solid ${BLUE}`, textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 96, color: '#8FB4FF', lineHeight: 1}}>~১ লাখ</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.text}}>মানুষের ঘর</div></div>
      </div>
      {t > A.lost && <svg width={W} height={1700} style={{position: 'absolute', left: 0, top: 0}}>{[0, 1, 2, 3, 4].map((i) => <House key={i} x={170 + i * 185} y={1200 + (i % 2) * 40 + ease((t - A.lost - i * 0.15) / 1.6) * 90} s={1.1} c="#9BB0D8" />)}</svg>}
      {t > A.lost && <Wave t={t} y={1190 + 40 - 40 * ease((t - A.lost) / 2)} h={380} op={0.55} />}
      {t > A.light - 0.2 && t < A.dark && <div style={{position: 'absolute', left: 70, top: 1000, opacity: ramp(t, A.light, A.light + 0.3)}}><Chip size={40} bg={YEL} color={C.ink}>এক দিকে আলো</Chip></div>}
      {t > A.dark - 0.2 && t < A.karna && <div style={{position: 'absolute', right: 70, top: 1000, opacity: ramp(t, A.dark, A.dark + 0.3)}}><Chip size={40} bg={BLUE} color={C.ink}>আরেক দিকে ডুবে যাওয়া ঘর</Chip></div>}
    </Stage>
  );
};
const S2: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.mix;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}><Title size={74}>বড় প্রকল্পের</Title><Title size={74} color={YEL}>দুই দিকের গল্প</Title></div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};
// S3 history, energy mix, flat country
const S3: React.FC<{t: number}> = ({t}) => {
  const a = A.karna - 0.2, b = A.follow;
  return null;
};
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.mix, b = A.dam;
  const bars = [['গ্যাস', 88, '#FF7A2F'], ['কয়লা', 62, '#8A93B2'], ['তেল', 50, '#C49A6C'], ['পানি', 8, CY]] as const;
  const hl = t > A.special - 0.2;
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={62}>বিদ্যুৎ আসে কোথা থেকে?</Title></Center>
      <div style={{position: 'absolute', left: 130, top: 480, width: 820, display: 'flex', flexDirection: 'column', gap: 34}}>
        {bars.map(([n, v, c], i) => { const k = ease((t - A.mix - 0.6 - i * 0.5) / 0.9); const dim = hl && n !== 'পানি'; return <div key={n} style={{opacity: dim ? 0.3 : 1}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: C.text, marginBottom: 6}}>{n}</div><div style={{height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.08)'}}><div style={{width: `${v * k}%`, height: '100%', borderRadius: 16, background: c, boxShadow: hl && n === 'পানি' ? `0 0 40px ${CY}` : 'none'}} /></div></div>; })}
        <div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 26, color: C.muted}}>বোঝানোর জন্য আঁকা, আসল অনুপাত নয়</div>
      </div>
      {t > A.flat && !hl && <Center top={1150}><Chip size={42} bg="rgba(255,255,255,0.1)">সমতল দেশ · পানিবিদ্যুতের সুযোগ কম</Chip></Center>}
      {hl && <Center top={1150}><Sticker t={t} at={A.special} text="কাপ্তাই তাই বিশেষ" color={CY} textColor={C.ink} rotate={-3} size={56} /></Center>}
    </Stage>
  );
};
// S5 dam facts + year
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.karna - 0.2, b = A.follow;
  return null;
};
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.dam, b = A.how;
  const lake = ease((t - A.lake) / 2.5);
  return (
    <Stage t={t} a={a} b={b}>
      <Wave t={t} y={900} h={600} op={0.3 + 0.55 * lake} />
      <Dam x={540} y={700} />
      <Center top={290}><Chip size={44} bg="rgba(255,255,255,0.1)">মাটির বাঁধ</Chip></Center>
      {t > A.len - 0.2 && <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0, opacity: ramp(t, A.len, A.len + 0.4)}}><line x1="210" y1="1040" x2="870" y2="1040" stroke="#fff" strokeWidth="5" /><line x1="210" y1="1020" x2="210" y2="1060" stroke="#fff" strokeWidth="5" /><line x1="870" y1="1020" x2="870" y2="1060" stroke="#fff" strokeWidth="5" /></svg>}
      {t > A.len - 0.2 && <Center top={1075}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 76, color: C.text}}>প্রায় ৬৭০ মিটার</div></Center>}
      {t > A.lake && <Center top={1230}><Sticker t={t} at={A.lake} text="আটকানো পানিতে কাপ্তাই হ্রদ" color={BLUE} rotate={-3} size={48} /></Center>}
    </Stage>
  );
};
// S7 turbine
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.how, b = A.units;
  const spin = (t - a) * 220;
  const lit = ramp(t, A.how + 6.5, A.how + 7.2);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={62}>পানি → টারবাইন → বিদ্যুৎ</Title></Center>
      <Wave t={t} y={430} h={170} op={0.9} />
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x="500" y="600" width="80" height="150" fill={BLUE} opacity="0.7" />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx="540" cy={610 + ((t * 220 + i * 40) % 140)} r="9" fill="#fff" opacity="0.8" />)}
        <g transform={`translate(540 880) rotate(${spin})`}>{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="-14" y="-130" width="28" height="130" rx="10" fill={YEL} transform={`rotate(${i * 60})`} />)}<circle r="30" fill="#fff" /></g>
        <path d="M540 1010 L540 1090" stroke="#8A93B2" strokeWidth="8" />
        <g transform="translate(540 1170)"><circle r={60 + 20 * lit} fill={YEL} opacity={0.2 + 0.5 * lit} /><circle r="40" fill={lit > 0.5 ? YEL : '#555A7A'} /></g>
      </svg>
      {t > A.how + 4 && <div style={{position: 'absolute', left: 80, top: 780, opacity: ramp(t, A.how + 3.6, A.how + 4.1)}}><Chip size={38} bg="rgba(255,255,255,0.1)">উঁচু থেকে পানি পড়ে</Chip></div>}
    </Stage>
  );
};
// S8 units
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.units, b = A.but;
  const k1 = ease((t - A.units - 1) / 1), k2 = ease((t - A.now) / 1.3);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={290}><Title size={62}>ক্ষমতা বেড়েছে</Title></Center>
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1].map((i) => <IsoBox key={i} x={250 + i * 110} y={1020 - i * 30} s={80} h={120 * k1} color={YEL} glow={0} op={1} />)}
        {t > A.now - 0.2 && [0, 1, 2, 3, 4].map((i) => <IsoBox key={'n' + i} x={560 + i * 90} y={1020 - i * 30} s={80} h={Math.max(0, 120 + 40 * i) * k2 / 1.0} color={CY} glow={0} op={1} />)}
      </svg>
      <div style={{position: 'absolute', left: 100, top: 1120, fontFamily: FONT_BN, fontWeight: 800, color: YEL, textAlign: 'center', opacity: ramp(t, A.units + 1.5, A.units + 2)}}><div style={{fontSize: 40, color: C.muted}}>শুরুতে · ২ ইউনিট</div><div style={{fontSize: 70}}>৮০ মেগাওয়াট</div></div>
      {t > A.now && <div style={{position: 'absolute', right: 80, top: 1120, fontFamily: FONT_BN, fontWeight: 800, color: CY, textAlign: 'center', opacity: ramp(t, A.now, A.now + 0.5)}}><div style={{fontSize: 40, color: C.muted}}>এখন · ৫ ইউনিট</div><div style={{fontSize: 70}}>~২৩০ মেগাওয়াট</div></div>}
    </Stage>
  );
};
// S9 displacement
const S9: React.FC<{t: number}> = ({t}) => {
  const a = A.but, b = A.omit;
  const flood = ease((t - A.but - 1.5) / 3);
  const fam = ease((t - A.refugee - 2) / 1.5);
  const land = ease((t - A.land) / 1.4);
  return (
    <Stage t={t} a={a} b={b}>
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}>{[0, 1, 2, 3, 4].map((i) => <House key={i} x={170 + i * 185} y={720 + (i % 2) * 30} s={1.3} c={flood > 0.5 ? '#9BB0D8' : '#E9C58A'} />)}</svg>
      <Wave t={t} y={900 - 170 * flood} h={600} op={0.7 * flood} />
      <Center top={290}><Title size={60}>হ্রদের জায়গায় ছিল বাড়ি, জমি</Title></Center>
      {t > A.refugee - 0.2 && t < A.plan && <Center top={1040}><div style={{display: 'flex', gap: 34}}><div style={{textAlign: 'center', transform: `scale(${pop(t, A.refugee)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 100, color: '#8FB4FF', lineHeight: 1}}>~{(ease((t - A.refugee) / 1.5) >= 1 ? '১ লাখ' : bnum(Math.round(100000 * ease((t - A.refugee) / 1.5))))}</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.text}}>উদ্বাস্তু মানুষ</div></div><div style={{textAlign: 'center', transform: `scale(${pop(t, A.refugee + 3)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 100, color: YEL, lineHeight: 1}}>~{bnum(Math.round(18000 * fam))}</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.text}}>পরিবার</div></div></div></Center>}
      {t >= A.plan && t < A.chakma && <Center top={1040}><Sticker t={t} at={A.plan} text="আগে থেকে পরিকল্পনা জরুরি" color={YEL} textColor={C.ink} rotate={-3} size={54} /></Center>}
      {t >= A.chakma && <><Center top={1000}><Chip size={44} bg="rgba(255,255,255,0.1)">বড় অংশ চাকমা জনগোষ্ঠী</Chip></Center>{t >= A.land - 0.2 && <div style={{position: 'absolute', left: 110, top: 1130, width: 860, opacity: ramp(t, A.land - 0.2, A.land + 0.3)}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 38, color: C.muted, marginBottom: 12}}>চাষযোগ্য জমি পানির নিচে</div><div style={{height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.1)'}}><div style={{width: `${40 * land}%`, height: '100%', borderRadius: 16, background: BLUE}} /></div><div style={{marginTop: 10, fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: '#8FB4FF'}}>প্রায় {bnum(Math.round(40 * land))}%</div></div>}{t >= A.comp && <Center top={1322}><Sticker t={t} at={A.comp} text="অনেকে পর্যাপ্ত ক্ষতিপূরণ পাননি" color="#7A86B8" rotate={-3} size={38} /></Center>}</>}
    </Stage>
  );
};
// S10 omitted numbers + how to judge
const S10: React.FC<{t: number}> = ({t}) => {
  const a = A.omit, b = A.truth;
  const items = [['কতজন সরলেন', A.weigh + 2.2], ['কী ক্ষতিপূরণ পেলেন', A.weigh + 5], ['পরের প্রকল্পে কী শিক্ষা', A.weigh + 7.5]] as const;
  return (
    <Stage t={t} a={a} b={b}>
      {t < A.weigh && <Center top={600}><div style={{textAlign: 'center', transform: `scale(${pop(t, a)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.text}}>হ্রদের আয়তন, বাঁধের উচ্চতা</div><div style={{marginTop: 20, fontFamily: FONT_BN, fontWeight: 700, fontSize: 48, color: C.muted}}>সূত্রে সংখ্যা আলাদা, তাই বাদ</div></div></Center>}
      {t >= A.weigh - 0.2 && <><Center top={300}><Title size={56}>শুধু মেগাওয়াটে হিসাব নয়</Title></Center><div style={{position: 'absolute', left: 110, top: 560, display: 'flex', flexDirection: 'column', gap: 36}}>{items.map(([x, at], i) => { const k = ease((t - at) / 0.4); return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: 0.25 + 0.75 * k}}><div style={{width: 80, height: 80, borderRadius: 99, background: i === 0 ? '#8FB4FF' : i === 1 ? YEL : CY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 48, color: C.ink}}>{bnum(i + 1)}</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 50, color: C.text}}>{x}</div></div>; })}</div></>}
    </Stage>
  );
};
// S11 balance + today
const S11: React.FC<{t: number}> = ({t}) => {
  const a = A.truth, b = A.comment;
  const tilt = Math.sin(t * 0.8) * 2;
  return (
    <Stage t={t} a={a} b={b}>
      {t < A.today && <>
        <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><g transform={`translate(540 640) rotate(${tilt})`}><rect x="-8" y="-20" width="16" height="420" fill="#8A93B2" /><rect x="-300" y="-26" width="600" height="14" rx="7" fill="#C7CDE6" /><line x1="-280" y1="-12" x2="-280" y2="150" stroke="#8A93B2" strokeWidth="4" /><line x1="280" y1="-12" x2="280" y2="150" stroke="#8A93B2" strokeWidth="4" /><rect x="-370" y="150" width="180" height="26" rx="13" fill={YEL} /><rect x="190" y="150" width="180" height="26" rx="13" fill="#8FB4FF" /></g></svg>
        <div style={{position: 'absolute', left: 100, top: 950, fontFamily: FONT_BN, fontWeight: 800, fontSize: 52, color: YEL, opacity: ramp(t, A.truth, A.truth + 0.4)}}>বিদ্যুৎ দরকার ছিল</div>
        <div style={{position: 'absolute', right: 70, top: 1040, fontFamily: FONT_BN, fontWeight: 800, fontSize: 52, color: '#8FB4FF', opacity: ramp(t, A.truth + 2.2, A.truth + 2.7)}}>ক্ষতিও সত্যি</div>
        {t > A.truth + 5 && <Center top={1280}><Sticker t={t} at={A.truth + 5} text="দুটোই একসাথে মনে রাখা দরকার" color={C.signature} rotate={-3} size={46} /></Center>}
      </>}
      {t >= A.today && <>
        <Center top={330}><Title size={62}>আজও কাপ্তাই</Title></Center>
        <Wave t={t} y={760} h={400} op={0.8} />
        <Center top={1250}><div style={{display: 'flex', gap: 26}}><Chip size={42} bg={CY} color={C.ink}>পর্যটকের পছন্দ</Chip><Chip size={42} bg={YEL} color={C.ink}>জাতীয় গ্রিডে বিদ্যুৎ</Chip></div></Center>
      </>}
    </Stage>
  );
};
const S12: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.comment;
  const msg = 'ক্ষতিপূরণ আগে নিশ্চিত হওয়া উচিত';
  const typeP = ramp(t, a + 2.8, a + 4.6);
  const keyAt = A.end + 0.25;
  return (
    <Stage t={t} a={a} b={A.end + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="উন্নয়ন আর ক্ষতির হিসাব কীভাবে মেলাবেন?" color={YEL} textColor={C.ink} rotate={-3} size={44} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}><div style={{display: 'flex', alignItems: 'center', gap: 14}}><div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} /><div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.text}}>{t > a + 2.8 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>ভদ্রভাবে মত লিখুন…</span>}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div></div><div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div></div>
      {t > A.send - 0.1 && <div style={{position: 'absolute', left: 120, top: 740, display: 'flex', gap: 40, opacity: ramp(t, A.send, A.send + 0.4)}}><Bean kind="abbu" size={150} t={t} mood="happy" /><div style={{alignSelf: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.signature}}>→</div><Bean kind="ammu" size={150} t={t} mood="happy" phase={1} /></div>}
      <FollowPill t={t} at={A.cta_word} platform={platform} top={980} opacity={ramp(t, A.cta, A.cta + 0.4)} />
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={1030} />
      {t > keyAt - 0.1 && <div style={{position: 'absolute', left: 60, right: 60, top: 1180, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}><Title size={72}>দুই দিকই দেখুন,</Title><Title size={72} color={YEL}>তারপর মত দিন</Title></div>}
    </Stage>
  );
};
// history scene between S2 and S4 is part of S1 (year/only chips) -> add as overlay
const HistoryOverlay: React.FC<{t: number}> = ({t}) => (t > A.karna - 0.2 && t < A.follow ? (
  <div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center', gap: 14, opacity: ramp(t, A.karna, A.karna + 0.4)}}><Chip size={36} bg="rgba(255,255,255,0.1)">কর্ণফুলী নদী</Chip>{t > A.year - 0.2 && <Chip size={36} bg={YEL} color={C.ink}>১৯৬২ সালে শেষ</Chip>}{t > A.only - 0.2 && <Chip size={36} bg={CY} color={C.ink}>একমাত্র বড় পানিবিদ্যুৎ কেন্দ্র</Chip>}</div>
) : null);
export const Cover: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Background t={0} blueprint={0} />
      <Wave t={2} y={1150} h={770} />
      <Dam x={540} y={1000} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 290, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 118, lineHeight: 1.12, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>কাপ্তাই বাঁধ<br /><span style={{color: YEL}}>আলো</span> আর <span style={{color: '#8FB4FF'}}>ক্ষতি</span></div>
      <Center top={760}><Sticker t={10} at={0} text="২৩০ মেগাওয়াট বনাম ১ লাখ মানুষ" color="#4D6BFF" rotate={-3} size={52} /></Center>
    </AbsoluteFill>
  );
};
const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.1, file: 'whoosh', vol: 0.4}, {at: A.mw, file: 'counter_roll', vol: 0.45}, {at: A.people, file: 'tick', vol: 0.8}, {at: A.lost, file: 'impact_boom', vol: 0.4}, {at: A.follow - 0.3, file: 'whoosh', vol: 0.3},
  {at: A.mix, file: 'whoosh', vol: 0.3}, {at: A.special, file: 'tick', vol: 0.8}, {at: A.dam, file: 'whoosh', vol: 0.3}, {at: A.how, file: 'whoosh', vol: 0.3}, {at: A.units, file: 'whoosh', vol: 0.3}, {at: A.now, file: 'counter_roll', vol: 0.4},
  {at: A.but, file: 'rise_stinger', vol: 0.4}, {at: A.refugee, file: 'counter_roll', vol: 0.45}, {at: A.land, file: 'counter_roll', vol: 0.4}, {at: A.omit, file: 'whoosh', vol: 0.3}, {at: A.truth, file: 'tick', vol: 0.8}, {at: A.today, file: 'whoosh', vol: 0.3}, {at: A.cta - 0.8, file: 'whoosh', vol: 0.25},
];
export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [{from: A.hook + 1, to: A.follow, text: 'সূত্র: Wikipedia, Banglapedia'}, {from: A.but, to: A.omit, text: 'সূত্র: International Rivers, Wikipedia'}];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      {SFX.map((s, i) => <Sequence key={i} from={Math.round(s.at * FPS)}><Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.vol * 0.5} /></Sequence>)}
      <Background t={t} blueprint={0} />
      <S1 t={t} /><S2 t={t} platform={platform} /><S4 t={t} /><S6 t={t} /><S7 t={t} /><S8 t={t} /><S9 t={t} /><S10 t={t} /><S11 t={t} /><S12 t={t} platform={platform} />
      <HistoryOverlay t={t} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, top: 214, fontFamily: FONT_BN, fontWeight: 600, fontSize: 23, color: C.muted, opacity: 0.85}}>আঁকা গ্রাফিক্স · আসল ছবি নয়</div>
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
