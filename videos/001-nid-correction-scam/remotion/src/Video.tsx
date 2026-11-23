import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, Background, Bean, BrandPill, C, Captions, Chip, CheckRow, Confetti, FONT, FONT_BN, H, Iris, LabelExample, Odometer, Phone,
  Scribble, SourcePill, Stage, Sticker, Title, Toggle, Vignette, W, WORDS, clamp01, ease, pop, ramp, shakeAt, useFonts, useT,
} from './lib';

// first word starting with `text` at or after `after` seconds
const wordAt = (text: string, after = 0) => {
  const w = WORDS.find((x) => x.start >= after - 0.01 && x.text.replace(/^["“]/, '').startsWith(text));
  if (!w) throw new Error('word not found: ' + text);
  return w.start;
};

// ---------------- S1: Ammu's NID has a spelling mistake ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const card = pop(t, 0.25);
  const bank = pop(t, A.bank);
  const wrongAt = wordAt('বানান');
  return (
    <Stage t={t} a={0} b={A.thokhon} noFadeIn>
      <div style={{position: 'absolute', left: 150, top: 250, transform: `scale(${pop(t, 0.05)})`}}>
        <Bean kind="ammu" size={250} t={t} mood="worried" />
        <div style={{textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 36, color: C.text, marginTop: 6}}>আম্মু</div>
      </div>
      <div style={{position: 'absolute', left: 520, top: 200, width: 780, height: 450, borderRadius: 30, background: '#F5F7FF', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', transform: `rotate(${-4 + 4 * card}deg) scale(${0.8 + 0.2 * card})`, opacity: clamp01(card * 1.4), overflow: 'visible'}}>
        <div style={{height: 92, borderTopLeftRadius: 30, borderTopRightRadius: 30, background: `linear-gradient(90deg, ${C.signature}, ${C.info})`, display: 'flex', alignItems: 'center', paddingLeft: 36, fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: '#fff'}}>জাতীয় পরিচয়পত্র</div>
        <LabelExample style={{right: 24, top: 26, background: 'rgba(255,255,255,0.9)', color: C.ink, border: `2px dashed ${C.ink}`}} />
        <div style={{display: 'flex', gap: 34, padding: '34px 36px'}}>
          <div style={{width: 170, height: 210, borderRadius: 18, background: '#E4E1F7', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'}}>
            <div style={{marginBottom: -70}}><Bean kind="ammu" size={150} bounce={0} /></div>
          </div>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.ink, lineHeight: 1.75}}>
            <div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
              <span style={{color: '#6B6890'}}>নাম:</span>
              <span style={{position: 'relative'}}>রহীমা<Scribble t={t} at={wrongAt} w={118} h={44} /></span>
              <span>খাতুন</span>
            </div>
            <div><span style={{color: '#6B6890'}}>জন্ম:</span> ১২ মার্চ ১৯৬৮</div>
            <div><span style={{color: '#6B6890'}}>NID:</span> ১২৩ ৪৫৬ ৭৮৯০</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 250, top: 345}}>
          <Sticker t={t} at={wrongAt + 0.55} text="নামের বানান ভুল!" color={C.danger} rotate={-5} size={40} />
        </div>
      </div>
      {t > A.bank - 0.1 && (
        <div style={{position: 'absolute', left: 1400, top: 230, opacity: clamp01(bank * 1.3), transform: `scale(${0.7 + 0.3 * bank})`}}>
          <svg width="360" height="300" viewBox="0 0 360 300">
            <path d="M 30 100 L 180 30 L 330 100 Z" fill={C.info} />
            {[70, 135, 200, 265].map((x) => <rect key={x} x={x} y="115" width="26" height="130" rx="6" fill={C.text} opacity="0.92" />)}
            <rect x="30" y="100" width="300" height="16" rx="4" fill={C.info} />
            <rect x="20" y="248" width="320" height="26" rx="8" fill={C.info} />
          </svg>
          <div style={{textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: C.text}}>ব্যাংক</div>
          <div style={{position: 'absolute', left: -60, top: -70}}>
            <Sticker t={t} at={wordAt('আগে', A.bank)} text="আগে NID ঠিক করুন" color={C.warn} rotate={5} size={38} />
          </div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S2: the message on Messenger ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.thokhon, b = A.kintu;
  const msg = 'আমি নির্বাচন কমিশন থেকে বলছি। টাকা পাঠান, ঘরে বসেই ঠিক করে দেব।';
  const typeP = ramp(t, A.quote, b - 0.6);
  const shown = msg.slice(0, Math.ceil(msg.length * typeP));
  const phone = pop(t, a + 0.05);
  return (
    <Stage t={t} a={a} b={b} noFadeOut>
      <div style={{position: 'absolute', left: 260, top: 130, transform: `translateY(${(1 - phone) * 300}px)`}}>
        <Phone w={470} h={720} tilt={-5}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 140, background: C.surface, display: 'flex', alignItems: 'flex-end', padding: '0 22px 18px', gap: 16}}>
            <div style={{width: 64, height: 64, borderRadius: 999, background: C.danger, overflow: 'hidden', display: 'flex', justifyContent: 'center'}}><div style={{marginTop: 4}}><Bean kind="scammer" size={60} bounce={0} /></div></div>
            <div>
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 30, color: C.text}}>নির্বাচন কমিশন</div>
              <div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 22, color: C.muted}}>অপরিচিত অ্যাকাউন্ট</div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 22, right: 22, top: 170}}>
            {t >= A.quote - 1.2 && t < A.quote && (
              <div style={{display: 'inline-flex', gap: 8, padding: '18px 22px', borderRadius: 24, background: C.surfaceHi}}>
                {[0, 1, 2].map((i) => <div key={i} style={{width: 12, height: 12, borderRadius: 99, background: C.muted, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 6 + i))}} />)}
              </div>
            )}
            {t >= A.quote && (
              <div style={{padding: '20px 24px', borderRadius: 26, borderTopLeftRadius: 8, background: C.surfaceHi, fontFamily: FONT, fontWeight: 600, fontSize: 32, lineHeight: 1.45, color: C.text}}>{shown}</div>
            )}
          </div>
        </Phone>
        <LabelExample style={{left: 330, top: -24}} />
      </div>
      <div style={{position: 'absolute', left: 900, top: 150, opacity: clamp01(pop(t, a + 0.4) * 1.3)}}>
        <Chip color={C.info} size={40}>Messenger-এ মেসেজ</Chip>
      </div>
      <div style={{position: 'absolute', left: 1150, top: 300, transform: `scale(${pop(t, a + 0.6)})`}}>
        <Bean kind="scammer" size={300} t={t} />
        <div style={{position: 'absolute', left: -170, top: 40}}>
          <Sticker t={t} at={A.quote + 0.3} text="নির্বাচন কমিশন?" color={C.surfaceHi} rotate={-6} size={38} />
        </div>
      </div>
    </Stage>
  );
};

