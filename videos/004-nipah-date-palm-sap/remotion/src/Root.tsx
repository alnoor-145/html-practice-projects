import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, TOTAL_SEC, W} from './lib';
import {Video} from './Video';

// One video, two brandings: Facebook (Al NUR / Follow) and YouTube Shorts (Mr N Boy / Subscribe).
export const Root: React.FC = () => (
  <>
    <Composition id="Facebook" component={Video} durationInFrames={Math.round(TOTAL_SEC * FPS)} fps={FPS} width={W} height={H} defaultProps={{platform: 'facebook' as const}} />
    <Composition id="YouTube" component={Video} durationInFrames={Math.round(TOTAL_SEC * FPS)} fps={FPS} width={W} height={H} defaultProps={{platform: 'youtube' as const}} />
  </>
);
