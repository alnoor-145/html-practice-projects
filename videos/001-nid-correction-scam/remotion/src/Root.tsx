import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, TOTAL_SEC, W} from './lib';
import {Video} from './Video';

export const Root: React.FC = () => (
  <Composition id="Video" component={Video} durationInFrames={Math.round(TOTAL_SEC * FPS)} fps={FPS} width={W} height={H} />
);
