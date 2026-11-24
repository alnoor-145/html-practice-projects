import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FollowCard, FollowPill, FONT, FONT_BN, Iris, LabelExample, Phone, Platform,
  Scribble, SourcePill, Stage, Sticker, Title, W, WORDS, clamp01, ease, pop, ramp, useFonts, useT,
} from './lib';

// Video 023: the "I do not give Facebook permission" chain post does nothing. Own drawings only. One render for both platforms.
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
const NumBadge: React.FC<{n: string; t: number; at: number}> = ({n, t, at}) => (
  <div style={{position: 'absolute', left: 60, top: 280, width: 120, height: 120, borderRadius: 99, background: C.good, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.ink, transform: `scale(${pop(t, at)})`}}>{n}</div>
);
const RuleTitle: React.FC<{t: number; at: number; children: React.ReactNode}> = ({t, at, children}) => (
  <div style={{position: 'absolute', left: 210, right: 60, top: 300, opacity: ramp(t, at, at + 0.3), fontFamily: FONT_BN, fontWeight: 800, fontSize: 56, color: C.text, lineHeight: 1.2}}>{children}</div>
);
const Shield: React.FC<{size?: number; color?: string}> = ({size = 140, color = C.good}) => (
  <svg width={size} height={size} viewBox="0 0 100 100"><path d="M50 6 L86 20 V48 Q86 78 50 94 Q14 78 14 48 V20 Z" fill={color} /><path d="M33 50 L45 62 L68 36" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const POST = 'আমি ফেসবুক বা মেটাকে আমার ছবি আর তথ্য ব্যবহারের অনুমতি দিচ্ছি না।';
const PostCard: React.FC<{t: number; typeP?: number; shareK?: number}> = ({t, typeP = 1, shareK = 0}) => (
  <div style={{width: 880, borderRadius: 32, background: '#F5F7FF', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', padding: '30px 34px'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{width: 70, height: 70, borderRadius: 99, background: '#7A86B8'}} />
      <div><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 34, color: C.ink}}>আপনার বন্ধু</div><div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 24, color: '#6B6890'}}>এইমাত্র</div></div>
    </div>
    <div style={{marginTop: 18, fontFamily: FONT_BN, fontWeight: 700, fontSize: 44, lineHeight: 1.35, color: C.ink, minHeight: 120}}>{POST.slice(0, Math.ceil(POST.length * typeP))}</div>
    <div style={{marginTop: 14, display: 'flex', gap: 16, opacity: shareK}}><Chip size={28} bg="#E1E7FF" color={C.ink}>শেয়ার না করলে সব ফাঁস!</Chip></div>
  </div>
);

