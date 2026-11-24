import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT, FONT_BN, Sticker, useFonts} from './lib';

// Thumbnail with the creator's own photo, 1280 x 720.
// The photo lives in public/private/me.png (cut out, white sticker outline). It is git-ignored: the repo is public.
// Render: npx remotion still src/index.ts ThumbYouTube out/thumb-youtube.png   (or ThumbFacebook)

const BRAND = {
  youtube: {name: 'Mr N Boy', letter: 'M'},
  facebook: {name: 'Al NUR', letter: 'A'},
};

export const ThumbnailMe: React.FC<{platform: 'youtube' | 'facebook'}> = ({platform}) => {
  useFonts();
  const b = BRAND[platform];
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      {/* light: violet from the left, red alert glow behind the head */}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 75% at 8% 40%, rgba(139,108,255,0.34) 0%, rgba(139,108,255,0) 100%)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle 420px at 1000px 300px, rgba(255,77,109,0.55) 0%, rgba(255,77,109,0.18) 45%, rgba(255,77,109,0) 100%)'}} />
      {/* faint alert rings */}
      {[260, 360, 470].map((r, i) => (
        <div key={r} style={{position: 'absolute', left: 1000 - r, top: 300 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `3px solid rgba(255,77,109,${0.32 - i * 0.09})`}} />
      ))}

      {/* the person, die-cut sticker */}
      <Img
        src={staticFile('private/me.png')}
        style={{position: 'absolute', left: 460, top: -207, width: 1121, height: 1056, filter: 'drop-shadow(0 14px 30px rgba(0,0,0,0.55))'}}
      />

      {/* reaction marks next to the face */}
      <div style={{position: 'absolute', left: 752, top: 44, transform: 'rotate(-12deg)', fontFamily: FONT, fontWeight: 800, fontSize: 150, lineHeight: 1, color: C.warn, WebkitTextStroke: '8px #fff', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.3)'}}>?!</div>

      {/* headline */}
      <div style={{position: 'absolute', left: 52, top: 34, fontFamily: FONT_BN, fontWeight: 800, fontSize: 112, lineHeight: 1.08, color: C.text, textShadow: '0 7px 0 rgba(0,0,0,0.38)'}}>
        <div>টাকা দিলে</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <span style={{fontFamily: FONT, fontSize: 104, background: C.signature, color: '#fff', borderRadius: 24, padding: '2px 22px 0', boxShadow: '0 7px 0 rgba(0,0,0,0.38)', textShadow: 'none'}}>NID</span>
          <span>ঠিক?</span>
        </div>
      </div>

      {/* the scam message */}
      <div style={{position: 'absolute', left: 52, top: 342, width: 560, padding: '20px 26px 24px', borderRadius: 30, borderTopLeftRadius: 8, background: 'rgba(255,255,255,0.96)', boxShadow: '0 16px 40px rgba(0,0,0,0.45)', transform: 'rotate(-2deg)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
          <div style={{width: 40, height: 40, borderRadius: 99, background: '#C9CDE0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 22, color: '#6B7194'}}>?</div>
          <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 24, color: '#6B7194'}}>অচেনা আইডি · এইমাত্র</div>
        </div>
        <div style={{fontFamily: FONT_BN, fontWeight: 700, fontSize: 36, lineHeight: 1.32, color: C.ink}}>
          "আমি ইসি থেকে বলছি। টাকা পাঠান, NID ঠিক করে দেব।"
        </div>
      </div>
      <div style={{position: 'absolute', left: 372, top: 528}}>
        <Sticker t={10} at={0} text="প্রতারণা!" color={C.danger} rotate={-7} size={58} />
      </div>

      {/* channel mark */}
      <div style={{position: 'absolute', left: 52, bottom: 34, display: 'flex', alignItems: 'center', gap: 12, padding: '6px 20px 6px 6px', borderRadius: 999, background: 'rgba(13,16,48,0.72)', border: '1.5px solid rgba(255,255,255,0.18)'}}>
        <div style={{width: 44, height: 44, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 24, color: '#fff'}}>{b.letter}</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.text}}>{b.name}</div>
      </div>
    </AbsoluteFill>
  );
};