// ---------------- S3: the twist ----------------
const S3: React.FC<{t: number}> = ({t}) => {
  const a = A.kintu, b = A.nov16;
  const msAt = wordAt('Messenger', a), waAt = wordAt('WhatsApp', a);
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center'}}>
        <Sticker t={t} at={a + 0.12} text="ইসি নিজেই বলছে" color={C.danger} rotate={-4} size={52} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: ramp(t, a + 0.5, a + 0.9)}}>
        <Title size={84}>Messenger বা WhatsApp-এ</Title>
        <Title size={96}>কোনো NID সেবা <span style={{color: C.danger}}>নেই</span></Title>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, display: 'flex', justifyContent: 'center', gap: 60}}>
        {[['Messenger', msAt], ['WhatsApp', waAt]].map(([label, at]) => (
          <div key={label as string} style={{position: 'relative', transform: `scale(${pop(t, (at as number) - 0.1)})`}}>
            <Chip size={46} bg="rgba(77,212,255,0.12)">{label as string} · NID সেবা</Chip>
            <Scribble t={t} at={(at as number) + 0.35} w={400} h={56} />
          </div>
        ))}
      </div>
    </Stage>
  );
};

// ---------------- S4: the EC warning (news) ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.nov16, b = A.follow;
  const card = pop(t, a + 0.25);
  const hl = ease((t - A.dhore) / 0.5);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 230, top: 150}}>
        <Sticker t={t} at={a + 0.05} text="খবরে এসেছে" color={C.warn} rotate={-5} size={46} />
      </div>
      <div style={{position: 'absolute', left: 260, top: 290, width: 1400, padding: '46px 60px', borderRadius: 34, background: C.surface, borderLeft: `14px solid ${C.info}`, boxShadow: '0 30px 60px rgba(0,0,0,0.35)', opacity: clamp01(card * 1.4), transform: `translateY(${(1 - card) * 40}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT_BN, fontWeight: 600, fontSize: 32, color: C.muted}}>
          <span>নির্বাচন কমিশনের সতর্কবার্তা · ১৬ নভেম্বর ২০২৬</span><span>সারাংশ</span>
        </div>
        <div style={{marginTop: 22, fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.4, color: C.text}}>
          সোশ্যাল মিডিয়ায় NID ঠিক করার নামে কেউ টাকা চাইলে,{' '}
          <span style={{position: 'relative', whiteSpace: 'nowrap'}}>
            <span style={{position: 'absolute', left: -8, right: -8, top: 8, bottom: 2, borderRadius: 14, background: C.signature, transformOrigin: 'left center', transform: `scaleX(${hl})`, zIndex: 0}} />
            <span style={{position: 'relative'}}>ধরে নিন সে প্রতারক।</span>
          </span>
        </div>
      </div>
    </Stage>
  );
};

// ---------------- S5: mid-video follow (toggle card) ----------------
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.follow, b = A.why;
  const onAt = wordAt('follow', a);
  const on = ease((t - onAt) / 0.25);
  const card = pop(t, a + 0.2);
  const bell = t > onAt ? Math.sin((t - onAt) * 22) * 18 * Math.max(0, 1 - (t - onAt) / 0.9) : 0;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 170, top: 300, opacity: ramp(t, a, a + 0.4)}}>
        <Title size={80}>নতুন ফাঁদ ধরা পড়লেই</Title>
        <Title size={80} color={C.info}>এখানে জানাই</Title>
      </div>
      <div style={{position: 'absolute', left: 1020, top: 300, width: 740, padding: 34, borderRadius: 40, background: C.surface, border: '2px solid rgba(139,108,255,0.5)', boxShadow: '0 30px 70px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', gap: 30, transform: `translateY(${(1 - card) * 260}px)`, opacity: clamp01(card * 1.5)}}>
        <div style={{width: 120, height: 120, borderRadius: 999, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 60, color: '#fff'}}>A</div>
        <div style={{flex: 1}}>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.text}}>Al NUR</div>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 30, color: C.muted}}>Facebook পেজ</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
          <svg width="56" height="56" viewBox="0 0 24 24" style={{transform: `rotate(${bell}deg)`}}><path d="M12 2a6 6 0 0 0-6 6v4l-2 3h16l-2-3V8a6 6 0 0 0-6-6zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z" fill={on > 0.5 ? C.signature : C.muted} /></svg>
          <Toggle on={on} w={130} />
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 28, color: on > 0.5 ? C.signature : C.muted}}>{on > 0.5 ? 'Following' : 'Follow'}</div>
        </div>
      </div>
      <Confetti t={t} at={onAt + 0.1} x={1640} y={420} />
    </Stage>
  );
};

// ---------------- S6: why does it work? waiting ----------------
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.why, b = A.bochore;
  const ring = 0.34 + 0.02 * Math.sin(t * 3);
  const R = 120, L = 2 * Math.PI * R;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', transform: `scale(${0.9 + 0.1 * pop(t, a)})`}}>
        <Title size={96}>এই ফাঁদ এত কাজ করে কেন?</Title>
      </div>
      {t > A.opekkha - 0.2 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60}}>
          <svg width="300" height="300" viewBox="0 0 300 300" style={{transform: `scale(${pop(t, A.opekkha - 0.15)})`}}>
            <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="26" />
            <circle cx="150" cy="150" r={R} fill="none" stroke={C.signature} strokeWidth="26" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - ring)} transform="rotate(-90 150 150)" />
            {Array.from({length: 24}).map((_, i) => {
              const ang = (i / 24) * Math.PI * 2;
              return <line key={i} x1={150 + Math.cos(ang) * 150} y1={150 + Math.sin(ang) * 150} x2={150 + Math.cos(ang) * 140} y2={150 + Math.sin(ang) * 140} stroke="rgba(255,255,255,0.3)" strokeWidth="3" />;
            })}
            <text x="150" y="168" textAnchor="middle" fontFamily={FONT_BN} fontWeight={800} fontSize="52" fill={C.text}>{'...'}</text>
          </svg>
          <Sticker t={t} at={A.opekkha} text="অপেক্ষা" color={C.signature} rotate={-5} size={110} />
        </div>
      )}
    </Stage>
  );
};

// ---------------- S7: ten lakh applications, one lakh+ waiting ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.bochore, b = A.maser;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 44, color: C.muted}}>বছরে প্রায়</div>
        <Odometer t={t} at={a + 0.25} dur={1.8} target={1000000} pattern="10,00,000" size={170} />
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 48, color: C.text}}>মানুষ NID সংশোধনের আবেদন করেন</div>
      </div>
      {t > A.lakher - 0.2 && (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}>
            <Sticker t={t} at={A.lakher} text="লাখের বেশি আবেদন এখনো ঝুলে আছে" color={C.warn} rotate={-3} size={44} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 660, display: 'flex', justifyContent: 'center', gap: 16, opacity: ramp(t, A.lakher, A.lakher + 0.4)}}>
            {Array.from({length: 11}).map((_, i) => (
              <div key={i} style={{opacity: 0.55 + 0.45 * (i === 0 ? 1 : 0.6)}}><Bean kind={i === 0 ? 'ammu' : 'you'} size={78} t={t} phase={i * 0.7} bounce={0.4} mood="worried" /></div>
            ))}
          </div>
        </>
      )}
    </Stage>
  );
};

// ---------------- S8: months of waiting vs "I'll do it fast" ----------------
const MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর'];
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.maser, b = A.tar_upor;
  const flips = Math.max(0, (t - a - 0.3) / 0.6);
  const cur = Math.min(MONTHS.length - 1, Math.floor(flips));
  const frac = flips - Math.floor(flips);
  const fastAt = wordAt('তাড়াতাড়ি', a);
  const glow = t > fastAt ? 0.5 + 0.5 * Math.sin((t - fastAt) * 7) : 0;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 160, top: 300}}><Bean kind="ammu" size={220} t={t} mood="worried" /></div>
      <div style={{position: 'absolute', left: 560, top: 200, width: 400, height: 470, transform: `scale(${pop(t, a)})`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: '#F5F7FF', boxShadow: '0 30px 60px rgba(0,0,0,0.4)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 100, borderTopLeftRadius: 26, borderTopRightRadius: 26, background: C.signature}} />
        {[90, 290].map((x) => <div key={x} style={{position: 'absolute', left: x, top: -18, width: 22, height: 50, borderRadius: 12, background: '#C9C3EE'}} />)}
        <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.ink}}>{MONTHS[Math.min(cur + 1, MONTHS.length - 1)]}</div>
        {cur < MONTHS.length - 1 && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 100, bottom: 0, background: '#F5F7FF', borderBottomLeftRadius: 26, borderBottomRightRadius: 26, transformOrigin: 'top center', transform: `perspective(1400px) rotateX(${-Math.min(1, frac * 1.8) * 95}deg)`, opacity: frac > 0.55 ? 0 : 1 - frac, display: 'flex', justifyContent: 'center', paddingTop: 70, fontFamily: FONT_BN, fontWeight: 800, fontSize: 70, color: C.ink}}>{MONTHS[cur]}</div>
        )}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -70, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: C.muted}}>মাসের পর মাস…</div>
      </div>
      {t > fastAt - 0.3 && (
        <div style={{position: 'absolute', left: 1080, top: 260, transform: `scale(${pop(t, fastAt - 0.2)})`, transformOrigin: 'left bottom'}}>
          <div style={{padding: '30px 44px', borderRadius: 40, borderBottomLeftRadius: 10, background: C.surfaceHi, border: `3px solid ${C.signature}`, boxShadow: `0 0 ${40 + 40 * glow}px rgba(139,108,255,${0.35 + 0.4 * glow})`, fontFamily: FONT_BN, fontWeight: 800, fontSize: 62, color: C.text}}>"তাড়াতাড়ি করে দেব"</div>
          <div style={{position: 'absolute', left: 30, top: 200}}><Bean kind="scammer" size={170} t={t} /></div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S9: fake EC officer badge ----------------
const S9: React.FC<{t: number}> = ({t}) => {
  const a = A.tar_upor, b = A.fb_ad;
  const offAt = wordAt('কর্মকর্তা', a);
  const badge = pop(t, a + 0.2);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 380, top: 200}}><Bean kind="scammer" size={300} t={t} /></div>
      <div style={{position: 'absolute', left: 860, top: 230, width: 620, borderRadius: 30, background: '#F5F7FF', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', transform: `rotate(${3 * badge}deg) scale(${badge})`, overflow: 'visible'}}>
        <div style={{height: 80, borderTopLeftRadius: 30, borderTopRightRadius: 30, background: C.danger, display: 'flex', alignItems: 'center', paddingLeft: 30, fontFamily: FONT_BN, fontWeight: 800, fontSize: 36, color: '#fff'}}>পরিচয়পত্র</div>
        <div style={{padding: '30px 34px', display: 'flex', gap: 26, alignItems: 'center'}}>
          <div style={{width: 120, height: 140, borderRadius: 16, background: '#F1D9DF', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}><div style={{marginBottom: -50}}><Bean kind="scammer" size={110} bounce={0} /></div></div>
          <div style={{position: 'relative', fontFamily: FONT_BN, fontWeight: 800, fontSize: 50, color: C.ink}}>
            ইসি কর্মকর্তা
            <Scribble t={t} at={offAt + 0.5} w={300} h={60} />
          </div>
        </div>
        <LabelExample style={{right: 20, top: 20, background: 'rgba(255,255,255,0.9)', color: C.ink, border: `2px dashed ${C.ink}`}} />
      </div>
      <div style={{position: 'absolute', left: 1330, top: 520}}>
        <Sticker t={t} at={offAt + 1.0} text="ভুয়া" color={C.danger} rotate={8} size={64} />
      </div>
    </Stage>
  );
};

// ---------------- S10: Facebook ads ----------------
const S10: React.FC<{t: number}> = ({t}) => {
  const a = A.fb_ad, b = A.tahole;
  const awareAt = wordAt('তাই', a);
  const phone = pop(t, a + 0.1);
  const spot = ease((t - a - 1.0) / 0.4);
  return (
    <Stage t={t} a={a} b={b} noFadeOut>
      <div style={{position: 'absolute', left: 150, top: 260, width: 820}}>
        <Title size={78}>ফেসবুকে বিজ্ঞাপন দিয়েও</Title>
        <Title size={78} color={C.danger}>এই ফাঁদ পাতা হয়েছে</Title>
        {t > awareAt - 0.2 && (
          <div style={{marginTop: 50, transform: `scale(${pop(t, awareAt - 0.1)})`, transformOrigin: 'left center'}}>
            <Chip size={44} color={C.good} bg="rgba(38,198,218,0.14)">ইসি: আগেও সচেতনতার প্রচার</Chip>
          </div>
        )}
      </div>
      <div style={{position: 'absolute', left: 1130, top: 140, transform: `translateY(${(1 - phone) * 300}px)`}}>
        <Phone w={440} h={720} tilt={6}>
          <div style={{position: 'absolute', left: 18, right: 18, top: 120, borderRadius: 22, background: C.surface, padding: 22, boxShadow: spot > 0 ? `0 0 0 ${4 * spot}px ${C.signature}, 0 0 ${50 * spot}px rgba(139,108,255,0.7)` : 'none'}}>
            <div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
              <div style={{width: 54, height: 54, borderRadius: 99, background: C.warn}} />
              <div>
                <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 26, color: C.text}}>NID সংশোধন সেবা</div>
                <div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 20, color: C.muted}}>স্পনসর্ড</div>
              </div>
            </div>
            <div style={{marginTop: 18, height: 200, borderRadius: 16, background: `linear-gradient(135deg, ${C.warn}, ${C.danger})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 38, color: '#fff', textAlign: 'center', lineHeight: 1.3}}>ঘরে বসে<br />NID ঠিক করুন</div>
            <div style={{marginTop: 18, padding: '14px 0', borderRadius: 14, background: C.surfaceHi, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 26, color: C.text}}>মেসেজ করুন</div>
          </div>
          {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 18, right: 18, top: 560 + i * 70, height: 50, borderRadius: 14, background: 'rgba(255,255,255,0.05)'}} />)}
        </Phone>
        <LabelExample style={{left: 300, top: -20}} />
      </div>
    </Stage>
  );
};

