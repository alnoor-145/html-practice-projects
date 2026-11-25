import React from 'react';
import {Composition, Still} from 'remotion';
import {FPS, H, TOTAL_SEC, W} from './lib';
import {Cover, Video} from './Video';

// One video for both platforms: upload the same file to Facebook (Al NUR) and YouTube (Mr N Boy).
export const Root: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={Math.round(TOTAL_SEC * FPS)} fps={FPS} width={W} height={H} defaultProps={{platform: 'both' as const}} />
    <Still id="Cover" component={Cover} width={W} height={H} defaultProps={{platform: 'both' as const}} />
  </>
);
