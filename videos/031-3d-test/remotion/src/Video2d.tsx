import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Platform, SourcePill, Stage, Sticker, Title, W, clamp01, ease, pop, ramp, useFonts, useT, FPS} from './lib';
import {IsoBox, Tag, bnum} from './iso';
import {Scene3D} from './Scene3D';

// Video 029: Bangabandhu Satellite-1. Own drawn 2.5D graphics, no real photos or logos.
const YEL = '#FFC24D', ORG = '#FF7A2F', RED = '#FF4D6D', CY = '#26C6DA';
const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);
const Stars: React.FC<{t: number}> = () => null;
const Rocket: React.FC<{x: number; y: number; s?: number; flame?: number; tilt?: number}> = () => null;
const Sat: React.FC<{x: number; y: number; s?: number; rot?: number}> = () => null;

// ---- S1 hook: countdown stops at 58
const S1: React.FC<{t: number}> = ({t}) => {
  const a = 0, b = A.follow;
  const stop = t > A.s58 + 0.9;
  const count = t < A.hook + 2.4 ? 60 : t < A.s58 + 0.9 ? Math.max(58, Math.round(62 - (t - 2.4) * 1.5)) : 58;
  const shake = !stop ? 0 : Math.sin(t * 40) * 3 * (1 - ramp(t, A.s58 + 0.9, A.s58 + 2));
  const lift = 0;
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <Stars t={t} />
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Rocket x={540 + shake} y={820} s={2.6} flame={0} /></svg>
      <Center top={300}><Chip size={40} bg="rgba(255,255,255,0.1)">ফ্লোরিডা · ১০ মে ২০১৮</Chip></Center>
      <Center top={380}><div style={{padding: '14px 50px', borderRadius: 30, background: '#0E0A1F', border: `5px solid ${stop ? RED : CY}`, fontFamily: FONT, fontWeight: 800, fontSize: 130, color: stop ? RED : CY, letterSpacing: 6, transform: `scale(${pop(t, A.hook + 0.2)})`}}>{`T-০০:${bnum(count)}`}</div></Center>
      {stop && <Center top={1260}><Sticker t={t} at={A.s58 + 0.9} text="রকেট নিজেই থামল" color={RED} rotate={-3} size={62} /></Center>}
      {t > A.inside - 0.1 && t < A.follow && <Center top={1380}><Chip size={40} bg={CY} color={C.ink}>ভেতরে: বাংলাদেশের প্রথম স্যাটেলাইট</Chip></Center>}
      {t > A.wait && t < A.night && <Center top={1100}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.warn, transform: `scale(${pop(t, A.what)})`}}>?</div></Center>}
    </Stage>
  );
};
const S2: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.reason;
  return (
    <Stage t={t} a={a} b={b}>
      <Stars t={t} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}><Title size={78}>মহাকাশের গল্প</Title><Title size={78} color={YEL}>আরও জানতে</Title></div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};
