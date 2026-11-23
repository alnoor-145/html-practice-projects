import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, BRAND, Background, Bean, BrandPill, C, Captions, Chip, Confetti, FONT, FONT_BN, Iris, OUTRO_SEC, Odometer, Phone, Platform,
  Scribble, SourcePill, Stage, Sticker, Title, Toggle, Vignette, W, WORDS, bn, clamp01, ease, pop, ramp, shakeAt, useFonts, useT,
} from './lib';

const wordAt = (text: string, after = 0) => {
  const w = WORDS.find((x) => x.start >= after - 0.01 && x.text.replace(/^["“]/, '').startsWith(text));
  if (!w) throw new Error('word not found: ' + text);
  return w.start;
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * clamp01(k);
const END = A.end;
// part 2 (when it arrives) starts at A.puzzle; until then the waterfall holds to the end
const PART2 = (A as Record<string, number>).puzzle ?? END + 0.4;

const EXAMPLE_NOTE = 'উদাহরণ: ২ কিলোওয়াট লোড · ডিপিডিসির হার · আনুমানিক';
const Note: React.FC<{top: number; o?: number}> = ({top, o = 1}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: o}}>
    <div style={{padding: '8px 22px', borderRadius: 999, border: `2px dashed ${C.muted}`, fontFamily: FONT_BN, fontWeight: 600, fontSize: 26, color: C.muted, background: 'rgba(14,18,64,0.6)'}}>{EXAMPLE_NOTE}</div>
  </div>
);

// ---------------- prepaid meter (our own design) ----------------
const Meter: React.FC<{t: number; w?: number; value?: React.ReactNode; alarm?: number}> = ({t, w = 520, value, alarm = 0}) => {
  const h = w * 1.3;
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: w * 0.09, background: 'linear-gradient(180deg, #E9ECF8 0%, #C9CEE6 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', border: `${w * 0.02}px solid #AEB4D6`}}>
      <div style={{position: 'absolute', left: '8%', right: '8%', top: '5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: w * 0.055, color: '#3A3F6B'}}>প্রিপেইড মিটার</div>
        <div style={{display: 'flex', gap: w * 0.02}}>
          <div style={{width: w * 0.03, height: w * 0.03, borderRadius: 99, background: alarm > 0.5 && Math.sin(t * 12) > 0 ? C.danger : '#E3A7B4'}} />
          <div style={{width: w * 0.03, height: w * 0.03, borderRadius: 99, background: C.good}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: '8%', right: '8%', top: '15%', height: '24%', borderRadius: w * 0.04, background: alarm > 0 ? `rgb(${Math.round(lerp(38, 255, alarm))},${Math.round(lerp(64, 77, alarm))},${Math.round(lerp(90, 109, alarm))})` : '#1E3C4F', boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, color: '#E6FFF9', fontSize: w * 0.16, display: 'flex', alignItems: 'center', gap: w * 0.015}}>{value}</div>
      </div>
      <div style={{position: 'absolute', left: '12%', right: '12%', top: '45%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: w * 0.03}}>
        {['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '✕', '০', '✓'].map((k, i) => (
          <div key={i} style={{height: w * 0.085, borderRadius: w * 0.03, background: '#F7F8FD', boxShadow: '0 3px 0 #9EA4C8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: w * 0.045, color: '#3A3F6B'}}>{k}</div>
        ))}
      </div>
    </div>
  );
};

// ---------------- S1: hook ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const b = A.dokan;
  const cardIn = ease((t - 0.25) / 0.5), cardDown = ease((t - 1.0) / 0.6);
  const done = A.meter + 1.6;
  const alarm = ramp(t, done, done + 0.3);
  return (
    <Stage t={t} a={0} b={b} noFadeIn>
      <div style={{position: 'absolute', left: 280, top: 400}}>
        <Meter t={t} value={t < A.meter ? <span>৳ ০০০</span> : <><span>৳</span><Odometer t={t} at={A.meter} dur={1.6} target={660} pattern="660" size={74} color="#E6FFF9" /></>} alarm={alarm} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: lerp(250, 520, cardDown), display: 'flex', justifyContent: 'center', opacity: clamp01(cardIn * 2) * (1 - ramp(t, 1.45, 1.65)), transform: `scale(${lerp(1, 0.5, cardDown)})`}}>
        <div style={{padding: '22px 46px', borderRadius: 26, background: C.good, boxShadow: '0 14px 30px rgba(0,0,0,0.35)', fontFamily: FONT_BN, fontWeight: 800, fontSize: 78, color: C.bg}}>৳১,০০০</div>
      </div>
      {t > wordAt('ছয়শোর') - 0.1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
          <Sticker t={t} at={wordAt('ছয়শোর')} text="মাত্র ৬৬০?!" color={C.danger} rotate={-5} size={76} />
        </div>
      )}
      <Note top={1100} o={ramp(t, A.meter + 0.5, A.meter + 1)} />
    </Stage>
  );
};