// ---------------- S11: the real way (3 steps) ----------------
const Rail: React.FC<{t: number}> = ({t}) => {
  const steps = [
    {at: A.ek, label: 'টাকা চাইলে কথা বন্ধ'},
    {at: A.dui, label: 'নিজে অনলাইনে আবেদন'},
    {at: A.tin, label: '১০৫ / নির্বাচন অফিস'},
  ];
  const ys = [330, 510, 690];
  const fill = t < A.dui ? ramp(t, A.ek, A.ek + 0.4) * 0 : t < A.tin ? ramp(t, A.dui, A.dui + 0.5) * 0.5 : 0.5 + ramp(t, A.tin, A.tin + 0.5) * 0.5;
  return (
    <div style={{position: 'absolute', left: 110, top: 150, width: 600, opacity: ramp(t, A.tahole + 0.1, A.tahole + 0.5)}}>
      <Title size={74}>আসল পথ</Title>
      <div style={{width: 160, height: 10, borderRadius: 9, background: C.signature, marginTop: 4}} />
      <div style={{position: 'absolute', left: 38, top: ys[0] - 150 + 40, width: 8, height: ys[2] - ys[0], borderRadius: 8, background: 'rgba(255,255,255,0.12)'}} />
      <div style={{position: 'absolute', left: 38, top: ys[0] - 150 + 40, width: 8, height: (ys[2] - ys[0]) * fill, borderRadius: 8, background: C.signature}} />
      {steps.map((s, i) => {
        const active = t >= s.at;
        const k = pop(t, s.at);
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: ys[i] - 150, display: 'flex', alignItems: 'center', gap: 26}}>
            <div style={{width: 84, height: 84, borderRadius: 99, background: active ? C.signature : C.surfaceHi, border: '4px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: '#fff', transform: `scale(${active ? 1 + 0.15 * Math.sin(Math.PI * clamp01(k)) : 1})`}}>{['১', '২', '৩'][i]}</div>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: active ? C.text : C.muted, whiteSpace: 'nowrap'}}>{s.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const Panel: React.FC<{t: number; a: number; b: number; children: React.ReactNode}> = ({t, a, b, children}) => {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const o = clamp01((t - a + 0.02) / 0.2) * clamp01((b - t) / 0.2);
  return <div style={{position: 'absolute', left: 760, top: 140, width: 1060, height: 720, opacity: o, transform: `translateX(${(1 - ease((t - a) / 0.3)) * 40}px)`}}>{children}</div>;
};

const S11: React.FC<{t: number}> = ({t}) => {
  const a = A.tahole, b = A.dalal;
  const msAt = wordAt('Messenger', A.ek), waAt = wordAt('WhatsApp', A.ek), fbAt = wordAt('Facebook', A.ek), stopAt = wordAt('কথা', A.ek);
  const siteAt = wordAt('services', A.dui);
  const spot = ease((t - siteAt) / 0.35);
  const n105 = wordAt('১০৫', A.tin);
  const typed = '১০৫'.slice(0, Math.max(0, Math.min(3, Math.floor((t - n105 + 0.1) / 0.18) + 1)));
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <Rail t={t} />
      <Panel t={t} a={a} b={A.ek}>
        <div style={{position: 'absolute', left: 120, top: 220}}>
          <Sticker t={t} at={a + 0.6} text="তিনটা জিনিস মনে রাখুন" color={C.signature} rotate={-4} size={66} />
        </div>
      </Panel>
      <Panel t={t} a={A.ek} b={A.dui}>
        {[['Messenger', msAt], ['WhatsApp', waAt], ['Facebook', fbAt]].map(([label, at], i) => (
          <div key={i} style={{position: 'absolute', left: 120, top: 60 + i * 150, transform: `scale(${pop(t, (at as number) - 0.15)})`, transformOrigin: 'left center'}}>
            <div style={{position: 'relative', display: 'inline-block'}}>
              <Chip size={50}>{label as string} <span style={{color: C.danger}}>→ ৳ টাকা চাই</span></Chip>
              <Scribble t={t} at={(at as number) + 0.45} w={560} h={60} />
            </div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 560, top: 520}}>
          <Sticker t={t} at={stopAt} text="কথা বন্ধ!" color={C.danger} rotate={6} size={70} />
        </div>
      </Panel>
      <Panel t={t} a={A.dui} b={A.fee230}>
        <div style={{position: 'absolute', left: 0, top: 30, width: 1020, height: 360, borderRadius: 26, background: '#F5F7FF', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', transform: `scale(${pop(t, A.dui)})`, transformOrigin: 'left top'}}>
          <div style={{height: 70, background: '#E6E3F5', display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px'}}>
            {['#FF6B6B', '#FFC14D', '#3DCB8F'].map((c) => <div key={c} style={{width: 18, height: 18, borderRadius: 99, background: c, opacity: 0.6}} />)}
            <div style={{position: 'relative', marginLeft: 20, flex: 1, height: 46, borderRadius: 23, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', boxShadow: spot > 0 ? `0 0 0 ${5 * spot}px ${C.signature}, 0 0 ${60 * spot}px rgba(139,108,255,0.8)` : 'none'}}>
              <svg width="20" height="24" viewBox="0 0 20 24"><rect x="2" y="10" width="16" height="12" rx="3" fill="#3D3A5C" /><path d="M5 10 V7 a5 5 0 0 1 10 0 V10" fill="none" stroke="#3D3A5C" strokeWidth="3" /></svg>
              <span style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ink}}>services.nidw.gov.bd</span>
            </div>
          </div>
          <div style={{padding: 36}}>
            {[0.8, 0.55, 0.7].map((w, i) => <div key={i} style={{height: 26, width: `${w * 100}%`, borderRadius: 13, background: '#E2DFF2', marginBottom: 22}} />)}
            <div style={{width: 260, height: 64, borderRadius: 16, background: C.signature, opacity: 0.85}} />
          </div>
          {spot > 0 && <div style={{position: 'absolute', inset: '70px 0 0 0', background: `rgba(13,16,48,${0.55 * spot})`}} />}
        </div>
        <div style={{position: 'absolute', left: 10, top: 450, display: 'flex', flexDirection: 'column', gap: 34}}>
          <CheckRow t={t} at={A.fee_online + 0.2} text="ফি দিন ওয়েবসাইটের ভেতরেই, অনলাইনে" size={44} />
          <div style={{position: 'relative'}}>
            <CheckRow t={t} at={A.personal + 0.2} text="কারো ব্যক্তিগত বিকাশ নম্বরে নয়" size={44} bad />
          </div>
        </div>
      </Panel>
      <Panel t={t} a={A.fee230} b={A.tin}>
        <div style={{position: 'absolute', left: 100, top: 80, padding: '50px 70px', borderRadius: 40, background: C.surface, border: `3px solid ${C.good}`, transform: `rotate(-3deg) scale(${pop(t, A.fee230)})`}}>
          <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 40, color: C.muted}}>কার্ডের তথ্য, প্রথমবার সংশোধন</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
            <span style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 170, color: C.good}}>৳</span>
            <Odometer t={t} at={A.fee230 + 0.4} dur={1.2} target={230} pattern="230" size={190} color={C.good} />
          </div>
          <div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 30, color: C.muted}}>ফি-র পরিমাণ ওয়েবসাইটে মিলিয়ে নিন</div>
        </div>
      </Panel>
      <Panel t={t} a={A.tin} b={b}>
        <div style={{position: 'absolute', left: 40, top: 10, transform: `scale(${pop(t, A.tin)})`, transformOrigin: 'left top'}}>
          <Phone w={380} h={660} tilt={-4}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 80, color: C.text, height: 100}}>{t >= n105 - 0.1 ? typed : ''}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div>
            <div style={{position: 'absolute', left: 30, right: 30, top: 210, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
              {['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '*', '০', '#'].map((k, i) => {
                const pressT = k === '১' ? n105 : k === '০' ? n105 + 0.18 : k === '৫' ? n105 + 0.36 : -9;
                const pressed = t >= pressT - 0.1 && t < pressT + 0.18;
                return <div key={i} style={{height: 74, borderRadius: 99, background: pressed ? C.signature : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 36, color: C.text}}>{k}</div>;
              })}
            </div>
            <div style={{position: 'absolute', left: '50%', bottom: 40, marginLeft: -40, width: 80, height: 80, borderRadius: 99, background: C.good, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="36" height="36" viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z" fill="#fff" /></svg>
            </div>
          </Phone>
        </div>
        {t > A.office - 0.2 && (
          <div style={{position: 'absolute', left: 520, top: 150, width: 520, textAlign: 'center', transform: `scale(${pop(t, A.office - 0.1)})`}}>
            <svg width="300" height="240" viewBox="0 0 300 240">
              <rect x="40" y="70" width="220" height="150" rx="10" fill={C.surfaceHi} stroke={C.info} strokeWidth="5" />
              <path d="M 25 75 L 150 15 L 275 75 Z" fill={C.info} />
              {[70, 130, 190].map((x) => <rect key={x} x={x} y="100" width="40" height="44" rx="6" fill={C.info} opacity="0.5" />)}
              <rect x="125" y="160" width="50" height="60" rx="6" fill={C.signature} />
            </svg>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 42, color: C.text, lineHeight: 1.3}}>উপজেলা বা থানা<br />নির্বাচন অফিস</div>
          </div>
        )}
      </Panel>
    </Stage>
  );
};

// ---------------- S12: myth: a middleman is faster ----------------
const S12: React.FC<{t: number}> = ({t}) => {
  const a = A.dalal, b = A.jodi;
  const butAt = wordAt('কিন্তু', a), theseAt = wordAt('এসব', a);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center'}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 46, color: C.muted}}>অনেকে ভাবেন</div>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 10}}>
          <Title size={96}>দালাল ধরলে = দ্রুত কাজ</Title>
          <Scribble t={t} at={butAt} w={1040} h={90} />
          <div style={{position: 'absolute', right: -210, top: -95}}>
            <Sticker t={t} at={butAt + 0.45} text="ভুল" color={C.danger} rotate={10} size={70} />
          </div>
        </div>
      </div>
      {t > theseAt - 0.3 && (
        <div style={{position: 'absolute', left: 300, right: 300, top: 520, padding: '36px 50px', borderRadius: 30, background: C.surface, borderLeft: `12px solid ${C.signature}`, opacity: ramp(t, theseAt - 0.3, theseAt), transform: `translateY(${(1 - ease((t - theseAt + 0.3) / 0.4)) * 30}px)`}}>
          <div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 32, color: C.muted}}>ইসির কথা</div>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.text}}>এসব মাধ্যমে টাকা চাওয়া মানেই <span style={{color: C.danger}}>প্রতারণা</span></div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S13: if you already paid ----------------