// ---- S3: why it stopped
const S3: React.FC<{t: number}> = ({t}) => {
  const a = A.reason, b = A.next;
  const warn = ramp(t, a + 1, a + 1.4);
  return (
    <Stage t={t} a={a} b={b}>
      <Stars t={t} />
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Rocket x={800} y={760} s={1.5} /></svg>
      <div style={{position: 'absolute', left: 80, top: 360, width: 440, padding: '26px', borderRadius: 28, background: '#0E0A1F', border: `4px solid ${warn > 0.5 ? RED : CY}`, transform: `scale(${pop(t, a + 0.2)})`}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: C.text}}>রকেটের কম্পিউটার</div>
        <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{height: 18, borderRadius: 9, background: i === 2 && warn > 0.5 ? RED : 'rgba(38,198,218,0.5)', width: 100 - i * 14 + '%'}} />)}</div>
        <div style={{marginTop: 16, fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: warn > 0.5 ? RED : C.muted}}>{warn > 0.5 ? 'সমস্যা ধরা পড়েছে' : 'পরীক্ষা চলছে'}</div>
      </div>
      {t > A.safe - 0.2 && <Center top={1000}><div style={{display: 'flex', gap: 26, transform: `scale(${pop(t, A.safe)})`}}><div style={{padding: '22px 30px', borderRadius: 26, background: 'rgba(255,77,109,0.15)', border: `4px solid ${RED}`, fontFamily: FONT_BN, fontWeight: 800, fontSize: 42, color: RED, textAlign: 'center'}}>ঝুঁকি নিয়ে<br />ছোড়া</div><div style={{padding: '22px 30px', borderRadius: 26, background: 'rgba(38,198,218,0.18)', border: `4px solid ${CY}`, fontFamily: FONT_BN, fontWeight: 800, fontSize: 42, color: CY, textAlign: 'center'}}>থামিয়ে<br />দেওয়া ✓</div></div></Center>}
      {t > A.common - 0.2 && <Center top={1260}><Sticker t={t} at={A.common} text="এমন বাতিল নতুন কিছু না" color={YEL} textColor={C.ink} rotate={-3} size={50} /></Center>}
    </Stage>
  );
};
// ---- S4: next day, launch
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.next, b = A.comms;
  const lift = ease((t - A.launch - 1.6) / 4);
  const launched = t > A.launch - 0.2;
  return (
    <Stage t={t} a={a} b={b}>
      <Stars t={t} />
      {!launched && <Center top={330}><div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${pop(t, a + 0.1)})`}}><div style={{padding: '20px 36px', borderRadius: 24, background: '#2B2250', fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.muted, textDecoration: 'line-through'}}>১০ মে</div><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.text}}>→</div><div style={{padding: '20px 36px', borderRadius: 24, background: '#F5F7FF', fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: C.ink, transform: `scale(${pop(t, a + 1)})`}}>১১ মে</div></div></Center>}
      {!launched && t > a + 2 && <Center top={620}><Sticker t={t} at={a + 2} text="আবার চেষ্টা, এবার ঠিকঠাক" color={C.good} textColor={C.ink} rotate={-3} size={54} /></Center>}
      {launched && (
        <>
          <svg width={W} height={1700} style={{position: 'absolute', left: 0, top: 0}}><Rocket x={540} y={1050 - lift * 780} s={1.8 - lift * 0.5} flame={t > A.launch + 1.4 ? 0.9 + 0.3 * Math.sin(t * 30) : 0} /></svg>
          <Center top={290}><Chip size={40} bg="rgba(255,255,255,0.1)">কেপ কেনাভেরাল · ফ্লোরিডা</Chip></Center>
          {t > A.launch + 2 && t < A.block5 && <Center top={1450}><Chip size={42} bg={YEL} color={C.ink}>ফ্যালকন ৯ রকেটে বঙ্গবন্ধু স্যাটেলাইট-১</Chip></Center>}
        </>
      )}
      {t > A.block5 - 0.1 && (
        <Center top={1130} style={{opacity: ramp(t, A.block5, A.block5 + 0.4)}}><div style={{transform: `scale(${pop(t, A.block5)})`, padding: '18px 34px', borderRadius: 28, background: '#0E0A1F', border: `4px solid ${YEL}`, textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.muted}}>ফ্যালকন ৯-এর নতুন সংস্করণ</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: YEL}}>ব্লক ৫ · প্রথম উড্ডয়ন</div></div></Center>
      )}
    </Stage>
  );
};
// ---- S5: what it does + transponders + orbit
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.comms, b = A.life;
  const showTp = t > A.tp - 0.2 && t < A.orbit;
  const orbit = t >= A.orbit - 0.2;
  const k = ease((t - a) / 1.2);
  return (
    <Stage t={t} a={a} b={b}>
      <Stars t={t} />
      {!showTp && (
        <>
          <svg width={W} height={1700} style={{position: 'absolute', left: 0, top: 0}}>
          </svg>
          {!orbit && <div style={{position: 'absolute', left: 0, right: 0, top: 1210, display: 'flex', justifyContent: 'center', gap: 36, opacity: ramp(t, a + 1.3, a + 1.8)}}>{['টিভি সম্প্রচার', 'ডেটা সংযোগ'].map((x, i) => <Chip key={i} size={42} bg={i ? CY : YEL} color={C.ink}>{x}</Chip>)}</div>}
          {orbit && <Center top={310}><Title size={60}>পৃথিবীর একই জায়গার ওপর স্থির</Title></Center>}
          {orbit && t > A.orbit + 5.5 && <Center top={1330}><Sticker t={t} at={A.orbit + 5.5} text="এন্টেনা একবার ঠিক করলেই হলো" color={CY} textColor={C.ink} rotate={-3} size={46} /></Center>}
          {!orbit && <Center top={300}><Title size={70}>যোগাযোগ স্যাটেলাইট</Title></Center>}
        </>
      )}
      {showTp && (
        <>
          <Center top={290}><div style={{textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.muted}}>বেশিরভাগ সূত্র বলছে</div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.text}}>ট্রান্সপন্ডার</div></div></Center>
          <div style={{position: 'absolute', left: 100, top: 540, width: 880, display: 'flex', flexWrap: 'wrap', gap: 12}}>{Array.from({length: 40}).map((_, i) => { const ku = i < 26; const on = ease((t - A.tp - 0.6 - i * 0.04) / 0.2); return <div key={i} style={{width: 76, height: 76, borderRadius: 14, background: ku ? YEL : CY, opacity: 0.12 + 0.88 * on, transform: `scale(${0.6 + 0.4 * on})`}} />; })}</div>
          <Center top={1020}><div style={{display: 'flex', gap: 40}}><div style={{textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 120, color: YEL, lineHeight: 1}}>{bnum(26)}</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 38, color: C.text}}>কেইউ-ব্যান্ড</div></div><div style={{textAlign: 'center'}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 120, color: CY, lineHeight: 1}}>{bnum(14)}</div><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 38, color: C.text}}>সি-ব্যান্ড</div></div></div></Center>
        </>
      )}
    </Stage>
  );
};
// ---- S6: life, question, cost, big task
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.life, b = A.name;
  const life = ease((t - a - 0.8) / 2.2);
  const cap = ease((t - A.q - 3) / 1.6);
  return (
    <Stage t={t} a={a} b={b}>
      <Stars t={t} />
      {t < A.q && <><Center top={330}><Title size={64}>নকশার আয়ু</Title></Center><div style={{position: 'absolute', left: 110, top: 560, width: 860}}><div style={{height: 70, borderRadius: 35, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}><div style={{width: `${life * 100}%`, height: '100%', background: `linear-gradient(90deg, ${CY}, ${C.good})`}} /></div><div style={{marginTop: 20, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 120, color: C.text}}>{bnum(Math.round(15 * life))}+ <span style={{fontSize: 56, color: C.muted}}>বছর</span></div></div></>}
      {t >= A.q && t < A.cost && <><Center top={320}><Sticker t={t} at={A.q} text="একটা প্রশ্নও উঠেছে" color={YEL} textColor={C.ink} rotate={-3} size={58} /></Center><div style={{position: 'absolute', left: 110, top: 600, width: 860, opacity: ramp(t, A.q + 2.2, A.q + 2.8)}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.muted, marginBottom: 16}}>স্যাটেলাইটের ক্ষমতা (চিত্রটা বোঝানোর জন্য আঁকা)</div><div style={{height: 90, borderRadius: 20, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}><div style={{width: `${cap * 45}%`, height: '100%', background: CY}} /></div><div style={{marginTop: 16, fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: RED}}>অনেকটাই বিক্রি হয়নি (TBS)</div></div><Center top={1000}><Chip size={40} bg="rgba(255,255,255,0.1)">বানানো ≠ কাজে লাগানো</Chip></Center></>}
      {t >= A.cost && t < A.big && <Center top={620}><div style={{textAlign: 'center', transform: `scale(${pop(t, A.cost)})`}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 80, color: C.text}}>খরচের সংখ্যা</div><div style={{marginTop: 20, fontFamily: FONT_BN, fontWeight: 700, fontSize: 54, color: C.muted}}>সূত্রভেদে আলাদা, তাই বলছি না</div></div></Center>}
      {t >= A.big && <><Center top={330}><div style={{display: 'flex', gap: 30, alignItems: 'center'}}>{[['বানানো', YEL], ['কাজে লাগানো', CY]].map(([x, c], i) => <div key={i} style={{padding: '28px 34px', borderRadius: 28, background: 'rgba(255,255,255,0.08)', border: `5px solid ${c}`, fontFamily: FONT_BN, fontWeight: 800, fontSize: 54, color: c as string, transform: `scale(${pop(t, A.big + 0.3 + i * 0.9)})`}}>{x}</div>)}</div></Center><Center top={700}><Title size={56}>দুটোই বড় কাজ</Title></Center>{t > A.big + 5.4 && <Center top={920}><Sticker t={t} at={A.big + 5.4} text="দেশের শেখারও সুযোগ" color={C.good} textColor={C.ink} rotate={-3} size={54} /></Center>}</>}
    </Stage>
  );
};
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.name, b = A.comment;
  return (
    <Stage t={t} a={a} b={b}>
      <Stars t={t} />
      <svg width={W} height={1500} style={{position: 'absolute', left: 0, top: 0}}><Sat x={540} y={620} s={1.6} rot={Math.sin(t) * 3} /></svg>
      <Center top={300}><Title size={70} color={YEL}>বঙ্গবন্ধু স্যাটেলাইট-১</Title></Center>
      {t > A.name + 3 && <Center top={1000}><Sticker t={t} at={A.name + 3.2} text="দেশের প্রথম বড় ধাপ" color={C.signature} rotate={-3} size={60} /></Center>}
    </Stage>
  );
};
const S8: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.comment;
  const msg = 'খুব জরুরি, নিজের থাকা উচিত';
  const typeP = ramp(t, a + 2.5, a + 4.2);
  const keyAt = A.end + 0.25;
  return (
    <Stage t={t} a={a} b={A.end + 10} noFadeOut>
      <Stars t={t} />
      <Center top={300}><Sticker t={t} at={a + 0.1} text="দেশের নিজের স্যাটেলাইট কতটা জরুরি?" color={YEL} textColor={C.ink} rotate={-3} size={48} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}><div style={{display: 'flex', alignItems: 'center', gap: 14}}><div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} /><div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.text}}>{t > a + 2.5 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div></div><div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div></div>
      {t > A.send - 0.1 && <div style={{position: 'absolute', left: 120, top: 740, display: 'flex', gap: 40, opacity: ramp(t, A.send, A.send + 0.4)}}><Bean kind="bhai" size={150} t={t} mood="happy" /><div style={{alignSelf: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.signature}}>→</div><Bean kind="bon" size={150} t={t} mood="happy" phase={1} /></div>}
      <FollowPill t={t} at={A.cta_word} platform={platform} top={980} opacity={ramp(t, A.cta, A.cta + 0.4)} />
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={1030} />
      {t > keyAt - 0.1 && <div style={{position: 'absolute', left: 60, right: 60, top: 1180, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}><Title size={72}>মহাকাশের গল্প,</Title><Title size={72} color={YEL}>আরও জানুন</Title></div>}
    </Stage>
  );
};
export const Cover: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Scene3D tOverride={A.launch + 5.2} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 290, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 124, lineHeight: 1.12, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>রকেট থেমে গেল<br /><span style={{color: YEL}}>৫৮ সেকেন্ড</span> আগে</div>
      <Center top={1560}><Sticker t={10} at={0} text="বাংলাদেশের প্রথম স্যাটেলাইটের গল্প" color={RED} rotate={-3} size={46} /></Center>
    </AbsoluteFill>
  );
};
const SFX: {at: number; file: string; vol: number}[] = [
  {at: 0.1, file: 'whoosh', vol: 0.4}, {at: A.s58 + 0.9, file: 'impact_boom', vol: 0.55}, {at: A.what, file: 'rise_stinger', vol: 0.35}, {at: A.follow - 0.3, file: 'whoosh', vol: 0.3},
  {at: A.reason, file: 'whoosh', vol: 0.3}, {at: A.safe, file: 'tick', vol: 0.8}, {at: A.next, file: 'whoosh', vol: 0.3}, {at: A.launch + 1.6, file: 'rise_stinger', vol: 0.5}, {at: A.launch + 2.2, file: 'impact_boom', vol: 0.5},
  {at: A.block5, file: 'tick', vol: 0.8}, {at: A.comms, file: 'whoosh', vol: 0.3}, {at: A.tp + 0.6, file: 'counter_roll', vol: 0.45}, {at: A.orbit, file: 'whoosh', vol: 0.3}, {at: A.life, file: 'counter_roll', vol: 0.4},
  {at: A.q, file: 'tick', vol: 0.8}, {at: A.big, file: 'tick', vol: 0.8}, {at: A.name, file: 'whoosh', vol: 0.3}, {at: A.cta - 0.8, file: 'whoosh', vol: 0.25},
];
export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [{from: A.s58, to: A.follow, text: 'সূত্র: Thales, Wikipedia'}, {from: A.tp, to: A.orbit, text: 'সূত্র: Jago News (Banglapedia-য় ২৪+১৬)'}, {from: A.q, to: A.cost, text: 'সূত্র: TBS'}];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      {SFX.map((s, i) => <Sequence key={i} from={Math.round(s.at * FPS)}><Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.vol * 0.5} /></Sequence>)}
      <Scene3D />
      <S1 t={t} /><S2 t={t} platform={platform} /><S3 t={t} /><S4 t={t} /><S5 t={t} /><S6 t={t} /><S7 t={t} /><S8 t={t} platform={platform} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 40, top: 214, fontFamily: FONT_BN, fontWeight: 600, fontSize: 23, color: C.muted, opacity: 0.85}}>আঁকা গ্রাফিক্স · আসল ছবি নয়</div>
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