const S1: React.FC<{t: number}> = ({t}) => {
  const a = 0, b = A.follow;
  const typeP = ramp(t, A.noperm - 0.2, A.noperm + 3.4);
  const tags = ramp(t, A.tag - 0.3, A.tag + 1.2);
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <Center top={300} style={{transform: `scale(${pop(t, 0.1)})`}}><PostCard t={t} typeP={typeP} shareK={ramp(t, A.share, A.share + 0.4)} /></Center>
      <LabelExample style={{left: 100, top: 262}} />
      {t > A.copy - 0.1 && (
        <Center top={800}><div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${pop(t, A.copy)})`}}>
          <Chip size={40} bg={C.warn} color={C.ink}>কপি</Chip>
          <svg width="80" height="40" viewBox="0 0 80 40"><path d="M4 20 H62 M48 6 L66 20 L48 34" fill="none" stroke={C.muted} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <Chip size={40} bg={C.signature}>আপনার টাইমলাইন</Chip>
        </div></Center>
      )}
      <div style={{position: 'absolute', left: 100, top: 960, display: 'flex', gap: 22, opacity: tags}}>
        {(['abbu', 'ammu', 'bhai', 'bon'] as const).map((k, i) => <div key={i} style={{transform: `scale(${pop(t, A.tag + i * 0.25)})`, textAlign: 'center'}}><Bean kind={k} size={130} t={t} mood="happy" phase={i} /><Chip size={26} bg="rgba(77,139,255,0.3)">@ট্যাগ</Chip></div>)}
      </div>
    </Stage>
  );
};
const S2: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.truth;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}><Title size={80}>ফেসবুকের ভুল ধারণা</Title><Title size={80} color={C.good}>ভাঙা হয় এখানে</Title></div>
      <FollowCard t={t} appear={a + 0.3} at={A.follow_word} platform={platform} top={660} />
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={760} />
    </Stage>
  );
};
const S3: React.FC<{t: number}> = ({t}) => {
  const a = A.truth, b = A.why;
  const stamp = pop(t, A.truth + 0.5, {damping: 10, stiffness: 260});
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 100, top: 360, opacity: 0.9}}><div style={{transform: 'scale(0.9)', transformOrigin: 'top left'}}><PostCard t={t} /></div></div>
      <div style={{position: 'absolute', left: 120, top: 520, transform: `rotate(-12deg) scale(${lerp(1.8, 1, stamp)})`, opacity: clamp01(stamp * 2)}}>
        <div style={{padding: '14px 40px', border: `12px solid ${C.danger}`, borderRadius: 26, fontFamily: FONT_BN, fontWeight: 800, fontSize: 130, color: C.danger, background: 'rgba(18,11,36,0.55)'}}>কিছুই হয় না</div>
      </div>
      {t > A.factcheck - 0.2 && <Center top={960}><div style={{transform: `scale(${pop(t, A.factcheck - 0.1)})`, display: 'flex', alignItems: 'center', gap: 18, padding: '16px 34px', borderRadius: 999, background: '#1E1538', border: `3px solid ${C.good}`}}><Shield size={70} /><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: C.text}}>ফ্যাক্টচেকাররা বহুবার যাচাই করেছেন</div></div></Center>}
    </Stage>
  );
};
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.why, b = A.todo;
  const tick = ease((t - A.terms - 0.3) / 0.4);
  const cross = ramp(t, A.cant, A.cant + 0.5);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="অ্যাকাউন্ট খোলার দিন" color={C.signature} rotate={-3} size={54} /></Center>
      <div style={{position: 'absolute', left: 110, right: 110, top: 470, borderRadius: 34, background: '#F5F7FF', padding: '34px 40px', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', transform: `scale(${pop(t, a + 0.3)})`}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: C.ink}}>ব্যবহারের শর্তাবলি</div>
        {[0.9, 0.7, 0.8, 0.5].map((w, i) => <div key={i} style={{marginTop: 16, height: 18, borderRadius: 9, width: `${w * 100}%`, background: '#D5DAEE'}} />)}
        <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{width: 74, height: 74, borderRadius: 16, border: `5px solid ${C.good}`, background: `rgba(38,198,218,${0.9 * tick})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 40 40" width="52" height="52"><path d="M8 21 L17 30 L33 11" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - tick)} /></svg></div>
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: C.ink}}>আমি সম্মত</div>
        </div>
      </div>
      {cross > 0 && <Center top={1010}><div style={{position: 'relative', opacity: cross}}><Chip size={44} bg="rgba(255,255,255,0.1)">একটা পোস্ট লিখে শর্ত বদলানো যায়?</Chip><div style={{position: 'absolute', left: 0, top: 0, width: 700}}><Scribble t={t} at={A.cant + 0.4} w={700} h={90} /></div></div></Center>}
    </Stage>
  );
};
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.todo, b = A.k1;
  return <Stage t={t} a={a} b={b}><Center top={430}><Title size={90}>তাহলে কী করবেন?</Title></Center><div style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', gap: 40}}>{['১', '২', '৩'].map((n, i) => <div key={i} style={{width: 170, height: 170, borderRadius: 99, background: C.good, border: '8px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 100, color: C.ink, transform: `scale(${pop(t, a + 1 + i * 0.15)})`}}>{n}</div>)}</div></Stage>;
};
const R1: React.FC<{t: number}> = ({t}) => {
  const a = A.k1, b = A.k2;
  const rows = [wordAt('পোস্ট', a), wordAt('ছবি', a), wordAt('তথ্য', a)];
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="১" t={t} at={a} /><RuleTitle t={t} at={a + 0.1}>প্রাইভেসি চেকআপ চালান</RuleTitle>
      <Center top={520} style={{transform: `scale(${pop(t, a + 0.3)})`}}><Shield size={220} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 800, display: 'flex', flexDirection: 'column', gap: 24}}>
        {['পোস্ট কারা দেখবে', 'ছবি কারা দেখবে', 'তথ্য কারা দেখবে'].map((x, i) => <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 30px', borderRadius: 26, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.14)', opacity: ramp(t, rows[i] - 0.2, rows[i] + 0.2)}}><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: C.text}}>{x}</div><Chip size={30} bg={C.good} color={C.ink}>ঠিক করুন</Chip></div>)}
      </div>
    </Stage>
  );
};
const R2: React.FC<{t: number}> = ({t}) => {
  const a = A.k2, b = A.k3;
  const states = [{l: 'পাবলিক', c: C.danger}, {l: 'ফ্রেন্ডস', c: C.warn}, {l: 'অনলি মি', c: C.good}];
  const idx = t < A.pub ? 0 : t < A.pub + 1.2 ? 1 : 2;
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="২" t={t} at={a} /><RuleTitle t={t} at={a + 0.1}>পুরোনো পোস্টের<br /><span style={{color: C.good}}>ভিউয়ার বদলান</span></RuleTitle>
      <Center top={620}><div style={{transform: `scale(${pop(t, a + 0.3)})`}}><div style={{width: 760, padding: '30px 40px', borderRadius: 34, background: '#F5F7FF', boxShadow: '0 20px 50px rgba(0,0,0,0.4)'}}><div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: '#6B6890'}}>কারা দেখতে পারবে</div><div style={{marginTop: 14, display: 'inline-block', padding: '10px 36px', borderRadius: 999, background: states[idx].c, fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: idx === 2 ? C.ink : '#fff'}}>{states[idx].l}</div></div></div></Center>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center', gap: 18}}>{states.map((s, i) => <div key={i} style={{opacity: i <= idx ? 1 : 0.3}}><Chip size={34} bg="rgba(255,255,255,0.1)">{s.l}</Chip></div>)}</div>
    </Stage>
  );
};
const R3: React.FC<{t: number}> = ({t}) => {
  const a = A.k3, b = A.chain;
  const apps = ['অচেনা গেম', 'ফটো-ফিল্টার অ্যাপ', 'লাকি-ড্র সাইট'];
  return (
    <Stage t={t} a={a} b={b}>
      <NumBadge n="৩" t={t} at={a} /><RuleTitle t={t} at={a + 0.1}>অচেনা অ্যাপে<br /><span style={{color: C.good}}>ফেসবুক লগইন নয়</span></RuleTitle>
      <div style={{position: 'absolute', left: 130, right: 130, top: 560, display: 'flex', flexDirection: 'column', gap: 26}}>
        {apps.map((x, i) => { const at = a + 1.2 + i * 1.3; return <div key={i} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24, padding: '22px 30px', borderRadius: 28, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.14)', transform: `scale(${pop(t, at - 0.3)})`, opacity: 1 - 0.55 * ramp(t, at + 0.4, at + 0.8)}}><div style={{width: 70, height: 70, borderRadius: 18, background: '#7A86B8'}} /><div style={{flex: 1, fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: C.text}}>{x}</div><Chip size={28} bg="rgba(77,139,255,0.3)">ফেসবুক দিয়ে লগইন</Chip><div style={{position: 'absolute', left: 20, top: 20, width: 700}}><Scribble t={t} at={at + 0.4} w={700} h={60} /></div></div>; })}
      </div>
      {t > A.k3 + 5 && <Center top={1020}><Chip size={36} bg={C.good} color={C.ink}>অপ্রয়োজনীয় অ্যাপের অনুমতি সরান</Chip></Center>}
    </Stage>
  );
};
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.chain, b = A.send;
  const n = Math.floor(ramp(t, a + 0.4, a + 4) * 16);
  return (
    <Stage t={t} a={a} b={b}>
      <Center top={300}><Title size={64}>চেইন পোস্টে ট্যাগ করলে</Title></Center>
      <div style={{position: 'absolute', left: 100, right: 100, top: 460, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20}}>
        {Array.from({length: 16}).map((_, i) => <div key={i} style={{display: 'flex', justifyContent: 'center', opacity: i < n ? 1 : 0.1, transform: `scale(${i < n ? 1 : 0.7})`}}><Bean kind={(['abbu', 'ammu', 'bhai', 'bon'] as const)[i % 4]} size={100} t={t} bounce={0.3} phase={i} /></div>)}
      </div>
      {t > a + 4 && <Center top={1200}><Sticker t={t} at={a + 4} text="গুজবের অংশ হয়ে যাবেন" color={C.danger} rotate={-3} size={52} /></Center>}
    </Stage>
  );
};
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.send, b = A.question;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 90, top: 300, width: 800}}><Title size={56}>যে বন্ধু বা আত্মীয়</Title><Title size={56} color={C.good}>এই পোস্ট শেয়ার করেন</Title></div>
      <div style={{position: 'absolute', left: 200, top: 640, transform: `scale(${pop(t, a + 0.2)})`}}><Phone w={250} h={440} tilt={-6}><div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{width: 96, height: 96, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="42" height="42" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg></div></div></Phone></div>
      <div style={{position: 'absolute', left: 640, top: 700, transform: `scale(${pop(t, a + 1)})`, textAlign: 'center'}}><Bean kind="ammu" size={170} t={t} mood="happy" /><div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 32, color: C.text}}>খালা</div></div>
    </Stage>
  );
};
const S8: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.question;
  const msg = 'হ্যাঁ, একবার দিয়েছিলাম';
  const typeP = ramp(t, A.comment - 0.2, A.comment + 0.8);
  const keyAt = END + 0.25;
  return (
    <Stage t={t} a={a} b={END + 10} noFadeOut>
      <Center top={300}><Sticker t={t} at={a + 0.1} text="এমন পোস্ট দিয়েছেন কখনো?" color={C.good} textColor={C.ink} rotate={-3} size={54} /></Center>
      <div style={{position: 'absolute', left: 150, right: 150, top: 470, padding: '24px 28px', borderRadius: 30, background: '#1E1538', border: '2px solid rgba(255,255,255,0.12)', opacity: ramp(t, a + 0.4, a + 0.8)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}><div style={{width: 54, height: 54, borderRadius: 99, background: '#7A86B8'}} /><div style={{flex: 1, height: 64, borderRadius: 32, background: '#2B1F4E', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_BN, fontWeight: 700, fontSize: 32, color: C.text}}>{t > A.comment - 0.2 ? msg.slice(0, Math.ceil(msg.length * typeP)) : <span style={{color: C.muted, fontSize: 28}}>কমেন্ট লিখুন…</span>}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div></div>
        <div style={{marginTop: 10, textAlign: 'right', fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>উদাহরণ</div>
      </div>
      <FollowPill t={t} at={A.cta_word} platform={platform} top={700} opacity={ramp(t, A.cta, A.cta + 0.4)} />
      <Confetti t={t} at={A.cta_word + 0.1} x={780} y={760} />
      {t > keyAt - 0.1 && <div style={{position: 'absolute', left: 60, right: 60, top: 1000, textAlign: 'center', transform: `scale(${pop(t, keyAt)})`}}><Title size={82}>পোস্ট নয়,</Title><Title size={82} color={C.good}>সেটিংস বদলান</Title></div>}
    </Stage>
  );
};

export const Cover: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Background t={0} blueprint={0} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 40% at 50% 60%, rgba(255,77,109,0.3) 0%, rgba(255,77,109,0) 100%)'}} />
      <BrandPill platform={platform} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 300, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 124, lineHeight: 1.15, color: C.text, textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>"আমি অনুমতি<br />দিচ্ছি না" পোস্ট<br /><span style={{color: C.danger}}>কাজ করে?</span></div>
      <div style={{position: 'absolute', left: 100, top: 900, transform: 'scale(0.95)', transformOrigin: 'top left'}}><PostCard t={6} /></div>
      <div style={{position: 'absolute', left: 560, top: 1010, transform: 'rotate(-12deg)'}}><div style={{padding: '12px 36px', border: `12px solid ${C.danger}`, borderRadius: 26, fontFamily: FONT_BN, fontWeight: 800, fontSize: 110, color: C.danger, background: 'rgba(18,11,36,0.6)'}}>কিছুই হয় না</div></div>
      <Center top={1480}><Chip size={42} bg="rgba(255,255,255,0.1)">ফেসবুকের ভুল ধারণা ভাঙি</Chip></Center>
    </AbsoluteFill>
  );
};

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [{from: A.truth, to: A.why, text: 'সূত্র: ফ্যাক্টচেক (The Buzz Lens)'}, {from: A.todo, to: A.chain, text: 'পরামর্শ: ফেসবুক প্রাইভেসি সেটিংস'}];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      <Background t={t} blueprint={0} />
      <S1 t={t} /><S2 t={t} platform={platform} /><S3 t={t} /><S4 t={t} /><S5 t={t} /><R1 t={t} /><R2 t={t} /><R3 t={t} /><S6 t={t} /><S7 t={t} /><S8 t={t} platform={platform} />
      <Iris t={t} at={A.truth} x={W / 2} y={800} /><Iris t={t} at={A.todo} x={W / 2} y={800} />
      <BrandPill platform={platform} />
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