const S13: React.FC<{t: number}> = ({t}) => {
  const a = A.jodi, b = A.jader;
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center'}}>
        <Sticker t={t} at={a + 0.1} text="টাকা পাঠিয়ে ফেললে?" color={C.danger} rotate={-3} size={64} />
      </div>
      <div style={{position: 'absolute', left: 430, top: 360, display: 'flex', flexDirection: 'column', gap: 50}}>
        <CheckRow t={t} at={A.screenshot} text="চ্যাট আর নম্বরের স্ক্রিনশট রাখুন" size={54} />
        <CheckRow t={t} at={A.bkash} text="বিকাশে হলে সাথে সাথে ১৬২৪৭-এ কল" size={54} />
        <CheckRow t={t} at={A.thana} text="কাছের থানায় জিডি করুন" size={54} />
      </div>
    </Stage>
  );
};

// ---------------- S14: send it to family ----------------
const S14: React.FC<{t: number}> = ({t}) => {
  const a = A.jader, b = A.outro;
  const famAt = A.family;
  const people: {kind: 'ammu' | 'abbu' | 'bon'; label: string; x: number; y: number}[] = [
    {kind: 'ammu', label: 'আম্মু', x: 1230, y: 150},
    {kind: 'abbu', label: 'আব্বু', x: 1530, y: 330},
    {kind: 'bon', label: 'ছোট বোন', x: 1230, y: 520},
  ];
  const src = {x: 700, y: 480};
  return (
    <Stage t={t} a={a} b={b} noFadeOut>
      <div style={{position: 'absolute', left: 130, top: 150, width: 1000, whiteSpace: 'nowrap'}}>
        <Title size={60}>যাদের NID-তে ভুল আছে,</Title>
        <Title size={60} color={C.danger}>মেসেজ আসে তাদের কাছেই</Title>
      </div>
      <div style={{position: 'absolute', left: 500, top: 390, transform: `scale(${pop(t, a + 0.2)})`}}>
        <Phone w={240} h={420} tilt={-6}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: 90, height: 90, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="40" height="40" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg></div>
          </div>
        </Phone>
      </div>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {people.map((p, i) => {
          const tx = p.x + 60, ty = p.y + 120;
          const cx = (src.x + tx) / 2, cy = Math.min(src.y, ty) - 120;
          const draw = ease((t - famAt - i * 0.15) / 0.6);
          const d = `M ${src.x} ${src.y} Q ${cx} ${cy} ${tx} ${ty}`;
          const len = 900;
          const u = ((t - famAt) * 0.9 + i * 0.3) % 1;
          const bx = (1 - u) * (1 - u) * src.x + 2 * (1 - u) * u * cx + u * u * tx;
          const by = (1 - u) * (1 - u) * src.y + 2 * (1 - u) * u * cy + u * u * ty;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={C.signature} strokeWidth="6" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} strokeLinecap="round" opacity="0.8" />
              {draw >= 1 && <circle cx={bx} cy={by} r="12" fill={C.info} />}
            </g>
          );
        })}
      </svg>
      {people.map((p, i) => (
        <div key={i} style={{position: 'absolute', left: p.x, top: p.y, transform: `scale(${pop(t, famAt + 0.3 + i * 0.2)})`, textAlign: 'center'}}>
          <Bean kind={p.kind} size={130} t={t} mood="happy" phase={i} />
          <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 32, color: C.text}}>{p.label}</div>
        </div>
      ))}
      <div style={{position: 'absolute', left: 140, top: 330}}>
        <Sticker t={t} at={famAt + 0.2} text="পরিবারের গ্রুপে পাঠান" color={C.signature} rotate={-3} size={48} />
      </div>
    </Stage>
  );
};