// ---------------- S2: the shopkeeper did not steal; the June news ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.dokan, b = A.follow;
  const news = ramp(t, A.june, A.june + 0.4);
  const flip = ease((t - wordAt('জুনেই', a) - 0.1) / 0.5);
  const swing = Math.sin((t - wordAt('নাকি', a)) * 5) * 14 * Math.max(0, 1 - Math.max(0, t - wordAt('নাকি', a)) / 2);
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{opacity: 1 - news, transform: `translateY(${-news * 60}px)`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center'}}>
          <div style={{position: 'relative', transform: `scale(${pop(t, a + 0.1)})`}}>
            <Chip size={50}>দোকানদার টাকা মেরেছে?</Chip>
            <Scribble t={t} at={A.na} w={640} h={70} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 140, right: 140, top: 520, height: 520, borderRadius: 40, background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 90, borderRadius: '40px 40px 0 0', background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 44, color: '#fff'}}>ফ্লেক্সিলোড · মিটার রিচার্জ</div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 130, borderRadius: '0 0 40px 40px', background: '#2A3470'}} />
          <div style={{position: 'absolute', left: 290, top: 150}}><Bean kind="bhai" size={210} t={t} mood={t > A.na ? 'happy' : 'worried'} /></div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 700, fontSize: 34, color: C.text}}>দোকানদার</div>
        </div>
        {t > A.na && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 1080, display: 'flex', justifyContent: 'center'}}>
            <Sticker t={t} at={A.na + 0.35} text="কেউ চুরি করেনি" color={C.good} rotate={4} size={64} textColor={C.bg} />
          </div>
        )}
      </div>
      {t > A.june - 0.1 && (
        <div style={{position: 'absolute', left: 100, right: 100, top: 430, opacity: news, perspective: 1200}}>
          <div style={{padding: '40px 44px', borderRadius: 34, background: '#F5F7FF', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', transformOrigin: 'top center', transform: `rotateX(${(1 - flip) * 80}deg)`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT_BN, fontWeight: 700, fontSize: 32, color: '#6B6890'}}><span>খবর · জুন ২০২৬</span><span>সারাংশ</span></div>
            <div style={{marginTop: 18, fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, lineHeight: 1.3, color: C.ink}}>প্রিপেইড মিটারের মাসিক চার্জ আর কাটবে না</div>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 40, transformOrigin: 'top center', transform: `rotate(${swing}deg) scale(${pop(t, wordAt('নাকি', a))})`}}>
            <div style={{width: 200, height: 200, borderRadius: 999, background: C.warn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.bg, border: '8px solid #fff'}}>?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};

// ---------------- S3: mid-video follow ----------------
const S3: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.story;
  const on = ease((t - A.follow_word) / 0.3);
  const card = pop(t, a + 0.3);
  const bell = t > A.follow_word ? Math.sin((t - A.follow_word) * 22) * 18 * Math.max(0, 1 - (t - A.follow_word) / 0.9) : 0;
  const br = BRAND[platform];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}>
        <Title size={74}>এমন হিসাব, যা কেউ</Title>
        <Title size={74}>বুঝিয়ে বলে না,</Title>
        <Title size={74} color={C.info}>এখানে বলি</Title>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 780, padding: 36, borderRadius: 44, background: C.surface, border: '2px solid rgba(139,108,255,0.5)', boxShadow: '0 30px 70px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', gap: 28, transform: `translateY(${(1 - card) * 400}px)`, opacity: clamp01(card * 1.5)}}>
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
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={880} />
    </Stage>
  );
};

