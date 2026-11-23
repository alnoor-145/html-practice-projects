import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Bean, C, FONT, FONT_BN, Phone, Sticker, useFonts} from './lib';

// YouTube thumbnail, 1280 x 720 (Mr N Boy). Big text, one face, one phone, one sticker.
export const Thumbnail: React.FC = () => {
  useFonts();
  const t = 10; // a moment where every pop-in animation has settled
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 70% 50%, #232A6A 0%, ${C.bg} 70%)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 30% 60% at 0% 50%, rgba(255,77,109,0.28) 0%, rgba(255,77,109,0) 100%)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 30% 60% at 100% 50%, rgba(77,212,255,0.22) 0%, rgba(77,212,255,0) 100%)'}} />
      {/* headline */}
      <div style={{position: 'absolute', left: 56, top: 70, width: 720}}>
        <div style={{fontFamily: FONT_BN, fontWeight: 800, fontSize: 104, lineHeight: 1.12, color: C.text, textShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
          টাকা দিলে
          <br />
          <span style={{background: C.signature, borderRadius: 22, padding: '0 18px'}}>NID</span> ঠিক?
        </div>
        <div style={{marginTop: 34}}>
          <Sticker t={t} at={0} text="ইসি বলছে: প্রতারণা!" color={C.danger} rotate={-4} size={60} />
        </div>
      </div>
      {/* phone with the scam message */}
      <div style={{position: 'absolute', left: 820, top: 70}}>
        <Phone w={300} h={560} tilt={6}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 96, background: C.surface, display: 'flex', alignItems: 'flex-end', padding: '0 16px 12px', fontFamily: FONT_BN, fontWeight: 800, fontSize: 22, color: C.text}}>Messenger</div>
          <div style={{position: 'absolute', left: 14, right: 14, top: 120, padding: '14px 16px', borderRadius: 20, borderTopLeftRadius: 6, background: C.surfaceHi, fontFamily: FONT_BN, fontWeight: 700, fontSize: 24, lineHeight: 1.4, color: C.text}}>
            "আমি নির্বাচন কমিশন থেকে বলছি। টাকা পাঠান, ঘরে বসেই ঠিক করে দেব।"
          </div>
        </Phone>
      </div>
      <div style={{position: 'absolute', left: 690, top: 360}}>
        <Bean kind="scammer" size={190} t={0} bounce={0} />
      </div>
      {/* small channel mark */}
      <div style={{position: 'absolute', left: 56, bottom: 40, display: 'flex', alignItems: 'center', gap: 12, padding: '6px 18px 6px 6px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.16)'}}>
        <div style={{width: 44, height: 44, borderRadius: 99, background: C.signature, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 24, color: '#fff'}}>M</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.text}}>Mr N Boy</div>
      </div>
    </AbsoluteFill>
  );
};