// ---------------- S15: outro funnel ----------------
const S15: React.FC<{t: number}> = ({t}) => {
  const a = A.outro, end = A.end + 1.6;
  const items = [
    {text: 'আবেদনের ধাপ', at: wordAt('আবেদনের', a)},
    {text: 'কোন কাগজ লাগে', at: wordAt('কাগজ', a)},
    {text: 'ফি-র তালিকা', at: wordAt('ফির', a)},
  ];
  const cmAt = A.comment;
  const typeAt = wordAt('NID', cmAt);
  const typedN = Math.max(0, Math.min(3, Math.floor((t - typeAt + 0.05) / 0.12) + 1));
  const replyAt = wordAt('message-এ', cmAt);
  const followAt = wordAt('follow', a);
  const tile = pop(t, a + 0.15);
  const tileOut = ramp(t, cmAt - 0.2, cmAt + 0.3);
  return (
    <Stage t={t} a={a} b={end} noFadeIn noFadeOut>
      {/* checklist file tile (left) -> later replaced by keyword */}
      <div style={{position: 'absolute', left: 150, top: 190, width: 720, padding: 40, borderRadius: 36, background: C.surface, border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', opacity: clamp01(tile * 1.4) * (1 - tileOut), transform: `scale(${0.85 + 0.15 * tile - 0.1 * tileOut})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <svg width="80" height="96" viewBox="0 0 80 96"><path d="M8 4 h44 l20 20 v64 a6 6 0 0 1 -6 6 h-58 a6 6 0 0 1 -6 -6 v-78 a6 6 0 0 1 6 -6z" fill={C.danger} /><path d="M52 4 v20 h20" fill="#ff8aa0" /><text x="40" y="70" textAnchor="middle" fontFamily="PoppinsX" fontWeight="800" fontSize="22" fill="#fff">PDF</text></svg>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.text}}>NID-চেকলিস্ট.pdf</div>
        </div>
        <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 26}}>
          {items.map((it, i) => <CheckRow key={i} t={t} at={it.at} text={it.text} size={42} />)}
        </div>
      </div>
      {t > cmAt - 0.3 && (
        <div style={{position: 'absolute', left: 170, top: 190, transform: `scale(${pop(t, cmAt)})`, transformOrigin: 'left top'}}>
          <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 46, color: C.muted, marginBottom: 20}}>কমেন্টে লিখুন</div>
          <Sticker t={t} at={cmAt + 0.05} text="NID / এনআইডি" color={C.signature} rotate={-4} size={92} />
          <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 20, padding: '16px 28px', borderRadius: 999, background: C.surface, border: '2px solid rgba(139,108,255,0.5)', width: 'fit-content', opacity: ramp(t, followAt - 0.2, followAt + 0.2)}}>
            <div style={{width: 56, height: 56, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#fff'}}>A</div>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.text}}>Al NUR</div>
            <Toggle on={ease((t - followAt) / 0.3)} w={96} />
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.signature}}>{t > followAt + 0.15 ? 'Following' : 'Follow'}</div>
          </div>
        </div>
      )}
      {t > A.question - 0.2 && (
        <div style={{position: 'absolute', left: 170, top: 640}}>
          <Sticker t={t} at={A.question} text={'এমন মেসেজ এসেছে? লিখুন "এসেছে"'} color={C.warn} rotate={-2} size={44} />
        </div>
      )}
      {/* phone: comment -> reply with the PDF */}
      <div style={{position: 'absolute', left: 1180, top: 120, transform: `translateY(${(1 - pop(t, a + 0.3)) * 400}px)`}}>
        <Phone w={430} h={740} tilt={-5}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: C.surface, display: 'flex', alignItems: 'flex-end', padding: '0 24px 16px', fontFamily: FONT_BN, fontWeight: 800, fontSize: 30, color: C.text}}>{t < replyAt ? 'কমেন্ট' : 'মেসেজ'}</div>
          {t < replyAt ? (
            <div style={{position: 'absolute', left: 20, right: 20, top: 160}}>
              {[0.9, 0.7].map((w, i) => <div key={i} style={{height: 70, width: `${w * 100}%`, borderRadius: 20, background: 'rgba(255,255,255,0.06)', marginBottom: 18}} />)}
              <div style={{position: 'absolute', left: 0, right: 0, top: 420, height: 76, borderRadius: 38, background: C.surfaceHi, border: `3px solid ${t > typeAt - 0.2 ? C.signature : 'transparent'}`, display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.text}}>
                {t > typeAt - 0.05 ? 'NID'.slice(0, typedN) : <span style={{color: C.muted, fontSize: 28, fontWeight: 600}}>কমেন্ট লিখুন…</span>}
                <span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span>
              </div>
            </div>
          ) : (
            <div style={{position: 'absolute', left: 20, right: 20, top: 160}}>
              <div style={{marginLeft: 'auto', width: 'fit-content', padding: '14px 24px', borderRadius: 24, borderBottomRightRadius: 8, background: C.signature, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: '#fff'}}>NID</div>
              <div style={{marginTop: 24, padding: 20, borderRadius: 24, borderBottomLeftRadius: 8, background: C.surfaceHi, width: 330, transform: `translateY(${(1 - pop(t, replyAt + 0.15)) * 60}px)`, opacity: clamp01(pop(t, replyAt + 0.15) * 1.5)}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <svg width="44" height="54" viewBox="0 0 80 96"><path d="M8 4 h44 l20 20 v64 a6 6 0 0 1 -6 6 h-58 a6 6 0 0 1 -6 -6 v-78 a6 6 0 0 1 6 -6z" fill={C.danger} /></svg>
                  <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.text}}>NID-চেকলিস্ট.pdf</div>
                </div>
              </div>
            </div>
          )}
        </Phone>
      </div>
    </Stage>
  );
};