// ---------------- S4: Abbu away for three months, comes back, shock ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.story, b = A.three;
  const phaseB = ramp(t, A.back - 0.1, A.back + 0.3);
  const walk = ramp(t, a + 0.3, a + 2.2);
  const flips = Math.max(0, (t - A.lock - 0.4) / 0.55);
  const month = Math.min(3, 1 + Math.floor(flips));
  const shock = A.shock;
  const sh = shakeAt(t, shock, 0.5, 12);
  return (
    <Stage t={t} a={a} b={b}>
      {/* phase A: leaving, lock, calendar, flat usage */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - phaseB}}>
        <div style={{position: 'absolute', left: 110, top: 330, width: 330, height: 560, borderRadius: '24px 24px 0 0', background: '#5A4795', border: '10px solid #3D3080'}}>
          <div style={{position: 'absolute', right: 28, top: 270, width: 22, height: 22, borderRadius: 99, background: '#C9B6FF'}} />
          {t > A.lock - 0.1 && (
            <svg width="120" height="130" viewBox="0 0 28 30" style={{position: 'absolute', left: 105, top: lerp(-120, 200, ease((t - A.lock) / 0.35))}}>
              <rect x="3" y="12" width="22" height="16" rx="4" fill={C.warn} /><path d="M8 12 V8 a6 6 0 0 1 12 0 V12" fill="none" stroke={C.warn} strokeWidth="3.4" />
            </svg>
          )}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 34, color: '#fff'}}>ঢাকার বাসা</div>
        </div>
        <div style={{position: 'absolute', left: lerp(300, 760, walk), top: 520, opacity: 1 - ramp(t, a + 1.8, a + 2.3)}}>
          <Bean kind="abbu" size={210} t={t * 1.6} mood="happy" />
          <div style={{position: 'absolute', left: 150, top: 200, width: 70, height: 90, borderRadius: 12, background: C.warn, border: '5px solid #C96A2A'}} />
        </div>
        <div style={{position: 'absolute', left: 560, top: 360, transform: `scale(${pop(t, a + 0.6)})`}}>
          <Chip size={38} bg="rgba(77,212,255,0.14)">🚌 ৩ মাস গ্রামের বাড়িতে</Chip>
        </div>
        {t > A.lock + 0.2 && (
          <div style={{position: 'absolute', left: 560, top: 500, width: 360, height: 300, transform: `scale(${pop(t, A.lock + 0.2)})`}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 24, background: '#F5F7FF', boxShadow: '0 20px 40px rgba(0,0,0,0.35)'}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 80, borderRadius: '24px 24px 0 0', background: C.signature}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 80, color: C.ink}}>মাস {bn(month)}</div>
          </div>
        )}
        {t > A.zero - 0.2 && (
          <div style={{position: 'absolute', left: 110, right: 110, top: 960, padding: '20px 30px', borderRadius: 28, background: C.surface, opacity: ramp(t, A.zero - 0.2, A.zero + 0.2)}}>
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.muted}}>বিদ্যুৎ খরচ</div>
            <svg width="780" height="120" viewBox="0 0 780 120">
              <line x1="0" y1="110" x2="780" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <path d={`M 0 100 L ${780 * ease((t - A.zero) / 1.2)} 100`} stroke={C.good} strokeWidth="8" strokeLinecap="round" fill="none" />
            </svg>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: C.good}}>প্রায় শূন্য</div>
          </div>
        )}
      </div>
      {/* phase B: back, recharge, look at the meter, shock */}
      {phaseB > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: phaseB, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
          <div style={{position: 'absolute', left: 90, top: 560}}>
            <Bean kind="abbu" size={250} t={t} mood={t > shock ? 'worried' : 'happy'} />
          </div>
          <div style={{position: 'absolute', left: 120, top: 330, transform: `scale(${pop(t, A.back + 0.5)})`, transformOrigin: 'left center'}}>
            <Chip size={40} color={C.good} bg="rgba(38,198,218,0.14)">✓ ৳১,০০০ রিচার্জ</Chip>
          </div>
          <div style={{position: 'absolute', left: 480, top: 450, transform: `scale(${pop(t, A.look - 0.2)})`}}>
            <Meter t={t} w={460} value={<span>৳ ৬৬০</span>} alarm={ramp(t, shock - 0.1, shock + 0.2)} />
          </div>
          {t > shock - 0.1 && (
            <div style={{position: 'absolute', left: 60, top: 1110}}>
              <Sticker t={t} at={shock} text="চোখ কপালে!" color={C.danger} rotate={-6} size={60} />
            </div>
          )}
        </div>
      )}
    </Stage>
  );
};

