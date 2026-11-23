import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  A, BRAND, Background, Bean, BrandPill, C, Captions, Chip, CheckRow, Confetti, FONT, FONT_BN, Iris, OUTRO_SEC, Phone, Platform,
  Scribble, SourcePill, Stage, Sticker, Title, Toggle, Vignette, W, WORDS, bn, clamp01, ease, pop, ramp, shakeAt, useFonts, useT,
} from './lib';

// first word starting with `text` at or after `after` seconds
const wordAt = (text: string, after = 0) => {
  const w = WORDS.find((x) => x.start >= after - 0.01 && x.text.replace(/^["“]/, '').startsWith(text));
  if (!w) throw new Error('word not found: ' + text);
  return w.start;
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * clamp01(k);
const END = A.end;
const FLASH = wordAt('দিতেই', A.blast);

// ---------------- kitchen cutaway (same place, time changes) ----------------
// box: left 60, top 300, 960 x 960. Coordinates below are inside the box.
const KX = 60, KY = 300, KW = 960, KH = 960, FLOOR = 760;
const KNOB = {x: 500, y: 574};
const BURNER = {x: 520, y: 546};

type Sky = {evening: number; night: number; dawn: number};
const Kitchen: React.FC<{
  t: number; sky: Sky; gas: number; flame: number; leaking: boolean; shutters: number; dark: number; bulb: number;
  door: number; ammu: number; ammuX?: number; knobOpen: number; pipeFlow: boolean; meter?: boolean; gray?: number; ring?: number;
}> = ({t, sky, gas, flame, leaking, shutters, dark, bulb, door, ammu, ammuX = 230, knobOpen, pipeFlow, meter = true, gray = 0, ring = 0}) => {
  const flick = 0.85 + 0.15 * Math.sin(t * 31) * Math.sin(t * 17);
  return (
    <div style={{position: 'absolute', left: KX, top: KY, width: KW, height: KH, borderRadius: 44, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', filter: gray > 0 ? `grayscale(${gray}) brightness(${1 - 0.35 * gray})` : undefined}}>
      {/* wall + floor */}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #3D2A66 0%, #2E1F52 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR, bottom: 0, background: 'linear-gradient(180deg, #24163F 0%, #1A1030 100%)'}} />
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: i * 170 - 40, top: FLOOR, width: 4, height: 200, background: 'rgba(255,255,255,0.05)', transform: 'skewX(-30deg)'}} />)}
      {/* window with sky */}
      <div style={{position: 'absolute', left: 560, top: 90, width: 320, height: 280, borderRadius: 18, overflow: 'hidden', border: '10px solid #4C3780'}}>
        <div style={{position: 'absolute', inset: 0, opacity: sky.evening, background: 'linear-gradient(180deg, #B9A6FF 0%, #FF9FB2 100%)'}} />
        <div style={{position: 'absolute', inset: 0, opacity: sky.night, background: 'linear-gradient(180deg, #0B0620 0%, #2B1A4A 100%)'}}>
          {[[40, 50], [120, 30], [230, 70], [180, 140], [60, 170], [270, 200]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 5, height: 5, borderRadius: 9, background: '#fff', opacity: 0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))}} />)}
          <div style={{position: 'absolute', left: 190, top: 40 + 30 * Math.sin(t * 0.05), width: 56, height: 56, borderRadius: 99, background: '#F3ECFF', boxShadow: '0 0 30px rgba(243,236,255,0.7)'}} />
        </div>
        <div style={{position: 'absolute', inset: 0, opacity: sky.dawn, background: 'linear-gradient(180deg, #8B6CFF 0%, #FFC9A8 100%)'}} />
        <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 8, marginLeft: -4, background: '#4C3780'}} />
        {/* shutter */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${shutters * 100}%`, background: 'repeating-linear-gradient(180deg, #6A55A8 0 22px, #5A4795 22px 26px)'}} />
        {shutters > 0.95 && (
          <div style={{position: 'absolute', left: '50%', top: '50%', marginLeft: -28, marginTop: -30, transform: `scale(${pop(t, 0, {}) && 1})`}}>
            <svg width="56" height="60" viewBox="0 0 28 30"><rect x="3" y="12" width="22" height="16" rx="4" fill={C.danger} /><path d="M8 12 V8 a6 6 0 0 1 12 0 V12" fill="none" stroke={C.danger} strokeWidth="3.4" /></svg>
          </div>
        )}
      </div>
      {/* ceiling bulb */}
      <div style={{position: 'absolute', left: 478, top: 0, width: 4, height: 70, background: '#2A1D49'}} />
      <div style={{position: 'absolute', left: 456, top: 66, width: 48, height: 48, borderRadius: 99, background: bulb > 0 ? '#FFF6D8' : '#5C4A86', boxShadow: bulb > 0 ? `0 0 ${80 * bulb}px rgba(255,240,200,${0.8 * bulb})` : 'none'}} />
      {/* door */}
      <div style={{position: 'absolute', left: 40, top: 300, width: 190, height: 460, background: 'linear-gradient(180deg, #FFD9B8 0%, #C9B6FF 100%)', opacity: door}} />
      <div style={{position: 'absolute', left: 40, top: 300, width: 190, height: 460, borderRadius: '12px 12px 0 0', background: '#5A3E8E', border: '6px solid #4C3780', transformOrigin: 'left center', transform: `perspective(900px) rotateY(${-70 * door}deg)`}}>
        <div style={{position: 'absolute', right: 18, top: 230, width: 16, height: 16, borderRadius: 99, background: '#C9B6FF'}} />
      </div>
      {/* light switch */}
      <div style={{position: 'absolute', left: 258, top: 470, width: 36, height: 56, borderRadius: 8, background: '#E8E2FA'}}>
        <div style={{position: 'absolute', left: 11, top: bulb > 0 ? 8 : 26, width: 14, height: 22, borderRadius: 4, background: '#9C90C4'}} />
      </div>
      {/* gas riser + valve */}
      <div style={{position: 'absolute', left: 900, top: 0, width: 14, height: 534, background: '#8B8FB0'}} />
      <div style={{position: 'absolute', left: 800, top: 520, width: 114, height: 14, background: '#8B8FB0'}} />
      <div style={{position: 'absolute', left: 880, top: 292, width: 54, height: 16, borderRadius: 8, background: C.warn}} />
      {pipeFlow && [0, 1, 2, 3, 4].map((i) => {
        const u = ((t * 0.6 + i / 5) % 1);
        const y = u * 520;
        const x = y < 520 ? 907 : 907 - (u - 1) * 100;
        return <div key={i} style={{position: 'absolute', left: x - 4, top: y, width: 9, height: 9, borderRadius: 9, background: C.danger, opacity: 0.85}} />;
      })}
      {/* counter + stove */}
      <div style={{position: 'absolute', left: 330, top: 600, width: 600, height: 160, borderRadius: '14px 14px 0 0', background: '#4C3780'}} />
      <div style={{position: 'absolute', left: 330, top: 600, width: 600, height: 18, borderRadius: 10, background: '#6A55A8'}} />
      <div style={{position: 'absolute', left: 420, top: 548, width: 380, height: 52, borderRadius: 12, background: '#2A2340'}} />
      {[BURNER.x, 700].map((x) => <div key={x} style={{position: 'absolute', left: x - 56, top: 536, width: 112, height: 22, borderRadius: '50%', background: '#15111F', border: '4px solid #5C4A86'}} />)}
      {[KNOB.x, 720].map((x, i) => (
        <div key={x} style={{position: 'absolute', left: x - 15, top: KNOB.y - 15, width: 30, height: 30, borderRadius: 99, background: '#E8E2FA', transform: `rotate(${i === 0 ? 90 * knobOpen : 0}deg)`}}>
          <div style={{position: 'absolute', left: 13, top: 2, width: 4, height: 13, borderRadius: 2, background: '#2A2340'}} />
        </div>
      ))}
      {ring > 0 && (
        <div style={{position: 'absolute', left: KNOB.x - 34, top: KNOB.y - 34, width: 68, height: 68, borderRadius: 99, border: `5px solid ${C.signature}`, boxShadow: `0 0 ${30 * ring}px rgba(139,108,255,0.9)`, opacity: ring, transform: `scale(${1 + 0.08 * Math.sin(t * 8)})`}} />
      )}
      {/* flame */}
      {flame > 0.02 && (
        <svg width="90" height="80" viewBox="0 0 90 80" style={{position: 'absolute', left: BURNER.x - 45, top: BURNER.y - 70, transform: `scale(${flame * flick})`, transformOrigin: 'center bottom'}}>
          <path d="M45 78 C 15 70 18 40 45 6 C 72 40 75 70 45 78 Z" fill={C.info} opacity="0.9" />
          <path d="M45 76 C 30 70 32 50 45 30 C 58 50 60 70 45 76 Z" fill="#E6F8FF" />
        </svg>
      )}
      {/* leaking gas particles */}
      {leaking && Array.from({length: 16}).map((_, i) => {
        const u = ((t * 0.35 + i / 16) % 1);
        const x = BURNER.x + Math.sin(i * 7.3 + t * 0.8) * (40 + 260 * u);
        const y = BURNER.y - 20 - u * 460;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 22 + 30 * u, height: 22 + 30 * u, borderRadius: 99, background: 'rgba(255,77,109,0.35)', filter: 'blur(4px)', opacity: 1 - u}} />;
      })}
      {/* ammu */}
      {ammu > 0.01 && (
        <div style={{position: 'absolute', left: ammuX, top: 440, opacity: clamp01(ammu * 1.5), transform: `scale(${0.85 + 0.15 * ammu})`, transformOrigin: 'bottom center'}}>
          <Bean kind="ammu" size={230} t={t} mood={gray > 0 ? 'worried' : 'neutral'} />
        </div>
      )}
      {/* room darkness, then gas haze */}
      <div style={{position: 'absolute', inset: 0, background: `rgba(8,4,20,${dark})`}} />
      <div style={{position: 'absolute', inset: 0, opacity: gas * 0.75, background: 'linear-gradient(180deg, rgba(255,77,109,0.55) 0%, rgba(255,77,109,0.25) 60%, rgba(255,77,109,0.15) 100%)'}} />
      {gas > 0.05 && [0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 100 + i * 260 + 60 * Math.sin(t * 0.4 + i), top: 120 + i * 140 + 40 * Math.cos(t * 0.3 + i), width: 420, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,120,150,0.45) 0%, rgba(255,120,150,0) 70%)', opacity: gas}} />
      ))}
      {meter && (
        <div style={{position: 'absolute', left: 36, top: 36, padding: '12px 18px', borderRadius: 18, background: 'rgba(18,11,31,0.72)', border: '1.5px solid rgba(255,255,255,0.12)'}}>
          <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 30, color: C.text}}>ঘরে জমা গ্যাস</div>
          <div style={{marginTop: 8, width: 260, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.12)'}}>
            <div style={{width: `${gas * 100}%`, height: '100%', borderRadius: 9, background: gas > 0.6 ? C.danger : C.warn}} />
          </div>
        </div>
      )}
    </div>
  );
};

const skyAt = (t: number): Sky => {
  // evening during the story start, night from "গভীর রাতে", dawn from "ভোরে আম্মু"
  if (t < A.real) {
    const d = ramp(t, A.blast - 0.1, A.blast + 0.6);
    return {evening: 0, night: 1 - d, dawn: d};
  }
  if (t < A.night) return {evening: 1 - ramp(t, A.thanda, A.night), night: ramp(t, A.thanda, A.night), dawn: 0};
  const d = ramp(t, A.dawn - 0.4, A.dawn + 0.8);
  return {evening: 0, night: 1 - d, dawn: d};
};

// ---------------- S1: hook ----------------
const S1: React.FC<{t: number}> = ({t}) => {
  const gas = t < A.line2 ? lerp(0.08, 0.3, ramp(t, 0.3, A.line2)) : lerp(0.3, 0.8, ramp(t, A.line2, A.line2 + 2.2));
  const gray = ramp(t, FLASH + 0.15, FLASH + 0.7);
  return (
    <Stage t={t} a={0} b={A.real} noFadeIn>
      <Kitchen t={t} sky={skyAt(t)} gas={gas} flame={t > FLASH - 0.05 ? 1 : 0} leaking={t < A.blast} shutters={1} dark={t < A.blast ? 0.45 : 0.15}
        bulb={t > A.blast + 0.4 ? 1 : 0} door={ramp(t, A.blast, A.blast + 0.5)} ammu={pop(t, A.blast + 0.4)} knobOpen={1} pipeFlow={t < A.blast} gray={gray} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1110, display: 'flex', justifyContent: 'center'}}>
        <Sticker t={t} at={wordAt('গ্যাসই') + 0.1} text="গ্যাসই ছিল না!" color={C.danger} rotate={-5} size={62} />
      </div>
    </Stage>
  );
};

// ---------------- S2: the real case ----------------
const S2: React.FC<{t: number}> = ({t}) => {
  const a = A.real, b = A.follow;
  const fam: ('ammu' | 'abbu' | 'bon' | 'bhai')[] = ['abbu', 'ammu', 'bhai', 'bon'];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 320, display: 'flex', justifyContent: 'center'}}>
        <Sticker t={t} at={a + 0.1} text="আসল ঘটনা" color={C.warn} rotate={-4} size={70} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center', opacity: ramp(t, A.fatullah - 0.2, A.fatullah + 0.2)}}>
        <Chip size={46} bg="rgba(77,212,255,0.12)">
          <svg width="30" height="38" viewBox="0 0 24 30"><path d="M12 29 C 12 29 2 17 2 11 a10 10 0 0 1 20 0 c0 6 -10 18 -10 18z" fill={C.info} /><circle cx="12" cy="11" r="4" fill={C.bg} /></svg>
          নারায়ণগঞ্জ · ফতুল্লা
        </Chip>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', gap: 8}}>
        {fam.map((k, i) => (
          <div key={k} style={{filter: 'grayscale(0.85) brightness(0.8)', transform: `scale(${pop(t, A.fatullah + 0.6 + i * 0.25)})`}}>
            <Bean kind={k} size={200} t={t} mood="worried" phase={i} bounce={0.3} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center'}}>
        <Sticker t={t} at={A.char} text="একই পরিবারের ৪ জন দগ্ধ" color={C.danger} rotate={3} size={52} />
      </div>
    </Stage>
  );
};

// ---------------- S3: mid-video follow ----------------
const S3: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = A.follow, b = A.world;
  const on = ease((t - A.follow_word) / 0.3);
  const card = pop(t, a + 0.3);
  const bell = t > A.follow_word ? Math.sin((t - A.follow_word) * 22) * 18 * Math.max(0, 1 - (t - A.follow_word) / 0.9) : 0;
  const br = BRAND[platform];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 380, textAlign: 'center', opacity: ramp(t, a, a + 0.4)}}>
        <Title size={78}>যা সবার জানা দরকার,</Title>
        <Title size={78} color={C.info}>এখানে বলি</Title>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 720, padding: 36, borderRadius: 44, background: C.surface, border: '2px solid rgba(139,108,255,0.5)', boxShadow: '0 30px 70px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', gap: 28, transform: `translateY(${(1 - card) * 400}px)`, opacity: clamp01(card * 1.5)}}>
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
      <Confetti t={t} at={A.follow_word + 0.1} x={860} y={820} />
    </Stage>
  );
};

// ---------------- S4: evening, gas goes, knob stays open, windows shut, sleep ----------------
const S4: React.FC<{t: number}> = ({t}) => {
  const a = A.world, b = A.night;
  const flame = t < A.evening + 0.4 ? 0 : t < A.nivhe ? lerp(1, 0.35, ramp(t, A.evening + 2.5, A.nivhe)) : lerp(0.35, 0, ramp(t, A.nivhe, A.nivhe + 0.6));
  const zoom = ramp(t, A.knob, A.knob + 0.6) * (1 - ramp(t, A.thanda - 0.6, A.thanda));
  const fx = KX + KNOB.x, fy = KY + KNOB.y, s = 1 + 1.3 * ease(zoom);
  const sleep = pop(t, A.ghum);
  return (
    <Stage t={t} a={a} b={b} noFadeOut>
      <div style={{position: 'absolute', inset: 0, transformOrigin: `${fx}px ${fy}px`, transform: `scale(${s})`}}>
        <Kitchen t={t} sky={skyAt(t)} gas={0} flame={flame} leaking={false} shutters={ease(ramp(t, A.thanda, A.thanda + 1.6))} dark={lerp(0.05, 0.5, ramp(t, A.ghum, A.ghum + 0.8))}
          bulb={t < A.ghum ? 1 : 0} door={0} ammu={pop(t, A.evening) * (1 - ramp(t, A.ghum, A.ghum + 0.6))} knobOpen={1} pipeFlow={false} meter={false} ring={ramp(t, A.knob + 0.3, A.knob + 0.7)} />
      </div>
      <div style={{position: 'absolute', right: 40, top: 220, opacity: ramp(t, a + 0.3, a + 0.6)}}>
        <Chip size={28} color={C.muted} bg="rgba(18,11,31,0.7)" style={{border: `2px dashed ${C.muted}`}}>উদাহরণ দৃশ্য</Chip>
      </div>
      {t > A.gas_nei - 0.2 && t < A.knob + 0.2 && (
        <div style={{position: 'absolute', left: 520, top: 760}}><Sticker t={t} at={A.gas_nei} text="গ্যাস নেই" color={C.surfaceHi} rotate={-6} size={50} /></div>
      )}
      {t > A.khola - 0.2 && t < A.thanda && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center'}}><Sticker t={t} at={A.khola} text="চাবি খোলা!" color={C.danger} rotate={-4} size={80} /></div>
      )}
      {t > A.thanda - 0.2 && t < A.ghum + 0.3 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', transform: `scale(${pop(t, A.thanda)})`}}>
          <Chip size={44} color={C.info} bg="rgba(77,212,255,0.14)">❄ ঠান্ডা · সব দরজা-জানালা বন্ধ</Chip>
        </div>
      )}
      {t > A.ghum - 0.1 && (
        <div style={{position: 'absolute', left: 140, right: 140, top: 1090, padding: '24px 30px 10px', borderRadius: 36, background: 'rgba(30,38,72,0.92)', border: '2px solid rgba(139,108,255,0.4)', display: 'flex', justifyContent: 'center', gap: 6, transform: `scale(${sleep})`, opacity: clamp01(sleep * 1.5)}}>
          {(['abbu', 'ammu', 'bon'] as const).map((k, i) => <div key={k} style={{marginBottom: -20}}><Bean kind={k} size={120} t={t * 0.4} mood="sleep" phase={i} bounce={0.15} /></div>)}
          {[0, 1, 2].map((i) => {
            const u = ((t * 0.5 + i / 3) % 1);
            return <div key={i} style={{position: 'absolute', right: 70 - u * 30, top: 30 - u * 60, fontFamily: FONT, fontWeight: 800, fontSize: 30 + 16 * u, color: C.text, opacity: 1 - u}}>z</div>;
          })}
        </div>
      )}
    </Stage>
  );
};

// ---------------- S5: deep night, gas returns, room fills ----------------
const S5: React.FC<{t: number}> = ({t}) => {
  const a = A.night, b = A.dawn;
  const gas = lerp(0, 0.85, ramp(t, A.leak, A.dawn));
  const hours = Math.min(5, 1 + Math.floor(Math.max(0, t - A.hours) / 0.5));
  return (
    <Stage t={t} a={a} b={b} noFadeIn noFadeOut>
      <Kitchen t={t} sky={skyAt(t)} gas={gas} flame={0} leaking={t > A.leak} shutters={1} dark={0.5} bulb={0} door={0} ammu={0} knobOpen={1} pipeFlow={t > a + 0.3} ring={t > A.leak && t < A.no_sound ? 1 : 0} />
      <div style={{position: 'absolute', right: 40, top: 220}}>
        <Chip size={28} color={C.muted} bg="rgba(18,11,31,0.7)" style={{border: `2px dashed ${C.muted}`}}>উদাহরণ দৃশ্য</Chip>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1110, display: 'flex', justifyContent: 'center', gap: 20}}>
        {t < A.no_sound - 0.2 && <div style={{transform: `scale(${pop(t, a + 0.2)})`}}><Chip size={44} bg="rgba(139,108,255,0.2)">🌙 গভীর রাত · লাইনে গ্যাস ফিরল</Chip></div>}
        {t > A.no_sound - 0.2 && t < A.hours - 0.1 && [
          {at: A.no_sound, label: 'শব্দ'},
          {at: wordAt('আগুন', A.no_sound), label: 'আগুন'},
        ].map((x) => (
          <div key={x.label} style={{position: 'relative', transform: `scale(${pop(t, x.at)})`}}>
            <Chip size={46}>{x.label}</Chip>
            <Scribble t={t} at={x.at + 0.3} w={150} h={50} />
          </div>
        ))}
        {t > A.hours - 0.1 && (
          <div style={{transform: `scale(${pop(t, A.hours)})`}}>
            <Chip size={46} color={C.warn} bg="rgba(255,138,61,0.14)">⏳ {bn(hours)} ঘণ্টা… জমছে</Chip>
          </div>
        )}
      </div>
      {t > A.window - 0.2 && t < A.hours && (
        <div style={{position: 'absolute', left: KX + 560, top: KY + 390}}><Sticker t={t} at={A.window} text="বের হওয়ার পথ নেই" color={C.danger} rotate={4} size={40} /></div>
      )}
    </Stage>
  );
};

// ---------------- S6: dawn, light, the spark ----------------
const S6: React.FC<{t: number}> = ({t}) => {
  const a = A.dawn, b = A.fs;
  const sparkD = t - A.light;
  const stop = ramp(t, A.spark, A.spark + 0.5);
  return (
    <Stage t={t} a={a} b={b} noFadeIn>
      <Kitchen t={t} sky={skyAt(t)} gas={0.85} flame={0} leaking={false} shutters={1} dark={0.3} bulb={t > A.light ? 1 : 0} door={ramp(t, a + 0.2, a + 0.9)}
        ammu={pop(t, a + 0.6)} ammuX={t < A.fire ? 60 : lerp(60, 250, ramp(t, A.fire, A.fire + 0.8))} knobOpen={1} pipeFlow={false} gray={0.75 * stop} />
      {sparkD > 0 && sparkD < 0.8 && (
        <div style={{position: 'absolute', left: KX + 276 - 60, top: KY + 498 - 60, width: 120, height: 120, borderRadius: 99, border: `6px solid ${C.signature}`, opacity: 1 - sparkD / 0.8, transform: `scale(${0.3 + sparkD * 1.6})`}} />
      )}
      {sparkD > 0 && sparkD < 0.5 && (
        <svg width="80" height="80" viewBox="0 0 40 40" style={{position: 'absolute', left: KX + 300, top: KY + 440, opacity: 1 - sparkD / 0.5}}>
          <path d="M20 2 L23 16 L38 20 L23 24 L20 38 L17 24 L2 20 L17 16 Z" fill="#FFF6D8" />
        </svg>
      )}
      {t > A.light - 0.2 && t < A.spark && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1110, display: 'flex', justifyContent: 'center', transform: `scale(${pop(t, A.light)})`}}>
          <Chip size={44} color={C.warn} bg="rgba(255,138,61,0.14)">সুইচ চাপলেই ছোট স্ফুলিঙ্গ</Chip>
        </div>
      )}
      {t > A.spark - 0.2 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          <Sticker t={t} at={A.spark + 0.2} text="একটা স্ফুলিঙ্গই" color={C.danger} rotate={-4} size={88} />
          <Sticker t={t} at={wordAt('যথেষ্ট', A.spark)} text="যথেষ্ট" color={C.signature} rotate={3} size={70} />
        </div>
      )}
    </Stage>
  );
};

// ---------------- S7: fire service's first assessment ----------------
const S7: React.FC<{t: number}> = ({t}) => {
  const a = A.fs, b = A.burn;
  const steps = [
    {at: A.fs_list, text: 'রাতে গ্যাস ছিল না', col: C.info},
    {at: wordAt('চুলার', A.fs_list), text: 'চুলার সুইচ খোলা ছিল', col: C.warn},
    {at: wordAt('পরে', A.fs_list), text: 'গ্যাস এসে বন্ধ ঘরে জমেছে', col: C.danger},
  ];
  return (
    <Stage t={t} a={a} b={b}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 300, padding: '34px 40px', borderRadius: 34, background: C.surface, borderLeft: `14px solid ${C.info}`, opacity: clamp01(pop(t, a + 0.1) * 1.4)}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 30, color: C.muted}}>ফতুল্লার ঘটনা · ফায়ার সার্ভিস</div>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 58, color: C.text, marginTop: 6}}>প্রাথমিক ধারণা</div>
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 600, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0}}>
        {steps.map((s, i) => {
          const k = pop(t, s.at - 0.1);
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div style={{height: 70, display: 'flex', justifyContent: 'center', opacity: ramp(t, s.at - 0.3, s.at)}}>
                  <svg width="40" height="70" viewBox="0 0 40 70"><line x1="20" y1="4" x2="20" y2="54" stroke={C.signature} strokeWidth="6" strokeDasharray="4 10" strokeDashoffset={-t * 40} /><path d="M8 50 L20 66 L32 50" fill="none" stroke={C.signature} strokeWidth="6" strokeLinecap="round" /></svg>
                </div>
              )}
              <div style={{padding: '26px 30px', borderRadius: 28, background: 'rgba(255,255,255,0.06)', border: `3px solid ${s.col}`, fontFamily: FONT_BN, fontWeight: 800, fontSize: 48, color: C.text, textAlign: 'center', transform: `scale(${0.85 + 0.15 * k})`, opacity: clamp01(k * 1.5)}}>{s.text}</div>
            </React.Fragment>
          );
        })}
      </div>
    </Stage>
  );
};

// ---------------- S8: burn patients rise in winter ----------------
const S8: React.FC<{t: number}> = ({t}) => {
  const a = A.burn, b = A.rules;
  const g1 = ease((t - A.burn_num - 0.3) / 0.8), g2 = ease((t - wordAt('ষাট', A.burn_num) + 0.1) / 0.8);
  const bars = [
    {label: 'সাধারণ সময়', val: '৪০–৪৫', h: 400 * g1, col: C.muted},
    {label: 'শীতে', val: '৬০–৬৫', h: 590 * g2, col: C.danger},
  ];
  return (
    <Stage t={t} a={a} b={b} noFadeOut>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
        <Sticker t={t} at={a + 0.1} text="❄ শীত এলেই" color={C.info} rotate={-4} size={60} textColor={C.bg} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 450, textAlign: 'center', opacity: ramp(t, wordAt('বার্ন', a) - 0.2, wordAt('বার্ন', a) + 0.2)}}>
        <Title size={46}>বার্ন ইনস্টিটিউট · জরুরি বিভাগ</Title>
        <div style={{fontFamily: FONT_BN, fontWeight: 600, fontSize: 34, color: C.muted}}>দিনে পোড়া রোগী</div>
      </div>
      <div style={{position: 'absolute', left: 140, right: 140, top: 620, height: 680, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around'}}>
        {bars.map((x) => (
          <div key={x.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
            <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 64, color: x.col === C.muted ? C.text : C.danger, opacity: x.h > 20 ? 1 : 0}}>{x.val}</div>
            <div style={{width: 220, height: Math.max(0, x.h), borderRadius: '110px 110px 24px 24px', background: x.col, opacity: 0.92}} />
            <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, color: C.text}}>{x.label}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
};

// ---------------- S9: three rules (blueprint) ----------------
const RulePanel: React.FC<{t: number; a: number; b: number; children: React.ReactNode}> = ({t, a, b, children}) => {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const o = clamp01((t - a + 0.02) / 0.2) * clamp01((b - t) / 0.2);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 580, height: 760, opacity: o, transformOrigin: 'top center', transform: `translateY(${(1 - ease((t - a) / 0.3)) * 40}px) scale(1.14)`}}>{children}</div>;
};
const BigKnob: React.FC<{turn: number}> = ({turn}) => (
  <svg width="300" height="300" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="44" fill="rgba(255,255,255,0.1)" stroke="#fff" strokeWidth="2" strokeDasharray="3 5" />
    <circle cx="50" cy="50" r="32" fill="#E8E2FA" />
    <g transform={`rotate(${90 * (1 - turn)} 50 50)`}><rect x="45" y="20" width="10" height="34" rx="5" fill="#2A2340" /></g>
    <text x="50" y="98" textAnchor="middle" fontFamily="BalooX" fontWeight="800" fontSize="11" fill={turn > 0.5 ? C.good : C.danger}>{turn > 0.5 ? 'বন্ধ' : 'খোলা'}</text>
  </svg>
);
const S9: React.FC<{t: number}> = ({t}) => {
  const a = A.rules, b = END;
  const steps = [{at: A.r1, n: '১', label: 'চাবি বন্ধ'}, {at: A.r2, n: '২', label: 'জানালা খুলুন'}, {at: A.r3, n: '৩', label: 'গন্ধ পেলে'}];
  const n999 = A.n999, n16 = A.n16496;
  const typed = t < n16 - 0.1 ? '৯৯৯'.slice(0, Math.max(0, Math.min(3, Math.floor((t - n999 + 0.1) / 0.16) + 1))) : '১৬৪৯৬'.slice(0, Math.max(0, Math.min(5, Math.floor((t - n16 + 0.1) / 0.1) + 1)));
  const timer = ease((t - A.titas - 0.2) / 1.6);
  const R = 120, L = 2 * Math.PI * R;
  return (
    <Stage t={t} a={a} b={b + 0.3} noFadeIn noFadeOut>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', transform: `scale(${pop(t, a + 0.15)})`}}>
        <Title size={82}>বাঁচার ৩ নিয়ম</Title>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 400, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 40, height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.2)'}} />
        <div style={{position: 'absolute', left: 60, top: 40, height: 8, borderRadius: 8, background: C.signature, width: `${(t < A.r2 ? 0 : t < A.r3 ? 0.5 : 1) * (W - 240 - 120)}px`}} />
        {steps.map((s, i) => {
          const on = t >= s.at;
          return (
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1}}>
              <div style={{width: 88, height: 88, borderRadius: 99, background: on ? C.signature : C.blueDeep, border: '4px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 48, color: '#fff', transform: `scale(${on ? 1 + 0.15 * Math.sin(Math.PI * clamp01(pop(t, s.at))) : 0.9})`}}>{s.n}</div>
              <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 30, color: on ? '#fff' : 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap'}}>{s.label}</div>
            </div>
          );
        })}
      </div>
      <RulePanel t={t} a={a} b={A.r1}>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 120}}><Sticker t={t} at={wordAt('খুব', a)} text="খুব সহজ" color={C.signature} rotate={-4} size={84} /></div>
      </RulePanel>
      <RulePanel t={t} a={A.r1} b={A.r2}>
        <div style={{display: 'flex', justifyContent: 'center'}}><BigKnob turn={ease((t - wordAt('চাবি', A.r1) - 0.1) / 0.5)} /></div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 30, marginTop: 40, paddingLeft: 90}}>
          <CheckRow t={t} at={wordAt('চাবি', A.r1)} text="গ্যাস গেলেই চাবি বন্ধ" size={44} />
          <CheckRow t={t} at={A.r1b + 0.3} text="ঘুমানোর আগে সব চাবি চেক" size={44} />
        </div>
      </RulePanel>
      <RulePanel t={t} a={A.r2} b={A.r3}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60}}>
          <div style={{position: 'relative', width: 280, height: 300, borderRadius: 16, background: 'linear-gradient(180deg, #BFE6FF, #E9F6FF)', border: '10px solid #fff', perspective: 800}}>
            {[0, 1].map((i) => <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: i ? '50%' : 0, width: '50%', background: 'rgba(77,212,255,0.35)', border: '4px solid #fff', transformOrigin: i ? 'right center' : 'left center', transform: `rotateY(${(i ? 1 : -1) * 70 * ease((t - wordAt('রান্নাঘরের', A.r2) - 0.1) / 0.6)}deg)`}} />)}
          </div>
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="24" />
            <circle cx="150" cy="150" r={R} fill="none" stroke={C.good} strokeWidth="24" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - timer)} transform="rotate(-90 150 150)" />
            <text x="150" y="160" textAnchor="middle" fontFamily="BalooX" fontWeight="800" fontSize="70" fill="#fff">{bn(Math.round(20 * timer))}</text>
            <text x="150" y="205" textAnchor="middle" fontFamily="BalooX" fontWeight="600" fontSize="30" fill="#fff">মিনিট</text>
          </svg>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>
          <div style={{transform: `scale(${pop(t, A.titas)})`}}><Chip size={42} color="#fff" bg="rgba(255,255,255,0.12)">চুলা জ্বালানোর অন্তত ২০ মিনিট আগে</Chip></div>
        </div>
      </RulePanel>
      <RulePanel t={t} a={A.r3} b={A.call}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 30}}>
          {[{label: 'লাইট', at: wordAt('লাইট', A.r3)}, {label: 'ফ্যান', at: wordAt('ফ্যান', A.r3)}, {label: 'আগুন', at: wordAt('আগুনও', A.r3)}].map((x) => (
            <div key={x.label} style={{position: 'relative', transform: `scale(${pop(t, x.at - 0.1)})`}}>
              <Chip size={50} bg="rgba(255,255,255,0.12)" color="#fff">{x.label}</Chip>
              <Scribble t={t} at={x.at + 0.25} w={170} h={56} />
            </div>
          ))}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 30, marginTop: 70, paddingLeft: 110}}>
          <CheckRow t={t} at={A.riser + 0.3} text="রাইজার বা সিলিন্ডারের চাবি বন্ধ" size={42} />
          <CheckRow t={t} at={wordAt('জানালা', A.riser)} text="জানালা খুলুন" size={42} />
          <CheckRow t={t} at={A.exit} text="বাইরে চলে যান" size={42} />
        </div>
      </RulePanel>
      <RulePanel t={t} a={A.call} b={b + 0.3}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 50}}>
          <div style={{transform: `scale(${pop(t, A.call)})`}}>
            <Phone w={340} h={600} tilt={-5}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: typed.length > 3 ? 64 : 80, color: C.text}}>{t >= n999 - 0.1 ? typed : ''}<span style={{opacity: Math.sin(t * 8) > 0 ? 1 : 0, color: C.signature}}>|</span></div>
              <div style={{position: 'absolute', left: 26, right: 26, top: 190, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12}}>
                {['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '*', '০', '#'].map((k, i) => <div key={i} style={{height: 64, borderRadius: 99, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BN, fontWeight: 800, fontSize: 32, color: C.text}}>{k}</div>)}
              </div>
              <div style={{position: 'absolute', left: '50%', bottom: 36, marginLeft: -38, width: 76, height: 76, borderRadius: 99, background: C.good, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="34" height="34" viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z" fill="#fff" /></svg>
              </div>
            </Phone>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 26, marginTop: 40}}>
            <div style={{transform: `scale(${pop(t, A.call + 0.2)})`, transformOrigin: 'left center'}}><Chip size={36} color="#fff" bg="rgba(255,255,255,0.12)">🚪 আগে বাইরে যান</Chip></div>
            <div style={{transform: `scale(${pop(t, n999)})`, transformOrigin: 'left center'}}><Chip size={46} color="#fff" bg={C.signature}>৯৯৯</Chip></div>
            <div style={{transform: `scale(${pop(t, n16)})`, transformOrigin: 'left center'}}><Chip size={40} color="#fff" bg="rgba(255,255,255,0.14)">তিতাস ১৬৪৯৬</Chip></div>
          </div>
        </div>
      </RulePanel>
    </Stage>
  );
};

// ---------------- S10: silent outro ----------------
const S10: React.FC<{t: number; platform: Platform}> = ({t, platform}) => {
  const a = END + 0.2, br = BRAND[platform];
  const on = ease((t - a - 2.6) / 0.3);
  return (
    <Stage t={t} a={a} b={a + OUTRO_SEC + 1} noFadeOut>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transform: `scale(${pop(t, a + 0.1)})`}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 46, color: C.muted}}>আজ রাতে ঘুমানোর আগে</div>
        <Title size={110}>চাবিটা দেখুন</Title>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}><BigKnob turn={ease((t - a - 0.6) / 0.5)} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center'}}>
        <Sticker t={t} at={a + 1.3} text={'কমেন্টে লিখুন "বন্ধ"'} color={C.signature} rotate={-3} size={64} />
      </div>
      <div style={{position: 'absolute', left: 150, right: 150, top: 1180, padding: '18px 26px', borderRadius: 999, background: C.surface, border: '2px solid rgba(139,108,255,0.5)', display: 'flex', alignItems: 'center', gap: 20, opacity: ramp(t, a + 2, a + 2.4)}}>
        <div style={{width: 64, height: 64, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 34, color: '#fff'}}>{br.initial}</div>
        <div style={{flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.text}}>{br.name}</div>
        <Toggle on={on} w={104} />
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 28, color: on > 0.5 ? C.signature : C.muted, minWidth: 150}}>{on > 0.5 ? br.done : br.btn}</div>
      </div>
      <Confetti t={t} at={a + 2.7} x={800} y={1220} />
    </Stage>
  );
};

export const Video: React.FC<{platform: Platform}> = ({platform}) => {
  useFonts();
  const t = useT();
  const sh = shakeAt(t, FLASH, 0.55, 22);
  const sh2 = shakeAt(t, A.spark + 0.2, 0.35, 10);
  const flash = t > FLASH - 0.02 && t < FLASH + 0.6 ? Math.max(0, 1 - (t - FLASH) / 0.6) : 0;
  const blueprint = ramp(t, A.rules - 0.05, A.rules + 0.1) * (1 - ramp(t, END + 0.1, END + 0.4));
  const srcs = [
    {from: A.real, to: A.follow, text: 'সূত্র: বাংলা ট্রিবিউন, সমকাল'},
    {from: A.fs, to: A.burn, text: 'সূত্র: বাংলা ট্রিবিউন, ঢাকা ট্রিবিউন'},
    {from: A.burn, to: A.rules, text: 'সূত্র: ঢাকা ট্রিবিউন'},
    {from: A.r2, to: A.r3, text: 'সূত্র: তিতাস গ্যাস'},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} />
      <Background t={t} blueprint={blueprint} />
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)`}}>
        <S1 t={t} />
        <S2 t={t} />
        <S3 t={t} platform={platform} />
        <S4 t={t} />
        <S5 t={t} />
        <S6 t={t} />
        <S7 t={t} />
        <S8 t={t} />
        <S9 t={t} />
        <S10 t={t} platform={platform} />
      </div>
      {flash > 0 && <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${KX + BURNER.x}px ${KY + BURNER.y}px, rgba(255,255,255,${flash}) 0%, rgba(139,108,255,${0.8 * flash}) 45%, rgba(255,77,109,${0.5 * flash}) 100%)`}} />}
      <Vignette t={t} at={FLASH} />
      <Vignette t={t} at={A.spark + 0.2} />
      <Iris t={t} at={A.world} x={W / 2} y={900} />
      <Iris t={t} at={A.rules} x={W / 2} y={900} />
      <Iris t={t} at={END + 0.2} x={W / 2} y={900} />
      <BrandPill platform={platform} />
      {srcs.map((s, i) => <SourcePill key={i} t={t} from={s.from} to={s.to} text={s.text} />)}
      <Captions t={t} />
    </AbsoluteFill>
  );
};