export const Video: React.FC = () => {
  useFonts();
  const t = useT();
  const sh = shakeAt(t, A.kintu);
  const srcs = [
    {from: A.nov16, to: A.why, text: 'সূত্র: bdnews24, BSS · ১৬ নভেম্বর ২০২৬'},
    {from: A.bochore, to: A.maser, text: 'সূত্র: The Daily Star বাংলা'},
    {from: A.fb_ad, to: A.tahole, text: 'সূত্র: বাংলা ট্রিবিউন'},
    {from: A.dui, to: A.fee230, text: 'সূত্র: নির্বাচন কমিশন'},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.wav')} />
      <Background t={t} />
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        <S1 t={t} />
        <S2 t={t} />
        <S3 t={t} />
        <S4 t={t} />
        <S5 t={t} />
        <S6 t={t} />
        <S7 t={t} />
        <S8 t={t} />
        <S9 t={t} />
        <S10 t={t} />
        <S11 t={t} />
        <S12 t={t} />
        <S13 t={t} />
        <S14 t={t} />
        <S15 t={t} />
      </div>
      <Vignette t={t} at={A.kintu} />
      <Iris t={t} at={A.tahole} x={W * 0.75} y={H * 0.45} />
      <Iris t={t} at={A.outro} x={W * 0.3} y={H * 0.5} />
      <BrandPill />
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