// ---------------- S5: the deduction waterfall ----------------
const SCALE = 0.8, BAR_X = 120, BAR_W = 250, BAR_BOTTOM = 1290;
type Piece = {key: string; amount: number; color: string; cut: number};
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.three, b = PART2;
  const n252 = A.n252;
  const pieces: Piece[] = [
    {key: 'vat', amount: 47.62, color: C.info, cut: A.vat48},
    {key: 'd1', amount: 84, color: C.danger, cut: A.kw2 + 1.2},
    {key: 'd2', amount: 84, color: C.danger, cut: n252 - 0.5},
    {key: 'd3', amount: 84, color: C.danger, cut: n252 - 0.2},
    {key: 'rent', amount: 40, color: C.warn, cut: A.rent40},
  ];
  const remain = 1000 - pieces.reduce((s, p) => s + p.amount, 0);
  let y = BAR_BOTTOM - 1000 * SCALE;
  const rows = [
    {at: A.vat, title: '১ · ভ্যাট ৫%', val: t >= A.vat48 ? '− ৳৪৮' : '', col: C.info},
    {at: A.demand, title: '২ · ডিমান্ড চার্জ', sub: t >= A.per_kw ? 'প্রতি কিলোওয়াটে মাসে ৳৪২' : '', val: t >= n252 ? '− ৳২৫২ (৩ মাস)' : t >= A.kw2 ? '− ৳৮৪ / মাস' : '', col: C.danger},
    {at: A.rent, title: '৩ · মিটার ভাড়া', sub: t >= wordAt('সিঙ্গেল', A.rent) ? 'সিঙ্গেল ফেজ' : '', val: t >= A.rent40 ? '− ৳৪০' : '', col: C.warn},
  ];
  const glow = ramp(t, A.left, A.left + 0.5);
  return (
    <Stage t={t} a={a} b={b + 0.3} noFadeOut>
      <div style={{position: 'absolute', left: 60, right: 60, top: 270, textAlign: 'center', transform: `scale(${pop(t, a + 0.1)})`}}>
        <Title size={60}>৳১,০০০ থেকে আগে কাটে</Title>
        <Title size={60} color={C.warn}>৩টা জিনিস</Title>
      </div>
      {/* bar */}
      <div style={{position: 'absolute', left: BAR_X - 10, top: BAR_BOTTOM - 1000 * SCALE - 54, width: BAR_W + 20, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 38, color: C.text}}>৳১,০০০</div>
      {pieces.map((p) => {
        const h = p.amount * SCALE, top = y;
        y += h;
        const k = ease((t - p.cut) / 0.7);
        return (
          <React.Fragment key={p.key}>
            <div style={{position: 'absolute', left: BAR_X, top, width: BAR_W, height: h - 3, borderRadius: 10, border: `3px dashed ${k > 0 ? 'rgba(255,255,255,0.35)' : 'transparent'}`}} />
            <div style={{position: 'absolute', left: BAR_X, top, width: BAR_W, height: h - 3, borderRadius: 10, background: p.color, opacity: 1 - k, transform: `translate(${k * 280}px, ${k * k * 520}px) rotate(${k * 28}deg)`}} />
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: BAR_X, top: y, width: BAR_W, height: remain * SCALE, borderRadius: 14, background: C.good, boxShadow: glow > 0 ? `0 0 ${60 * glow}px rgba(38,198,218,0.8), 0 0 0 ${6 * glow}px ${C.signature}` : 'none'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 30, lineHeight: 1.2, color: C.bg, opacity: glow}}>মিটারে ঢোকে<br />আসল বিদ্যুতের টাকা</div>
        {t > A.left && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', alignItems: 'baseline', fontFamily: FONT_BN, fontWeight: 800, fontSize: 60, color: C.bg, transform: `scale(${pop(t, A.left + 0.2)})`}}>≈৳<Odometer t={t} at={A.left + 0.2} dur={1.0} target={660} pattern="660" size={60} color={C.bg} /></div>
        )}
      </div>
      {/* labels */}
      <div style={{position: 'absolute', left: 420, right: 50, top: 560, display: 'flex', flexDirection: 'column', gap: 28}}>
        {rows.map((r, i) => {
          const k = pop(t, r.at);
          if (t < r.at - 0.1) return null;
          return (
            <div key={i} style={{padding: '20px 24px', borderRadius: 26, background: 'rgba(255,255,255,0.06)', borderLeft: `10px solid ${r.col}`, transform: `translateX(${(1 - k) * 60}px)`, opacity: clamp01(k * 1.5)}}>
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 40, color: C.text}}>{r.title}</div>
              {r.sub ? <div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 28, color: C.muted}}>{r.sub}</div> : null}
              {r.val ? <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 46, color: r.col}}>{r.val}</div> : null}
            </div>
          );
        })}
        {t > A.kw2 - 0.1 && t < A.rent && (
          <div style={{display: 'flex', gap: 14, flexWrap: 'wrap', transform: `scale(${pop(t, A.kw2)})`, transformOrigin: 'left center'}}>
            <Chip size={34} bg="rgba(255,77,109,0.14)">⚡ ২ কিলোওয়াট লোড</Chip>
            {t > A.three_month && <Chip size={34} bg="rgba(255,138,61,0.16)">📅 ৩ মাস পর রিচার্জ</Chip>}
          </div>
        )}
      </div>
      <Note top={1316} />
    </Stage>
  );
};

// ---------------- temporary outro while part 2 is missing ----------------
const S_END: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = PART2 + 0.2, br = BRAND[platform];
  const on = ease((t - a - 1.6) / 0.3);
  if ((A as Record<string, number>).puzzle !== undefined) return null;
  return (
    <Stage t={t} a={a} b={a + OUTRO_SEC + 1} noFadeOut>
      <div style={{position: 'absolute', left: 60, right: 60, top: 520, textAlign: 'center', transform: `scale(${pop(t, a + 0.1)})`}}>
        <Title size={84}>বাকি অংশ আসছে…</Title>
      </div>
      <div style={{position: 'absolute', left: 150, right: 150, top: 900, padding: '18px 26px', borderRadius: 999, background: C.surface, border: '2px solid rgba(139,108,255,0.5)', display: 'flex', alignItems: 'center', gap: 20, opacity: ramp(t, a + 1, a + 1.4)}}>
        <div style={{width: 64, height: 64, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 34, color: '#fff'}}>{br.initial}</div>
        <div style={{flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.text}}>{br.name}</div>
        <Toggle on={on} w={104} />
      </div>
    </Stage>
  );
};

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const srcs = [
    {from: A.june, to: A.follow, text: 'সূত্র: Observer, জুন ২০২৬'},
    {from: A.vat, to: PART2, text: 'হার: ডিপিডিসি, সেপ্টেম্বর ২০২৬'},
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
      <S_END t={t} platform={platform} />
      <Vignette t={t} at={A.shock} />
      <Iris t={t} at={A.story} x={W / 2} y={900} />
      <Iris t={t} at={A.three} x={W / 2} y={900} />
      <BrandPill platform={platform} />
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
